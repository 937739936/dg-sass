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
						v-if="feeStatus == 'CONFIRMED'"
						class="fee-status"
						style="color: green"
					>
						服务费结算单状态：已确认
					</div>
					<div
						v-if="feeStatus == 'WAIT_CONFIRM'"
						class="fee-status"
						style="color: #ff9d35"
					>
						服务费结算单状态：待确认
					</div>
					<div
						v-if="feeStatus == 'WAIT_SIGN_SEAL'"
						class="fee-status"
						style="color: #ff9d35"
					>
						服务费结算单状态：待签约
					</div>
				</div>
			</div>
			<div class="myServiceFeeConfirmForm">
				<a-form
					:label-col="{ span: 6 }"
					:wrapper-col="{ span: 18 }"
				>
					<div class="slTitleAssis">贸易结算信息</div>
					<a-row>
						<a-col
							:span="12"
							class="row"
						>
							<a-form-item label="订单编号">
								<a
									@click="openOrder"
									href="javascript:void(0)"
									>{{ myServiceFeeConfirmModel.orderNo }}</a
								>
							</a-form-item>
						</a-col>
						<a-col
							:span="12"
							class="row"
						>
							<a-form-item label="合同编号">
								{{ myServiceFeeConfirmModel.contractNo }}
							</a-form-item>
						</a-col>
						<a-col
							:span="12"
							class="row"
						>
							<a-form-item label="卖方名称">
								{{ myServiceFeeConfirmModel.sellerCompanyName }}
							</a-form-item>
						</a-col>
						<a-col
							:span="12"
							class="row"
						>
							<a-form-item label="买方名称">
								{{ myServiceFeeConfirmModel.buyerCompanyName }}
							</a-form-item>
						</a-col>
					</a-row>
					<div class="slTitleAssis">融资明细</div>
					<a-row>
						<a-table
							class="new-table"
							rowKey="finBeginDate"
							:columns="rongzi"
							:dataSource="myServiceFeeConfirmDataSource"
							:pagination="false"
							:defaultExpandAllRows="true"
						>
							<a-table
								slot="expandedRowRender"
								slot-scope="record"
								:columns="rongziInner"
								:data-source="record.repayList"
								rowKey="repayDate"
								:pagination="false"
							>
							</a-table>
						</a-table>
					</a-row>
				</a-form>
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
							style="padding-left: 10px"
						>
							<a-form-item label="服务费金额（元）">
								<span style="color: #f45655; font-size: 18px"
									>{{ myServiceFeeConfirmserviceFeeInfoModel.serviceFeeAmount }}元</span
								>
							</a-form-item>
						</a-col>
					</a-row>
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
							<a-form-item label="服务费协议编号">
								{{ myServiceFeeConfirmserviceFeeInfoModel.serviceFeeAgreementNo }}
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
							<a-form-item label="备注">
								{{ myServiceFeeConfirmserviceFeeInfoModel.remarks }}
							</a-form-item>
						</a-col>
					</a-row>
				</a-form>
			</div>
			<div class="kaipiao-content">
				<div class="slTitleAssis">开票信息</div>
				<a-form
					:form="myServiceFeeConfirmForm"
					:label-col="{ span: 6 }"
					:wrapper-col="{ span: 18 }"
				>
					<a-row>
						<a-col
							:span="12"
							class="row"
						>
							<a-form-item label="企业名称">
								{{ myServiceFeeConfirmKaipiao.companyName }}
							</a-form-item>
						</a-col>
						<a-col
							:span="12"
							class="row"
						>
							<a-form-item label="税号">
								{{ myServiceFeeConfirmKaipiao.bizNo }}
							</a-form-item>
						</a-col>
						<a-col
							:span="12"
							class="row"
						>
							<a-form-item label="电话号码">
								{{ myServiceFeeConfirmKaipiao.contractPhone }}
							</a-form-item>
						</a-col>
						<a-col
							:span="12"
							class="row"
						>
							<a-form-item label="企业地址">
								{{ myServiceFeeConfirmKaipiao.address }}
							</a-form-item>
						</a-col>

						<a-col
							:span="12"
							class="row"
						>
							<a-form-item label="开户行">
								{{ myServiceFeeConfirmKaipiao.subbranchName }}
							</a-form-item>
						</a-col>
						<a-col
							:span="12"
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
import { API_ServiceFeeStatementPreviewContract, API_DOWNLPREVIEWTE } from '@/v2/center/financeCenter/api/index';
import comDownload from '@sub/utils/comDownload.js';
import { mapGetters } from 'vuex';
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
			feeStatus: '',
			rongzi: [
				{
					title: '融资起息日',
					dataIndex: 'finBeginDate'
				},
				{
					title: '融资到息日',
					dataIndex: 'finEndDate'
				},
				{
					title: '融资金额（元）',
					dataIndex: 'finAmount'
				},
				{
					title: '金融机构',
					dataIndex: 'bankName'
				}
			],
			rongziInner: [
				{
					title: '序号',
					customRender: (text, record, index) => `${index + 1}`
				},
				{
					title: '还款日期',
					dataIndex: 'repayDate'
				},
				{
					title: '还款总额（元）',
					dataIndex: 'repayAmount'
				},
				{
					title: '还款本金（元）',
					dataIndex: 'repayPrincipal'
				},
				{
					title: '还款利息（元）',
					dataIndex: 'repayInterest'
				}
			],
			newPdfUrl: '',
			invalidPdfPath: ''
		};
	},
	components: {
		Breadcrumb
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		})
	},
	mounted() {
		this.getDetail();
	},
	methods: {
		// 打开合同详情页
		openOrder() {
			let routerData = this.$router.resolve({
				path: '/center/contract/' + this.orderType + '/online/detail',
				query: {
					id: this.orderId,
					type: this.orderType.toUpperCase()
				}
			});
			window.open(routerData.href, '_blank');
		},
		openPdf(type) {
			window.open(this[type], '_blank');
		},
		getDetail() {
			API_ServiceFeeStatementPreviewContract({ serviceFeeId: this.$route.query.id }).then(res => {
				if (res.success) {
					this.feeStatus = res.data.status;
					this.orderId = res.data.orderId;
					this.orderType = (res.data.orderType || '').toLowerCase();
					this.ticketPdfUrl = res.data.ticketPdfUrl;
					this.newPdfUrl = res.data.newPdfPath;
					this.invalidPdfPath = res.data.invalidPdfPath;
					this.myServiceFeeConfirmModel = res.data.tradeInfo;
					this.myServiceFeeConfirmDataSource = res.data.tradeInfo.financing;
					this.myServiceFeeConfirmserviceFeeInfoModel = res.data.serviceFeeInfo;
					this.myServiceFeeConfirmKaipiao = res.data.invoiceInfo;
					this.myServiceFeeConfirmForm.setFieldsValue(this.myServiceFeeConfirmKaipiao);
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
<style lang="less">
.myServiceFeeDetail {
	background-color: #f4f5f8;
	.rongzi-content,
	.kaipiao-content,
	.fw-content,
	.fujian-content {
		background-color: #fff;
		margin-bottom: 10px;
	}

	.row {
		margin-bottom: 20px;
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
	.ant-form-item {
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
