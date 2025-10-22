<template>
	<div class="slMain">
		<a-card :bordered="false">
			<div class="methods-wrap">
				<span
					slot="title"
					class="slTitle"
					>库存台账</span
				>
			</div>
			<a-row
				type="flex"
				justify="space-between"
				style="margin-top: 30px"
			>
				<sl-select
					addonBeforeTitle="仓库"
					placeholder="请选择仓库"
					v-model="stationId"
					@change="stationChange"
					:allowClear="false"
					style="width: 320px"
				>
					<a-select-option
						:value="item.id"
						v-for="item in stationList"
						:key="item.id"
						>{{ item.name }}</a-select-option
					>
				</sl-select>
				<a-tooltip
					placement="bottomRight"
					trigger="hover"
					overlayClassName="add-logistic-in-out-tooltips"
					:getPopupContainer="getPopupContainer"
				>
					<template slot="title">
						<div class="btn-box-menu">
							<div
                @click="add('in')"
								class="btn-box-menu-item"
								@mouseover="mouseOver($event)"
								@mouseleave="mouseLeave($event)"
							>
								<div class="btn-box-menu-icon">
									<img
										class="icon-left"
										src="@/v2/assets/imgs/warehouse/icon-in-inventory.png"
										alt=""
									/>
									<p class="btn-box-menu-item-title">盘盈入库</p>
								</div>
								<img
									class="icon-right"
									src="@/v2/assets/imgs/contract/right_arrow_icon.png"
									alt=""
								/>
							</div>
							<div
                @click="add('out')"
								class="btn-box-menu-item"
								@mouseover="mouseOver($event)"
								@mouseleave="mouseLeave($event)"
							>
								<div class="btn-box-menu-icon">
									<img
										class="icon-left"
										src="@/v2/assets/imgs/warehouse/icon-out-inventory.png"
										alt=""
									/>
									<p class="btn-box-menu-item-title">盘亏出库</p>
								</div>
								<img
									class="icon-right"
									src="@/v2/assets/imgs/contract/right_arrow_icon.png"
									alt=""
								/>
							</div>
						</div>
					</template>
					<div>
						<a-button type="primary">调整库存</a-button>
					</div>
				</a-tooltip>
			</a-row>
			<div class="card-list">
				<div class="card">
					<span class="title">账面库存(吨)</span>
					<div class="text">{{ summary.inventoryTotal }}</div>
				</div>
				<div class="card2 orange">
					<div class="col">
						<span class="title">累计入库(吨)</span>
						<div class="text">{{ summary.inInventory }}</div>
					</div>
					<div class="col">
						<div class="row">
							<label class="label">采购入库(吨)：</label>
							<span class="value">{{ summary.purchaseInInventory }}</span>
						</div>
						<div class="row">
							<label class="label">盘盈入库(吨)：</label>
							<span class="value">{{ summary.profitInInventory }}</span>
						</div>
					</div>
				</div>
				<div class="card2">
					<div class="col">
						<span class="title">累计出库(吨)</span>
						<div class="text">{{ summary.outInventory }}</div>
					</div>
					<div class="col">
						<div class="row">
							<label class="label">销售出库(吨)：</label>
							<span class="value">{{ summary.saleOutInventory }}</span>
						</div>
						<div class="row">
							<label class="label">盘亏出库(吨)：</label>
							<span class="value">{{ summary.lossOutInventory }}</span>
						</div>
					</div>
				</div>
			</div>
			<a-tabs
				:activeKey="activeKey"
				@change="onTabChange"
			>
				<a-tab-pane
					key="overview"
					tab="库存概览"
				>
					<div class="tab-content">
						<InventoryOverviewChart
							:loading="lineLoading"
							ref="overviewLine"
							@change="handleChange"
							@export="doOverviewLineExport"
							@toRecord="toRecord"
						/>
					</div>
				</a-tab-pane>
			</a-tabs>
		</a-card>
    <RelationContract
			ref="relationContractIn"
			@relation="info => goAdd(info, 'in')"
			source="list"
			type="IN"
			typeRecord="IN"
		/>
    <RelationContract
			ref="relationContractOut"
			@relation="info => goAdd(info, 'out')"
			source="list"
			tipMessage="注：无生效中放货指令的标准仓押合同，无法进行手动新增出库"
			operationType="ADD_OUTBOUND"
			type="OUT"
			typeRecord="OUT"
		/>
	</div>
