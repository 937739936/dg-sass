<template>
	<div class="slMain">
		<a-card :bordered="false">
			<div class="methods-wrap">
				<span
					slot="title"
					class="slTitle"
					>应收融资管理</span
				>
				<a-space style="text-align: right">
					<a-button
						type="primary"
						@click="goApply"
						v-if="!isBank || isShangHai"
						v-auth="'finance:finance:apply'"
						>融资申请</a-button
					>
				</a-space>
			</div>
			<SlFormNew
				:list="searchList"
				layout="inline"
				style="margin: 10px 0"
				@change="handleChange"
				@resetFunc="resetFunc"
			></SlFormNew>
			<Tab
				:statusData="statusData"
				:currentStatus="status"
				@callback="changeTab"
				@export="exportData"
				@synchro="synchroData"
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
						slot="planFinancingAmount"
						slot-scope="text, record"
					>
						<a-tooltip>
							<template
								slot="title"
								v-if="text"
							>
								{{ convertCurrency(text) }}
							</template>
							<span v-if="text">{{ formatMoney(text) }}</span>
							<span v-else>-</span>
						</a-tooltip>
					</template>
					<template
						slot="finAmount"
						slot-scope="text, record"
					>
						<a-tooltip>
							<template
								slot="title"
								v-if="text"
							>
								{{ convertCurrency(text) }}
							</template>
							<span v-if="text">{{ formatMoney(text) }}</span>
							<span v-else>-</span>
						</a-tooltip>
					</template>
					<template slot="customTitles1">{{ isBank ? '融资企业' : '出资机构' }}</template>
					<template
						slot="bankName"
						slot-scope="text, record"
						>{{ isBank ? record.financier : record.bankName }}</template
					>

					<template
						slot="receivableAmount"
						slot-scope="text, record"
					>
						<a-tooltip>
							<template slot="title">
								{{ convertCurrency(text) }}
							</template>
							{{ formatMoney(text) }}
						</a-tooltip>
					</template>
					<template
						slot="action"
						slot-scope="text, record"
					>
						<a-space>
							<a
								href="javascript:;"
								v-auth="'finance:finance:detail'"
								@click="gotoDetail(record)"
								>详情</a
							>
							<a
								v-auth="'finance:finance:audit'"
								style="margin-left: 20px"
								v-if="record.canAudit && record.status == 'CORE_COMPANY_AUDIT'"
								href="javascript:;"
								@click="gotoAudit(record)"
								>审核</a
							>
							<a
								v-if="
									record.bankUscc != CONSTANTS.hnycUscc &&
									record.bankUscc != CONSTANTS.wwylUscc &&
									record.canAudit &&
									record.status == 'BANK_AUDIT'
								"
								style="margin-left: 20px"
								v-auth="'finance:finance:audit'"
								href="javascript:;"
								@click="gotoAudit(record)"
								>审核</a
							>

							<!-- 待签约状态 发起人 -->
							<a
								v-if="record.canSign && record.status == 'TO_BE_SIGNED'"
								style="margin-left: 20px"
								v-auth="'finance:finance:seal'"
								href="javascript:;"
								@click="gotoSign(record)"
							>
								盖章</a
							>
							<!-- 金融机构审核盖章 核心企业审核盖章 -->
							<a
								v-auth="'finance:finance:seal'"
								style="margin-left: 20px"
								v-if="record.canSign && record.status != 'TO_BE_SIGNED'"
								href="javascript:;"
								@click="gotoSign2(record)"
								>盖章</a
							>
						</a-space>
					</template>

					<div
						slot="status"
						slot-scope="text, record"
					>
						<FinancingTipInfo
							:item="record"
							:API_GetFinancingStatusTip="API_GetFinancingStatusTip"
						/>
					</div>
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
import { formatMoney } from '@sub/filters';
import iPagination from '@sub/components/iPagination';
import FinancingTipInfo from '@sub/financing/FinancingTipInfo.vue';
import Tab from '@sub/financing/Tab.vue';
import SlFormNew from '@sub/components/ui-new/Form/sl-form';
import { filterCodeByValueName, filterCodeByKey, convertCurrency } from '@sub/utils/globalCode.js';

