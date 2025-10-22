<template>
		<div class="attachment-view">
			<a-table
				:columns="columns"
				border
				class="new-table"
				:bordered="false"
				rowKey="fileUrl"
				:dataSource="contractAttachment"
				:pagination="false"
			>
				<template
					slot="fileList"
					slot-scope="text, record"
				>
					<span class="preview-box">
						<a-tooltip
							v-for="(item, i) in record.fileList"
							:key="i"
						>
							<template slot="title"> 上传时间：{{ item.uploadTime }} </template>
							<a
								href="javascript:;"
								class="preview"
								@click="handlePreview(item)"
							>
								{{ item.fileName || item.name }}
							</a>
						</a-tooltip>
					</span>
				</template>
				<template
					slot="action"
					slot-scope="text, items"
				>
					<a
						href="javascript:;"
						@click="download(items)"
						>下载</a
					>
				</template>
			</a-table>
		</div>
</template>

<script>
const filesColumns = [
	{ title: '文件类型', dataIndex: 'typeName', width: '20%' },
	{ title: '文件名称', dataIndex: 'fileList', scopedSlots: { customRender: 'fileList' } },
	{ title: '操作', dataIndex: 'action', scopedSlots: { customRender: 'action' }, width: '15%', align: 'center' }
];
export default {
	name: 'AttachmentView',
	props: {
		list: {
			default: () => {return []}
		},
		columns: {
			default: () => {return filesColumns}
		}
		
	},
	computed: {
		contractAttachment() {
			const obj = {};
			// const list = this.contractInfo.list || [];
			this.list.forEach(el => {
				if (!obj[el.type]) {
					
					obj[el.type] = { fileList: [], typeName: el.typeName, type: el.type };
				}
				obj[el.type].fileList.push(el);
			});
			const contractAttachment = [];
			for (let k in obj) {
				contractAttachment.push(obj[k]);
			}
			console.log(contractAttachment)
			return contractAttachment;
		},
	},
	data() {
		return {

		}
	},
	methods: {
		handlePreview(item) {
			this.$emit('handlePreview', item);
		},
		download(item) {
      
			this.$emit('download', item);
		}

	},
	components: {

	}
}
</script>
<style scoped lang='less'> 
@import url('~@/v2/style/table-cover.less');
</style>
<style  lang='less' >
.attachment-view {
	table {
		margin: 0;
	}
	.ant-table-tbody tr td  {
		// margin-right: 0;
		border-right: 1px solid #e5e6eb;
    border-left: 0;
    border-top: 0;
    border-bottom: 1px solid #e5e6eb !important;
	}
	.ant-table-tbody tr td:last-child  {
		// margin-right: 0;
		border-right: 0;
	}
}

</style>
