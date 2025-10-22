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
						`legalPersonCardValidTimeStart`,
						{
							initialValue: companyInfo.legalPersonCardValidTimeStart || null,
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
						:disabled="updateFormAgent.getFieldValue('legalPersonCardIsLongValid')"
						v-decorator="[
							`legalPersonCardValidTimeEnd`,
							{
								rules: [
									{
										required: updateFormAgent.getFieldValue('legalPersonCardIsLongValid') ? false : true,
										message: `身份证有效期必填`
									}
								]
							}
						]"
					/>
					<a-checkbox
						style="margin-left: 10px"
						v-decorator="[
							'legalPersonCardIsLongValid',
							{
								initialValue: companyInfo.legalPersonCardIsLongValid || false,
								rules: [{ required: false }],
								valuePropName: 'checked'
							}
						]"
						@change="updateFormAgent.resetFields(['legalPersonCardValidTimeEnd'])"
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
	API_COMPANYMODIFYABBREVIATIONLEGAL,
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
			updateFormAgent: this.$form.createForm(this, { name: 'coordinated1' })
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
					cloneValues.legalPersonCardValidTimeStart = cloneValues.legalPersonCardValidTimeStart
						? moment(cloneValues.legalPersonCardValidTimeStart).format('YYYY-MM-DD')
						: null;
					cloneValues.legalPersonCardValidTimeEnd = values.legalPersonCardValidTimeEnd
						? moment(values.legalPersonCardValidTimeEnd).format('YYYY-MM-DD')
						: null;
					API_COMPANYMODIFYABBREVIATIONLEGAL({
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