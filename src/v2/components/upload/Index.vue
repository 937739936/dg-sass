<template>
	<a-row>
		<a-form-item
			v-if="value && !drag"
			:label="label"
			:label-col="{
				span: 10,
				offset: 3
			}"
			:wrapper-col="{
				span: 9
			}"
		>
			<a-col span="16">
				<a-upload
					class="uploader"
					:beforeUpload="beforeUpload"
					:fileList="fileList"
					@preview="handlePreview2"
					v-decorator="[
						`${value}`,
						{
							rules: [{ required: isRequire, message: `${label}必填` }]
						}
					]"
					:headers="headers"
					:action="action"
					name="file"
					@change="handleChange"
				>
					<a-button> <a-icon type="upload" />上传文件 </a-button>
				</a-upload>
			</a-col>
			<a-col span="8">
				<a
					href="javascript:;"
					style="margin-left: 15px"
					v-if="isHasTemplate"
					@click="showDemoImg"
				>
					<span>样本</span>
					<viewer
						:images="[img]"
						ref="viewer"
						@inited="
							viewer => {
								$viewer = viewer;
							}
						"
					>
						<img
							:src="img"
							style="display: none"
						/>
					</viewer>
				</a>
			</a-col>
		</a-form-item>
		<a-form-item v-else>
			<a-upload-dragger
				:beforeUpload="beforeUpload"
				:fileList="fileList"
				@preview="handlePreview2"
				v-decorator="[
					`${value}`,
					{
						rules: [{ required: isRequire, message: `${label}必填` }]
					}
				]"
				:headers="headers"
				:action="action"
				name="file"
				@change="handleChange"
			>
				<a-row class="upload">
					<p class="ant-upload-drag-icon">
						<a-icon type="inbox" />
					</p>
					<p class="ant-upload-text">点击或将图片拖拽到这里上传</p>
					<!-- <p class="ant-upload-hint">支持扩展名：.rar .zip .doc .docx .pdf .jpg...</p> -->
				</a-row>
			</a-upload-dragger>
		</a-form-item>
		<!-- <preview ref="preview" :isNeedRotate="supportPdf"/> -->

		<a
			href="javascript:;"
			style="margin-left: 15px"
			@click="showDemoImg"
		>
			<viewer
				:images="[img2]"
				ref="viewer"
				@inited="
					viewer => {
						$preview = viewer;
					}
				"
			>
				<img
					:src="img2"
					style="display: none"
				/>
			</viewer>
		</a>
	</a-row>
</template>

<script>
import ENV from 'api/env.js';
import { API_UPLOAD } from '@/v2/api';
import idcardImg from '@/v2/assets/imgs/idcard.png';
import authLicenseImg from '@/v2/assets/imgs/authLicenseImg.png';
import bizLicenseImg from '@/v2/assets/imgs/bizLicenseImg.png';
import preview from '@/v2/components/preview/index.vue';
import { mapGetters, mapMutations } from 'vuex';
import systemConfig from '@/v2/config/common';

export default {
	data() {
		return {
			action: API_UPLOAD,
			header: {
				authorization: ''
			},
			fileList: [],
			img: '',
			img2: '',
			systemConfig
		};
	},
	props: {
		label: {
			type: String
		},
		value: {
			type: String
		},
		drag: {
			type: Boolean,
			default: false
		},
		defaultFileList: {
			type: Array,
			default: function () {
				return [];
			}
		},
		isRequire: {
			//认证材料是否必填
			type: Boolean,
			required: false,
			default: true
		},
		isHasTemplate: {
			type: Boolean,
			default: true
		},
		supportPdf: {
			//是否支持pdf
			type: Boolean,
			required: false,
			default: false
		}
	},
	created() {
		if (this.defaultFileList) {
			this.fileList = this.defaultFileList;
			if (this.fileList.length) {
				this.img2 = this.fileList[0].response.url;
			}
		}
		let img = bizLicenseImg;
		if (this.value == 'bizLicenseImg') {
			img = bizLicenseImg;
		} else if (this.value == 'legalPersonCardImg') {
			img = idcardImg;
		} else if (this.value == 'authLicenseImg') {
			img = authLicenseImg;
		} else if (this.value == 'modifyApplyImg') {
			img = this.systemConfig.accountInfo.modifyApplyImgExample;
		}
		this.img = img;
	},
	watch: {
		defaultFileList() {
			this.fileList = this.defaultFileList;
			if (this.fileList.length) {
				this.img2 = this.fileList[0].response.url;
			}
		}
	},
	methods: {
		...mapMutations({
			VUEX_MU_LOADING: 'config/VUEX_MU_LOADING'
		}),
		handlePreview2(file) {
			let targetUrl = file.response.result || file.response.url;
			if (targetUrl.indexOf('.pdf') != -1) {
				window.open(targetUrl, '_blank');
			} else {
				this.$preview.view(0);
			}
		},
		showDemoImg() {
			this.$viewer.view(0);
		},
		handleChange(info) {
			if (!info.file.status) return;
			let fileList = [...info.fileList];
			fileList = fileList.slice(-1);
			fileList = fileList.map(file => {
				if (file.response) {
					file.url = file.response.url;
				}
				return file;
			});
			this.fileList = fileList;
			this.VUEX_MU_LOADING(true);
			if (info.file.status === 'done') {
				this.$message.success('上传成功');
				this.img2 = ENV.BASE_NET + info.file.response.result;
				this.VUEX_MU_LOADING(false);
			} else if (info.file.status === 'error') {
				this.$message.error('上传失败');
			} else if (info.file.status !== 'uploading') {
			}
		},
		beforeUpload(file) {
			const isJPG =
				file.type === 'image/jpeg' ||
				file.type === 'image/png' ||
				file.type === 'image/gif' ||
				file.type === 'image/bmp' ||
				(this.supportPdf ? file.type === 'application/pdf' : false);
			if (!isJPG) {
				this.$message.error(this.supportPdf ? '仅支持bmp，jpg，png，gif，pdf的图片格式' : '仅支持bmp，jpg，png，gif的图片格式');
			}
			const isLt8M = this.supportPdf ? file.size / 1024 / 1024 <= 10 : file.size / 1024 / 1024 <= 8;
			if (!isLt8M) {
				this.$message.error(this.supportPdf ? '文件大小不超过100M' : '图片不能大于8M');
			}
			return isJPG && isLt8M;
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
	components: {
		preview
	}
};
</script>

<style lang="stylus" scoped>
.upload
  width 100%
  height 195px
  flex-column(space-around, center)
.s-card-content
  width 90%
  margin 0 auto
  .notice
    text-align left
    font-size 14px
    color #565656
    font-family PingFang-SC-Regular
    margin-bottom 20px
  h3
    text-align left
    font-size 16px
    font-family PingFang-SC-Medium
    color #565656
    margin 30px 0
.uploader
  ::v-deep .ant-upload-list-text
    cursor:pointer;
</style>
