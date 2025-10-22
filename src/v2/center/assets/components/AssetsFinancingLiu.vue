<template>
	<div v-if="oaflag">
		<div class="slTitleAssis">审批流程</div>
		<a-form
			:form="form"
			:colon="false"
			class="slFormDetail"
		>
			<div class="rz-content">
				<a-row>
					<a-col :span="8">
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
					</a-col>
					<a-col
						:span="8"
						v-for="(item, index) in systemVOList"
						:key="index"
					>
						<a-row
							type="flex"
							:justify="getJustifyStyle(index)"
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
					</a-col>
				</a-row>
			</div>
		</a-form>
	</div>
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
			form: this.$form.createForm(this, { onValuesChange: this.onValuesChange }),
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
	inject: {
		isNeedNextChangeParent: { form: 'isNeedNextChangeParent', default: null }
	},

	methods: {
		getJustifyStyle(index) {
			return ['center', 'end', 'start'][index % 3];
		},
		onValuesChange(props, values) {
			if (this.isNeedNextChangeParent) {
				this.isNeedNextChangeParent();
			}
		},

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
					this.form.setFieldsValue({
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
							[item.systemCode]: { value: item }
						};

						this.defaultRelationValue[item.systemCode] = item;
						_systemVOList.push(item);
					}

					this.form.setFields({
						COAL_CCS_MS: {
							value: {
								label: this.data.chainName,
								value: this.data.chainCode
							}
						}
					});

					this.systemVOList = _systemVOList;
					this.$nextTick(() => {
						this.form.setFields(temp);
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
				this.form.validateFields((error, values) => {
					if (error) {
						reject(false);
					} else {
						// let { key, label } = values.COAL_CCS_MS;
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
.slTitleAssis {
	margin-bottom: 20px;
}
.slFormDetail {
	padding: 0;
	margin: 0;
}
.rz-content {
	// padding: 20px;
	background-color: #fff;
	margin-bottom: 10px;
	.ant-col {
		min-height: 82px;
	}
	.ant-form-item {
		width: 364px;
		margin-bottom: 10;
	}
}

// ::v-deep .ant-form-item {
// 	display: flex;
// 	margin-bottom: 15px;
// }
// .title {
// 	font-size: 14px;
// 	padding: 14px 0;
// 	margin-bottom: 30px;
// }
// ::v-deep .ant-form-item-control {
// 	width: 250px;
// 	input,
// 	textarea {
// 		width: 254px;
// 	}
// }
</style>
