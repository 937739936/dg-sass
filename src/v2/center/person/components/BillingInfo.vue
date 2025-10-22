<template>
	<div style="padding-top: 5px">
		<a-form
			v-if="!isEdit"
			:form="formShow"
			v-bind="formLayout"
		>
			<a-row class="row">
				<a-col
					class="flex-box"
					:span="12"
				>
					<a-form-item
						label="企业名称"
						:colon="false"
					>
						{{ billingInfo.companyName }}
					</a-form-item>
				</a-col>
				<a-col
					class="flex-box"
					:span="12"
				>
					<a-form-item
						label="税号"
						:colon="false"
					>
						{{ billingInfo.companyUscc }}
					</a-form-item>
				</a-col>
				<a-col
					class="flex-box"
					:span="12"
				>
					<a-form-item
						label="企业地址"
						:colon="false"
					>
						{{ billingInfo.address }}
					</a-form-item>
				</a-col>
				<a-col
					class="flex-box"
					:span="12"
				>
					<a-form-item
						label="电话号码"
						:colon="false"
					>
						{{ billingInfo.contactPhone }}
					</a-form-item>
				</a-col>
				<a-col
					class="flex-box"
					:span="12"
				>
					<a-form-item
						label="开户行"
						:colon="false"
					>
						{{ billingInfo.subbranchName }}
					</a-form-item>
				</a-col>
				<a-col
					class="flex-box"
					:span="12"
				>
					<a-form-item
						label="银行账户"
						:colon="false"
					>
						{{ billingInfo.accountNo }}
					</a-form-item>
				</a-col>
			</a-row>
		</a-form>

		<a-form
			v-else
			:form="form"
			v-bind="formLayout"
		>
			<a-row class="row">
				<a-col
					class="flex-box"
					:span="12"
				>
					<a-form-item
						label="企业名称"
						:colon="false"
					>
						{{ billingInfo.companyName }}
					</a-form-item>
				</a-col>
				<a-col
					class="flex-box"
					:span="12"
				>
					<a-form-item
						label="税号"
						:colon="false"
					>
						{{ billingInfo.companyUscc }}
					</a-form-item>
				</a-col>
				<a-col
					class="flex-box"
					:span="12"
				>
					<a-form-item
						label="企业地址"
						:colon="false"
					>
						<a-input
							v-decorator="[
								'address',
								{
									rules: [{ required: true, message: '企业地址必填' }],
									validateTrigger: 'blur'
								}
							]"
						>
						</a-input>
					</a-form-item>
				</a-col>
				<a-col
					class="flex-box"
					:span="12"
				>
					<a-form-item
						label="电话号码"
						:colon="false"
					>
						<a-input
							class="mobile"
							placeholder="支持手机号和座机号填报,座机号格式：(区号)+电话号码,括号为英文字符"
							v-decorator="[
								'contactPhone',
								{
									rules: [{ required: true, message: '电话号码必填' }, { validator: validIdTel }],
									validateTrigger: 'blur'
								}
							]"
						>
						</a-input>
					</a-form-item>
				</a-col>
			</a-row>
			<a-row class="row">
				<a-col
					class="flex-box"
					:span="12"
				>
					<a-form-item
						label="开户行"
						:colon="false"
					>
						<a-input
							v-decorator="[
								'subbranchName',
								{
									rules: [{ required: true, message: `开户行必填` }],
									validateTrigger: 'blur'
								}
							]"
						>
						</a-input>
					</a-form-item>
				</a-col>
				<a-col
					class="flex-box"
					:span="12"
				>
					<a-form-item
						label="银行账户"
						:colon="false"
					>
						<a-input
							v-decorator="[
								'accountNo',
								{
									rules: [{ required: true, message: `银行账户必填` }],
									validateTrigger: 'blur'
								}
							]"
						>
						</a-input>
					</a-form-item>
				</a-col>
			</a-row>
		</a-form>
		<a-row
			type="flex"
			justify="center"
			align="middle"
		>
			<a-button
				v-auth="'company:invoice:edit'"
				ghost
				class="button"
				type="primary"
				v-if="!isEdit"
				@click="edit()"
			>
				编辑
			</a-button>
			<template v-else>
				<a-button
					style="margin-right: 8px"
					@click="handleOk()"
					type="primary"
					html-type="submit"
					class="search-btn"
				>
					确认
				</a-button>
				<a-button @click="isEdit = false">取消</a-button>
			</template>
		</a-row>
	</div>
</template>

<script>
import { API_COMPANYINVOICEDETAIL, API_COMPANYINVOICESAVE } from '@/v2/api/account';

export default {
	name: 'BaseInfo',

	data() {
		return {
			isEdit: false,
			billingInfo: {},
			form: this.$form.createForm(this),
			formShow: this.$form.createForm(this),
			formLayout: {
				labelCol: {
					span: 4
				},
				wrapperCol: {
					span: 20
				}
			},
			colSpan: 12
		};
	},
	created() {
		this.getBillingInfo();
	},
	methods: {
		// 校验注册电话
		validIdTel(rule, value, callback) {
			const isMobilePhone = /1[0-9][0-9]{9}$/;
			const isFixMob = /^(\(\d{3,4}\))\d{7,9}$/;
			if (value || value === 0) {
				if (isFixMob.test(value) || isMobilePhone.test(value)) {
					callback();
				} else {
					callback('注册电话格式不正确');
				}
			} else {
				callback();
			}
		},
		handleOk() {
			this.form.validateFields((err, values) => {
				if (!err) {
					API_COMPANYINVOICESAVE(values).then(res => {
						if (!res.success) {
							this.$message.error(res.message);
							return;
						}
						this.$message.success('操作成功');
						this.getBillingInfo();
					});
					this.isEdit = false;
				}
			});
		},

		getBillingInfo() {
			API_COMPANYINVOICEDETAIL().then(res => {
				if (res.success) {
					this.billingInfo = res.data;
				}
			});
		},

		edit() {
			this.isEdit = true;
			this.$nextTick(() => {
				this.form.setFieldsValue({
					address: this.billingInfo ? this.billingInfo.address : '',
					contactPhone: this.billingInfo ? this.billingInfo.contactPhone : '',
					subbranchName: this.billingInfo ? this.billingInfo.subbranchName : '',
					accountNo: this.billingInfo ? this.billingInfo.accountNo : '',
					id: this.billingInfo ? this.billingInfo.id : ''
				});
			});
		}
	}
};
</script>
<style lang="less" scoped>
.button {
	padding: 0 58px;
	height: 32px;
	right: 0;
	z-index: 9;
}
p {
	color: #383a3f;
	line-height: 32px;
	padding-bottom: 10px;
}
.row {
	padding-bottom: 22px;
}
.flex-box {
	display: flex;
	> div {
		padding-right: 10px;
		color: #6b6f76;
		line-height: 18px;
	}
}

::v-deep {
	.ant-form-item {
		width: 100%;
		margin-bottom: 0;
		div label {
			color: #6b6f76;
		}
	}
	.ant-form-item-label {
		text-align: left;
	}
	.ant-form-item-children {
		color: #383a3f;
	}
}
.mobile.ant-input {
	&::placeholder {
		font-size: 13px;
		text-overflow: inherit;
		color: #8c8e91;
	}
}
</style>
