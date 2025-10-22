<template>
	<a-modal
		title="附件信息"
		:visible="visible"
		:confirm-loading="confirmLoading"
		@ok="handleOk"
		@cancel="handleCancel"
		destroyOnClose
	>
		<a-form
			:form="formModel"
			:label-col="{ span: 5 }"
			:wrapper-col="{ span: 12 }"
		>
			<a-form-item label="附件类型">
				<a-select
					v-decorator="[
						'type',
						{
							rules: [{ required: true, message: '请选择附件类型!' }]
						}
					]"
					placeholder="请选择附件类型"
				>
					<a-select-option
						:value="item.value"
						v-for="item in fileTypeList"
						:key="item.value"
					>
						{{ item.text }}
					</a-select-option>
				</a-select>
			</a-form-item>
			<a-form-item label="附件">
				<a-upload
					name="file"
					list-type="picture-card"
					class="avatar-uploader"
					:multiple="false"
					@preview="handlePreview"
					:action="action"
					:before-upload="beforeUpload"
					@change="handleChange"
					:accept="acceptFormat"
					:fileList="fileList"
					:headers="headers"
					v-decorator="[
						'file',
						{
							rules: [{ required: true, message: '请选择附件!' }]
						}
					]"
				>
					<div v-if="fileList.length < 1">
						<a-icon :type="loading ? 'loading' : 'plus'" />
						<div class="ant-upload-text">点击选择</div>
					</div>
				</a-upload>
			</a-form-item>
		</a-form>
		<div>
			<p>附件上传要求：</p>
			<p>可支持格式为{{ acceptFormat }}的附件，单个附件大小不得超过100M的文件。</p>
		</div>
		<ImageViewer ref="imageViewer" />
	</a-modal>
</template>

<script>
import { API_SteelsUploadFileWaterMark } from '@/v2/center/steels/api';
import { mapGetters } from 'vuex';
import ImageViewer from '@sub/components/viewer/image.vue';
export default {
	components: {
		ImageViewer
	},
	data() {
		return {
			loading: false,
			confirmLoading: false,
			visible: false,
			action: API_SteelsUploadFileWaterMark,
			formModel: this.$form.createForm(this, { name: 'formModel' }),
			fileList: []
		};
	},
	props: {
		fileTypeList: {
			type: Array,
			default: () => []
		},
		acceptFormat: {
			type: String,
			default: '.png,.jpeg,.jpg,.gif,.pdf,.doc,.docx,.xlsx,.xls'
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
		getTypeTextById(id) {
			for (let i = 0; i < this.fileTypeList.length; i++) {
				if (this.fileTypeList[i].value == id) {
					return this.fileTypeList[i].text;
				}
			}
		},
		handlePreview(data) {
			let url = '';
			if (data.response) {
				url = data.response.data.path;
			}
			if (data.url) {
				url = data.url;
			}
			if (!url) {
				return;
			}
			this.$refs.imageViewer.showFile(url);
		},
		handleOk() {
			this.formModel.validateFields((err, values) => {
				if (!err) {
					const { path, name, id } = this.fileList[0].response.data;
					this.$emit('add-file', {
						type: values.type,
						fileUrl: path,
						fileName: name,
						fileId: id
					});
					this.visible = false;
					this.confirmLoading = false;
					this.formModel.resetFields();
					this.fileList = [];
				}
			});
		},
		handleCancel(e) {
			this.visible = false;
			this.formModel.resetFields();
			this.fileList = [];
		},
		handleChange(info) {
			this.fileList = info.fileList;
		},
		beforeUpload(file) {},
		show() {
			this.visible = true;
		}
	}
};
</script>

<style></style>
