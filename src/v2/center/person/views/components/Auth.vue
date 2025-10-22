<template>
	<div class="slMain">
		<div class="methods-wrap">
			<span
				slot="title"
				class="slTitle"
				>个人信息</span
			>
		</div>
		<div class="tips">
			<div class="flex-center">
				<span class="icon"></span>
				<span class="desc-top">您的个人信息可能会在合同中使用，请确保信息真实完整。</span>
			</div>
			<span class="desc-bot"
				>系统将校验您的姓名、身份证及手机号是否一致，如不一致，请上传说明函（加盖公章），平台审核通过后，可正常激活、使用产品功能。</span
			>
		</div>
		<div class="content">
			<a-form
				:form="form"
				:label-col="{ span: 24 }"
				:wrapper-col="{ span: 24 }"
				layout="vertical"
				class="form-wrap"
			>
				<a-form-item label="手机号码">
					<a-input
						disabled
						placeholder="请输入手机号码"
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
				<a-form-item label="真实姓名">
					<a-input
						placeholder="请输入真实姓名"
						:maxLength="20"
						v-decorator="['name', { rules: [{ required: true, message: '真实姓名必填' }] }]"
					/>
				</a-form-item>
				<a-form-item label="身份证号">
					<a-input
						placeholder="请输入身份证号"
						:maxLength="18"
						v-decorator="['idCard', { rules: [{ required: true, message: '身份证号必填' }, { validator: validIdCard }] }]"
					/>
				</a-form-item>
			</a-form>
		</div>
		<div class="footer">
			<a-button
				ghost
				type="primary"
				style="width: 88px"
				@click="$router.back()"
				>取消</a-button
			>
			<a-button
				type="primary"
				style="width: 116px; margin-left: 30px"
				@click="submit"
				>提交认证</a-button
			>
		</div>
		<LetterModal
			ref="LetterModal"
			:clickConfirm="clickConfirm"
		/>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import { tencentCaptcha } from '@/v2/utils/factory';
import { API_REALNAMEAUTH, API_ThreeElementNotPassSubmit, API_SENDCODEREALNAMEAUTH } from '@/v2/api/account';
import { API_CHECKCODEREALNAMEAUTH } from '@/api/account';
import { checkID, encryptedData } from 'untils/factory.js';
import { API_THREE_ELEMENTS } from '@/v2/center/person/api';
import LetterModal from './LetterModal.vue';

export default {
	components: {
		LetterModal
	},
	data() {
		return {
			formLayout: 'horizontal',
			form: this.$form.createForm(this, { name: 'coordinated' }),
			count: 60,
			disabled: false,
			loading: false,
			formData: {}
		};
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_TOKEN: 'VUEX_ST_TOKEN',
			VUEX_ST_PERSONALLINFO: 'VUEX_ST_PERSONALLINFO',
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		})
	},
	watch: {},
	mounted() {
		this.$nextTick(() => {
			this.form.setFieldsValue({
				mobile: this.VUEX_ST_PERSONALLINFO.mobile
			});
		});
	},
	methods: {
		clickConfirm(values) {
			this.notPassSubmit(values);
		},
		// 三要素验证通过提交
		successSubmit(formData) {
			API_REALNAMEAUTH(formData)
				.then(res => {
					if (res.success) {
						if (res.data.result) {
							this.$message.success('提交成功');
							window.location.href = '/center/account/person/info/auth/authed';
						} else {
							this.$message.error(res.data.message);
						}
					}
				})
				.finally(() => {
					this.loading = false;
				});
		},
		// 三要素验证未通过提交
		notPassSubmit(values) {
			API_ThreeElementNotPassSubmit({ ...this.formData, ...values })
				.then(res => {
					if (res.success) {
						this.$message.success('提交成功');
						this.$router.replace('/center/account/person/info/auth/success');
					} else {
						this.$message.error(res.data.message);
					}
				})
				.finally(() => {
					this.loading = false;
				});
		},
		submit() {
			this.form.validateFieldsAndScroll(async (err, values) => {
				if (err) return;
				this.loading = true;
				// 验证code
				await API_CHECKCODEREALNAMEAUTH({
					code: this.form.getFieldValue('code')
				});
				this.formData = {
					code: this.form.getFieldValue('code'),
					name: values.name,
					idCard: await encryptedData(values.idCard),
					mobile: this.VUEX_ST_PERSONALLINFO.mobile
				};
				const { data } = await API_THREE_ELEMENTS({
					...this.formData,
					idCardExistsCheck: true,
					mobileExistsCheck: false
				});
				if (data.result) {
					this.successSubmit(this.formData);
				} else {
					if (['ID_CARD_EXISTS', 'MOBILE_EXISTS'].includes(data.threeMethCheckResultEnum)) {
						this.$message.error(data.message);
					}
					if (['CHECK_THREE_META_ERROR'].includes(data.threeMethCheckResultEnum)) {
						this.$refs.LetterModal.showModal();
					}
				}
			});
		},
		// 校验身份证
		validIdCard(rule, value, callback) {
			if (!value) {
				callback();
				return;
			}
			if (!checkID(value)) {
				callback('请输入有效的身份证号');
			}
			callback();
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
			API_SENDCODEREALNAMEAUTH({
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
.slMain {
	margin-top: -10px;
	background: #fff;
	padding: 20px 30px;
	padding-bottom: 110px;
	box-sizing: border-box;
}
.flex-center {
	display: flex;
	flex-direction: row;
	align-items: center;
}

.title {
	height: 33px;
	font-size: 24px;
	font-family: PingFangSC-Medium, PingFang SC;
	font-weight: 500;
	color: rgba(0, 0, 0, 0.8);
	line-height: 33px;
	margin-bottom: 30px;
}

.tips {
	widows: 100%;
	height: 60px;
	padding: 12px;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: flex-start;
	border: 1px solid rgba(229, 230, 235, 1);
	box-sizing: border-box;
	background: rgba(243, 247, 255, 1);
	border-radius: 4px;
	margin-top: 30px;
	color: rgba(0, 0, 0, 0.8);
}

.icon {
	width: 16px;
	height: 16px;
	display: inline-block;
	background-image: url('~v2/assets/imgs/common/info_icon.png');
	background-size: 16px 16px;
	background-position: center;
}

.desc-top {
	margin-left: 12px;
}

.desc-bot {
	margin-left: 28px;
}

.person-auth,
.code-btn {
	color:  @primary-color;
	cursor: pointer;
}

.code-btn {
	padding: 0;
}

.content {
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding-top: 30px;
	box-sizing: border-box;
	.ant-form-item {
		padding-bottom: 6px;
	}
}

.form-wrap {
	width: 364px;
}
.footer {
	width: calc(100% - 248px);
	height: 64px;
	border-top: 1px solid rgba(229, 230, 235, 1);
	background: #fff;
	box-sizing: border-box;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	position: fixed;
	bottom: 0;
	left: 228px;
	z-index: 99;
}
</style>
