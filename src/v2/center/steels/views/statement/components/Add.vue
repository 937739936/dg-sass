<template>
	<a-modal
		:title="title"
		:visible="visible"
		:confirm-loading="confirmLoading"
		@ok="handleOk"
		:destroyOnClose="true"
		width="400px"
		@cancel="
			visible = false;
			unit = '.xlsx';
		"
	>
		<a-form :form="form">
			<a-form-item v-if="fileType == 'FILE'">
				<a-input-search
					placeholder="请输入表格名称"
					v-decorator="[
						'fileName',
						{
							rules: [
								{ required: true, message: '表格名称必填' },
								{
									max: 60,
									message: '长度不能超过60个字符',
									whitespace: false
								}
							]
						}
					]"
				>
					<a-button slot="enterButton">
						{{ unit }}
					</a-button>
				</a-input-search>
			</a-form-item>
			<a-form-item v-if="fileType == 'FOLDER'">
				<a-input
					placeholder="请输入文件夹名称"
					v-decorator="[
						'fileName',
						{
							rules: [
								{ required: true, message: '文件夹名称必填' },
								{
									max: 60,
									message: '长度不能超过60个字符',
									whitespace: false
								}
							]
						}
					]"
				/>
			</a-form-item>
		</a-form>
	</a-modal>
</template>
<script>
import { createWpsFile, renameWpsFile } from '@/v2/center/steels/api/statement.js';
export default {
	props: ['barList'],
	data() {
		return {
			visible: false,
			title: '',
			confirmLoading: false,
			fileType: '',
			form: this.$form.createForm(this),
			record: {},
			operate: '',
			unit: '.xlsx'
		};
	},
	methods: {
		showModal(type, operate, record = {}) {
			this.visible = true;
			this.fileType = type;
			this.operate = operate;
			if (operate == 'edit') {
				this.title = '重命名';
				this.$nextTick(() => {
					this.form.setFieldsValue({
						fileName: record.fileName.split('.')[0]
					});
					this.unit = `.${record.fileName.split('.')[1]}`;
				});
			} else {
				this.title = `新建${type == 'FILE' ? '表格' : '文件夹'}`;
			}
			this.record = record;
		},
		handleOk(e) {
			e.preventDefault();
			this.form.validateFields((err, values) => {
				if (!err) {
					this.confirmLoading = true;
					values.id = this.record.id;
					values.parentId = this.barList?.length ? this.barList[this.barList.length - 1].fileId : undefined;
					if (this.fileType === 'FILE') {
						values.fileName = `${values.fileName}${this.unit}`;
					}
					values.fileType = this.fileType;
					let fetch = this.operate === 'add' ? createWpsFile : renameWpsFile;
					fetch(values)
						.then(res => {
							if (res.success) {
								this.$message.success('操作成功');
								this.unit = '.xlsx';
								this.$emit('refresh');
								this.visible = false;
							}
						})
						.finally(() => {
							this.confirmLoading = false;
						});
				}
			});
		}
	}
};
</script>
