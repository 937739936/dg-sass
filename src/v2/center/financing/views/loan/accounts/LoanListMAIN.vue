<template>
	<div class="slMain mt-10">
		<a-card :bordered="false">
			<div
				class="methods-wrap"
				slot="title"
			>
				<span class="slTitle">应收类放还款管理</span>
				<div class="titleNotes">
					<img
						width="14"
						src="@/v2/assets/imgs/common/table_notes.png"
						alt=""
					/>
					<span>以下统计板块根据表格筛选结果统计，且已作废数据已过滤</span>
				</div>
			</div>
			<div style="margin-top: 30px">
				<TopSum
					ref="TopSum"
					type="ACCOUNTS_RECEIVABLE"
				/>
				<SlFormNew
					:list="searchList"
					layout="inline"
					@change="handleChange"
				></SlFormNew>
				<div style="margin-top: 30px">
					<Tabs
						:statusData="tabList"
						ref="tabs"
						@callback="changeTab"
						@export="exportData"
					>
					</Tabs>
				</div>
				<div :class="'record-list table-box ' + (pagination.total > 10 ? 'fixedBottom' : '')">
					<a-table
						class="new-table"
						:pagination="false"
						:columns="columns"
						:data-source="dataSource"
						:scroll="{ x: true }"
						rowKey="id"
						style="margin-top: 22px"
					>
						<div
							slot="finAmount"
							slot-scope="text"
						>
							<a-tooltip>
								<template slot="title">{{ convertCurrency(text) }} </template>
								{{ formatMoney(text) }}
							</a-tooltip>
						</div>
						<div
							slot="repayPrincipal1"
							slot-scope="text, record"
						>
							<a-tooltip>
								<template slot="title">
									{{ convertCurrency(record.finAmount - record.repayPrincipal) }}
								</template>
								{{ formatMoney(record.finAmount - record.repayPrincipal) }}
							</a-tooltip>
						</div>
						<template
							slot="remainDay"
							slot-scope="text, record"
						>
							<span
								v-if="record.status === 'CLEARED'"
								class="remainDay3"
							>
								-
							</span>
							<span v-else-if="text >= 10">{{ text }}天</span>
							<span
								v-else-if="text >= 0"
								class="remainDay1"
								>{{ text }}天</span
							>
							<span
								v-else-if="text < 0"
								class="remainDay2"
							>
								超期{{ Math.abs(text) }}天
							</span>
							<span
								v-else
								class="remainDay3"
								>-</span
							>
						</template>
						<div
							slot="action"
							slot-scope="text, record"
						>
							<a-space>
								<template v-if="status != 'WAITING_AUDIT'">
									<a
										v-auth="['finance:repayC:view', 'finance:repayS:view']"
										href="javascript:;"
										@click="gotoDetail(record)"
									>
										详情
									</a>

									<a
										v-if="checkLoanApply(record)"
										v-auth="'finance:repayC:apply'"
										href="javascript:;"
										@click="goApply(record)"
									>
										还款申请
									</a>
								</template>
								<template v-else>
									<a
										v-auth="'finance:repayS:confirm'"
										href="javascript:;"
										@click="$router.push('loanReceipt?id=' + record.applyId + '')"
									>
										收款确认
									</a>
								</template>
							</a-space>
						</div>
						<div
							slot="status"
							slot-scope="text, record"
						>
							<FinancingTipInfo :item="record" />
						</div>
					</a-table>
					<i-pagination
						:pagination="pagination"
						@change="getList"
					/>
				</div>
			</div>
		</a-card>
	</div>
