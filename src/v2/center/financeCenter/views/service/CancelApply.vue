<template>
	<div class="slMain myServiceFeeConfirm">
		<Breadcrumb />
		<a-card :bordered="false">
			<div class="methods-wrap">
				<span class="slTitle">{{ $route.meta.title }}</span>
				<div class="content-title">
					<div
						v-if="feeStatus == '已确认'"
						class="fee-status"
						style="color: green"
					>
						服务费结算单状态：已确认
					</div>
					<div
						v-if="feeStatus == '待确认'"
						class="fee-status"
						style="color: #ff9d35"
					>
						服务费结算单状态：待确认
					</div>
					<div
						v-if="feeStatus == '待签约'"
						class="fee-status"
						style="color: #ff9d35"
					>
						服务费结算单状态：待签约
					</div>
				</div>
			</div>
			<div class="myServiceFeeConfirmForm">
				<div class="slTitleAssis">服务费流水明细</div>
				<a-table
					class="new-table"
					:pagination="false"
					:columns="columns"
					:data-source="myServiceFeeFlowDetail"
					:scroll="{ x: true }"
					rowKey="id"
				>
					<template
						slot="orderNo"
						slot-scope="orderNo, item"
					>
						<a @click="openOrder(item)">{{ orderNo }}</a>
					</template>
					<!-- 金额格式转化 1000=1,000.00 -->
					<template
						slot="serviceFeeAmount"
						slot-scope="serviceFeeAmount, item"
					>
						<span v-if="serviceFeeAmount">{{ serviceFeeAmount | formatMoney(2) }}</span>
						<span v-else>{{ serviceFeeAmount }}</span>
					</template>
					<template
						slot="finAmount"
						slot-scope="finAmount, item"
					>
						<span v-if="finAmount">{{ finAmount | formatMoney(2) }}</span>
						<span v-else>{{ finAmount }}</span>
					</template>
					<template
						slot="repayAmount"
						slot-scope="repayAmount, item"
					>
						<span v-if="repayAmount">{{ repayAmount | formatMoney(2) }}</span>
						<span v-else>{{ repayAmount }}</span>
					</template>
					<template
						slot="repayPrincipal"
						slot-scope="repayPrincipal, item"
					>
						<span v-if="repayPrincipal">{{ repayPrincipal | formatMoney(2) }}</span>
						<span v-else>{{ repayPrincipal }}</span>
					</template>
					<template
						slot="repayInterest"
						slot-scope="repayInterest, item"
					>
						<span v-if="repayInterest">{{ repayInterest | formatMoney(2) }}</span>
						<span v-else>{{ repayInterest }}</span>
					</template>
				</a-table>
				<div
					class="statisticsBox"
					v-if="myServiceFeeFlowDetail && myServiceFeeFlowDetail.length > 0"
				>
					<p><strong>统计说明：</strong></p>
					<p>条数：{{ myServiceFeeFlowDetail.length }}</p>
					<p>
						涉及合同：{{ selectedObj.contractNo.length }}
						<span
							v-for="(item, i) in selectedObj.contractNo"
							:key="i"
							><span v-if="i == 0">（</span>{{ item }}<span v-if="i < selectedObj.contractNo.length - 1">;&nbsp;</span
							><span v-if="i == selectedObj.contractNo.length - 1">）</span></span
						>
					</p>
					<p>
						涉及核心企业：{{ selectedObj.coreCompanyName.length }}
						<span
							v-for="(item, i) in selectedObj.coreCompanyName"
							:key="i"
							><span v-if="i == 0">（</span>{{ item }}<span v-if="i < selectedObj.coreCompanyName.length - 1">;&nbsp;</span
							><span v-if="i == selectedObj.coreCompanyName.length - 1">）</span></span
						>
					</p>
					<p>
						涉及金融机构：{{ selectedObj.bankName.length }}
						<span
							v-for="(item, i) in selectedObj.bankName"
							:key="i"
							><span v-if="i == 0">（</span>{{ item }}<span v-if="i < selectedObj.bankName.length - 1">;&nbsp;</span
							><span v-if="i == selectedObj.bankName.length - 1">）</span></span
						>
					</p>
					<p>
						涉及资金类型：{{ selectedObj.productItemName.length }}
						<span
							v-for="(item, i) in selectedObj.productItemName"
							:key="i"
							><span v-if="i == 0">（</span>{{ item }}<span v-if="i < selectedObj.productItemName.length - 1">;&nbsp;</span
							><span v-if="i == selectedObj.productItemName.length - 1">）</span></span
						>
					</p>
				</div>
			</div>
			<div class="fw-content">
				<div class="slTitleAssis">服务费信息</div>
				<a-form
					:label-col="{ span: 6 }"
					:wrapper-col="{ span: 18 }"
				>
					<a-row>
						<a-col
							:span="12"
							class="row"
						>
							<a-form-item label="服务费结算单号">
								{{ myServiceFeeConfirmserviceFeeInfoModel.serialNo }}
							</a-form-item>
						</a-col>
						<a-col
							:span="12"
							class="row"
						>
							<a-form-item label="服务费结算日期">
								{{ myServiceFeeConfirmserviceFeeInfoModel.creatDate }}
							</a-form-item>
						</a-col>
						<a-col
							:span="12"
							class="row"
						>
							<a-form-item label="付款方">
								{{ myServiceFeeConfirmserviceFeeInfoModel.payerName }}
							</a-form-item>
						</a-col>
						<a-col
							:span="12"
							class="row"
						>
							<a-form-item label="结算单位">
								{{ myServiceFeeConfirmserviceFeeInfoModel.settlementCompanyName }}
							</a-form-item>
						</a-col>
						<a-col
							:span="12"
							class="row"
						>
							<a-form-item label="服务项目">
								{{ myServiceFeeConfirmserviceFeeInfoModel.serviceItem }}
							</a-form-item>
						</a-col>
						<a-col
							:span="12"
							class="row"
						>
							<a-form-item label="客户确认时间">
								{{ myServiceFeeConfirmserviceFeeInfoModel.confirmDate }}
							</a-form-item>
						</a-col>
						<a-col
							:span="12"
							class="row"
						>
							<a-form-item label="计算方式">
								{{ computedModeObj[myServiceFeeConfirmserviceFeeInfoModel.computeMode] }}
							</a-form-item>
						</a-col>
						<a-col
							:span="12"
							class="row"
						>
							<a-form-item label="客户签章时间">
								{{ myServiceFeeConfirmserviceFeeInfoModel.sealTime }}
							</a-form-item>
						</a-col>
					</a-row>
					<a-row>
						<a-col
							:span="12"
							class="row"
							style="padding-left: 10px"
						>
							<a-form-item label="服务费金额（元）">
								<span
									style="color: #f45655; font-size: 18px"
									v-if="myServiceFeeConfirmserviceFeeInfoModel.serviceFeeAmount"
								>
									{{ myServiceFeeConfirmserviceFeeInfoModel.serviceFeeAmount | formatMoney(2) }}元</span
								>
							</a-form-item>
						</a-col>
					</a-row>
					<a-row>
						<a-col
							:span="12"
							class="row"
						>
							<a-form-item label="备注">
								{{ myServiceFeeConfirmserviceFeeInfoModel.remarks }}
							</a-form-item>
						</a-col>
					</a-row>
				</a-form>
			</div>
			<div class="kaipiao-content">
				<a-form
					:label-col="{ span: 8 }"
					:wrapper-col="{ span: 16 }"
				>
					<div class="slTitleAssis">开票信息</div>
					<a-row>
						<a-col
							:span="8"
							class="row"
						>
							<a-form-item label="企业名称">
								{{ myServiceFeeConfirmKaipiao.companyName }}
							</a-form-item>
						</a-col>
						<a-col
							:span="8"
							class="row"
						>
							<a-form-item label="税号">
								{{ myServiceFeeConfirmKaipiao.bizNo }}
							</a-form-item>
						</a-col>
						<a-col
							:span="8"
							class="row"
						>
							<a-form-item label="电话号码">
								{{ myServiceFeeConfirmKaipiao.contractPhone }}
							</a-form-item>
						</a-col>
						<a-col
							:span="8"
							class="row"
						>
							<a-form-item label="企业地址">
								{{ myServiceFeeConfirmKaipiao.address }}
							</a-form-item>
						</a-col>

						<a-col
							:span="8"
							class="row"
						>
							<a-form-item label="开户行">
								{{ myServiceFeeConfirmKaipiao.subbranchName }}
							</a-form-item>
						</a-col>
						<a-col
							:span="8"
							class="row"
						>
							<a-form-item label="银行账号">
								{{ myServiceFeeConfirmKaipiao.accountNo }}
							</a-form-item>
						</a-col>
					</a-row>
				</a-form>
			</div>
			<div class="address-content">
				<a-form
					:form="addressForm"
					:label-col="{ span: 8 }"
					:wrapper-col="{ span: 16 }"
				>
					<div class="slTitleAssis">收件地址</div>
					<a-row>
						<a-col
							:span="8"
							class="row"
						>
							<a-form-item label="收件人">
								{{ addressForm.name }}
							</a-form-item>
						</a-col>
						<a-col
							:span="8"
							class="row"
						>
							<a-form-item label="手机号">
								{{ addressForm.phone }}
							</a-form-item>
						</a-col>
						<a-col
							:span="8"
							class="row"
						>
							<a-form-item label="地址">
								{{ addressForm.area }}<span v-if="addressForm.area && addressForm.address">/</span>{{ addressForm.address }}
							</a-form-item>
						</a-col>
					</a-row>
				</a-form>
			</div>
			<div class="fujian-content">
				<div class="slTitleAssis">服务费附件</div>
				<a-row
					type="flex"
					:gutter="40"
				>
					<a-col>
						<div
							class="fujian-icon"
							@click="openPdf('ticketPdfUrl')"
						></div>
						<div style="margin-top: 7px">服务费结算单.pdf</div>
						<a-button
							type="link"
							@click="downLoadService('ticketPdfUrl')"
							style="display: block; margin-left: 20px; margin-top: 5px"
							>下载</a-button
						>
					</a-col>
					<a-col v-if="newPdfUrl">
						<div
							class="fujian-icon"
							@click="openPdf('newPdfUrl')"
						></div>
						<div style="margin-top: 7px">补充服务费结算单.pdf</div>
						<a-button
							type="link"
							@click="downLoadService('newPdfUrl')"
							style="display: block; margin-left: 20px; margin-top: 5px"
							>下载</a-button
						>
					</a-col>
				</a-row>
			</div>
			<div class="cancel-content">
				<div class="slTitleAssis">申请作废</div>
				<a-form
					class="myServiceFeeApplyForm"
					:form="myServiceFeeApplyForm"
				>
					<a-form-item label="申请作废原因">
						<a-textarea
							placeholder="请输入申请作废原因"
							:maxLength="500"
							style="resize: none"
							:rows="5"
							v-decorator="[
								'suspendRemarks',
								{
									validateTrigger: 'blur',
									rules: [{ required: true, message: '请填写申请作废原因' }]
								}
							]"
						>
						</a-textarea>
					</a-form-item>
				</a-form>
			</div>
		</a-card>
		<div class="slDetailBottom">
			<a-row
				type="flex"
				justify="center"
				style="margin: 20px 0"
			>
				<a-space :size="30">
					<a-button @click="$router.go(-1)">返回</a-button>
					<a-button
						type="primary"
						@click="submitResult"
						>提交</a-button
					>
				</a-space>
			</a-row>
		</div>
	</div>
