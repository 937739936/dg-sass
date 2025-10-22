<template>
	<div class="slMain">
		<a-card :bordered="false">
			<span class="slTitle">仓单查询列表</span>
			<SlFormNew
				:list="searchList"
				layout="inline"
				style="margin: 10px 0"
				@change="handleSearchChange"
				@resetFunc="resetSearchFunc"
			></SlFormNew>
			<Tab
				:statusData="statusData"
				:currentStatus="tabType"
				@callback="changeTab"
				:isExport="true"
				@export="exportData"
			></Tab>
			<div :class="'table-box ' + (pagination.total > 10 ? 'fixedBottom' : '')">
				<a-table
					class="new-table"
					:pagination="false"
					:columns="columns"
					:data-source="listDataSource"
					:scroll="{ x: true }"
					rowKey="id"
					:loading="loading"
				>
					<template
						slot="amount"
						slot-scope="text, record"
					>
						<span class="amount">{{ text | formatMoney(4) }}</span>
						<a-tooltip
							@mouseenter="mouseenter(record)"
							:getPopupContainer="getPopupContainer"
						>
							<div slot="title">
								<span
									v-if="amountTipText"
									v-html="amountTipText"
								></span>
								<a-spin v-else>
									<a-icon
										slot="indicator"
										type="sync"
										style="font-size: 16px; color: #fff"
										spin
									/>
								</a-spin>
							</div>
							<a-icon
								class="amount-tooltip-icon"
								type="exclamation-circle"
							/>
						</a-tooltip>
					</template>
					<div
						slot="status"
						slot-scope="text, item"
						:class="`statusDes status-${item.status}`"
					>
						<a-tooltip
							@mouseenter="mouseenterStatus(item)"
							style="z-index: 999"
						>
							<div slot="title">
								<span v-if="statusTipText">{{ `${statusTipText}` }}</span>
								<a-spin v-else>
									<a-icon
										slot="indicator"
										type="sync"
										style="font-size: 16px; color: #fff"
										spin
									></a-icon>
								</a-spin>
							</div>
							<span>{{ text || '-' }}</span>
						</a-tooltip>
					</div>
					<template
						slot="action"
						slot-scope="text, record"
					>
						<template>
							<a-space :size="24">
								<a
									href="javascript:;"
									@click="gotoDetail(record)"
									>查看</a
								>
								<a
									v-if="type == 'rest' && !isWarehouse && record.status == 'EFFECTIVE'"
									href="javascript:;"
									@click="goLading(record)"
									>发起提货</a
								>
							</a-space>
						</template>
					</template>
				</a-table>
			</div>
			<i-pagination
				:pagination="pagination"
				@change="getList"
			/>
		</a-card>
	</div>
</template>

<script>
import { searchList, columns, tabList } from './columns/columns.js';
import { formatMoney } from '@sub/filters';
import iPagination from '@sub/components/iPagination';
import Tab from '@sub/logisticsPlatform/warehouseReceipt/warehouseReceiptAgreement/Tab.vue';

