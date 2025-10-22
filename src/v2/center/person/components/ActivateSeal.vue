<template>
	<!-- 激活签章弹窗 -->
	<a-modal
		title="签章员手机号验证"
		:visible="visible"
		width="700px"
		destroyOnClose
		@ok="handleOk"
		@cancel="
			() => {
				visible = false;
			}
		"
	>
		<a-form
			:form="formData"
			:label-col="{ span: 6 }"
			:wrapper-col="{ span: 12 }"
		>
			<a-form-item label="手机号码">
				<a-input
					:maxLength="11"
					disabled
					v-decorator="[
						'mobile',
						{
							rules: [
								{ required: true, message: '手机号码' },
								{ pattern: /^\d{11}$/, message: `请输入正确的手机号` }
							],
							validateTrigger: 'blur'
						}
					]"
				/>
			</a-form-item>
			<a-form-item label="短信验证码">
				<a-col span="13">
					<a-input
						:maxLength="6"
						v-decorator="[
							'code',
							{
								rules: [
									{ required: true, message: '验证码不能为空' },
									{ pattern: /^\d{6}$/, message: `验证码为6位数字` }
								],
								validateTrigger: 'blur'
							}
						]"
					/>
				</a-col>
				<a-col
					span="10"
					offset="1"
				>
					<a-button
						type="primary"
						style="width: 100%; text-align: center; font-size: 14px"
						:disabled="disabled"
						@click.native="sendFindCode"
						>{{ disabled ? count + 's后重新发送' : '获取验证码' }}</a-button
					>
				</a-col>
			</a-form-item>
		</a-form>
	</a-modal>
</template>
<script>
import { API_ActivateCertsSendCode, API_ActivateCertsSubmit } from '@/v2/api/account';
import { tencentCaptcha } from '@/v2/utils/factory';

export default {
	name: 'ActivateCert',

	data() {
		return {
			visible: false,
			formData: this.$form.createForm(this),
			disabled: false,
			certId: '',
			count: 60
		};
	},
	methods: {
		showModal(record) {
			this.visible = true;
			this.certId = record.id;
			// 回显签章员手机号
			setTimeout(() => {
				this.formData.setFieldsValue({
					mobile: record.signerMobile
				});
			});
		},
		countDown() {
			this.count = 60;
			let num = 60;
			if (this.timer) window.clearInterval(this.timer);
			this.timer = window.setInterval(() => {
				if (num <= 0) {
					window.clearInterval(this.timer);
					this.disabled = false;
				}
				num--;
				this.count = num;
			}, 1000);
		},
		// 发送验证码
		sendFindCode() {
			this.formData.validateFields(['mobile'], (err, values) => {
				if (!err) {
					tencentCaptcha(this.sendSms, values.mobile);
				}
			});
		},
		sendSms({ ticket, randstr }) {
			const mobile = this.formData.getFieldValue('mobile');
			API_ActivateCertsSendCode({
				mobile,
				ticket,
				randstr
			}).then(res => {
				if (!res.success) {
					this.$message.error(res.data);
					return;
				}
				this.$message.success('验证码发送成功,请注意查收');
				this.countDown();
				this.disabled = true;
			});
		},
		handleOk() {
			// 提交激活电子签章
			this.formData.validateFields((err, values) => {
				if (!err) {
					let obj = Object.assign({}, values);
					obj.id = this.certId;
					API_ActivateCertsSubmit(obj).then(res => {
						if (res.success) {
							if (res.data) {
								this.$message.success({
									content: '电子签章激活成功!',
									duration: 5
								});
								this.visible = false;
								this.$emit('success');
							}
						}
					});
				} else {
					return false;
				}
			});
		}
	}
};
</script>
