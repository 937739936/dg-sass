<template>
	<div class="file-upload">
		<a-upload
			name="file"
			:beforeUpload="beforeUpload"
			:multiple="false"
			:action="action"
			:data="paramsData"
			:headers="headers"
			@change="fileChange"
		>
			<a-button
				type="primary"
				:disabled="!btnDisabled"
			>
				上传文件
			</a-button>
		</a-upload>
	</div>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
	name: 'FileUpload',
	props: {
		// 上传的参数
		paramsData: {
			default: () => {}
		},
		action: {
			default: ''
		},
		btnDisabled: {
			default: false
		}
	},
	data() {
		return {
			myallowFormat: ['xlsx', 'xls'],
			modalFileWrapIsShow: false,
			modalFileForm: this.$form.createForm(this),
			fileList: []
		};
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
		fileChange({ file, fileList }) {
			if (file.status == 'done') {
				this.$emit('uploadFiles', file.response.data);
			}
			if (file.status == 'error') {
				this.$message.error(file.response.error.message);
			}
		},
		beforeUpload(file) {
			const allowFormat = this.myallowFormat;
			let isAllowFormat = false;
			if (allowFormat.indexOf(file.name.split('.')[file.name.split('.').length - 1].toLowerCase()) == -1) {
				this.$message.error('仅支持' + allowFormat.join('，') + '的格式');
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
					// t.$message.error("该格式附件不能大于10M，请重新选择");
					t.$message.error('单个附件大小不得超过100M');
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
		}
	}
};
</script>
<style lang="less" scoped>
.row {
	margin-bottom: 10px;
}
.file-upload {
	/deep/ .ant-upload-list {
		display: none !important;
	}
}
</style>
