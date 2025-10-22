<template>
	<div class="slMain">
		<a-form
			:form="form"
			class="slFormDetail"
		>
			<a-row>
				<a-col
					:span="span"
					v-show="coalCcsMsList.length > 1"
				>
					<a-form-item label="审批流程">
						<a-select
							placeholder="请选择审批流"
							:getPopupContainer="getPopupContainer"
							:notFoundContent="!coalCcsMsList.length ? '暂无数据' : '加载中...'"
							v-decorator="[
								`chainCode`,
								{
									rules: [
										{
											required: true,
											message: `审批流程必填`,
											type: 'string'
										}
									]
								}
							]"
							@change="e => selectChange(e, 0)"
						>
							<a-select-option
								v-for="(items, index) in coalCcsMsList"
								:key="index"
								:value="items.chainCode"
							>
								{{ items.chainName }}
							</a-select-option>
						</a-select>
					</a-form-item>
				</a-col>
				<a-col
					:span="span"
					v-for="(item, index) in systemVOList"
					:key="index"
				>
					<a-form-item :label="item.systemName">
						<workflow-oa
							:placeholder="'请选择' + item.systemName"
							v-decorator="[
								item.systemCode,
								{
									rules: [{ required: true, message: `${item.systemName}必填` }],
									validateTrigger: 'change'
								}
							]"
							@select="getSelectValue"
							:system="item"
							:ref="item.systemCode"
							:valueDefault="defaultRelationValue[item.systemCode]"
							:value="defaultRelationValue[item.systemCode]"
						/>
					</a-form-item>
				</a-col>
			</a-row>
		</a-form>
	</div>
</template>

<script>
import { getPopupContainer } from '@/v2/utils/factory.js';
import { API_GETOAAUDITCODELIST } from '@/v2/center/trade/api/contract';
import workflowOa from '@/v2/components/workflow.vue';
export default {
	props: {
		auditChain: {
			type: Object,
			default: () => {
				return {};
			}
		},
		span: {
			type: Number,
			default: 24
		}
	},
	data() {
		return {
			form: this.$form.createForm(this, { name: 'workFlow' }),
			coalCcsMsList: [],
			systemVOList: [],
			defaultRelationValue: {}
		};
	},
	watch: {
		auditChain() {
			this.$nextTick(() => {
				this.initFormData();
			});
		}
	},
	components: {
		workflowOa
	},
	computed: {},
	mounted() {
		this.getOaDataList();
	},
	methods: {
		getPopupContainer,
		initFormData(auditChain = this.auditChain) {
			this.$nextTick(() => {
				if (auditChain?.operatorInfo) {
					let itemList = {};
					auditChain?.operatorInfo?.map(item => {
						itemList = {
							...itemList,
							[item.systemCode]: {
								...item
							}
						};
					});
					this.selectChange(auditChain.chainCode, 1);
					this.defaultRelationValue = itemList;
					this.form.setFieldsValue({
						...auditChain
					});
					this.$nextTick(() => {
						for (const key in this.defaultRelationValue) {
							this.form.setFieldsValue({
								[key]: this.defaultRelationValue[key].operatorName + '-' + this.defaultRelationValue[key].operatorMobile
							});
						}
					});
				}
			});
		},
		handleSave(form = this.form.getFieldsValue()) {
			let selectValue = this.selectValueMap();
			if (selectValue?.length) {
				return {
					auditChain: {
						chainName: this.coalCcsMsList.filter(item => item.chainCode == form.chainCode)[0].chainName,
						chainCode: form.chainCode,
						operatorInfo: selectValue
					}
				};
			} else {
				return { auditChain: null };
			}
		},
		handleSubmit() {
			return new Promise(resolve => {
				this.form.validateFieldsAndScroll((err, value) => {
					if (!err) {
						resolve(this.handleSave(value));
					} else {
						resolve(false);
					}
				});
			});
		},
		async getOaDataList() {
			API_GETOAAUDITCODELIST().then(res => {
				if (res.success) {
					this.coalCcsMsList = res.data;
					this.$nextTick(() => {
						this.initFormData();
						if (res.data.length === 1) {
							this.selectChange(res.data[0].chainCode, 1);
							this.form.setFieldsValue({
								chainCode: res.data[0].chainCode,
								chainName: res.data[0].chainName
							});
						}
					});
				}
			});
		},
		selectChange(id, type = 0) {
			this.systemVOList = this.coalCcsMsList.find(item => {
				return item.chainCode === id;
			})?.systemVOList;
			if (type == 0) {
				this.defaultRelationValue = {};
			}
		},
		selectValueMap() {
			let result = [];
			for (let key in this.defaultRelationValue) {
				result.push(this.defaultRelationValue[key]);
			}
			return result;
		},
		getSelectValue(item) {
			this.defaultRelationValue[item.systemCode] = item;
		}
	}
};
</script>

<style lang="less" scoped>
.slMain {
	margin: 0;
	background: none;
	.tip {
		color: rgba(0, 0, 0, 0.4);
		font-size: 14px;
		line-height: 22px;
	}
	.ant-form-item {
		width: 100%;
		max-width: 364px;
	}
}
</style>
