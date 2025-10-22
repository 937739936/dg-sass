<template>
	<a-form
		:form="form"
		class="slFormDetail"
		@submit="handleSubmit"
	>
		<a-row>
			<a-col
				:span="8"
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
						@change="selectChange"
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
				:span="8"
				v-for="(item, index) in systemVOList"
				:key="index"
			>
				<a-row
					type="flex"
					:justify="justifyFlex(index)"
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
				</a-row>
			</a-col>
		</a-row>
	</a-form>
</template>

<script>
import { getPopupContainer } from '@/v2/utils/factory.js';
import { API_GETOAAUDITCODELIST } from '@/v2/center/trade/api/contract';
import workflowOa from '@/v2/components/workflow.vue';
export default {
	props: {
		auditChainAndOperator: {
			type: Object,
			default: () => {
				return {};
			}
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
		auditChainAndOperator() {
			this.initFormData();
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
		initFormData(auditChainAndOperator = this.auditChainAndOperator) {
			this.$nextTick(() => {
				if (auditChainAndOperator.operatorInfo) {
					let itemList = {};
					auditChainAndOperator?.operatorInfo?.map(item => {
						itemList[item.systemCode] = item
					});
					this.selectChange(auditChainAndOperator.chainCode);
					this.defaultRelationValue = itemList;
				
					this.form.setFieldsValue({
						...auditChainAndOperator
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
		justifyFlex(index) {
			let type = 'start';
			if (this.coalCcsMsList.length == 1) {
			
				if(index == 0) {
					type = 'center';
				} else {
						type = 'end';
				}
				
			} else {
				if (index == 0) {
					type = 'center';
				} else {
					type = 'end';
				}
			}
			return type;
		},
		handleSave(form = this.form.getFieldsValue()) {
			let selectValue = this.selectValueMap();
			if (selectValue?.length) {
				return {
					auditChainAndOperator: {
						chainName: this.coalCcsMsList.filter(item => item.chainCode == form.chainCode)[0].chainName,
						chainCode: form.chainCode,
						operatorInfo: selectValue
					}
				};
			} else {
				return { auditChainAndOperator: null };
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
					this.initFormData();
					if (res.data.length === 1) {
						this.selectChange(res.data[0].chainCode);
						this.form.setFieldsValue({
							chainCode: res.data[0].chainCode,
							chainName: res.data[0].chainName
						});
					}
				}
			});
		},
		selectChange(id) {
			this.systemVOList = this.coalCcsMsList.find(item => {
				return item.chainCode === id;
			})?.systemVOList;
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
.ant-form-item {
	width: 364px;
}
</style>
