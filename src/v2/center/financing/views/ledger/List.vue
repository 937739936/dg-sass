<template>
	<div class="slMain">
		<a-card :bordered="false">
			<span
				slot="title"
				class="slTitle"
			>
				台账管理
			</span>
			<template #extra>
				<span class="data-update-time">{{ currentTabDataUpdateTimeString }} </span>
			</template>
			<a-tabs
				:animated="false"
				v-model="tabKey"
				@change="handleTabChange"
			>
				<a-tab-pane
					key="BUSINESS"
					tab="保理业务台账"
				>
					<BusinessLedgerView
						ref="BusinessLedgerView"
						:date="getTabSelectedDateString('BUSINESS')"
						:summaryData="businessLedgerSummaryData"
					/>
				</a-tab-pane>
				<a-tab-pane
					key="CREDIT_LINE"
					tab="保理运营台账"
				>
					<OperationLedgerView
						ref="OperationLedgerView"
						:date="getTabSelectedDateString('CREDIT_LINE')"
					/>
				</a-tab-pane>
				<template slot="tabBarExtraContent">
					<div class="tab-actions">
						<div>
							<a-date-picker
								placeholder="日期选择"
								:value="currentTabSelectedDateMoment"
								:disabledDate="disabledDate"
								@change="handleDateChange"
							>
								<div class="action-box">
									<img
										class="button-icon"
										src="@/v2/assets/imgs/common/date_select_icon.png"
										alt=""
									/>
									<span class="button-text">{{ currentTabDateSelectedText }}</span>
								</div>
							</a-date-picker>
						</div>
						<div class="action-line"></div>
						<a-button
							ghost
							@click="exportData"
							:loading="downloading"
						>
							<img
								v-show="!downloading"
								class="button-icon"
								src="@/v2/assets/imgs/common/export_icon.png"
								alt=""
							/>
							数据导出
						</a-button>
					</div>
				</template>
			</a-tabs>
		</a-card>
	</div>
</template>

<script>
import moment from 'moment';
import BusinessLedgerView from './components/BusinessLedgerView.vue';
import OperationLedgerView from './components/OperationLedgerView.vue';
import { API_LedgerBusinessExport, API_CustomerCreditLineExport, API_LedgerSummary } from '@/v2/center/financing/api/index';
import comDownload from '@sub/utils/comDownload';

