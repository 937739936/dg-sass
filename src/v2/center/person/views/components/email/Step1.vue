<template>
	<div>
		<div class="tips">
			<div class="tips-info-wrap">
				<p class="tips-title">为确认身份，我们需验证您的安全手机或绑定邮箱</p>
				<p class="tips-desc">如果您当前的手机号或邮箱均已无法使用，请联系客服</p>
			</div>
		</div>
		<a-form
			:form="form"
			:label-col="{ span: 24 }"
			:wrapper-col="{ span: 24 }"
			layout="vertical"
			class="form-wrap"
			style="margin-top: 30px"
		>
			<a-form-item label="选择验证方式" v-show="personalInfo.email">
				<a-radio-group
					name="radioGroup"
					v-decorator="['type', { rules: [{ required: true, message: '请选择选择验证方式!' }] }]"
				>
					<a-radio value="MOBILE"> 安全手机验证 </a-radio>
					<a-radio value="EMAIL" :disabled="!personalInfo.email"> 绑定邮箱验证 </a-radio>
				</a-radio-group>
			</a-form-item>
			<div v-if="form.getFieldValue('type') === 'MOBILE'">
				<p class="grid-line" v-if="personalInfo.email"></p>
				<p class="mobile-wrap">当前安全手机号：<span class="mobile">{{ personalInfo.mobile }}</span></p>
				<a-form-item label="短信验证码">
					<a-input
						placeholder="请输入短信验证码"
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
					>
						<a-button
							type="link"
							slot="suffix"
							:disabled="disabled"
							class="code-btn"
							@click.native="sendFindCode"
							>{{ disabled ? count + 's后重新发送' : '获取短信验证码' }}</a-button
						>
					</a-input>
				</a-form-item>
			</div>
			<div v-if="form.getFieldValue('type') === 'EMAIL'">
				<p class="grid-line"></p>
				<p class="mobile-wrap">当前绑定邮箱：<span class="mobile">{{ personalInfo.email }}</span></p>
				<a-form-item label="邮箱验证码">
					<a-input
						placeholder="请输入邮箱验证码"
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
					>
						<a-button
							type="link"
							slot="suffix"
							:disabled="disabled"
							class="code-btn"
							@click.native="getEmailCreateCode"
							>{{ disabled ? count + 's后重新发送' : '获取邮箱验证码' }}</a-button
						>
					</a-input>
				</a-form-item>
			</div>
		</a-form>
	</div>
</template>

<script>
import { tencentCaptcha } from '@/v2/utils/factory';
import {
	API_SENDEMAILCODEMODIFYEMAIL,
	API_SendBindEmailCode,
	API_CheckBindEmailCode,
	API_SendModifyEmailCode,
	API_CheckModifyEmailCode
} from '@/v2/api/account';

export default {
	props: {
		personalInfo: {
			type: Object,
			default() {
				return {};
			}
		}
	},
	data() {
		return {
			formLayout: 'horizontal',
			form: this.$form.createForm(this, { name: 'coordinated' }),
			count: 60,
			disabled: false
		};
	},
	mounted() {
		this.$nextTick(() => {
			this.form.setFieldsValue({
				type: 'MOBILE',
			});
		})
	},
	methods: {
		// 验证提交
		submit() {
			this.form.validateFields(async (err, values) => {
				if (!err) {
					if (this.personalInfo.email) {
						// 修改验证
						await API_CheckModifyEmailCode({
							...values
						});
					} else {
						// 绑定验证
						await API_CheckBindEmailCode({
							...values
						});
					}
					const params = Object.assign({}, values);
					params.verifyType = +values.verifyType;
					this.$emit('submit', 1);
				}
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
			if (!this.personalInfo.mobile) {
				this.$message.error('请先绑定手机号');
				return;
			}
			if (this.personalInfo.email) {
				tencentCaptcha(this.sendSmsChangeEmail, this.personalInfo.mobile);
			} else {
				tencentCaptcha(this.sendSms, this.personalInfo.mobile);
			}
		},
		sendSmsChangeEmail({ ticket, randstr }) {
			API_SendModifyEmailCode({
				type: this.form.getFieldValue('type'),
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
		sendSms({ ticket, randstr }) {
			const mobile = this.personalInfo.mobile;
			API_SendBindEmailCode({
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
		getEmailCreateCode() {
			if (!this.personalInfo.email) {
				this.$message.error('请先绑定邮箱');
				return;
			}
			API_SendModifyEmailCode({
				type: 'EMAIL'
			}).then(res => {
				if (!res.success) {
					this.$message.error(res.data);
					return;
				}
				this.$message.success('发送成功');
				this.disabled = true;
				this.countDown();
			});
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/tips-wrap.less');
@import url('~@/v2/style/form-reset.less');
</style>
<style lang="less" scoped>
.tips {
	width: 364px;
	height: 80px;
	margin-top: 40px;
	overflow: hidden;
}
.tips-info-wrap {
	height: 80px;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	justify-content: center;
	padding-left: 40px;
	box-sizing: border-box;
}
.tips-title {
	color: rgba(0, 0, 0, 0.8);
	font-size: 14px;
	line-height: 20px;
}
.tips-desc {
	color: rgba(0, 0, 0, 0.4);
	font-size: 12px;
}
.mobile-wrap {
	font-size: 14px;
	color: rgba(0, 0, 0, 0.4);
	margin: 20px 0;
}
.mobile {
	color: rgba(0, 0, 0, 0.8);
	font-weight: 500;
}
.grid-line {
	width: 364px;
	height: 1px;
	background: rgba(229, 230, 235, 1);
}
.code-btn {
  color:  @primary-color;
  cursor: pointer;
}
.code-btn {
  padding: 0;
}
</style>