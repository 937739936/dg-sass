<template>
	<div class="sub-table-container">
		<div class="table-box">
			<a-table
				:columns="columns"
				class="new-table"
				:bordered="false"
				rowKey="serialNo"
				:dataSource="dataSource"
				:pagination="false"
				:loading="loading"
				:scroll="{ x: true }"
			>
			</a-table>
		</div>
		<i-pagination
			:pagination="pagination"
			:defaultPageSize="pageSize"
			:pageSizeOptions="['5', '10', '20', '30', '40', '50']"
			@change="getList"
		/>
	</div>
</template>

<script>
import { ListMixin } from '@/v2/components/mixin/ListMixin';
import { API_GetServiceFeeUnPayList } from '@/v2/center/trade/api/pay';
export default {
	name: 'UnPayServiceFeeTable',
	mixins: [ListMixin],
	props: {
		payContractInfo: {
			type: Object,
			default: () => {}
		}
	},
	components: {},
	data() {
		return {
			loading: false,
			columns: columns,
			url: {
				list: API_GetServiceFeeUnPayList
			},
			defaultParams: {
				serialNo: this.payContractInfo.serialNo,
				contractType: this.payContractInfo.contractType
			},
			pageSize: 5
		};
	},
	mounted() {},
	computed: {},
	methods: {}
};

// 数据为空时，显示的表头
const customRender = text => text || '-';
const columns = [
	{
		title: '服务费结算单号',
		dataIndex: 'serialNo',
		customRender
	},
	{
		title: '付款方',
		dataIndex: 'payerName',
		customRender
	},
	{
		title: '结算单位',
		dataIndex: 'settlementCompanyName',
		customRender
	},
	{
		title: '结算日期',
		dataIndex: 'createDate',
		customRender
	},
	{
		title: '服务费金额(元)',
		dataIndex: 'serviceFeeAmount',
		customRender
	},
	{
		title: '已付款金额(元)',
		dataIndex: 'paymentAmount',
		customRender
	},
	{
		title: '付款情况',
		dataIndex: 'chargeStatusText',
		customRender
	},
	{
		title: '关联合同编号',
		dataIndex: 'contractNo',
		customRender
	},
	{
		title: '卖方企业名称',
		dataIndex: 'sellerName',
		customRender
	},
	{
		title: '买方企业名称',
		dataIndex: 'buyerName',
		customRender
	},
	{
		title: '业务负责人',
		dataIndex: 'businessManager',
		customRender
	}
];
</script>

<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
.sub-table-container {
	width: 100%;
	.slTitleAssis {
		margin-top: 4px;
	}
	.table-box {
		.new-table {
			/deep/ .ant-table {
				td,
				th {
					white-space: nowrap;
				}
			}
		}
	}
}
</style>