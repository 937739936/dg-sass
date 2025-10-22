<template>
	<div>
		<SlFormNew
			:list="searchList"
			layout="inline"
			style="margin: 10px 0"
			@change="handleSearchChange"
			@resetFunc="resetSearchFunc"
		></SlFormNew>
		<Tab
			ref="tab"
			:statusData="statusData"
			:currentStatus="tabType"
			:showExport="exportApi"
			:showSync="synchroApi"
			@callback="changeTab"
			@export="exportData"
			@synchro="synchro"
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
				<span
					slot="amount"
					slot-scope="amount"
					v-nullValue="amount"
					v-mainTip="convertCurrency(amount)"
					>{{ amount | formatMoney }}</span
				>
				<span
					slot="planFinancingAmount"
					slot-scope="planFinancingAmount"
					v-nullValue="planFinancingAmount"
					v-mainTip="convertCurrency(planFinancingAmount)"
					>{{ planFinancingAmount | formatMoney }}</span
				>
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
						<span>{{ item.statusText || '-' }}</span>
					</a-tooltip>
				</div>
				<template
					slot="action"
					slot-scope="text, record"
				>
					<slot
						name="customAction"
						:record="record"
					></slot>
				</template>
			</a-table>
		</div>
		<i-pagination
			:pagination="pagination"
			@change="getList"
		/>
	</div>
</template>

<script>
import { formatMoney } from '@sub/filters';
import { convertCurrency } from '@sub/utils/factory';
import iPagination from '@sub/components/iPagination';
import Tab from '@sub/componentsAssets/components/Tab.vue';
import SlFormNew from '@sub/components/ui-new/Form/sl-form';
import { getPopupContainer } from '@sub/utils/factory.js';
import comDownload from '@sub/utils/comDownload';
import moment from 'moment';

const tableTooltip = {
	TO_BE_VERIFY: '该资产已生成，待【资产编辑企业】编辑后提交',
	TO_BE_CONFIRM: '该资产待【资产编辑企业-签章员】进行盖章',
	PLATFORM_AUDIT: '该资产已被【资产编辑企业】提交，正处于平台风控审核流程',
	PLATFORM_REJECT: '该资产已被平台风控驳回，待【资产编辑企业】编辑后提交',
	OA_AUDIT: '该资产正处于【审批流程】流程',
	OA_REJECT: '该资产【审批流程】流程未通过',
	BANK_PUSH_FAIL: '该资产推送资方系统失败，待平台风控进行处理',
	BANK_AUDIT: '该资产待【金融机构】进行审核',
	TODO: '该资产可发起融资申请',
	DOING: '该资产正处于融资提款流程中',
	BANK_REJECT: '该资产被【金融机构】审核驳回，待平台风控进行批注',
	COMMENTED: '该资产平台风控已批注，待【资产编辑企业】编辑后提交',
	FUNDED: '该资产已完成融资',
	CANCEL: '该资产已被【操作方】作废，作废原因：【作废原因】',
	INVALID: '该资产已超过资产到期日',
	IN_POOL: '该资产入池申请已通过',
	OUT_POOL: '该资产已出应收账款保理池',
	BANK_TO_BE_VERIFY: '该资产已推送到资方系统，请【资产编辑企业】登录【金融机构】系统进行后续操作',
	COUNTERFOIL_DOING: '该资产正在开立云票中',
	COUNTERFOIL_DONE: '该资产已成功开立云票',
	COUNTERFOIL_TODO: '该资产待【资产编辑企业】进行开立云票',
	TO_BE_SIGN: '该资产待【资产上游卖方企业-签章员】进行盖章'
};

