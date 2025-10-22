<template>
	<div
		class="FinancingDetail"
		:style="{ margin: '-20px' }"
	>
		<div class="title-content">
			<div
				class="s-card-title"
				style="position: relative; margin-left: 0; margin-top: 0"
			>
				<span>票据融资详情</span>
			</div>
		</div>

		<a-tabs default-active-key="1">
			<a-tab-pane
				key="1"
				tab="融资信息"
				style="flex-direction: column"
			>
				<div
					class="rz-content"
					v-if="detailData.auditResult"
					style="margin-bottom: 20px"
				>
					<div class="title">审核结果</div>
					<a-row>
						<a-form-item label="审核人">
							<span>{{ detailData.auditOperator }}</span>
						</a-form-item>
						<a-form-item label="审核时间">
							<span>{{ detailData.auditTime }}</span>
						</a-form-item>
						<a-form-item label="审核结果">
							<span style="color: red">{{ detailData.auditResultText }}</span>
						</a-form-item>
						<a-form-item label="审核意见">
							<span>{{ detailData.auditOpinion }}</span>
						</a-form-item>
					</a-row>
				</div>
				<div class="rz-content">
					<div class="title">融资基本信息</div>
					<a-row>
						<a-col
							:span="12"
							class="row"
						>
							<a-form-item label="融资方">
								{{ detailData.financier }}
							</a-form-item>
							<a-form-item label="出资机构">
								{{ detailData.bankName }}
							</a-form-item>
							<a-form-item label="融资金额（元）">
								{{ detailData.amount }}
							</a-form-item>

							<a-form-item label="收款账号">
								{{ detailData.loanNo }}
							</a-form-item>
							<a-form-item label="收款账号开户名">
								{{ detailData.loanBankName }}
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
							<a-form-item label="逾期利率（%）">
								{{ detailData.overdueRate }}
							</a-form-item>
							<a-form-item label="收款账户开户行">
								{{ detailData.loanBankBranch }}
							</a-form-item>
						</a-col>
					</a-row>
				</div>
				<div class="rz-content">
					<div class="title">票据信息</div>
					<a-row>
						<a-table
							rowKey="billNo"
							:columns="rongzi"
							:dataSource="rongziDataSource"
							:pagination="false"
							:defaultExpandAllRows="true"
							:locale="{ emptyText: '暂无数据' }"
						>
							<div
								slot="billNo"
								slot-scope="text, record"
							>
								<a
									href="javascript:;"
									@click="openAssets(record)"
									>{{ text }}</a
								>
							</div>
						</a-table>
					</a-row>
				</div>
				<div class="rz-content">
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
					<div
						style="text-align: center; margin-top: 30px"
						v-if="!$route.query.mobile"
					>
						<a-button @click="$router.back()">返回</a-button>
					</div>
				</div>
			</a-tab-pane>
			<a-tab-pane
				key="2"
				tab="放还款信息"
				style="flex-direction: column"
			>
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
							<a-form-item label="融资金额（元）">
								{{ fangkuanData.applyAmount }}
							</a-form-item>
							<a-form-item label="放款金额（元）">
								{{ fangkuanData.finAmount }}
							</a-form-item>
						</a-col>
						<a-col
							:span="8"
							class="row"
						>
							<a-form-item label="融资放款日期">
								{{ fangkuanData.loanDate }}
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
							<a-form-item label="应还本金（元）">
								{{ fangkuanData.finAmount }}
							</a-form-item>
							<a-form-item label="已还本金合计（元）">
								{{ accSub(fangkuanData.finAmount, fangkuanData.unPayPrincipal) }}
							</a-form-item>
						</a-col>
						<a-col
							:span="12"
							class="row"
						>
							<a-form-item label="未还本金合计（元）">
								{{ fangkuanData.unPayPrincipal }}
							</a-form-item>
							<a-form-item label="已还款总额（元）">
								{{ fangkuanData.totalRepayAmount }}
							</a-form-item>
						</a-col>
					</a-row>
					<a-row>
						<a-form-item label="融资状态">
							{{ fangkuanData.statusText }}
						</a-form-item>
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
						</a-table>
					</a-row>
					<div
						style="text-align: center; margin-top: 30px"
						v-if="!$route.query.mobile"
					>
						<a-button
							@click="$router.back()"
							style="margin-right: 30px"
							>返回</a-button
						>
					</div>
				</div>
			</a-tab-pane>
		</a-tabs>
	</div>
