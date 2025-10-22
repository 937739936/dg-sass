<!--
 * @Author: liupengbo liupengbo@shdatalink.com
 * @Description: file content
-->
<template>
	<a-modal
		title="提示"
		:visible="visible"
		:confirm-loading="confirmLoading"
		@ok="handleOk"
		@cancel="handleCancel"
	>
		<p>
			<a-form
				:form="form"
				:label-col="{ span: 5 }"
				:wrapper-col="{ span: 19 }"
			>
				<a-form-item label="发送邮箱">{{ emailInfo.sendInfo }}</a-form-item>
				<a-form-item label="接收邮箱">{{ emailInfo.reciveInfo }}</a-form-item>
				<a-form-item label="邮件主题">{{ emailInfo.subject }}</a-form-item>
				<a-form-item label="发送附件">{{ emailInfo.attachmentName }}</a-form-item>
				<a-form-item label="邮箱授权码">
					<a-input
						v-decorator="[
							'authorizationCode',
							{
								rules: [{ required: true, message: '请输入邮箱授权码!' }]
							}
						]"
					/>
				</a-form-item>
			</a-form>
		</p>
	</a-modal>
</template>

<script>
import { getMailInfo, sendMail } from '@/v2/center/steels/api/orderApply';

export default {
	data() {
		return {
			visible: false,
			confirmLoading: false,
			item: {},
			form: this.$form.createForm(this, { name: 'form' }),
			emailInfo: {}
		};
	},
	methods: {
		showModal(item) {
			this.item = item;
			this.visible = true;
			getMailInfo({
				serialNo: item.serialNo
			}).then(res => {
				if (res.success) {
					this.emailInfo = res.data;
				}
			});
		},
		handleOk() {
			this.form.validateFields((err, values) => {
				if (!err) {
					sendMail({
						serialNo: this.item.serialNo,
						...this.form.getFieldsValue()
					}).then(res => {
						if (res.success) {
							this.$message.success('邮件发送成功');
							this.$emit('update', true);
							this.handleCancel();
						}
					});
				}
			});
		},
		handleCancel() {
			this.visible = false;
			this.form.resetFields();
		}
	}
};
</script>

<style></style>
