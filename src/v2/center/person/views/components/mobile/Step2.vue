<template>
	<div>
		<div class="tips">
			<div class="tips-info-wrap">
				<p class="tips-title">
					系统将校验您的姓名、身份证与新手机号是否一致，如不一致，请上传说明函（需加盖公章），平台审核通过后，可正常变更手机号。
				</p>
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
			<a-form-item label="新手机号码">
				<a-input
					placeholder="请输入新手机号码"
					:maxLength="11"
					v-decorator="[
						'mobile',
						{
							rules: [
								{ required: true, message: '手机号码不能为空' },
								{ pattern: /^\d{11}$/, message: `请输入正确的手机号` }
							],
							validateTrigger: 'blur'
						}
					]"
				/>
			</a-form-item>
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
		</a-form>
		<LetterModal
			ref="LetterModal"
			:clickConfirm="clickConfirm"
		/>
	</div>
</template>

<script>
import { tencentCaptcha } from '@/v2/utils/factory';
import { API_SENDCODEMODIFYMOBILENEW, API_CheckNewPhoneCode, API_MODIFYMOBILE } from '@/v2/api/account';
import { API_THREE_ELEMENTS } from '@/v2/center/person/api';
import LetterModal from '../LetterModal.vue';

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
			form: this.$form.createForm(this, { name: 'mobileStep2' }),
			count: 60,
			disabled: false
		};
	},
	components: {
		LetterModal
	},
	methods: {
		clickConfirm() {
			this.$emit('submit', 3);
		},
		// 验证提交
		submit() {
			this.form.validateFields(async (err, values) => {
				if (!err) {
					await API_CheckNewPhoneCode({
						...values
					});
					const { data } = await API_THREE_ELEMENTS({
						idCardExistsCheck: false,
						mobileExistsCheck: true,
						mobile: values.mobile,
						name: this.personalInfo.name
					});
					if (data.result) {
						try {
							await API_MODIFYMOBILE({
								mobile: values.mobile
							});
						} catch (error) {
							this.$message.error('手机号修改失败');
						}
						this.$emit('submit', 3);
					} else {
						if (['ID_CARD_EXISTS', 'MOBILE_EXISTS'].includes(data.threeMethCheckResultEnum)) {
							this.$message.error(data.message);
						}
						if (['CHECK_THREE_META_ERROR'].includes(data.threeMethCheckResultEnum)) {
							this.$emit('submit', 2);
							this.$emit('setChangeMobile', values.mobile);
						}
					}
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
			this.form.validateFields(['mobile'], (err, values) => {
				if (!err) {
					tencentCaptcha(this.sendSms, values.mobile);
				}
			});
		},
		sendSms({ ticket, randstr }) {
			const mobile = this.form.getFieldValue('mobile');
			API_SENDCODEMODIFYMOBILENEW({
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