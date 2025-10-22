<template>
	<div class="contentBox slMain">
		<div class="title">
			<a-space :size="20"> 确认函信息 </a-space>
		</div>
		<div class="mb50 content">
			<div class="table-box">
				<a-table
					:columns="filesColumns"
					bordered
					class="new-table"
					rowKey="fileUrl"
					:dataSource="dataFileSource"
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
								<template
									slot="title"
									v-if="item.transferName"
								>
									{{ item.transferName }}
								</template>
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
						slot="status"
						slot-scope="text, items"
					>
						<span
							v-if="!items.sealStatus"
							class="status-tag status-1"
						>
							起草
						</span>
						<span
							v-else
							class="status-tag status-2"
						>
							已签署
						</span>
					</template>
					<template
						slot="action"
						slot-scope="text, items"
					>
						<a
							href="javascript:;"
							@click="download(items)"
						>
							下载
						</a>
					</template>
					<template slot="lockedTitle">
						锁定
						<a-switch
							:checked="lockedAll"
							@change="onChangeAll"
							:disabled="!audit"
						/>
					</template>
					<template
						slot="locked"
						slot-scope="text, record"
					>
						<a-switch
							:disabled="!audit"
							:checked="Boolean(record[lockedKey])"
							@change="onChange(record)"
						/>
					</template>
				</a-table>
				<ImageViewer ref="imageViewer" />
			</div>
		</div>
	</div>
