<template>
	<div>
		<SlFormNew
			:list="searchList"
			layout="inline"
			style="margin: 10px 0"
			@change="handleChange"
			@resetFunc="resetFunc"
		></SlFormNew>
		<Tab
			:statusData="statusData"
			:currentStatus="tabType"
			:isExport="false"
			@callback="changeTab"
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
				<div
					slot="quantity"
					slot-scope="text"
				>
					{{ text | formatMoney(4) }}
				</div>
				<div
					slot="statusDesc"
					slot-scope="text, item"
					:class="`statusDes status-${item.status}`"
				>
					{{ text || '-' }}
				</div>
				<template
					slot="warehouseReceiptNo"
					slot-scope="text, record"
				>
					<span v-if="record.allOutbound == 1">{{ text || '-' }}</span>
					<span
						v-else
						style="color: rgba(119, 136, 157, 1)"
						>{{ text || '-' }}</span
					>
				</template>
				<div
					slot="action"
					slot-scope="action, item"
				>
					<template>
						<a-space
							:size="24"
							v-if="isWarehouse"
						>
							<a
								href="javascript:void(0)"
								@click="handleViewDetail(item)"
							>
								查看
							</a>
							<a
								v-if="item.status == 'TO_STORAGE_AUDITING'"
								href="javascript:void(0)"
								@click="gotoAudit(item)"
								>审核</a
							>
							<a
								v-if="item.status == 'TO_STORAGE_SIGN'"
								href="javascript:void(0)"
								@click="gotoSign(item)"
								>盖章</a
							>
						</a-space>
						<a-space
							:size="24"
							v-else-if="deliveryFlag == 1"
						>
							<a
								href="javascript:void(0)"
								@click="handleViewDetail(item)"
							>
								查看
							</a>
							<a
								v-if="item.status == 'TO_SUBMIT'"
								href="javascript:void(0)"
								@click="handleModify(item)"
								>编辑</a
							>
							<a
								v-if="item.status == 'TO_SUBMIT'"
								href="javascript:void(0)"
								@click="handleDelete(item)"
								>删除</a
							>
						</a-space>
						<a-space
							:size="24"
							v-else-if="deliveryFlag == 2"
						>
							<a
								href="javascript:void(0)"
								@click="handleViewDetail(item)"
							>
								查看
							</a>
							<a
								v-if="item.status == 'WAIT_SELLER_AUDITING'"
								href="javascript:void(0)"
								@click="gotoAudit(item)"
								>审核</a
							>
						</a-space>
						<a-space
							:size="24"
							v-if="type == 'admin'"
						>
							<a
								href="javascript:void(0)"
								@click="handleViewDetail(item)"
							>
								查看
							</a>
						</a-space>
					</template>
				</div>
			</a-table>
		</div>
		<i-pagination
			:pagination="pagination"
			@change="getList"
		/>
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
import moment from 'moment';

