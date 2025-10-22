<template>
	<a-modal
		:visible="visible"
		:footer="null"
		@cancel="visible = false"
		width="80%"
	>
		<div class="FinancingDetail">
			<div class="title-content">
				<div
					class="s-card-title"
					style="position: relative; margin-top: 0"
				>
					<span>融资详情</span>
				</div>
			</div>
			<a-tabs default-active-key="1">
				<a-tab-pane
					key="1"
					tab="融资信息"
					style="flex-direction: column"
				>
					<div class="rz-content">
						<div class="title">融资基本信息</div>
						<a-row
							v-if="detailData.auditResult == 'REJECT'"
							style="margin-bottom: 20px"
						>
							<a-form-item label="审核结果">
								<span style="color: red">{{ detailData.auditResultText }}</span>
							</a-form-item>
							<a-form-item label="审核意见">
								{{ detailData.auditOpinion }}
							</a-form-item>
						</a-row>
						<a-row>
							<a-col
								:span="12"
								class="row"
							>
								<a-form-item label="融资方">
									{{ detailData.sellerName }}
								</a-form-item>
								<a-form-item label="出资机构">
									{{ detailData.bankName }}
								</a-form-item>
								<a-form-item label="融资金额（元）">
									{{ detailData.amount }}
								</a-form-item>

								<a-form-item label=""> </a-form-item>
								<a-form-item label="收款账号">
									{{ detailData.loanNo }}
								</a-form-item>
								<a-form-item label="收款账号开户名">
									{{ detailData.loanBankName }}
								</a-form-item>
								<a-form-item label="收款账号开户行">
									{{ detailData.loanBankBranch }}
								</a-form-item>
								<a-form-item label="融资说明">
									<div style="max-width: 400px">{{ detailData.remark }}</div>
								</a-form-item>
							</a-col>
							<a-col
								:span="12"
								class="row"
							>
								<a-form-item label="融资比例（%）">
									{{ detailData.financingRatio }}
								</a-form-item>
								<a-form-item label="融资利率（%）">
									{{ detailData.rate }}
								</a-form-item>
								<a-form-item label="逾期日利率（%）">
									{{ detailData.overdueRate }}
								</a-form-item>
								<a-form-item label=""> </a-form-item>
								<a-form-item label="回款账户">
									{{ detailData.acctNo }}
								</a-form-item>
								<a-form-item label="回款账号开户名">
									{{ detailData.acctBankName }}
								</a-form-item>
								<a-form-item label="回款账号开户行">
									{{ detailData.acctBankBranch }}
								</a-form-item>
							</a-col>
						</a-row>
					</div>
					<div
						class="rz-content"
						v-if="payType != '1' && payType != '2'"
					>
						<div class="title">资产信息</div>
						<a-row>
							<a-table
								rowKey="receivableSerialNo"
								:columns="rongzi"
								:dataSource="rongziDataSource"
								:pagination="false"
								:defaultExpandAllRows="true"
								:locale="{ emptyText: '暂无数据' }"
							>
							</a-table>
						</a-row>
					</div>
					<div
						class="rz-content"
						v-if="xieyiDataSource.length > 0"
					>
						<div class="title">融资协议</div>
						<a-row>
							<a-button
								type="primary"
								ghost
								class="downbtn"
								@click="downAll"
								>下载所有协议</a-button
							>
							<a-table
								rowKey="name"
								:columns="xieyi"
								:dataSource="xieyiDataSource"
								:pagination="false"
								:defaultExpandAllRows="true"
								:locale="{ emptyText: '暂无数据' }"
							>
								<div
									slot="action"
									slot-scope="text, record"
								>
									<a
										href="javascript:;"
										style="margin-right: 10px"
										@click="viewPDF(record)"
										>查看</a
									>
									<a
										href="javascript:;"
										@click="downPDF(record)"
										>下载</a
									>
								</div>
							</a-table>
						</a-row>
					</div>
				</a-tab-pane>
				<a-tab-pane
					key="2"
					tab="放还款信息"
					style="flex-direction: column"
				>
					<div v-if="fangkuanData">
						<div class="rz-content">
							<div class="title">放款信息</div>
							<a-row>
								<a-col
									:span="8"
									class="row"
								>
									<a-form-item label="出资机构">
										{{ fangkuanData.bankName }}
									</a-form-item>
									<a-form-item label="融资申请日期">
										{{ fangkuanData.applyDate }}
									</a-form-item>
								</a-col>
								<a-col
									:span="8"
									class="row"
								>
									<a-form-item label="融资金额">
										{{ fangkuanData.applyAmount }}
									</a-form-item>
									<a-form-item label="放款金额">
										{{ fangkuanData.finAmount }}
									</a-form-item>
								</a-col>
								<a-col
									:span="8"
									class="row"
								>
									<a-form-item label="融资起息日">
										{{ fangkuanData.beginDate }}
									</a-form-item>
									<a-form-item label="融资到期日期">
										{{ fangkuanData.endDate }}
									</a-form-item>
								</a-col>
							</a-row>
						</div>
						<div class="rz-content">
							<div class="title">还款信息</div>
							<a-row>
								<a-col
									:span="12"
									class="row"
								>
									<a-form-item label="到期合计金额">
										{{ fangkuanData.dueTotalAmount }}
									</a-form-item>
									<a-form-item label="未还款合计">
										{{ fangkuanData.unPayAmount }}
									</a-form-item>
								</a-col>
								<a-col
									:span="12"
									class="row"
								>
									<a-form-item label="已还款合计">
										{{ fangkuanData.totalRepayAmount }}
									</a-form-item>
									<a-form-item label="融资状态">
										{{ fangkuanData.statusText }}
									</a-form-item>
								</a-col>
							</a-row>
							<a-row>
								<a-table
									rowKey="receivableSerialNo"
									:columns="fangkuan"
									:dataSource="fangkuanDataSource"
									:pagination="false"
									:defaultExpandAllRows="true"
									:locale="{ emptyText: '暂无数据' }"
								>
									<div
										slot="action"
										slot-scope="text, record"
									>
										<a
											href="javascript:;"
											@click="exportPDF(record.id)"
											>查看</a
										>
									</div>
								</a-table>
							</a-row>
						</div>
					</div>
					<div
						v-else
						style="padding: 30px; background-color: #fff"
					>
						暂无数据
					</div>
				</a-tab-pane>
			</a-tabs>
		</div>
	</a-modal>
