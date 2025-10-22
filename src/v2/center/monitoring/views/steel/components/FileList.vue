<template>
	<div>
		<p class="tab-title">其他附件</p>
		<a-table
			:pagination="false"
			:columns="columns"
			:data-source="filesData"
			:scroll="{ x: true }"
			rowKey="fileUrl"
		>
			<div
				slot="action"
				slot-scope="action, items"
			>
				<a @click="preview(items)">查看</a>
				<a
					href="javascript:;"
					@click="jumpDownload(items)"
					>下载</a
				>
			</div>
		</a-table>
		<image-viewer ref="imageViewer" />
	</div>
</template>

<script>
import { API_SteelsDownloadFilesPath } from '@/v2/api/steels.js';
import comDownload from '@sub/utils/comDownload.js';
import imageViewer from '@/v2/components/imageViewer.vue';
import { filePreview } from '@/v2/utils/file';

const columns = [
	{ title: '附件类型', dataIndex: 'type' },
	{ title: '文件名', dataIndex: 'name' },
	{ title: '文件类型', dataIndex: 'fileType' },
	{ title: '来源', dataIndex: 'source' },
	{ title: '操作', fixed: 'right', slots: { title: 'customTitle' }, scopedSlots: { customRender: 'action' } }
];
export default {
	name: 'FileList',
	data() {
		return {
			columns,
			filesData: []
		};
	},
	props: ['contractData'],
	watch: {
		contractData: function (data) {
			this.filesData = data.otherAttachments;
		}
	},
	components: {
		imageViewer
	},
	created() {
		this.filesData = this.contractData.otherAttachments || [];
	},
	methods: {
		jumpDownload(record) {
			console.log(record);
			// 单一附件信息下载附件
			API_SteelsDownloadFilesPath(record.id).then(res => {
				comDownload(res, null, record.name);
			});
		},
		// 预览
		preview(items) {
			let url = items.path;
			filePreview(url, this.$refs.imageViewer.show);
		}
	}
};
</script>

<style lang="less" scoped>
.ant-table-tbody {
	td {
		div > a {
			display: inline-blok;
			margin-right: 8px;
		}
		div > a:last-child {
			margin-right: 0;
		}
	}
}
.tab-title {
	font-size: 16px;
	font-weight: bold;
	border-bottom: 1px solid #efefef;
	margin-bottom: 20px;
	padding-bottom: 6px;
}
</style>
