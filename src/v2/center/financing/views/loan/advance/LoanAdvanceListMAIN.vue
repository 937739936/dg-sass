<template>
	<div class="slMain mt-10">
		<a-card :bordered="false">
			<div
				class="methods-wrap"
				slot="title"
			>
				<span class="slTitle">预付类放还款管理</span>
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
					type="PRE_PAYMENT"
				/>
				<SlFormNew
					:list="searchList"
					layout="inline"
					@change="handleChange"
				></SlFormNew>
				<div style="margin-top: 30px">
					<Tabs
						:statusData="tabList"
						@callback="changeTab"
						ref="tabs"
					></Tabs>
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
							<a
								v-auth="'finance:repay:pre:detail'"
								href="javascript:;"
								@click="gotoDetail(record)"
								style="margin-right: 10px"
							>
								详情
							</a>
							<a
								v-if="
									(record.status == 'PART_REPAY' || record.status == 'LOANED') &&
									record.repayApplyFlag != 'IGNORE' &&
									record.buyerUscc == VUEX_ST_COMPANYSUER.companyUscc
								"
								v-auth="'finance:repay:pre:apply'"
								href="javascript:;"
								@click="gotoloanApply(record)"
							>
								还款申请
							</a>
						</div>
						<div
							slot="status"
							slot-scope="text, record"
						>
							<FinancingTipInfo
								:item="record"
								:pre="true"
							/>
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
		title: '融资编号',
		dataIndex: 'financingApplySerialNo',
		key: 'financingApplySerialNo',
		customRender
	},
	{
		title: '卖方名称',
		dataIndex: 'sellerName',
		key: 'sellerName',
		customRender
	},
	{ title: '出资机构', dataIndex: 'bankName', key: 'bankName', customRender },
	{
		title: '放款类型',
		dataIndex: 'loanTypeText',
		key: 'loanTypeText',
		customRender
	},
	{
		title: '融单编号',
		dataIndex: 'bankBillNo',
		key: 'bankBillNo',
		customRender
	},
	{
		title: '放款金额(元)',
		dataIndex: 'finAmount',
		key: 'finAmount',
		scopedSlots: { customRender: 'finAmount' }
	},
	{
		title: '拟融资金额(元)',
		dataIndex: 'planFinancingAmount',
		key: 'planFinancingAmount',
		scopedSlots: { customRender: 'finAmount' }
	},
	{
		title: '融资放款日期',
		dataIndex: 'loanDate',
		key: 'loanDate',
		customRender
	},
	{ title: '融资到期日期', dataIndex: 'endDate', key: 'endDate', customRender },
	{
		title: '最近还款日期',
		dataIndex: 'repayDate',
		key: 'repayDate',
		customRender
	},
	{
		title: '还款本金(元)',
		dataIndex: 'repayPrincipal',
		key: 'repayPrincipal',
		scopedSlots: { customRender: 'finAmount' }
	},
	{
		title: '还款利息(元)',
		dataIndex: 'repayInterest',
		key: 'repayInterest',
		scopedSlots: { customRender: 'finAmount' }
	},
	{
		title: '预付账款流水号',
		dataIndex: 'receivableSerialNo',
		key: 'receivableSerialNo',
		customRender
	},
	{
		title: '预付账款金额(元)',
		dataIndex: 'receivableAmount',
		key: 'receivableAmount',
		scopedSlots: { customRender: 'finAmount' }
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

const searchList = [
	{
		decorator: ['serialNo'],
		addonBeforeTitle: '编号',
		type: 'input',
		placeholder: '输入融资编号/预付账款流水号'
	},
	{
		decorator: ['bankName'],
		addonBeforeTitle: '出资机构',
		type: 'input',
		placeholder: '请输入出资机构'
	},
	{
		decorator: ['sellerName'],
		addonBeforeTitle: '卖方名称',
		type: 'input',
		placeholder: '请输入卖方名称'
	},
	{
		decorator: ['issuedDate'],
		addonBeforeTitle: '融资放款日期',
		type: 'rangePicker',
		realKey: ['beginDateStart', 'beginDateEnd']
	},
	{
		decorator: ['issuedDate2'],
		addonBeforeTitle: '融资到期日期',
		type: 'rangePicker',
		realKey: ['endDateStart', 'endDateEnd']
	},
	{
		decorator: ['status'],
		addonBeforeTitle: '融资状态',
		type: 'select',
		placeholder: '请选择',
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
import { mapGetters } from 'vuex';
import { API_GetAdvanceLoanList, API_goAdvanceLoanCheck, API_GetLoanListMAINCOUNT } from '@/v2/center/financing/api/index.js';
import { filterCodeByKey } from '@sub/utils/globalCode.js';
import { formatMoney } from '@sub/filters';
import { convertCurrency, getPopupContainer } from '@/v2/utils/factory.js';
import constants from '@sub/utils/constants';
import TopSum from '../common/TopSum.vue';
import FinancingTipInfo from '@/v2/center/financing/views/financing/common/FinancingTipInfo.vue';
import Tabs from '@/v2/center/financing/components/Tabs';
import { ListMixin } from '@/v2/components/mixin/ListMixin';

export default {
	mixins: [ListMixin],
	data() {
		return {
			constants,
			convertCurrency,
			getPopupContainer,
			formatMoney,
			chuziData: [],
			sellerNameList: [],
			statusData: filterCodeByKey('loanStatusDict'),
			status: '',
			tabList: [
				{
					name: '全部',
					status: '',
					count: ''
				},
				{
					name: '待线上还款',
					status: 'ONLINE',
					count: ''
				}
			],
			searchList,
			columns,
			url: {
				list: API_GetAdvanceLoanList
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
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		})
	},
	mounted: function () {
		this.getLoanList();
	},
	methods: {
		handleChange(data) {
			this.searchParams = data;
			this.getLoanList();
		},
		getLoanList() {
			// 获取待办任务列表
			const params = {
				...this.searchParams,
				...this.pagination,
				pageSize: this.pageSize,
				repayType: this.status
			};
			this.searchParams.repayType = this.status;
			this.$refs.TopSum.getDetail(params);
			this.getStatusCount();
			this.getList(this.searchParams.pageNo || 1, this.pageSize);
		},
		getStatusCount() {
			const params = {
				...this.searchParams,
				...this.pagination,
				pageSize: this.pageSize,
				repayType: this.status
			};
			API_GetLoanListMAINCOUNT({
				assetType: 'PRE_PAYMENT',
				...params,
				applyTime2: null,
				applyTime1: null
			}).then(res => {
				let index = this.tabList.findIndex(item => item.status === '');
				this.tabList[index].count = res.data.countAll;
				index = this.tabList.findIndex(item => item.status === 'ONLINE');
				this.tabList[index].count = res.data.countOnlineRepay;
			});
		},
		changeTab(item) {
			this.status = item.status;
			this.getLoanList();
		},

		gotoDetail(record) {
			const { href } = this.$router.resolve({
				path: '/center/financing/financingAdvanceDetail',
				query: {
					id: record.financingApplyId
				}
			});
			window.open(href, '_blank');
		},
		gotoloanApply(record) {
			API_goAdvanceLoanCheck({ loanId: record.id }).then(res => {
				if (res.success) {
					this.$router.push('loanAdvanceApply?id=' + record.id);
				}
			});
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
