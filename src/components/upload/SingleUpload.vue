<template>
	<div>
		<a-form-item>
			<a-upload
				:beforeUpload="beforeUpload"
				:fileList="fileList"
				@preview="handlePreview"
				v-decorator="[
					value,
					{
						rules: [{ required: isRequire, message: `请上传文件` }]
					}
				]"
				:headers="headers"
				:listType="listType"
				:action="action"
				name="file"
				@change="handleChange"
				:multiple="multi"
			>
				<a-button v-if="listType == 'text'"> <a-icon type="upload" />上传文件 </a-button>
				<div v-else>
					<i class="file_icon"></i>
					<div class="ant-upload-text">点击选择</div>
				</div>
			</a-upload>
		</a-form-item>
		<preview ref="preview" />
	</div>
</template>

<script>
import { API_UPLOAD, API_GETCURRENTENV } from 'api';
import preview from 'components/preview/index.vue';
import { mapGetters, mapMutations } from 'vuex';
export default {
	name: 'SingleUpload',
	data() {
		return {
			header: {
				authorization: ''
			},
			fileList: []
		};
	},
	created() {
		this.fileList = this.defaultFileList;
	},
	watch: {
		defaultFileList() {
			this.fileList = this.defaultFileList;
		}
	},
	props: {
		value: {
			type: String
		},
		defaultFileList: {
			type: Array,
			default: function () {
				return [];
			}
		},
		isRequire: {
			type: Boolean,
			default: true
		},
		limitType: {
			type: Array,
			default: function () {
				return [];
			}
		},
		listType: {
			type: String,
			default: 'text'
		},
		multi: {
			type: Boolean,
			default: false
		},
		//自定义上传地址
		action: {
			type: String,
			default: API_UPLOAD
		}
	},
	methods: {
		...mapMutations({
			VUEX_MU_LOADING: 'config/VUEX_MU_LOADING'
		}),
		handlePreview(file) {
			if (file.response.url) {
				window.open(API_GETCURRENTENV(file.response.url), '_blank');
			}
			if (file.response.result) {
				window.open(API_GETCURRENTENV(file.response.result), '_blank');
			}
			// this.$refs.preview.show(file.response.result || file.response.url);
		},
		beforeUpload(file) {
			const allowFormat = this.limitType;
			let isAllowFormat = false;
			let errMsg = '';
			let ext = file.name.split('.')[file.name.split('.').length - 1].toLowerCase();
			if (allowFormat.indexOf(ext) == -1) {
				allowFormat.forEach(item => {
					errMsg += item + ' ';
				});
				this.$message.error(`请上传${errMsg}类型的文件`);
				isAllowFormat = false;
			} else {
				isAllowFormat = true;
			}
			return new Promise((resolve, reject) => {
				if (isAllowFormat) {
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
		handleChange(info) {
			if (!info.file.status) return;
			let fileList = [...info.fileList];
			//判断是否上传多个文件
			if (!this.multi) {
				fileList = fileList.slice(-1);
			}
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
				this.VUEX_MU_LOADING(false);
			} else if (info.file.status === 'error') {
				this.$message.error('上传失败');
				this.VUEX_MU_LOADING(false);
			} else if (info.file.status !== 'uploading') {
				this.VUEX_MU_LOADING(false);
				// this.$message.error('上传中')
			} else {
				this.VUEX_MU_LOADING(false);
			}
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

<style scoped></style>
