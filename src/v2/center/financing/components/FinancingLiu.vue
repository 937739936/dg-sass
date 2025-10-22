<template>
	<a-form
		:form="financingApplyForm"
		v-if="oaflag"
	>
		<div class="rz-content">
			<div class="title">审批流</div>
			<a-row>
				<a-form-item label="流程选择">
					<a-select
						v-decorator="[
							'COAL_CCS_MS',
							{
								rules: [
									{
										required: !disabled,
										message: `流程选择必填`
									}
								],
								validateTrigger: 'change'
							}
						]"
						:disabled="disabled"
						placeholder="请选择"
						label-in-value
						@change="items => chainCodeChange(items, true)"
					>
						<a-select-option
							v-for="(items, index) in oaauditcodelist"
							:key="index"
							:value="items.chainCode"
						>
							{{ items.chainName }}
						</a-select-option>
					</a-select>
				</a-form-item>
			</a-row>
			<a-row
				v-for="(item, index) in systemVOList"
				:key="index"
			>
				<a-form-item
					:key="index"
					:label="item.systemName"
				>
					<workflow-oa
						v-decorator="[
							item.systemCode,
							{
								rules: [{ required: !disabled, message: `${item.systemName}必填` }],
								validateTrigger: 'change'
							}
						]"
						:disabled="disabled"
						:system="item"
						:valueDefault="defaultRelationValue[item.systemCode]"
						@select="getSelectValue"
						:ref="item.systemCode"
					/>
				</a-form-item>
			</a-row>
		</div>
	</a-form>
</template>

