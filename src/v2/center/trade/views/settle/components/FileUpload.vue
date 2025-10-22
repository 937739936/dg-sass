<template>
	<div>
		<div class="category-upload-1">
			<a-table
				class="new-table"
				:dataSource="fileData"
				:columns="columns"
				:pagination="false"
				rowKey="index"
			>
				<template
					slot="ext"
					slot-scope="text, record"
				>
					{{ record.fileName.split('.')[record.fileName.split('.').length - 1] }}
				</template>
				<template
					slot="operation"
					slot-scope="text, record, index"
				>
					<a
						href="javascript:;"
						class="edit-btn"
						@click="preView(record, index)"
						>查看</a
					>
					<a-popconfirm
						v-if="fileData.length"
						title="确定删除该附件信息?"
						okText="确定"
						cancelText="取消"
						@confirm="() => onDelete(record)"
					>
						<a
							href="javascript:;"
							class="delete-btn"
							v-if="ifEditable && record.dataSource == 2"
							>删除</a
						>
						<!-- 系统同步的附件只能查看 不能删除 -->
					</a-popconfirm>
				</template>
			</a-table>
			<p
				class="add-wrap"
				@click="addFileType"
				v-if="ifEditable"
			>
				<i>+</i>新增附件
			</p>
		</div>
		<div class="modal-wrap">
			<a-modal
				title="附件信息"
				centered
				v-model="modalFileWrapIsShow"
				okText="确定"
				cancelText="取消"
				@ok="modalFormSubmit"
				@cancel="modalCancel"
				class="slModal modal-file-info-upload-1"
			>
				<template
					slot="footer"
					v-if="!ifEditable"
				>
					<a-button
						key="submit"
						@click="modalCancel"
					>
						取消
					</a-button>
				</template>
				<a-form
					:form="modalFileForm"
					:label-col="{ span: 6 }"
					:wrapper-col="{ span: 10 }"
				>
					<a-row>
						<!-- <a-col :span="24"> -->
						<a-form-item
							label="附件类型"
							:colon="false"
						>
							<a-select
								style="width: 200px"
								placeholder="请选择"
								labelInValue
								:disabled="!ifEditable"
								v-decorator="['fileType', { rules: [{ required: true, message: '请选择附件类型' }] }]"
							>
								<template v-for="(item, index) in fileTypeList">
									<a-select-option
										:value="item.value"
										:disabled="item.disabled"
										:key="index"
										v-if="item.isShow"
									>
										{{ item.text }}
									</a-select-option>
								</template>
							</a-select>
						</a-form-item>
						<a-form-item
							label="附件"
							:colon="false"
							:class="ifEditable ? '' : 'unEditable'"
						>
							<a-upload
								style="width: 200px"
								:headers="headers"
								v-decorator="['uploadFiles', { rules: [{ required: true, message: '请上传附件' }] }]"
								:beforeUpload="beforeUpload"
								:data="{ terminalContractId: contractId }"
								:action="type[0] == 1 ? actionOne : action"
								:multiple="true"
								listType="picture-card"
								:fileList="fileList"
								@preview="handlePreview"
								@change="fileChange"
								name="file"
								:remove="removeFile"
								:accept="accetpFileList"
							>
								<div v-if="ifEditable && fileList.length < 100">
									<i class="file_icon"><a-icon type="plus" /></i>
									<div class="ant-upload-text">点击选择</div>
								</div>
							</a-upload>
							<a-modal
								width="700px"
								height="700px"
								:visible="previewVisible"
								:footer="null"
								@cancel="handlePreviewCancel"
							>
								<!-- 预览图片可旋转 -->
								<div class="img-wrapper">
									<div id="preview-img-id">
										<a
											:href="previewImage"
											target="_blank"
										>
											<img
												alt="example"
												:src="previewImage"
											/>
										</a>
									</div>
								</div>
								<div style="text-align: center">
									<a-button @click="handleClick">旋转</a-button>
								</div>
							</a-modal>
						</a-form-item>
						<div
							class="file-notice"
							v-if="ifEditable"
						>
							<p>附件上传要求：</p>
							<p>可支持格式为{{ accetpFileFormat.join('，') }}的附件，单个附件大小不得超过100M的文件。</p>
						</div>
					</a-row>
				</a-form>
			</a-modal>
			<image-viewer ref="imageViewer" />
		</div>
	</div>
