<template>
	<div>
		<a-row
			type="flex"
			:gutter="[20, 20]"
			justify="space-between"
		>
			<a-col flex="326px">
				<div class="item item1">
					<p class="title">融资放款金额（元）</p>
					<p class="num">¥{{ detailData.loanAmountSummary }}</p>
				</div>
			</a-col>
			<a-col flex="326px">
				<div class="item item2">
					<p class="title">融资还款本金（元）</p>
					<p class="num">¥{{ detailData.repayAmountSummary }}</p>
				</div>
			</a-col>
			<a-col flex="326px">
				<div class="item item3">
					<p class="title">融资存量金额（元）</p>
					<p class="num">¥{{ detailData.stockAmountSummary }}</p>
				</div>
			</a-col>
			<a-col flex="326px">
				<div class="item item4">
					<p class="title">七日内到期金额（元）</p>
					<p class="num">¥{{ detailData.stockAmountSummaryExpireInNextWeek }}</p>
				</div>
			</a-col>
		</a-row>
	</div>
</template>
<script>
import { API_FinancingLoanSumDetail } from '@/v2/center/financing/api/index.js';

export default {
	props: ['type'],
	data() {
		return {
			detailData: {}
		};
	},
	components: {},

	mounted() {},

	methods: {
		getDetail(params) {
			API_FinancingLoanSumDetail({
				...params,
				assetType: this.type,
				applyTime1: null,
				applyTime2: null
			}).then(res => {
				this.detailData = res.data;
			});
		}
	}
};
</script>
<style lang="less" scoped>
.item {
	width: 100%;
	height: 88px;
	border-radius: 6px;
	padding: 14px 12px;
	.title {
		font-family: PingFang SC;
		font-size: 14px;
		font-weight: 400;
		line-height: 20px;
		letter-spacing: 0px;
		text-align: left;
		color: rgba(0, 0, 0, 0.4);
		margin-bottom: 12px;
	}
	.num {
		font-family: PingFang SC;
		font-size: 20px;
		font-weight: 500;
		line-height: 28px;
		letter-spacing: 0px;
		text-align: left;
		color: rgba(0, 0, 0, 0.8);
	}
	&.item1 {
		background: #f0f8ff;
	}
	&.item2 {
		background: rgba(255, 249, 240, 1);
	}
	&.item3 {
		background: rgba(235, 250, 239, 1);
	}
	&.item4 {
		background: rgba(240, 248, 255, 1);
		.num {
			color: rgba(27, 117, 223, 1);
		}
	}
}
</style>