</template>

<script>
import ENV from '@/v2/config/env';
import comDownload from '@sub/utils/comDownload.js';
import num from '@/untils/num.js';
import {
	API_FinancingDetail,
	API_FinancingDetailFK,
	API_FinancingDetaildownloadFileAll,
	API_FinancingDetaildownloadFile
} from '@/v2/center/financing/api/index.js';

export default {
	data() {
		return {
			accSub: num.accSub,
			rongziDataSource: [],
			xieyiDataSource: [],
			fangkuanDataSource: [],
			BASE_NET: ENV.BASE_NET,
			detailData: {},
			fangkuanData: {},
			rongzi: [
				{
					title: '云票编号',
					dataIndex: 'billNo',
					scopedSlots: { customRender: 'billNo' }
				},
				{
					title: '开立方',
					dataIndex: 'issuerName'
				},
				{
					title: '转让方',
					dataIndex: 'transferName'
				},
				{
					title: '接收方',
					dataIndex: 'receiverName'
				},
				{
					title: '云票金额（元）',
					dataIndex: 'billAmount'
				},
				{
					title: '开立日期',
					dataIndex: 'issueDate'
				},
				{
					title: '承诺付款日',
					dataIndex: 'acceptanceDate'
				}
			],
			xieyi: [
				{
					title: '序号',
					dataIndex: '',
					key: 'rowIndex',
					width: 60,
					align: 'center',
					customRender: function (t, r, index) {
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
				{ title: '操作', key: 'action', scopedSlots: { customRender: 'action' } }
			],
			fangkuan: [
				{
					title: '序号',
					dataIndex: '',
					key: 'rowIndex',
					width: 60,
					align: 'center',
					customRender: function (t, r, index) {
						return parseInt(index) + 1;
					}
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
					title: '还款利息',
					dataIndex: 'repayInterest'
				}
			]
		};
	},
	components: {},
	computed: {},
	mounted() {
		this.financingApplyId = this.$route.query.id || '';
		this.getDetail();
	},
	methods: {
		openAssets(record) {
			const { href } = this.$router.resolve({
				path: '/center/counterfoil/record/yunDetail',
				query: {
					id: record.id
				}
			});

			window.open(href, '_new');
		},
		downPDF(record) {
			API_FinancingDetaildownloadFile({
				contractFileId: record.id
			}).then(res => {
				comDownload(res, record.url, null);
			});
		},
		viewPDF(record) {
			window.open(record.url, '_blank');
		},
		downAll() {
			API_FinancingDetaildownloadFileAll({
				financingApplyId: this.financingApplyId
			}).then(res => {
				comDownload(res, undefined, `融资协议.zip`);
			});
		},
		getDetail() {
			API_FinancingDetail({ financingApplyId: this.financingApplyId }).then(res => {
				if (res.success) {
					this.detailData = res.data || {};
					this.rongziDataSource = [res.data.billDetail];
					this.xieyiDataSource = res.data.contractList || [];
				}
			});
			API_FinancingDetailFK({ financingApplyId: this.financingApplyId }).then(res => {
				if (res.success) {
					this.fangkuanData = res.data || {};

					this.fangkuanDataSource = res.data.repayList || [];
				}
			});
		}
	}
};
</script>

<style lang="less" scoped>
.FinancingDetail {
	background-color: #f4f5f8;
	.downbtn {
		margin-bottom: 14px;
	}
	::v-deep .ant-tabs-bar {
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
		display: flex;
		margin-bottom: 15px;
	}

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
