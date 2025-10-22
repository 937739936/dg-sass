<template>
	<a-modal
		class="modal-wrap"
		title="上传说明函"
		:visible="visible"
		width="520px"
		:confirm-loading="confirmLoading"
		@ok="handleOk"
		@cancel="handleCancel"
		destroyOnClose
		:maskClosable="false"
	>
		<div class="content">
			<div class="tips-error-wrap">法人手机号与姓名、身份证号不匹配，请上传说明函（需加盖公章）</div>
			<a-form
				:form="form"
				style="margin-top: 20px"
				class="modal-form"
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
							@click="handlePreviewUpload"
							class="file-icon"
						>
							<img :src="imageStyle"/>
						</div>
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
						v-decorator="['threeMetaCheckErrorExplainFilepath', { rules: [{ required: true, message: '说明函不能为空!' }] }]"
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
			<p class="tips margin-top-14px">附件上传要求： 支持bmp、jpg、png、gif、pdf格式，文件大小不超过10M。</p>
			<p class="tips">
				<span class="click-text" @click="handlePreview('explanationLetterExample')">
					示例
				</span>
				<span> | </span>
				<a class="click-text" :href="templateDownloadPath" download="情况说明函模板（企业员工注册）.pdf">
					模板下载
				</a>
			</p>
		</div>
		<image-viewer ref="imageViewer" />
	</a-modal>
</template>
<script>
import { API_UPLOAD } from '@/v2/api';
import { mapGetters } from 'vuex';
import { down } from '@/v2/utils/factory';
import { filePreview } from '@/v2/utils/file';
import imageViewer from '@/v2/components/imageViewer.vue';
import systemConfig from '@/v2/config/common';

export default {
	props: {
		clickConfirm: {
			type: Function,
			default: () => {}
		}
	},
	data() {
		return {
			down,
			explanationLetterExample: systemConfig.accountInfo.explanationLetterExample,
			API_UPLOAD,
			visible: false,
			confirmLoading: false,
			form: this.$form.createForm(this, { name: 'coordinated' }),
			loading: false,
			fileUrl: '',
			uploadIcon: require('@/v2/assets/imgs/common/upload.png'),
			fileList: [],
			templateExamplePath: '/files/account/' + '情况说明函示例（企业员工注册）.pdf',
			templateDownloadPath: systemConfig.accountInfo.explanationLetterRegistrationTemplate
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
			const imgUrl = this.fileUrl.indexOf('.pdf') < 0 ? this.fileUrl : require('@/v2/assets/imgs/common/icon-pdf.png');
			if (this.fileUrl.indexOf('.pdf') < 0) {
				return imgUrl;
			}
      return imgUrl;
		}
	},
	methods: {
		async handlePreviewUpload() {
			filePreview(this.fileUrl, this.$refs.imageViewer.show);
    },
		deleteFile() {
			this.fileUrl = '';
		},
		showModal() {
			this.visible = true;
		},
		handleOk() {
			if (!this.fileUrl) {
				this.$message.error('请上传说明函!');
				return;
			}
			this.form.validateFields((err, values) => {
				if (!err) {
					this.clickConfirm && this.clickConfirm({
						threeMetaCheckErrorExplainFilepath: this.fileUrl
					});
				}
			});
		},
		handleCancel() {
			this.visible = false;
			this.fileList = [];
			this.loading = false;
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
@import url('~@/v2/style/modal.less');
@import url('~@/v2/style/tips-wrap.less');
@import url('~@/v2/style/card-upload.less');
@import url('~@/v2/style/modal-form.less');
</style>
<style lang="less" scoped>
.content {
	padding: 20px 20px 30px;
	box-sizing: border-box;
}
.upload-icon {
	width: 32px;
	height: 32px;
}
.tips {
	font-size: 12px;
	line-height: 20px;
	color: rgba(0, 0, 0, 0.4);
}
.click-text {
	font-size: 12px;
	color: @primary-color;
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
		cursor: pointer;
		overflow: hidden;
		img {
			width: 100%;
			height: 100%;
			object-fit: contain;
			background-color: #fff;
		}
	}
}
.margin-top-14px {
  margin-top: 14px;
}
.desc-tips {
	width: 415px;
}
</style>