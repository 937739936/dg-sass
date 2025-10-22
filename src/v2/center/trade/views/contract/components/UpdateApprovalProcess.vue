<template>
	<a-modal
		class="slModal"
		:visible="visible"
		title="修改审批流"
		@cancel="close"
		:width="oaauditcodelist.length > 1 ? 550 : 408"
	>
		<p class="reminder-tips">修改后，该合同向下新的审批流程将以新的流程发起人进行发起，已提交的审批流仍按照原有流程执行。</p>
		<a-form
			class="slFormDetail"
			:form="form"
		>
			<!-- 多流程 -->
			<a-row
				:gutter="20"
				v-if="oaauditcodelist.length > 1"
			>
				<a-col span="12">
					<a-form-item label="原审批流">
						<a-select
							:getPopupContainer="getPopupContainer"
							disabled
							v-decorator="[
								'COAL_CCS_MS_ORI',
								{
									rules: [{ required: true, message: `请选择修改后审批流` }]
								}
							]"
							label-in-value
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
					<a-form-item
						v-for="(item, index) in systemVOListOri"
						:key="index"
						:label="'原' + item.systemName"
						v-if="defaultRelationValue[item.systemCode]"
					>
						<workflow-oa
							v-decorator="[
								item.systemCode,
								{
									rules: [{ required: true, message: `${item.systemName}必填` }],
									validateTrigger: 'change'
								}
							]"
							:system="item"
							:valueDefault="defaultRelationValue[item.systemCode]"
							:ref="item.systemCode"
							:disabled="true"
						/>
					</a-form-item>
				</a-col>
				<a-col span="12">
					<a-form-item label="修改后审批流">
						<a-select
							:getPopupContainer="getPopupContainer"
							placeholder="请选择"
							v-decorator="[
								'COAL_CCS_MS',
								{
									rules: [{ required: true, message: `请选择修改后审批流` }]
								}
							]"
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
					<a-form-item
						:label="'修改后' + item.systemName"
						v-for="(item, index) in systemVOList"
						:key="index"
					>
						<workflow-oa
							v-decorator="[
								item.systemCode + '2',
								{
									rules: [{ required: true, message: '请选择修改后' + item.systemName }, { validator: validId }],
									validateTrigger: 'change'
								}
							]"
							:system="item"
							:valueDefault="defaultRelationValue[item.systemName]"
							@select="getSelectValue"
							:ref="item.systemName"
						/>
					</a-form-item>
				</a-col>
			</a-row>
			<template v-else>
				<a-row
					:key="index"
					v-for="(item, index) in systemVOList"
					:gutter="20"
				>
					<a-col :span="oaauditcodelist.length > 1 ? 12 : 24">
						<a-form-item
							:label="'原' + item.systemName"
							v-if="defaultRelationValue[item.systemCode]"
						>
							<workflow-oa
								v-decorator="[
									item.systemCode,
									{
										rules: [{ required: Boolean(defaultRelationValue[item.systemCode]), message: `${item.systemName}必填` }],
										validateTrigger: 'change'
									}
								]"
								:system="item"
								:valueDefault="defaultRelationValue[item.systemCode]"
								:ref="item.systemCode"
								:disabled="true"
							/>
						</a-form-item>
					</a-col>
					<a-col :span="oaauditcodelist.length > 1 ? 12 : 24">
						<a-form-item :label="'修改后' + item.systemName">
							<workflow-oa
								v-decorator="[
									item.systemCode + '2',
									{
										rules: [{ required: true, message: '请选择修改后' + item.systemName }, { validator: validId }],
										validateTrigger: 'change'
									}
								]"
								:system="item"
								:valueDefault="defaultRelationValue[item.systemName]"
								@select="getSelectValue"
								:ref="item.systemName"
							/>
						</a-form-item>
					</a-col>
				</a-row>
			</template>
		</a-form>
		<template slot="footer">
			<a-button
				key="back"
				@click="visible = false"
				class="cancel-btn"
			>
				取消
			</a-button>
			<a-button
				key="submit"
				type="primary"
				@click="submit"
			>
				提交
			</a-button>
		</template>
	</a-modal>
</template>

