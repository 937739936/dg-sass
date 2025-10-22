<template>
	<div class="slMain">
		<a-card :bordered="false">
			<span
				slot="title"
				class="slTitle"
			>
				消息中心
			</span>
			<div class="tabs-box">
				<div class="warning-box">
					<div
						class="warn-item"
						:class="[status == item.value ? 'active' : '', item.value]"
						@click="changeStatus(item)"
						v-for="item in statusData"
						:key="item.value"
					>
						<span v-if="item.value == 'warning'">{{ item.text }}({{ warningNum >= 99 ? '99+' : warningNum }})</span>
						<span v-else>{{ item.text }}({{ instationTotal >= 99 ? '99+' : instationTotal }})</span>
					</div>
				</div>

				<div
					class="warning-box2"
					v-if="status == 'warning'"
				>
					<div
						class="warn-item"
						:class="[warningType == item.value ? 'active' : '', item.value]"
						@click="changeWarn(item)"
						v-for="item in warningList"
						:key="item.value"
					>
						<span>{{ item.label }}</span>
					</div>
				</div>
			</div>

			<Warning
				@getCount="getCount"
				:warningTotal="warningTotal"
				:warningTabCountList="warningTabCountList"
				v-if="status === 'warning' && warningType == 1"
			/>
			<FacilityWarning
				@getCount="getFacilityCount"
				:warningTotal="warningTotalFacility"
				:warningTabCountList="facilityTabCountList"
				v-if="status === 'warning' && warningType == 2"
			/>
			<Instation
				@setCount="setInstationTotal"
				v-show="status === 'instation'"
			/>
			<PriceDeclineWarning
				@getCount="getPriceCount"
				:warningTotal="warningTotalPrice"
				:warningTabCountList="warningTabCountListPrice"
				v-if="status === 'warning' && warningType == 3"
			/>
			<InventoryWarning
				@getCount="getInventoryCount"
				:warningTotal="warningTotalInventory"
				:warningTabCountList="warningTabCountListInventory"
				v-if="status === 'warning' && warningType == 4"
			/>
		</a-card>
	</div>
</template>

<script>
import Warning from '@/v2/center/message/components/Warning';
import FacilityWarning from '@/v2/center/message/components/FacilityWarning';
import PriceDeclineWarning from '@/v2/center/message/components/PriceDeclineWarning';
import InventoryWarning from '@/v2/center/message/components/InventoryWarning';

import Instation from '@/v2/center/message/components/Instation';
import { API_GetInventoryWarningStatus, API_GetWarningCount, API_GetMessageCount } from 'api';
import { API_GetNoticeList, API_GetWarningList, API_SetReadMessage, API_GetPriceWarningStatus } from 'api';
import { getSubsystemOptions } from '@/v2/center/logisticsPlatform/api';

