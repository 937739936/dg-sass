<template>
	<div class="slMain">
		<breadcrumb />
		<div>
			<a-card
				:bordered="false"
				class="content"
			>
				<div class="slTitle">
					<span>{{ meta.title }}</span>
				</div>
				<ContractOnlineDetail
					:info="{
						contractInfo,
						statementInfo,
						saveReq,
						buyerCreatedFlag
					}"
				/>
			</a-card>
			<a-card
				:bordered="false"
				class="content"
				:style="!confirm ? 'padding-top: 12px' : 'padding-top: 0px'"
			>
				<a-tabs
					v-if="!confirm"
					v-model="active"
				>
					<a-tab-pane
						key="1"
						tab="结算单信息"
					>
					</a-tab-pane>
					<a-tab-pane
						key="2"
						:tab="`结算单操作记录(${operateLogList.length || 0})`"
					>
					</a-tab-pane>
				</a-tabs>
				<div
					style="width: 100%; padding-top: 30px"
					v-show="active == 1"
				>
					<div class="sub">
						<div class="slTitleAssis">结算货物</div>
						<!-- 如果有发运信息，展示发运信息板块，否则判断是否有货转信息，展示货转信息板块 -->
						<DeliverDto
							:dataSource="deliverBatchWithDeliverInfosID"
							disabled
							ref="deliverDto"
							v-if="deliverBatchWithDeliverInfosID.length"
						/>
						<GoodsTransfer
							:dataSource="goodsTransferWithDeliverBatchInfosID"
							disabled
							ref="goodsTransfer"
							v-else-if="goodsTransferWithDeliverBatchInfosID.length"
						/>
						<div
							class="subInfo"
							v-if="deliveryIdList.length || goodsTransferIdList.length"
						>
							<span>已选：</span>
							<template v-if="deliveryIdList.length"> {{ deliveryIdList.length | formatMoney }}个批次 </template>
							<template v-if="goodsTransferIdList.length"> {{ goodsTransferIdList.length | formatMoney }}个货转 </template>
							<template v-if="selectNoListInfo.deliverQuantity || selectNoListInfo.receiveQuantity">
								<span>，票重：</span>
								{{ selectNoListInfo.deliverQuantity | formatMoney(4) }}吨
								<span>，衡重：</span>
								{{ selectNoListInfo.receiveQuantity | formatMoney(4) }}吨
							</template>
							<template v-if="selectNoListInfo.trainNum">
								<span>，车数：</span>
								{{ selectNoListInfo.trainNum | formatMoney }}
							</template>
							<template v-if="selectNoListInfo.goodsTransferQuantity">
								<span>，货转数量：</span>
								{{ selectNoListInfo.goodsTransferQuantity | formatMoney(4) }}吨
							</template>
						</div>
					</div>
					<div class="sub">
						<div class="slTitleAssis">结算信息</div>
						<SettleOnlineInfoDetail
							:info="{
								contractInfo,
								receiveIndicators,
								invoice,
								statementInfo,
								transType: selectNoListInfo.info,
								saveReq
							}"
						/>
					</div>
					<div class="sub">
						<div class="slTitleAssis">附件</div>
						<a-table
							:columns="filesColumns"
							class="new-table-file"
							:bordered="false"
							rowKey="id"
							:scroll="{ x: true }"
							:dataSource="attachList"
							:pagination="false"
						>
							<template
								slot="action"
								slot-scope="text, item"
							>
								<a-space :size="20">
									<a
										href="javascript:;"
										@click="fileLook(item)"
										>查看</a
									>
									<a
										href="javascript:;"
										@click="fileDown(item)"
										>下载</a
									>
								</a-space>
							</template>
						</a-table>
					</div>
				</div>
				<div
					style="width: 100%; padding-top: 30px"
					v-show="active == 2"
				>
					<a-table
						:columns="auditLogListColumns"
						class="new-table"
						:bordered="false"
						rowKey="id"
						:scroll="{ x: true }"
						:dataSource="operateLogList"
						:pagination="false"
					>
					</a-table>
				</div>
			</a-card>
		</div>
		<div
			class="submit-btn"
			v-if="confirm"
		>
			<a-button
				type="primary"
				ghost
				@click="back"
			>
				取消
			</a-button>
			<a-button
				type="primary"
				ghost
				@click="receiverReject"
			>
				驳回
			</a-button>
			<a-button
				type="primary"
				@click="receiverConfirm"
			>
				确认
			</a-button>
		</div>
		<modalBack
			ref="modalBack"
			title="确认驳回?"
			width="440px"
			:loading="modalLoading"
			@verify="modalBackOK"
		>
			<div class="modalBack">
				<div class="tip">驳回后，如再需签结算单，则需要重新走流程，如确需驳回，请继续操作</div>
				<a-form :form="form">
					<a-form-item>
						<a-textarea
							:maxLength="200"
							class="textarea"
							placeholder="请输入驳回原因，最多200字"
							v-decorator="[
								'reason',
								{
									rules: [
										{
											required: true,
											message: '驳回原因必填',
											whitespace: true
										}
									]
								}
							]"
						/>
					</a-form-item>
				</a-form>
			</div>
		</modalBack>
		<modalInfo
			ref="modalInfo"
			@verify="modalInfoOK"
			:loading="modalLoading"
			title="结算单确认"
			tip="确定要进行结算单确认吗？"
		/>
		<WorkFlowModal
			ref="workFlowModal"
			v-if="OAAuditOption.existOA"
			v-on:submit="modalMainOK"
			desc="你的企业已对接OA，请确认流程发起人，提交后将推送OA审批"
			showTip
			:repeatOA="targetOA"
			:auditChainAndOperator="OAAuditOption.auditChainAndOperator"
		/>
		<modalInfo
			ref="modalInfoSeal"
			title="是否进行盖章"
			tip="结算单已确认，需要盖章，是否现在进行盖章？"
			cancelText="稍后盖章"
			okText="现在去盖章"
			@close="back"
			@verify="modalInfoSeal"
			:loading="modalLoading"
		/>
		<modalInfo
			ref="modalInfoOk"
			:width="283"
			title="提示"
			:tip="tip"
			@close="back"
			:footer="false"
		/>
		<FileLook ref="fileLook" />
	</div>
