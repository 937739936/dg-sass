<template>
	<div class="tabs-content">
		<div class="table-box">
			<a-table
				:columns="columns"
				class="new-table"
				:bordered="false"
				rowKey="id"
				:dataSource="detail"
				:pagination="false"
			>
			</a-table>
		</div>
	</div>
</template>

<script>
const columns = [
	{ title: '操作类型', dataIndex: 'operationDesc' },
	{ title: '操作人', dataIndex: 'personalName' },
	{ title: '所属公司', dataIndex: 'companyUserName' },
	{ title: '操作内容', dataIndex: 'comments' },
	{ title: '操作时间', dataIndex: 'createTime' }
];
import { API_listOrderOperation } from '@/v2/center/trade/api/contract';

export default {
	data() {
		return {
			columns,
			detail: []
		};
	},
	props: ['data'],
	methods: {
		init() {
			API_listOrderOperation({ orderId: this.data.contract.id }).then(res => {
				if (res.success) {
					this.detail = res.data;
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
.tabs-content {
	width: 100%;
	& > ::v-deep.ant-row-flex {
		width: 100%;
	}
}
</style>
