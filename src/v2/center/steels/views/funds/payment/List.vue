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
					>付款管理</span
				>

				<a-button
					v-auth="'steel:receiptPayment:payment:add'"
					type="primary"
					@click="add"
				>
					<span style="font-size: 14px"> <a-icon type="plus" />新增付款</span>
				</a-button>
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
						<template v-if="record.status === 'NOT_BEEN_SUBMIT'">
							<template v-if="record.isInitiator">
								<a @click="jumpPage(record)">修改</a>
								<a
									@click="jumpPage(record, 'submit')"
									v-auth="'steel:receiptPayment:payment:submit'"
									>提交</a
								>
								<a-dropdown v-auth="'steel:receiptPayment:payment:cancel'">
									<a
										class="ant-dropdown-link"
										@click="e => e.preventDefault()"
									>
										更多<a-icon type="down" />
									</a>
									<a-menu slot="overlay">
										<a-menu-item>
											<a @click="deleteItem(record.id)">取消</a>
										</a-menu-item>
									</a-menu>
								</a-dropdown>
							</template>
						</template>

						<template v-else>
							<a
								@click="jumpPage(record, 'view')"
								v-auth="'steel:receiptPayment:payment:view'"
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
import iPagination from '@sub/components/iPagination';
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
		decorator: ['serialNo'],
		addonBeforeTitle: '资金流水号',
		type: 'input',
		placeholder: '请输入资金流水号',
		allowClear: true
	},
	{
		decorator: ['contractNo'],
		addonBeforeTitle: '合同编号',
		type: 'input',
		placeholder: '请输入合同编号',
		allowClear: true
	},
	{
		decorator: ['sellCompanyName'],
		addonBeforeTitle: '收款方',
		type: 'input',
		placeholder: '请输入收款方',
		allowClear: true
	},
	{
		decorator: ['date2'],
		addonBeforeTitle: '实际付款日期',
		realKey: ['paymentStartDate', 'paymentEndDate'],
		type: 'rangePicker',
		placeholder: ['', ''],
		allowClear: true
	},
	{
		decorator: ['status'],
		addonBeforeTitle: '付款状态',
		type: 'select',
		placeholder: '请选择',
		allowClear: true,
		options: filterSteelsCodeByKey('paymentStatus')
	},

	{
		decorator: ['contractType'],
		addonBeforeTitle: '合同类型',
		type: 'select',
		placeholder: '请选择',
		allowClear: true,
		options: [
			{ value: 'BUY', label: '采购合同' },
			{ value: 'SELL', label: '销售合同' }
		]
	}
];
export default {
	name: 'SteelsFundsPaymentList',
	mixins: [ListMixin],
	components: {},
	data() {
		return {
			colSpan,
			formLayout,
			searchList,
			getPopupContainer,
			url: {
				list: paymentPage
			},
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
				pageNo: 1
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
		// const companyType = +this.VUEX_ST_COMPANYSUER.coreCompanyType;
		// if ([0,1,2,3,4].includes(companyType)) {
		//   this.isCoreCompany = true
		// }
		const companyType = this.VUEX_ST_COMPANYSUER.companyType;
		this.isCoreCompany = companyType == 'CORE_COMPANY';
		this.getList();
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
