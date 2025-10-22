<template>
	<div class="slMain">
		<div class="slTitleAssis">其他附件</div>
		<div class="form-wrap">
			<a-form
				:form="form"
				formLayout="vertical"
			>
				<a-row type="flex">
					<div class="file-upload-wrap">
						<a-form-item label="">
							<i-upload
								list-type="picture-card"
								:accept="accept"
								:action="action"
								:showUploadList="true"
								:limit="true"
								:size="100"
								:defaultFileList="fileListmodifyLicenseImg"
								v-decorator="['modifyLicenseImg', { rules: [{ required: true, message: '请上传工商变更证明' }] }]"
								:showDesc="false"
							>
								<div class="card-image"></div>
							</i-upload>
						</a-form-item>
						<div class="upload-desc">
							<div>
								<span
									class="text-decoration cursor-pointer"
									@click="handlePreview('bizLicenseImgExample')"
									>查看示例</span
								>
							</div>
							<div>支持bmp、jpg、png、pdf等格式，文件大小不超过100M（需加盖公章）</div>
						</div>
					</div>
				</a-row>
				<a-row
					type="flex"
					style="margin-top: 20px"
				>
					<div class="file-upload-wrap">
						<a-form-item label="">
							<i-upload
								list-type="picture-card"
								:accept="accept"
								:action="action"
								:showUploadList="true"
								:limit="true"
								:size="100"
								:defaultFileList="fileListmodifyApplyImg"
								v-decorator="['modifyApplyImg', { rules: [{ required: true, message: '请上传《企业信息变更申请表》' }] }]"
								:showDesc="false"
							>
								<div class="licence-card"></div>
							</i-upload>
						</a-form-item>
						<div class="upload-desc">
							<div>
								<span
									class="text-decoration cursor-pointer"
									@click="handlePreview('modifyApplyImgExample')"
									>查看示例</span
								>
								<span
									class="text-decoration cursor-pointer"
									style="margin-left: 30px"
									@click="downloadTemplate"
									>下载模板</span
								>
							</div>
							<div>支持bmp、jpg、png、pdf等格式，文件大小不超过100M（需加盖公章）</div>
						</div>
					</div>
				</a-row>
			</a-form>
		</div>
		<agree-modal
			ref="agreeModal"
			:fileType="'USER_AGREEMENT'"
		></agree-modal>
		<image-viewer ref="imageViewer" />
	</div>
</template>

<script>
import { API_UPLOAD } from '@/v2/center/person/api';
import iUpload from '@/v2/components/upload.vue';
import AgreeModal from '@/v2/components/modal/AgreementModal.vue';
import imageViewer from '@/v2/components/imageViewer.vue';
import { filePreview } from '@/v2/utils/file';
import systemConfig from '@/v2/config/common';

export default {
	props: {
		fileListmodifyLicenseImg: {
			type: Array,
			default: () => []
		},
		fileListmodifyApplyImg: {
			type: Array,
			default: () => []
		},
		downloadTemplate: {
			type: Function,
			default: () => {}
		}
	},
	data() {
		return {
			accept: '.bmp,.jpg,.png,.gif,.pdf',
			action: API_UPLOAD,
			form: this.$form.createForm(this, { name: 'otherFormFile' }),
			bizLicenseImgExample: systemConfig.accountInfo.bizLicenseImgExample,
			modifyApplyImgExample: systemConfig.accountInfo.modifyApplyImgExample,
			licence: systemConfig.accountInfo.licence,
			systemConfig
		};
	},
	components: {
		iUpload,
		AgreeModal,
		imageViewer
	},
	methods: {
		initFieldsValue(values) {
			this.form.setFieldsValue({
				...values
			});
		},
		getFormValues() {
			return this.form.getFieldsValue();
		},
		submit() {
			return new Promise((resolve, reject) => {
				this.form.validateFieldsAndScroll((errors, values) => {
					if (!errors) {
						resolve(values);
					}
					reject(errors);
				});
			});
		},
		handlePreview(type) {
			filePreview(this[type], this.$refs.imageViewer.show, true);
		}
	}
};
</script>

<style lang="less" scoped>
.slMain {
	background: #fff;
	padding: 0 30px;
	padding-bottom: 50px;
	box-sizing: border-box;
	/deep/ .ant-form-explain {
		margin-top: 4px;
	}
}
.file-upload-wrap {
	width: 100%;
	height: 112px;
	display: flex;

	/deep/.upload-file-box {
		height: 112px;
		.ant-upload-select-picture-card {
			margin: 0;
			border: none;
		}

		.ant-upload {
			padding: 0;
		}
		.ant-upload-list-picture-card-container {
			width: 192px;
			height: 112px;
			margin: 0;
		}
		.ant-upload-list-item-list-type-picture-card {
			width: 192px;
			height: 112px;
			margin: 0;
		}
		.ant-upload-list-item-thumbnail img {
			object-fit: contain;
		}
	}
}

.card-image {
	width: 192px;
	height: 112px;
	background-image: url('~@/v2/assets/imgs/person/modify-business-certificate.png');
	background-size: contain;
}
.licence-card {
	width: 192px;
	height: 112px;
	background-image: url('~@/v2/assets/imgs/person/modify-company-info.png');
	background-size: contain;
}

.upload-desc {
	margin-left: 20px;
	font-size: 14px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	div {
		height: 20px;
		line-height: 20px;
	}

	color: rgba(0, 0, 0, 0.4);

	div:nth-child(2) {
		margin-top: 9px;
	}
}
.form-wrap {
	margin-top: 30px;
}
.grid-line {
	width: 100%;
	height: 1px;
	background: rgba(229, 230, 235, 1);
	margin: 30px 0;
}
</style>