import SlFormNew from '@sub/components/ui-new/Form/sl-form';
import { filterCodeByValueName, filterCodeByKey, convertCurrency } from '@sub/utils/globalCode.js';
import { getPopupContainer } from '@sub/utils/factory.js';
import comDownload from '@sub/utils/comDownload';
import moment from 'moment';
export default {
	props: {
		// 仓房接口api
		stationApi: {},
		houseApi: {},
		listApi: {},
		statisticsApi: {},
		exportApi: {},
		getQuantityTipApi: {},
		statusTipApi: {},
		type: {
			default: 'rest'
		}
	},
	data() {
		return {
			pagination: {
				pageNo: 1,
				total: 0
			},
			pageSize: 10,
			houseList: [], // 仓房
			goodsAllocations: [], // 货位
			listDataSource: [],
			tabType: 'TAB_ALL',
			searchParams: {},
			loading: false,
			amountTipText: '',
			statusTipText: ''
		};
	},
	components: {
		iPagination,
		Tab,
		SlFormNew
	},
	computed: {
		VUEX_ST_COMPANYSUER() {
			if (this.$store.state.user) {
				return this.$store.state.user.VUEX_ST_COMPANYSUER || {};
			}
			return {};
		},
		// 仓储企业
		isWarehouse() {
			return this.VUEX_ST_COMPANYSUER.companyType == 'WAREHOUSE';
		},
		// 核心企业
		isCoreCompany() {
			return this.VUEX_ST_COMPANYSUER.companyType == 'CORE_COMPANY';
		},
		searchList() {
			const searchListData = searchList(this.isCoreCompany);
			if (this.type == 'admin') {
				return searchListData.admin;
			}
			if (this.isWarehouse) {
				return searchListData.warehouse;
			}
			return searchListData.core;
		},
		statusData() {
			if (this.type == 'admin') {
				return tabList.admin;
			}
			if (this.isWarehouse) {
				return tabList.warehouse;
			}
			return tabList.core;
		},
		columns() {
			if (this.type == 'admin') {
				return columns.admin;
			}
			if (this.isWarehouse) {
				return columns.warehouse;
			}
			return columns.core;
		}
	},
	watch: {
		searchParams(data) {
			if (data && data.stationId) {
				this.getHouseList(data.stationId);
			}
			if (data && data.warehouseId) {
				this.getGoodsAllocations(data.warehouseId);
			}
		}
	},
	mounted() {
		this.getList();
		this.getTabStatistics();
		if (this.stationApi) {
			this.getStationList();
		} else {
			this.getHouseList();
		}
	},
	methods: {
		formatMoney,
		getPopupContainer,
		resetSearchFunc() {
			this.searchParams = {};
			this.tabType = 'TAB_ALL';
			this.pagination.pageNo = 1;
			// this.pageSize = 10;
			this.getTabStatistics();
		},
		handleSearchChange(data) {
			this.searchParams = data;
			this.getTabStatistics();
			this.getList(1);
		},
		// 切换tab
		changeTab(val) {
			this.tabType = val;
			this.getTabStatistics();
			this.getList(1);
			// this.getHouseList();
		},
		async getList(pageNo = this.pagination.pageNo, pageSize = this.pageSize) {
			this.pagination.pageNo = pageNo;
			this.pageSize = pageSize;
			this.loading = true;
			const params = {
				...this.pagination,
				pageSize: this.pageSize,
				...this.searchParams,
				tabType: this.tabType
			};
			if (params.beginDate) {
				params.beginDate = params.beginDate + ' 00:00:00';
				params.endDate = params.endDate + ' 23:59:59';
			}
			try {
				const res = await this.listApi(params);
				this.loading = false;

				this.listDataSource = res.data.records;
				this.pagination.total = res.data.total;
			} catch (error) {
				this.loading = false;
			}
		},

		// 获取站台列表
		async getStationList() {
			if (!this.stationApi) return;
			const res = await this.stationApi();
			let stationList = res.data || [];
			this.searchList.forEach(item => {
				if (item.decorator[0] === 'stationId') {
					item.options = stationList.map(item => {
						return { value: item.key, label: item.value };
					});
				}
			});
		},

		// 获取仓房列表
		async getHouseList(stationId) {
			if (!this.houseApi) return;
			if (this.stationApi && !stationId) return;

			const params = {};
			if (stationId) {
				params.stationId = stationId;
			}
			const res = await this.houseApi(params);
			this.houseList = res.data || [];
			this.searchList.forEach(item => {
				if (item.decorator[0] === 'warehouseId') {
					item.options = this.houseList.map(item => {
						return { value: item.id, label: item.name, goodsAllocations: item.goodsAllocations };
					});
				}
			});
		},
		// 获取货位
		getGoodsAllocations(id) {
			this.goodsAllocations = (this.houseList.filter(item => item.id == id)[0] || {}).goodsAllocations || [];
			this.searchList.forEach(item => {
				if (item.decorator[0] === 'goodsAllocationId') {
					item.options = this.goodsAllocations.map(item => {
						return { value: item.id, label: item.name };
					});
				}
			});
		},
		goLading(item) {
			this.$emit('goLading', item);
		},
		gotoDetail(record) {
			this.$emit('goDetail', record);
		},
		// 导出
		async exportData() {
			let name = `仓单查询记录-${moment().format('YYYYMMDD')}.xls`;
			const res = await this.exportApi({ ...this.searchParams, tabType: this.tabType });
			comDownload(res, undefined, name);
		},
		// 获取统计
		async getTabStatistics() {
			// if (this.type == 'admin') return;
			if (!this.statisticsApi) return;
			const params = {
				...this.searchParams
			};
			if (params.beginDate) {
				params.beginDate = params.beginDate + ' 00:00:00';
				params.endDate = params.endDate + ' 23:59:59';
			}

			const res = await this.statisticsApi(params);
			const list = res.data || [];
			this.statusData.forEach(el => {
				if ('TAB_EFFECTIVE' == el.value) {
					const item = list.find(el2 => el2.tabType == el.value) || {};
					el.num = item.stateNum;
				}
			});
			this.$forceUpdate();
		},
		mouseenter(record) {
			this.amountTipText = '';
			this.getQuantityTipApi({ id: record.id }).then(res => {
				if (res.success) {
					const { quantity, outboundQuantity, transferQuantity, inventoryQuantity } = res.data;
					let tipText = '';
					if (quantity && quantity > 0) {
						tipText += `仓单数量:${quantity}吨<br>`;
					}
					if (outboundQuantity && outboundQuantity > 0) {
						tipText += `提货数量:${outboundQuantity}吨<br>`;
					}
					if (transferQuantity && transferQuantity > 0) {
						tipText += `转让数量:${transferQuantity}吨<br>`;
					}
					if (inventoryQuantity && inventoryQuantity > 0) {
						tipText += `剩余数量:${inventoryQuantity}吨<br>`;
					}
					this.amountTipText = tipText;
				}
			});
		},
		mouseenterStatus(record) {
			this.statusTipText = '';
			this.statusTipApi({ id: record.id }).then(res => {
				if (res.success) {
					if (this.type == 'admin') {
						this.statusTipText = (res.data || '').replace(/\"/g, '');
					} else {
						this.statusTipText = res.data || '';
					}
				}
			});
		}
	},
	filters: {
		filterCodeByValueName
	}
};
</script>
<style lang="less" scoped>
@import url('~@sub/style/table-cover.less');
</style>
<style lang="less" scoped>
.slMain {
	margin-top: -10px;
}
.amount-tooltip-icon {
	cursor: pointer;
	margin-left: 5px;
	color: rgba(195, 195, 195, 1);
	height: 14px;
	width: 14px;
}

.statusDes {
	display: inline-block;
	padding: 4px 6px;
	border-radius: 4px;
	font-size: 12px;
	line-height: 12px;
	background: #d3dffb;
	color: #4682f3;
	cursor: pointer;
	&.status-WAIT_SELLER_AUDITING,
	&.status-TO_STORAGE_SIGN,
	&.status-TO_STORAGE_AUDITING {
		background: #c9d9ff;
		color: #596fa0;
	}
	&.status-OUTBOUND {
		background: #c5ecdd;
		color: #3eb384;
	}

	&.status-REJECT {
		background: #f2d0d0;
		color: #dd4444;
	}

	&.status-CANCEL {
		// 已作废
		background: #e0e0e0;
		color: rgba(0, 0, 0, 0.25);
	}
}
</style>
