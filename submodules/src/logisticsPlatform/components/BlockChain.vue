<template>
	<div style="width: 100%; margin-top: 30px">
		<a-table
			:columns="viewHandleColumns"
			rowKey="id"
			class="new-table"
			:scroll="{ x: true }"
			:dataSource="list"
			:pagination="false"
		>
      <span slot="transactionId" slot-scope="text,record">
        <a @click="openBlock(record)">{{text}}</a>
      </span>
		</a-table>
    <i-pagination
			:pagination="pagination"
			@change="getList"
		/>
    <BlockChainDetail ref="blockChainDetail" :chainDetailApi='chainDetailApi' :downBlockChainCer='downBlockChainCer'></BlockChainDetail>
	</div>
</template>

<script>
import iPagination from '@sub/components/iPagination';
import BlockChainDetail from './BlockChainDetail.vue'
const viewHandleColumns = [
	{
		title: '交易id',
		scopedSlots: { customRender: 'transactionId' },
		dataIndex: 'transactionId'
	},
	{
		title: '交易类型',
		dataIndex: 'transactionType'
	},
	{
		title: '上链时间',
		dataIndex: 'blockTime'
	},

	{
		title: '合约名称',
		dataIndex: 'chaincode'
	}
];
export default {
	props: {
		viewHandleColumns: {
			default: () => viewHandleColumns
		},
		chainListApi: {},
		chainDetailApi: {},
		downBlockChainCer: {},
		chaincode: {},
		traceCode: {},
	},
	data() {
		return {
      pagination: {
				pageNo: 1,
				total: 0,
			},
			pageSize: 5,
      list: [],
      loading: false,
    };
	},
  mounted() {
    this.getList()
  },
	methods: {
    async getList(pageNo = this.pagination.pageNo, pageSize = this.pageSize) {
      this.pagination.pageNo = pageNo;
      this.loading = true;
      this.pageSize = 10;
      const params = {
        ...this.pagination,
        pageSize: this.pageSize,
				traceCode: this.traceCode,
				chaincode: this.chaincode,
				channel: 'trade'


      };
      try {
        const res = await this.chainListApi(params);
				this.list = res.result.records || []
				console.log(this.list)
				this.pagination.total = res.result.total || 0

        this.loading = false;

        // this.pagination.total = res.data.total;
      } catch (error) {
        this.loading = false;
      }
    },
    openBlock(record){
      this.$refs.blockChainDetail.showById(record.id)
    },
  },
	components: {
    iPagination,
    BlockChainDetail,
  }
};
</script>
<style lang="less" scoped>
@import url('~@sub/style/table-cover.less');
</style>
<style scoped>
.fw {
	font-weight: bold;
}
</style>
