<template>
	<div class="wrap">
		<a-table
			:columns="columns"
			:data-source="fileList"
			:pagination="false"
		>
			<span
				slot="type"
				class="type-wrap"
			>
				<span class="type-required">合同终止</span>
				<i-upload
					class="upload-btn-wrap"
					:action="action"
					:accept="accept"
					:showDesc="false"
					:showUploadList="false"
					:limit="false"
					:multiple="true"
					:size="100"
					v-on:upload="uploadChange"
				>
					<a-button
						type="primary"
						ghost
						class="upload-btn"
						>上传</a-button
					>
				</i-upload>
			</span>
			<span
				slot="fileName"
				slot-scope="text, record"
			>
				<ul class="file-tag-wrap">
					<li
						class="file-tag"
						v-for="(item, index) in list"
						:key="index"
					>
						<a-tooltip placement="top">
							<template slot="title">
								<span>上传时间：{{ moment(item.timestamp).format('YYYY-MM-DD HH:mm:ss') }}</span>
							</template>
							<span>
								<span>{{ item.fileName }}</span>
								<span
									class="file-tag-delete-icon"
									@click="deleteItem(index)"
								></span>
							</span>
						</a-tooltip>
					</li>
				</ul>
			</span>
		</a-table>
	</div>
</template>

<script>
import iUpload from '@/v2/components/upload.vue';
import { API_UPLOAD_FILE } from 'api';
import moment from 'moment';

const columns = [
	{
		title: '单据类型',
		dataIndex: 'type',
		key: 'type',
		scopedSlots: { customRender: 'type' },
		width: 210
	},
	{
		title: '文件名称',
		dataIndex: 'fileName',
		key: 'fileName',
		scopedSlots: { customRender: 'fileName' }
	}
];

export default {
	data() {
		return {
			fileList: [
				{
					key: '1',
					type: '35',
					fileName: []
				}
			],
			list: [],
			columns,
			action: API_UPLOAD_FILE,
			accept: '.jpg,.jpeg,.png,.ofd,.pdf',
			md5HexList: []
		};
	},
	components: {
		iUpload
	},
	methods: {
		moment,
		deleteItem(index) {
			this.list.splice(index, 1);
		},
		getFileList() {
			return this.list;
		},
		uploadChange(file) {
			file.forEach(item => {
				if (item.md5Hex && !this.md5HexList.includes(item.md5Hex)) {
					this.md5HexList.push(item.md5Hex);
					this.list.push(item);
				}
			});
		}
	}
};
</script>

<style lang="less" scoped>
.wrap {
	margin-top: 20px;
	.type-required::before {
		content: '*';
		width: 14px;
		height: 20px;
		line-height: 20px;
		display: inline-block;
		color: #ea5530;
	}
	.type-wrap {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}
	/deep/ .ant-table-tbody > tr > td:nth-child(1) {
		border-right: 1px solid #e5e6eb;
	}
	.upload-btn {
		width: 64px;
		height: 24px;
		text-align: center;
		font-size: 14px;
		position: absolute;
		top: 0;
		left: 0;
	}
	.file-tag {
		width: auto;
		height: 28px;
		line-height: 28px;
		display: inline-block;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		border-radius: 4px;
		background: #f3f5f6;
		padding: 0 8px;
		box-sizing: border-box;
		margin-right: 14px;
		color: #4682f3;
		.file-tag-delete-icon {
			width: 14px;
			height: 14px;
			display: inline-block;
			background-image: url('~@/v2/assets/imgs/contract/file-table-delete-icon.svg');
			background-size: 14px 14px;
			background-repeat: no-repeat;
			margin-left: 8px;
			cursor: pointer;
			position: relative;
			top: 2px;
		}
	}
}
.upload-btn-wrap {
	width: 64px;
	height: 24px;
	overflow: hidden;
	position: relative;
	.upload-file-content {
		.ant-upload-select-picture-card {
			width: 64px;
			height: 24px;
			overflow: hidden;
			border: none !important;
		}
	}
}
</style>
