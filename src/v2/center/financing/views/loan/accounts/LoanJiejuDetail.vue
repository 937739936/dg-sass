<template>
	<div class="LoanJiejuDetail">
		<div class="title-content">
			<div
				class="s-card-title"
				style="position: relative; margin-left: 0; margin-top: 0"
			>
				<span>查看借据</span>
			</div>
		</div>
		<div class="rz-content">
			<div class="title">融资信息</div>
			<a-row style="margin-bottom: 30px">
				<a-col
					:span="12"
					class="row"
				>
					<a-form-item label="融资方">
						{{ detailData.financier || '-' }}
					</a-form-item>
					<a-form-item label="核心企业">
						{{ detailData.buyerName || '-' }}
					</a-form-item>
					<a-form-item label="融资放款日期">
						{{ detailData.beginDate || '-' }}
					</a-form-item>
					<a-form-item
						label="利息收取方式"
						v-if="detailData.forwardCharge == 1"
					>
						{{ detailData.interestTypeDesc || '-' }}
					</a-form-item>
				</a-col>
				<a-col
					:span="12"
					class="row"
				>
					<a-form-item label="融资金额（元）">
						<span style="color: red">{{ detailData.applyAmount || '-' }}</span>
					</a-form-item>
					<a-form-item label="放款金额（元）">
						<span style="color: red">{{ detailData.finAmount || '-' }}</span>
					</a-form-item>
					<a-form-item label="融资到期日期">
						{{ detailData.endDate || '-' }}
					</a-form-item>
					<a-form-item
						label="利息（元）"
						v-if="detailData.forwardCharge == 1"
					>
						{{ detailData.loanInterest || '-' }}
					</a-form-item>
				</a-col>
			</a-row>

			<a-row style="margin-bottom: 30px">
				<a-col
					:span="12"
					class="row"
				>
					<a-form-item label="资金方收款账号开户名">
						{{ detailData.acctBankName || '-' }}
					</a-form-item>
					<a-form-item label="资金方收款账号开户行">
						{{ detailData.acctBankBranch || '-' }}
					</a-form-item>
				</a-col>
				<a-col
					:span="12"
					class="row"
				>
					<a-form-item label="资金方收款账号">
						{{ detailData.acctNo || '-' }}
					</a-form-item>
				</a-col>
			</a-row>
			<a-row style="margin-bottom: 30px">
				<a-col
					:span="12"
					class="row"
				>
					<a-form-item label="已还款本金（元）">
						<span style="color: red">{{ detailData.repayPrincipal || '-' }}</span>
					</a-form-item>
					<a-form-item label="已还款利息（元）">
						<span style="color: red">{{ detailData.repayInterest || '-' }}</span>
					</a-form-item>
					<a-form-item label="已还款总额（元）">
						<span style="color: red">{{ detailData.repayAmount || '-' }}</span>
					</a-form-item>
				</a-col>
				<a-col
					:span="12"
					class="row"
				>
					<a-form-item label="其他费用（元）">
						<span style="color: red">{{ detailData.serviceCharge || '-' }}</span>
					</a-form-item>
				</a-col>
			</a-row>
			<a-row>
				<a-col
					:span="12"
					class="row"
				>
					<a-form-item label="融资状态">
						{{ detailData.statusText }}
					</a-form-item>
				</a-col>
			</a-row>
		</div>
		<div class="rz-content">
			<div class="title">还款记录</div>

			<a-row>
				<a-table
					rowKey="receivableSerialNo"
					:columns="huankuan"
					:dataSource="huankuanDataSource"
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
	</div>
</template>

<script>
import { API_FinancingJiejuJR } from '@/v2/center/financing/api/index.js';

export default {
	name: 'LoanJiejuDetail',
	data() {
		return {
			huankuanDataSource: [],
			detailData: {},
			huankuan: [
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
					title: '还款利息（元）',
					dataIndex: 'repayInterest'
				},
				{
					title: '其他费用（元）',
					dataIndex: 'serviceCharge'
				}
			]
		};
	},
	components: {},
	computed: {},
	mounted() {
		this.loanId = this.$route.query.id || '';

		this.getDetail();
	},
	methods: {
		getDetail() {
			API_FinancingJiejuJR({ loanId: this.loanId }).then(res => {
				if (res.success) {
					this.detailData = res.data || {};
					this.huankuanDataSource = res.data.repayList || {};
				}
			});
		}
	}
};
</script>

<style lang="less">
.LoanJiejuDetail {
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
		display: flex;
		margin-bottom: 10px;
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
			min-width: 120px;
			margin-right: 15px;
			display: inline-block;
			text-align: right;
		}
	}
}
</style>
