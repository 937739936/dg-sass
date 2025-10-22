<template>
	<div class="tabs-content">
		<a-row
			type="flex"
			:gutter="30"
		>
			<a-col>
				<div class="slTitleAssis">结算信息</div>
			</a-col>
			<a-col class="mt32">
				<span class="label">已结算数量：</span>
				<span>{{ detail.statementedQuantity | formatMoney(2) }}吨</span>
			</a-col>
			<a-col class="mt32">
				<span class="label">已结算金额：</span>
				<span>{{ detail.statementedAmount | formatMoney(2) }}元</span>
			</a-col>
		</a-row>
		<div class="table-box">
			<a-table
				:columns="columns"
				class="new-table"
				:bordered="false"
				rowKey="id"
				:dataSource="detail.statementVOList"
				:pagination="false"
				:scroll="{ x: true }"
			>
				<template
					slot="settleUnitPrice"
					slot-scope="text"
				>
					<span>{{ text | formatMoney(2) }}</span>
				</template>
				<template
					slot="settleQuantity"
					slot-scope="text"
				>
					<span>{{ text | formatMoney(2) }}</span>
				</template>
				<template
					slot="currentSettleAmount"
					slot-scope="text"
				>
					<span>{{ text | formatMoney(2) }}</span>
				</template>
				<template
					slot="action"
					slot-scope="text, items"
				>
					<a @click="viewDetail(items)">详情</a>
				</template>
			</a-table>
		</div>
	</div>
</template>

<script>
const columns = [
	{ title: '结算单编号', dataIndex: 'serialNo' },
	{ title: '结算日期', dataIndex: 'settleTime' },
	{
		title: '结算单价（元/吨）',
		dataIndex: 'settleUnitPrice',
		scopedSlots: { customRender: 'settleUnitPrice' }
	},
	{
		title: '结算数量（吨）',
		dataIndex: 'settleQuantity',
		scopedSlots: { customRender: 'settleQuantity' }
	},
	{
		title: '结算金额（元）',
		dataIndex: 'currentSettleAmount',
		scopedSlots: { customRender: 'currentSettleAmount' }
	},
	{ title: '状态', dataIndex: 'statusName' },
	{
		title: '操作',
		dataIndex: 'action',
		scopedSlots: { customRender: 'action' },
		width: 80,
		fixed: 'right'
	}
];
import { API_getOrderStatementResp } from '@/v2/center/trade/api/contract';

export default {
	data() {
		return {
			columns,
			detail: {}
		};
	},
	props: ['data'],
	methods: {
		init() {
			API_getOrderStatementResp({ orderId: this.data.contract.id }).then(res => {
				if (res.success) {
					this.detail = res.data;
				}
			});
		},
		viewDetail(items) {
			//判断是否有类型，非必填，有更好
			let type = this.$route.query.type;
			if (type) {
				type = type.toLowerCase();
			} else {
				type = 'buy';
			}
			let routerData = this.$router.resolve({
				path: `/center/settle/${type}/onlinedetail`,
				query: {
					id: items.id
				}
			});
			window.open(routerData.href, '_blank');
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
.slTitleAssis {
	margin-top: 30px;
}
.tabs-content {
	width: 100%;
	& > ::v-deep.ant-row-flex {
		width: 100%;
	}
}
.mt32 {
	margin-top: 32px;
}
</style>
