<template>
	<a-row
		type="flex"
		justify="start"
	>
		<div style="width: 100%; position: relative">
			<a-tabs
				:default-active-key="1"
				@change="onChangeTab"
			>
				<a-tab-pane
					:key="item.value"
					:tab="item.label"
					v-for="item in tabList"
				></a-tab-pane>
			</a-tabs>
			<div
				class="tr"
				style="padding-bottom: 20px"
			>
				<a-form
					class="fl"
					layout="inline"
				>
					<a-form-item
						label="检测日期"
						class="order-wrap"
						:colon="false"
					>
						<a-range-picker
							:disabledDate="disabledDate"
							v-model="date"
							:getCalendarContainer="getPopupContainer"
							format="YYYY-MM-DD"
							@change="getDate"
							:placeholder="['开始日期', '结束日期']"
						/>
					</a-form-item>
				</a-form>
				<a-button
					style="margin-right: 10px"
					@click="search()"
					type="primary"
				>
					查询
				</a-button>
				<a-button
					ghost
					@click="reset()"
					type="primary"
				>
					重置
				</a-button>
			</div>
			<FoodData
				ref="foodData"
				v-if="curTab == 1"
				:dateObj="dateObj"
				:coreCompanyId="coreCompanyId"
			></FoodData>
			<ChartLine
				ref="chartLine"
				v-if="curTab == 2 || curTab == 3"
				:data="chartData"
			></ChartLine>
			<PestReport
				ref="pestReport"
				v-if="curTab == 4"
				:dateObj="dateObj"
				:depotPointFlag="depotPointFlag"
				:coreCompanyId="coreCompanyId"
			></PestReport>
			<GasReport
				ref="gasReport"
				v-if="curTab == 5"
				:dateObj="dateObj"
				:coreCompanyId="coreCompanyId"
			></GasReport>
		</div>
	</a-row>
</template>
<script>
import { API_GrainSituationThreeTemp, API_GrainSituationHumidity } from '@/v2/center/storage/api';
import ChartLine from '@/v2/components/charts/ChartLine.vue';
import FoodData from './FoodData.vue';
import PestReport from './PestReport.vue';
import GasReport from './GasReport.vue';
import { getPopupContainer } from '@/v2/utils/factory';
import moment from 'moment';

export default {
	name: 'FoodMonitor',

	props: {
		coreCompanyId: {
			type: String,
			default: ''
		},
		depotPointFlag: {
			type: String,
			default: ''
		},
		startTime: {
			type: String,
			default: ''
		}
	},

	components: {
		ChartLine,
		FoodData,
		PestReport,
		GasReport
	},

	data() {
		return {
			getPopupContainer,
			refList: ['foodData', 'chartLine', 'chartLine', 'pestReport', 'gasReport'],
			curTab: 1,
			date: [],
			dateObj: {},
			chartKey: {
				2: {
					func: API_GrainSituationThreeTemp,
					legend: ['外温', '仓温', '粮温'],
					seriesDataKey: ['outTemp', 'inTemp', 'grainTemp'],
					color: ['#0053DB', '#FF9726', '#F24E4D']
				},
				3: {
					func: API_GrainSituationHumidity,
					legend: ['外湿', '仓湿'],
					seriesDataKey: ['outHumidity', 'inHumidity'],
					color: ['#0053DB', '#FF9726']
				}
			},
			chartData: {},
			tabList: [
				{
					label: '粮情数据',
					value: 1
				},
				{
					label: '三温图表',
					value: 2
				},
				{
					label: '湿度图表',
					value: 3
				},
				{
					label: '害虫报表',
					value: 4
				},
				{
					label: '气体报表',
					value: 5
				}
			]
		};
	},

	created() {
		this.search();
		this.setDate();
	},
	watch: {
		startTime() {
			this.setDate();
		}
	},
	methods: {
		setDate() {
			const startDate = this.startTime ? moment(this.startTime).startOf('day') : moment().subtract(7, 'days');
			this.date = [startDate, moment().subtract(0, 'days')];
			this.getDate('', [startDate.format('YYYY-MM-DD'), moment().subtract(0, 'days').format('YYYY-MM-DD')]);
		},
		disabledDate(current) {
			return (
				moment(this.startTime || '')
					.startOf('day')
					.valueOf() > current.valueOf() || current > moment().endOf('day').valueOf()
			);
		},
		search() {
			if (this.chartKey[this.curTab]) {
				this.getChartData();
				return;
			}
			this.$nextTick(() => {
				this.$refs[this.refList[this.curTab - 1]].search();
			});
		},

		getChartData() {
			this.resetChartData();
			const params = {
				...this.dateObj,
				storehouseId: this.$route.query.id,
				coreCompanyId: this.coreCompanyId,
				batchId: this.$route.query.batchId
			};
			this.chartKey[this.curTab].func(params).then(res => {
				if (res.success) {
					if (!res.data || res.data.length <= 0) {
						this.resetChartData();
						return;
					}

					const legendData = this.chartKey[this.curTab].legend;
					const color = this.chartKey[this.curTab].color;
					const xAxisData = [];
					const seriesData = [];
					res.data.forEach(item => {
						xAxisData.push(item.detectTime);
						this.chartKey[this.curTab].seriesDataKey.forEach((i, index) => {
							seriesData[index] = seriesData[index] ? [...seriesData[index], item[i]] : [item[i]];
						});
					});
					this.chartData = {
						legendData,
						color,
						xAxisData,
						seriesData
					};
				} else {
					this.resetChartData();
				}
			});
		},

		onChangeTab(v) {
			this.curTab = v;
			this.search();
		},

		reset() {
			this.date = [];
			this.dateObj = {};
			this.search();
		},

		resetChartData() {
			this.chartData = {
				legendData: [],
				color: [],
				xAxisData: [],
				seriesData: []
			};
		},

		getDate(value, dateString) {
			this.dateObj =
				dateString && dateString[0]
					? {
							detectDateStart: dateString[0] + ' 00:00:00',
							detectDateEnd: dateString[1] + ' 23:59:59'
						}
					: {};
		}
	}
};
</script>
