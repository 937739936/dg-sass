<template>
	<div class="sub-table-container">
		<div :class="'table-box ' + (pagination.total > 10 ? 'fixedBottom' : '')">
			<a-table
				:columns="columns"
				class="new-table"
				:bordered="false"
				rowKey="id"
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
		<div class="bottom-pagination"></div>
	</div>
</template>

<script>
import { ListMixin } from '@/v2/components/mixin/ListMixin';
import { API_GetContractUnFinishList } from '@/v2/center/trade/api/pay';
export default {
	name: 'UnFinishContractTable',
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
				list: API_GetContractUnFinishList
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
		title: '合同编号',
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
	},
	{
		title: '交货期限',
		dataIndex: 'deliveryDateRange',
		customRender
	}
];
</script>

<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
.sub-table-container {
	position: relative;
	width: 100%;
	.slTitleAssis {
		margin-top: 4px;
	}
	.table-box {
		// max-height: 250px;
		// overflow-y: auto;
	}
	.bottom-pagination {
		padding: 10px 30px;
		position: absolute;
		bottom: 0;
		left: 0;
		z-index: 100;
	}
}
</style>