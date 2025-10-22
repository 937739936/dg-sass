<template>
	<div style="display: inline-block">
		<div class="category-upload">
			<a-button
				type="primary"
				ghost
				@click="addFileType"
				>{{ btnText }}</a-button
			>
		</div>
		<div class="modal-wrap">
			<a-modal
				title="附件信息"
				centered
				v-model="modalFileWrapIsShow"
				okText="确定"
				cancelText="取消"
				:maskClosable="false"
				@ok="modalFormSubmit"
				@cancel="modalCancel"
				class="modal-file-info"
			>
				<a-form
					:form="modalFileForm"
					layout="inline"
				>
					<a-row class="row">
						<a-col :span="24">
							<a-form-item
								label="附件类型"
								:colon="false"
							>
								<a-input
									v-model="CONSTANTS.fileType[type]"
									disabled
									style="width: 200px; margin-bottom: 15px"
								></a-input>
							</a-form-item>
							<a-form-item
								label="附件"
								:colon="false"
							>
								<a-upload
									v-decorator="['uploadFiles', { rules: [{ required: true, message: '请选择附件' }] }]"
									:beforeUpload="beforeUpload"
									:data="{ type: type }"
									:action="action"
									:headers="headers"
									:multiple="true"
									listType="picture-card"
									:fileList="fileList"
									@preview="handlePreview"
									@change="fileChange"
									name="file"
									:remove="removeFile"
								>
									<div v-if="fileList.length < 100">
										<i class="file_icon"></i>
										<div class="ant-upload-text">点击选择</div>
									</div>
								</a-upload>
							</a-form-item>
							<div class="file-notice">
								<p>附件上传要求：</p>
								<p>可支持格式为{{ myFormat.join('，') }}的附件，单个附件大小不得超过100M的文件。</p>
							</div>
						</a-col>
					</a-row>
				</a-form>
			</a-modal>
		</div>
		<ImageViewer ref="imageViewer" />
	</div>
