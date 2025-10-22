<template>
	<div class="slMain">
		<Breadcrumb />
		<a-card :bordered="false">
			<div class="methods-wrap">
				<span
					slot="title"
					class="slTitle"
					>新增收货证明</span
				>
			</div>
			<div class="slTitleAssis">合同信息</div>
			<ul
				class="grid-wrap"
				v-if="contractInfo"
			>
				<li>
					<span class="label">合同编号</span>
					<span>
						<div
							style="display: inline-block"
							class="contract-box"
						>
							<TextOverFlow
								:content="contractInfo.contractNo"
								:maxWidth="maxWidth"
								@clickFunc="viewContractDetail"
							/>
						</div>
					</span>
				</li>
				<li>
					<span class="label">卖方企业</span>
					<TextOverFlow
						:content="contractInfo.sellerName"
						:maxWidth="maxWidth"
					/>
				</li>
				<li>
					<span class="label">买方企业</span>
					<TextOverFlow
						:content="contractInfo.buyerName"
						:maxWidth="maxWidth"
					/>
				</li>
				<li>
					<span class="label">品名</span>
					<TextOverFlow
						:content="contractInfo.goodsName"
						:maxWidth="maxWidth"
					/>
				</li>
				<li>
					<span class="label"> 基准价格</span>
					<TextOverFlow
						:content="contractPriceShow()"
						:maxWidth="maxWidth"
					/>
				</li>
				<li>
					<span class="label">合同数量</span>
					<span
						>{{ contractInfo.quantity | formatMoney(3) }}吨
						<template v-if="contractInfo.quantityOffset">（±{{ contractInfo.quantityOffset }}%）</template>
					</span>
				</li>
				<li>
					<span class="label">交货期限</span>
					<span>{{ contractInfo.startDate }}至{{ contractInfo.endDate }}</span>
				</li>
				<li>
					<span class="label">运输方式</span>
					<span>{{ contractInfo.transportModeDesc || '无' }}</span>
				</li>
				<li>
					<span class="label">收货人</span>
					<TextOverFlow
						v-if="contractInfo.consigneeCompanyName"
						:content="contractInfo.consigneeCompanyName"
						:maxWidth="maxWidth"
					/>
					<span v-else>-</span>
				</li>
			</ul>
			<div style="display: flex">
				<div class="slTitleAssis">出库信息</div>
				<a-button
					style="width: 90px; height: 32px; margin-left: 20px; margin-top: 25px"
					type="primary"
					:ghost="true"
					@click="updateOutInfos"
					>修改信息
				</a-button>
			</div>

			<div class="table-box">
				<a-table
					:columns="outBoundColumns"
					class="new-table"
					:bordered="false"
					rowKey="id"
					:dataSource="outBoundDatas || []"
					:pagination="false"
					:scroll="{ x: true }"
				>
					<template
						slot="outboundNo "
						slot-scope="text, record"
					>
						<div
							style="display: inline-block"
							class="contract-box"
							@click="clickOutBoundDetail(record)"
						>
							<span style="color: red; size: 20px">text</span>
						</div>
					</template>

					<template
						slot="remark"
						slot-scope="text, record"
					>
						<div
							v-for="(item, index) in record.remark"
							:key="index"
						>
							<div style="color: #3377889d; font-size: 12px">{{ item.createdDate }}</div>
							<a-tooltip>
								<template slot="title">
									{{ item.remark }}
								</template>
								<div class="remarkContent">{{ item.remark }}</div>
							</a-tooltip>
						</div>
					</template>
				</a-table>
			</div>

			<div class="slTitleAssis">收货证明</div>

			<a-form
				:form="form"
				class="slFormDetail"
				:colon="false"
			>
				<a-row>
					<a-col :span="8">
						<a-form-item
							label="收货日期"
							class="requiredItem"
						>
							<a-range-picker
								format="YYYY-MM-DD"
								:placeholder="['开始日期', '结束日期']"
								@change="deliverDateChange"
								:disabled-date="disabledDate"
								style="width: 100%"
								v-decorator="[
									`storageDate`,
									{
										rules: [
											{ required: true, message: '收货日期必填' },
											{ validator: (rule, value, callback) => timeValidator(rule, value, callback) }
										]
									}
								]"
							>
								<span
									slot="suffixIcon"
									class="calendar"
								></span>
							</a-range-picker>
						</a-form-item>
					</a-col>
					<a-col :span="8">
						<a-form-item
							label="品名"
							class="requiredItem"
						>
							<a-input
								style="width: 100%"
								:maxLength="100"
								placeholder="请输入品名"
								v-decorator="[
									`goodsName`,
									{
										rules: [
											{ required: true, message: `品名必填` },
											{ min: 1, max: 200, message: `品名长度不能超过200`, trigger: 'blur' }
										],
										validateTrigger: ['blur']
									}
								]"
							/>
						</a-form-item>
					</a-col>
					<a-col :span="8">
						<a-form-item label="收货数量(吨)">
							<a-input-number
								placeholder="请输入收货"
								:min="0.0001"
								:max="99999999.9999"
								v-decorator="[
									`quantity`,
									{
										rules: [{ required: true, message: '收货数量(吨)必填' }]
									}
								]"
							/>
						</a-form-item>
					</a-col>

					<a-col :span="8">
						<a-form-item label="交货地点">
							<a-input
								placeholder="请输入交货地点"
								:getPopupContainer="getPopupContainer"
								@select="changeAccountName"
								v-decorator="[
									'deliveryPlace',
									{
										rules: [
											{ required: true, message: '交货地点必填' },
											{ min: 1, max: 500, message: `长度需要在1和50之间`, trigger: 'blur' }
										]
									}
								]"
								option-label-prop="value"
							>
							</a-input>
						</a-form-item>
					</a-col>
					<a-col
						:span="8"
						class="row"
					>
						<a-form-item
							label="交货方式"
							style="position: relative"
						>
							<a-select
								:getPopupContainer="getPopupContainer"
								@change="handleTypeChange"
								v-decorator="[
									'deliveryMode',
									{
										rules: [{ required: true, message: '交货方式必填' }]
									}
								]"
								placeholder="请选择交货方式"
							>
								<a-select-option
									v-for="item in this.deliverModeList"
									:key="item.value"
									:value="item.value"
									>{{ item.text }}
								</a-select-option>
							</a-select>
						</a-form-item>
					</a-col>
					<a-col :span="8">
						<a-form-item label="收货证明开具日期">
							<a-date-picker
								placeholder="请选择收货证明开具日期"
								format="YYYY-MM-DD"
								value-format="YYYY-MM-DD"
								v-decorator="[
									`openDate`,
									{
										rules: [{ required: true, message: `收货证明开具日期必填` }, { validator: validateDate }]
									}
								]"
							>
							</a-date-picker>
						</a-form-item>
					</a-col>
				</a-row>
			</a-form>
			<div class="slTitleAssis">附件</div>
			<span></span>
			<AttachmentView
				ref="file"
				:dataSource="attachmentDataSource"
				uploadModule="RECEIPT"
			/>
			<div class="slDetailBottom">
				<a-space :size="30">
					<a-button
						type="primary"
						ghost
						@click="cancel"
						>取消</a-button
					>
					<a-button
						type="primary"
						:loading="loadingSubmit"
						:disabled="disabled"
						@click="submit"
						>提交</a-button
					>
				</a-space>
			</div>
		</a-card>
		<!--    <ChooseContract :type="$route.query.type" :orderLineType="orderLineType" ref="chooseContract" @detail="getContractDetail" :orderId="orderId" confirmText="确定"/>-->
		<ConfirmModal
			ref="confirmModal"
			@confirm="confirmFunc"
		/>
		<SelectRecordModal
			ref="selectRecordModal"
			@confirmSelectRecordOutList="confirmSelectRecordOutList"
		/>
	</div>
