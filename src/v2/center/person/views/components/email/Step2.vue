<template>
	<div>
		<a-form
			:form="form"
			:label-col="{ span: 24 }"
			:wrapper-col="{ span: 24 }"
			layout="vertical"
			class="form-wrap"
			style="margin-top: 30px"
		>
			<a-form-item label="邮箱">
				<a-input
					placeholder="请输入邮箱"
					:maxLength="50"
					v-decorator="[
						'email',
						{
							rules: [
								{ required: true, message: '邮箱不能为空' },
								{ type: 'email', message: `请输入正确的邮箱` }
							],
							validateTrigger: 'blur'
						}
					]"
				/>
			</a-form-item>
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
		</a-form>
	</div>
</template>

<script>
import { API_SENDEMAILCODEMODIFYEMAIL, API_BINDEMAIL } from '@/v2/api/account';
import {
	API_SendNewEmailCode,
	API_CheckNewEmailCode
} from '@/v2/api/account';
export default {
	props: {
		personalInfo: {
			type: Object,
			default() {
				return {};
			}
		},
		title: {
			type: String,
			default() {
				return '';
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
	methods: {
		submit() {
			this.form.validateFields((err, values) => {
				if (!err) {
					let API = API_CheckNewEmailCode;
					if (!this.personalInfo.email) {
						API = API_BINDEMAIL;
					}
					API({
						...values
					}).then(() => {
						this.$message.success(`${this.title.indexOf('修改') >= 0 ? '修改' : '绑定'}成功`);
						this.$emit('submit', 2);
					});
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
		getEmailCreateCode() {
			this.form.validateFields(['email'], (err, values) => {
				if (!err) {
					let API = API_SendNewEmailCode;
					if (!this.personalInfo.email) {
						API = API_SENDEMAILCODEMODIFYEMAIL;
					}
					API({
						...values
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
	width: 712px;
	height: 60px;
	margin-top: 40px;
	overflow: hidden;
}
.tips-info-wrap {
	height: 60px;
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
	color: @primary-color;
	cursor: pointer;
}
.code-btn {
	padding: 0;
}
.form-wrap {
	width: 364px;
	margin: 0 auto;
}
</style>