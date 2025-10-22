<template>
	<a-form
		:form="form"
		class="slFormDetail"
		@submit="handleSubmit"
	>
		<a-row>
			<a-col :span="8">
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
import { mapMutations, mapGetters } from 'vuex';
import { getPopupContainer } from '@/v2/utils/factory.js';
import { API_GETOAAUDITCODELIST } from '@/v2/center/trade/api/contract';
import workflowOa from '@/v2/components/workflow.vue';

export default {
	data() {
		return {
			form: this.$form.createForm(this, { name: 'workFlow' }),
			coalCcsMsList: [],
			systemVOList: [],
			defaultRelationValue: {}
		};
	},
	components: {
		workflowOa
	},
	computed: {
		...mapGetters('contract', {
			VUEX_GET_CONTRACT_DATA: 'VUEX_GET_CONTRACT_DATA'
		}),
		ccsFormList() {
			return this.VUEX_GET_CONTRACT_DATA?.contract?.auditChainAndOperator?.operatorInfo;
		}
	},
	mounted() {
		this.getOaDataList();
	},
	methods: {
		getPopupContainer,
		initFormData() {
			this.$nextTick(() => {
				if (this.VUEX_GET_CONTRACT_DATA?.contract?.auditChainAndOperator) {
					let itemList = {};
					this.VUEX_GET_CONTRACT_DATA?.contract?.auditChainAndOperator?.operatorInfo?.forEach(item => {
						itemList = {
							...itemList,
							[item.systemCode]: {
								...item
							}
						};
					});
					this.selectChange(this.VUEX_GET_CONTRACT_DATA.contract.auditChainAndOperator.chainCode);
					this.defaultRelationValue = itemList;
					this.form.setFieldsValue({
						...this.VUEX_GET_CONTRACT_DATA?.contract?.auditChainAndOperator
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
				type = 'start';
			} else {
				if (index == 0) {
					type = 'center';
				} else {
					type = 'end';
				}
			}
			return type;
		},
		...mapMutations({
			VUEX_SET_STEP1_CONTRACT_DATA: 'contract/VUEX_SET_STEP1_CONTRACT_DATA'
		}),
		handleSubmit() {
			return new Promise(resolve => {
				this.form.validateFields((err, value) => {
					if (!err) {
						this.VUEX_SET_STEP1_CONTRACT_DATA({
							contract: {
								auditChainAndOperator: {
									chainName: this.coalCcsMsList.filter(item => item.chainCode == value.chainCode)[0].chainName,
									chainCode: value.chainCode,
									operatorInfo: this.selectValueMap()
								}
							}
						});
						resolve(true);
					} else {
						resolve(false);
					}
				});
			});
		},
		getOaDataList() {
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
			this.systemVOList = this.coalCcsMsList.filter(item => item.chainCode === id)[0].systemVOList;
			this.defaultRelationValue = {};
		},
		selectValueMap() {
			let result = [];
			for (const key in this.defaultRelationValue) {
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
