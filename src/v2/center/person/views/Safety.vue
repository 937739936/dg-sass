<template>
	<div class="wrapper safety-content slMain">
		<a-card :bordered="false">
			<div class="methods-wrap">
				<span
					slot="title"
					class="slTitle"
					>安全设置</span
				>
			</div>
			<a-row class="title-wrap">
				<div class="title-str">手机号</div>
			</a-row>
			<a-row>
				<a-col :span="12">
					<div class="info-str">手机号是您登录系统、找回密码等重要凭证，如果手机号已更换，请及时换绑</div>
				</a-col>
				<a-col :span="6">
					<div class="info-str">{{ personalInfo.mobile }}</div>
				</a-col>
				<a-col :span="6">
					<!-- 未进行企业认证，非管理员，非签章员身份可直接修改手机号 -->
					<a-button
						type="primary"
						style="width: 166px; height: 32px"
						@click="changeMobile"
						v-if="personalInfo.modifyMobileBtnShow"
						>修改手机号</a-button
					>
				</a-col>
			</a-row>
			<a-row class="title-wrap">
				<div class="title-str">邮箱</div>
			</a-row>
			<a-row>
				<a-col :span="12">
					<div class="info-str">邮箱是你个人信息的重要组成，可用于接收邮件通知等</div>
				</a-col>
				<a-col :span="6">
					<div
						class="info-str one-line"
						:title="VUEX_ST_PERSONALLINFO.email"
					>
						{{ personalInfo.email ? personalInfo.email : '尚未绑定邮箱' }}
					</div>
				</a-col>
				<a-col :span="6">
					<a-button
						v-if="VUEX_ST_PERSONALLINFO.email"
						type="primary"
						style="width: 166px; height: 32px"
						@click="changeEmail('换绑邮箱')"
						>换绑邮箱</a-button
					>
					<a-button
						v-else
						type="primary"
						style="width: 166px; height: 32px"
						@click="changeEmail('绑定邮箱')"
						>绑定邮箱</a-button
					>
				</a-col>
			</a-row>
		</a-card>
		<a-modal
			v-model="phoneDiaVisible"
			title="修改手机号码"
			dialogClass="phone-dia safety-dia"
			:width="700"
			:footer="null"
			destroyOnClose
		>
			<a-steps
				v-show="stepsInfo.current != 2"
				:current="stepsInfo.current"
			>
				<a-step
					v-for="item in stepsInfo.steps"
					:key="item.title"
					:title="item.title"
				/>
			</a-steps>
			<div class="steps-content">
				<template v-if="stepsInfo.current == 0">
					<mobileCodeNew
						:sendapi="API_SENDCODEMODIFYMOBILEOLD"
						:checkapi="API_CHECKCODEMODIFYMOBILE"
						@checksuccess="checkStepOne"
					/>
				</template>
				<template v-if="stepsInfo.current == 1">
					<a-form
						:form="modelPhoneForm"
						style="padding-top: 10px"
					>
						<a-row
							type="flex"
							justify="center"
						>
							<a-col :span="12">
								<a-form-item>
									<a-input
										placeholder="请输入新手机号码"
										v-decorator="[
											`phoneNum`,
											{
												rules: [
													{ required: true, message: `请输入手机` },
													{
														pattern: /^1[3456789]\d{9}$/,
														message: '手机格式不正确'
													}
												],
												validateTrigger: 'blur'
											}
										]"
									/>
								</a-form-item>
							</a-col>
						</a-row>
						<a-row
							type="flex"
							justify="center"
						>
							<a-col :span="12">
								<a-form-item>
									<a-input
										placeholder="请输入短信验证码"
										v-decorator="[
											`phoneCode`,
											{
												rules: [{ required: true, message: `请输入短信验证码` }],
												validateTrigger: 'blur'
											}
										]"
									/>
									<i
										class="code"
										v-if="disabled"
										>{{ count }}s后重新发送</i
									>
									<i
										class="code"
										v-else
										style="cursor: pointer"
										@click="getPhoneCode"
										>获取短信验证码</i
									>
								</a-form-item>
							</a-col>
						</a-row>
					</a-form>
					<a-row
						type="flex"
						justify="center"
					>
						<a-button
							type="primary"
							style="width: 120px; height: 32px"
							@click="checkStepTwo"
							>下一步</a-button
						>
					</a-row>
				</template>
				<template v-if="stepsInfo.current == 2">
					<div class="success-icon"></div>
					<p class="success-title">恭喜您！手机号码修改成功</p>
					<p class="success-text">请在下次使用新的手机号码进行登录</p>
					<div style="text-align: center; margin-top: 44px">
						<a-button
							type="primary"
							style="width: 120px; height: 32px"
							@click="closeModel('phoneDiaVisible')"
							>确定</a-button
						>
					</div>
				</template>
			</div>
		</a-modal>
		<a-modal
			v-model="emailCreateDiaVisible"
			title="绑定邮箱"
			dialogClass="emial-create-dia safety-dia"
			:width="600"
			:footer="null"
		>
			<a-form
				:form="emailCreateForm"
				v-bind="{
					labelCol: { span: 6 },
					wrapperCol: { span: 14 }
				}"
			>
				<a-form-item label="邮箱">
					<a-input
						placeholder="请输入邮箱"
						v-decorator="[
							`emailCreate`,
							{
								rules: [
									{ required: true, message: `请输入邮箱` },
									{ type: 'email', message: '邮箱格式不正确' }
								],
								validateTrigger: 'blur'
							}
						]"
					/>
				</a-form-item>
				<a-form-item label="验证码">
					<a-input
						placeholder="请输入邮箱验证码"
						v-decorator="[
							`emailCreateCode`,
							{
								rules: [{ required: true, message: `请输入邮箱验证码` }],
								validateTrigger: 'blur'
							}
						]"
					/>
					<i
						class="code"
						v-if="disabled"
						>{{ count }}s后重新发送</i
					>
					<i
						class="code"
						v-else
						style="cursor: pointer"
						@click="getEmailCreateCode"
						>获取邮箱验证码</i
					>
				</a-form-item>
			</a-form>
			<a-row
				type="flex"
				justify="center"
			>
				<a-button
					type="primary"
					style="width: 120px; height: 32px"
					@click="emailCreate"
					>确定</a-button
				>
			</a-row>
		</a-modal>
		<a-modal
			v-model="emailChangeDiaVisible"
			title="换绑邮箱"
			dialogClass="emial-change-dia safety-dia"
			:width="700"
			:footer="null"
		>
			<a-steps
				v-show="stepsEmialInfo.current != 2"
				:current="stepsEmialInfo.current"
			>
				<a-step
					v-for="item in stepsEmialInfo.steps"
					:key="item.title"
					:title="item.title"
				/>
			</a-steps>
			<div class="steps-content">
				<template v-if="stepsEmialInfo.current == 0">
					<mobileCode
						:sendapi="API_SENDSMSCODEMODIFYEMAIL"
						:checkapi="API_CHECKSMSCODEMODIFYEMAIL"
						@checksuccess="checkStepOneEmail"
					/>
				</template>
				<template v-if="stepsEmialInfo.current == 1">
					<a-form
						:form="emailChangeForm"
						style="padding-top: 10px"
					>
						<a-row
							type="flex"
							justify="center"
						>
							<a-col :span="12">
								<a-form-item>
									<a-input
										placeholder="请输入邮箱"
										v-decorator="[
											`emailChange`,
											{
												rules: [
													{ required: true, message: `请输入邮箱` },
													{ type: 'email', message: '邮箱格式不正确' }
												],
												validateTrigger: 'blur'
											}
										]"
									/>
								</a-form-item>
							</a-col>
						</a-row>
						<a-row
							type="flex"
							justify="center"
						>
							<a-col :span="12">
								<a-form-item>
									<a-input
										placeholder="请输入邮箱验证码"
										v-decorator="[
											`emailChangCode`,
											{
												rules: [{ required: true, message: `请输入邮箱验证码` }],
												validateTrigger: 'blur'
											}
										]"
									/>
									<i
										class="code"
										v-if="disabled"
										>{{ count }}s后重新发送</i
									>
									<i
										class="code"
										v-else
										style="cursor: pointer"
										@click="getEmailChangeCode"
										>获取邮箱验证码</i
									>
								</a-form-item>
							</a-col>
						</a-row>
					</a-form>
					<a-row
						type="flex"
						justify="center"
					>
						<a-button
							type="primary"
							style="width: 120px; height: 32px"
							@click="checkStepTwoEmail"
							>下一步</a-button
						>
					</a-row>
				</template>
				<template v-if="stepsEmialInfo.current == 2">
					<div class="success-icon"></div>
					<p class="success-title">恭喜您！邮箱修改成功</p>
					<div style="text-align: center; margin-top: 44px">
						<a-button
							type="primary"
							style="width: 120px; height: 32px"
							@click="closeModel('emailChangeDiaVisible')"
							>确定</a-button
						>
					</div>
				</template>
			</div>
		</a-modal>
		<EmailChangeModal
			ref="EmailChangeModal"
			:personalInfo="personalInfo"
			:title="emailChangeModalTitle"
			v-on:update="initData"
		/>
		<MobileChangeModal
			ref="MobileChangeModal"
			:personalInfo="personalInfo"
			:title="mobileChangeModalTitle"
			v-on:update="initData"
		/>
	</div>
