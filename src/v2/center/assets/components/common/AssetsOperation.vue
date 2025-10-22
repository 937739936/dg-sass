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
import { API_ListAssetOperation } from '@/v2/center/assets/api/index.js';

const viewHandleColumns = [
	{ title: '操作类型', key: 'operationType', dataIndex: 'operationType' },
	{ title: '操作人员', key: 'personalName', dataIndex: 'personalName' },
	{ title: '所属公司', key: 'companyName', dataIndex: 'companyName', customRender: t => t || '-' },
	{ title: '操作内容', key: 'comments', dataIndex: 'comments' },
	{ title: '操作时间', key: 'operationTime', dataIndex: 'operationTime', fixed: 'right' }
];
export default {
	props: {
		assetNo: {}
	},
	data() {
		return {
			viewHandleColumns,
			list: []
		};
	},
	watch: {
		assetNo: {
			deep: true,
			immediate: true,
			handler() {
				this.assetNoChange();
			}
		}
	},
	mounted() {},
	methods: {
		assetNoChange() {
			if (!this.assetNo) return;
			API_ListAssetOperation({ assetNo: this.assetNo }).then(res => {
				this.list = res.data;
			});
		}
	},
	components: {}
};
</script>
<style lang="less" scoped>
@import url('~@sub/style/table-cover.less');
</style>
<style scoped></style>
