<template>
	<div class="LoanDetail">
		<div class="title-content">
			<div
				class="s-card-title"
				style="position: relative; margin-left: 0; margin-top: 0"
			>
				<span>详情信息</span>
			</div>
		</div>
		<a-tabs :default-active-key="actKey">
			<a-tab-pane
				key="1"
				tab="放还款详情"
				style="flex-direction: column"
			>
				<div class="rz-content">
					<div class="title">放款信息</div>
					<a-row>
						<a-col
							:span="12"
							class="row"
						>
							<a-form-item label="融资编号">
								{{ fangkuanData.financingApplySerialNo }}
							</a-form-item>
							<a-form-item label="融资方">
								{{ fangkuanData.financier }}
							</a-form-item>
							<a-form-item label="融资利率（%）">
								{{ fangkuanData.rate }}
							</a-form-item>
							<a-form-item label="融资金额（元）">
								{{ fangkuanData.applyAmount }}
							</a-form-item>
							<a-form-item label="融资放款日期">
								{{ fangkuanData.loanDate }}
							</a-form-item>
						</a-col>
						<a-col
							:span="12"
							class="row"
						>
							<a-form-item label="出资机构">
								{{ fangkuanData.bankName }}
							</a-form-item>
							<a-form-item label="放款类型">
								{{ fangkuanData.loanTypeText }}
							</a-form-item>
							<a-form-item label="逾期利率（%）">
								{{ fangkuanData.overdueRate }}
							</a-form-item>
							<a-form-item label="放款金额（元）">
								{{ fangkuanData.finAmount }}
							</a-form-item>
							<a-form-item label="融资到期日期">
								{{ fangkuanData.endDate }}
							</a-form-item>
						</a-col>
					</a-row>
				</div>
				<div
					class="rz-content"
					v-if="fangkuanData.assetBillVO"
				>
					<div class="title">融单信息</div>
					<a-row>
						<a-col
							:span="12"
							class="row"
						>
							<a-form-item label="融单编号">
								{{ fangkuanData.assetBillVO.bankBillNo }}
							</a-form-item>
							<a-form-item label="开立方">
								{{ fangkuanData.assetBillVO.issuerName }}
							</a-form-item>
							<a-form-item label="开立日期">
								{{ fangkuanData.assetBillVO.issueDate }}
							</a-form-item>
							<a-form-item label="贴现日期">
								{{ fangkuanData.assetBillVO.discountedDate }}
							</a-form-item>
						</a-col>
						<a-col
							:span="12"
							class="row"
						>
							<a-form-item label="融单金额（元）">
								{{ fangkuanData.assetBillVO.billAmount }}
							</a-form-item>
							<a-form-item label="接收方">
								{{ fangkuanData.assetBillVO.receiverName }}
							</a-form-item>
							<a-form-item label="承诺付款日">
								{{ fangkuanData.assetBillVO.acceptanceDate }}
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
							rowKey="id"
							:columns="fangkuan"
							:dataSource="fangkuanDataSource"
							:pagination="false"
							:defaultExpandAllRows="true"
							:locale="{ emptyText: '暂无数据' }"
						>
						</a-table>
					</a-row>
					<div style="text-align: center; margin-top: 30px">
						<a-button @click="$router.back()">返回</a-button>
					</div>
				</div>
			</a-tab-pane>
			<a-tab-pane
				key="2"
				tab="还款申请记录"
				style="flex-direction: column"
			>
				<div class="rz-content">
					<a-row>
						<a-button
							type="primary"
							@click="pushAndSyncLoan"
							style="margin-bottom: 20px"
							><div>同步</div></a-button
						>
					</a-row>
					<a-row>
						<a-table
							rowKey="id"
							:columns="fangkuanApply"
							:dataSource="fangkuanApplyDataSource"
							:pagination="false"
							:defaultExpandAllRows="true"
							:locale="{ emptyText: '暂无数据' }"
						>
							<div
								slot="serialNo"
								slot-scope="text, record"
							>
								<a
									href="javascript:;"
									@click="$router.push('loanAdvanceApplyDetail?id=' + record.id + '')"
									>{{ text }}</a
								>
							</div>
						</a-table>
					</a-row>
					<div style="text-align: center; margin-top: 30px">
						<a-button @click="$router.back()">返回</a-button>
					</div>
				</div>
			</a-tab-pane>
		</a-tabs>
	</div>
</template>

<script>
import { API_GetAdvanceLoanDetail, API_FinancingJRSync } from '@/v2/center/financing/api/index.js';
import num from '@/untils/num.js';
export default {
	data() {
		return {
			fangkuanApplyDataSource: [],
			fangkuanDataSource: [],
			fangkuanData: {},
			actKey: this.$route.query.tab || '1',
			accSub: num.accSub,
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
			],
			fangkuanApply: [
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
					title: '还款申请编号',
					dataIndex: 'serialNo',
					scopedSlots: { customRender: 'serialNo' }
				},
				{
					title: '收款方',
					dataIndex: 'xxx'
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
				},
				{
					title: '状态',
					dataIndex: 'statusText'
				},
				{
					title: '审核意见',
					dataIndex: 'remark'
				}
			]
		};
	},
	components: {},
	computed: {},
	mounted() {
		this.loanId = this.$route.query.id || 'xx';
		this.getDetail();
	},
	methods: {
		pushAndSyncLoan() {
			this.$confirm({
				centered: true,
				title: '确定同步吗?',
				okText: '确定',
				cancelText: '取消',
				onOk: () => {
					API_FinancingJRSync({
						loanId: this.loanId
					}).then(res => {
						if (res.data) {
							this.$message.success('同步成功');
						}
					});
				},
				onCancel() {}
			});
		},
		getDetail() {
			API_GetAdvanceLoanDetail({ loanId: this.loanId }).then(res => {
				if (res.success) {
					this.fangkuanData = res.data;

					this.fangkuanDataSource = res.data.repayList || [];

					this.fangkuanApplyDataSource = res.data.repayApplyList || [];
				}
			});
		}
	}
};
</script>

<style lang="less" scoped>
.LoanDetail {
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