<script>
import { API_GETFINOAAUDITCODELIST, API_COMPANYOACHECKFIN, API_GETOAUSERBYKEYWORD, API_COMPANYOACHECKPOOL } from '@/api/index.js';
import _ from 'lodash';
import workflowOa from '@/v2/components/workflow.vue';
import { cloneDeep } from 'lodash';
export default {
	/*
        /**bizType
     * 货押融资申请
     */
	// MORTGAGE_FINANCING_APPLY(2),

	/**
	 * 质押物置换
	 */
	// MORTGAGE_REPLACE(2),

	/**
	 * 赎货
	 */
	// MORTGAGE_REDEEM(2),

	/**
	 * 补货
	 */
	// MORTGAGE_REPLENISHMENT(2);

	/**
	 * 补保证金
	 */
	// MARGIN_REPLENISHMENT(2);

	/**
	 * 池资产
	 */
	// ASSET_RECEIVABLE(2);

	props: ['bizType', 'data', 'disabled'],
	data() {
		return {
			financingApplyForm: this.$form.createForm(this),
			oaauditcodelist: [],
			auditChainAndOperator: {},
			oaflag: false,
			systemVOList: [],
			CCS_OA: [],
			MS_OA: [],
			RORY_OA: [],
			defaultRelationValue: {}
		};
	},
	components: {
		workflowOa
	},
	computed: {},

	mounted() {
		if (this.bizType == 'ASSET_RECEIVABLE') {
			API_COMPANYOACHECKPOOL({ bizType: this.bizType }).then(res => {
				if (res.success) {
					this.oaflag = res.data;
					this.getoaauditcodelist(this.oaflag);
				}
			});
		} else {
			API_COMPANYOACHECKFIN({ bizType: this.bizType }).then(res => {
				if (res.success) {
					this.oaflag = res.data;
					this.getoaauditcodelist(this.oaflag);
				}
			});
		}
	},
	methods: {
		getSelectValue(item) {
			const itemClone = cloneDeep(item);
			itemClone.operatorName = item.USERNAME;
			itemClone.operatorMobile = item.MOBILE;
			delete itemClone.USERNAME;
			delete itemClone.MOBILE;
			const systemCodeArr = (this.auditChainAndOperator?.operatorInfo || []).map(item => item.systemCode);
			const index = systemCodeArr.indexOf(itemClone.systemCode);
			if (index >= 0) {
				this.auditChainAndOperator.operatorInfo[index] = itemClone;
			} else {
				this.auditChainAndOperator.operatorInfo.push(itemClone);
			}
		},
		getSystemVOListFromList(chainCode) {
			for (let i = 0; i < this.oaauditcodelist.length; i++) {
				if (this.oaauditcodelist[i].chainCode === chainCode) {
					return this.oaauditcodelist[i].systemVOList;
				}
			}
		},
		chainCodeChange(v, isNeedEmpty = false) {
			this.systemVOList = v.systemVOList || this.getSystemVOListFromList(v.key || v.chainCode);

			this.auditChainAndOperator = {
				chainName: v?.label?.replace(/\n|\s/g, '') || v?.chainName,
				chainCode: v.key || v.chainCode,
				operatorInfo: isNeedEmpty ? [] : this.auditChainAndOperator.operatorInfo
			};
			(this.systemVOList || []).forEach(item => {
				this[`handleSearchYu${item.systemCode}`] = v => {
					this.handleSearchYu(v, item.systemCode);
				};
			});
			if (isNeedEmpty) {
				(this.systemVOList || []).forEach(item => {
					this.financingApplyForm.setFieldsValue({
						[item.systemCode]: null
					});
					this.$nextTick(() => {
						if (this.$refs[item.systemCode].length) {
							this.$refs[item.systemCode][0].resetValue();
						}
					});
				});
			}
		},
		getoaauditcodelist(oaflag) {
			if (oaflag) {
				API_GETFINOAAUDITCODELIST().then(res => {
					if (res.success) {
						this.oaauditcodelist = res.data;

						this.chainCodeChange(this.oaauditcodelist[0]);

						this.dealWithEdit();
					}
				});
			}
		},
		dealWithEdit() {
			setTimeout(() => {
				if (this.data) {
					var temp = {};

					var _systemVOList = [];

					for (var i = 0; i < this.data.operatorInfo.length; i++) {
						var item = this.data.operatorInfo[i];

						temp = {
							...temp,
							[item.systemCode]: item
						};

						this.defaultRelationValue[item.systemCode] = item;
						_systemVOList.push(item);
					}

					this.financingApplyForm.setFieldsValue({
						COAL_CCS_MS: {
							label: this.data.chainName,
							value: this.data.chainCode
						}
					});

					this.systemVOList = _systemVOList;
					this.$nextTick(() => {
						this.financingApplyForm.setFieldsValue(temp);
						this.auditChainAndOperator = cloneDeep(this.data);
					});
				}
			}, 1000);
		},
		submitCheck() {
			return new Promise((reslove, reject) => {
				if (!this.oaflag) {
					setTimeout(() => {
						reject('noflag');
					});

					return;
				}
				this.financingApplyForm.validateFields((error, values) => {
					if (error) {
						reject(false);
					} else {
						reslove(this.auditChainAndOperator);
					}
				});
			});
		},
		handleSearchYu: _.debounce(function (v, systemCode) {
			if (!v) return;

			API_GETOAUSERBYKEYWORD({ keyword: v, systemCode })
				.then(res => {
					this[`${systemCode}`] = (res.data || []).map(item => {
						return {
							...item,
							text: item.USERNAME + '-' + item.DEPARTMENTPATHNAME,
							value: item.USERNAME + ',' + item.MOBILE
						};
					});
				})
				.catch(() => {
					this[`${systemCode}`] = [];
				});
		}, 300)
	}
};
</script>

<style lang="less" scoped>
.rz-content {
	// padding: 20px;
	background-color: #fff;
	margin-bottom: 10px;
}

::v-deep .ant-form-item {
	display: flex;
	margin-bottom: 15px;
}
.title {
	font-size: 14px;
	padding: 14px 0;
	margin-bottom: 30px;
}
::v-deep .ant-form-item-control {
	width: 250px;
	input,
	textarea {
		width: 254px;
	}
}
</style>
