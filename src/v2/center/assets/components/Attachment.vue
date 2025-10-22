<template>
	<div>
		<p class="sub-title"><span style="display: inline-block; margin-right: 30px">发票明细表附件</span></p>
		<a-table
			:pagination="false"
			:columns="columns"
			:data-source="list"
			:scroll="{ x: true }"
			rowKey="index"
		>
			<template slot="type"> 发票明细表 </template>
			<div
				slot="path"
				slot-scope="path, items"
			>
				<a
					href="javascript:;"
					@click="handlePreview(items)"
					>{{ items.name }}</a
				>
			</div>
		</a-table>
		<img
			:src="previewImg"
			style="display: none"
			ref="viewer"
			v-viewer
		/>
	</div>
</template>

<script>
const columns = [
	{ title: '单据类型', dataIndex: 'type', scopedSlots: { customRender: 'type' }, width: 210 },
	{ title: '文件名称', dataIndex: 'path', scopedSlots: { customRender: 'path' } }
];
import { API_GETCURRENTENV } from 'api/index';
import ENV from '@/v2/config/env';
export default {
	props: {
		list: {
			default: () => {
				return [];
			}
		}
	},
	data() {
		return {
			columns,
			previewImg: ''
		};
	},
	methods: {
		handlePreview(data) {
			let url = data.path || data.url || data.fileUrl;
			if (!url) {
				return;
			}
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
				const jumpUrl = 'https://view.officeapps.live.com/op/view.aspx?src=' + encodeURIComponent(this.previewImg);
				window.open(jumpUrl, '_blank');
				return;
			}
			const rule = '.mp4,.avi,.3gp,.mkv';
			const fileFormat = url.split('?')[0].split('.').pop().toLowerCase();
			if (rule.includes(fileFormat)) {
				window.open(this.previewImg, '_blank');
				return;
			}
			this.$refs.viewer.$viewer.show();
		}
	},
	components: {}
};
</script>

<style scoped lang="less">
.sub-title {
	margin: 10px 0;
	font-family: PingFangSC-Medium;
	&:before {
		content: '';
		float: left;
		margin-right: 4px;
		margin-top: 3px;
		display: block;
		width: 4px;
		height: 14px;
		background: @primary-color;
	}
}
</style>