const statusData = [
	{
		text: '预警消息',
		value: 'warning'
	},
	{
		text: '站内消息',
		value: 'instation'
	}
];
export default {
	data() {
		return {
			statusData,
			status: this.$route.query.type || 'warning',
			instationTotal: 0,
			warningNum: null,
			warningTotal: 0,
			warningTotalFacility: 0,
			warningTabCountList: [],
			warningTotalPrice: 0,
			warningTotalInventory: 0,
			warningTabCountListPrice: [],
			facilityTabCountList: [],
			warningTabCountListInventory: [],

			// 交易监控  设备监控
			warningType: 1,
			warningList: [
				{ value: 1, label: '交易监控预警' },
				{ value: 2, label: '设备监控预警' },
				{ value: 3, label: '价格下跌预警' },
				{ value: 4, label: '库存监控预警' }
			]
		};
	},
	components: {
		Warning,
		Instation,
		FacilityWarning,
		PriceDeclineWarning,
		InventoryWarning
	},
	watch: {
		$route(to) {
			this.status = to.query.type || 'warning';
		}
	},
	created() {
		this.getPriceCount();
		this.getInventoryCount();
		if (!this.$route.query.riskLevel) {
			if (!this.$route.query.contractNo) {
				this.getCount();
			}
			this.getWarningList();
		}
	},
	methods: {
		handleChange(data) {
			this.searchParams = data;
			this.changeSearch(data);
		},
		async getWarningList() {
			const params2 = {
				t: Math.random()
			};
			const res2 = await getSubsystemOptions(params2);

			const list = res2.data || [];
			list.forEach(el => {
				el.value = el?.stationId;
			});
			const params = {
				ruleType: 'ALL',
				pageNo: 1,
				pageSize: 50,
				stationIdList: list.map(el => el?.stationId).join()
			};
			API_GetMessageCount(params).then(res => {
				if (res.success) {
					this.warningNum = res.result;
				}
			});
			// API_GetWarningList(params).then(res => {
			// 	if (res.success) {
			// 		this.warningNum = res.result.total;
			// 	}
			// });
		},
		getCount(data = {}) {
			API_GetWarningCount(data).then(res => {
				if (res.success) {
					this.warningTotal = 0;
					this.warningTabCountList = [];
					let PROCESSED = {
						text: '已处理',
						value: 'PROCESSED,ARTIFICIAL_PROCESSED',
						count: 0
					};
					res.result.map(item => {
						this.warningTotal += item.count;
						item.text = item.alertStatusDesc;
						item.alertStatus = item.alertStatus === 'TO_BE_PROCESS' ? 'TO_BE_PROCESS,FOLLOWED' : item.alertStatus;
						item.value = item.alertStatus;
						if (item.alertStatus.includes('PROCESSED')) {
							PROCESSED.count += item.count;
						} else {
							this.warningTabCountList.push(item);
						}
					});
					this.warningTabCountList.push(PROCESSED);
				}
			});
		},
		getFacilityCount(data = {}) {
			API_GetWarningCount(data).then(res => {
				if (res.success) {
					this.warningTotalFacility = 0;
					this.facilityTabCountList = [];
					let dcl = {
						text: '待处理',
						value: 'TO_BE_PROCESS,FOLLOWED',
						count: 0
					};
					let ycl = {
						text: '已处理',
						value: 'PROCESSED',
						count: 0
					};
					res.result.map(item => {
						this.warningTotalFacility += item.count;
						item.text = item.alertStatusDesc;
						if (['TO_BE_PROCESS', 'FOLLOWED'].includes(item.alertStatus)) {
							dcl.count += item.count;
						}
						if (['PROCESSED'].includes(item.alertStatus)) {
							ycl.count += item.count;
						}
						item.value = item.alertStatus;
					});
					this.facilityTabCountList = [].concat(dcl, ycl);
				}
			});
		},
		getPriceCount(data = {}) {
			API_GetPriceWarningStatus(data).then(res => {
				if (res.success) {
					this.warningTotalPrice = 0;
					this.warningTabCountListPrice = [];
					res.result.map(item => {
						if (item.alertStatusDesc) {
							this.warningTotalPrice = this.warningTotalPrice + item.count;
						}
						item.text = item.alertStatusDesc;
						item.value = item.alertStatus;
						this.warningTabCountListPrice.push(item);
					});
				}
			});
		},
		getInventoryCount(data = {}) {
			API_GetInventoryWarningStatus({ ...data, ruleTypeList: 'INVENTORY' }).then(res => {
				if (res.success) {
					this.warningTotalInventory = 0;
					this.warningTabCountListInventory = [];
					let ycl = {
						count: 0,
						value: 'PROCESSED,ARTIFICIAL_PROCESSED',
						text: '已处理'
					};
					let dcl = {
						count: 0,
						value: 'TO_BE_PROCESS,FOLLOWED',
						text: '待处理'
					};
					res.result.statusList?.map(item => {
						item.value = item.status;
						item.text = item.statusDesc === '待风控审批' ? '待审批' : item.statusDesc;
						this.warningTotalInventory = this.warningTotalInventory + item.count;
						if (['PROCESSED', 'ARTIFICIAL_PROCESSED'].includes(item.status)) {
							ycl.count += item.count;
						} else if (['TO_BE_PROCESS', 'FOLLOWED'].includes(item.status)) {
							dcl.count += item.count;
						} else {
							this.warningTabCountListInventory.push(item);
						}
					});
					this.warningTabCountListInventory.unshift(dcl);
					this.warningTabCountListInventory.push(ycl);
				}
			});
		},
		setInstationTotal(count) {
			this.instationTotal = count;
		},
		changeStatus(item) {
			this.status = item.value;
		},
		changeWarn(item) {
			this.warningType = item.value;
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
.slMain {
	margin-top: -10px;

	/deep/ .ant-card-head .ant-card-head-title {
		border-bottom: 1px solid #e5e6eb;
		padding-bottom: 20px;
		margin-bottom: 20px;
	}
}

.tabs-box {
	position: relative;

	::v-deep.ant-tabs-bar {
		padding-right: 90px;
	}
}

.warning-box {
	display: flex;
	align-items: center;
	border-radius: 4px;

	.warn-item {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 114px;
		height: 34px;
		background: #ffffff;
		border: 1px solid #e5e6eb;
		color: rgba(0, 0, 0, 0.8);
		box-sizing: border-box;

		cursor: pointer;

		&:last-child {
			border-left: 1px solid transparent;
		}

		&:first-child {
			border-right: 1px solid transparent;
		}

		&.active {
			color: @primary-color;
			border-radius: 4px 0px 0px 4px;
			border: 1px solid @primary-color;
		}
	}

	.warning {
		border-radius: 4px 0px 0px 4px;
	}

	.instation {
		border-radius: 0px 4px 4px 0;
	}

	.warn-item.active.instation {
		border-radius: 0px 4px 4px 0;
	}
}

.warning-box2 {
	display: flex;
	align-items: center;
	margin-top: 16px;

	.warn-item {
		display: flex;
		align-items: center;
		justify-content: center;
		background: #ffffff;
		color: rgba(0, 0, 0, 0.4);
		box-sizing: border-box;
		cursor: pointer;
		margin-right: 30px;
		border-bottom: 2px solid transparent;
		padding-bottom: 14px;

		&.active {
			color: @primary-color;
			border-bottom: 2px solid @primary-color;
		}
	}
}
</style>