</template>

<script>
import {
	API_GetUpstreamFinanceDetailFK,
	API_FinancingDetaildownloadFileAll,
	API_FinancingDetaildownloadFile,
	API_BusinessMonitoringUpstreamPaymentFinanceDetail,
	API_BusinessMonitoringDownstreamPaymentFinanceDetail,
	API_FullBusinessLineDetailPaymentFinanceDetail
} from '@/v2/center/monitoring/api';
import comDownload from '@sub/utils/comDownload.js';
import { filePreview } from '@/v2/utils/file';

const rongzi = [
	{ title: '应收账款流水号', dataIndex: 'receivableSerialNo' },
	{ title: '买方名称', dataIndex: 'buyerName' },
	{ title: '合同编号', dataIndex: 'contractNo' },
	{ title: '应收账款金额', dataIndex: 'receivableAmount' },
	{ title: '应收账款起始日期', dataIndex: 'beginDate' },
	{ title: '应收账款到期日期', dataIndex: 'endDate' }
];

const rongziYufu = [
	{ title: '预付账款流水号', dataIndex: 'receivableSerialNo' },
	{ title: '买方名称', dataIndex: 'buyerName' },
	{ title: '合同编号', dataIndex: 'contractNo' },
	{ title: '预付账款金额', dataIndex: 'receivableAmount' },
	{ title: '预付账款起始日期', dataIndex: 'beginDate' },
	{ title: '预付账款到期日期', dataIndex: 'endDate' }
];

