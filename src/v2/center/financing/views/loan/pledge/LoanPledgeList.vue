<template>
	<div class="slMain mt-10">
		<a-card :bordered="false">
			<div
				class="methods-wrap"
				slot="title"
			>
				<span class="slTitle">货押类放还款管理</span>
			</div>
			<div style="margin-top: 30px">
				<TopSum
					ref="TopSum"
					type="ACCOUNTS_RECEIVABLE_DOWN_MANUAL"
				/>
				<SlFormNew
					:list="searchList"
					layout="inline"
					@change="handleChange"
					@resetFunc="resetValues"
				></SlFormNew>
				<a-table
					class="new-table"
					:pagination="false"
					:columns="columns"
					:data-source="accountReceivableList"
					:scroll="{ x: true }"
					rowKey="id"
					style="margin-top: 22px"
				>
					<div
						slot="action"
						slot-scope="text, record"
					>
						<a
							href="javascript:;"
							@click="$router.push('loanPledgeDetailMAIN?id=' + record.id + '')"
							style="margin-right: 10px"
							>查看</a
						>
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
					v-show="pageSize < pagination.total"
					@change="getLoanList"
				/>
			</div>
		</a-card>
	</div>
</template>
<script>
const columns = [
	{
		title: '融资编号',
		dataIndex: 'financingApplySerialNo',
		key: 'financingApplySerialNo'
	},
	{ title: '融资方', dataIndex: 'financier', key: 'financier' },
	{ title: '出资机构', dataIndex: 'bankName', key: 'bankName' },
	{ title: '融资申请金额（元）', dataIndex: 'amount', key: 'amount' },
	{ title: '放款金额（元）', dataIndex: 'finAmount', key: 'finAmount' },
	{ title: '融资起息日期', dataIndex: 'beginDate', key: 'beginDate' },
	{ title: '融资到期日期', dataIndex: 'endDate', key: 'endDate' },
	{
		title: '已还款本金（元）',
		dataIndex: 'repayPrincipal',
		key: 'repayPrincipal'
	},
	{
		title: '已还款利息（元）',
		dataIndex: 'repayInterest',
		key: 'repayInterest'
	},
	{
		title: '货押资产编号',
		dataIndex: 'receivableSerialNo',
		key: 'receivableSerialNo'
	},
	{
		title: '融资状态',
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
import { API_FinancingLoanListpledge, API_FinancingbankList } from '@/v2/center/financing/api/index.js';
import iPagination from "@sub/components/iPagination";
import { filterCodeByKey } from '@sub/utils/globalCode.js';
import { getPopupContainer } from '@/untils/factory.js';
import constants from '@sub/utils/constants';
import TopSum from '../common/TopSum.vue';
import FinancingTipInfo from '@/v2/center/financing/views/financing/common/FinancingTipInfo.vue';
import SlFormNew from '@sub/components/ui-new/Form/sl-form';
const searchList = [
	{
		decorator: ['financingApplySerialNo'],
		addonBeforeTitle: '融资编号',
		type: 'input',
		placeholder: '请输入融资编号'
	},
	{
		decorator: ['bankName'],
		addonBeforeTitle: '出资机构',
		type: 'input',
		placeholder: '请输入出资机构'
	},
	{
		decorator: ['receivableSerialNo'],
		addonBeforeTitle: '货押资产编号',
		type: 'input',
		placeholder: '请输入货押资产编号'
	},

	{
		decorator: ['status'],
		addonBeforeTitle: '融资状态',
		type: 'select',
		placeholder: '请选择',
		options: filterCodeByKey('loanStatusDict').map(item => {
			return { value: item.value, label: item.text };
		})
	},
	{
		decorator: ['issuedDate'],
		addonBeforeTitle: '融资起息日期',
		type: 'rangePicker',
		realKey: ['beginDateStart', 'beginDateEnd']
	},
	{
		decorator: ['issuedDate2'],
		addonBeforeTitle: '融资到期日期',
		type: 'rangePicker',
		realKey: ['endDateStart', 'endDateEnd']
	}
];
export default {
	data() {
		return {
			constants,

			getPopupContainer,
			chuziData: [],
			sellerNameList: [],
			statusData: filterCodeByKey('loanStatusDict'),
			params: {
				pageSize: 10,
				pageNo: 1
			},
			pageSize: 10,
			pagination: {
				type: 'loanlist',
				total: 0, // 总条数
				pageNo: 1
			},
			columns,
			searchList,
			accountReceivableList: [],
			searchParams: {}
		};
	},
	components: {
		iPagination,
		TopSum,
		FinancingTipInfo,
		SlFormNew
	},
	computed: {},
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
	methods: {
		handleChange(data) {
			this.searchParams = data;
			this.getLoanList();
		},
		getLoanList(pageNo = this.pagination.pageNo, pageSize = this.pageSize) {
			// 获取待办任务列表
			this.pagination.pageNo = pageNo;

			this.pageSize = pageSize;
			const params = {
				...this.searchParams,
				...this.pagination,
				pageSize: this.pageSize
			};

			this.$refs.TopSum.getDetail(params);
			API_FinancingLoanListpledge(params).then(res => {
				if (!res.success) {
					return;
				}
				this.accountReceivableList = res.data.records;
				this.pagination.total = res.data.total;
			});
		},
		//
		getTime(value, dateString) {
			this.params.beginDateStart = dateString[0];
			this.params.beginDateEnd = dateString[1];
		},
		getTimeEnd(value, dateString) {
			this.params.endDateStart = dateString[0];
			this.params.endDateEnd = dateString[1];
		},
		searchSubmit() {
			// 查询按钮
			this.pagination.pageNo = 1;
			delete this.params.pageNo;
			this.getLoanList();
		},

		resetValues() {
			// 重置
			this.pageSize = 10;
			this.pagination.pageNo = 1;
			this.getLoanList();
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
