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
					:label-col="{
						span: 4
					}"
					:wrapper-col="{
						span: 20
					}"
				>
					<a-row class="row">
						<a-col :span="24">
							<a-form-item
								label="附件类型"
								:colon="false"
							>
								<a-input
									v-bind:value="uploadText || CONSTANTS.fileType[type]"
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
									:fileList="fileList"
									@preview="handlePreview"
									@change="fileChange"
									name="file"
									:remove="removeFile"
								>
									<template v-if="this.styleType === 'new'">
										<div v-if="!fileList.length">
											<i class="file_icon"></i>
											<div class="upload-text">上传附件</div>
											<div class="upload-tips">
												<template v-if="this.type === 'TERMINAL_CONTRACT'">
													<p>
														当前附件类型您只能上传一份PDF文件或者多张图片（支持图片格式：jpg，jpeg，png，bmp）。 <br />
														单个附件大小不得超过100M。<br />
														请上传已签章合同，且确保合同文件与录入信息一致，避免出现与本合同无关的信息。
													</p>
												</template>
												<template v-else>
													<p>支持上传格式为jpg，jpeg，png，pdf，bmp的附件，单个附件大小不得超过100M。</p>
												</template>
											</div>
										</div>
									</template>
									<template v-else>
										<div v-if="fileList.length < 100">
											<i
												class="file_icon"
												style="display: inlin-block; margin: 20px auto"
											></i>
											<div
												class="ant-upload-text"
												style="text-align: center; margin: 20px 0"
											>
												点击选择
											</div>
										</div>
									</template>
								</a-upload>
							</a-form-item>
							<div
								class="file-notice"
								v-if="this.styleType !== 'new'"
							>
								<p>附件上传要求：</p>
								<!--火运文案固定-->
								<template v-if="transType === 'TRAIN'">
									<p>
										1. 仅支持上传一列火车的附件材料。 <br />
										2. 铁路大票必须是pdf或者图片（jpg、jpeg、png、ofd），且文件中须包含发运列次所有运单号。<br />
										3. 车号表与其他凭证可支持格式为：png，jpeg，jpg，gif，pdf，doc，docx，xlsx，xls。 <br />
										4. 单个附件大小不得超过100M。 <br />
									</p>
								</template>
								<template v-else>
									<p>可支持格式为{{ myFormat.join('，') }}的附件，单个附件大小不得超过100M的文件。</p>
								</template>
							</div>
						</a-col>
					</a-row>
				</a-form>
			</a-modal>
			<ImageViewer ref="imageViewer" />
		</div>
	</div>
</template>
<script>
import { API_UPLOAD_WATER_MARk } from '@/v2/api/upload';
import { API_UploadSTEELAssetsFile } from '@/v2/center/assets/api/index.js';
import ImageViewer from '@sub/components/viewer/image.vue';
import { mapGetters, mapMutations } from 'vuex';
const defaultFormat = ['png', 'jpeg', 'jpg', 'gif', 'pdf', 'doc', 'docx', 'xlsx', 'xls', 'rar', 'zip'];

