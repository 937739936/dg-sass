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
					class="modalFileForm"
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
								style="margin-bottom: 0"
							>
								<a-input
									v-model="CONSTANTS.fileType[type]"
									disabled
									style="width: 200px; margin-bottom: 15px"
								></a-input>
							</a-form-item>
						</a-col>
						<a-col :span="24">
							<a-form-item
								label="变更项"
								:colon="false"
							>
								<a-checkbox-group
									v-decorator="[
										'changeItem',
										{
											rules: [{ required: true, message: '变更项必填' }]
										}
									]"
								>
									<a-checkbox
										v-for="(item, index) in changeItemEnums"
										:key="item.value"
										:class="index > 6 ? 'marginBottom0' : ''"
										:value="item.value"
									>
										{{ item.text }}
									</a-checkbox>
								</a-checkbox-group>
							</a-form-item>
						</a-col>
						<a-col :span="24">
							<a-form-item
								label="执行期"
								:colon="false"
							>
								<a-date-picker
									style="width: 45%"
									placeholder="开始时间"
									valueFormat="YYYY-MM-DD"
									:disabled-date="disabledExecutionDateStart"
									v-decorator="[
										`executionDateStart`,
										{
											rules: [{ required: true, message: `执行期开始时间必填` }]
										}
									]"
								>
								</a-date-picker>
								～
								<a-date-picker
									style="width: 45%"
									placeholder="结束时间"
									valueFormat="YYYY-MM-DD"
									:disabled-date="disabledExecutionDateEnd"
									v-decorator="[`executionDateEnd`]"
								>
								</a-date-picker>
							</a-form-item>
						</a-col>
						<a-col :span="24">
							<a-form-item
								label="签章状态"
								:colon="false"
							>
								<a-radio-group
									v-decorator="[
										'signStatus',
										{
											rules: [{ required: true, message: '签章状态必填' }]
										}
									]"
								>
									<a-radio value="1">单签</a-radio>
									<a-radio value="2">双签</a-radio>
								</a-radio-group>
							</a-form-item>
						</a-col>
						<a-col :span="24">
							<a-form-item
								label="签订日期"
								:colon="false"
							>
								<a-date-picker
									style="width: 100%"
									placeholder="请选择签订日期"
									:allowClear="false"
									valueFormat="YYYY-MM-DD"
									v-decorator="[
										`signDate`,
										{
											rules: [{ required: true, message: `签订日期必填` }]
										}
									]"
								>
								</a-date-picker>
							</a-form-item>
						</a-col>
						<a-col :span="24">
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
									<div v-if="!fileList.length">
										<i class="file_icon"></i>
										<div class="upload-text">上传附件</div>
										<div class="upload-tips">
											<p>
												当前附件类型您只能上传一份PDF文件或者多张图片（支持图片格式：jpg，jpeg，png，bmp）。 <br />
												单个附件大小不得超过100M。<br />
												请上传已签章合同，且确保合同文件与录入信息一致，避免出现与本合同无关的信息。
											</p>
										</div>
									</div>
								</a-upload>
							</a-form-item>
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
import { filterCodeByKey } from '@sub/utils/globalCode.js';
import moment from 'moment';
import ImageViewer from '@sub/components/viewer/image.vue';
export default {
	name: 'SupplementUpload',
	data() {
		return {
			fileData: [],
			modalFileWrapIsShow: false,
			modalFileForm: this.$form.createForm(this),
			action: API_UPLOAD_FILE,
			fileList: [],
			myFormat: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx', 'xlsx', 'xls'],
			resultData: [], // 返回给父组件的附件数据
			beginUpload: false, // 文件是否在上传中
			changeItemEnums: filterCodeByKey('changeItemEnums') // 补充协议变更项
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

					let obj = {
						key: this.type,
						type: this.type,
						typeName: this.CONSTANTS.fileType[this.type],
						dataSource: 1, // 来源，（1-交易上传；2-OA回传， 3-资产审核上传）
						uploadTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
						changeItem: values.changeItem.join(','),
						executionDateStart: moment(values.executionDateStart).format('YYYY-MM-DD'),
						executionDateEnd: values.executionDateEnd
							? moment(values.executionDateEnd).format('YYYY-MM-DD')
							: values.executionDateEnd,
						signStatus: values.signStatus,
						signDate: values.signDate,
						supplementalFile: [],
						uploadFiles: values.uploadFiles
					};
					this.fileData.push(obj);
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
					let pro = {};
					pro.fileType = _this.type;
					(pro.attachId = ''),
						(pro.name = fileName),
						(pro.url = fileUrl),
						(pro.md5Hex = md5Hex),
						(pro.type = _this.type),
						(pro.typeName = _this.CONSTANTS.fileType[_this.type]),
						(pro.ext = it.type),
						item.supplementalFile.push(pro);
				});
			});
			this.resultData = this.fileData;
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
		},

		disabledExecutionDateStart(current) {
			// 执行期开始时间小于结束时间
			return moment(current).format('YYYY-MM-DD') >= this.modalFileForm.getFieldValue('executionDateEnd');
		},
		disabledExecutionDateEnd(current) {
			// 执行期结束时间大于结束时间
			return moment(current).format('YYYY-MM-DD') <= this.modalFileForm.getFieldValue('executionDateStart');
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