</template>
<script>
import { API_ContractAttachFilesUpload, API_GETCURRENTENV, API_DownstreamContractUpload } from '@/v2/center/trade/api/settle';
import { mapGetters, mapMutations } from 'vuex';
import ENV from '@/v2/config/env';
import { TableRowSpanFunc } from '@/v2/utils/factory.js';
import { filePreview } from '@/v2/utils/file';
import imageViewer from '@/v2/components/imageViewer.vue';
export default {
	name: 'FilesUpload',
	props: {
		ifEditable: {
			required: true,
			default: false
		},
		fileDataSource: {
			default() {
				return [];
			}
		},
		type: {
			required: true,
			default: []
		},
		tabType: {
			default: ''
		},
		contractId: {
			type: [Number, String],
			default: ''
		},
		accetpFileFormat: {
			type: Array,
			default: () => ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'docx', 'doc', 'xls', 'xlsx']
		}
	},
	components: {
		imageViewer
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_TOKEN: 'VUEX_ST_TOKEN'
		}),
		headers() {
			return {
				Authorization: this.VUEX_ST_TOKEN,
				Source: 'PC'
			};
		},
		accetpFileList() {
			return this.accetpFileFormat.map(item => `.${item}`).join(',');
		}
	},
	watch: {
		fileDataSource: {
			immediate: true,
			handler(data) {
				const fileData = [];
				let typeName = '';
				data.forEach(item => {
					const fileList = []; // 编辑时恢复数据
					fileList.push({
						name: item.fileName,
						status: 'done',
						uid: item.id,
						type: item.ext,
						url: API_GETCURRENTENV(item.fileUrl),
						response: {
							success: true,
							data: {
								fileName: item.fileName,
								fileUrl: item.fileUrl,
								md5Hex: item.md5Hex
							}
						}
					});
					// this.fileTypeList.forEach((i) => {
					//   if (i.value == item.type) {
					//     typeName = i.text;
					//   }
					// });
					fileData.push({
						id: item.id,
						type: item.type,
						fileName: item.fileName,
						typeName: item.typeName,
						md5Hex: item.md5Hex,
						ext: item.ext,
						dataSource: item.dataSource,
						uploadFiles: {
							fileList
						}
					});
				});
				this.fileData = TableRowSpanFunc(fileData, 'typeName');
				this.sendToFather();
			}
		},
		type() {
			//this.filterAttachmentType();
		}
	},
	data() {
		return {
			fileData: [],
			columns: [
				// 销售合同中相关附件表头数据
				{
					title: '文件类型',
					dataIndex: 'typeName',
					width: '20%',
					customRender: (text, row, index) => {
						const obj = {
							children: `${text}`,
							attrs: {}
						};
						if (index === 0) {
							// 第一行数据开始，跨行合并的长度为数据data的长度
							obj.attrs.rowSpan = this.fileData.length * 2;
						}
						if (index >= 1) {
							// 从第一行往后的所有行表格均合并
							obj.attrs.rowSpan = 0;
						}
						return obj;
					}
				},
				{
					title: '文件名',
					dataIndex: 'fileName',
					width: '45%'
				},
				{
					title: '操作',
					width: '15%',
					dataIndex: 'operation',
					scopedSlots: { customRender: 'operation' }
				}
			],
			modalFileWrapIsShow: false,
			modalFileForm: this.$form.createForm(this),
			action: API_ContractAttachFilesUpload, // 结算单、发票、回款、合同附件上传
			actionOne: API_DownstreamContractUpload, // 下游合同上传
			previewVisible: false,
			previewImage: '',
			fileList: [],
			ifAddStatus: false,
			modifyIndex: 0,

			// 如果是上游合同 则附件类型为：上游合同补充材料、其他材料
			fileTypeList: [
				// 完善合同附件类型
				{
					value: 3,
					disabled: false,
					text: '结算单',
					isShow: true
				}
			],
			deg: 0
		};
	},
	methods: {
		...mapMutations({
			VUEX_MU_LOADING: 'config/VUEX_MU_LOADING'
		}),
		// 旋转图片
		handleClick() {
			this.deg = (this.deg + 90) % 360;
			const ele = document.getElementById('preview-img-id');
			ele.style.transform = `rotate(${this.deg}deg)`;
		},
		filterAttachmentType() {
			this.fileTypeList.forEach((item, index) => {
				this.fileTypeList[index].isShow = false;
				if (this.type.includes(item.value)) {
					this.fileTypeList[index].isShow = true;
				}
			});
		},
		preView(record) {
			filePreview(record.fileUrl, this.$refs.imageViewer.show);
		},
		repeatOptionJudge() {
			// 类型选项不可重复
			this.fileTypeList.map(i => {
				i.disabled = false;
			});
			this.fileData.forEach(item => {
				if (item.type) {
					this.fileTypeList.map(i => {
						if (i.value == item.type) {
							i.disabled = true;
						}
					});
				}
			});
		},
		modalFormSubmit() {
			this.modalFileForm.validateFields((err, values) => {
				if (!err) {
					if (this.fileList.length == 0) {
						this.$message.error('请上传文件');
						return;
					}
					let repeatFlag = false; // true代表重复 false代表不重复
					this.fileList.forEach((item, index) => {
						if (item.response && !item.response.success) {
							// 后台查询到的重复会报错
							if (item.response.error) {
								this.$message.error(item.response.error.message);
							} else {
								this.$message.error(item.response.message);
							}
							repeatFlag = true;
						} else {
							this.fileList.forEach((one, order) => {
								if (order != index && one.response && one.response.success) {
									// 后台查询到的重复会报错
									if (item.response.data.md5Hex == one.response.data.md5Hex) {
										repeatFlag = true;
									}
								}
							});
						}
					});
					if (repeatFlag) {
						// 判断是否有重复文件
						this.$message.error('文件已经存在，请重新选择文件');
						return;
					}
					// 判断是新增还是修改
					if (this.ifAddStatus) {
						values.uploadFiles.fileList.forEach((item, index) => {
							this.fileData.push({
								id: null,
								type: values.fileType.key,
								typeName: values.fileType.label,
								fileName: item.response.data.fileName,
								ext: item.type,
								md5Hex: item.response.data.md5Hex,
								dataSource: 2,
								uploadFiles: { fileList: [item] }
							});
						});
					} else if (this.ifEditable) {
						this.fileData.splice(this.modifyIndex, 1, {
							id: values.uploadFiles.fileList[0].uid,
							type: values.fileType.key,
							typeName: values.fileType.label,
							fileName: values.uploadFiles.fileList[0].response.data.fileName,
							ext: values.uploadFiles.fileList[0].type,
							md5Hex: values.uploadFiles.fileList[0].response.data.md5Hex,
							dataSource: 2,
							uploadFiles: { fileList: [values.uploadFiles.fileList[0]] }
						});
						if (values.uploadFiles.fileList.length > 1) {
							values.uploadFiles.fileList.forEach((item, index) => {
								if (index > 0) {
									this.fileData.splice(this.modifyIndex + 1, 0, {
										id: item.uid,
										type: values.fileType.key,
										typeName: values.fileType.label,
										fileName: item.response.data.fileName,
										ext: item.type,
										md5Hex: item.response.data.md5Hex,
										dataSource: 2,
										uploadFiles: { fileList: [item] }
									});
								}
							});
						}
					}
					this.fileList = [];
					this.modalFileWrapIsShow = false;
					this.modalFileForm.resetFields();
					this.sendToFather();
				}
			});
		},
		sendToFather() {
			// 发送父组件
			this.fileData.forEach(item => {
				item.fileUrl = item.uploadFiles.fileList[0].response.data.fileUrl;
			});
			this.$emit('uploadFiles', this.fileData);
		},
		onDelete(record) {
			const fileData = [...this.fileData];
			this.fileData = fileData.filter(item => item.md5Hex !== record.md5Hex);
			this.sendToFather();
		},
		modalCancel() {
			this.fileList = [];
			this.modalFileWrapIsShow = false;
			this.modalFileForm.resetFields();
		},
		handlePreviewCancel() {
			const ele = document.getElementById('preview-img-id');
			ele.style.transform = 'rotate(0deg)';
			this.deg = 0;
			this.previewVisible = false;
		},
		handlePreview(file) {
			// 添加与修改时返回格式不同
			const t = this;
			t.previewImage = '';
			function getPreview(target, ifFullPath) {
				let jumpUrl = ifFullPath ? target : API_GETCURRENTENV(target);
				if (target.indexOf('.pdf') > -1) {
					window.open(jumpUrl, '_blank');
				} else if (
					target.indexOf('.doc') > -1 ||
					target.indexOf('.docx') > -1 ||
					target.indexOf('.xlsx') > -1 ||
					target.indexOf('.xls') > -1
				) {
					jumpUrl = `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(jumpUrl)}`;
					window.open(jumpUrl, '_blank');
				} else {
					if (file.response && file.response.result) {
						t.previewImage = API_GETCURRENTENV(file.response.result);
					} else {
						t.previewImage = file.url || file.thumbUrl;
					}

					t.previewVisible = true;
				}
			}

			if (file.response && file.response.success) {
				getPreview(file.response.data.fileUrl, false);
			}

			if (file.url) {
				getPreview(file.url, true);
			}
		},
		fileChange({ fileList }) {
			const info = { fileList };
			if (this.type[0] == 1 && fileList.length > 0) {
				// 1代表上游合同，只能传一个附件
				const arr = [];
				arr[0] = fileList[fileList.length - 1];
				fileList = arr;
			}
			this.fileList = fileList;
			this.fileList.forEach(item => {
				if (item.response && item.response.success && item.type && item.type.indexOf('image') !== 0) {
					this.$set(item, 'thumbUrl', ENV.BASE_NET + item.response.data.fileUrl);
				}
				if (item.response && !item.response.success) {
					if (item.response.error) {
						this.$message.error(item.response.error.message);
					} else {
						this.$message.error(item.response.message);
					}
				}
			});
			this.VUEX_MU_LOADING(true);
			if (!fileList.length) {
				this.VUEX_MU_LOADING(false);
			}
			if (fileList.length && fileList[fileList.length - 1].status == 'done') {
				this.VUEX_MU_LOADING(false);
			}
			if (fileList.length && fileList[fileList.length - 1].status == 'error') {
				this.VUEX_MU_LOADING(false);
			}
		},
		beforeUpload(file) {
			const allowFormat = this.accetpFileFormat;
			let isAllowFormat = false;
			const fileFormat = (file.name.split('.')[file.name.split('.').length - 1] || '').toLowerCase();
			if (allowFormat.indexOf(fileFormat) == -1) {
				this.$message.error(`仅支持${allowFormat.join('，')}的格式`);
				isAllowFormat = false;
			} else {
				isAllowFormat = true;
			}
			const t = this;
			function fileTypeJudge() {
				if (file.size / 1024 / 1024 > 100) {
					t.$message.error('单个附件大小不得超过100M');
					return true;
				}
				if (file.name.indexOf('/') > 0 || file.name.indexOf('\\') > 0 || file.name.indexOf('%') > 0) {
					t.$message.error('文件名不要包含特殊符号');
					return true;
				}
			}
			const ifOverSize = fileTypeJudge();
			return new Promise((resolve, reject) => {
				if (isAllowFormat && !ifOverSize) {
					return setTimeout(() => {
						resolve(file);
					}, 1);
				}
				return setTimeout(() => {
					reject(file);
				}, 1);
			});
		},
		addFileType() {
			this.modalFileWrapIsShow = true;
			this.ifAddStatus = true;
			//this.repeatOptionJudge();
			//this.filterAttachmentType();
		},
		removeFile() {
			if (!this.ifEditable) {
				this.$message.error('不能删除');
				return false;
			}
			if (this.fileList.length <= 1) {
				this.fileList = [];
			}
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
::v-deep .has-error .ant-form-explain {
	padding-left: 25%;
}
.category-upload-1 {
	.edit-btn {
		color: #1980ff;
		margin-right: 8px;
	}
	.delete-btn {
		color: #ff2929;
	}
	.line {
		padding: 0 10px;
	}
	.ant-table-placeholder {
		border-bottom: none;
	}
	.ant-table-row {
		td {
			overflow: hidden;
			word-break: break-all;
		}
	}
	.add-wrap {
		width: 100% !important;
		margin-top: 30px;
		background: #f9f9f9;
		border-top: 1px dashed #ddd;
		border-bottom: 1px dashed #ddd;
		text-align: center;
		padding: 10px 0;
		i {
			font-size: 20px;
			display: inline-block;
			vertical-align: middle;
			margin-right: 10px;
			position: relative;
			top: -2px;
		}
		&:hover {
			opacity: 0.8;
			cursor: pointer;
		}
	}
}
.modal-file-info-upload-1 {
	width: 90% !important;
	label {
		width: 100px;
		display: inline-block;
		text-align: left;
	}
	.file_icon {
		margin: 0 auto;
		display: block;
		background: url(~@/assets/imgs/upload/file_icon.png) no-repeat right center;
		width: 28px;
		height: 22px;
		margin-bottom: 10px;
		font-size: 20px;
	}
	.file-notice {
		color: #333;
		font-size: 14px;
	}
	.unEditable {
		.anticon-delete {
			display: none;
		}
	}
}
.row {
	margin-bottom: 10px;
}
.img-wrapper {
	margin: auto;
	position: relative;
	height: 600px;
	width: 600px;
	#preview-img-id {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		user-select: none;
		a {
			user-select: none;
		}
		img {
			max-width: 600px;
			max-height: 600px;
			pointer-events: none;
		}
	}
	&:hover .rotate-wrapper {
		display: flex;
	}
	.rotate-wrapper {
		justify-content: center;
		align-items: center;
		position: absolute;
		display: none;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		.rotate-icon {
			font-size: 80px;
			color: rgba(0, 0, 0, 0.3);
			cursor: pointer;
		}
	}
}
.new-table,
.new-table-file {
	::v-deep.ant-table-tbody > tr:first-child td:first-child {
		border-bottom: 1px solid #e5e6eb !important;
		border-radius: 0 0 0 4px !important;
	}
	::v-deep.ant-table-tbody > tr:last-child td:first-child {
		border-radius: 0 !important;
	}
	::v-deep.ant-table-tbody > tr td {
		border-right: 1px solid #e5e6eb !important;
	}
	::v-deep.ant-table-tbody > tr td:last-child {
		border-right: none !important;
	}
}
</style>
