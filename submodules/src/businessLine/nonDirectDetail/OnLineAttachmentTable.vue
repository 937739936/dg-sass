<template>
	<div class="sub-table-container">
		<div class="table-box">
			<a-table
				:columns="columns"
				class="new-table"
				:bordered="false"
				rowKey="no"
				:dataSource="dataSource"
				:pagination="false"
				:loading="loading"
				:scroll="{ x: true }"
			>
				<template
					slot="action"
					slot-scope="text, items"
				>
					<a-space :size="20">
						<a
							href="javascript:;"
							@click="viewContractDetail(items)"
							v-if="items.fileUrl && platformType == 'ADMIN'"
							>查看</a
						>
						<a
							href="javascript:;"
							@click="downloadAttachmentFile(items)"
							v-if="items.fileUrl"
							>下载</a
						>
					</a-space>
				</template>
			</a-table>
		</div>
	</div>
</template>

<script>
export default {
	name: 'OnLineAttachmentTable',
	inject: ['platformType'],
	props: {
		// 数据源
		dataSource: {
			type: Array,
			default: () => []
		}
	},
	components: {},
	data() {
		return {
			loading: false,
			columns: columns
		};
	},
	mounted() {},
	computed: {},
	methods: {
		// 下载单个附件
		downloadAttachmentFile(item) {
			this.$emit('downloadAttachmentFile', item);
		},
		// 查看合同详情
		viewContractDetail(item) {
			this.$emit('viewContractDetail', item);
		}
	}
};

// 数据为空时，显示的表头
const customRender = text => text || '-';
const columns = [
	{ title: '文件类型', dataIndex: 'fileTypeText', customRender },
	{ title: '文件名称', dataIndex: 'fileName', customRender },
	{ title: '文件编号', dataIndex: 'no', customRender },
	{ title: '签订日期', dataIndex: 'signTime', customRender },
	{ title: '操作', dataIndex: 'action', scopedSlots: { customRender: 'action' }, align: 'left', fixed: 'right' }
];
</script>

<style lang="less" scoped>
@import url('~@sub/style/table-cover.less');
</style>
<style lang="less" scoped>
.sub-table-container {
	width: 100%;
	.slTitleAssis {
		margin-top: 4px;
	}
}
</style>