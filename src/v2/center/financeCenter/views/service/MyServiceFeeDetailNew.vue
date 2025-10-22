<template>
	<div class="slMain myServiceFeeDetail">
		<Breadcrumb />
		<a-card :bordered="false">
			<div class="methods-wrap">
				<span class="slTitle">服务费结算单详情</span>
				<div
					class="content-title"
					style=""
				>
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
					<div
						v-if="feeStatus == '已作废'"
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
						slot-scope="serviceFeeAmount"
					>
						<span v-if="serviceFeeAmount">{{ serviceFeeAmount | formatMoney(2) }}</span>
						<span v-else>{{ serviceFeeAmount }}</span>
					</template>
					<template
						slot="finAmount"
						slot-scope="finAmount"
					>
						<span v-if="finAmount">{{ finAmount | formatMoney(2) }}</span>
						<span v-else>{{ finAmount }}</span>
					</template>
					<template
						slot="repayAmount"
						slot-scope="repayAmount"
					>
						<span v-if="repayAmount">{{ repayAmount | formatMoney(2) }}</span>
						<span v-else>{{ repayAmount }}</span>
					</template>
					<template
						slot="repayPrincipal"
						slot-scope="repayPrincipal"
					>
						<span v-if="repayPrincipal">{{ repayPrincipal | formatMoney(2) }}</span>
						<span v-else>{{ repayPrincipal }}</span>
					</template>
					<template
						slot="repayInterest"
						slot-scope="repayInterest"
					>
						<span v-if="repayInterest">{{ repayInterest | formatMoney(2) }}</span>
						<span v-else>{{ repayInterest }}</span>
					</template>
				</a-table>
			</div>
			<div class="fw-content">
				<a-form
					:label-col="{ span: 8 }"
					:wrapper-col="{ span: 16 }"
					labelAlign="left"
				>
					<div class="slTitleAssis">服务费信息</div>
					<a-row>
						<a-col
							:span="8"
							class="row"
						>
							<a-form-item label="服务费结算单号">
								{{ myServiceFeeConfirmserviceFeeInfoModel.serialNo }}
							</a-form-item>
						</a-col>
						<a-col
							:span="8"
							class="row"
						>
							<a-form-item label="服务费结算日期">
								{{ myServiceFeeConfirmserviceFeeInfoModel.creatDate }}
							</a-form-item>
						</a-col>
						<a-col
							:span="8"
							class="row"
						>
							<a-form-item label="付款方">
								{{ myServiceFeeConfirmserviceFeeInfoModel.payerName }}
							</a-form-item>
						</a-col>
						<a-col
							:span="8"
							class="row"
						>
							<a-form-item label="结算单位">
								{{ myServiceFeeConfirmserviceFeeInfoModel.settlementCompanyName }}
							</a-form-item>
						</a-col>
						<a-col
							:span="8"
							class="row"
						>
							<a-form-item label="服务项目">
								{{ myServiceFeeConfirmserviceFeeInfoModel.serviceItem }}
							</a-form-item>
						</a-col>
					</a-row>
					<a-row>
						<a-col
							:span="8"
							class="row"
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
							:span="8"
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
					:form="myServiceFeeConfirmForm"
					:label-col="{ span: 8 }"
					:wrapper-col="{ span: 16 }"
					labelAlign="left"
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
			<div class="fujian-content">
				<div class="slTitleAssis">操作记录</div>
				<Log :logList="logList"></Log>
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
							@click="downLoadService('ticketPdfUrl', `服务费结算单-${myServiceFeeConfirmserviceFeeInfoModel.serialNo}`)"
							style="display: block; margin-left: 20px; margin-top: 5px"
						>
							下载
						</a-button>
					</a-col>
					<a-col v-if="newPdfUrl">
						<div
							class="fujian-icon"
							@click="openPdf('newPdfUrl')"
						></div>
						<div style="margin-top: 7px">补充服务费结算单.pdf</div>
						<a-button
							type="link"
							@click="downLoadService('newPdfUrl', `补充服务费结算单-${myServiceFeeConfirmserviceFeeInfoModel.serialNo}`)"
							style="display: block; margin-left: 20px; margin-top: 5px"
						>
							下载
						</a-button>
					</a-col>
					<a-col v-if="invalidPdfPath">
						<div
							class="fujian-icon"
							@click="openPdf('invalidPdfPath')"
						></div>
						<div style="margin-top: 7px">服务费结算单作废协议.pdf</div>
						<a-button
							type="link"
							@click="
								downLoadService('invalidPdfPath', `服务费结算单作废协议-${myServiceFeeConfirmserviceFeeInfoModel.serialNo}`)
							"
							style="display: block; margin-left: 20px; margin-top: 5px"
						>
							下载
						</a-button>
					</a-col>
				</a-row>
			</div>
		</a-card>
	</div>
</template>