<script>
import {
	API_GETOAAUDITCODELIST,
	API_GETOAUSERBYKEYWORD,
	API_GETORDERAUDITCHAINANDOPERATOR,
	API_updateOrderAuditChainRel
} from '@/v2/center/trade/api/contract';
import { getPopupContainer } from '@/v2/utils/factory.js';
import { cloneDeep } from 'lodash';
import workflowOa from '@/v2/components/workflow.vue';
export default {
	data() {
		return {
			getPopupContainer,
			form: this.$form.createForm(this),
			visible: false,
			oaauditcodelist: [],
			systemVOList: [],
			systemVOListOri: [],
			auditChainAndOperator: {},
			CCS_OA: [],
			MS_OA: [],
			RORY_OA: [],
			WC_OA: [],
			info: {},
			oaUserNameList: [], // 流程发起人
			defaultRelationValue: {}
		};
	},
	components: {
		workflowOa
	},
	methods: {
		show(data) {
			this.defaultRelationValue = {};
			this.$nextTick(() => {
				this.form.setFieldsValue(this.defaultRelationValue);
			});
			this.info = data;
			this.visible = true;
			this.getoaauditcodelist();
		},
		// 校验审批流
		validProcess(rule, value, callback) {
			if (value.operatorMobile === this.defaultRelationValue[value.systemCode].operatorMobile) {
				callback('修改后审批流与修改前一致，请重新选择');
				return;
			}
			callback();
		},
		validId(rule, value, callback) {
			// 单流程校验
			if (
				this.oaauditcodelist.length === 1 &&
				value &&
				value.operatorMobile === this.defaultRelationValue[value.systemCode]?.operatorMobile
			) {
				callback('修改后' + rule.field + '与修改前一致，请重新选择');
				return;
			}
			callback();
		},
		getSelectValue(item) {
			const itemClone = cloneDeep(item);
			itemClone.operatorName = item.USERNAME;
			itemClone.operatorMobile = item.MOBILE;
			delete itemClone.USERNAME;
			delete itemClone.MOBILE;
			const systemCodeArr = this.auditChainAndOperator?.operatorInfo?.map(item => item.systemCode);
			const index = systemCodeArr?.indexOf(itemClone.systemCode);
			if (index >= 0) {
				this.auditChainAndOperator.operatorInfo[index] = itemClone;
			} else {
				this.auditChainAndOperator?.operatorInfo?.push(itemClone);
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
			if (!isNeedEmpty) {
				this.systemVOListOri = this.systemVOList;
				// (this.systemVOList || []).forEach((item) => {
				//   this.form.setFieldsValue({
				//     [item.systemCode]: null,
				//   });
				//   this.$nextTick(() => {
				//     if (this.$refs[item.systemCode].length) {
				//       this.$refs[item.systemCode][0].resetValue();
				//     }
				//   });
				// });
			}

			// if (isNeedEmpty) {
			//   (this.systemVOList || []).forEach((item) => {
			//     this.form.setFieldsValue({
			//       [item.systemCode]: null,
			//     });
			//     this.$nextTick(() => {
			//       if (this.$refs[item.systemCode].length) {
			//         this.$refs[item.systemCode][0].resetValue();
			//       }
			//     });
			//   });
			// }
		},
		getoaauditcodelist() {
			API_GETOAAUDITCODELIST().then(res => {
				if (res.success) {
					this.oaauditcodelist = res.data;
					if (this.oaauditcodelist.length == 1) {
						this.chainCodeChange(this.oaauditcodelist[0]);
					}
					API_GETORDERAUDITCHAINANDOPERATOR({ orderId: this.info.id }).then(res => {
						if (res.success) {
							let data = cloneDeep(res.data);
							if (!data) {
								data = {
									operatorInfo: this.oaauditcodelist[0].systemVOList,
									chainCode: this.oaauditcodelist[0].chainCode
								};
							}
							data.systemVOList = data?.operatorInfo.map(item => {
								return {
									systemName: item.systemName,
									systemCode: item.systemCode
								};
							});
							this.chainCodeChange(data);
							this.auditChainAndOperator = data;
							this.$nextTick(() => {
								this.form.setFieldsValue({
									COAL_CCS_MS_ORI: {
										key: this.auditChainAndOperator?.chainCode,
										label: this.auditChainAndOperator?.chainName
									}
								});
							});
							let temp = {};
							(this.auditChainAndOperator?.operatorInfo || []).forEach(item => {
								if (!item.operatorName) {
									return;
								}
								API_GETOAUSERBYKEYWORD({ keyword: item.operatorName, systemCode: item.systemCode })
									.then(res => {
										this[`${item.systemCode}`] = (res.data || []).map(item => {
											return {
												...item,
												text: item?.USERNAME + '-' + item?.DEPARTMENTPATHNAME,
												value: item?.USERNAME + ',' + item?.MOBILE
											};
										});
									})
									.catch(() => {
										this[`${item.systemCode}`] = [];
									});
								temp = {
									...temp,
									[item.systemCode]: item,
									[item.systemName]: {}
								};
								this.defaultRelationValue = temp;
							});
							this.$nextTick(() => {
								this.form.setFieldsValue(temp);
							});
						}
					});
				}
			});
		},
		close() {
			this.visible = false;
		},
		checkDoubleProcess(data) {
			let sameflag = true;
			if (this.auditChainAndOperator.operatorInfo.length) {
				this.auditChainAndOperator.operatorInfo.forEach(item => {
					sameflag = sameflag && item.operatorMobile === data[item.systemCode]?.operatorMobile;
				});
			}
			return this.auditChainAndOperator.chainCode === data.COAL_CCS_MS_ORI.key && sameflag;
		},
		submit() {
			this.form.validateFields((err, values) => {
				if (!err) {
					if (this.oaauditcodelist.length > 1 && this.checkDoubleProcess(values)) {
						this.$message.error('修改后审批流与修改前一致，请重新选择');
						return;
					}
					API_updateOrderAuditChainRel({
						orderId: this.info.id,
						auditChainAndOperator: this.auditChainAndOperator.chainCode ? this.auditChainAndOperator : null
					}).then(res => {
						if (res.success) {
							this.$message.success('修改成功！');
							this.visible = false;
							this.$emit('updateFunc');
						}
					});
				}
			});
		}
	}
};
</script>
<style lang="less" scoped>
.slModal {
	.reminder-tips {
		font-size: 14px;
		font-family:
			PingFangSC-Regular,
			PingFang SC;
		font-weight: 400;
		color: rgba(0, 0, 0, 0.4);
		line-height: 20px;
	}
}
</style>
