<template>
	<div class="slMain">
		<breadcrumb />
		<a-card
			:bordered="false"
			class="content"
		>
			<span
				slot="title"
				class="slTitle"
			>
				填写货转信息
			</span>
			<div class="sub">
				<div class="slTitleAssis">合同信息</div>
				<ContractGl
					:orderId="serialId"
					@changeSignTime="changeSignTime"
					@changeSerialNo="changeSerialNo"
					@changeDeliveryPickUpPlace="changeDeliveryPickUpPlace"
					v-if="orderType == 'ONLINE'"
				/>
				<ContractOff
					:orderId="serialId"
					@changeSerialNo="changeSerialNo"
					@changeSignTime="changeSignTime"
					v-if="orderType == 'OFFLINE'"
				/>
			</div>
			<!-- 1. 如合同无可关联收发货信息；但有可复用上游电子货转，展示“货转信息”模块； -->
			<div
				class="sub"
				v-if="detail.goodsTransferType === 'GOODS_TRANSFER_REFERRED' && orderType == 'ONLINE'"
			>
				<div class="slTitleAssis">
					<a-space :size="17">
						上游货转信息
						<span class="title-tip">
							(此合同未进行收发货操作，系统根据其关联的采购合同获取到以下货转信息，您可以直接复用上游货转信息向下游开具货转)
						</span>
					</a-space>
				</div>
				<Referreds
					ref="referreds"
					:transType="transType || ''"
					:selectIdList="selectIdList"
					@electNoChange="electNoChange"
					:dataSource="goodsTransferDetailInfo.referreds || []"
				/>
			</div>
			<!-- 如果不是无需运输和货转复用展示收发货信息 -->
			<div
				v-else-if="detail.goodsTransferType !== 'NOT_TRANSPORT' && orderType == 'ONLINE'"
				class="sub"
			>
				<div class="slTitleAssis">收发货信息</div>
				<!-- 根据不同的运输方式展示不同的信息 -->
				<!-- 火运 -->
				<div
					class="title-tip"
					v-if="['AUTOMOBILE_AND_TRAIN'].includes(transType)"
				>
					<br />火运信息<br />
				</div>
				<DeliverTrains
					:dataSource="goodsTransferDetailInfo.deliverTrains || []"
					ref="deliverTrains"
					:selectIdList="selectIdList"
					@electNoChange="electNoChange"
					v-if="['TRAIN', 'AUTOMOBILE_AND_TRAIN'].includes(transType)"
				/>
				<!-- 船运 -->
				<DeliverShips
					:dataSource="goodsTransferDetailInfo.deliverShips || []"
					ref="deliverShips"
					:selectIdList="selectIdList"
					@electNoChange="electNoChange"
					v-if="['SHIP'].includes(transType)"
				/>
				<!-- 汽运 -->
				<div
					class="title-tip"
					v-if="['AUTOMOBILE_AND_TRAIN'].includes(transType)"
				>
					汽运信息
				</div>
				<DeliverTrunks
					:dataSource="goodsTransferDetailInfo.receiveTrunks || []"
					ref="receiveTrunks"
					:selectIdList="selectIdList"
					@electNoChange="electNoChange"
					v-if="['AUTOMOBILE', 'AUTOMOBILE_AND_TRAIN'].includes(transType)"
				/>
			</div>
			<!-- 货转证明 -->
			<!-- 如果不是货转复用要开货转证明 -->
			<GoodsTransferIssue
				:signTimeLength="signTimeLength"
				:goodsTransferType="goodsTransferApplyType"
				:transType="transType || ''"
				:selectIdList="selectIdList"
				@offLineCallback="offLineCallback"
				:dataSource="goodsTransferDetailInfo.referreds || []"
				v-if="goodsTransferIssueShow"
				ref="goodsTransferIssue"
			/>
			<div v-if="detail.goodsTransferType === 'GOODS_TRANSFER_REFERRED' && orderType === 'ONLINE'">
				<div class="slTitleAssis">
					<a-space :size="17"> 货转证明 </a-space>
				</div>
				<a-form
					:form="transForm"
					labelAlign="left"
					layout="horizontal"
					class="sign-form-wrap"
				>
					<a-row>
						<a-col :span="8">
							<a-form-item
								label="货转开具日期"
								style="width: 90%"
							>
								<a-date-picker
									:getCalendarContainer="getPopupContainer"
									format="YYYY-MM-DD"
									placeholder="货转开具日期需大于等于上游货转开具日期"
									v-decorator="['signDate', { rules: [{ required: true, message: '货转开具时间必填!' }] }]"
									class="sign-date-wrap"
								/>
							</a-form-item>
						</a-col>
					</a-row>
				</a-form>
			</div>
			<!-- 线下合同走电子需要添加流程审批 -->
			<!-- 线下合同货转复用需要添加流程审批 -->
			<template
				v-if="
					orderType == 'OFFLINE' &&
					isOa &&
					(Method == 'ONLINE_GOODSTRANSFER' || Method === 'REFERRED_GOODS_TRANSFER')
				"
			>
				<div class="slTitleAssis">审批流</div>
				<WorkFlow
					ref="workFlow"
					:auditChainAndOperator="detail.auditChainAndOperator"
				/>
			</template>
			<div class="submit-btn">
				<!-- 如果选择电子货转货转货转复用可以预览 -->
				<a-button
					type="primary"
					ghost
					@click="preView"
					:loading="preViewLoading"
					v-show="Method == 'ONLINE_GOODSTRANSFER' || Method === 'REFERRED_GOODS_TRANSFER'"
				>
					货转预览
				</a-button>
				<a-button
					type="primary"
					ghost
					@click="save"
					:loading="saveLoading"
				>
					保存
				</a-button>
				<a-button
					type="primary"
					@click="submit"
					:loading="submitLoading"
				>
					提交
				</a-button>
			</div>
		</a-card>
		<GoodsTransferPreView ref="goodsTransferPreView" />
	</div>
