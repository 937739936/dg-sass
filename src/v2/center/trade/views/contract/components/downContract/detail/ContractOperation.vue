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
	{ title: '操作类型', dataIndex: 'operationType' },
	{ title: '操作人', dataIndex: 'personalName' },
	{ title: '所属公司', dataIndex: 'companyName' },
	{ title: '操作内容', dataIndex: 'comments' },
	{ title: '操作时间', dataIndex: 'operationTime' }
];

export default {
	data() {
		return {
			columns
		};
	},
	props: {
		detail: {
			default: () => {
				return [];
			}
		}
	},
	methods: {}
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
/deep/ .ant-table-thead {
	background: #f3f5f6;
}
</style>
