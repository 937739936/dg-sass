<template>
	<div class="slMain mt-10 wrapper">
		<a-card :bordered="false">
			<div class="methods-wrap">
				<span
					slot="title"
					class="slTitle"
					>仓房使用详情</span
				>
				<a-button
					ghost
					@click="$router.go(-1)"
					type="primary"
				>
					返回
				</a-button>
			</div>

			<div class="item">
				<p class="title">基本信息</p>
				<a-row>
					<a-col
						:span="12"
						class="flex-box"
					>
						<div class="name">仓储企业</div>
						<div class="value">
							{{ data.storageCompany }}
						</div>
					</a-col>
					<a-col
						:span="12"
						class="flex-box"
					>
						<div class="name">库点</div>
						<div class="value">
							{{ data.depotPointName }}
						</div>
					</a-col>
					<a-col
						:span="12"
						class="flex-box"
					>
						<div class="name">仓房号</div>
						<div class="value">
							{{ data.storehouseNumber }}
						</div>
					</a-col>
					<a-col
						:span="12"
						class="flex-box"
					>
						<div class="name">金融机构</div>
						<div class="value">
							{{ data.bankName }}
						</div>
					</a-col>
					<a-col
						:span="12"
						class="flex-box"
					>
						<div class="name">资金类型</div>
						<div class="value">
							{{ data.fundName }}
						</div>
					</a-col>
					<a-col
						:span="12"
						class="flex-box"
					>
						<div class="name">使用周期</div>
						<div class="value">{{ data.startTime }}~{{ data.endTime }}</div>
					</a-col>
					<a-col
						:span="12"
						class="flex-box"
					>
						<div class="name">合同编号</div>
						<div class="value">
							{{ data.contractNo }}
						</div>
					</a-col>
					<a-col
						:span="12"
						class="flex-box"
					>
						<div class="name">商品名称</div>
						<div class="value">
							{{ data.grainVarieties }}
						</div>
					</a-col>
				</a-row>
			</div>

			<a-row
				class="block-wrapper tc count"
				type="flex"
				justify="space-between"
			>
				<a-col style="width: 20%">
					<div class="name">累计入库(吨)</div>
					<div class="value">
						{{ data.cumulativeStorage && data.cumulativeStorage.toLocaleString() }}
					</div>
				</a-col>
				<a-col style="width: 20%">
					<div class="name">累计出库(吨)</div>
					<div class="value">
						{{ data.cumulativeOutbound && data.cumulativeOutbound.toLocaleString() }}
					</div>
				</a-col>
				<a-col style="width: 20%">
					<div class="name">完结时库存(吨)</div>
					<div class="value">
						{{ data.currentCapacity && data.currentCapacity.toLocaleString() }}
					</div>
				</a-col>
				<a-col style="width: 20%">
					<div class="name">库存损耗(吨)</div>
					<div class="value">
						{{ data.loss && data.loss.toLocaleString() }}
					</div>
				</a-col>
			</a-row>

			<div class="block-wrapper">
				<a-row
					type="flex"
					justify="space-between"
				>
					<a-timeline style="width: 120px; margin-top: 10px">
						<a-timeline-item
							v-for="(item, index) in tabList"
							:key="index"
						>
							<img
								slot="dot"
								class="icon"
								:src="item.icon"
							/>
							<span
								class="text"
								:class="setActiveStyle(item.value)"
								@click="swicth(item.value)"
								>{{ item.label }}</span
							>
						</a-timeline-item>
					</a-timeline>
					<div class="item-wrapper">
						<!-- 库存图表 引用监控中的组件-->
						<div v-if="curTab == 1">
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
											:disabled-date="disabledDate"
											v-model="detectDate"
											:getCalendarContainer="getPopupContainer"
											format="YYYY-MM-DD"
											:placeholder="['开始日期', '结束日期']"
										/>
									</a-form-item>
								</a-form>
								<a-button
									style="margin-right: 10px"
									@click="search()"
									html-type="submit"
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
							<ChartLine
								:data="chartData"
								:showLegend="false"
							></ChartLine>
						</div>
						<!-- 入库数据、出库数据 引用监控中的组件-->
						<div
							v-if="curTab == 2 || curTab == 3"
							style="margin: 5px"
						>
							<InOutTable
								:type="curTab == 2 ? 'in' : 'out'"
								:isMonitor="true"
								:key="curTab"
								:columnsIndex="curTab"
							>
							</InOutTable>
						</div>
						<!-- 出仓单 引用监控中的组件-->
						<WarehouseReceipt
							v-if="curTab == 4"
							:batchId="data.batchId"
						></WarehouseReceipt>
						<!-- 预警数据 引用监控中的组件-->
						<EarlyWarningData v-if="curTab == 5"></EarlyWarningData>
						<SwitchLockRecord v-if="curTab == 7" />
					</div>
				</a-row>
			</div>
		</a-card>
	</div>
