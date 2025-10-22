<template>
	<div class="total-amount-detail">
		<!--加权批次化验列表---start-->
		<div
			class="table-wrapper"
			v-if="goodsValueDetailList1.length > 0"
		>
			<table class="custom-table">
				<thead>
					<tr class="font-weight">
						<th colspan="8">加权批次化验数据</th>
					</tr>
					<tr class="header-th">
						<th><div class="receive-no">收货编号</div></th>
						<th><div>数量(吨)</div></th>
						<th
							v-for="item in evaluationIndexList"
							:key="item.key + '_1'"
						>
							<div>{{ item.text }}</div>
						</th>
					</tr>
				</thead>
				<tbody>
					<tr
						v-for="(row, index) in goodsValueDetailList1"
						:key="'add_' + index"
					>
						<td>{{ row.receiveNo }}</td>
						<td>{{ row.weight }}</td>
						<td
							v-for="item in evaluationIndexList"
							:key="item.key + '_1_' + index"
						>
							<div>{{ row[item.key] }}</div>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
		<!--加权批次化验列表---end-->

		<!--加权指标奖罚---start-->
		<div
			class="table-wrapper"
			v-if="goodsValueDetailList2.length > 0"
		>
			<table class="custom-table">
				<thead>
					<tr class="font-weight">
						<th colspan="8">加权指标奖罚</th>
					</tr>
					<tr class="header-th">
						<th class="two-column">
							<span class="left" />
							<span class="right" />
							<div>
								<span class="left-text">考核明细</span>
								<span class="right-text">指标名称</span>
							</div>
						</th>
						<th
							v-for="item in evaluationIndexList"
							:key="item.key + '_2'"
						>
							<div>{{ item.text }}</div>
						</th>
						<th><div>综合单价(元)</div></th>
					</tr>
				</thead>
				<tbody>
					<tr
						v-for="(row, index) in goodsValueDetailList2"
						:key="'even_' + index"
					>
						<th>
							<span v-if="index === 0">指标加权平均</span>
							<span v-if="index === 1">奖罚</span>
						</th>
						<td
							v-for="item in evaluationIndexList"
							:key="item.key + '_2_' + index"
						>
							<div>{{ row[item.key] }}</div>
						</td>
						<td>
							<span v-if="index === 0">--</span>
							<span v-if="index === 1">{{ row.averagePrice }}</span>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
		<!--加权指标奖罚---end-->

		<!--单批次化验数据及奖罚---start-->
		<div
			class="table-wrapper"
			v-if="goodsValueDetailList3.length > 0"
		>
			<table class="custom-table">
				<thead>
					<tr class="font-weight">
						<th colspan="10">单批次化验数据及奖罚</th>
					</tr>
					<tr class="header-th">
						<th class="two-column">
							<div>
								<div class="left" />
								<div class="right" />
								<span class="left-text">考核明细</span>
								<span class="right-text">指标名称</span>
							</div>
						</th>
						<th><div class="receive-no">收货编号</div></th>
						<th><div>数量(吨)</div></th>
						<th
							v-for="item in evaluationIndexList"
							:key="item.key + '_3'"
						>
							<div>{{ item.text }}</div>
						</th>
						<th><div>综合单价(元)</div></th>
					</tr>
				</thead>
				<tbody
					v-for="(row, index) in goodsValueDetailList3"
					:key="'row_' + index"
				>
					<tr
						v-for="(innerRow, _inner) in row.list"
						:key="'innerRow_' + _inner"
					>
						<th>
							<span v-if="_inner === 0">化验数据</span>
							<span v-if="_inner === 1">奖罚</span>
						</th>
						<td
							v-if="_inner === 0"
							rowspan="2"
						>
							{{ innerRow.receiveNo }}
						</td>
						<td>
							<span v-if="_inner === 0">{{ innerRow.weight }}</span>
							<span v-if="_inner === 1">--</span>
						</td>
						<td
							v-for="(item, itemIndex) in evaluationIndexList"
							:key="'item_inner_' + itemIndex"
						>
							{{ innerRow[item.key] }}
						</td>
						<td>
							<span v-if="_inner === 0">--</span>
							<span v-if="_inner === 1">{{ innerRow.averagePrice }}</span>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
		<!--单批次化验数据及奖罚---end-->

		<div class="tip-wrapper">
			总货值 = 加权货值+单批次总货值+调整总金额+额外扣减 = {{ amount.goodsValueWeight || 0 }}+{{
				amount.singleBatchGoodsValue || 0
			}}{{ Number(amount.adjustTotalAmount) > 0 ? '+' : '' }}{{ amount.adjustTotalAmount || '+0' }}+{{ amount.extraChange || 0 }}
			元
		</div>
	</div>