export default {
	components: {
		BusinessLedgerView,
		OperationLedgerView
	},
	data() {
		return {
			downloading: false, // 数据导出中
			tabKey: 'BUSINESS', // 当前选择的tab类型
			businessLedgerSelectedMoment: null, // 保理业务台账选择的日期
			operationLedgerSelectedMoment: null, // 保理运营台账选择的日期
			businessLedgerSummaryData: null, // 保理业务台账统计数据
			operationLedgerSummaryData: null // 保理运营台账统计数据
		};
	},
	mounted() {
		this.getSummary(this.currentSeletedDate);
	},
	computed: {
		// 当前tab统计数据
		currentSummaryData() {
			let summaryData = this.getSummaryData(this.tabKey);
			return summaryData;
		},
		// 数据更新时间
		currentTabDataUpdateTimeString() {
			if (!this.currentSummaryData?.dataUpdateTime) {
				return '';
			}
			let time = '数据更新时间：' + this.currentSummaryData?.dataUpdateTime;
			return time;
		},
		// 当前tab选择的日期 没有返回null
		currentTabSelectedDateMoment() {
			let selectMoemt;
			selectMoemt = this.getTabSelectedDateMoment(this.tabKey);
			return selectMoemt;
		},
		// 当前tab选择的日期文字 没有时间显示 ‘日期选择’
		currentTabDateSelectedText() {
			let selectMoemt = this.currentTabSelectedDateMoment;
			// 如果没有选择日期
			if (selectMoemt == null) {
				return '日期选择';
			}
			if (this.currentSummaryData?.selectedDate) {
				return moment(this.currentSummaryData.selectedDate).format('YYYY年MM月DD日');
			}
			return selectMoemt.format('YYYY年MM月DD日');
		},
		currentSeletedDate() {
			// 这里没有用后台返回的选中时间用的前端选的
			return this.getTabSelectedDateString(this.tabKey);
		}
	},
	methods: {
		handleTabChange(key) {
			this.$nextTick(() => {
				switch (key) {
					case 'BUSINESS':
						this.$refs.BusinessLedgerView?.refreshData();
						break;
					case 'CREDIT_LINE':
						this.$refs.OperationLedgerView?.refreshData();
						break;
					default:
						break;
				}
				this.getSummary(this.currentSeletedDate);
			});
		},
		// 获取当前tab统计数据
		getSummaryData(tabKey) {
			let summaryData;
			switch (tabKey) {
				case 'BUSINESS':
					summaryData = this.businessLedgerSummaryData;
					break;
				case 'CREDIT_LINE':
					summaryData = this.operationLedgerSummaryData;
					break;
				default:
					break;
			}
			return summaryData;
		},
		// 获取当前tab选择的日期
		getTabSelectedDateMoment(tabKey) {
			let selectMoemt;
			switch (tabKey) {
				case 'BUSINESS':
					selectMoemt = this.businessLedgerSelectedMoment;
					break;
				case 'CREDIT_LINE':
					selectMoemt = this.operationLedgerSelectedMoment;
					break;
				default:
					break;
			}
			return selectMoemt;
		},
		// 获取当前tab选择的日期字符串
		getTabSelectedDateString(tabKey) {
			let selectMoemt = this.getTabSelectedDateMoment(tabKey) || moment();
			return selectMoemt.format('YYYY-MM-DD');
		},
		disabledDate(current) {
			// 获取当前时间
			const now = moment();
			const currentDate = moment(current);
			return currentDate.isAfter(now);
		},
		// 处理日期选择变化
		handleDateChange(date) {
			let selectedDate = moment(date);
			this.getSummary(selectedDate.format('YYYY-MM-DD'));
			switch (this.tabKey) {
				case 'BUSINESS':
					this.businessLedgerSelectedMoment = selectedDate;
					break;
				case 'CREDIT_LINE':
					this.operationLedgerSelectedMoment = selectedDate;
					break;
				default:
					break;
			}
		},
		// 获取统计数据带更新时间
		getSummary(date) {
			API_LedgerSummary({ date: date, type: this.tabKey }).then(res => {
				if (res.success) {
					switch (this.tabKey) {
						case 'BUSINESS':
							this.businessLedgerSummaryData = res.data;
							break;
						case 'CREDIT_LINE':
							this.operationLedgerSummaryData = res.data;
							break;
						default:
							break;
					}
				}
			});
		},
		// 数据导出(根据当前选择的tab进行相关业务数据导出)
		exportData() {
			// 数据导出
			const params = {
				//
				date: this.currentSeletedDate
			};
			this.downloading = true;
			let API_export;
			switch (this.tabKey) {
				case 'BUSINESS':
					API_export = API_LedgerBusinessExport;
					break;
				case 'CREDIT_LINE':
					{
						// 这里后端改为用同一个接口
						API_export = API_CustomerCreditLineExport;
						// let type = this.$refs.OperationLedgerView.getActiveTabType();
						// if (type === 'CustomerBusinessData') {
						// 	API_export = API_CustomerCreditLineExport;
						// } else if (type === 'DebtorQuotaData') {
						// 	API_export = API_DebtorCreditLineExport;
						// }
					}
					break;
				default:
					break;
			}
			if (!API_export) {
				this.downloading = false;
				return;
			}
			API_export(params)
				.then(res => {
					comDownload(res.data, undefined, res.name);
				})
				.finally(() => {
					this.downloading = false;
				});
		}
	}
};
</script>

<style lang="less" scoped>
.slMain {
	margin-top: -10px;
	/deep/ .ant-calendar-picker {
		width: none;
	}
	/deep/ .ant-calendar-picker,
	.ant-input-number {
		width: 100%;
	}
	.data-update-time {
		// margin-top: 10px;
		font-size: 12px;
		color: #00000066;
	}
	.tab-actions {
		// border: 1px solid #e8e8e8;
		display: flex;
		flex-direction: row;
		align-items: center;
		height: 20px;
		margin-top: 20px;
		/deep/ .ant-btn-background-ghost {
			border: none;
			padding: 0;
		}
		/deep/ .ant-btn-loading {
			border: none;
			outline: none !important;
			box-shadow: none !important;
		}
		/deep/ .ant-btn {
			border: none;
			color: @primary-color;
			outline: none !important;
			box-shadow: none !important;
		}
		/deep/ .ant-btn.ant-btn-loading:not(.ant-btn-circle):not(.ant-btn-circle-outline):not(.ant-btn-icon-only) {
			padding-left: 14px;
			.anticon {
				margin-right: 5px;
			}
		}
		.action-line {
			margin-left: 20px;
			margin-right: 20px;
			background-color: #e5e6eb;
			width: 1px;
			height: 13px;
		}
		.button-icon {
			width: 14px;
			height: 14px;
			margin-right: 5px;
			position: relative;
			top: -2px;
		}
		.action-box {
			cursor: pointer;
			.button-icon {
				width: 14px;
				height: 14px;
				margin-right: 5px;
				position: relative;
				top: -2px;
			}
			.button-text {
				font-family: PingFangSC-Regular, PingFang SC;
				color: @primary-color;
				font-size: 14px;
				line-height: 20px;
			}
		}
	}
}
</style>