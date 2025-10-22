<template>
	<div class="slMain mt-10">
		<a-card :bordered="false">
			<div
				class="methods-wrap"
				slot="title"
			>
				<span class="slTitle">票据类放还款管理</span>
				<a-button
					type="primary"
					@click="goFang"
					v-auth="'finance:repay:bill:loan'"
				>
					放款登记
				</a-button>
			</div>
			<SlFormNew
				:list="searchList"
				layout="inline"
				@change="handleChange"
				@resetFunc="resetValues"
			></SlFormNew>
			<a-table
				:pagination="false"
				:columns="columns"
				:data-source="accountReceivableList"
				:scroll="{ x: true }"
				class="new-table"
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
					slot="action"
					slot-scope="text, record"
					class="opera-content"
				>
					<a
						href="javascript:;"
						v-auth="'finance:repay:bill:detail'"
						@click="goToDetail(record)"
						>查看</a
					>

					<a
						v-if="showHuan(record)"
						href="javascript:;"
						v-auth="'finance:repay:bill:repay'"
						@click="goHuan(record)"
						>还款登记</a
					>
					<a
						v-if="showZf(record)"
						href="javascript:;"
						v-auth="'finance:repay:bill:cancel'"
						@click="zuofei(record)"
						>作废</a
					>
				</div>
				<div
					slot="financingApplySerialNo"
					slot-scope="text, record"
				>
					<a
						href="javascript:;"
						@click="goToRongzi(record)"
						>{{ text }}</a
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
		</a-card>
	</div>
</template>
<script>
const columns = [
	{
		title: '融资编号',
		dataIndex: 'financingApplySerialNo',
		key: 'financingApplySerialNo',
		scopedSlots: { customRender: 'financingApplySerialNo' }
	},
	{ title: '融资方', dataIndex: 'financier', key: 'financier' },
	{ title: '开立方', dataIndex: 'issuerName', key: 'issuerName' },
	{
		title: '拟融资金额(元)',
		dataIndex: 'planFinancingAmount',
		key: 'planFinancingAmount',
		scopedSlots: { customRender: 'finAmount' }
	},
	{ title: '放款金额(元)', dataIndex: 'finAmount', key: 'finAmount', scopedSlots: { customRender: 'finAmount' } },
	{ title: '融资放款日期', dataIndex: 'beginDate', key: 'beginDate' },
	{ title: '融资到期日期', dataIndex: 'endDate', key: 'endDate' },
	{
		title: '还款本金(元)',
		dataIndex: 'repayPrincipal',
		key: 'repayPrincipal',
		scopedSlots: { customRender: 'finAmount' }
	},
	{ title: '还款利息(元)', dataIndex: 'repayInterest', key: 'repayInterest', scopedSlots: { customRender: 'finAmount' } },
	{ title: '云票编号', dataIndex: 'billNo', key: 'billNo' },
	{
		title: '状态',
		fixed: 'right',
		dataIndex: 'statusText',
		key: 'statusText',
		scopedSlots: { customRender: 'status' }
	},
	{
		title: '操作',
		fixed: 'right',
		key: 'action',
		scopedSlots: { customRender: 'action' }
	}
];
import {
	API_GetLoanListCounterfoil,
	API_LoanZuofei,
	API_FinancingLoanInvalidLoanByApply
} from '@/v2/center/financing/api/index.js';
import { mapGetters } from 'vuex';
import { formatMoney } from '@sub/filters';
import iPagination from "@sub/components/iPagination";
import { convertCurrency, getPopupContainer } from '@/v2/utils/factory.js';
import constants from '@sub/utils/constants.js';

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
		decorator: ['financier'],
		addonBeforeTitle: '融资方',
		type: 'input',
		placeholder: '请输入融资方'
	},
	{
		decorator: ['issuerName'],
		addonBeforeTitle: '开立方',
		type: 'input',
		placeholder: '请输入开立方'
	},

	{
		decorator: ['billNo'],
		addonBeforeTitle: '云票编号',
		type: 'input',
		placeholder: '请输入云票编号'
	},
	{
		decorator: ['status'],
		addonBeforeTitle: '状态',
		type: 'select',
		placeholder: '请选择',
		options: [
			{
				label: '已结清',
				value: 'CLEARED'
			},
			{
				label: '已放款',
				value: 'LOANED'
			},
			{
				label: '部分还款',
				value: 'PART_REPAY'
			}
		]
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
	}
];