export default {
	name: 'FinanceDetail',
	data() {
		return {
			rongzi: [],
			contractType: '',
			serialNo: '',
			payType: '',
			financingApplyId: '',
			visible: false,
			rongziDataSource: [],
			xieyiDataSource: [],
			fangkuanDataSource: [],
			detailData: {},
			fangkuanData: '',
			xieyi: [
				{
					title: '序号',
					dataIndex: '',
					key: 'rowIndex',
					width: 60,
					align: 'center',
					customRender(t, r, index) {
						return parseInt(index) + 1;
					}
				},
				{
					title: '合同名称',
					dataIndex: 'name'
				},
				{
					title: '状态',
					dataIndex: 'statusText'
				},
				{
					title: '操作',
					key: 'action',
					scopedSlots: { customRender: 'action' }
				}
			],
			fangkuan: [
				{
					title: '序号',
					dataIndex: '',
					key: 'rowIndex',
					width: 60,
					align: 'center',
					customRender(t, r, index) {
						return parseInt(index) + 1;
					}
				},
				{
					title: '还款日期',
					dataIndex: 'repayDate'
				},
				{
					title: '还款总额',
					dataIndex: 'repayAmount'
				},
				{
					title: '还款本金',
					dataIndex: 'repayPrincipal'
				},
				{
					title: '还款利息',
					dataIndex: 'repayInterest'
				},
				{
					title: '还款罚息',
					dataIndex: 'fxPaidAmount'
				}
			]
		};
	},
	methods: {
		showModal(data) {
			this.visible = true;
			const { serialNo, payType, payMethod, contractType, businessLineType, upOrderNo, downOrderNo } = data;
			this.contractType = contractType;
			this.serialNo = serialNo;
			this.payType = payType;
			this.upOrderNo = upOrderNo;
			this.downOrderNo = downOrderNo;
			this.businessLineType = businessLineType;

			this.rongzi = rongzi;
			if (payMethod === 4) {
				this.rongzi = rongziYufu;
			}
			this.getDetail();
		},
		downPDF(record) {
			API_FinancingDetaildownloadFile({
				contractFileId: record.id
			}).then(res => {
				comDownload(res, record.url, null);
			});
		},
		viewPDF(record) {
			filePreview(record.url);
		},
		downAll() {
			API_FinancingDetaildownloadFileAll({
				financingApplyId: this.financingApplyId
			}).then(res => {
				comDownload(res, undefined, '融资协议.zip');
			});
		},
		getDetail() {
			const fct = [
				API_BusinessMonitoringUpstreamPaymentFinanceDetail,
				API_BusinessMonitoringDownstreamPaymentFinanceDetail,
				API_FullBusinessLineDetailPaymentFinanceDetail
			][this.contractType];
			const params = {
				payNo: this.serialNo,
				upOrderNo: this.upOrderNo,
				businessLineType: this.businessLineType,
				downOrderNo: this.downOrderNo
			};
			// API_GetUpstreamFinanceDetail({ serialNo: this.serialNo }).then((res) => {
			fct(params).then(res => {
				if (res.success) {
					this.detailData = res.data || {};
					this.rongziDataSource = [res.data];
					this.xieyiDataSource = res.data.contractList || [];
					this.financingApplyId = res.data.id;
				}
			});
			API_GetUpstreamFinanceDetailFK({ serialNo: this.serialNo }).then(res => {
				if (res.success) {
					this.fangkuanData = res.result || {};
					this.fangkuanDataSource = res.result.repayList || [];
				}
			});
		}
	}
};
</script>

<style lang="less">
.FinancingDetail {
	.downbtn {
		margin-bottom: 14px;
	}
	.ant-tabs-bar {
		background-color: #fff;
		margin-bottom: 0;
		border: none;
	}
	.title-content {
		height: 55px;
		background-color: #fff;
		padding-top: 16px;
		padding-left: 20px;
		border-bottom: 1px solid rgb(238, 240, 242);
	}
	.ant-form-item {
		display: flex !important;
		margin-bottom: 15px;
	}

	margin: -20px;
	background-color: #f4f5f8;
	.rz-content {
		padding: 20px;
		background-color: #fff;
		margin-bottom: 10px;
	}

	.title {
		font-size: 15px;
		padding: 14px 0;
		margin-bottom: 30px;
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
			width: 120px;
			margin-right: 15px;
			display: inline-block;
			text-align: right;
		}
	}
}
</style>
