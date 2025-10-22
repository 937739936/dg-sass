<template>
	<div
		class="card-chart-list"
		:class="source"
	>
		<div class="card">
			<h2 class="title">入库</h2>
			<InventoryOverviewPieCom
				name="各煤种入库占比"
				:chartData="chartData.inChart"
				v-if="chartData.inChart.length > 0"
			/>
			<InventoryOverviewPieCom
				v-for="item in chartData.inChart"
				:key="item.id"
				:name="item.name + '各品类入库占比'"
				:id="item.id"
				:chartData="item.coalTypePieChartList"
			/>
		</div>
		<div class="card">
			<h2 class="title">出库</h2>
			<InventoryOverviewPieCom
				name="各煤种出库占比"
				:chartData="chartData.outChart"
				v-if="chartData.outChart.length > 0"
			/>
			<InventoryOverviewPieCom
				v-for="item in chartData.outChart"
				:key="item.id"
				:name="item.name + '各品类出库占比'"
				:id="item.id"
				:chartData="item.coalTypePieChartList"
			/>
		</div>
		<div class="card">
			<h2 class="title">库存</h2>
			<InventoryOverviewPieCom
				:name="'库存'"
				:chartData="chartData.inventory"
				v-if="chartData.inventory.length > 0"
			/>
		</div>
	</div>
</template>
<script>
import InventoryOverviewPieCom from './InventoryOverviewPieCom.vue';

export default {
	props: ['source'],
	components: {
		InventoryOverviewPieCom
	},
	data() {
		return {
			chartData: {
				inChart: [],
				outChart: [],
				inventory: []
			}
		};
	},

	methods: {
		getUid() {
			return Math.random().toString(36).slice(2);
		},
		setData({ inPieChartVO, outPieChartVO, inventoryPieChartVO }) {
			try {
				this.chartData.inChart = inPieChartVO.map(item => {
					return {
						name: item.goodsName,
						value: item.num,
						percentage: item.percentage,
						id: this.getUid(),
						coalTypePieChartList: (item.coalTypePieChartList || []).map(coal => {
							return {
								value: coal.num,
								name: coal.coalTypeProduct,
								percentage: coal.percentage,
								id: this.getUid()
							};
						})
					};
				});
				this.chartData.outChart = outPieChartVO.map(item => {
					console.log('item.goodsName', item);

					return {
						name: item.goodsName,
						id: this.getUid(),
						value: item.num,
						percentage: item.percentage,
						coalTypePieChartList: (item.coalTypePieChartList || []).map(coal => {
							return {
								value: coal.num,
								name: coal.coalTypeProduct,
								percentage: coal.percentage,
								id: this.getUid()
							};
						})
					};
				});
				this.chartData.inventory = inventoryPieChartVO.map(item => {
					console.log('item.goodsName', item);

					return {
						name: item.goodsName,
						id: this.getUid(),
						value: item.num,
						percentage: item.percentage,
						coalTypePieChartList: (item.coalTypePieChartList || []).map(coal => {
							return {
								value: coal.num,
								name: coal.coalTypeProduct,
								percentage: coal.percentage,
								id: this.getUid()
							};
						})
					};
				});
			} catch (e) {
				console.error(e);
			}
		}
	}
};
</script>
<style lang="less" scoped>
.card-chart-list {
	margin-top: 62px;
	display: grid;
	grid-template-columns: 50% 50%;
	grid-row-gap: 30px;
}

.card {
	flex: 1;
	border-right: 1px solid #e5e6eb;
	padding-left: 30px;
	padding-right: 30px;
	&:nth-child(2),
	&:nth-child(3) {
		border: none;
	}
	&:last-child {
		// padding-left: 30px;
		border: none;
	}

	.title {
		padding-left: 16px;
		position: relative;
		font-size: 16px;
		color: rgba(#000, 0.8);
		line-height: 22px;

		&::before {
			content: '';
			position: absolute;
			top: 50%;
			left: 0;
			width: 4px;
			height: 18px;
			background-color: @primary-color;
			transform: translateY(-50%);
			border-radius: 1px;
		}
	}
}
// <=1440
@media screen and (max-width: 1440px) {
	.card-chart-list {
		flex-direction: column;
		align-items: center;
	}
	.card {
		border: 0;
		padding-left: 0;
		padding-right: 0;
		// width: 500px;
		margin-bottom: 20px;
		&:nth-child(1) {
			border-bottom: 1px solid #e5e6eb;
		}
		&:nth-child(2) {
			padding-left: 20px;
			border-left: 1px solid #e5e6eb;
			border-bottom: 1px solid #e5e6eb;
		}
	}
}
@media screen and (max-width: 1900px) {
	.card-chart-list {
		flex-direction: column;
		align-items: center;
	}
	.card {
		&:nth-child(1) {
			border-bottom: 1px solid #e5e6eb;
		}
		&:nth-child(2) {
			padding-left: 20px;
			border-left: 1px solid #e5e6eb;
			border-bottom: 1px solid #e5e6eb;
		}
	}
}
// >=1920px
@media screen and (min-width: 1920px) {
	.card-chart-list {
		grid-template-columns: 33.3% 33.3% 33.3%;
		.data-info {
			padding-left: 6%;
		}
		.card {
			padding: 20px;
			&:nth-child(2) {
				border-right: 1px solid #e5e6eb;
			}
			.pie-wrap {
				padding-left: 20px;
				.data-info {
					padding-left: 10%;
				}
			}
		}
	}
}
</style>
