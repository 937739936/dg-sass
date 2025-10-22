<template>
	<div
		class="slMain"
		style="margin-top: -10px"
	>
		<a-card :bordered="false">
			<div class="s-title">
				<span
					slot="title"
					class="slTitle"
					>收款管理</span
				>
			</div>
			<SlFormNew
				:list="searchList"
				layout="inline"
				@change="changeSearch"
				:allowClear="false"
				@resetFunc="resetValues"
				:isShowIcon="false"
				:isShowSearchBox="true"
			></SlFormNew>
			<a-table
				:pagination="false"
				:columns="columns"
				class="new-table"
				style="margin-top: 30px"
				:data-source="dataSource"
				:scroll="{ x: true }"
				rowKey="id"
				:loading="loading"
			>
				<template
					slot="payAmount"
					slot-scope="text"
				>
					{{ text }}
				</template>
				<template
					slot="action"
					slot-scope="record"
				>
					<a-space>
						<template>
							<a
								@click="jumpPage(record, 'view')"
								v-if="record.status !== 'NOT_BEEN_SUBMIT'"
								v-auth="'steel:receiptPayment:receipt:view'"
								>查看</a
							>
						</template>
					</a-space>
				</template>
			</a-table>
			<i-pagination
				:pagination="pagination"
				@change="getList"
			/>
		</a-card>
	</div>
</template>

<script>
import { paymentPage, deletePayment, receiptPage } from '@/v2/center/steels/api/funds.js';
import { getPopupContainer } from '@/v2/utils/factory.js';
import iPagination from "@sub/components/iPagination";
import { colSpan, formLayout } from '@/v2/config/layoutConfig';
import { mapGetters } from 'vuex';
import { filterSteelsCodeByKey } from '@sub/utils/globalCode.js';
import { contractTypeOpt } from '@/v2/center/steels/config/constant.js';

const columns = [
	{ title: '资金流水号', dataIndex: 'serialNo' },
	{ title: '合同类型', dataIndex: 'contractTypeDesc' },
	{ title: '合同编号', dataIndex: 'contractNo' },
	{
		title: '收款方',
		dataIndex: 'sellCompanyName',
		customRender: (text, record) => (record.contractType == 'BUY' ? record.sellCompanyName : record.buyCompanyName)
	},
	{ title: '付款金额（元）', dataIndex: 'payAmount' },
	{ title: '状态', dataIndex: 'statusDesc' },
	{ title: '实际付款日期', dataIndex: 'paymentDate' },
	{ title: '创建时间', dataIndex: 'createdDate' },
	{ title: '操作', fixed: 'right', scopedSlots: { customRender: 'action' } }
];
import { ListMixin } from '@/v2/components/mixin/ListMixin';
const searchList = [
	{
		decorator: ['contractNo'],
		addonBeforeTitle: '合同编号',
		type: 'input',
		placeholder: '请输入合同编号',
		allowClear: true
	},
	{
		decorator: ['buyCompanyName'],
		addonBeforeTitle: '付款方',
		type: 'input',
		placeholder: '请输入付款方',
		allowClear: true
	},
	{
		decorator: ['serialNo'],
		addonBeforeTitle: '资金流水号',
		type: 'input',
		placeholder: '请输入资金流水号',
		allowClear: true
	},
	{
		decorator: ['orderType'],
		addonBeforeTitle: '合同类型',
		type: 'select',
		placeholder: '请选择',
		allowClear: true,
		options: [
			{ value: 'BUY', label: '采购合同' },
			{ value: 'SELL', label: '销售合同' }
		]
	},

	{
		decorator: ['date2'],
		addonBeforeTitle: '收款日期',
		realKey: ['paymentStartDate', 'paymentEndDate'],
		type: 'rangePicker',
		placeholder: ['', ''],
		allowClear: true
	}
];

export default {
	name: 'SteelsFundsPaymentList',
	mixins: [ListMixin],
	data() {
		return {
			colSpan,
			formLayout,
			searchList,
			url: {
				list: receiptPage
			},
			getPopupContainer,
			columns,
			paymentStatus: filterSteelsCodeByKey('paymentStatus'),
			orderList: [
				{ value: 'BUY', label: '采购合同' },
				{ value: 'SELL', label: '销售合同' }
			],
			isCoreCompany: false,
			date: [],
			dataSource: [],
			params: {},
			pagination: {
				total: 0,
				page: 0
			},
			contractTypeList: contractTypeOpt,
			loading: false
		};
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		})
	},
	created() {
		const companyType = this.VUEX_ST_COMPANYSUER.companyType;
		this.isCoreCompany = companyType == 'CORE_COMPANY';
	},
	methods: {
		jumpPage(data, type) {
			const { id, sellCompanyId, sellCompanyName, contractNo, contractId, steelType } = data;
			this.$router.push({
				path: '/center/steels/funds/payment/paymentApplyTwoStep',
				query: {
					id,
					contractId,
					generateWay: data.generateWay,
					contractType: data.contractType,
					type,
					contractNo,
					steelType,
					companyName: data.contractType == 'BUY' ? data.sellCompanyName : data.buyCompanyName,
					companyId: data.contractType == 'BUY' ? data.sellCompanyId : data.buyCompanyId,
					companyUscc: data.contractType == 'BUY' ? data.sellCompanyUscc : data.buyCompanyUscc,
					businessType: data.businessType
				}
			});
		},
		add() {
			this.$router.push({
				path: '/center/steels/funds/payment/paymentApplyOneStep',
				query: {}
			});
		},
		changeSearch(info) {
			this.pagination.pageNo = 1;
			this.searchParams = info;
			this.getList();
		},
		resetValues() {
			this.pagination.pageNo = 1;
		},
		deleteItem(id) {
			var t = this;
			this.$confirm({
				centered: true,
				title: '您确定要删除该条数据？',
				okText: '确定',
				cancelText: '取消',
				onOk() {
					deletePayment(id).then(res => {
						if (res.success) {
							t.$message.success('删除成功');
							t.getList();
						}
					});
				}
			});
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less"></style>