</template>
<script>
import { API_UploadSTEELAssetsFile, API_UPLOAD_FILE } from '@/api';
import { mapGetters, mapMutations } from 'vuex';
import ImageViewer from '@sub/components/viewer/image.vue';
// const defaultFormat = ["png","jpeg","jpg","gif","pdf","doc","docx","xlsx","xls","rar","zip"]
// const qualityFormat = ["png","jpeg","jpg","gif","pdf"]
// const qualityWEIGHTFormat = ["png","jpeg","jpg","gif","pdf","doc","docx","xlsx","xls"]
export default {
	name: 'Upload',
	data() {
		return {
			fileData: [],
			modalFileWrapIsShow: false,
			modalFileForm: this.$form.createForm(this),
			action: API_UPLOAD_FILE,
			fileList: [],
			myFormat: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx', 'xlsx', 'xls'],
			resultData: [], // 返回给父组件的附件数据
			beginUpload: false // 文件是否在上传中
		};
	},
	props: ['type', 'btnText', 'delivers', 'selectedRows', 'mode', 'receivalVO'],
	mounted() {
		// 切换钢材上传接口
		if (this.receivalVO && this.receivalVO.industryType == 'STEEL') {
			this.action = API_UploadSTEELAssetsFile;
		}
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
		}
	},
	methods: {
		...mapMutations({
			VUEX_MU_LOADING: 'config/VUEX_MU_LOADING'
		}),
		modalFormSubmit() {
			this.fileData = [];
			this.modalFileForm.validateFields((err, values) => {
				if (!err) {
					if (this.fileList.length == 0) {
						this.$message.error('请上传文件');
						return;
					}
					if (this.beginUpload) return; //如果有正在上传的文件 不能点击确定关闭

					if (this.type === 'UP_CONTRACT') {
						if (this.fileList.length > 1) {
							this.$message.error('只允许上传一个上游补录合同');
							return;
						}
					}

					this.fileData.push({
						uploadFiles: values.uploadFiles
					});
					this.fileList = [];
					this.modalFileWrapIsShow = false;
					this.modalFileForm.resetFields();
					this.sendToFather();
				}
			});
		},
		sendToFather() {
			let _this = this;
			// 发送父组件
			this.resultData = [];
			this.fileData.forEach(item => {
				item.uploadFiles.fileList.forEach(it => {
					const { fileName, fileUrl, md5Hex } = it.response.data;
					let obj = {};
					obj.fileType = _this.type;
					obj.fileName = fileName;
					obj.fileUrl = fileUrl;
					// obj.transferName = response.transferName
					// obj.path = response.path
					// obj.delFlag = response.delFlag
					// obj.locked = response.locked
					obj.md5Hex = md5Hex;
					// obj.ext = response.ext
					// obj.size = response.size
					// obj.id = response.id
					this.resultData.push(obj);
				});
			});
			this.$emit('uploadFiles', this.resultData, this.type, this.mode, this.selectedRows);
		},
		modalCancel() {
			this.fileList = [];
			this.modalFileWrapIsShow = false;
			this.modalFileForm.resetFields();
		},
		handlePreview(file) {
			let url = ''
			if (file.response) {
				url = file.response.result
			}
			if (file.url) {
				url = file.url
			}
			if (!url) {
				return;
			}
			this.$refs.imageViewer.showFile(url);
		},
		fileChange({ fileList, event, file }) {
			this.fileList = fileList;
			this.beginUpload = true;
			if (this.isNeedRotate) {
				this.fileList.forEach(item => {
					if (item.response) {
						this.$set(item, 'thumbUrl', item.response.result);
					}
				});
			}
			this.beginUpload = true;
			this.VUEX_MU_LOADING(true);
			if (!fileList.length) {
				this.beginUpload = false;
				this.VUEX_MU_LOADING(false);
				this.beginUpload = false;
			}
			if (fileList.length && fileList[fileList.length - 1].status == 'done') {
				this.beginUpload = false;
				this.VUEX_MU_LOADING(false);
				this.beginUpload = false;
			}
		},
		beforeUpload(file) {
			if (this.type === 'UP_CONTRACT') {
				if (this.fileList.length > 0) {
					this.$message.error('只允许上传一个上游补录合同');
					return new Promise((resolve, reject) => {
						reject();
					});
				}
			}
			const allowFormat = this.myFormat;
			let isAllowFormat = false;
			let ext = file.name.split('.')[file.name.split('.').length - 1].toLowerCase();
			if (allowFormat.indexOf(ext) == -1) {
				this.$message.error('仅支持' + allowFormat.join(',') + '的格式');
				isAllowFormat = false;
			} else {
				isAllowFormat = true;
			}

			const t = this;
			function fileTypeJudge() {
				if (
					(file.name.indexOf('.jpg') > 0 ||
						file.name.indexOf('.jpeg') > 0 ||
						file.name.indexOf('.png') > 0 ||
						file.name.indexOf('.gif') > 0 ||
						file.name.indexOf('.pdf') > 0 ||
						file.name.indexOf('.docx') > 0 ||
						file.name.indexOf('.doc') > 0 ||
						file.name.indexOf('.xls') > 0 ||
						file.name.indexOf('.xlsx') > 0 ||
						file.name.indexOf('.rar') > 0 ||
						file.name.indexOf('.zip') > 0) &&
					file.size / 1024 / 1024 > 100
				) {
					t.$message.error('⽂件过⼤，⽆法上传');
					return true;
				}
				if (file.name.indexOf('/') > 0 || file.name.indexOf('\\') > 0 || file.name.indexOf('%') > 0) {
					t.$message.error('文件名不要包含特殊符号');
					return true;
				}
			}

			let ifOverSize = fileTypeJudge();

			return new Promise((resolve, reject) => {
				if (isAllowFormat && !ifOverSize) {
					return setTimeout(() => {
						resolve(file);
					}, 1);
				} else {
					return setTimeout(() => {
						reject(file);
					}, 1);
				}
			});
		},

		addFileType() {
			this.modalFileWrapIsShow = true;
		},
		removeFile() {
			if (this.fileList.length <= 1) {
				this.fileList = [];
			}
		}
	},
	components: {
    ImageViewer
	}
};
</script>
<style lang="less">
.category-upload {
	display: inline-block;
	margin-bottom: 12px;
	margin-right: 8px;
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
.modal-file-info {
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
</style>
