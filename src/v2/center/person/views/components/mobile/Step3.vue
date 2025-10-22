<template>
	<div class="wrap">
		<div class="tips">
			<div class="tips-error-wrap">
				<p class="tips-title">您的姓名、身份证与新手机号不一致，请上传说明函（需加盖公章），平台审核通过后，可正常变更手机号</p>
			</div>
		</div>
		<a-form
			:form="form"
			style="margin-top: 20px"
			class="modal-form form-wrap"
		>
			<a-form-item
				label="说明函（需加盖公章）"
				:colon="false"
			>
				<div
					v-if="fileUrl"
					class="file-preview"
				>
					<div
						:style="imageStyle"
						class="file-icon"
					></div>
					<span
						class="file-delete-icon"
						@click="deleteFile"
					>
					</span>
				</div>
				<a-upload
					v-else
					name="file"
					:headers="headers"
					list-type="picture-card"
					class="card-uploader"
					:show-upload-list="false"
					:action="API_UPLOAD"
					:before-upload="beforeUpload"
					:file-list="fileList"
					accept=".bmp,.jpg,.png,.gif,.pdf"
					@change="handleChange"
					v-decorator="['filepath', { rules: [{ required: true, message: '说明函不能为空!' }] }]"
				>
					<div>
						<a-spin v-if="loading" />
						<img
							v-else
							:src="uploadIcon"
							alt="avatar"
							class="upload-icon"
						/>
					</div>
				</a-upload>
			</a-form-item>
		</a-form>
		<p class="desc-tips margin-top-14px">附件上传要求： 支持bmp、jpg、png、gif、pdf格式，文件大小不超过10M。</p>
		<p class="desc-tips">
			<span class="click-text" @click="handlePreview('explanationLetterExample')">示例</span>
			<span> | </span>
			<span class="click-text">
				<a download="情况说明函模板（企业员工注册）.pdf" :href="systemConfig.accountInfo.explanationLetterRegistrationTemplate">模板下载</a>
			</span>
		</p>
		<image-viewer ref="imageViewer" />
	</div>
</template>

<script>
import { API_UPLOAD } from '@/v2/api';
import { mapGetters } from 'vuex';
import { API_Store3MetaNotPass } from '@/v2/api/account';
import { filePreview } from '@/v2/utils/file';
import imageViewer from '@/v2/components/imageViewer.vue';
import systemConfig from '@/v2/config/common';

export default {
	props: {
		changeMobile: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			API_UPLOAD,
			explanationLetterExample: systemConfig.accountInfo.explanationLetterExample,
			publicPath: process.env.BASE_URL,
			formLayout: 'horizontal',
			form: this.$form.createForm(this, { name: 'mobileStep3' }),
			loading: false,
			fileUrl: '',
			uploadIcon: require('@/v2/assets/imgs/common/upload.png'),
			fileList: [],
			systemConfig
		};
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
		imageStyle() {
			const imgUrl = this.fileUrl.indexOf('.pdf') < 0 ? this.fileUrl : '~v2/assets/imgs/common/icon-pdf.png';
			if (this.fileUrl.indexOf('.pdf') < 0) {
				return {
					width: '60px',
					height: '60px',
					'background-image': `url(${imgUrl})`,
					'background-size': 'cover',
					'background-repeat': 'no-repeat',
					'background-position': 'center'
				};
			}
			return {};
		}
	},
	methods: {
		deleteFile() {
			this.fileUrl = '';
		},
		showModal() {
			this.visible = true;
		},
		submit() {
			if (!this.fileUrl) {
				this.$message.error('请上传说明函!');
				return;
			}
			this.confirmLoading = true;
			this.form.validateFields(async (err, values) => {
				if (!err) {
					await API_Store3MetaNotPass({
						filepath: this.fileUrl,
						mobile: this.changeMobile
					});
					this.$emit('submit', 'authing');
				}
			});
		},
		handleCancel() {
			this.visible = false;
		},
		handleChange(info) {
			this.fileList = info.fileList;
			if (info.file.status === 'uploading') {
				this.loading = true;
			}
			if (info.file.status === 'done') {
				this.fileList = info.fileList;
				this.fileUrl = info.file.response.result;
				this.loading = false;
			}
		},
		beforeUpload(file) {
			const isLt10M = file.size / 1024 / 1024 < 10;
			if (!isLt10M) {
				this.$message.error('文件大小不能超过10M!');
			}
			return isLt10M;
		},
		handlePreview(type) {
			filePreview(this[type], this.$refs.imageViewer.show, true);
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/tips-wrap.less');
@import url('~@/v2/style/form-reset.less');
</style>
<style lang="less" scoped>
.wrap {
	width: 740px;
}
.tips {
	width: 740px;
	height: 40px;
	margin-top: 40px;
	overflow: hidden;
}
.tips-error-wrap {
	width: 740px;
	min-height: 40px;
	height: 40px;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	justify-content: center;
	padding-left: 40px;
	box-sizing: border-box;
}
.tips-title {
	width: 100%;
	color: rgba(0, 0, 0, 0.8);
	font-size: 14px;
	line-height: 20px;
	letter-spacing: 0;
}
.upload-icon {
	width: 32px;
	height: 32px;
}
.click-text {
	font-size: 12px;
	color:@primary-color;
	cursor: pointer;
	line-height: 20px;
}
.file-preview {
	width: 74px;
	height: 74px;
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: center;
	position: relative;
	.file-delete-icon {
		width: 14px;
		height: 14px;
		background-image: url('~v2/assets/imgs/common/file-delete.png');
		background-size: 14px 14px;
		position: absolute;
		top: 0;
		right: 7px;
		cursor: pointer;
	}
	.file-icon {
		width: 60px;
		height: 60px;
		background-image: url('~v2/assets/imgs/common/icon-pdf.png');
		background-size: 32px 32px;
		background-position: center;
		background-repeat: no-repeat;
		box-sizing: border-box;
		border: 1px solid rgba(229, 230, 235, 1);
		background-color: rgba(243, 245, 246, 1);
		border-radius: 4px;
	}
}
.margin-top-14px {
	margin-top: 14px;
}
.form-wrap {
	width: 415px;
	margin: 0 auto;
	.ant-form-item {
		margin-bottom: 13px;
	}
}
.desc-tips {
	width: 415px;
	margin: 0 auto;
	font-size: 12px;
	line-height: 20px;
	color: rgba(0, 0, 0, 0.4);
}
</style>