export default {
	data() {
		return {
			constants,
			convertCurrency,
			formatMoney,
			getPopupContainer,
			// 选择融资进行放还款
			financeFangUscc: [constants.zhzlUscc, constants.ghblUscc, constants.jhblUscc],
			assetsFangUscc: [],
			statusData: [
				{
					text: '已结清',
					value: 'CLEARED'
				},
				{
					text: '已放款',
					value: 'LOANED'
				},
				{
					text: '部分还款',
					value: 'PART_REPAY'
				}
			],
			params: {
				pageSize: 10,
				pageNo: 1
			},

			pagination: {
				type: 'loanlist',
				total: 0, // 总条数
				pageNo: 1
			},
			pageSize: 10,
			columns,
			finFlag: null,
			accountReceivableList: [],
			searchList,
			searchParams: {}
		};
	},
	components: {
		iPagination,
		FinancingTipInfo,
		SlFormNew
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		})
	},
	mounted: function () {
		this.finFlag = this.financeFangUscc.includes(this.VUEX_ST_COMPANYSUER.companyUscc);
		this.getLoanList();
	},
	methods: {
		handleChange(data) {
			this.searchParams = data;
			this.getLoanList();
		},
		showHuan(record) {
			if (record.repayFlag == 'DATA_LINK_REGISTER') {
				//<!--状态为部分还款/已放款状态的记录后，出现“还款登记-->
				return record.status == 'LOANED' || record.status == 'PART_REPAY';
			}
			return false;
		},
		showZf(record) {
			if (record.loanFlag == 'REGISTER_BY_ASSET' || record.loanFlag == 'REGISTER_BY_APPLY') {
				return record.status == 'LOANED';
			}
			return false;
		},
		getLoanList(pageNo = this.pagination.pageNo, pageSize = this.pageSize) {
			// 获取待办任务列表
			this.pagination.pageNo = pageNo;
			this.params.pageNo = pageNo;
			this.params.pageSize = pageSize;
			const params = {
				...this.searchParams,
				...this.pagination,
				pageSize: this.pageSize
			};

			API_GetLoanListCounterfoil(params).then(res => {
				if (!res.success) {
					return;
				}
				this.accountReceivableList = res.data.records;
				this.pagination.total = res.data.total;
			});
		},

		// 获取应付账款申请日期
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
			this.params = {
				pageSize: 10,
				pageNo: 1
			};

			this.pagination.pageNo = 1;

			this.pageSize = 10;
			this.searchParams = {};
			// this.getLoanList()
		},
		goToDetail(item) {
			if (item.id) {
				this.$router.push('/center/loan/loanCounterfoilDetail?id=' + item.id);
			}
		},
		goToRongzi(item) {
			if (item.applyId) {
				this.$router.push('/center/financing/financingCounterfoilDetail?id=' + item.applyId);
			}
		},

		goHuan(record) {
			const path = '/center/loan/loanHuan';
			this.$router.push(`${path}?id=` + record.id);
		},
		goFang() {
			let path = '/center/loan/loanFangListCounterfoil'; // 选融资放款的

			this.$router.push(path);
		},
		zuofei(record) {
			this.$confirm({
				centered: true,
				title: '是否确认作废该笔放款记录?',
				okText: '确定',
				cancelText: '取消',
				onOk: () => {
					if (record.loanFlag == 'REGISTER_BY_APPLY') {
						API_FinancingLoanInvalidLoanByApply(record.id).then(res => {
							if (res.data) {
								this.$message.success('作废成功');
								this.resetValues();
							}
						});
						return;
					}
					API_LoanZuofei({ loanId: record.id }).then(res => {
						if (res.data) {
							this.$message.success('作废成功');
							this.resetValues();
						}
					});
				},
				onCancel() {}
			});
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
.divider {
	background: #f4f5f8;
	height: 1px;
	margin-top: 20px;
	margin-left: -20px;
	margin-right: -20px;
}
.s-card-title {
	margin-top: 10px;
}
::v-deep.ant-form-item {
	display: block;
	margin-bottom: 14px;
}
::v-deep.ant-form-item-label {
	padding-right: 30px;
}
::v-deep .opera-content {
	a {
		float: left;
		margin-right: 10px;
	}
}
</style>
