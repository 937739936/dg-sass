<template>
	<div class="slMain">
		<a-card :bordered="false">
			<div class="methods-wrap">
				<span
					slot="title"
					class="slTitle"
					>企业账号登录密码</span
				>
			</div>
			<a-row class="passRow">
				<a-col :span="8"> 账号名：{{ VUEX_ST_COMPANYSUER.account }} </a-col>
				<a-col :span="8"> ********* </a-col>
			</a-row>
			<a-row
				style="margin-top: 20px"
				type="flex"
				justify="center"
				v-if="VUEX_ST_COMPANYSUER.id"
			>
				<a-button
					@click="showPassModal"
					type="primary"
					>修改企业账号密码</a-button
				>
			</a-row>
			<a-modal
				title="修改企业账号登录密码"
				:visible="passModifyIsShow"
				okText="确定"
				cancelText="取消"
				width="500px"
				:footer="editIsShow ? undefined : null"
				@cancel="
					() => {
						passModifyIsShow = false;
					}
				"
				@ok="handleSubmit('ruleForm')"
			>
				<a-form-model
					v-if="editIsShow"
					ref="ruleForm"
					:model="ruleForm"
					:rules="rules"
					:label-col="{ span: 6 }"
					:wrapper-col="{ span: 12 }"
				>
					<a-form-model-item
						ref="oldPassword"
						label="原密码"
						prop="oldPassword"
						:colon="false"
					>
						<a-input-password
							v-model="ruleForm.oldPassword"
							placeholder="请输入原密码"
						/>
					</a-form-model-item>
					<a-form-model-item
						ref="newPassword"
						label="新密码"
						prop="newPassword"
						:colon="false"
					>
						<a-input-password
							v-model="ruleForm.newPassword"
							placeholder="请输入新密码"
						/>
					</a-form-model-item>
					<a-form-model-item
						ref="rePassword"
						label="再次输入密码"
						prop="rePassword"
						:colon="false"
					>
						<a-input-password
							v-model="ruleForm.rePassword"
							placeholder="请再次输入新密码"
						/>
					</a-form-model-item>
				</a-form-model>
				<template v-if="!editIsShow">
					<h2 style="text-align: center; font-size: 16px; font-family: PingFangSC-Medium; margin: 20px">
						恭喜您！企业账号登录密码修改成功
					</h2>
					<p style="text-align: center; color: rgb(111 112 113); margin-bottom: 30px">
						下次您可以使用新企业账号登录密码进行登录啦
					</p>
					<a-button
						type="primary"
						style="display: block; margin: 30px auto; width: 200px"
						@click="
							() => {
								passModifyIsShow = false;
							}
						"
						>确定</a-button
					>
				</template>
			</a-modal>
		</a-card>
	</div>
</template>
<script>
import { API_COMPANYUSERMODIFYPASSOWRD } from '@/v2/api/account';
import pick from 'lodash/pick';
import { mapGetters, mapActions } from 'vuex';
import { encryptedData } from '@/v2/utils/factory';

export default {
	data() {
		let validateOldPassword = (rule, value, callback) => {
			if (value == '') {
				callback(new Error('请输入原密码'));
			} else {
				//校验原密码是否正确  需要后台提供接口
				callback();
			}
		};
		let validateNewPassword = (rule, value, callback) => {
			if (value == '') {
				callback(new Error('请填写6-20位登录密码，支持数字、字母、符号组合，区分大小写'));
			} else {
				if (value.length >= 6 && value.length <= 20) {
					callback();
				} else {
					callback(new Error('请填写6-20位登录密码，支持数字、字母、符号组合，区分大小写'));
				}
			}
		};
		let validateRePassword = (rule, value, callback) => {
			if (value == '') {
				callback(new Error('请再次输入新的登录密码'));
			} else {
				if (this.ruleForm.newPassword == value) {
					callback();
				} else {
					callback(new Error('两次密码输入不一样'));
				}
			}
		};
		return {
			ruleForm: {
				oldPassword: '',
				newPassword: '',
				rePassword: '',
				loginName: ''
			},
			rules: {
				oldPassword: [{ required: true, validator: validateOldPassword, trigger: 'blur' }],
				newPassword: [{ required: true, validator: validateNewPassword, trigger: 'blur' }],
				rePassword: [{ required: true, validator: validateRePassword, trigger: 'blur' }]
			},
			passModifyIsShow: false, // 修改密码弹窗
			editIsShow: true // 修改密码输入框展示
		};
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		})
	},
	mounted() {
		this.ruleForm.loginName = this.VUEX_ST_COMPANYSUER.account;
		this.VUEX_USER_TOKEN();
	},

	methods: {
		...mapActions({
			VUEX_USER_TOKEN: 'user/VUEX_USER_TOKEN'
		}),
		handleSubmit(formName) {
			this.$refs[formName].validate(async valid => {
				if (valid) {
					const params = pick(this.ruleForm, ['oldPassword', 'newPassword']);
					API_COMPANYUSERMODIFYPASSOWRD(
						{
							oldPassword: await encryptedData(params.oldPassword),
							newPassword: await encryptedData(params.newPassword)
						},
						this.VUEX_ST_COMPANYSUER.companyUserId
					).then(res => {
						if (res.success) {
							this.editIsShow = false; // 展示修改成功文案
						}
					});
				}
			});
		},
		showPassModal() {
			// 修改企业账号密码展示弹窗和可编辑页
			this.passModifyIsShow = true;
			this.editIsShow = true;
		}
	}
};
</script>
<style lang="less" scoped>
.slMain {
	margin-top: -10px;
}
.s-card-title {
	margin: 6px 0 16px;
	font-family: PingFangSC-Medium;
	font-size: 16px;
	color: #141517;
	letter-spacing: 0;
	line-height: 24px;
}
.s-card-content {
	padding: 28px 0;
	border-top: 1px solid #eef0f2;
	h2 {
		font-style: normal;
		font-family: PingFangSC-Medium;
		font-size: 16px;
		color: #383a3f;
		letter-spacing: 0;
		line-height: 24px;
	}
}
.passRow {
	color: #141517;
	letter-spacing: 0;
	line-height: 22px;
	margin-top: 36px;
}
::v-deep.ant-modal-body {
	padding: 20px 32px 12px 20px;
}
::v-deep.ant-modal-title {
	font-family: PingFangSC-Medium;
	font-size: 16px;
	color: #383a3f;
	letter-spacing: 0;
	line-height: 24px;
}
::v-deep.ant-form-item-label {
	text-align: left;
}
.cancel {
	margin-right: 18px;
	width: 70px;
	margin-top: 10px;
	background: rgba(255, 255, 255, 0);
	border: 1px solid @primary-color;
	color: @primary-color;
}
.wrapper {
	margin: -10px -20px -20px;
}
.methods-wrap {
	width: 100%;
	height: 48px;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	padding-bottom: 14px;
	box-sizing: border-box;
	border-bottom: 1px solid #e5e6eb;
}
</style>
