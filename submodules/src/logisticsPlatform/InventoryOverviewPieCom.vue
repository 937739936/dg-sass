<template>
	<div class="pie-list">
		<div class="chartTitle">{{ name }}</div>
		<div class="pie-wrap">
			<div
				class="chart"
				:id="'chart-' + id"
			></div>
			<div
				class="data-info"
				v-show="list.length > 0"
			>
				<ul class="list-item">
					<li
						class="item"
						v-for="(item, index) in list"
						:key="item.id"
						:style="{ '--color': getColor(index) }"
					>
						<a-tooltip :title="item.name">
							<span class="label">{{ item.name }}</span>
						</a-tooltip>
						<div class="value">
							<span class="text">{{ item.value | toNumberString }}</span>
							<span class="ratio">{{ item.percentage }}%</span>
						</div>
					</li>
				</ul>
				<div class="pagination">
					<span
						:class="['pre', page <= 1 ? 'disabled' : '']"
						@click="onPage(-1)"
					>
						<Arrow />
					</span>
					<span class="text">{{ page }}/{{ total }}</span>
					<span
						:class="['next', page >= total ? 'disabled' : '']"
						@click="onPage(1)"
					>
						<Arrow />
					</span>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import * as echarts from 'echarts';
import Arrow from '@sub/components/svg/arrow';
const color = [
	'#4682F3',
	'#8CCBC0',
	'#A0A9CA',
	'#FF8D69',
	'#F6A2BB',
	'#AAE8A0',
	'#77D9EE',
	'#7CC6B9',
	'#FEBF50',
	'#F5DF6C',
	'#F39C6B',
	'#E8D8A0',
	'#9F8DE8',
	'#61CDBB',
	'#E0A8DE',
	'#F1E15B',
	'#F47560',
	'#E8C1A0',
	'#9F8DE8',
	'#61CDBB',
	'#DD4444',
	'#45C041',
	'#FFBC0F'
];
export default {
	props: {
		name: {
			type: String,
			default: () => ''
		},
		id: {
			type: String,
			default: () => Math.random().toString(36).slice(2)
		},
		chartData: {
			default: () => []
		}
	},
	components: {
		Arrow
	},
	data() {
		return {
			page: 1,
			chart: null
		};
	},
	computed: {
		total() {
			return Math.ceil((this.chartData || []).length / 4);
		},
		list() {
			return (this.chartData || []).slice((this.page - 1) * 4, this.page * 4);
		}
	},
	mounted() {
		this.init(document.querySelector(`#chart-${this.id}`));
		window.addEventListener('resize', this.resize, false);
	},
	beforeDestroy() {
		window.removeEventListener('resize', this.resize, false);
	},
	methods: {
		onPage(num) {
			const current = this.page + num;
			if (num === 1) {
				this[field] = Math.min(current, this.total);
			} else {
				this[field] = Math.max(current, 1);
			}
		},
		getColor(index) {
			return color[(index + (this.page - 1) * 4) % color.length];
		},
		getUid() {
			return Math.random().toString(36).slice(2);
		},

		refreshChartData() {
			const option = this.chart.getOption();
			option.series[0].data = this.chartData;
			this.chart.setOption(option);
		},
		resize() {
			this.chart.resize();
		},
		init(ele) {
			this.chart = echarts.init(ele);
			this.chart.setOption({
				color,
				tooltip: {
					trigger: 'item',
					borderColor: '#fff',
					extraCssText: 'box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);',
					position: function (point, params, dom, rect, size) {
						// 自定义 Tooltip 的位置
						return [point[0] + 10, point[1] + 10];
					},
					formatter: function (params) {
						return `
              <div class='iop-tooltip' style="--iop-tooltip-color:${params.color}">
                <span class='label'>${params.name}(吨)</span>
                <div class='value' >
                  <span class='text'>${(params.value || 0).toNumberString()}</span>
                  <span class='ratio'>${params.percent}%</span>
                </div>  
              </div>
            `;
					}
				},
				series: [
					{
						name: 'Access From',
						type: 'pie',
						radius: ['45%', '100px'],
						avoidLabelOverlap: false,
						itemStyle: {
							borderRadius: 5,
							borderColor: '#fff',
							borderWidth: 2
						},
						label: {
							show: false
						},
						labelLine: {
							show: false
						},
						data: []
					}
				]
			});

			this.refreshChartData();
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
	&:last-child {
		padding-left: 30px;
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
	.pie-list {
		margin-bottom: 62px;
		.chartTitle {
			padding-left: 30%;
			font-size: 14px;
			color: rgba(#000, 0.8);
			font-weight: bold;
		}
	}
	.pie-wrap {
		padding-top: 24px;
		padding-left: 35px;
		min-width: 500px;
		display: flex;
		.chart {
			width: 215px;
			height: 215px;
		}
		.list-item {
			// width: 240px;
			height: 276px;
			li {
				list-style: none;
			}
			.item {
				margin-bottom: 16px;
				.label {
					display: inline-block;
					max-width: 200px;
					font-size: 12px;
					line-height: 17px;
					color: rgba(#000, 0.4);
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					cursor: default;
				}
				.value {
					display: flex;
					align-items: center;
					margin-top: 10px;
					position: relative;
					padding-left: 16px;
					font-size: 14px;
					color: rgba(#000, 0.8);
					font-weight: bold;
					&::before {
						content: '';
						position: absolute;
						left: 0;
						top: 50%;
						width: 8px;
						height: 8px;
						transform: translateY(-50%);
						background-color: var(--color);
						border-radius: 8px;
					}
					.ratio {
						padding: 0 5px;
						height: 16px;
						line-height: 16px;
						margin-left: 10px;
						font-size: 14px;
						color: #fff;
						font-weight: normal;
						background-color: var(--color);
						border-radius: 16px;
					}
				}
			}
		}
		.pagination {
			margin-left: 40px;
			display: flex;
			align-items: center;
			.text {
				width: 40px;
				font-size: 12px;
				text-align: center;
				color: rgba(0, 0, 0, 0.4);
			}
			.pre,
			.next {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 14px;
				height: 14px;
				cursor: pointer;
				&.pre {
					transform: rotateY(180deg);
				}

				&.disabled {
					svg {
						::v-deep {
							path {
								stroke: #c2c2c2;
							}
						}
					}
				}
			}
			svg {
				::v-deep {
					path {
						stroke: #77889d;
					}
				}
			}
		}
		.data-info {
			padding-left: 93px;
		}
	}
}
::v-deep {
	.iop-tooltip {
		max-width: 200px;
		display: flex;
		flex-direction: column;
		.label {
			width: 100%;
			font-size: 12px;
			color: rgba(#000, 0.4);
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
		.value {
			display: flex;
			align-items: center;
			margin-top: 10px;
			position: relative;
			padding-left: 16px;
			font-size: 14px;
			color: rgba(#000, 0.8);
			font-weight: bold;
			&::before {
				content: '';
				position: absolute;
				left: 0;
				top: 50%;
				width: 8px;
				height: 8px;
				transform: translateY(-50%);
				border-radius: 8px;
				background-color: var(--iop-tooltip-color);
			}
			.ratio {
				padding: 0 5px;
				height: 16px;
				line-height: 16px;
				margin-left: 10px;
				font-size: 14px;
				color: #fff;
				font-weight: normal;
				background-color: var(--iop-tooltip-color);
				border-radius: 16px;
			}
		}
	}
}
</style>
