<template>
	<div id="orderBankForm">
		<a-row>
			<h3 style="margin: 30px 0">下游合同信息</h3>
		</a-row>
		<a-form-model
			:model="contractForm"
			:rules="rules"
			ref="contractForm"
			:label-col="{ span: 6 }"
			:wrapper-col="{ span: 16 }"
		>
			<a-row>
				<a-col
					:span="12"
					class="row"
				>
					<a-form-model-item
						label="下游签约企业名称"
						prop="additionalCompanyName"
					>
						<a-input
							:disabled="disabled"
							v-model="contractForm.additionalCompanyName"
						/>
					</a-form-model-item>
				</a-col>
				<a-col
					:span="12"
					class="row"
				>
					<a-form-model-item
						label="下游企业简称"
						prop="additionalCompanyAbbr"
					>
						<a-input
							:disabled="disabled"
							v-model="contractForm.additionalCompanyAbbr"
						/>
					</a-form-model-item>
				</a-col>
				<a-col
					:span="12"
					class="row"
				>
					<a-form-model-item
						label="下游签约合同编号"
						prop="additionalContractNo"
					>
						<a-input
							:disabled="disabled"
							v-model="contractForm.additionalContractNo"
						/>
					</a-form-model-item>
				</a-col>
			</a-row>
		</a-form-model>
	</div>
</template>

<script>
export default {
	name: 'DownstreamContractForm',
	data() {
		return {
			contractForm: {},
			rules: {
				additionalCompanyName: [{ required: true, message: `请输入下游签约企业名称`, trigger: 'blur' }],
				additionalCompanyAbbr: [{ required: true, message: `请输入下游企业简称`, trigger: 'blur' }],
				additionalContractNo: [{ required: true, message: `请输入下游合同编号`, trigger: 'blur' }]
			}
		};
	},
	props: {
		disabled: {},
		//判断是否是详情页使用该组件，默认不是详情页
		isDetail: {
			type: Boolean,
			default: false
		},
		requiredFlag: {
			type: Boolean,
			default: true
		}
	},

	mounted() {},
	watch: {
		requiredFlag: {
			handler(data) {
				this.requiredFlag = data;
				this.rules = {
					additionalCompanyName: [{ required: this.requiredFlag, message: `请输入下游签约企业名称`, trigger: 'blur' }],
					additionalCompanyAbbr: [{ required: this.requiredFlag, message: `请输入下游企业简称`, trigger: 'blur' }],
					additionalContractNo: [{ required: this.requiredFlag, message: `请输入下游合同编号`, trigger: 'blur' }]
				};
				this.$forceUpdate();
			},
			deep: true,
			immediate: true
		}
	},
	methods: {
		init(info) {
			this.contractForm = info;
		},
		save() {
			let flag = false;
			this.$refs.contractForm.validate(valid => {
				flag = valid;
			});

			if (flag) {
				return this.contractForm;
			}
			return flag;
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