export default {
	props: {
		listApi: {},
		statisticsApi: {},
		exportApi: {},
		deliveryFlag: {},

		type: {
			default: 'rest'
		}
	},
	data() {
		return {
			columns: [],
			pageSize: 10,
			listDataSource: [],
			statusData: [],
			tabType: '',
			searchList: [],
			searchParams: {},
			loading: false,
			visible: false,
			reason: '',
			pagination: {
				pageNo: 1,
				total: 0
			}
		};
	},
	components: {
		iPagination,
		Tab,
		SlFormNew
	},
	created() {
		const searchListData = searchList(this.isCoreCompany);
		const statusData = tabList(this.isCoreCompany);
		if (this.type == 'admin') {
			this.searchList = searchListData.admin;
			this.statusData = statusData.admin;
			this.columns = columns.admin;
		} else if (this.isWarehouse) {
			this.searchList = searchListData.warehouse;
			this.statusData = statusData.warehouse;
			this.columns = columns.warehouse;
		} else {
			if (this.deliveryFlag == 1) {
				// 我发起的
				this.searchList = searchListData.core_1;
				this.statusData = statusData.core_1;
				this.columns = columns.core_1;
			}
			if (this.deliveryFlag == 2) {
				// 我收到的
				this.searchList = searchListData.core_2;
				this.statusData = statusData.core_2;
				this.columns = columns.core_2;
			}
		}
		this.tabType = this.statusData[0].value;
	},
	computed: {
		VUEX_ST_COMPANYSUER() {
			if (this.$store.state.user) {
				return this.$store.state.user.VUEX_ST_COMPANYSUER || {};
			}
			return {};
		},
		// 核心企业
		isCoreCompany() {
			return this.VUEX_ST_COMPANYSUER.companyType == 'CORE_COMPANY';
		},
		// 仓储企业
		isWarehouse() {
			return this.VUEX_ST_COMPANYSUER.companyType == 'WAREHOUSE';
		}
	},
	mounted() {
		this.getList();
		this.getTabStatistics();
	},
	methods: {
		formatMoney,
		getPopupContainer,
		resetFunc() {
			this.searchParams = {};
			this.tabType = this.statusData[0].value;
			this.pagination.pageNo = 1;
			// this.pageSize = 10;
			this.getTabStatistics();
		},
		handleChange(data) {
			this.searchParams = data;
			this.getTabStatistics();
			this.getList(1);
		},
		// 切换tab
		changeTab(val) {
			this.tabType = val;
			this.getTabStatistics();
			this.getList(1);
		},
		async getList(pageNo = this.pagination.pageNo) {
			this.pagination.pageNo = pageNo;

			this.loading = true;
			let params = {
				tabType: this.tabType,
				...this.pagination,
				pageSize: this.pageSize,
				...this.searchParams
			};
			if (this.deliveryFlag) {
				params.deliveryFlag = this.deliveryFlag;
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
		handleViewDetail(record) {
			this.$emit('handleViewDetail', record);
		},
		handleModify(record) {
			this.$emit('handleModify', record);
		},
		handleDelete(item) {
			this.$emit('handleDelete', item);
		},
		// 审核
		gotoAudit(record) {
			this.$emit('gotoAudit', record);
		},
		// 签章
		gotoSign(record) {
			this.$emit('gotoSign', record);
		},

		// 获取统计
		async getTabStatistics() {
			if (this.type == 'admin') return;
			if (!this.statisticsApi) return;
			if (this.deliveryFlag == 1) return;
			let params = {
				...this.searchParams
			};
			if (this.deliveryFlag) {
				params.deliveryFlag = this.deliveryFlag;
			}
			const res = await this.statisticsApi(params);
			const list = res.data || [];
			this.statusData.forEach(el => {
				let tabs = [];
				if (this.deliveryFlag == 2) {
					tabs = ['TAB_MY_AUDITING', 'TAB_WAIT_SELLER_AUDITING'];
				} else if (this.isWarehouse) {
					tabs = ['TAB_STORAGE_AUDITING', 'TAB_STORAGE_SIGN'];
				}
				if (tabs.includes(el.value)) {
					const item = list.find(el2 => el2.tabType == el.value) || {};
					el.num = item.stateNum;
				}
			});
			this.$forceUpdate();
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
<style lang="less">
.more-btn-tooltips {
	z-index: 100;
	.ant-tooltip-inner {
		padding: 10px 0;
		background-color: #fff;
		& > a {
			font-family:
				PingFangSC-Regular,
				PingFang SC;
			color: @primary-color;
			line-height: 32px;
			display: block;
			height: 32px;
			padding: 0 15px;
			text-align: center;
		}
		a {
			margin-bottom: 0 !important;
		}
		& > a:active {
			background-color: #e4ebf4;
		}
		& > a:hover {
			background-color: #e4ebf4;
		}
	}
	.ant-tooltip-arrow::before {
		background-color: #fff;
	}
}
</style>
<style lang="less" scoped>
.statusDes {
	display: inline-block;
	padding: 4px 6px;
	border-radius: 4px;
	font-size: 12px;
	line-height: 12px;
	background: #d3dffb;
	color: #4682f3;
	&.status-WAIT_SELLER_AUDITING,
	&.status-TO_STORAGE_SIGN,
	&.status-TO_STORAGE_AUDITING {
		background: #c9d9ff;
		color: #596fa0;
	}
	&.status-OUTBOUND {
		// 已生效
		background: #c5ecdd;
		color: #3eb384;
	}

	&.status-SELLER_REJECT,
	&.status-STORAGE_REJECT {
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
