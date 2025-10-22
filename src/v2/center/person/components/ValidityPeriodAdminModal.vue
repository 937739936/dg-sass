<template>
	<a-modal
		class="modal-wrap"
		title="编辑身份证有效期"
		:visible="visible"
		:confirm-loading="confirmLoading"
		@ok="handleOk"
		@cancel="handleCancel"
	>
		<a-form
			:form="updateFormAgent"
			:colon="false"
			class="a-popconfirm-form"
			layout="horizontal"
		>
			<a-form-item label="身份证有效期（起）">
				<a-date-picker
					style="width: 100%"
					placeholder="请选择身份证有效期（起）"
					v-decorator="[
						`adminCardValidTimeStart`,
						{
							initialValue: companyInfo.adminCardValidTimeStart || null,
							rules: [
								{
									required: true,
									message: `身份证有效期必填`
								}
							]
						}
					]"
				/>
			</a-form-item>
			<a-form-item label="身份证有效期（止）">
				<a-row
					type="flex"
					justify="space-between"
					align="middle"
				>
					<a-date-picker
						style="width: 70%"
						placeholder="请选择身份证有效期（止）"
						:disabled="updateFormAgent.getFieldValue('adminCardIsLongValid')"
						v-decorator="[
							`adminCardValidTimeEnd`,
							{
								rules: [
									{
										required: updateFormAgent.getFieldValue('adminCardIsLongValid') ? false : true,
										message: `身份证有效期必填`
									}
								]
							}
						]"
					/>
					<a-checkbox
						style="margin-left: 10px"
						v-decorator="[
							'adminCardIsLongValid',
							{
								initialValue: companyInfo.adminCardIsLongValid || false,
								rules: [{ required: false }],
								valuePropName: 'checked'
							}
						]"
						@change="updateFormAgent.resetFields(['adminCardValidTimeEnd'])"
						>长期有效</a-checkbox
					>
				</a-row>
			</a-form-item>
		</a-form>
	</a-modal>
</template>
<script>
import { mapGetters } from 'vuex';
import { cloneDeep } from 'lodash';
import moment from 'moment';
import {
	API_ModifyAdminIdCardValidity,
} from '@/v2/api/account';

export default {
	props: {
		companyInfo: {
			type: Object,
			default() {
				return {};
			}
		}
	},
	data() {
		return {
			visible: false,
			confirmLoading: false,
			updateFormAgent: this.$form.createForm(this, { name: 'coordinated' })
		};
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		})
	},
	methods: {
		showModal(data) {
			this.visible = true;
      this.$nextTick(() => {
        this.updateFormAgent.setFieldsValue(data);
      });
		},
		handleOk() {
			this.updateFormAgent.validateFields((err, values) => {
				if (!err) {
          this.confirmLoading = true;
					const cloneValues = cloneDeep(values);
					cloneValues.cardValidTimeStart = values.adminCardValidTimeStart
						? moment(values.adminCardValidTimeStart).format('YYYY-MM-DD')
						: null;
					cloneValues.cardValidTimeEnd = values.adminCardValidTimeEnd
						? moment(values.adminCardValidTimeEnd).format('YYYY-MM-DD')
						: null;
						cloneValues.cardIsLongValid = values.adminCardIsLongValid;
					delete cloneValues.adminCardIsLongValid;
					delete cloneValues.adminCardValidTimeStart;
					delete cloneValues.adminCardValidTimeEnd;
					API_ModifyAdminIdCardValidity({
						companyId: this.VUEX_ST_COMPANYSUER.companyId,
						legalPersonMobile: this.companyInfo.legalPersonMobile,
						...cloneValues
					}).then(res => {
						if (res.success) {
							this.visible = false;
							this.$message.success('修改成功！');
							this.$emit('update', true);
						}
					}).finally(() => {
            this.confirmLoading = false;
          }).catch(err => {
            console.info(err);
          });
				}
			});
		},
		handleCancel() {
			this.visible = false;
      this.confirmLoading = false;
      this.updateFormAgent.resetFields();
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/modal.less');
@import url('~@/v2/style/modal-form.less');
@import url('~@/v2/style/popover-reset.less');
</style>
<style lang="less" scoped>
.a-popconfirm-form {
	padding: 30px 20px;
}
</style>