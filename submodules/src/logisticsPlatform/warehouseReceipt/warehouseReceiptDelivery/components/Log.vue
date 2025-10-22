<template>
	<div style="width: 100%; margin-top: 30px">
		<a-table
			:columns="viewHandleColumns"

			class="new-table"
			:scroll="{ x: true }"
			:dataSource="list"
			:pagination="false"
			:locale="{ emptyText: '暂无数据' }"
		>
		</a-table>
	</div>
</template>

<script>
const viewHandleColumns = [
	{ title: '操作类型', key: 'optType', dataIndex: 'optType' },
	{ title: '操作人员', key: 'optName', dataIndex: 'optName' },
	{ title: '所属公司', key: 'optCompanyName', dataIndex: 'optCompanyName', customRender: t => t || '-' },
	{ title: '操作内容', key: 'remark', dataIndex: 'remark' },
	{ title: '操作时间', key: 'optTime', dataIndex: 'optTime', fixed: 'right' }
];
export default {
	props: {
		list: {
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
<style lang="less" scoped>
@import url('~@sub/style/table-cover.less');
</style>
<style scoped>
.fw {
	font-weight: bold;
}
</style>
