<template>
	<div id="orderBankForm">
		<a-row>
			<h3 style="margin: 30px 0">下游合同信息</h3>
		</a-row>
		<a-form
			:form="contractForm"
			onValuesChange="fieldsChange"
			:label-col="{ span: 6 }"
			:wrapper-col="{ span: 16 }"
		>
			<a-row>
				<a-col
					:span="12"
					class="row"
				>
					<a-form-item label="下游签约企业名称">
						<a-input
							:disabled="disabled"
							v-decorator="[
								`additionalCompanyName`,
								{
									rules: [{ required: true, message: `下游签约企业名称必填` }]
								}
							]"
						/>
					</a-form-item>
				</a-col>
				<a-col
					:span="12"
					class="row"
				>
					<a-form-item label="下游企业简称">
						<a-input
							:disabled="disabled"
							v-decorator="[
								`additionalCompanyAbbr`,
								{
									rules: [{ required: true, message: `下游企业简称必填` }]
								}
							]"
						/>
					</a-form-item>
				</a-col>
				<a-col
					:span="12"
					class="row"
				>
					<a-form-item label="下游合同编号">
						<a-input
							:disabled="disabled"
							v-decorator="[
								`additionalContractNo`,
								{
									rules: [{ required: true, message: `下游合同编号必填` }]
								}
							]"
						/>
					</a-form-item>
				</a-col>
			</a-row>
		</a-form>
	</div>
</template>

<script>
export default {
	name: 'DownstreamContractForm',
	data() {
		return {
			contractForm: this.$form.createForm(this, {
				onValuesChange: this.fieldsChange
			})
		};
	},
	props: {
		disabled: {},
		//判断是否是详情页使用该组件，默认不是详情页
		isDetail: {
			type: Boolean,
			default: false
		}
	},
	mounted() {},
	methods: {
		getFormValue() {
			return {
				additionalCompanyName: this.contractForm.getFieldValue('additionalCompanyName'),
				additionalCompanyAbbr: this.contractForm.getFieldValue('additionalCompanyAbbr'),
				additionalContractNo: this.contractForm.getFieldValue('additionalContractNo')
			};
		},
		setData(data) {
			this.contractForm.setFieldsValue(data);
		}
	}
};
</script>

<style lang="less">
#orderBankForm {
	h3 {
		font-size: 18px;
	}

	.row {
		height: 60px;
	}

	.rowH {
		height: 90px;
	}

	.ant-select-selection--single {
		height: 60px;
	}

	.ant-select-selection__rendered {
		line-height: 60px;
	}

	.ant-select-selection-selected-value {
		p {
			line-height: 30px;
		}
	}

	label[for='sellerInfo'] {
		line-height: 60px;
	}

	label[for='buyerInfo'] {
		line-height: 60px;
	}
}
</style>