</template>
<script>
import { mapGetters } from 'vuex';
import WorkFlowModal from '@/v2/center/trade/components/WorkFlowModal.vue';
import breadcrumb from '@/v2/components/breadcrumb/index';
import modalInfo from '@/v2/components/modalInfo/info';
import modalBack from '@/v2/components/modalInfo/back';
import FileLook from '@/v2/components/fileTable/FileLook';
import {
	API_GETSETTLEDETAIL,
	API_POSTSETTLETEreceiverConfirm,
	API_POSTSETTLETEreceiverReject
} from '@/v2/center/trade/api/settle';
import ContractOnlineDetail from './components/ContractOnlineDetail';
import DeliverDto from './components/DeliverDto';
import GoodsTransfer from './components/GoodsTransfer';
import SettleOnlineInfoDetail from './components/SettleOnlineInfoDetail';
import { filesColumns, auditLogListColumns } from './columns/columns.js';
export default {
	components: {
		breadcrumb,
		modalInfo,
		modalBack,
		ContractOnlineDetail,
		DeliverDto,
		GoodsTransfer,
		SettleOnlineInfoDetail,
		WorkFlowModal,
		FileLook
	},
	data() {
		let { meta, query } = this.$route;
		return {
			filesColumns,
			id: query?.id,
			auditLogListColumns,
			data: {
				buyerCreatedFlag: false, //是否买方创建
				saveReq: {}, //提交的参数
				// 合同信息
				contractInfo: {},
				//填写的煤种指标信息
				receiveIndicators: [],
				//开票信息
				invoice: {},
				//结算单信息
				statementInfo: {},
				//发运信息
				deliverBatchWithDeliverInfos: [],
				goodsTransferWithDeliverBatchInfos: [], //货转信息
				attachList: [], //附件信息
				operateLogList: [] //结算单操作记录
			}, //接口数据返回信息
			meta, //获取title
			active: '1', //默认展示的信息，结算
			deliveryIdList: [], //选中的收发货id集合
			goodsTransferIdList: [], //货转ID集合
			form: this.$form.createForm(this),
			params: {},
			tip: '', //签章提示
			modalLoading: false //弹框loading状态
		};
	},
	watch: {},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		type() {
			//判断采购还是销售
			let { meta } = this;
			return meta?.type || '';
		},
		confirm() {
			//是否是合同确认
			let { meta } = this;
			return meta?.confirm || false;
		},
		//提交的参数
		saveReq() {
			return this.data.saveReq || {};
		},
		//是否买方创建
		buyerCreatedFlag() {
			return this.data.buyerCreatedFlag || false;
		},
		//合同信息
		contractInfo() {
			return this.data.contractInfo || {};
		},
		//填写的煤种指标信息
		receiveIndicators() {
			return this.data.receiveIndicators || [];
		},
		//开票信息
		invoice() {
			return this.data.invoice || {};
		},
		//结算单信息
		statementInfo() {
			return this.data.statementInfo || {};
		},
		//发运信息
		deliverBatchWithDeliverInfos() {
			return this.data.deliverBatchWithDeliverInfos || [];
		},
		//选中的发运信息
		deliverBatchWithDeliverInfosID() {
			return this.deliverBatchWithDeliverInfos
				.map(item => item.deliverBatch)
				.filter(item => this.deliveryIdList.includes(item.id));
		},
		//货转信息
		goodsTransferWithDeliverBatchInfos() {
			return this.data.goodsTransferWithDeliverBatchInfos || [];
		},
		//选中的货转信息
		goodsTransferWithDeliverBatchInfosID() {
			return this.goodsTransferWithDeliverBatchInfos
				.map(item => item.goodsTransfer)
				.filter(item => this.goodsTransferIdList.includes(item.id));
		},
		//附件信息
		attachList() {
			return this.data.attachList || [];
		},
		//操作日志
		operateLogList() {
			return this.data.operateLogList || [];
		},
		selectNoListInfo() {
			//统计选中运输方式，票重，衡重，车数,货转数量,所有批次
			let deliverQuantity = 0,
				receiveQuantity = 0,
				trainNum = 0,
				goodsTransferQuantity = 0,
				info = {
					ships: [], //船运
					trains: [], //火运
					trucks: [], //汽运
					none: [] //不涉及运输方式
				};
			//发货批次
			if (this.deliveryIdList?.length) {
				//发运信息板块
				this.deliverBatchWithDeliverInfos.map(item => {
					//批次信息
					let { deliverBatch } = item;
					if (this.deliveryIdList.includes(deliverBatch.id)) {
						deliverQuantity += Number(deliverBatch.deliverQuantity);
						receiveQuantity += Number(deliverBatch.receiveQuantity);
						trainNum += Number(deliverBatch.trainNum) || 0;
						//处理展示信息
						info = this.infoHandle(info, item);
					}
				});
			} else if (this.goodsTransferIdList?.length) {
				//货转信息板块
				this.goodsTransferWithDeliverBatchInfos.map(item => {
					//货转信息
					let { goodsTransfer, deliverBatches } = item;
					//如果当前货转被选择
					if (this.goodsTransferIdList.includes(goodsTransfer.id)) {
						//如果货转类型是复用货转，找批次信息
						if (goodsTransfer.goodsTransferType == 'GOODS_TRANSFER_REFERRED') {
							deliverBatches?.map(items => {
								let { deliverBatch } = items;
								deliverQuantity += Number(deliverBatch.deliverQuantity);
								receiveQuantity += Number(deliverBatch.receiveQuantity);
								trainNum += Number(deliverBatch.trainNum) || 0;
							});
						} else {
							//货转找对应的货转信息
							goodsTransferQuantity += Number(goodsTransfer.goodsTransferQuantity);
						}
						//处理展示信息
						//无需运输没有批次，单独判断处理
						if (goodsTransfer.transportMode == 'NONE') {
							info = this.infoHandle(info, item);
						} else {
							deliverBatches?.map(items => {
								info = this.infoHandle(info, items);
							});
						}
					}
				});
			}
			return {
				deliverQuantity,
				receiveQuantity,
				trainNum,
				goodsTransferQuantity,
				info
			};
		},
		OAAuditOption() {
			//校验是否对接OA
			let OAAuditOption = {};
			if (this.type == 'buy') {
				OAAuditOption = this.contractInfo?.buyerOAAuditOption || {};
			} else if (this.type == 'sell') {
				OAAuditOption = this.contractInfo?.sellerOAAuditOption || {};
			}
			return OAAuditOption;
		},
		//对手方是否对接OA(取发起方审批流)
		showTip() {
			if (this.saveReq?.originatorAuditChain) {
				return true;
			} else {
				return false;
			}
		},
		//对手方OA流程审批列表(取发起方审批流)
		targetOA() {
			if (this.showTip) {
				return this.saveReq.originatorAuditChain?.operatorInfo || [];
			} else {
				return [];
			}
		}
	},
	//进入页面前判断数据
	async beforeRouteEnter(to, from, next) {
		let { query, meta } = to;
		let { id } = query;
		let { type } = meta;
		if (id) {
			let res = await API_GETSETTLEDETAIL({ statementId: id });
			if (res.success) {
				let data = res.data;
				let { orderType } = data.contractInfo;
				orderType = orderType.toLowerCase();
				//判断合同类型和将进入页面是否一致，一致直接进入，不一致转到对应页面
				if (type == orderType) {
					await next(t => {
						t.setDetail(data);
					});
				} else {
					let path = to.path.replace(type, orderType);
					next({
						path,
						query
					});
				}
			}
		}
	},
	async created() {
		//被选中的合同详情
		// await this.getDetail();
	},
	async mounted() {},
	methods: {
		//运输方式信息处理
		infoHandle(info, item) {
			let { deliverBatch, ships, goodsTransfer } = item;
			let transTypeObj = {
				SHIP: 'ships', //船运
				TRAIN: 'trains', //火运
				AUTOMOBILE: 'trucks', //汽运
				NONE: 'none' //不涉及运输方式
			};
			//从批次中获取发运信息，没有批次的为货转无需运输，取货转数据
			let despatchType = deliverBatch?.despatchType || goodsTransfer?.transportMode;
			let key = transTypeObj[despatchType];
			//记录运输方式，不同的运输方式展示不同的内容,船运信息记录所有的船舶数据，火运汽运做统计数据
			if (despatchType == 'SHIP') {
				ships.map(items => {
					info[key].push([
						{ value: deliverBatch.despatchTypeDesc, name: '运输方式' },
						{ value: items.shipName, name: '船舶名称' },
						{
							value: items.deliverQuantity,
							name: '装货量(吨)',
							type: 'number'
						},
						{ value: items.originPortName, name: '装港' },
						{ value: items.destinationPortName, name: '卸港/交货港' }
					]);
				});
			} else {
				let Arr = [];
				// 火运汽运做统计数据，只有一组数据
				if (despatchType == 'TRAIN' || despatchType == 'AUTOMOBILE') {
					if (!info[key][0]) {
						info[key][0] = [{ value: deliverBatch.despatchTypeDesc, name: '运输方式' }];
					}
					Arr = [
						...info[key][0],
						{
							value: Number(deliverBatch.deliverQuantity),
							name: '票重(吨)',
							type: 'number'
						},
						{
							value: Number(deliverBatch.receiveQuantity),
							name: '衡重(吨)',
							type: 'number'
						},
						{
							value: Number(deliverBatch.trainNum),
							name: '车数',
							type: 'number'
						}
					];
				} else if (despatchType == 'NONE') {
					//不涉及货转运输方式时,货转中出现
					if (!info[key][0]) {
						info[key][0] = [{ value: goodsTransfer.transportModeDesc, name: '运输方式' }];
					}
					Arr = [
						...info[key][0],
						{
							value: goodsTransfer.deliveryPlace,
							name: '交货地点'
						},
						{
							value: goodsTransfer.receiverName,
							name: '收货人'
						}
					];
				}
				Arr = Arr.map(items => {
					let i = Arr.find(itemss => itemss.name === items.name);
					if (i !== items) {
						if (i.type == 'number') {
							i.value += items.value;
						} else {
							i.value += `、${items.value || '-'}`;
						}
						return undefined;
					} else {
						return i;
					}
				}).filter(items => items);
				info[key][0] = [...Arr];
			}
			return info;
		},
		//获取详情
		async getDetail() {
			if (this.id) {
				let res = await API_GETSETTLEDETAIL({ statementId: this.id });
				if (res.success) {
					let data = res.data;
					let { saveReq } = data;
					this.data = { ...data };
					this.params = saveReq || {}; //保存提交的参数
					this.deliveryIdList = saveReq.deliveryIdList || []; //选中的收发货id集合
					this.goodsTransferIdList = saveReq.goodsTransferIdList || []; //货转ID集合
				}
			}
		},
		//设置详情
		setDetail(data) {
			let { saveReq } = data;
			this.data = { ...data };
			this.params = saveReq || {}; //保存提交的参数
			this.deliveryIdList = saveReq.deliveryIdList || []; //选中的收发货id集合
			this.goodsTransferIdList = saveReq.goodsTransferIdList || []; //货转ID集合
		},
		//返回
		back() {
			this.$router.back();
		},
		//驳回
		receiverReject() {
			this.$refs.modalBack.open();
		},
		//驳回确认
		modalBackOK() {
			this.form.validateFields(async (err, values) => {
				if (!err) {
					this.modalLoading = true;
					let res = await API_POSTSETTLETEreceiverReject({
						id: this.id,
						...values
					});
					this.modalLoading = false;
					if (res.success) {
						this.$refs.modalBack.close();
						this.back();
					}
				}
			});
		},
		//确认
		receiverConfirm() {
			this.$refs.modalInfo.open();
		},
		//结算单确认
		modalInfoOK() {
			//校验是否对接OA
			if (this.OAAuditOption?.existOA) {
				this.$refs.workFlowModal.showModal();
				this.$refs.modalInfo.close();
			} else {
				this.postConfirm();
			}
		},
		//OA提交确认
		modalMainOK(data) {
			let params = {};
			if (data) {
				params.auditChain = data;
				params.skipOAAudit = false;
			} else {
				//跳过OA审批
				params.skipOAAudit = true;
			}
			this.postConfirm(params);
		},
		//确认提交
		async postConfirm(params) {
			this.modalLoading = true;
			let res = await API_POSTSETTLETEreceiverConfirm({
				id: this.id,
				...params
			});
			this.modalLoading = false;
			this.$refs.modalInfo.close();
			if (res.success) {
				//判断是否对接OA
				if (this.OAAuditOption?.existOA) {
					this.$message.success('结算单已提交审核');
					this.back();
				} else {
					let data = res.data;
					//判断是否签章提示
					if (data?.msg) {
						//如果不是签章员,提示联系签章员
						this.tip = data.msg;
						this.$refs.modalInfoOk.open();
					} else {
						//如果签章员,提示是否签章
						this.$refs.modalInfoSeal.open();
					}
				}
			}
		},
		//跳转到盖章
		modalInfoSeal() {
			//replace防止返回时返回详情页
			this.$router.replace({
				path: '/center/settle/buy/onlineseal',
				query: {
					id: this.id
				}
			});
		},
		//查看附件
		fileLook(item) {
			this.$refs.fileLook.fileLook(item);
		},
		//下载附件
		fileDown(item) {
			this.$refs.fileLook.fileDown(item);
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
.slMain {
	/deep/ .ant-card-head .ant-card-head-title {
		border-bottom: 1px solid #e5e6eb;
		padding-bottom: 20px;
		margin-bottom: 30px;
	}
	.content {
		padding: 30px;
		margin-bottom: 20px;
		&:last-child {
			margin: 0;
		}
		.slTitle {
			color: rgba(0, 0, 0, 0.8);
			font-size: 24px;
			font-style: normal;
			font-weight: 500;
			line-height: normal;
			margin-bottom: 30px;
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
			.subInfo {
				font-family: PingFang SC;
				font-size: 14px;
				font-weight: 500;
				line-height: 20px;
				letter-spacing: 0px;
				text-align: left;
				color: rgba(0, 0, 0, 0.8);
				span {
					color: rgba(0, 0, 0, 0.4);
				}
			}
		}
	}

	.submit-btn {
		position: sticky;
		bottom: 0;
		padding: 20px;
		background: #ffffff;
		text-align: center;
		z-index: 100;
		.ant-btn {
			margin: 0 15px;
			padding: 0 30px;
			border-radius: 6px;
			border: 1px solid @primary-color;
		}
	}
}
.modalBack {
	.tip {
		color: rgba(0, 0, 0, 0.25);
		font-size: 14px;
		line-height: normal;
		margin-bottom: 16px;
	}
	.textarea {
		width: 450px;
		height: 150px !important;
		font-size: 14px;
		line-height: 20px;
		padding: 16px 14px;
		background: #f3f5f6;
		color: rgba(0, 0, 0, 0.8);

		&::-webkit-input-placeholder {
			color: #8191a9;
		}
	}
}
</style>