const customRender = t => t || '-';

const columns = [
	{ title: '融资编号', dataIndex: 'serialNo', key: 'serialNo' },
	{ dataIndex: 'bankName', key: 'bankName', slots: { title: 'customTitles1' }, scopedSlots: { customRender: 'bankName' } },
	{ title: '核心企业', dataIndex: 'buyerName', key: 'buyerName', customRender: (t, r) => r.coreCompanyName || r.buyerName },
	{ title: '行业', dataIndex: 'industryTypeDesc', key: 'industryTypeDesc' },
	{
		title: '拟融资金额(元)',
		dataIndex: 'planFinancingAmount',
		key: 'planFinancingAmount',
		scopedSlots: { customRender: 'planFinancingAmount' }
	},
	{ title: '放款金额(元)', dataIndex: 'finAmount', key: 'finAmount', scopedSlots: { customRender: 'finAmount' } },

	{ title: '融资利率（%）', dataIndex: 'rate', key: 'rate' },
	{ title: '融资起息日', dataIndex: 'beginDate', key: 'beginDate', customRender },
	{ title: '融资到期日', dataIndex: 'endDate', key: 'endDate', customRender },
	{ title: '应收账款流水号', dataIndex: 'receivableSerialNo', key: 'receivableSerialNo' },
	{
		title: '应收账款金额（元）',
		dataIndex: 'receivableAmount',
		key: 'receivableAmount',
		scopedSlots: { customRender: 'receivableAmount' }
	},
	{ title: '状态', key: 'statusText', dataIndex: 'statusText', fixed: 'right', scopedSlots: { customRender: 'status' } },
	{ title: '操作', key: 'action', fixed: 'right', scopedSlots: { customRender: 'action' } }
];

const searchList = [
	{
		decorator: ['serialNo'],
		addonBeforeTitle: '编号',
		type: 'input',
		placeholder: '请输入融资编号或应收账款流水号'
	},
	{
		decorator: ['bankName'],
		addonBeforeTitle: '出资机构',
		type: 'input',
		placeholder: '请输入出资机构'
	},
	{
		decorator: ['beginDate'],
		addonBeforeTitle: '融资起息日',
		type: 'rangePicker',
		realKey: ['beginDateStart', 'beginDateEnd']
	},
	{
		decorator: ['endDate'],
		addonBeforeTitle: '融资到期日',
		type: 'rangePicker',
		realKey: ['endDateStart', 'endDateEnd']
	},
	{
		decorator: ['buyerName'],
		addonBeforeTitle: '核心企业',
		type: 'input',
		placeholder: '请输入核心企业'
	},
	{
		decorator: ['industryType'],
		addonBeforeTitle: '行业',
		type: 'select',
		placeholder: '请选择行业',
		options: [
			{ value: 'COAL', label: '煤炭' },
			{ value: 'STEEL', label: '钢材' }
		]
	}
];

