<template>
	<div
		class="mt20"
		style="width: 100%"
	>
		<a-table
			:columns="viewHandleColumns"
			rowKey="id"
			class="new-table detailsTable"
			:scroll="{ x: true }"
			:dataSource="logList"
			:pagination="false"
			:locale="{ emptyText: '暂无数据' }"
		>
		</a-table>
	</div>
</template>

<script>
const viewHandleColumns = [
	{ title: '操作', key: 'operateType', dataIndex: 'operateType' },
	{ title: '操作人', key: 'createdName', dataIndex: 'createdName' },
	{ title: '所属企业', key: 'companyName', dataIndex: 'companyName' },
	{ title: '操作内容', key: 'operateContent', dataIndex: 'operateContent' },
	{ title: '操作时间', key: 'createdDate', dataIndex: 'createdDate' },
	{ title: '备注', key: 'remark', dataIndex: 'remark', customRender: v => v || '-' }
];
export default {
	props: {
		logList: {
			default: () => []
		},
		viewHandleColumns: {
			default: () => viewHandleColumns
		}
	},
	data() {
		return {};
	},

	methods: {},
	components: {}
};
</script>

<style scoped>
.fw {
	font-weight: bold;
}
</style>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