export default {
	props: {
		searchList: { default: [] },
		defaultStatusData: { default: [] },
		defaultTabType: { default: 'TAB_ALL' },
		tabTypeName: { default: 'tabType' },
		columns: { default: [] },
		listApi: {},
		statisticsApi: {},
		exportApi: {},
		exportName: {},
		synchroApi: {},
		statusTipApi: {}
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
			statusData: this.defaultStatusData,
			tabType: this.defaultTabType,
			searchParams: {},
			loading: false,
			amountTipText: '',
			statusTipText: '',
			convertCurrency
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
		keepAlive() {
			return this.$route.meta.keepAlive;
		}
	},
	watch: {},
	mounted() {
		if (!this.keepAlive) {
			this.getList();
			this.getTabStatistics();
		}
	},
	activated() {
		if (this.keepAlive) {
			this.getList();
			this.getTabStatistics();
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
		},
		async getList(pageNo = this.pagination.pageNo, pageSize = this.pageSize) {
			this.pagination.pageNo = pageNo;
			this.pageSize = pageSize;
			this.loading = true;
			let params = {
				...this.pagination,
				pageSize: this.pageSize,
				...this.searchParams
			};
			params[this.tabTypeName] = this.tabType;
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
		// 导出
		async exportData() {
			if (!this.exportApi) return;
			let name = `${this.exportName || '数据导出'}-${moment().format('YYYYMMDD')}.xls`;
			let param = { ...this.searchParams };
			param[this.tabTypeName] = this.tabType;
			const res = await this.exportApi(param);
			comDownload(res, undefined, name);
		},
		// 数据同步
		synchro() {
			if (!this.synchroApi) return;
			if (this.$refs.tab) {
				this.$refs.tab.isSyncLoading = true;
			}
			this.synchroApi()
				.then(res => {
					if (this.$refs.tab) {
						this.$refs.tab.isSyncLoading = false;
					}
					if (res.success) {
						if (res.data) {
							this.$message.success('同步成功');
							this.getList();
						}
					}
				})
				.catch(e => {
					if (this.$refs.tab) {
						this.$refs.tab.isSyncLoading = false;
					}
				});
		},
		// 获取统计
		async getTabStatistics() {
			if (!this.statisticsApi) return;
			const params = {
				...this.searchParams
			};
			const res = await this.statisticsApi(params);
			const list = res.data || [];
			this.statusData.forEach(el => {
				// 	if ('TAB_EFFECTIVE' == el.value) {
				if (Array.isArray(list)) {
					const item = list.find(el2 => el2.tabType == el.value) || {};
					if (el.num != undefined) {
						el.num = item.stateNum;
					}
				} else {
					if (el.num != undefined) {
						el.num = list[el.value] || 0;
					}
				}
				// 	}
			});
			this.$forceUpdate();
		},
		// mouseenter(record) {
		// 	this.amountTipText = '';
		// },
		mouseenterStatus(record) {
			this.statusTipText = '';
			this.statusTipApi({ assetNo: record.serialNo }).then(res => {
				if (res.success) {
					this.tipShowTextMethods(record, res.data);
				}
			});
		},
		tipShowTextMethods(row, data) {
			let text = '';
			if (data.financingStatusTip) {
				this.statusTipText = data.financingStatusTip;
				return;
			}
			text = tableTooltip[row.status] || '';
			if (!text) {
				this.statusTipText = text || row.statusText;
				return;
			}
			text = text
				.replace('【资产编辑企业】', data.initAbbreviation || '')
				.replace('【资产编辑企业-签章员】', data.initAbbreviation + '-' + data.signerNames)
				.replace('【资产上游卖方企业-签章员】', data.initAbbreviation + '-' + data.signerNames)
				.replace('【审批流程】', data.auditDesc || '')
				.replace('【金融机构】', data.bankAbbreviation || '')
				.replace('【操作方】', data.operator || '')
				.replace('【作废原因】', data.cancelReason || '');
			this.statusTipText = text;
		}
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

	&.status-TO_BE_CONFIRM,
	&.status-TO_BE_SIGN,
	&.status-TO_STORAGE_AUDITING {
		background: #c9d9ff;
		color: #596fa0;
	}

	&.status-COUNTERFOIL_DONE,
	&.status-FUNDED {
		background: #c5ecdd;
		color: #3eb384;
	}

	&.status-PLATFORM_REJECT,
	&.status-OA_REJECT,
	&.status-BANK_REJECT,
	&.status-PLATFORM_OPERATE_REJECT,
	&.status-BANK_ROLLBACK {
		background: #f2d0d0;
		color: #dd4444;
	}

	&.status-INVALID,
	&.status-CANCEL {
		// 已作废
		background: #e0e0e0;
		color: rgba(0, 0, 0, 0.25);
	}
}
</style>