</template>
<script>
import { mapGetters } from 'vuex';
import {
	API_goodsTransferApplyDetail,
	API_goodsTransferDetail,
	API_goodsTransferApplyPreView,
	API_goodsTransferSave,
	API_goodsTransferSubmit,
	API_COMPANYOACHECKV2
} from '@/v2/center/trade/api/goodsTransfer';
import breadcrumb from '@/v2/components/breadcrumb/index';
import WorkFlow from './components/WorkFlow';
import ContractGl from './components/ContractGl';
import ContractOff from './components/ContractOff';
import DeliverTrains from './components/DeliverTrains';
import DeliverShips from './components/DeliverShips';
import DeliverTrunks from './components/DeliverTrunks';
import Referreds from './components/Referreds';
import GoodsTransferIssue from './components/GoodsTransferIssue';
import GoodsTransferPreView from './components/GoodsTransferPreView';
import moment from 'moment';
import { getPopupContainer } from '@/v2/utils/factory.js';
const goodsTransfer = {
	deliverShips: null,
	deliverTrains: null,
	receiveTrunks: null,
	referreds: null
}; //所有收发货方式
export default {
	data() {
		return {
			orderType: this.$route.query.orderType || 'ONLINE', //合同类型
			serialNo: this.$route.query.serialNo, //订单编号
			serialId: this.$route.query.serialId, //订单ID，合同ID
			goodsTransferNo: this.$route.query.goodsTransferNo, //货转编号
			isOa: false,
			detail: {},
			goodsTransferApplyType: '', // 货转方式
			transType: '', //运输方式
			selectNoList: [], //选中的收发货批次号
			goodsTransferIssue: null, //货转证明
			preViewLoading: false,
			saveLoading: false,
			submitLoading: false,
			signTimeLength: [], //签订时间范围
			transForm: this.$form.createForm(this, { name: 'transForm' }),
			selectTransDate: null
		};
	},
	watch: {
		detail(val) {
			let transType = '';
			if (val) {
				transType = val.transType;
				if (this.orderType == 'ONLINE' && val.transType4online) {
					transType = val.transType4online;
				} else if (this.orderType == 'OFFLINE' && val.transType4offline) {
					transType = val.transType4offline;
				}
			}
			this.transType = transType;
		},
		transType(val) {
			this.$nextTick(() => {
				if (this.goodsTransferIssue) {
					this.goodsTransferIssue.transType = val;
				}
			});
		}
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		isBelongTieRui() {
			return this.VUEX_ST_COMPANYSUER?.company?.group?.code === 'JT0051';
		},
		Method() {
			//货转开具方式，电子线下
			let goodsTransferIssue = this.goodsTransferIssue;
			if (goodsTransferIssue) {
				return goodsTransferIssue.Method;
			} else {
				return '';
			}
		},
		//收发货信息
		goodsTransferDetailInfo() {
			return this.detail.goodsTransferDetailInfo || {};
		},
		//默认选中
		selectIdList() {
			return this.detail.goodsTransferDetailInfoSelectIdList || [];
		},
		//提交保存时默认参数
		defaultParams() {
			let { orderType, serialNo, goodsTransferNo } = this;
			let goodsTransferIssueMethod = '';
			//如果是电子合同基于货转开具，开具方式默认电子货转
			if (this.detail.goodsTransferType === 'GOODS_TRANSFER_REFERRED' && this.$route.query.orderType === 'ONLINE') {
				goodsTransferIssueMethod = 'ONLINE_GOODSTRANSFER';
			}
			return {
				orderType, //合同类型
				serialNo, //电子合同：orderNo，线下合同：contractNo
				goodsTransferNo, //货转编号新建、预览时为空，更新时不为空
				goodsTransferIssueMethod
			};
		},
		// 货转证明模块是否展示
		goodsTransferIssueShow() {
			return (this.detail.goodsTransferType !== 'GOODS_TRANSFER_REFERRED' && this.orderType === 'ONLINE') || (this.orderType === 'OFFLINE')
		}
	},
	components: {
		breadcrumb,
		WorkFlow,
		ContractGl,
		ContractOff,
		DeliverTrains,
		DeliverShips,
		DeliverTrunks,
		Referreds,
		GoodsTransferIssue,
		GoodsTransferPreView
	},
	async created() {
		await this.checkIsOa();
	},
	async mounted() {
		//如果存在货转编号，测试修改合同查询货转详情，否则是新建，从合同信息中查询
		if (this.orderType && this.serialNo) {
			//被选中的合同详情
			await this.getDetail();
		}
		if (this.goodsTransferNo) {
			await this.getTransferDetail();
		}
	},
	methods: {
		getPopupContainer,
		//判断是否对接OA
		checkIsOa() {
			API_COMPANYOACHECKV2({ bizType: 'GOODS_TRANSFER' }).then(res => {
				if (res.success) {
					this.isOa = res.result;
				}
			});
		},
		//changeSerialNo如果没有订单好，依赖详情返回
		changeSerialNo(val) {
			if (!this.serialNo) {
				this.serialNo = val;
				this.getDetail();
			}
		},
		// 获取选择的货转开具日期
		getTransSelectDate(ids = []) {
			const list = this.goodsTransferDetailInfo.referreds || [];
			const selectId = ids[0];
			if (selectId && list.length) {
				this.selectTransDate = list.filter(item => item.serialNo === selectId)[0].signDate;
			}
		},
		disabledDate(current) {
			if (this.selectTransDate) {
				return current && current < moment(this.selectTransDate).endOf('day');
			}
			return null;
		},
		//货转信息变更
		electNoChange(val) {
			for (let k in goodsTransfer) {
				if (this.$refs[k]) {
					this.$refs[k].selectedRows = [];
				}
			}
			this.$refs[val.ref].selectedRows = val.data;
			this.selectNoList = val.data;
			this.getTransSelectDate(val.data);
		},
		// 线下合同-选中复用上游货转的货转信息后的回调函数
		offLineCallback(val) {
			this.selectNoList = val.data;
			this.getTransSelectDate(val.data);
		},
		//获取货转详情信息
		async getTransferDetail() {
			let { goodsTransferNo } = this;
			let res = await API_goodsTransferDetail({ goodsTransferNo });
			if (res.success) {
				this.detail = res.data;
				this.serialId = this.detail.serialId;
				this.serialNo = this.detail.serialNo;
				this.orderType = this.detail.contractType;
				this.selectNoList = this.detail.goodsTransferDetailInfoSelectIdList || [];
				this.getTransSelectDate(this.selectNoList);
				//反向渲染数据
				this.$nextTick(() => {
					if (this.$refs.goodsTransferIssue) {
						let form = {
							goodsTransferIssueMethod: this.detail.goodsTransferIssueMethod,
							goodsTransferQuantity: this.detail.goodsTransferQuantity,
							signDate: this.detail.signDate,
							...this.detail.detailNotTransport
						};
						// 铁瑞展示
						if (this.isBelongTieRui && this.detail.goodsTransferIssueMethod === 'OFFLINE_GOODSTRANSFER') {
							form.signStatus = this.detail.signStatus
						}
						this.$refs.goodsTransferIssue.form.setFieldsValue(form);
						//如果是无需运输，电子货转附件类型为货转数量凭证
						if (this.detail.goodsTransferType == 'NOT_TRANSPORT' && form.goodsTransferIssueMethod == 'ONLINE_GOODSTRANSFER') {
							this.$refs.goodsTransferIssue.fileInfoList2 = this.detail.fileInfoList;
						} else if (form.goodsTransferIssueMethod == 'OFFLINE_GOODSTRANSFER') {
							//线下货转
							this.$refs.goodsTransferIssue.fileInfoList1 = this.detail.fileInfoList;
						}
						this.goodsTransferIssue = this.$refs.goodsTransferIssue;
					}
					if (this.transForm) {
						this.transForm.setFieldsValue({
							signDate: this.detail.signDate ? moment(this.detail.signDate) : null
						});
					}
				});
			}
		},
		//获取合同货转详情
		getDetail() {
			let { orderType, serialNo } = this;
			API_goodsTransferApplyDetail({ orderType, serialNo }).then(res => {
				if (res.success) {
					this.detail = res.data;
					this.goodsTransferApplyType = res.data?.goodsTransferType
					this.$nextTick(() => {
						if (this.$refs.goodsTransferIssue) {
							this.goodsTransferIssue = this.$refs.goodsTransferIssue;
						}
					});
				}
			});
		},
		//限制开具日期范围
		changeSignTime(arr) {
			this.signTimeLength = arr;
		},
		//设置默认交货地点
		changeDeliveryPickUpPlace(str) {
			this.$nextTick(() => {
				if (this.goodsTransferIssue) {
					this.goodsTransferIssue.form.setFieldsValue({ deliveryPlace: str });
				}
			});
		},
		//保存
		save() {
			//拼接数据
			let params = {};
			if (this.goodsTransferIssue) {
				params = { ...this.goodsTransferIssue.save() };
			}
			params.goodsTransferDetailInfoSelectNoList = this.selectNoList;
			params = { ...this.defaultParams, ...params };
			if (this.$refs.workFlow) {
				params = { ...params, ...this.$refs.workFlow.handleSave() };
			}
			this.saveLoading = true;
			const signDate = this.transForm.getFieldValue('signDate');
			if (signDate) {
				params.signDate = moment(signDate).format('YYYY-MM-DD');
			}
			if (this.goodsTransferApplyType === 'GOODS_TRANSFER_REFERRED' && params.goodsTransferIssueMethod !== 'REFERRED_GOODS_TRANSFER') {
				params.goodsTransferDetailInfoSelectNoList = [];
			} else {
				params.goodsTransferDetailInfoSelectNoList = this.selectNoList;
			}
			API_goodsTransferSave({
				...params
			})
				.then(res => {
					if (res.success) {
						this.$message.success('保存成功');
						// this.$router.back();
						this.$router.push('/center/transfer/goodsTransfer/list');
					}
				})
				.finally(() => {
					this.saveLoading = false;
				});
		},
		//rules校验数据
		async rulesParams() {
			// 电子合同
			//如果他的类型不是无须运输，需要选择收发货信息
			if (!this.selectNoList?.length && this.orderType === 'ONLINE') {
				if (this.detail.goodsTransferType !== 'NOT_TRANSPORT') {
					//获取选中的批次号
					let message = '请选择收发货信息';
					//如果时基于货转开具
					if (this.detail.goodsTransferType === 'GOODS_TRANSFER_REFERRED') {
						message = '请选择货转信息';
					}
					this.$message.error(message);
					return false;
				}
			}
			let paramsList = [];
			if (this.goodsTransferIssue) {
				paramsList.push(this.goodsTransferIssue.submit());
			}
			if (this.$refs.workFlow) {
				paramsList.push(this.$refs.workFlow.handleSubmit());
			}
			return new Promise(resolve => {
				Promise.all(paramsList).then(res => {
					if (!res.includes(false)) {
						// 线下合同--若选择了货转开具方式再校验是否有货转数据
						if (!this.selectNoList?.length && this.orderType === 'OFFLINE') {
							let message = '';
							if (this.Method === 'REFERRED_GOODS_TRANSFER') {
								message = '请选择货转信息';
								this.$message.error(message);
								return
							}
						}
						let params = { ...this.defaultParams };
						res.map(item => {
							params = { ...params, ...item };
						});
						if (this.goodsTransferApplyType === 'GOODS_TRANSFER_REFERRED' && params.goodsTransferIssueMethod !== 'REFERRED_GOODS_TRANSFER' && this.$route.query.orderType === 'OFFLINE') {
							params.goodsTransferDetailInfoSelectNoList = [];
						} else {
							params.goodsTransferDetailInfoSelectNoList = this.selectNoList;
						}
						resolve(params);
					} else {
						resolve(false);
					}
				});
			});
		},
		// 货转证明校验
		validateTransProve() {
			return new Promise((resolve, reject) => {
				this.transForm.validateFieldsAndScroll((err, value) => {
					if (err) {
						reject(err);
					}
					const { signDate } = value;
					if (moment(signDate) < moment(this.selectTransDate).subtract(1, 'days').endOf('day')) {
						this.transForm.setFields({
							['signDate']: {
								value: signDate,
								errors: [
									{
										message: '下游货转的货转日期不能早于上游货转的货转日期，请修改',
										field: 'signDate'
									}
								]
							}
						});
						reject(err);
					}
					resolve(value);
				});
			});
		},
		//提交
		async submit() {
			let params = await this.rulesParams();
			try {
				await this.validateTransProve();
			} catch (error) {
				return;
			}
			if (params) {
				this.submitLoading = true;
				const signDate = this.transForm.getFieldValue('signDate');
				if (signDate) {
					params.signDate = moment(signDate).format('YYYY-MM-DD');
				}
				API_goodsTransferSubmit({
					...params
				})
					.then(res => {
						if (res.success) {
							this.$message.success('提交成功');
							// this.$router.back();
							this.$router.push('/center/transfer/goodsTransfer/list');
						}
					})
					.finally(() => {
						this.submitLoading = false;
					});
			}
		},
		//货转预览
		async preView() {
			let params = await this.rulesParams();
			if (params) {
				this.preViewLoading = true;
				const signDate = this.transForm.getFieldValue('signDate');
				if (signDate) {
					params.signDate = moment(signDate).format('YYYY-MM-DD');
				}
				API_goodsTransferApplyPreView({
					...params
				})
					.then(res => {
						if (res.success && res.data) {
							this.$refs.goodsTransferPreView.show(res.data);
						}
					})
					.finally(() => {
						this.preViewLoading = false;
					});
			}
		}
	}
};
</script>
<style lang="less" scoped>
.submit-btn {
	text-align: center;
	margin-top: 40px;
	margin-bottom: 10px;
	.ant-btn {
		margin: 0 10px;
		padding: 0 43px;
		height: 38px;
	}
}
.sub {
	margin-bottom: 30px;
	.slTitleAssis {
		margin: 0 0 20px;
	}
	.title-tip {
		font-weight: 400;
		font-size: 14px;
		line-height: 14px;
		color: #77889d;
	}
}
.slMain {
	/deep/ .ant-card-head .ant-card-head-title {
		border-bottom: 1px solid #e5e6eb;
		padding-bottom: 20px;
		margin-bottom: 30px;
	}
}
.sign-date-wrap {
	/deep/ .ant-calendar-picker-container {
		width: 100%;
	}
	/deep/ .ant-calendar {
		width: 100%;
	}
}
.sign-form-wrap {
	margin-top: 20px;
	.ant-col {
		height: 82px;
	}
	/deep/ .ant-form-item-label {
		line-height: 20px;
		margin-bottom: 10px;
	}
	/deep/ label {
		color: rgba(0, 0, 0, 0.4);
		line-height: 20px;
	}
	/deep/ .ant-form-item-control {
		line-height: normal;
	}
}
</style>