<script>
import { API_ServiceFeeDetailNew, API_DOWNLPREVIEWTE } from '@/v2/center/financeCenter/api/index';
import { mapGetters } from 'vuex';
import { area } from '@sub/utils/area.js';
import comDownload from '@sub/utils/comDownload.js';
import Log from './components/Log.vue';
import Breadcrumb from '@/v2/components/breadcrumb/index';
export default {
	name: 'MyServiceFeeDetail',
	data() {
		return {
			myServiceFeeConfirmForm: this.$form.createForm(this),
			myServiceFeeConfirmModel: {},
			myServiceFeeConfirmserviceFeeInfoModel: {},
			myServiceFeeConfirmKaipiao: {},
			myServiceFeeConfirmDataSource: [],
			myServiceFeeFlowDetail: [], //流水明细
			area: area,
			addressForm: this.$form.createForm(this),
			feeStatus: '',
			logList: [],
			columns: [
				{ title: '服务费流水编号', dataIndex: 'serialNo', key: 'serialNo', width: 180 },
				{ title: '资金流水号', dataIndex: 'paymentNo', key: 'paymentNo', width: 180 },
				{ title: '生成时间', dataIndex: 'createTime', key: 'createTime', width: 150 },
				{
					title: '服务费金额',
					dataIndex: 'serviceFeeAmount',
					key: 'serviceFeeAmount',
					scopedSlots: { customRender: 'serviceFeeAmount' },
					width: 150
				},
				{ title: '付款方', dataIndex: 'payerName', key: 'payerName', width: 150 },
				{ title: '结算单位', dataIndex: 'settlementCompanyName', key: 'settlementCompanyName', width: 150 },
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
			],
			newPdfUrl: '',
			invalidPdfPath: ''
		};
	},
	components: {
		Log,
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
		this.getDetail();
		if (this.isLogisticsCompany) {
			this.columns.splice(
				7,
				0,
				{ title: '下游结算数量', dataIndex: 'downStatementQuantity', key: 'downStatementQuantity', width: 150 },
				{ title: '每吨费用', dataIndex: 'cost', key: 'cost', width: 150 }
			);
		}
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
		openPdf(type) {
			window.open(this[type], '_blank');
		},
		getDetail() {
			API_ServiceFeeDetailNew({ id: this.$route.query.id }).then(res => {
				if (res.success) {
					this.feeStatus = res.data.statusText;
					this.ticketPdfUrl = res.data.pdfPath;
					this.newPdfUrl = res.data.newPdfPath;
					this.invalidPdfPath = res.data.invalidPdfPath;
					this.myServiceFeeConfirmserviceFeeInfoModel = res.data.serviceFeeInfo;
					this.myServiceFeeConfirmKaipiao = res.data.invoiceInfo;
					this.myServiceFeeConfirmForm.setFieldsValue(this.myServiceFeeConfirmKaipiao);
					if (res.data.personalReceiveAddress.area) {
						if (res.data.personalReceiveAddress.area.indexOf(',') > -1) {
							let arr = res.data.personalReceiveAddress.area.split(',');
							let str = '';
							for (let i = 0; i < arr.length; i++) {
								if (i < arr.length - 1) {
									str = str + arr[i] + '/';
								} else {
									str = str + arr[i];
								}
							}
							res.data.personalReceiveAddress.area = str;
						}
					}
					this.addressForm = res.data.personalReceiveAddress; //收件地址
					this.myServiceFeeFlowDetail = res.data.billList; //流水明细
					this.logList = res.data.logList;
				}
			});
		},
		downLoadService(type, text) {
			// 下载服务费结算单pdf
			let url = this[type];
			if (!url) return;
			let front_url = url?.split('?')[0];
			let name = text;
			//有名称判断有没有后缀，没有拼接地址后缀
			if (name.indexOf('.') <= 0) {
				let arr = front_url?.split('.');
				let ext = arr[arr.length - 1];
				name = name + '.' + ext;
			}
			API_DOWNLPREVIEWTE(this[type]).then(res => {
				comDownload(res, this[type], name);
			});
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
.myServiceFeeDetail {
	// & .fee-status {
	//     position: absolute;
	//     right: 13px;
	//     top:-5px;
	//     font-size: 13px;
	// }
	background-color: #f4f5f8;
	.rongzi-content,
	.kaipiao-content,
	.fw-content,
	.fujian-content,
	.address-content {
		background-color: #fff;
		margin-bottom: 10px;
	}
	.fujian-content .ant-row {
		padding: 0 30px;
	}
	.row {
		margin-bottom: 20px;
	}
	.title {
		font-size: 15px;
		padding: 14px 0;
		margin-bottom: 30px;
		.title_icon {
			opacity: 1;
			width: 12px;
			height: 16px;
			margin-right: 12px;
			display: inline-block;
			vertical-align: middle;
			background: url(~assets/imgs/menu/titleIcon.png) no-repeat right center;
		}
	}
	.ant-form-item-control {
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
	.ant-form-item-label {
		label {
			font-size: 14px;
			color: rgba(0, 0, 0, 0.75);
			width: 137px;
			margin-right: 15px;
			display: inline-block;
			text-align: right;
		}
	}
	.ant-form-item-with-help {
		margin-bottom: 0;
	}
	.fujian-icon {
		width: 109px;
		height: 141px;
		background-size: cover;
		background-image: url(~assets/imgs/pdf.png);
		cursor: pointer;
	}
	::v-deep.ant-table td {
		white-space: nowrap;
	}
	::v-deep.ant-form-item {
		margin-bottom: 0;
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
}
</style>
