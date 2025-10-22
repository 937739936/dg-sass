<template>
	<div class="slMain mt-10 LoanDetail">
		<a-card :bordered="false">
			<div class="methods-wrap">
				<span
					slot="title"
					class="slTitle"
					>详情信息</span
				>
			</div>
			<div class="rz-content">
				<div class="title">合同信息</div>
				<a-row>
					<a-col
						:span="12"
						class="row"
					>
						<a-form-item label="合同编号">{{ fangkuanData.contractNo }}</a-form-item>
						<a-form-item label="买方企业">{{ fangkuanData.buyerName }}</a-form-item>
						<a-form-item label="合同签订日期">{{ fangkuanData.contractSignDate }}</a-form-item>
					</a-col>
					<a-col
						:span="12"
						class="row"
					>
						<a-form-item label="卖方企业">{{ fangkuanData.sellerName }}</a-form-item>
						<a-form-item label="合同期限">{{ fangkuanData.contractBeginDate }} ~ {{ fangkuanData.contractEndDate }}</a-form-item>
					</a-col>
				</a-row>
			</div>
			<div class="rz-content">
				<div class="title">放款信息</div>
				<a-row>
					<a-col
						:span="12"
						class="row"
					>
						<a-form-item label="放款编号">{{ fangkuanData.serialNo }}</a-form-item>
						<a-form-item label="放款日期">{{ fangkuanData.loanDate }}</a-form-item>
					</a-col>
					<a-col
						:span="12"
						class="row"
					>
						<a-form-item label="放款金额（元）">{{ fangkuanData.finAmount }}</a-form-item>
						<a-form-item label="到期日">{{ fangkuanData.endDate }}</a-form-item>
					</a-col>
				</a-row>
			</div>
			<div class="rz-content">
				<div class="title">还款信息</div>
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
				<div style="text-align: center; margin-top: 30px">
					<a-button @click="$router.back()">返回</a-button>
				</div>
			</div>
		</a-card>
	</div>
</template>

<script>
import { API_GrainGetLoanHuanDetail } from '@/v2/center/storage/api';

export default {
	name: 'LoanDetail',
	data() {
		return {
			fangkuanDataSource: [],
			fangkuanData: {},

			fangkuan: [
				{
					title: '还款编号',
					dataIndex: 'serialNo'
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
					title: '还款日期',
					dataIndex: 'repayDate'
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
		getDetail() {
			API_GrainGetLoanHuanDetail({ loanId: this.loanId }).then(res => {
				if (res.success) {
					this.fangkuanData = res.data || {};
					this.fangkuanDataSource = this.fangkuanData.repayList || [];
				}
			});
		}
	}
};
</script>

<style lang="less" scoped>
.LoanDetail {
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
		margin-bottom: 15px;
	}

	background-color: #f4f5f8;
	.rz-content {
		padding: 20px 0;
		background-color: #fff;
		margin-bottom: 10px;
	}

	.title {
		font-size: 15px;
		padding: 14px 0;
	}
}
</style>
