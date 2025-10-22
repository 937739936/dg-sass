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
								:defaultFileList="fileListattachment"
								v-decorator="['attachment', { rules: [{ required: true, message: '请上传管理员变更申请书' }] }]"
								:showDesc="false"
							>
								<div class="card-image"></div>
							</i-upload>
						</a-form-item>
						<div class="upload-desc">
							<div>
								<span
									class="text-decoration cursor-pointer"
									@click="handlePreview('changeAdminImg')"
									>查看示例</span
								>
								<span
									class="text-decoration cursor-pointer"
									style="margin-left: 30px"
									@click.stop="downloadTemplate('attachment', '管理员变更申请书')"
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
								:defaultFileList="fileListadminCardImg"
								v-decorator="['adminCardImg', { rules: [{ required: true, message: '请上传新的管理员身份证' }] }]"
								:showDesc="false"
							>
								<div class="licence-card"></div>
							</i-upload>
						</a-form-item>
						<div class="upload-desc">
							<div>
								<span
									class="text-decoration cursor-pointer"
									@click="handlePreview('changeAdminCardImg')"
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
import imageViewer from '@/v2/components/imageViewer.vue';
import { filePreview } from '@/v2/utils/file';
import moment from 'moment';
import systemConfig from '@/v2/config/common';

export default {
	props: ['formValues'],
	data() {
		return {
			accept: '.bmp,.jpg,.png,.gif,.pdf',
			fileListattachment: [],
			fileListadminCardImg: [],
			action: API_UPLOAD,
			form: this.$form.createForm(this, { name: 'otherFormFile' }),
			changeAdminImg: systemConfig.accountInfo.changeAdminImg,
			changeAdminCardImg: systemConfig.accountInfo.changeAdminCardImg,
			licence: systemConfig.accountInfo.licence,
			systemConfig
		};
	},
	components: {
		iUpload,
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
		downloadTemplate() {
			if (!this.formValues.newAdminIds) {
				this.$message.error('请先选择管理员');
				return;
			}
			if (!this.formValues.adminAuthValidTimeStart) {
				this.$message.error('请选择管理员授权期限');
				return;
			}
			if (this.formValues.newAdminIds && this.formValues.adminName && this.formValues.idcard) {
				this.$message.loading('下载中...');
				API_COMPANYADMINMODIFYDOWNLOADADMINAPPLYTEMPLATE({
					...this.formValues,
					mobile: this.formValues.adminMobile,
					idCard: this.formValues.idcard,
					adminAuthValidTimeStart: moment(this.formValues.adminAuthValidTimeStart).format('YYYY-MM-DD'),
					adminAuthValidTimeEnd: moment(this.formValues.adminAuthValidTimeEnd).format('YYYY-MM-DD'),
				}).then(res => {
					this.$message.success('下载成功');
					down(`data:application/pdf;base64,${res}`, '管理员变更申请书.pdf');
				}).finally(() => {
					this.$message.destroy();
				});
			}
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
	},
	mounted() {}
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
	background-image: url('~@/v2/assets/imgs/person/admin-apply.png');
	background-size: contain;
}
.licence-card {
	width: 192px;
	height: 112px;
	background-image: url('~@/v2/assets/imgs/person/admin-new-card.png');
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