export default {
	name: 'Upload',
	components: {
		ImageViewer
	},
	data() {
		return {
			fileData: [],
			modalFileWrapIsShow: false,
			modalFileForm: this.$form.createForm(this),
			action: API_UPLOAD_WATER_MARk,
			fileList: [],
			myFormat: defaultFormat,
			resultData: [], // 返回给父组件的附件数据
			beginUpload: false // 文件是否在上传中
		};
	},
	props: ['type', 'btnText', 'selectedRows', 'mode', 'receivalVO', 'allowFormat', 'transType', 'uploadText', 'styleType'], // styleType=new使用新的附件上传样式
	mounted() {
		// 切换钢材上传接口
		if (
			this.receivalVO &&
			this.receivalVO.industryType == 'STEEL' &&
			this.btnText !== '上游发票明细表' &&
			this.btnText !== '上传质量证明书'
		) {
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
					this.fileData.push({
						uploadFiles: values.uploadFiles
					});
					let _this = this;
					this.resultData = [];
					this.fileData.forEach(item => {
						item.uploadFiles.fileList.forEach(it => {
							let response = it.response.data[0] ? it.response.data[0] : it.response.data;
							let obj = {};
							obj.type = response.type || _this.type;
							obj.name = it.name;
							obj.path = response.path || response.fileUrl;
							obj.delFlag = response.delFlag || 0;
							obj.locked = response.locked;
							obj.md5Hex = response.md5Hex;
							obj.ext = response.ext;
							obj.size = response.size;
							obj.attachId = response.id;
							this.resultData.push(obj);
						});
					});
					if (this.type === 'TERMINAL_CONTRACT') {
						if (!this.getUploadFilesJudge(this.resultData, this.type)) return;
					}
					this.fileList = [];
					this.modalFileWrapIsShow = false;
					this.modalFileForm.resetFields();
					this.sendToFather();
				}
			});
		},
		//附件上传判断是否符合规范
		getUploadFilesJudge(data, type) {
			//如果附件类型是线下合同,补充协议只能一个pdf或多张图片
			let data1 = data.filter(item => {
				return item.type == type;
			});
			if (
				data1.length > 1 &&
				data1.some(item => {
					let ext = item.path.substr(item.path.lastIndexOf('.') + 1);
					return ['pdf'].indexOf(ext.toLowerCase()) !== -1;
				})
			) {
				this.$message.error('您只能上传一份pdf或多张图片，请合并后上传');
				return false;
			} else {
				return true;
			}
		},
		sendToFather() {
			// 发送父组件
			this.$emit('uploadFiles', this.resultData, this.type, this.mode, this.selectedRows);
		},
		modalCancel() {
			this.fileList = [];
			this.modalFileWrapIsShow = false;
			this.modalFileForm.resetFields();
		},
		handlePreviewCancel() {
			this.previewVisible = false;
		},
		handlePreview(file) {
			// 添加与修改时返回格式不同
			if (file?.response?.data) {
				let data = file?.response?.data;
				let { fileUrl, path } = data;
				this.$refs.imageViewer.showFile(fileUrl || path);
				return;
			}
			if (file.url) {
				this.$refs.imageViewer.showFile(file.url);
			}
		},
		fileChange({ fileList, event, file }) {
			this.fileList = fileList;
			this.beginUpload = true;
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
			let allowFormat = this.myFormat;
			// 火运发货附件要求
			if (this.transType == 'TRAIN') {
				if (this.type == 'DELIVER_BIG_TICKET' || this.type == 'MANUAL_DELIVER_BIG_TICKET') {
					// 铁路大票
					allowFormat = ['pdf', 'jpg', 'jpeg', 'png', 'ofd'];
				} else {
					// 车号票、其他凭证
					allowFormat = ['png', 'jpeg', 'jpg', 'gif', 'pdf', 'doc', 'docx', 'xlsx', 'xls'];
				}
			}
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
		checkFormatType() {
			if (this.allowFormat) {
				this.myFormat = this.allowFormat;
			} else {
				this.myFormat = defaultFormat;
			}

			// 山西银行
			if (
				this.type === 'TERMINAL_CONTRACT' ||
				this.type === 'TERMINAL_CONTRACT_BID_PROOF' ||
				(this.receivalVO?.paymentType === 'product-shanxi-bank' && !this.btnText.includes('核算表'))
			) {
				this.myFormat = ['png', 'jpeg', 'jpg', 'bmp', 'pdf'];
			}
		},
		addFileType() {
			this.checkFormatType();

			if ((this.mode == 'transport' || this.mode == 'transfer') && this.selectedRows.length == 0) {
				//  运输凭证模块下
				this.$message.error('批次号不能为空');
			} else if (
				(this.mode == 'quality1' || this.mode == 'quality2' || this.mode == 'quality3') &&
				this.selectedRows.length == 0
			) {
				// 数质量凭证模块下附件上传时要选批次
				this.$message.error('收货编号不能为空');
			} else {
				this.modalFileWrapIsShow = true;
			}
		},
		removeFile() {
			if (this.fileList.length <= 1) {
				this.fileList = [];
			}
		}
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
.modal-file-info {
	width: 560px !important;
	.ant-modal {
		width: 560px !important;
		.ant-modal-body {
			padding: 10px 30px 0 30px;
			.ant-form-item {
				width: 100%;
				margin-right: 30px;
			}
			.ant-upload-select {
				background: hsla(224, 58%, 96%, 1);
				border: 1px dashed hsla(224, 23%, 84%, 1);
				cursor: pointer;
				.upload-text {
					text-align: center;
				}
				width: 100%;
				padding: 10px 0;
				.upload-tips {
					width: 306px;
					margin: 20px auto 0;
					color: hsla(213, 18%, 59%, 1);
					font-size: 12px;
					text-align: left;
				}
				.file_icon {
					margin: 0 auto;
					display: block;
					background: url('~@/v2/assets/imgs/upload/file_add.png') no-repeat center center;
					width: 20px;
					height: 22px;
					margin-bottom: 10px;
				}
			}
			.ant-upload-list {
				width: 100%;
				.ant-upload-list-item-name,
				.anticon-delete {
					color: @primary-color;
					cursor: pointer;
				}
			}
			.upload-text {
				text-align: center;
			}
		}
	}
}
.modalFileForm {
	.ant-form-item {
		margin-bottom: 25px;
	}
	::v-deep.ant-form-item-label {
		padding-bottom: 0;
	}
	.marginBottom0 {
		margin-bottom: 0;
	}
	.ant-checkbox-wrapper {
		width: 33%;
		margin: 0;
		margin-top: 3px;
		margin-bottom: 10px;
	}
	.ant-form-item-with-help {
		margin-bottom: 5px;
	}
}
</style>
