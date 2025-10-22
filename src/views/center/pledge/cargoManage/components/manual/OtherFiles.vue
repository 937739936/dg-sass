<template>
	<div class="contentBox">
		<div class="content">
			<p class="title">其他材料信息</p>
			<p class="sub-title">附件信息</p>
			<!-- 编辑模块 -->
			<template v-if="editFlag || editFile">
				<Upload
					@uploadFiles="getUploadFiles"
					type="OTHER"
					btnText="其他材料"
				></Upload>
				<!-- <Upload @uploadFiles="getUploadFiles" type="MANUAL_PAYMENT_ENTRUSTED_SETTLEMENT_LETTER" btnText="上传委托结算函"></Upload> -->
				<!-- <Upload @uploadFiles="getUploadFiles" type="MANUAL_CONTRACT_OTHER_MATERIALS" btnText="上传上游其他材料"></Upload>
                <Upload @uploadFiles="getUploadFiles" type="MANUAL_TERMINAL_CONTRACT_OTHER_MATERIALS" btnText="上传下游其他材料"></Upload> -->
				<span style="font-family: PingFangSC-Regular; font-size: 12px; color: #c8ccd5">单个文件最大支持100M，支持多个上传</span>
				<!-- 附件展示 -->
				<a-table
					:pagination="false"
					:columns="editFilesColumns"
					:data-source="fileListDataSource"
					:scroll="{ x: true }"
					rowKey="path"
				>
					<template
						slot="fileType"
						slot-scope="fileType"
					>
						{{ CONSTANTS.fileType[fileType] }}
					</template>
					<template
						slot="fileName"
						slot-scope="fileName, items"
					>
						{{ fileName }}
					</template>
					<!-- 显⽰条件，附件为⾮系统⽣成的电⼦⽂档或附件未被平台审核锁定 警⽰标记 点击，暂时执⾏删除⾏操作（编辑应付账款确认后⽣效） 删除按钮应隐藏-->
					<template
						slot="action"
						slot-scope="action, items, index"
					>
						<a
							@click="preview(items.fileUrl)"
							class="mr8"
							>查看</a
						>
						<a-popconfirm
							v-if="!items.locked && (items.editFlag == null || items.editFlag == 1)"
							title="确定删除该附件?"
							okText="确定"
							cancelText="取消"
							@confirm="() => deleteFiles(items, index)"
						>
							<a href="javascript:;">删除</a>
						</a-popconfirm>
					</template>
				</a-table>
			</template>
			<!-- 详情模块 -->
			<template v-if="!editFlag && !editFile">
				<a-table
					:pagination="false"
					:columns="filesColumns"
					:data-source="fileListDataSource"
					:scroll="{ x: true }"
					rowKey="path"
				>
					<template
						slot="fileType"
						slot-scope="fileType"
					>
						{{ CONSTANTS.fileType[fileType] }}
					</template>
					<template
						slot="fileName"
						slot-scope="fileName, items"
					>
						<a>{{ fileName }}</a>
					</template>
				</a-table>
			</template>
		</div>
		<img
			:src="previewImg"
			style="display: none"
			ref="viewer"
			v-viewer
		/>
	</div>
</template>
<script>
import Upload from '../Upload.vue';
import { getOfficeFileViewUrl } from 'untils/factory.js';
export default {
	name: 'OtherFiles',
	data() {
		return {
			fileListDataSource: [],
			previewImg: '',
			filesColumns: [
				{ title: '凭证类型', dataIndex: 'fileType', key: 'fileType', scopedSlots: { customRender: 'fileType' } },
				{ title: '初始文件名', dataIndex: 'fileName', key: 'fileName', scopedSlots: { customRender: 'fileName' } },
				{ title: '转换文件名', dataIndex: 'convertFileName', key: 'convertFileName', customRender: text => text || '-' }
			],

			editFilesColumns: [
				{ title: '凭证类型', dataIndex: 'fileType', key: 'fileType', scopedSlots: { customRender: 'fileType' } },
				{ title: '初始文件名', dataIndex: 'fileName', key: 'fileName', scopedSlots: { customRender: 'fileName' } },
				{ title: '转换文件名', dataIndex: 'convertFileName', key: 'convertFileName', customRender: text => text || '-' },
				{ title: '操作', key: 'action', fixed: 'right', scopedSlots: { customRender: 'action' }, width: 100, align: 'center' }
			], // 编辑附件表头
			editFilesList: [] // 编辑情况下，附件列表数据
		};
	},
	props: ['editFlag', 'otherInfo', 'editFile', 'receivalVO'],
	components: {
		Upload
	},
	watch: {
		otherInfo: function () {
			this.dealEditData();
		}
	},
	mounted() {
		this.dealEditData();
	},
	methods: {
		preview(url) {
			const front_url = url.split('?')[0];
			const fileFormat = front_url.split('.').pop().toLowerCase();
			const previewUrl = url;
			switch (fileFormat) {
				case 'pdf':
					window.open(previewUrl, '_blank');
					break;
				case 'xls':
				case 'xlsx':
				case 'doc':
				case 'docx':
					window.open(getOfficeFileViewUrl(url), '_blank');
					break;
				default:
					this.previewImg = previewUrl;
					this.$refs.viewer.$viewer.show();
					break;
			}
		},
		dealEditData() {
			if (!this.otherInfo) return;
			this.fileListDataSource = this.otherInfo || [];
			this.fileListDataSource = this.fileListDataSource.map(item => {
				return {
					...item,
					convertFileName: item.convertFileName,
					fileName: item.fileName || item.originalFileName,
					fileType: item.fileType || item.type,
					fileUrl: item.fileUrl || item.path
				};
			});
		},
		getUploadFiles(data) {
			// 上传文件 获取附件数据
			data.forEach(item => {
				this.fileListDataSource.push(item);
			});
		},
		deleteFiles(items, index) {
			// 删除附件
			this.fileListDataSource.splice(index, 1);
		},
		onSubmitList() {
			return this.fileListDataSource || [];
		},
		onSubmit() {
			return this.fileListDataSource;
		}
	}
};
</script>
<style lang="less" scoped>
.contentBox {
	font-size: 14px;
	color: #141517;

	.content {
		padding: 0 15px;
		.title {
			font-family: PingFangSC-Medium;
			padding-left: 16px;
			text-align: left;
			line-height: 40px;
			font-size: 15px;
			height: 40px;
			background-color: rgba(0, 83, 219, 0.15);
		}
		p {
			margin-bottom: 15px;
		}
		.sub-title {
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
	}
	::v-deep.ant-table {
		td {
			padding: 10px 12px;
		}
		th {
			padding: 10px 12px;
		}
		.ant-table-thead > tr > th span {
			font-family: PingFangSC-Medium;
			color: #383a3f;
		}
	}
	::v-deep.ant-table-fixed tr td {
		height: 42px;
	}
}
</style>
