<template>
	<div class="tabs-content">
		<a-row
			type="flex"
			:gutter="30"
		>
			<a-col>
				<div class="slTitleAssis">结算列表</div>
			</a-col>
			<!-- <a-col class="mt32">
        <span class="label">已结算数量：</span>
        <span>{{detail.statementedQuantity|formatMoney(2)}}吨</span>
      </a-col>
      <a-col class="mt32">
        <span class="label">已结算金额：</span>
        <span>{{detail.statementedAmount|formatMoney(2)}}元</span>
      </a-col> -->
		</a-row>
		<div class="num-box">
			<a-row type="flex">
				<a-col>
					<p>结算单数量/单</p>
					<span>{{ detail.statementCount | formatMoney(2) }}</span>
				</a-col>
				<a-col>
					<p>已结算数量/吨</p>
					<span>{{ detail.statementedQuantity | formatMoney(2) }}</span>
				</a-col>
				<a-col>
					<p>已结算金额/元</p>
					<span>{{ detail.statementedAmount | formatMoney(2) }} </span>
				</a-col>
			</a-row>
		</div>

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
	{ title: '结算单价（元/吨）', dataIndex: 'settleUnitPrice', scopedSlots: { customRender: 'settleUnitPrice' } },
	{ title: '结算数量（吨）', dataIndex: 'settleQuantity', scopedSlots: { customRender: 'settleQuantity' } },
	{ title: '结算金额（元）', dataIndex: 'currentSettleAmount', scopedSlots: { customRender: 'currentSettleAmount' } },
	{ title: '状态', dataIndex: 'statusName' }
	// { title: "操作", dataIndex: "action",scopedSlots: { customRender: "action" },width: 80, fixed: 'right',},
];

import { getDownContractSettleInfo } from '@/v2/center/trade/api/downcontract';

export default {
	data() {
		return {
			columns
		};
	},
	props: {
		detail: {
			default: () => {
				return {};
			}
		}
	},
	methods: {
		viewDetail(items) {
			//订单合同模板为“动力煤012-仓押”、“焦煤004-仓押”，“焦炭008-仓押”属于仓押业务
			let CYFlag = ['STEAM_COAL_013', 'COKING_COAL_005', 'COKING_008'].includes(this.data?.contract?.contractTemplateName)
				? 1
				: 0;
			let routerData = this.$router.resolve({
				path: '/center/settle/mine/offline/detail',
				query: {
					statementId: items.id,
					orderId: items.orderId,
					type: 'view',
					CYFlag: CYFlag
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

.num-box {
	margin-top: 20px;
	.ant-row-flex {
		// justify-content: space-between;
		.ant-col {
			height: 100px;
			width: 24%;
			background: #f0f8ff;
			border-radius: 6px;
			padding: 20px;
			margin-right: 20px;
			span {
				font-family: 'PingFang SC';
				font-weight: 500;
				font-size: 20px;
				line-height: 28px;
				color: rgba(0, 0, 0, 0.8);
			}
			p {
				font-family: 'PingFang SC';
				font-weight: 500;
				font-size: 14px;
				line-height: 20px;
				color: rgba(0, 0, 0, 0.4);
				margin-bottom: 11px;
			}
		}
		.ant-col:nth-child(2),
		.ant-col:nth-child(4) {
			background: #fff9e9;
		}
		.ant-col:nth-child(4) {
			margin-right: 0px;
		}
	}
}
/deep/ .ant-table-thead {
	background: #f3f5f6;
}
</style>
