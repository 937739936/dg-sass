<template>
	<a-modal
		centered
		title="查看附件"
		width="70%"
		height="80%"
		v-model="visible"
		:mask="true"
		:maskClosable="false"
		:footer="null"
	>
		<div>
			<a-table
				:bordered="false"
				:columns="columns"
				:rowKey="record => record.id"
				:dataSource="dataList"
				:pagination="false"
				:scroll="{ x: false }"
			>
				<template
					slot="action"
					slot-scope="action, record"
				>
					<a @click.prevent="handlePreview(record)">查看</a>
					<a
						@click.prevent="download(record)"
						style="padding-left: 10px"
						>下载</a
					>
				</template>
			</a-table>
			<img
				:src="previewImg"
				style="display: none"
				ref="viewer"
				v-viewer
			/>
		</div>
	</a-modal>
</template>
<script>
import comDownload from '@sub/utils/comDownload.js';
import ENV from '@/v2/config/env';
import { API_GETCURRENTENV, API_DOWNLPREVIEWTE, API_GetDownloadRAR } from '@/v2/center/trade/api/coal';

const columns = [
	{
		title: '文件类型',
		key: 'typeName',
		dataIndex: 'typeName'
	},
	{
		title: '文件格式',
		key: 'ext',
		dataIndex: 'ext'
	},
	{
		title: '文件名',
		key: 'name',
		dataIndex: 'name'
	},
	{
		title: '操作',
		key: 'action',
		dataIndex: 'action',
		fixed: 'right',
		scopedSlots: { customRender: 'action' }
	}
];
export default {
	props: {
		dataList: {
			default: () => {
				return [];
			}
		}
	},
	data() {
		return {
			visible: false,
			previewImg: '',
			columns
		};
	},
	methods: {
		show() {
			this.visible = true;
		},
		close() {
			this.visible = false;
		},

		handlePreview(data) {
			let url = data.url;
			this.previewImg = url;
			if (this.previewImg.indexOf('.pdf') != -1) {
				window.open(this.previewImg, '_blank');
				return;
			}
			if (
				this.previewImg.indexOf('.doc') > -1 ||
				this.previewImg.indexOf('.docx') > -1 ||
				this.previewImg.indexOf('.xlsx') > -1 ||
				this.previewImg.indexOf('.xls') > -1
			) {
				const jumpUrl = 'https://view.officeapps.live.com/op/view.aspx?src=' + encodeURIComponent(API_GETCURRENTENV(url));
				window.open(jumpUrl, '_blank');
				return;
			}
			if (this.previewImg.indexOf('.rar') > -1 || this.previewImg.indexOf('.zip') > -1) {
				if (data.attachId) {
					API_GetDownloadRAR(data.attachId).then(res => {
						comDownload(res, undefined, data.name + '.zip');
					});
				} else {
					window.open(this.previewImg, '_blank');
				}
				return;
			}
			this.$refs.viewer.$viewer.show();
		},
		download(record) {
			if (record.attachId) {
				API_GetDownloadRAR(record.attachId).then(res => {
					comDownload(res, undefined, record.name);
				});
			}
			if (record.fileUrl) {
				let BASE_NET = ENV.BASE_NET;
				API_DOWNLPREVIEWTE(BASE_NET + record.fileUrl).then(res => {
					comDownload(res, null, record.fileName);
				});
			}
		}
	}
};
</script>
<style lang="less" scoped></style>
