<template>
	<div class="new-detail">
		<div class="top-box">
			<div class="page-title">
				市场价格
				<div
					class="back-icon"
					@click="goBack"
				>
					返回
				</div>
			</div>
		</div>
		<div
			class="divider"
			style="margin-bottom: 0"
		></div>
		<p class="title">{{ title }}</p>
		<div
			id="main"
			style="width: 100%; height: 600px"
		></div>
	</div>
</template>

<script>
import * as echarts from 'echarts';
import { getMarketPriceDetail } from '../../../api/statement.js';
import drag from '@/assets/imgs/storage/drag.png';
import symbol from '@/assets/imgs/storage/symbol.png';

export default {
	data() {
		return {
			myChart: {},
			title: '',
			list: []
		};
	},
	mounted() {
		this.getMarketPriceDetail();
	},
	methods: {
		// 获取详情
		async getMarketPriceDetail() {
			const params = {
				id: this.$route.query.id
			};
			const res = await getMarketPriceDetail(params);
			const dateList = res.data.charts.map(el => el.date);
			const unitPriceList = res.data.charts.map(el => el.unitPrice);

			const min = Math.min.apply(this, unitPriceList);
			this.list = res.data.charts;
			this.title = res.data.title;
			this.init(res.data, dateList, unitPriceList);
		},
		init(info, dateList, unitPriceList) {
			let that = this;
			const min = Math.min.apply(this, unitPriceList) - 100;
			var chartDom = document.getElementById('main');
			var myChart = echarts.init(chartDom);
			var option;
			option = {
				title: {
					text: '',
					left: 'center'
				},
				tooltip: {
					trigger: 'axis',
					backgroundColor: '#fff',
					borderWidth: '0', //边框宽度设置1
					borderColor: 'rgba(229,233,238,0.5)', //设置边框颜色
					borderRadius: '0',
					padding: 0,
					axisPointer: {
						type: 'cross',
						label: {
							show: false
						},
						lineStyle: {
							color: '#4682F3',
							type: 'dashed'
						},
						crossStyle: {
							color: '#4682F3',
							type: 'dashed'
						}
					},
					position: function (point, params, dom, rect, size) {
						// 固定在顶部
						return [point[0] - 68, point[1] - 120];
					},
					formatter: function (params) {
						// 鼠标移入展示百分比
						let date = '';
						let data = '';
						params.forEach(el => {
							date = el.name;
							data = el.data;
						});
						const item = that.list.find(el => el.date == date) || {};
						date = date.replace('-', '年').replace('-', '月') + `   ${item.updateDate}`;
						return `<div class='tooltip'> <span class='triangle bottom-triangle'></span> <span class='triangle top-triangle'></span> <p class='first'>${date}</p>   <p class='sen'>${data}元/吨</p>  </div>`;
					}
				},
				grid: {
					bottom: '110'
				},
				dataZoom: [
					{
						show: true,
						realtime: true,
						start: 0,
						end: 100,
						backgroundColor: 'rgba(128, 149, 172, 0.20)',
						borderColor: '#F7F9FD',
						handleIcon: `image://${drag}`,
						bottom: 0,
						dataBackground: {
							lineStyle: {}
						}
						// xAxisIndex: [0, 1]
					}
				],
				xAxis: [
					{
						type: 'category',
						boundaryGap: false,
						axisLine: {
							lineStyle: {
								color: 'rgba(153, 167, 185, 0.40)'
							}
						},
						offset: 0,

						axisTick: {
							show: false
						},
						axisLabel: {
							textStyle: {
								color: '#8495AA'
							}
						},

						data: dateList
					}
				],
				yAxis: [
					{
						type: 'value',
						axisLine: { show: false },
						axisTick: {
							show: false
						},
						min: min,
						splitLine: {
							show: true,
							lineStyle: {
								color: 'rgba(153, 167, 185, 0.40)',
								width: 0.8
							}
						},
						axisLabel: {
							textStyle: {
								color: '#8495AA'
							},
							margin: 48
						}
					}
				],
				series: [
					{
						// name: 'Evaporation',
						type: 'line',
						symbolSize: 16,
						symbol: `image://${symbol}`,
						showSymbol: true,
						itemStyle: {
							normal: {
								color: '#4d89f9'
							}
						},
						lineStyle: {
							color: '#4d89f9'
						},
						areaStyle: {
							color: {
								type: 'linear',
								x: 0,
								y: 0,
								x2: 0,
								y2: 1,
								colorStops: [
									{
										offset: 0,
										color: 'rgba(109, 156, 244, 0.50)' // 0% 处的颜色
									},
									{
										offset: 1,
										color: 'rgba(166, 203, 250, 0)' // 100% 处的颜色
									}
								],
								global: false // 缺省为 false
							}
						},
						markLine: {
							data: [
								{
									x: '90%',
									yAxis: 'max'
								}
							]
						},
						// prettier-ignore
						data: unitPriceList
					}
				]
			};
			myChart.setOption(option);
		},
		goBack() {
			this.$router.go(-1);
		}
	},
	components: {}
};
</script>

<style scoped lang="less">
// .back-icon {
//   color: #8191A9;
//   font-size: 12px !important;
// }
// .back-icon::before {
//   width: 12px !important;
//   height: 12px !important;
//   color: #8191A9;
// }
.title {
	height: 24px;
	font-size: 22px;
	font-family:
		PingFangSC-Medium,
		PingFang SC;
	font-weight: 600;
	color: rgba(0, 0, 0, 0.8);
	line-height: 24px;
	text-align: center;
	margin-top: 72px;
	margin-bottom: 19px;
}
.btn-box {
	display: flex;
	align-items: center;
	justify-content: center;
	margin-top: 20px;
}
/deep/ .tooltip {
	width: 178px;
	text-align: left;
	padding: 14px;
	box-sizing: border-box;
	background: #ffffff;
	border: 1px solid rgba(229, 233, 238, 0.5);
	border-radius: 4px;
	position: relative;
	.triangle {
		display: block;
		width: 0;
		height: 0;
		border-style: solid;
		position: absolute;
	}
	.bottom-triangle {
		left: 61px;
		border-width: 6px;
		bottom: -12px;
		border-color: rgba(229, 233, 238, 0.5) transparent transparent transparent;
	}
	.top-triangle {
		left: 62px;
		border-width: 5px;
		bottom: -9px;
		border-color: #fff transparent transparent transparent;
	}
	.first {
		color: #8495aa;
	}
	.sen {
		color: #000000;
		font-weight: 500;
		font-size: 18px;
		margin-top: 12px;
	}
}
</style>