</template>
<script>
const customRender = text => text || '-'; //空数据用-代替
const columns = [
	{
		title: '合同编号',
		dataIndex: 'contractNo',
		key: 'contractNo',
		customRender
	},
	{ title: '融资方', dataIndex: 'financier', key: 'financier', customRender },
	{ title: '出资机构', dataIndex: 'bankName', key: 'bankName', customRender },
	{
		title: '放款金额(元)',
		dataIndex: 'finAmount',
		key: 'finAmount',
		scopedSlots: { customRender: 'finAmount' }
	},
	{
		title: '融资放款日',
		dataIndex: 'beginDate',
		key: 'beginDate',
		customRender
	},
	{ title: '融资到期日', dataIndex: 'endDate', key: 'endDate', customRender },
	{
		title: '已还本金(元)',
		dataIndex: 'repayPrincipal',
		key: 'repayPrincipal',
		scopedSlots: { customRender: 'finAmount' }
	},
	{
		title: '已还利息(元)',
		dataIndex: 'repayInterest',
		key: 'repayInterest',
		scopedSlots: { customRender: 'finAmount' }
	},
	{
		title: '未还本金(元)',
		dataIndex: 'repayPrincipal1',
		key: 'repayPrincipal1',
		scopedSlots: { customRender: 'repayPrincipal1' }
	},
	{
		title: '应收账款流水号',
		dataIndex: 'receivableSerialNo',
		key: 'receivableSerialNo',
		customRender
	},
	{
		title: '融资类型',
		dataIndex: 'financingTypeText',
		key: 'financingTypeText',
		customRender
	},
	{
		title: '付款流水号',
		dataIndex: 'paymentSerialNo',
		key: 'paymentSerialNo',
		customRender
	},
	{
		title: '融资编号',
		dataIndex: 'financingApplySerialNo',
		key: 'financingApplySerialNo',
		customRender
	},
	{
		title: '行业',
		dataIndex: 'industryTypeDesc',
		key: 'industryTypeDesc',
		customRender
	},
	{
		title: '距离还款日剩余',
		dataIndex: 'remainDay',
		fixed: 'right',
		scopedSlots: { customRender: 'remainDay' }
	},
	{
		title: '状态',
		dataIndex: 'statusText',
		key: 'statusText',
		fixed: 'right',
		scopedSlots: { customRender: 'status' }
	},
	{
		title: '操作',
		key: 'action',
		scopedSlots: { customRender: 'action' },
		fixed: 'right'
	}
];
const columnsShou = [
	{
		title: '合同编号',
		dataIndex: 'contractNo',
		key: 'contractNo',
		customRender
	},
	{
		title: '卖方企业',
		dataIndex: 'sellerName',
		key: 'sellerName',
		customRender
	},
	{ title: '买方企业', dataIndex: 'buyerName', key: 'buyerName', customRender },
	{ title: '出资机构', dataIndex: 'bankName', key: 'bankName', customRender },
	{
		title: '本次还款金额（元）',
		dataIndex: 'repayPrincipal',
		key: 'repayPrincipal',
		scopedSlots: { customRender: 'finAmount' }
	},
	{ title: '还款日期', dataIndex: 'repayDate', key: 'repayDate', customRender },
	{
		title: '还款申请时间',
		dataIndex: 'createDate',
		key: 'createDate',
		customRender
	},
	{
		title: '还款申请编号',
		dataIndex: 'repayApplySerialNo',
		key: 'repayApplySerialNo',
		customRender
	},
	{
		title: '融资编号',
		dataIndex: 'financingApplySerialNo',
		key: 'financingApplySerialNo',
		customRender
	},
	{
		title: '行业',
		dataIndex: 'industryTypeDesc',
		key: 'industryTypeDesc',
		customRender
	},
	{
		title: '距离还款日剩余',
		dataIndex: 'remainDay',
		fixed: 'right',
		scopedSlots: { customRender: 'remainDay' }
	},
	{
		title: '状态',
		dataIndex: 'statusText',
		key: 'statusText',
		fixed: 'right',
		scopedSlots: { customRender: 'status' }
	},
	{
		title: '操作',
		key: 'action',
		fixed: 'right',
		scopedSlots: { customRender: 'action' }
	}
];
import {
	API_GetLoanList,
	API_FinancingbankList,
	API_ExportLoanDetailListMAIN,
	API_GetLoanListMAINCOUNT,
	API_GetLoanListConfirm
} from '@/v2/center/financing/api/index.js';
import { filterCodeByKey } from '@sub/utils/globalCode.js';
import { formatMoney } from '@sub/filters';
import { convertCurrency, getPopupContainer, delKeep } from '@/v2/utils/factory.js';
import TopSum from '../common/TopSum.vue';
import { mapGetters } from 'vuex';
import FinancingTipInfo from '@/v2/center/financing/views/financing/common/FinancingTipInfo.vue';
import Tabs from '@/v2/center/financing/components/Tabs';
import { hasAuth } from '@/v2/utils/checkAuth';
import { ListMixin } from '@/v2/components/mixin/ListMixin';
const searchList = [
	{
		decorator: ['serialNo'],
		addonBeforeTitle: '编号',
		type: 'input',
		placeholder: '请输入融资编号/应收账款流水号/合同编号'
	},
	{
		decorator: ['bankName'],
		addonBeforeTitle: '出资机构',
		type: 'input',
		placeholder: '请输入出资机构'
	},
	{
		decorator: ['financier'],
		addonBeforeTitle: '融资方',
		type: 'input',
		placeholder: '请输入融资方'
	},
	{
		decorator: ['issuedDate'],
		addonBeforeTitle: '融资放款日',
		type: 'rangePicker',
		realKey: ['beginDateStart', 'beginDateEnd']
	},
	{
		decorator: ['issuedDate2'],
		addonBeforeTitle: '融资到期日',
		type: 'rangePicker',
		realKey: ['endDateStart', 'endDateEnd']
	},
	{
		decorator: ['industryType'],
		addonBeforeTitle: '行业',
		type: 'select',
		placeholder: '请选择',
		options: [
			{ value: 'COAL', label: '煤炭' },
			{ value: 'STEEL', label: '钢材' }
		]
	},
	{
		decorator: ['status'],
		addonBeforeTitle: '融资状态',
		type: 'select',
		placeholder: '请选择',
		// 不要已作废
		options: filterCodeByKey('loanStatusDict').filter(item => item.value !== 'INVALID')
	},
	{
		decorator: ['remainDay'],
		addonBeforeTitle: '距离还款日期剩余',
		type: 'select',
		placeholder: '请选择剩余天数',
		options: [
			{ value: 'LE10', label: '0-10天' },
			{ value: 'GT10', label: '10天以上' },
			{ value: 'EXPIRED', label: '已超期' },
			{ value: 'CLEARED', label: '已结清' }
		]
	}
];
export default {
	mixins: [ListMixin],
	data() {
		return {
			getPopupContainer,
			convertCurrency,
			formatMoney,
			chuziData: [],
			statusData: filterCodeByKey('loanStatusDict'),
			searchList,
			status: '',
			tabAllList: [
				{
					name: '全部',
					status: '',
					count: ''
				},
				{
					name: '待线上还款',
					status: 'ONLINE',
					count: ''
				},
				{
					name: '待线下还款',
					status: 'DOWN',
					count: ''
				},
				{
					name: '待收款确认',
					status: 'WAITING_AUDIT',
					count: ''
				}
			],
			columns,
			url: {
				list: API_GetLoanList,
				export: API_ExportLoanDetailListMAIN
			}
		};
	},
	components: {
		TopSum,
		FinancingTipInfo,
		Tabs
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER',
			VUEX_ST_TOKEN: 'VUEX_ST_TOKEN'
		}),
		tabList() {
			if (hasAuth('finance:repayC')) {
				return this.tabAllList;
			} else if (hasAuth('finance:repayS')) {
				return this.tabAllList.filter(item => !['ONLINE', 'DOWN'].some(items => items === item.status));
			}
			return [];
		}
	},
	mounted: function () {
		this.getLoanList();
		API_FinancingbankList().then(res => {
			var list = res.data || [];
			list.forEach(item => {
				this.chuziData.push({
					text: item.name,
					value: item.bizLicenseNo
				});
			});
		});
	},
	beforeRouteLeave(to, from, next) {
		//如果是前往关联页面，保留当前页面数据，否则清空keepalive缓存
		if (to.path === '/center/loan/loanDetail' || to.path === '/center/loan/loanApplySupplier') {
			from.meta.keepAlive = true;
		} else {
			delKeep(this);
		}
		next();
	},
	methods: {
		handleChange(data) {
			this.searchParams = data;
			this.getLoanList();
		},
		checkLoanApply(record) {
			// return 'loanApplySupplier'

			//<!-- 符合展示还款申请 -->
			if (record.repayApplyFlag == 'IGNORE') {
				return false;
			}
			let s = record.status != 'CLEARED'; // 状态+未结清
			if (!s) return false;
			if (record.repayObject == 'BANK') {
				// 上海银行还款申请
				if (record.repayApplyFlag == 'REPAY_PAYOFF' && s) {
					return 'loanApplySh';
				}
				// 善美还款申请
				if (record.bankUscc == '91610139MA6U8HA76Y' && record.repayApplyFlag == 'REPAY_PRINCIPAL') {
					return 'loanApplySupplier';
				}
				// 南商银行还款申请
				if (record.repayApplyFlag == 'REPAY_PRINCIPAL' && s) {
					return 'loanApplyNS';
				} else {
					return 'loanApply';
				}
			}
			if (record.repayObject == 'SELLER') {
				return 'loanApplySupplier';
			}
			return false;
		},
		changeTab(item) {
			this.status = item.status;
			this.getLoanList();
		},
		getStatusCount() {
			const params = {
				...this.searchParams,
				...this.pagination,
				pageSize: this.pageSize,
				repayType: this.status
			};
			API_GetLoanListMAINCOUNT({
				...params,
				assetType: 'ACCOUNTS_RECEIVABLE',
				applyTime2: null,
				applyTime1: null
			}).then(res => {
				let index = this.tabAllList.findIndex(item => item.status === '');
				this.tabAllList[index].count = res.data.countAll;
				index = this.tabAllList.findIndex(item => item.status === 'ONLINE');
				this.tabAllList[index].count = res.data.countOnlineRepay;
				index = this.tabAllList.findIndex(item => item.status === 'DOWN');
				this.tabAllList[index].count = res.data.countDownRepay;
				index = this.tabAllList.findIndex(item => item.status === 'WAITING_AUDIT');
				this.tabAllList[index].count = res.data.countConfirmRepay;
			});
		},
		getLoanList() {
			// 获取待办任务列表
			let func = this.status == 'WAITING_AUDIT' ? API_GetLoanListConfirm : API_GetLoanList;
			this.columns = this.status == 'WAITING_AUDIT' ? columnsShou : columns;
			this.url.list = func;
			this.searchParams.repayType = this.status;
			const params = {
				...this.searchParams,
				...this.pagination,
				pageSize: this.pageSize,
				repayType: this.status
			};
			this.$refs.TopSum.getDetail(params);
			this.getStatusCount();
			this.getList(this.searchParams.pageNo || 1, this.pageSize);
		},
		exportData() {
			this.exportFile('应收类放还款记录');
		},
		gotoDetail(record) {
			const { href } = this.$router.resolve({
				path: '/center/financing/financingDetail',
				query: {
					id: record.financingApplyId,
					bankUscc: record.bankUscc,
					handleType: 'detail'
				}
			});
			window.open(href, '_blank');
		},
		goApply(record) {
			let uscc = '';
			if (record.bankUscc == '91610139MA6U8HA76Y' && record.repayApplyFlag == 'REPAY_PRINCIPAL') {
				uscc = '91610139MA6U8HA76Y';
			}
			this.$router.push(this.checkLoanApply(record) + '?id=' + record.id + '&uscc=' + uscc);
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
.slMain {
	.titleNotes {
		font-family: PingFang SC;
		font-size: 14px;
		font-weight: 400;
		letter-spacing: 0px;
		text-align: left;
		color: rgba(0, 0, 0, 0.25);
		img {
			margin-right: 4px;
		}
		span {
			vertical-align: middle;
		}
	}
	.remainDay1 {
		color: rgba(70, 130, 243, 1);
	}
	.remainDay2 {
		color: rgba(221, 68, 68, 1);
	}
	.remainDay3 {
		color: rgba(0, 0, 0, 0.25);
	}
}
</style>
