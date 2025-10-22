<template>
	<a-modal
		v-model="visible"
		destroyOnClose
		title="验证加入企业"
		okText="验证并加入"
		@ok="handleOk"
		@cancel="visible = false"
	>
		<div class="apply-des">企业管理员邀请您加入后，您的手机号将收到相应的邀请码，验邀请码有效时间为24小时</div>
		<a-form
			:form="form"
			v-bind="formLayout"
		>
			<a-form-item
				label="邀请码"
				:colon="false"
			>
				<a-input
					style="width: 300px"
					placeholder="请输入邀请码"
					v-decorator="[
						'code',
						{
							rules: [{ required: true, message: '邀请码必填' }],
							validateTrigger: 'blur'
						}
					]"
				>
				</a-input>
			</a-form-item>
		</a-form>
	</a-modal>
</template>
<script>
import { API_COMPANYUSERINVITEJOINCOMPANY } from '@/v2/api/account';
import { mapActions } from 'vuex';

export default {
	name: 'VerifyJoinCompany',

	data() {
		return {
			visible: false,
			form: this.$form.createForm(this),
			formLayout: {
				labelCol: { span: 5 },
				wrapperCol: { span: 10 }
			}
		};
	},

	methods: {
		...mapActions({
			VUEX_USER_LOGOUT: 'user/VUEX_USER_LOGOUT'
		}),
		showModal() {
			this.visible = true;
		},
		// 邀请码加入
		handleOk() {
			this.form.validateFields((err, values) => {
				if (!err) {
					API_COMPANYUSERINVITEJOINCOMPANY({ inviteCode: values.code }).then(res => {
						if (res.success) {
							this.$message.success('恭喜您，验证通过，请退出后重新登录。');
							this.visibleVerified = false;
							this.VUEX_USER_LOGOUT();
						}
					});
				}
			});
		}
	}
};
</script>
