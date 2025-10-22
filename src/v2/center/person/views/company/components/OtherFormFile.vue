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
								:defaultFileList="fileListauthLicenseImg"
								v-decorator="['authLicenseImg', { rules: [{ required: true, message: '请上传企业管理员授权书' }] }]"
								:showDesc="false"
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
				<a-row
					type="flex"
					style="margin-top: 20px"
					v-if="$route.query.type == 'LOGISTICS'"
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
								:defaultFileList="fileListauthWayLicenseImg"
								v-decorator="['franchiseLicenseImg', { rules: [{ required: true, message: '请上传道路运输经营许可证' }] }]"
								:showDesc="false"
							>
								<div class="licence-card"></div>
							</i-upload>
						</a-form-item>
						<div class="upload-desc">
							<div>
								<span
									class="text-decoration cursor-pointer"
									@click="handlePreview('licence')"
									>查看示例</span
								>
								<!-- <span
									class="text-decoration cursor-pointer"
									style="margin-left: 30px"
									>下载模板</span
								> -->
							</div>
							<div>支持bmp、jpg、png、pdf等格式，文件大小不超过100M（需加盖公章）</div>
						</div>
					</div>
				</a-row>
				<a-row>
					<div class="grid-line"></div>
				</a-row>
				<a-row>
					<a-form-item>
						<a-checkbox
							v-decorator="['agree', { rules: [{ required: true, message: '请阅读并勾选同意《'+systemConfig.name+'企业认证服务协议》' }] }]"
						>
							我方已认真阅读并同意遵守
							<a-button
								type="link"
								style="padding: 0"
								@click="$refs.agreeModal.showModal('companyCertification')"
								>《{{ systemConfig.name }}企业认证服务协议》</a-button
							>
						</a-checkbox>
					</a-form-item>
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
import { API_COMPANYAUTHDOWNLOADADMINLICENSETEMPLATE } from '@/v2/api/account';
import { API_UPLOAD } from '@/v2/center/person/api';
import { down } from '@/v2/utils/factory';
import iUpload from '@/v2/components/upload.vue';
import AgreeModal from '@/v2/components/modal/index.vue';
import imageViewer from '@/v2/components/imageViewer.vue';
import { filePreview } from '@/v2/utils/file';
import moment from 'moment';
import systemConfig from '@/v2/config/common';

export default {
	props: {
		fileListauthLicenseImg: {
			type: Array,
			default: () => []
		},
		fileListauthWayLicenseImg: {
			type: Array,
			default: () => []
		},
		baseInfoFormValues: {
			type: Object,
			default: () => ({})
		},
		agentInfoFormValues: {
			type: Object,
			default: () => ({})
		},
		legalInfoFormValues: {
			type: Object,
			default: () => ({})
		}
	},
	data() {
		return {
			accept: '.bmp,.jpg,.png,.gif,.pdf',
			action: API_UPLOAD,
			form: this.$form.createForm(this, { name: 'otherFormFile' }),
			authLicenseImgExampleGly: systemConfig.accountInfo.authLicenseImgExampleGly,
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
					if (values.agree === false) {
						this.$message.error(`请阅读并勾选同意《${systemConfig.name}企业认证服务协议》`);
						return;
					}
					if (!errors) {
						resolve(values);
					}
					reject(errors);
				});
			});
		},
		// 下载授权书
		downManagerAuth() {
			if (['TERMINAL', 'COAL_MINE', 'SUPERVISING'].includes(this.$route.query.type)) {
				down(this.systemConfig.accountInfo.authorizationLetter, '授权委托书');
			} else {
				this.isSave = true;
				const adminAuthValidTimeStart = this.baseInfoFormValues.agentIsLegalPerson ? this.legalInfoFormValues.adminAuthValidTimeStart : this.agentInfoFormValues.adminAuthValidTimeStart;
				const adminAuthValidTimeEnd = this.baseInfoFormValues.agentIsLegalPerson ? this.legalInfoFormValues.adminAuthValidTimeEnd : this.agentInfoFormValues.adminAuthValidTimeEnd;
				if (!adminAuthValidTimeStart) {
					this.$message.error('请选择授权有效期');
					return;
				}
				this.$message.loading('下载中...');
				API_COMPANYAUTHDOWNLOADADMINLICENSETEMPLATE({
					adminAuthValidTimeStart: moment(adminAuthValidTimeStart).format('YYYY-MM-DD'),
					adminAuthValidTimeEnd: moment(adminAuthValidTimeEnd).format('YYYY-MM-DD')
				})
					.then(res => {
						down(`data:application/pdf;base64,${res}`, '企业管理员授权书.pdf');
					})
					.finally(() => {
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
	background-image: url('~@/v2/assets/imgs/person/auth-card.png');
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