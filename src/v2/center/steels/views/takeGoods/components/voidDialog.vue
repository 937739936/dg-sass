<!--
 * @Author: liupengbo liupengbo@shdatalink.com
 * @Description: file content
-->
<template>
	<a-modal
		:title="label"
		:visible="visible"
		:confirm-loading="confirmLoading"
		@ok="handleSubmit"
		@cancel="handleCancel"
	>
		<a-form
			:form="form"
			:label-col="{ span: 5 }"
			:wrapper-col="{ span: 12 }"
		>
			<a-form-item :label="`${label}原因`">
				<a-input
					:maxLength="50"
					v-decorator="[paramsKey, { rules: [{ required: true, message: `请输入${label}原因!` }] }]"
				/>
			</a-form-item>
		</a-form>
	</a-modal>
</template>

<script>
export default {
	props: {
		label: {
			default: '作废'
		},
		fn: {
			default: function () {}
		},
		paramsKey: {
			default: 'rejectReason'
		}
	},
	data() {
		return {
			visible: false,
			confirmLoading: false,
			form: this.$form.createForm(this, { name: 'form' }),
			item: {}
		};
	},
	methods: {
		showModal(item, extraParams = {}) {
			this.item = item;
			this.extraParams = {};
			this.visible = true;
		},
		handleCancel(e) {
			this.form.resetFields();
			this.visible = false;
		},
		handleSubmit() {
			this.form.validateFields(async (err, values) => {
				if (!err) {
					this.confirmLoading = true;
					const params = {
						id: this.item.id,
						...this.form.getFieldsValue(),
						...this.extraParams
					};
					try {
						const res = await this.fn(params);
						this.$message.success('提交成功');
						this.$emit('update');
						this.visible = false;
						this.confirmLoading = false;
					} catch (error) {
						this.confirmLoading = false;
					}
				}
			});
		}
	}
};
</script>

<style></style>