</template>

<script>
import { API_ServiceFeeDetailNew, API_DOWNLPREVIEWTE, API_cancelServiceFee } from '@/v2/center/financeCenter/api/index';
import comDownload from '@sub/utils/comDownload.js';
import { mapGetters } from 'vuex';
import Breadcrumb from '@/v2/components/breadcrumb/index';
export default {
	name: 'MyServiceFeeConfirm',
	data() {
		return {
			myServiceFeeApplyForm: this.$form.createForm(this),
			myServiceFeeConfirmserviceFeeInfoModel: {},
			myServiceFeeConfirmKaipiao: {},
			feeStatus: '',
			myServiceFeeFlowDetail: [], //流水明细
			columns: [
				{ title: '服务费流水编号', dataIndex: 'serialNo', key: 'serialNo', width: 150 },
				{ title: '生成时间', dataIndex: 'createTime', key: 'createTime', width: 150 },
				{
					title: '服务费金额',
					dataIndex: 'serviceFeeAmount',
					key: 'serviceFeeAmount',
					scopedSlots: { customRender: 'serviceFeeAmount' },
					width: 150
				},
				{ title: '付款方', dataIndex: 'payerName', key: 'payerName', width: 150 },
				{ title: '金融机构', dataIndex: 'bankName', key: 'bankName', width: 150 },
				{ title: '服务费率', dataIndex: 'serviceFeeRate', key: 'serviceFeeRate', width: 120 },
				{ title: '融资起息日', dataIndex: 'beginDate', key: 'beginDate', width: 120 },
				{ title: '融资到期日', dataIndex: 'endDate', key: 'endDate', width: 120 },
				{ title: '融资金额', dataIndex: 'finAmount', key: 'finAmount', scopedSlots: { customRender: 'finAmount' }, width: 150 },
				{ title: '还款日期', dataIndex: 'repayDate', key: 'repayDate', width: 120 },
				{
					title: '还款总额',
					dataIndex: 'repayAmount',
					key: 'repayAmount',
					scopedSlots: { customRender: 'repayAmount' },
					width: 150
				},
				{
					title: '还款本金',
					dataIndex: 'repayPrincipal',
					key: 'repayPrincipal',
					scopedSlots: { customRender: 'repayPrincipal' },
					width: 150
				},
				{
					title: '还款利息',
					dataIndex: 'repayInterest',
					key: 'repayInterest',
					scopedSlots: { customRender: 'repayInterest' },
					width: 150
				},
				{ title: '订单编号', dataIndex: 'orderNo', key: 'orderNo', scopedSlots: { customRender: 'orderNo' }, width: 180 },
				{ title: '合同编号', dataIndex: 'contractNo', key: 'contractNo', width: 180 },
				{ title: '服务费协议编号', dataIndex: 'serviceFeeAgreementNo', key: 'serviceFeeAgreementNo', width: 180 },
				{ title: '应收账款流水号', dataIndex: 'receivableNo', key: 'receivableNo', width: 180 },
				{ title: '预付流水号', dataIndex: 'prePaymentAssetNo', key: 'prePaymentAssetNo', width: 180 },
				{ title: '票据号', dataIndex: 'assetBillNo', key: 'assetBillNo', width: 180 }
			], //流水明细表格字段
			addressForm: {
				// 收件地址
				name: '',
				phone: '',
				area: '',
				address: ''
			},
			personalReceiveAddress: '', //收件人信息
			selectedObj: {}, // 选中的服务费流水明细的对象
			newPdfUrl: '',
			ticketPdfUrl: '',
			computedModeObj: {
				1: '依据服务费流水明细自动累加',
				2: '手动录入金额'
			}
		};
	},
	components: {
		Breadcrumb
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		isLogisticsCompany() {
			return this.VUEX_ST_COMPANYSUER.company.companyType == 'LOGISTICS';
		}
	},
	mounted() {
		if (this.isLogisticsCompany) {
			this.columns.splice(
				5,
				0,
				{ title: '下游结算数量', dataIndex: 'downStatementQuantity', key: 'downStatementQuantity', width: 150 },
				{ title: '每吨费用', dataIndex: 'cost', key: 'cost', width: 150 }
			);
		}
		this.getDetail();
	},
	methods: {
		// 打开合同详情页
		openOrder(item) {
			let routerData = this.$router.resolve({
				path: '/center/contract/' + item.orderType + '/online/detail',
				query: {
					id: item.orderId,
					type: item.orderType.toUpperCase()
				}
			});
			window.open(routerData.href, '_blank');
		},
		unique(arr) {
			// 数组去重
			return arr.filter(function (item, index, arr) {
				//当前元素，在原始数组中的第一个索引==当前索引值，否则返回当前元素
				return arr.indexOf(item, 0) === index;
			});
		},
		getDetail() {
			API_ServiceFeeDetailNew({ id: this.$route.query.id }).then(res => {
				if (res.success) {
					this.feeStatus = res.data.statusText;
					this.ticketPdfUrl = res.data.pdfPath;
					this.newPdfUrl = res.data.newPdfPath;
					this.myServiceFeeConfirmserviceFeeInfoModel = res.data.serviceFeeInfo;
					this.myServiceFeeConfirmKaipiao = res.data.invoiceInfo;
					if (res.data.personalReceiveAddress.area) {
						if (res.data.personalReceiveAddress.area.indexOf(',') > -1) {
							res.data.personalReceiveAddress.area = res.data.personalReceiveAddress.area
								? res.data.personalReceiveAddress.area.split(',')
								: null;
						} else if (res.data.personalReceiveAddress.area.indexOf('/') > -1) {
							res.data.personalReceiveAddress.area = res.data.personalReceiveAddress.area
								? res.data.personalReceiveAddress.area.split('/')
								: null;
						} else {
							res.data.personalReceiveAddress.area = null;
						}
					}
					this.personalReceiveAddress = Object.assign({}, res.data.personalReceiveAddress);
					this.addressForm = res.data.personalReceiveAddress; //收件地址
					this.addressForm.area = this.addressForm.area ? this.addressForm.area.toString().split(',').join('/') : '';
					this.myServiceFeeFlowDetail = res.data.billList; //流水明细
					//统计说明--start
					let contractNo = [];
					let coreCompanyName = [];
					let bankName = [];
					let productItemName = [];
					this.myServiceFeeFlowDetail.forEach((item, index) => {
						contractNo.push(item.contractNo);
						if (item.coreCompanyName) {
							coreCompanyName.push(item.coreCompanyName);
						}
						if (item.bankName) {
							bankName.push(item.bankName);
						}
						productItemName.push(item.productItemName);
						if (index == this.myServiceFeeFlowDetail.length - 1) {
							this.selectedObj.contractNo = this.unique(contractNo);
							this.selectedObj.coreCompanyName = this.unique(coreCompanyName);
							this.selectedObj.bankName = this.unique(bankName);
							this.selectedObj.productItemName = this.unique(productItemName);
						}
					});
					//统计说明--end
				}
			});
		},
		submitResult() {
			this.myServiceFeeApplyForm.validateFieldsAndScroll((err, values) => {
				if (!err) {
					API_cancelServiceFee({
						id: this.$route.query.id,
						suspendRemarks: values.suspendRemarks
					}).then(res => {
						if (res.success && res.data) {
							this.$message.success('提交成功');
							this.$router.push('/center/financeCenter/service/myServiceFee');
						}
					});
				}
			});
		},
		openPdf(type) {
			window.open(this[type], '_blank');
		},
		downLoadService(type) {
			// 下载服务费结算单pdf
			API_DOWNLPREVIEWTE(this[type]).then(res => {
				comDownload(res, this[type]);
			});
		}
	}
};
</script>
<style lang="less" scoped>
.myServiceFeeConfirm {
	background-color: #f4f5f8;
	.rongzi-content,
	.kaipiao-content,
	.fw-content,
	.address-content {
		background-color: #fff;
		margin-bottom: 10px;
	}
	.rongzi-content {
		padding: 20px 0;
	}

	.row {
		line-height: 60px;
	}
	.title {
		font-size: 15px;
		padding: 14px 0;
		margin-bottom: 30px;
		.title_icon {
			opacity: 0;
			width: 4px;
			height: 16px;
			display: inline-block;
			vertical-align: middle;
			background: url(~assets/imgs/menu/titleIcon.png) no-repeat right center;
		}
	}
	::v-deep.ant-form-item-control {
		input,
		textarea {
			width: 254px;
		}
	}
	.textarea-wrap {
		textarea {
			width: 720px;
			text-align: left !important;
		}
	}
	::v-deep.ant-form-item-label {
		label {
			font-size: 14px;
			color: rgba(0, 0, 0, 0.75);
			margin-right: 15px;
			display: inline-block;
			text-align: right;
		}
	}
	::v-deep.ant-form-item-with-help {
		margin-bottom: 0;
	}
}
.serviceInvoiceModal {
	p {
		font-size: 16px;
		text-align: center;
	}
	::v-deep.ant-modal-header,
	.ant-modal-footer {
		border: none;
	}
}
.serviceFeeInfo {
	border-bottom: 1px solid #dfdfdf;
	margin: 20px 0;
}
.serviceFeeInfo ul {
	width: 100%;
	overflow: hidden;
	color: rgba(0, 0, 0, 0.65);
}
.serviceFeeInfo ul.tableHead {
	background: #f7f7f7;
	border-bottom: 1px solid #dfdfdf;
	color: rgba(0, 0, 0, 0.85);
}
.serviceFeeInfo ul li {
	float: left;
	text-align: center;
	min-height: 54px;
	padding: 16px;
	overflow-wrap: break-word;
	height: 100%;
}
.serviceFeeInfo ul li:nth-child(1) {
	width: 10%;
}
.serviceFeeInfo ul li:nth-child(2) {
	width: 25%;
}
.serviceFeeInfo ul li:nth-child(3) {
	width: 20%;
}
.serviceFeeInfo ul li:nth-child(4) {
	width: 30%;
}
.serviceFeeInfo ul li:nth-child(5) {
	width: 15%;
}
.ant-table td {
	white-space: nowrap;
}
.content-title {
	height: 56px;
	position: relative;
	margin-top: 0;
	padding: 0 24px;
	font-size: 16px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	color: rgba(0, 0, 0, 0.85);
	font-weight: 500;
}
.slTitleAssis {
	margin-bottom: 20px;
}
.statisticsBox {
	margin-top: 20px;
}
.statisticsBox p {
	margin-bottom: 10px;
}
.slMain.myServiceFeeConfirm {
	margin-bottom: -40px;
	.slDetailBottom {
		width: 100%;
		min-width: 1186px;
		border-top: 1px solid #e5e6eb;
		box-sizing: border-box;
		position: sticky;
		bottom: 0;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
}
.myServiceFeeApplyForm {
	::v-deep {
		.ant-form-item {
			display: flex;
			justify-content: flex-start;
			.ant-form-item-label {
				flex: 0 0 160px;
				position: relative;
				label {
					position: absolute;
					top: 0;
					right: 2px;
					line-height: 22px;
					margin-right: 0 !important;
				}
			}
			.ant-form-item-control-wrapper {
				flex: 1;
			}
			.ant-form-item-children {
				width: 100%;
			}
			textarea {
				width: 100%;
				height: 128px;
			}
		}
	}
}
.fujian-icon {
	width: 109px;
	height: 141px;
	background-size: cover;
	background-image: url(~assets/imgs/pdf.png);
	cursor: pointer;
}
</style>