</template>
<script>
export default {
	name: 'TotalAmountDetail',
	props: {
		detail: {
			type: Object,
			default: () => {
				return {};
			}
		},
		indexList: {
			type: Array,
			default: () => {
				return [];
			}
		}
	},
	computed: {
		evaluationIndexList() {
			let arr = [];
			Object.keys(this.evaluationIndexMap).forEach(key => {
				if (this.indexList.indexOf(key) > -1) arr.push(this.evaluationIndexMap[key]);
			});
			return arr;
		}
	},
	data() {
		return {
			evaluationIndexMap: {
				1: { text: '热值(kcal/kg)', key: 'heat' },
				2: { text: '硫分(%)', key: 'sulfur' },
				3: { text: '水分(%)', key: 'water' },
				4: { text: '挥发分(%)', key: 'vdaf' },
				5: { text: '灰分(%)', key: 'ash' },
				6: { text: '灰熔点(°C)', key: 'melt' }
			},
			dataSource: [],
			amount: {},
			goodsValueDetailList1: [], // 加权批次化验数据
			goodsValueDetailList2: [], // 加权指标奖罚
			goodsValueDetailList3: [] // 单批次化验数据及奖罚
		};
	},
	mounted() {
		this.initData(this.detail);
	},
	methods: {
		initData(val) {
			this.amount = val.goodsItemVO || {};
			let arr = val.goodsValueDetailList || [];
			arr.forEach(item => {
				switch (item.type + '') {
					case '1':
						this.goodsValueDetailList1 = item.goodsValueDetailList || [];
						break;
					case '2':
						this.goodsValueDetailList2 = item.goodsValueDetailList || [];
						break;
					case '3': {
						// 单批次化验数据及奖罚，将数据处理成两条数据一组的数组（receiveNo相同的两条数据是一组的）
						let list = item.goodsValueDetailList || [];
						let resList = [];
						let arr1 = []; // 化验数据
						let arr2 = []; // 奖罚数据
						list.forEach(item => {
							if (!!item.averagePrice || item.averagePrice == 0) arr2.push(item);
							if (!item.averagePrice && item.averagePrice != 0) arr1.push(item);
						});
						arr1.forEach(item => {
							let obj =
								arr2.find(inner => {
									return inner.receiveNo === item.receiveNo;
								}) || {};
							resList.push({ list: [item, obj] });
						});
						this.goodsValueDetailList3 = resList;
						break;
					}
				}
			});
		}
	},
	watch: {
		detail: {
			deep: true,
			handler(val) {
				this.initData(val);
			}
		}
	}
};
</script>
<style lang="less" scoped>
.total-amount-detail {
	width: 100%;
	position: relative;
	.tip-wrapper {
		margin: 30px 0px;
		font-size: 20px;
		font-weight: bold;
	}
	.table-wrapper {
		width: 100%;
		overflow: auto;
		& + .table-wrapper {
			margin-top: 30px;
		}
	}
	table {
		width: 100%;
		th,
		tr,
		td {
			padding: 12px 8px;
			border: 1px solid #eee;
			text-align: center;
		}
		.font-weight th {
			font-weight: bold;
		}
		.no-res {
			th,
			tr,
			td {
				padding: 0px;
			}
		}
		th {
			font-weight: normal;
			white-space: nowrap;
			background-color: #ddd;
			&.two-column {
				background: #eee;
				width: 140px;
				height: 50px;
				position: relative;
				div {
					width: 122px;
				}
				.left {
					display: inline-block;
					width: 0px;
					height: 0px;
					border-bottom: 48px solid #ddd;
					border-right: 138px solid transparent;
					position: absolute;
					left: 0px;
					bottom: 0;
					z-index: 1;
					text-align: right;
				}
				.right {
					display: inline-block;
					width: 0px;
					height: 0px;
					border-bottom: 48px solid transparent;
					border-right: 138px solid #ddd;
					position: absolute;
					right: 0px;
					top: 0;
				}
				.right-text {
					position: absolute;
					top: 4px;
					right: 4px;
				}
				.left-text {
					position: absolute;
					left: 4px;
					bottom: 4px;
					z-index: 2;
				}
			}
		}
	}
	.no-res {
		::v-deep.ant-table-placeholder {
			border: 1px solid #eee;
		}
	}
}
</style>