</template>

<script>
import { API_GetWarehouseLDetail, API_GrainSituationInventoryChart } from '@/v2/center/storage/api';
import InOutTable from '../../components/InOutTable.vue';
import ChartLine from '@/v2/components/charts/ChartLine.vue';
import EarlyWarningData from './components/EarlyWarningData.vue';
import SwitchLockRecord from './components/SwitchLockRecord.vue';
import WarehouseReceipt from './components/WarehouseReceipt.vue';
import { getPopupContainer } from '@/v2/utils/factory';
import { mapGetters } from 'vuex';
import moment from 'moment';

export default {
	name: 'StorageCenterMonitorDetail',

	components: {
		InOutTable,
		ChartLine,
		EarlyWarningData,
		WarehouseReceipt,
		SwitchLockRecord
	},

	data() {
		return {
			getPopupContainer,
			date: [],
			chartData: {
				// legendData: ['趋势', '干预1',],
				// color: ['#0053DB', '#FF9726',],
				// xAxisData: ['A', 'B', 'C', 'D', 'E', 'F'],
				// seriesData: [
				//   [52.84, 205.97, 33.79, 281.55, 398.35, 214.02, ],
				//   [281.55, 38.35, 214.02, 100, 29.57, 36.14, ],
				// ]
			},
			companyInfo: {},
			detectDate: [],
			coreCompanyId: '',
			id: '',
			data: {},
			curTab: 1,
			depotPointFlag: '',
			tabList: [
				{
					label: '库存图表',
					icon: require('@/v2/assets/imgs/storage/stockChart.png'),
					value: 1
				},
				{
					label: '入库数据',
					icon: require('@/v2/assets/imgs/storage/in.png'),
					value: 2
				},
				{
					label: '出库数据',
					icon: require('@/v2/assets/imgs/storage/out.png'),
					value: 3
				},
				{
					label: '出仓单',
					icon: require('@/v2/assets/imgs/storage/out.png'),
					value: 4
				},
				{
					label: '预警数据',
					icon: require('@/v2/assets/imgs/storage/earlyWarningData.png'),
					value: 5
				}
				// {
				//   label: '开关锁记录',
				//   icon: require('@/v2/assets/imgs/storage/switchLockRecord.png'),
				//   value: 7
				// },
			]
		};
	},

	created() {
		this.id = this.$route.query.id;
		this.coreCompanyId =
			this.VUEX_ST_COMPANYSUER.companyType == 'FINANCIAL_ORG'
				? this.$route.query.coreCompanyId
				: this.VUEX_ST_COMPANYSUER.companyId;
		this.getDetail();
		if (this.curTab == 1) {
			if (!this.data.startTime) {
				return;
			}
			this.setInventoryChartDate();
			this.getInventoryChart();
		}
	},

	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		})
	},

	methods: {
		setInventoryChartDate() {
			const startDate = moment(this.data.startTime).startOf('day');
			this.detectDate = [moment(this.data.startTime).startOf('day'), moment(this.data.endTime).startOf('day')];
		},
		search() {
			this.getInventoryChart();
		},

		disabledDate(current) {
			return (
				moment(this.data.startTime || '')
					.startOf('day')
					.valueOf() > current.valueOf() || current > moment(this.data.endTime).endOf('day').valueOf()
			);
		},

		reset() {
			this.detectDate = [];
			this.getInventoryChart();
		},

		swicth(v) {
			this.curTab = v;
		},

		getInventoryChart() {
			const params = {
				storehouseId: this.id,
				coreCompanyId: this.coreCompanyId,
				batchId: this.$route.query.batchId
			};
			if (this.detectDate && this.detectDate.length > 0) {
				params.detectDateStart = this.detectDate[0].format('YYYY-MM-DD');
				params.detectDateEnd = this.detectDate[1].format('YYYY-MM-DD');
			} else {
				delete params.detectDateStart;
				delete params.detectDateEnd;
			}
			API_GrainSituationInventoryChart(params).then(res => {
				if (res.success) {
					this.chartData = res.data;
					const xAxisData = [];
					const seriesData = [[]];
					res.data.forEach(item => {
						xAxisData.push(item.dateTime);
						seriesData[0].push(item.inventory);
					});
					this.chartData = {
						legendData: ['库存(吨)'],
						color: ['#0053DB'],
						xAxisData,
						seriesData
					};
				}
			});
		},

		setActiveStyle(v) {
			if (v == this.curTab) {
				return 'active';
			}
		},

		getDetail() {
			API_GetWarehouseLDetail({
				batchId: this.$route.query.batchId,
				storehouseId: this.$route.query.id
			}).then(res => {
				if (res.success) {
					this.data = res.data;
					this.setInventoryChartDate();
					this.getInventoryChart();
					this.depotPointFlag = res.data.depotPointFlag;

					// if (this.data.haveLock) {
					// 	this.tabList = [
					// 		...this.tabList,
					// 		{
					// 			label: '开关锁记录',
					// 			icon: require('@/v2/assets/imgs/storage/switchLockRecord.png'),
					// 			value: 7
					// 		}
					// 	];
					// }
				}
			});
		}
	}
};
</script>
<style lang="less" scoped>
::v-deep {
	.ant-tabs-bar {
		border: 0;
	}
	.ant-card-head-title {
		font-size: 16px;
		color: #141517;
		line-height: 24px;
		position: relative;
		padding-left: 10px;
	}
}
.wrapper {
	.op {
		position: absolute;
		top: 12px;
		right: 20px;
	}
	.title {
		text-align: left;
		font-size: 14px;
		color: #383a3f;
		margin-bottom: 10px;
	}
	.item {
		margin-bottom: 18px;
		margin-top: 20px;
		.name {
			width: 80px;
			text-align: left;
		}
		background: #ffffff;
		.title {
			margin-bottom: 0;
			padding-bottom: 0;
		}
	}
	p {
		color: #383a3f;
		line-height: 20px;
		padding-bottom: 10px;
		font-weight: 600;
	}
	.flex-box {
		display: flex;
		margin-top: 10px;
		> div {
			width: calc(100% - 80px);
			padding-right: 10px;
			color: #6b6f76;
			line-height: 18px;
		}
		.name {
			width: 150px;
			text-align: left;
		}
		.value {
			color: #383a3f;
			span {
				display: block;
				width: 100%;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				letter-spacing: 0;
			}
		}
	}

	.block-wrapper {
		margin-bottom: 8px;
		background: #ffffff;
		padding: 20px;
		::v-deep {
			.ant-timeline-item-tail {
				border-color: @primary-color;
			}
		}
		.text {
			cursor: pointer;
			padding: 2px 5px;
			display: inline-block;
			border-radius: 4px;
		}
		.active {
			color: @primary-color;
		}
		.item-wrapper {
			flex: 1;
			width: calc(100% - 120px);
		}
		.icon {
			width: 24px;
			height: 24px;
		}
		.des {
			color: #383a3f;
		}
		.time {
			color: #9ba0aa;
		}
		.r {
			color: #f24e4d;
		}
	}
	.count {
		.name {
			margin-bottom: 8px;
		}
		.value {
			font-size: 24px;
			color: #f24e4d;
		}
	}
}
.item-wrapper {
	.slMain {
		padding: 0 !important;
		margin: 0 !important;
		::v-deep.ant-card {
			padding: 0 !important;
			.table-box {
				margin-top: 0 !important;
			}
		}
	}
}
</style>
