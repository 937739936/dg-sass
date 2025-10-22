<template>
	<div>
		<a-table
			:columns="columns"
			class="new-table"
			:bordered="false"
			:rowKey="record => record.index"
			:scroll="{ x: 1000, y: 450 }"
			:dataSource="dataSource"
			:pagination="false"
		>
			<template
				slot="action"
				slot-scope="text, items"
			>
				<div class="column-flex">
					<a href="#">查看发票</a>
				</div>
			</template>
		</a-table>
		<div class="bottom">
			<div class="tip-box">
				<span>共计数量</span>
				<span class="num">{{ statisticsInfo.quantity.toFixed(2) }}</span>
				<span>共计金额</span>
				<span class="num">￥{{ statisticsInfo.amount | formatMoney(2) }}</span>
				<span>共计税额</span>
				<span class="num">￥{{ statisticsInfo.taxAmount | formatMoney(2) }}</span>
				<span>共计价税合计</span>
				<span class="num">￥{{ statisticsInfo.totalAmount | formatMoney(2) }}</span>
			</div>
		</div>
	</div>
</template>

<script>
import { listColumns2, listDetailColumns2 } from '../config';

export default {
	props: {
		dataSource: {
			default: () => {
				return [];
			}
		},
		type: {
			default: 'list'
		}
	},
	computed: {
		columns() {
			if (this.type == 'list') {
				return listColumns2;
			}
			return listDetailColumns2;
		},
		statisticsInfo() {
			const obj = {
				quantity: 0,
				amount: 0,
				taxAmount: 0,
				totalAmount: 0
			};
			this.dataSource.forEach(el => {
				obj.quantity += el.quantity ? Number(el.quantity) : 0;
				obj.amount += el.amount ? Number(el.amount) : 0;
				obj.taxAmount += el.tax ? Number(el.tax) : 0;
				obj.totalAmount += el.totalAmount ? Number(el.totalAmount) : 0;
			});
			return obj;
		}
	},
	data() {
		return {};
	},
	methods: {},
	components: {}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style scoped lang="less">
.bottom {
	display: flex;
	justify-content: flex-end;
	margin-top: 20px;
}
.tip-box {
	color: var(--text-title, #77889d);
	.num {
		color: #f46332;
		font-family: D-DIN-PRO;
		font-weight: 600;
		margin-right: 20px;
		margin-left: 10px;
	}
}
</style>
