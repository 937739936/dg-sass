<template>
	<div class="slMain">
		<div class="slTitleAssis">上传材料</div>
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
								:defaultFileList="fileListauthLicenseImg"
								v-decorator="['adminAuthFilepath', { rules: [{ required: true, message: '请上传委托授权书' }] }]"
								:showDesc="false"
								:size="100"
							>
								<div class="card-image"></div>
							</i-upload>
						</a-form-item>
						<div class="upload-desc">
							<div>
								<span
									class="text-decoration cursor-pointer"
									@click="handlePreview('authLicenseImgExampleGly')"
									>查看示例</span
								>
								<span
									class="text-decoration cursor-pointer"
									style="margin-left: 30px"
									@click.stop="downManagerAuth()"
									>下载模板</span
								>
							</div>
							<div>支持bmp、jpg、png、pdf等格式，文件大小不超过100M（需加盖公章）</div>
						</div>
					</div>
				</a-row>
			</a-form>
		</div>
		<image-viewer ref="imageViewer" />
	</div>
</template>

<script>
import { API_COMPANYADMINMODIFYDOWNLOADADMINAPPLYTEMPLATE } from '@/v2/api/account';
import { API_UPLOAD } from '@/v2/center/person/api';
import { down } from '@/v2/utils/factory';
import iUpload from '@/v2/components/upload.vue';
import systemConfig from '@/v2/config/common';
import imageViewer from '@/v2/components/imageViewer.vue';
import { filePreview } from '@/v2/utils/file';
import moment from 'moment';

export default {
	props: {
		formValues: {
			type: Object,
			default() {
				return {};
			}
		}
	},
	data() {
		return {
			accept: '.bmp,.jpg,.png,.gif,.pdf',
			fileListauthLicenseImg: [],
			fileListauthWayLicenseImg: [],
			action: API_UPLOAD,
			form: this.$form.createForm(this, { name: 'otherFormFile' }),
			authLicenseImgExample: systemConfig.accountInfo.authLicenseImgExample,
			authLicenseImgExampleGly: systemConfig.accountInfo.authLicenseImgExampleGly,
			licence: systemConfig.accountInfo.licence
		};
	},
	components: {
		iUpload,
		imageViewer
	},
	methods: {
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
		// 下载授权书
		downManagerAuth() {
			if (!this.formValues.adminAuthValidTimeStartNew) {
				this.$message.error('请选择管理员授权期限');
				return;
			}
			if (this.formValues.adminAuthValidTimeStartNew) {
				this.$message.loading('下载中...');
				API_COMPANYADMINMODIFYDOWNLOADADMINAPPLYTEMPLATE({
					...this.formValues,
					adminAuthValidTimeStart: moment(this.formValues.adminAuthValidTimeStartNew).format('YYYY-MM-DD'),
					adminAuthValidTimeEnd: moment(this.formValues.adminAuthValidTimeEndNew).format('YYYY-MM-DD'),
					adminName: this.formValues.name
				}).then(res => {
					this.$message.success('下载成功');
					down(`data:application/pdf;base64,${res}`, '管理员授权期限变更申请书.pdf');
				}).finally(() => {
					this.$message.destroy();
				});
			}
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
	background-image: url('~@/v2/assets/imgs/person/power-of-attorney.png');
	background-size: contain;
}
.licence-card {
	width: 192px;
	height: 112px;
	background-image: url('~@/v2/assets/imgs/person/licence-card.png');
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