</template>
<script>
import comDownload from '@sub/utils/comDownload.js';
import ImageViewer from '@sub/components/viewer/image.vue';
const filesColumns = [
	{ title: '单据类型', dataIndex: 'typeDesc', width: '20%' },
	{ title: '文件名称', dataIndex: 'fileList', scopedSlots: { customRender: 'fileList' } },
	{ title: '状态', dataIndex: 'status', scopedSlots: { customRender: 'status' }, width: '15%', align: 'center' },
	{ title: '操作', dataIndex: 'action', scopedSlots: { customRender: 'action' }, width: '15%', align: 'center' },
	{
		slots: { title: 'lockedTitle' },
		dataIndex: 'locked',
		scopedSlots: { customRender: 'locked' },
		width: '15%',
		align: 'center'
	}
];
export default {
	name: 'ConfirmLetter',
	components: {
		ImageViewer
	},
	data() {
		return {};
	},
	props: {
		editFlag: {
			type: Boolean,
			default: false
		},
		audit: {
			type: Boolean,
			default: false
		},
		confirmLetterInfo: {
			type: Object,
			default: () => {
				return {};
			}
		}
	},
	inject: {
		downFileAllParent: { form: 'downFileAllParent', default: null },
		refreshParent: { form: 'refreshParent', default: null },
		serialNo: { form: 'serialNo', default: null },
		lockedKey: { form: 'lockedKey', default: 'locked' }
	},
	filters: {},
	watch: {},
	mounted() {},
	computed: {
		type() {
			return process.env.VUE_APP_SYSTEM_TYPE;
		},
		filesColumns() {
			if (this.type === 'rest') {
				let list = filesColumns.filter(item => item.dataIndex !== 'locked');
				// 如果是编辑，不要下载
				if (this.editFlag) {
					list = list.filter(item => item.dataIndex !== 'action');
				}
				return list;
			} else {
				return filesColumns.filter(item => item.dataIndex !== 'action');
			}
		},
		// 上传附件限制种类
		bankProductAssetConfigList() {
			let bankProductAssetConfigList = this.confirmLetterInfo?.bankProductAssetConfigList || [];
			bankProductAssetConfigList = bankProductAssetConfigList
				.filter(item => item.status == 1)
				.map(item => {
					let accept = ['png', 'jpeg', 'jpg', 'bmp'];
					return {
						key: item.item,
						label: item.itemDesc,
						accept,
						required: Boolean(item.required)
					};
				});
			return bankProductAssetConfigList;
		},
		// 附件信息
		attachList() {
			return this.confirmLetterInfo?.list || [];
		},
		// 附件列表
		dataFileSource() {
			let list = this.attachList.filter(item => item.delFlag != 1);
			let obj = {};
			let listAdmin = [];
			list.forEach(el => {
				let { type, typeDesc, sealStatus, locked, checked, id } = el;
				let required = false;
				if (!typeDesc) {
					let typeItem = this.bankProductAssetConfigList.find(item => item.key === type);
					if (typeItem) {
						typeDesc = typeItem?.label;
						required = typeItem?.required;
					}
				}
				let elObj = { required, locked, checked, id, sealStatus, typeDesc, type };
				if (!obj[type]) {
					obj[type] = { fileList: [], ...elObj };
				}
				listAdmin.push({ fileList: [el], ...elObj });
				obj[type].fileList.push(el);
			});
			list = [];
			for (let k in obj) {
				list.push(obj[k]);
			}
			if (this.type === 'rest') {
				return list;
			}
			// admin端不做合并处理
			return listAdmin;
		},
		// 判断所有文件锁定
		lockedAll() {
			if (this.dataFileSource.length) {
				let locked = this.dataFileSource.every(item => Boolean(item[this.lockedKey]));
				return locked;
			}
			return false;
		}
	},
	methods: {
		handlePreview(items) {
			this.$refs.imageViewer.showFile(items);
		},
		download(record) {
			let fileList = record.fileList;
			let files = fileList.map(item => item.path);
			let zipFileName = '';
			if (files.length === 0) {
				return;
			}
			if (files.length === 1) {
				zipFileName = fileList[0].transferName;
			} else {
				zipFileName = (record.typeDesc || record.itemDestc) + '.zip';
			}
			if (this.serialNo) {
				zipFileName = `${this.serialNo()}-${zipFileName}`;
			}
			files = files.join(',');
			if (this.downFileAllParent) {
				this.downFileAllParent({ zipFileName, files }).then(res => {
					comDownload(res.data, undefined, res.name);
				});
			}
		},
		onChange(record) {
			let fileId = '';
			if (record.fileList?.length) {
				let arr = [];
				record.fileList.forEach(pro => {
					arr.push(pro.id);
				});
				fileId = arr.join(',');
			} else {
				fileId = record.id;
			}
			if (!fileId) {
				return;
			}
			let params = { type: record.type, fileId: fileId, lock: Boolean(!record[this.lockedKey]) };
			if (this.refreshParent) {
				this.refreshParent(params);
			}
		},
		onChangeAll() {
			let fileId = '';
			if (this.dataFileSource?.length) {
				let arr = [];
				this.dataFileSource.forEach(pro => {
					arr.push(pro.id);
				});
				fileId = arr.join(',');
			}
			if (!fileId) {
				return;
			}
			let params = { fileId: fileId, fileList: this.attachList, lock: Boolean(!this.lockedAll) };
			if (this.refreshParent) {
				this.refreshParent(params);
			}
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@sub/style/table-cover.less');
.contentBox {
	font-size: 14px;
	color: #141517;
	background: none;
	margin: 0;
	min-width: 100%;

	::v-deep {
		.title {
			font-family: PingFang SC;
			font-size: 16px;
			font-weight: 500;
			line-height: 32px;
			color: rgba(0, 0, 0, 0.8);
			margin-bottom: 15px;
			.ant-btn {
				padding: 0 10px;
			}
			div {
				font-family: PingFang SC;
			}
		}
		.mb50 {
			margin-bottom: 50px;
		}
		.content {
		}
	}
}
.new-table {
	margin-top: 20px;
	/deep/ .ant-table-tbody > tr {
		background: #fff !important;
		&.ant-table-row-hover {
			background: #fff !important;
			td {
				background: none !important;
			}
		}
	}
	/deep/ .ant-table-tbody > tr > td {
		border-bottom: 1px solid #e5e6eb;
		padding: 8px 12px;
	}
	/deep/ .ant-table-tbody > tr > td:nth-child(1) {
		border-right: 1px solid #e5e6eb;
	}
	/deep/ .ant-table-tbody > tr:last-child > td {
		// border-bottom: 0;
	}
	/deep/ .ant-table-tbody > tr > td:nth-child(2) {
		// padding-bottom: 0;
	}

	.preview {
		cursor: pointer;
		margin-right: 14px;
		padding-right: 14px;
		border-right: 1px solid #e9effc;
	}
	.preview-box {
		.preview:last-child {
			border-right: 0;
		}
	}
	.status-tag {
		display: inline-block;
		padding: 4px;
		border-radius: 4px;
		font-size: 12px;
		line-height: 12px;
		background: #c1d7ff;
		color: #4682f3;
		cursor: pointer;
		&.status-1 {
			// 待提交
			background: #ffdbc8;
			color: #ff7937;
		}
		&.status-2 {
			// 已生效
			background: #c5ecdd;
			color: #3eb384;
		}
	}
}
</style>