</template>

<script>
import moment from 'moment';
import Breadcrumb from '@/v2/components/breadcrumb/index';
// import UpdateApprovalProcess from "./components/UpdateApprovalProcess";
import ConfirmModal from '@/v2/components/modal/ConfirmModal';
import SelectRecordModal from './record';
import { API_RefundReceiveAccount } from '@/v2/center/trade/api/pay';
import { filterCodeByKey } from '@sub/utils/globalCode.js';

import { API_DOWNLPREVIEWTE } from '@/v2/center/trade/api/lading';
import { API_SUBMIT_RECEIPT, API_ADD_RECEIPT_DETAIL, API_getReceiptProveDataById } from '@/v2/center/trade/api/newLading';
import { mapGetters } from 'vuex';
import { GetCurrentDateFormat } from '@/v2/utils/factory';
import TextOverFlow from "@sub/components/TextOverflow.vue";
import { getPopupContainer } from '@/v2/utils/factory.js';
import { handleScroll } from '@/v2/utils/factory.js';
import AttachmentView from '../components/AttachmentView';

export default {
	name: 'Detail',
	data() {
		return {
			warehouseToReceivable: false,
			receiveAccList: [],
			outBoundColumns: [],
			receiptParams: {},
			deliverDicts: [],
			outBoundDatas: [],

			deliverType: {},
			deliverModeList: [],
			getPopupContainer,
			loadingSubmit: false,
			form: this.$form.createForm(this),
			refundData: {}, //退款信息
			contractInfo: {}, //合同信息,
			attachments: [], //附件信息
			fileList: [{ type: 'OTEHR', id: '', fileList: [], typeName: '收货凭证' }],
			formValue: {},
			disabledEndDay: null,
			dataObj: {},
			maxWidth: 0, // 信息文案最大宽度
			clientWidth: null, //浏览器尺寸
			disabled: false,
			payBankInfo: [],
			wrongTips: '',
			orderLineType: this.$route.query.orderLineType,
			auditChainAndOperator: null,
			formatValue: '',
			paidAmount: this.$route.query.paidAmount || null,
			receiptFiles: [],
			attachmentList: [
				{
					type: 'SHPZ',
					typeName: '收货凭证',
					required: false,
					acceptFile: ['jpg', 'jpeg', 'png', 'pdf'],
					maxSize: 100
				}
			]
		};
	},
	components: {
		Breadcrumb,
		AttachmentView,
		ConfirmModal,
		TextOverFlow,
		SelectRecordModal

		// UpdateApprovalProcess,
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER',
			VUEX_ST_PERSONALLINFO: 'VUEX_ST_PERSONALLINFO'
		}),
		isCreator() {
			return this.VUEX_ST_COMPANYSUER.company.uscc === this.contractInfo.sellerUscc;
		},
		payBankInfoHasId() {
			return this.payBankInfo.filter(item => {
				return item.id;
			});
		},
		attachmentDataSource: function () {
			let attachVOList = this.receiptFiles ?? [];
			let receiptAttachmentList = [];
			attachVOList.map(file => {
				let tFile = {
					...file,
					id: `${file.id}`,
					name: file.fileName,
					createTime: file.createDate,
					url: file.fileUrl
				};
				if (file.type == 'SHPZ') {
					receiptAttachmentList.push(tFile);
				}
			});
			let dataSource = [
				{
					type: 'SHPZ',
					typeName: '收货凭证',
					required: false,
					acceptFile: ['jpg', 'jpeg', 'png', 'pdf'],
					maxSize: 100,
					attachmentList: receiptAttachmentList
				}
			];
			return dataSource;
		}
	},

	async created() {},
	mounted() {
		this.clientWidth = document.body.clientWidth;
		handleScroll(); // 页面底部按钮区域fixed随页面滚动
		window.onresize = () => {
			//屏幕尺寸变化就重新赋值
			return (() => {
				this.clientWidth = document.body.clientWidth;
			})();
		};
		this.receiptParams = this.$route.query;

		if (this.receiptParams.orderContractId) {
			let outIdLists = this.$route.query.outboundNoList.split(',');
			this.receiptParams.outboundNoList = outIdLists;
			this.getDetail();
		} else {
			this.getEditDetail();
		}
	},
	watch: {
		warehouseToReceivable: {
			immediate: true,
			handler(isReceivable) {
				const acts = isReceivable
					? [
							{ title: '实际提货单位', dataIndex: 'actualLadingUnit' },
							{ title: '实际收货单位', dataIndex: 'actualReceivingUnit' }
						]
					: [];
				this.outBoundColumns = [
					{ title: '出库编号', dataIndex: 'outboundNo', scopedSlots: { customRender: 'outboundNo' } },
					{ title: '出库日期', dataIndex: 'deliveryDate' },
					{ title: '出库数量(吨)', dataIndex: 'outboundQuantity' },
					{ title: '品名', dataIndex: 'goodsName' },
					...acts,
					{ title: '备注', dataIndex: 'remark', scopedSlots: { customRender: 'remark' } }
				];
			}
		},
		clientWidth: {
			handler: function () {
				this.getmaxWidth();
			},
			immediate: true
		}
	},
	methods: {
		handleTypeChange(selectData) {
			this.contractInfo.deliveryMode = selectData;
		},
		timeValidator(rule, value, callback) {
			let startTime = value[0];
			let endTime = value[1];
			if (startTime && endTime) {
				callback();
			} else {
				callback('收货日期必填');
			}
		},
		//附件回调
		//重新选择出库记录
		confirmSelectRecordOutList(recordOutList) {
			let outIdLists = [];
			if (recordOutList.length == 0) return;
			recordOutList.forEach(value => {
				outIdLists.push(value.serialNo);
			});
			this.receiptParams = {
				contractType: recordOutList[0].contractType,
				orderContractId: recordOutList[0].contractId,
				outboundNoList: recordOutList
			};
			this.getDetail();
		},
		//跳转到
		clickOutBoundDetail(data) {
			this.$router.push({
				path: `/center/storageCenter/out/detail`,
				query: {
					id: data.id
				}
			});
		},

		formateBankNo(e) {
			let result = '';
			let value = e?.target?._value;
			if (value.length) {
				value = value.replace(/\s+/g, '');
				for (let i = 0; i < value.length; i++) {
					if (i % 4 == 0 && i != 0) {
						result += ' ' + value[i];
					} else {
						result += value[i];
					}
				}
			}
			this.formatValue = result;
		},

		getAccountInfo() {
			API_RefundReceiveAccount({
				uscc: this.contractInfo.buyerUscc
			}).then(res => {
				if (res.success) {
					this.receiveAccList = res.data || [];
				}
			});
		},
		getBeginUpload(val) {
			this.disabled = val;
		},
		// 获取合同信息字段的最小宽度
		getmaxWidth() {
			if (this.clientWidth < 1366) {
				this.maxWidth = 200;
			} else if (this.clientWidth < 1560) {
				this.maxWidth = 200;
			} else if (this.clientWidth < 1920) {
				this.maxWidth = 240;
			} else {
				this.maxWidth = 350;
			}
		},
		//修改出库信息
		updateOutInfos() {
			this.$refs.selectRecordModal.showModal();
		},

		deliverDateChange() {},

		getEditDetail() {
			API_getReceiptProveDataById({ id: this.$route.query.recordId }).then(res => {
				if (res.success) {
					this.drawingData(res.data);
					this.initReceiptInfo(res.data);
				}
			});
		},
		//初始化收货证明信息
		initReceiptInfo(data) {
			this.disabledEndDay = data.beginDate;
			this.deliverType = {
				value: data.deliveryMode,
				text: data.deliveryModeDesc
			};
			this.$nextTick(() => {
				this.form.setFieldsValue({
					storageDate: [data.beginDate, data.endDate],
					goodsName: data.goodsName,
					quantity: data.quantity,
					deliveryPlace: data.deliveryPlace,
					deliveryMode: this.deliverType.value,
					openDate: data.openDate
				});
			});
			this.receiptFiles = data.attachVOList || [];
		},

		getDetail() {
			API_ADD_RECEIPT_DETAIL(this.receiptParams).then(res => {
				if (res.success) {
					this.drawingData(res.data);
				}
			});
		},

		contractPriceShow() {
			if (this.contractInfo.followTheMarket) {
				return '随行就市';
			}
			return this.contractInfo.basePrice;
		},
		//渲染数据
		async drawingData(data) {
			if (data.contractInfo) {
				//合同信息
				this.contractInfo = data.contractInfo;
				delete data.contractInfo;
			}
			this.warehouseToReceivable = data.warehouseToReceivable;
			this.deliverModeList = data.deliveryModeList || [];

			this.outBoundDatas = data.outboundVOList || [];
			let showGoodsName = '';
			let showQuantity = 0;
			let times = [];
			for (var i = 0; i < this.outBoundDatas.length; i++) {
				let outBound = this.outBoundDatas[i];
				times.push(new Date(outBound.deliveryDate));
				if (!showGoodsName.includes(outBound.goodsName)) {
					if (showGoodsName.length > 0) {
						showGoodsName = showGoodsName + ',' + outBound.goodsName;
					} else {
						showGoodsName = outBound.goodsName;
					}
				}
			}

			times.sort(function (a, b) {
				return a - b;
			});
			this.deliverType = {
				value: this.contractInfo.deliveryMode,
				text: this.contractInfo.deliveryModeDesc
			};
			this.disabledEndDay = moment(times[0].toString());
			this.$nextTick(() => {
				this.form.setFieldsValue({
					goodsName: showGoodsName,
					storageDate: [moment(times[0]), null],
					quantity: data.canReceiveQuantity,
					deliveryPlace: this.contractInfo.deliveryPlace,
					deliveryMode: this.deliverType.value || undefined,
					openDate: moment().format('YYYY-MM-DD')
				});
			});
		},
		// 收款账号
		changeAccountName(val) {
			/** 获取收款数据 */
			const item = this.receiveAccList.find(el => val == el.no) || {};
			this.$nextTick(() => {
				this.form.setFieldsValue({
					receiveAccBank: item.bankName,
					receiveAccNo: item.no,
					receiveAccName: item.accountName
				});
			});
		},
		cancel() {
			this.$router.back();
		},
		formateFileData(data) {
			if (data) {
				var arr = [];
				data[0].fileList.forEach(item => {
					if (item.attachmentId) {
						arr.push(item.attachmentId);
					} else {
						arr.push(item.id);
					}
				});
				return arr;
			}
		},
		async submit() {
			let attachmentList = await this.$refs.file.validateAttachmentFiels();

			this.form.validateFields(async (err, values) => {
				if (!err) {
					let info = values;
					info = {
						...info,
						beginDate: moment(values.storageDate[0]).format('YYYY-MM-DD'),
						endDate: moment(values.storageDate[1]).format('YYYY-MM-DD')
					};
					this.deliverType = {
						value: this.contractInfo.deliveryMode,
						text: this.contractInfo.deliveryModeDesc
					};
					let params = {
						contractType: this.contractInfo.contractType, // 合同类型
						orderContractId: this.contractInfo.orderContractId, // 订单id补录合同id
						contractNo: this.contractInfo.contractNo,
						...info,
						id: this.$route.query.recordId || null,
						outBoundList: this.outBoundDatas,
						attachDTOList: attachmentList
					};
					params.deliveryMode = this.contractInfo.deliveryMode;

					API_SUBMIT_RECEIPT(params).then(res => {
						if (res.success && res.data) {
							this.$message.success('提交成功');
							this.$router.back();
						}
					});
				}
			});
		},
		confirmFunc(auditChainAndOperator) {
			if (auditChainAndOperator) {
				auditChainAndOperator.oaOpenFlag = auditChainAndOperator.needPushOA;
				this.dataObj.auditChainAndOperator = auditChainAndOperator;
			}
			this.loadingSubmit = true;
			API_SUBMIT_RECEIPT(this.dataObj)
				.then(res => {
					if (res.success && res.data) {
						this.$message.success('提交成功');
						this.$router.push('/center/fund/refund/list');
						this.loadingSubmit = false;
					}
				})
				.finally(() => {
					this.loadingSubmit = false;
				});
		},
		disabledDate(current) {
			return current.diff(this.disabledEndDay) < 0;
		},
		validateDate(rule, value, callback) {
			let current = GetCurrentDateFormat();
			let rangeDays = Math.abs(moment(current).diff(moment(value), 'days'));
			if (rangeDays > 30) {
				this.wrongTips = '退款日期与当前日期偏差较多，如果实际如此，请忽略提示';
			} else {
				this.wrongTips = '';
			}
			callback();
		},
		// 校验身份证
		validAmount(rule, value, callback) {
			if (value > this.paidAmount) {
				callback('退款金额不能大于当前合同的累计付款金额，累计付款金额为：' + this.paidAmount + '元');
				return;
			}
			if (value <= 0) {
				callback('退款金额需大于0');
				return;
			}
			callback();
		},
		changeContract() {
			this.$refs.selectContractModal.showModal();
		},
		getContractDetail(data) {
			this.orderId = data.orderId;
			this.orderLineType = data.orderLineType;
			this.paidAmount = data.paidAmount;
			this.getTemplate({
				orderId: data.orderId,
				orderLineType: data.orderLineType
			});
		},
		viewContractDetail() {
			let type = 'buy';
			let orderLineType = this.contractInfo.contractType;
			let routerData = this.$router.resolve({
				path: '/center/contract/' + type.toLowerCase() + '/' + orderLineType.toLowerCase() + '/detail',
				query: {
					id: this.contractInfo.orderContractId,
					type: type
				}
			});
			window.open(routerData.href, '_blank');
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
.slMain {
	padding-bottom: 60px;
	/deep/ .ant-table {
		white-space: nowrap;
	}
	
	.remarkContent {
		color: #77889d;
		width: 320px;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
		white-space: pre-wrap;
	}
	/deep/ .ant-card {
		padding-bottom: 48px;

		/deep/ .ant-card-body {
			position: relative;
		}
	}

	.slTitleAttach {
		margin-top: 10px;
	}

	.slTitleAssis {
		margin-top: 30px;
	}

	.grid-wrap {
		margin: 30px 0 20px 0;
		width: 100%;
		border-radius: 3px;
		height: auto;
		overflow: hidden;
		border-left: 1px solid #e5e6eb;

		li {
			width: 33.3%;
			height: 48px;
			float: left;
			border-bottom: 1px solid #e5e6eb;
			border-right: 1px solid #e5e6eb;
			overflow: hidden;
			position: relative;

			span,
			.textOverflow {
				display: inline-block;
				height: 48px;
				line-height: 48px;
				padding: 0 12px;
			}

			& > span:first-child {
				border-right: 1px solid #e5e6eb;
			}

			.label {
				width: 120px;
				background: #f3f5f6;
				font-family:
					PingFangSC-Regular,
					PingFang SC;
				font-weight: 400;
				color: #77889d;
				position: absolute;
				left: 0;
				top: 0;
			}

			span:last-child {
				width: 100%;
				padding-left: 132px;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}

			.textOverflow {
				left: 132px;
				padding: 0;
			}

			.contract-box {
				color: @primary-color;
			}
		}

		li:nth-child(1),
		li:nth-child(2),
		li:nth-child(3) {
			border-top: 1px solid #e5e6eb;
		}

		li:nth-child(3) {
			border-radius: 0 3px 0 0;
		}

		li:last-child {
			border-radius: 0 0 3px 0;
		}

		li.special {
			border-radius: 0 3px 3px 0;
		}
	}

	.contract-box {
		position: relative;

		.textOverflow {
			left: 0 !important;
			position: relative;
		}

		.copy-icon {
			margin-left: 12px;
			cursor: pointer;
			width: 14px;
			height: 14px;
			vertical-align: baseline;
			margin-bottom: 17px;
		}
	}

	.slDetailBottom {
		width: calc(100vw - 254px);
		min-width: 1186px;
		height: 64px;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		border-top: 1px solid #e5e6eb;
		box-sizing: border-box;
		position: fixed;
		bottom: 0;
		left: 228px;
	}

	.slFormDetail {
		padding-bottom: 0;
		padding-top: 30px;

		.ant-col {
			height: 92px;
		}

		.ant-form-item {
			width: 364px;
			margin-bottom: 0;
		}

		.specialItem {
			height: 146px;

			::v-deep.ant-form-item {
				width: 100%;
			}

			textarea.ant-input {
				margin-bottom: 0;
			}
		}
	}

	.table-box {
		padding-bottom: 20px;
		margin-top: 20px;

		.new-table {
			max-height: 268px;
			overflow: hidden;

			/deep/ .ant-table-body {
				max-height: 268px;
				overflow-y: scroll;
			}
		}
	}

	.textarea-wrap {
		width: 100%;
		height: 96px;
		resize: none;
	}

	.gray {
		color: gray;
	}

	.fz12 {
		font-size: 14px;
		zoom: 0.86;
	}

	.requiredItem {
		::v-deep.ant-form-item-label {
			label::before {
				display: inline-block;
				margin-right: 4px;
				color: #f5222d;
				font-size: 14px;
				font-family: SimSun, sans-serif;
				line-height: 1;
				content: '*';
				vertical-align: middle;
			}
		}
	}
}

.attachment {
	margin-bottom: 60px;
}

.optionMain {
	display: inline-block;
	width: 100%;
	// max-width: calc(100% - 20px);
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
</style>