</template>

<script>
import {
	API_PERSONALDETAIL,
	API_SENDCODEMODIFYMOBILEOLD,
	API_SENDCODEMODIFYMOBILENEW,
	API_CHECKCODEMODIFYMOBILE,
	API_MODIFYMOBILE,
	API_SENDEMAILCODEMODIFYEMAIL,
	API_SENDSMSCODEMODIFYEMAIL,
	API_CHECKSMSCODEMODIFYEMAIL,
	API_BINDEMAIL,
	API_MODIFYEMAIL,
	API_nameMobileCheckCode,
	API_GetRealNameAuthDetail
} from '@/v2/api/account';

import { mapGetters, mapMutations, mapActions } from 'vuex';
import mobileCode from '@/v2/components/mobileCode'; // 管理员修改手机号
import mobileCodeNew from './company/mobileCodeNew'; // 非管理员、非签章员的普通用户修改手机号
import { tencentCaptcha } from '@/v2/utils/factory';
import EmailChangeModal from './components/EmailChangeModal';
import MobileChangeModal from './components/MobileChangeModal';

export default {
	components: {
		mobileCode,
		mobileCodeNew,
		EmailChangeModal,
		MobileChangeModal
	},
	data() {
		return {
			modelPhoneForm: this.$form.createForm(this),
			emailCreateForm: this.$form.createForm(this),
			emailChangeForm: this.$form.createForm(this),
			personInfo: null,
			phoneDiaVisible: false,
			emailCreateDiaVisible: false,
			emailChangeDiaVisible: false,
			disabled: false,
			timer: null,
			count: 60,
			stepsEmialInfo: {
				current: 0,
				steps: [
					{
						title: '验证手机号码'
					},
					{
						title: '验证新邮箱'
					},
					{
						title: '完成修改邮箱'
					}
				]
			},
			stepsInfo: {
				current: 0,
				steps: [
					{
						title: '验证手机号码'
					},
					{
						title: '验证新手机号码'
					},
					{
						title: '完成修改手机号码'
					}
				]
			},
			API_SENDCODEMODIFYMOBILEOLD,
			API_CHECKCODEMODIFYMOBILE,
			API_SENDSMSCODEMODIFYEMAIL,
			API_CHECKSMSCODEMODIFYEMAIL,
			emailChangeModalTitle: '',
			mobileChangeModalTitle: '',
			personalInfo: {},
			loading: false
		};
	},
	created() {
		this.viewProfile();
		this.initData();
		this.SafetyEmail = true;
	},
	mounted() {
		this.VUEX_USER_TOKEN();
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_PERSONALLINFO: 'VUEX_ST_PERSONALLINFO',
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		})
	},
	methods: {
		...mapMutations({
			VUEX_MU_PERSONALLINFO: 'user/VUEX_MU_PERSONALLINFO'
		}),
		...mapActions({
			VUEX_USER_TOKEN: 'user/VUEX_USER_TOKEN'
		}),
		changeMobile() {
			if (this.VUEX_ST_COMPANYSUER?.companyUserRoles && this.VUEX_ST_COMPANYSUER.companyUserRoles.includes('admin')) {
				const modal = this.$confirm({
					title: '提示',
					content: '您当前的身份为管理员，请前往【企业管理-我的企业】进行修改',
					cancelText: '取消',
					okText: '前往修改',
					onOk: () => {
						this.$router.push('/center/account/company/user/changeOperatorMobile');
					},
					onCancel: () => {
						modal.destroy();
					}
				});
				return;
			}
			if (this.VUEX_ST_COMPANYSUER?.companyUserRoles && this.VUEX_ST_COMPANYSUER.companyUserRoles.includes('signer')) {
				const modal = this.$confirm({
					title: '提示',
					content: '您当前的身份为签章员，请前往【企业管理-我的企业】进行修改',
					cancelText: '取消',
					okText: '前往修改',
					onOk: () => {
						this.$router.push('/center/account/company/user/changeOperatorMobile');
					},
					onCancel: () => {
						modal.destroy();
					}
				});
				return;
			}
			if (this.personalInfo.mobile) {
				this.mobileChangeModalTitle = '修改手机号';
			}
			this.$refs.MobileChangeModal.showModal();
		},
		async initData() {
			this.loading = true;
			const { data } = await API_GetRealNameAuthDetail({ t: new Date().getTime() });
			this.personalInfo = data;
			this.loading = false;
		},
		changeEmail(title) {
			this.emailChangeModalTitle = title;
			this.$refs.EmailChangeModal.showModal();
		},
		emailCreate() {
			this.emailCreateForm.validateFields((error, values) => {
				if (!error) {
					API_BINDEMAIL({
						email: this.emailCreateForm.getFieldValue('emailCreate'),
						code: this.emailCreateForm.getFieldValue('emailCreateCode')
					})
						.then(res => {
							if (!res.success) {
								this.$message.error(res.data);
								return;
							}

							this.VUEX_MU_PERSONALLINFO({
								...this.VUEX_ST_PERSONALLINFO,
								email: this.emailCreateForm.getFieldValue('emailCreate')
							});

							this.emailCreateForm.setFields({
								['emailCreateCode']: {
									value: this.emailCreateForm.getFieldValue('emailCreateCode'),
									errors: null
								}
							});
							this.$message.success('绑定成功');
							this.emailCreateDiaVisible = false;
						})
						.catch(e => {
							this.emailCreateForm.setFields({
								['emailCreateCode']: {
									value: this.modelPhoneForm.getFieldValue('emailCreateCode'),
									errors: [
										{
											message: '验证码错误',
											field: 'emailCreateCode'
										}
									]
								}
							});
						});
				}
			});
		},
		showModel(flag) {
			// 初始化数据
			this.stepsEmialInfo.current = 0;
			this.stepsInfo.current = 0;
			this.count = 60;
			this.disabled = false;
			if (this.timer) window.clearInterval(this.timer);
			this.timer = null;

			this[flag] = true;
		},
		closeModel(flag) {
			this[flag] = false;
		},
		checkStepOne(code) {
			this.oldCode = code;
			this.stepsInfo.current = 1;
		},
		// 手机号、姓名、身份证号三要素校验
		identityCheck() {
			return API_nameMobileCheckCode({
				mobile: this.modelPhoneForm.getFieldValue('phoneNum'),
				name: this.VUEX_ST_PERSONALLINFO.name
			});
		},
		async checkStepTwo() {
			// 实名认证后才进行三要素校验
			if (this.VUEX_ST_PERSONALLINFO.name) {
				const res = await this.identityCheck();
				if (!(res.success && res.data.result)) {
					this.$message.error(res.data.message);
					return;
				}
			}
			API_MODIFYMOBILE({
				code: this.modelPhoneForm.getFieldValue('phoneCode'),
				// oldCode: this.oldCode,
				mobile: this.modelPhoneForm.getFieldValue('phoneNum')
			})
				.then(res => {
					if (!res.success) {
						this.$message.error(res.data);
						return;
					}

					this.VUEX_MU_PERSONALLINFO({
						...this.VUEX_ST_PERSONALLINFO,
						mobile: this.modelPhoneForm.getFieldValue('phoneNum')
					});

					this.modelPhoneForm.setFields({
						['phoneCode']: {
							value: this.modelPhoneForm.getFieldValue('phoneCode'),
							errors: null
						}
					});
					this.stepsInfo.current = 2;
				})
				.catch(e => {
					this.modelPhoneForm.setFields({
						['phoneCode']: {
							value: this.modelPhoneForm.getFieldValue('phoneCode'),
							errors: [
								{
									message: '验证码错误',
									field: 'phoneCode'
								}
							]
						}
					});
				});
		},
		checkStepOneEmail(code) {
			this.emailOldCode = code;
			this.stepsEmialInfo.current = 1;
		},
		checkStepTwoEmail() {
			this.emailChangeForm.validateFields((errors, value) => {
				if (errors) return;
				API_MODIFYEMAIL({
					code: this.emailChangeForm.getFieldValue('emailChangCode'),
					// oldCode:this.emailOldCode,
					email: this.emailChangeForm.getFieldValue('emailChange')
				})
					.then(res => {
						if (!res.success) {
							this.$message.error(res.data);
							return;
						}

						this.VUEX_MU_PERSONALLINFO({
							...this.VUEX_ST_PERSONALLINFO,
							email: this.emailChangeForm.getFieldValue('emailChange')
						});

						this.emailChangeForm.setFields({
							['emailChangCode']: {
								value: this.emailChangeForm.getFieldValue('emailChangCode'),
								errors: null
							}
						});

						this.stepsEmialInfo.current = 2;
					})
					.catch(e => {
						// this.emailChangeForm.setFields({ ['emailChangCode']: { value:this.emailChangeForm.getFieldValue('emailChangCode'),errors: [{
						//   message: '验证码错误',
						//   field: 'emailChangCode',
						// }]}})
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
		getPhoneCode() {
			const mobile = this.modelPhoneForm.getFieldValue('phoneNum');
			if (!mobile) return;
			tencentCaptcha(this.sendSms, mobile);
		},
		sendSms({ ticket, randstr }) {
			const mobile = this.modelPhoneForm.getFieldValue('phoneNum');
			API_SENDCODEMODIFYMOBILENEW({
				mobile,
				ticket,
				randstr
			}).then(res => {
				if (!res.success) {
					this.$message.error(res.data);
					return;
				}
				this.$message.success('发送成功');
				this.disabled = true;
				this.countDown();
			});
		},
		getEmailCreateCode() {
			this.emailCreateForm.validateFields(['emailCreate'], (error, values) => {
				if (!error) {
					const { emailCreate } = values;
					API_SENDEMAILCODEMODIFYEMAIL({
						email: emailCreate
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
		},
		getEmailChangeCode() {
			this.emailChangeForm.validateFields(['emailChange'], (err, values) => {
				if (!err) {
					API_SENDEMAILCODEMODIFYEMAIL({
						email: values.emailChange
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
		},

		// 查询个人信息
		viewProfile() {
			API_PERSONALDETAIL({ t: new Date().getTime() }).then(res => {
				if (res.success) {
					this.personInfo = res.data;
				}
			});
		}
	},
	beforeRouteLeave(to, from, next) {
		window.clearInterval(this.timer);
		next();
	}
};
</script>
<style lang="less" scoped>
.slMain {
	margin-top: -10px;
	background: #fff;
}
.safety-dia {
	.steps-content {
		margin-top: 24px;
	}
	.success-icon {
		width: 70px;
		height: 70px;
		background-size: cover;
		margin: 0 auto;
		background-image: url(~@/v2/assets/imgs/person/success-icon.png);
	}
	.success-title {
		font-family: PingFangSC-Regular;
		font-size: 14px;
		color: #383a3f;
		text-align: center;
		margin-top: 13px;
	}
	.success-text {
		font-family: PingFangSC-Regular;
		font-size: 12px;
		color: #9ba0aa;
		text-align: center;
		margin-top: 5px;
	}
	.code {
		font-family: PingFangSC-Regular;
		font-size: 12px;
		color: @primary-color;
		position: absolute;
		right: 7px;
		top: -11px;
	}
}
.safety-content {
	min-height: 300px;
	padding-bottom: 40px;
	.title-wrap {
		margin-top: 10px;
		margin-bottom: 10px;
	}
	.ant-col {
		line-height: 32px;
	}
	.title-str {
		font-family: PingFangSC-Medium;
		font-size: 16px;
		color: #383a3f;
	}
	.info-str {
		font-family: PingFangSC-Regular;
		font-size: 14px;
		color: #141517;
	}
	.s-card-title {
		margin-top: 10px;
	}
}
</style>