</template>
<script>
import {
	getInventorySummary,
	getOverviewEcharts,
	exportOverview,
	getBusinessLinePage,
	exportBusinessLine
} from '@/v2/center/logisticsPlatform/api/inventory';
import InventoryOverviewChart from './components/InventoryOverviewChart';
import { getPopupContainer } from '@/v2/utils/factory.js';
import SlSelect from '@sub/components/ui-new/Form/sl-select.vue';
import { mapGetters } from 'vuex';
import storage from '@sub/utils/storage';
import { getTransferWarehouseList } from '@/v2/center/logisticSupervise/api/settle';
import downlodFile from '@/v2/utils/download.js';
import RelationContract from '../inOut/components/relationContract.vue';

export default {
	components: {
		InventoryOverviewChart,
		SlSelect,
    RelationContract
	},
	data() {
		const activeKey = storage.session.get('inventory.activeKey') || 'overview';
		return {
			activeKey,
			tableLoading: false,
			dataSource: [],
			pagination: {
				total: 0, // 总条数
				pageNo: 1,
				pageSize: 10
			},
			loading: false,
			lineLoading: false,
			summary: {},
			shipperList: [],
			shipperUscc: 'all',
			stationId: '',
			stationList: [],
      relationType: null
		};
	},
	mounted() {
		this.getShipperList();
		if (this.activeKey == 'business' && this.VUEX_ST_COMPANYSUER?.company?.companyType == 'WAREHOUSE') {
			this.activeKey = 'overview';
			storage.session.set('inventory.activeKey', 'overview');
		}
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER',
			VUEX_COMPANY_SERVICES: 'VUEX_COMPANY_SERVICES'
		}),
		// 是否是核心企业
		isCoreCompany() {
			return this.VUEX_ST_COMPANYSUER?.companyType == 'CORE_COMPANY';
		},
		//是否是站台管理服务
		isManager() {
			return this.VUEX_COMPANY_SERVICES.includes('LOGISTICS_STATION_MANAGE');
		}
	},
	methods: {
    goAdd(info = {}, recordType) {
			this.$router.push({
				path: recordType === 'out' ? `/center/logisticSupervise/${this.relationType}/loss/add` : `/center/logisticSupervise/${this.relationType}/profit/add`,
				query: {
					serialNo: info.contractNo,
					orderTypeEnum: info.contractType,
					contractId: info.id,
					type: '1',
          recordType: recordType,
					typeRecord: recordType === 'out' ? 'LOSS_OUT' : 'PROFIT_IN'
				}
			});
		},
    getPopupContainer,
    add(type) {
      this.relationType = type;
      if (type === 'in') {
        this.$refs.relationContractIn.show(type);
      } else {
        this.$refs.relationContractOut.show(type);
      }
    },
		mouseOver($event) {
			$event.currentTarget.className = 'btn-box-menu-item hover';
		},
		mouseLeave($event) {
			$event.currentTarget.className = 'btn-box-menu-item';
		},
		async getShipperList() {
			const res = await getTransferWarehouseList();
			this.stationList = res.data || [];
			this.stationId = this.stationList[0].id;
			this.getInventorySummary();
		},
		getShipperUscc() {
			if (this.shipperUscc == 'all') {
				return;
			}
			return this.shipperUscc;
		},
		stationChange(id) {
			this.getInventorySummary();
			let { startDate, endDate } = this.$refs.overviewLine;
			this.onOverviewLineChange(startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD'));
		},
		shipperChange(uscc) {
			this.shipperUscc = uscc;
		},
		onTabChange(key) {
			storage.session.set('inventory.activeKey', key);
			this.activeKey = key;
		},
		//顶部库存汇总
		getInventorySummary() {
			this.loading = true;
			getInventorySummary({ companyCreditCode: this.getShipperUscc(), stationId: this.stationId, source: 'LOGIC_DELIVER' })
				.then(({ success, data }) => {
					this.loading = false;
					if (!success) {
						return;
					}
					this.summary = {
						inventoryTotal: data.inventoryTotal?.toNumberString() || '-',
						inInventory: data.inInventory?.toNumberString() || '-',
						nonBusinessLineInInventory: data.nonBusinessLineInInventory?.toNumberString() || '-',
						outInventory: data.outInventory?.toNumberString() || '-',
						nonBusinessLineOutInventory: data.nonBusinessLineOutInventory?.toNumberString() || '-',
						purchaseInInventory:data.purchaseInInventory?.toNumberString() || '-',
						profitInInventory:data.profitInInventory?.toNumberString() || '-',
						saleOutInventory:data.saleOutInventory?.toNumberString() || '-',
						lossOutInventory:data.lossOutInventory?.toNumberString() || '-'
					};
				})
				.catch(e => {
					this.loading = false;
				});
		},
		async handleChange(startDate, endDate) {
			if (!this.stationId) {
				const res = await getTransferWarehouseList({ t: Math.random() });
				this.stationList = res.data || [];
				this.stationId = this.stationList[0].id;
				this.onOverviewLineChange(startDate, endDate);
			} else {
				this.onOverviewLineChange(startDate, endDate);
			}
		},
		onOverviewLineChange(startDate, endDate) {
			this.lineLoading = true;
			getOverviewEcharts({
				startDate,
				endDate,
				companyCreditCode: this.getShipperUscc(),
				stationId: this.stationId,
				source: 'LOGIC_DELIVER'
			})
				.then(({ success, data }) => {
					this.lineLoading = false;
					if (!success) {
						return;
					}
					this.$refs.overviewLine.setData(data);
				})
				.catch(() => {
					this.lineLoading = false;
				});
		},
		doOverviewLineExport(startDate, endDate) {
			this.lineLoading = true;
			downlodFile(
				exportOverview,
				{ startDate, endDate, companyCreditCode: this.getShipperUscc(), stationId: this.stationId, source: 'LOGIC_DELIVER' },
				'GET',
				() => {
					this.lineLoading = false;
				}
			);
		},
		getBusinessLinePage(data) {
			return getBusinessLinePage(data);
		},
		doExport(search) {
			this.$refs.businessLine.loading(true);
			downlodFile(exportBusinessLine, search, 'GET', () => {
				this.$refs.businessLine.loading(false);
			});
		},
		openBusinessLine(data) {
			const { upOrderNo, downOrderNo, type, businessLineNo } = data.businessLineInfo;
			let query = `?upOrderNo=${upOrderNo}&downOrderNo=${downOrderNo}&businessLineType=${type}&businessLineNo=${businessLineNo}&contractType=0`;
			window.open(`/center/monitoring/dynamicMonitoring/detail${query}`, '_blank');
		},
		clickDetail(data) {
			this.$router.push({
				path: '/center/logisticsPlatform/inventory/business/detail',
				query: {
					businessLineNo: data.businessLineNo,
					companyCreditCode: data.companyCreditCode
				}
			});
		},
		toRecord({ type, startDate, endDate }) {
			let shipperUscc = this.getShipperUscc();
			const shipper = this.shipperList.find(item => item.creditCode == shipperUscc)?.name || '';
			let query = { storageStartDate: startDate, storageEndDate: endDate };
			if (shipper) {
				if (this.isManager) {
					if (type == 'IN') {
						query.deliveryCompanyName = shipper;
					} else {
						query.receivingCompanyName = shipper;
					}
				} else {
					query.deliveryReceiveCompanyName = shipper;
				}
			}
			this.$router.push({
				path: `/center/logisticSupervise/${type.toLowerCase()}`,
				query
			});
		},
		// 去往合同
		goContract(contractType, data) {
			let type = '',
				id = '';
			if (contractType === 'BUY') {
				type = data.upContractType;
				id = data.upOrderId;
				if (type == 'OFFLINE') {
					id = data.upContractId;
				}
			} else {
				type = data.downContractType;
				id = data.downOrderId;
				if (type == 'OFFLINE') {
					id = data.downContractId;
				}
			}
			let path = `/center/contract/${contractType.toLowerCase()}/online/detail?id=${id}&type=${contractType}`;
			if (type == 'OFFLINE') {
				path = `/center/contract/${contractType.toLowerCase()}/offline/detail?id=${id}&type=${contractType.toLowerCase()}`;
			}
			window.open(path);
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
	::v-deep {
		.ant-tabs {
			margin-top: 0;
		}
	}
}
.search {
	margin-top: 30px;
	width: 320px;
}
.statistic-value {
	font-size: 28px;
	font-weight: bold;
}
.card-list {
	margin-top: 30px;
	display: flex;
	flex-wrap: wrap;
	.card2{
		display: flex;
		align-items: center;
		margin-bottom: 10px;
		margin-right: 20px;
		padding: 14px 0;
		height: 88px;
		min-width: 400px;
		border-radius: 6px;
		background-color: #f0f8ff;
		box-sizing: border-box;
		.col{
			padding:0 12px;
			// width: 56%;
			height: 100%;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			box-sizing: border-box;
			&:first-child{
				width: 44%;
				// border-right: 1px solid #F9EDDC;
				border-right: 1px solid #E0EAF3;
			}
			.row{
				display: flex;
				align-items: center;
				font-size: 14px;
				margin-bottom: 0!important;
				.label{
					min-width: 95px;
					color:rgba(#000,0.4);
				}
				.value{
					font-weight: bold;
					color:rgba(#000,0.8);
				}
			}
		}
	}
	.card {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		margin-bottom: 10px;
		margin-right: 20px;
		padding: 14px 12px;
		max-width: 306px;
		height: 88px;
		border-radius: 6px;
		background-color: #f0f8ff;
		box-sizing: border-box;
		
	}
	.orange {
		background-color: #fff9f0;
		.col{
			&:first-child{
				border-right-color:#F9EDDC;
			}
		}
	}
	.cyan {
		background-color: #ebfaef;
	}
	.title {
		color: rgba(#000, 0.4);
		font-size: 14px;
		line-height: 20px;
		font-family: PingFangSC;
		font-weight: normal;
	}
	.text {
		margin-top: 12px;
		color: rgba(#000, 0.8);
		font-size: 20px;
		line-height: 28px;
		font-weight: bold;
	}
}
.tab-content {
	width: 100%;
}
.btn-box-menu {
	.btn-box-menu-item {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		cursor: pointer;
		height: 64px;
		margin-bottom: 8px;
		padding: 0 3px 0 12px;
		border-radius: 4px;
		width: 254px;

		.icon-left {
			width: 40px;
			height: 40px;
		}

		.icon-right {
			width: 14px;
			height: 14px;
			vertical-align: middle;
		}

		.btn-box-menu-item-title {
			font-size: 16px;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: rgba(0, 0, 0, 0.8);
			line-height: 22px;
			margin-left: 20px;
		}

		.btn-box-menu-item-tips {
			font-size: 14px;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #77889d;
			line-height: 20px;
		}
	}

	.btn-box-menu-item:first-child {
		position: relative;

		& > ::after {
			content: '';
			width: 250px;
			height: 1px;
			background: #e5e6eb;
			position: absolute;
			right: -8px;
			bottom: -8px;
		}
	}

	.btn-box-menu-item:last-child {
		margin-top: 16px;
		margin-bottom: 0;
	}

	.btn-box-menu-item.hover {
		background: #e4ebf4;
	}

	.btn-box-menu-icon {
		display: flex;
		align-items: center;
	}
}
</style>
<style lang="less">
.add-logistic-in-out-tooltips {
	z-index: 100;

	.ant-tooltip-arrow {
		display: none;
	}

	.ant-tooltip-inner {
		width: 270px;
		height: 161px;
		border-radius: 4px;
		background-color: #fff;
		box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.13);
		padding: 8px;
		position: relative;
		right: 22px;
		z-index: 1000;
	}
}
</style>