export default {
	props: {
		listApi: {},
		syncApi: {},
		API_GetFinancingStatusTip: {},
		getFinancingStatistics: {}
	},
	data() {
		return {
			columns,
			// constants,
			searchList,
			pagination: {
				pageNo: 1,
				total: 0
			},
			pageSize: 10,
			listDataSource: [],
			statusData: [
				{ label: '全部', value: 'ALL', num: 0 },
				{ label: '待我方审核', value: 'AUDIT', num: 0 },
				{ label: '待我方盖章', value: 'SIGN', num: 0 },
				{ label: '待对方审核', value: 'PARTY_AUDIT' },
				{ label: '待对方盖章', value: 'PARTY_SIGN' },
				{ label: '待放款', value: 'WAITING_LOAN' },
				{ label: '已放款', value: 'LOANED' },
				{ label: '部分还款', value: 'PART_REPAY' },
				{ label: '已结清', value: 'CLEARED' },
				{ label: '无效', value: 'INVALID' }
			],
			status: '',
			searchParams: {},
			loading: false
		};
	},
	components: {
		iPagination,
		FinancingTipInfo,
		Tab,
		SlFormNew
	},
	computed: {
		VUEX_ST_COMPANYSUER() {
			if (this.$store.state.user) {
				return this.$store.state.user.VUEX_ST_COMPANYSUER;
			}
			return {};
		},
		// 判断当前是否是金融机构
		isBank() {
			return this.VUEX_ST_COMPANYSUER.companyType == 'FINANCIAL_ORG';
		},
		isShangHai() {
			return this.VUEX_ST_COMPANYSUER.companyUscc == '913101150935451053';
		}
	},
	mounted() {
		this.getList();
		this.getTabStatistics();
	},
	methods: {
		formatMoney,
		convertCurrency,
		resetFunc() {
			this.searchParams = {};
			this.status = 'ALL';
			this.pagination.pageNo = 1;
			this.pageSize = 10;
			this.getTabStatistics();
		},
		handleChange(data) {
			this.searchParams = data;
			this.getTabStatistics();
			this.getList();
		},
		async getList(pageNo = this.pagination.pageNo, pageSize = this.pageSize) {
			this.pagination.pageNo = pageNo;
			this.loading = true;
			this.pageSize = pageSize;
			const params = {
				...this.pagination,
				pageSize: this.pageSize,
				...this.searchParams,
				status: this.status
			};
			try {
				const res = await this.listApi(params);
				this.loading = false;

				this.listDataSource = res.data.records;
				this.pagination.total = res.data.total;
			} catch (error) {
				this.loading = false;
			}
		},
		gotoDetail(record) {
			this.$router.push({
				path: 'financingDetail',
				query: {
					id: record.id,
					bankUscc: record.bankUscc,
					handleType: 'detail'
				}
			});
		},
		// 导出
		exportData() {
			this.$emit('export', { ...this.searchParams, status: this.status });
		},
		// 同步
		synchroData() {
			this.$confirm({
				centered: true,
				title: '确定同步吗?',
				okText: '确定',
				cancelText: '取消',
				onOk: () => {
					this.syncApi().then(res => {
						this.$message.success('同步成功');
						this.getList();
					});
				},
				onCancel() {}
			});
		},
		// 切换tab
		changeTab(val) {
			this.status = val;
			this.getTabStatistics();
			this.getList(1, 10);
		},
		// 签章
		gotoSign(record) {
			this.$router.push({
				path: '/center/financing/financingSign',
				query: {
					id: record.id
				}
			});
		},
		// 签章
		// 金融机构盖章
		gotoSign2(record) {
			this.$router.push({
				path: '/center/financing/financingAuditSign',
				query: {
					auditOpinion: '通过',
					type: this.isBank ? 'jr' : 'main',
					id: record.id
				}
			});
		},
		gotoAudit(record) {
			const query = {
				id: record.id,
				handleType: 'audit',
				bankUscc: record.bankUscc
			};
			this.$router.push({
				path: '/center/financing/financingDetailAudit',
				query
			});
		},
		goApply() {
			this.$emit('goApply');
		},
		// 获取统计
		async getTabStatistics() {
			if (!this.getFinancingStatistics) return;
			const params = {
				...this.searchParams
			};
			const res = await this.getFinancingStatistics(params);
			const list = res.data || [];
			this.statusData.forEach(el => {
				const item = list.find(el2 => el2.status == el.value) || {};
				el.num = item.count;
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
.slMain {
	margin-top: -10px;
}
.methods-wrap {
	width: 100%;
	height: 48px;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	padding-bottom: 14px;
	box-sizing: border-box;
	border-bottom: 1px solid #e5e6eb;
}
</style>
