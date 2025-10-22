<template>
	<div>
		<a-form
			:form="relationForm"
			style="display: flex"
		>
			<a-row
				style="flex: 1"
				class="card"
			>
				<div class="title">采销合同</div>
				<a-row
					type="flex"
					justify="space-between"
				>
					<a-col :span="18">
						<a-form-item
							:label="type == 'buy' ? '关联采购合同' : '关联销售合同'"
							:label-col="{
								span: 7
							}"
							:wrapper-col="{
								span: 16
							}"
						>
							<a-input
								readOnly
								:placeholder="type == 'buy' ? '请点击选择采购合同' : '请点击选择销售合同'"
								@click="showRelationOrderList"
								:disabled="Boolean(disabled) || Boolean(OAData) || relationForm.getFieldValue('noRelation')"
								v-show="!relationForm.getFieldValue('relateContractNo')"
								v-decorator="[
									`relateOrderNo`,
									{
										rules: [
											{
												required: relationForm.getFieldValue('noRelation') ? false : true,
												message: `请选择是否关联合同`,
												type: 'string'
											}
										]
									}
								]"
							/>
							<a-input
								readOnly
								:placeholder="type == 'buy' ? '请点击选择采购合同' : '请点击选择销售合同'"
								@click="showRelationOrderList"
								:disabled="Boolean(disabled) || Boolean(OAData) || relationForm.getFieldValue('noRelation')"
								v-show="relationForm.getFieldValue('relateContractNo')"
								v-decorator="[`relateContractNo`]"
							/>
						</a-form-item>
					</a-col>
					<a-col :span="6">
						<a-form-item label="">
							<a-checkbox
								:disabled="Boolean(disabled) || Boolean(OAData)"
								@change="onChange"
								v-decorator="[
									`noRelation`,
									{
										valuePropName: 'checked',
										initialValue: false
									}
								]"
								>暂不关联</a-checkbox
							>
						</a-form-item>
					</a-col>
				</a-row>
			</a-row>
			<a-row
				style="flex: 1"
				class="card"
			>
				<a-col v-if="oaflag && !OAData">
					<div class="title">审批流</div>
					<a-form-item
						v-if="oaauditcodelist.length > 1"
						label="流程选择"
						:label-col="{
							span: 6
						}"
						:wrapper-col="{
							span: 16
						}"
					>
						<a-select
							:getPopupContainer="getPopupContainer"
							placeholder="请选择流程"
							v-decorator="[
								'COAL_CCS_MS',
								{
									rules: [{ required: true, message: `流程选择必填` }]
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
						:key="index"
						v-for="(item, index) in systemVOList"
						:label="item.systemName"
						:label-col="{ span: 6 }"
						:wrapper-col="{ span: 16 }"
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
							@select="getSelectValue"
							:ref="item.systemCode"
						/>
					</a-form-item>
				</a-col>
			</a-row>
		</a-form>
		<RelationContract
			:type="type"
			ref="RelationContract"
			@detail="getRelationOrderDetail"
		/>
	</div>
</template>

<script>
import RelationContract from './RelationContract.vue';
import { API_GETOAAUDITCODELIST, API_GETOAUSERBYKEYWORD } from '@/v2/center/trade/api/contract';
import { getPopupContainer } from '@/v2/utils/factory.js';
import { debounce, cloneDeep } from 'lodash';
import workflowOa from '@/v2/components/workflow.vue';

export default {
	name: 'RelationOrder',
	components: {
		RelationContract,
		workflowOa
	},
	computed: {},
	props: ['type', 'disabled', 'OAData', 'oaflag', 'resultDetail'], // type=buy是关联采购合同，type=sell是关联销售合同
	// disabled关联合同是否禁用
	data() {
		return {
			getPopupContainer,
			CCS_OA: [],
			MS_OA: [],
			RORY_OA: [],
			WC_OA: [],
			auditChainAndOperator: {},
			oaauditcodelist: [],
			systemVOList: [],
			signTime: null,
			oaUserNameList: [],
			searchModalParamsRelation: {
				orderSerialNo: '',
				contractNo: '',
				buyerName: '',
				coalType: undefined
			},
			selectedRowKeys: [],
			relationForm: this.$form.createForm(this),
			orderRelationModal: false,
			relationOrderList: [],
			paginationRelation: {},
			selected: {}, // 关联合同被选中的数据
			contractType: 'on', //合同类型，电子on,线下off
			defaultRelationValue: {}
		};
	},
	created() {},
	methods: {
		getSelectValue(item) {
			const itemClone = cloneDeep(item);
			itemClone.operatorName = item.USERNAME;
			itemClone.operatorMobile = item.MOBILE;
			delete itemClone.USERNAME;
			delete itemClone.MOBILE;
			const systemCodeArr = this.auditChainAndOperator.operatorInfo.map(item => item.systemCode);
			const index = systemCodeArr.indexOf(itemClone.systemCode);
			if (index >= 0) {
				this.auditChainAndOperator.operatorInfo[index] = itemClone;
			} else {
				this.auditChainAndOperator.operatorInfo.push(itemClone);
			}
		},
		setBuyerId() {},
		getSystemVOListFromList(chainCode) {
			for (let i = 0; i < this.oaauditcodelist.length; i++) {
				if (this.oaauditcodelist[i].chainCode === chainCode) {
					return this.oaauditcodelist[i].systemVOList;
				}
			}
		},
		chainCodeChange(v, clear = false) {
			this.systemVOList = v.systemVOList || this.getSystemVOListFromList(v.key || v.chainCode);
			this.auditChainAndOperator = {
				chainName: v?.label?.replace(/\n|\s/g, '') || v?.chainName,
				chainCode: v.key || v.chainCode,
				operatorInfo: v.operatorInfo || []
			};

			(this.systemVOList || []).forEach(item => {
				this[`handleSearchYu${item.systemCode}`] = v => {
					this.handleSearchYu(v, item.systemCode);
				};
			});
			if (clear) {
				(this.systemVOList || []).forEach(item => {
					this.relationForm.setFieldsValue({
						[item.systemCode]: null
					});
					this.$nextTick(() => {
						if (this.$refs[item.systemCode]?.length) {
							this.$refs[item.systemCode][0].resetValue();
						}
					});
				});
			}
		},
		getoaauditcodelist(oaflag) {
			if (oaflag) {
				API_GETOAAUDITCODELIST().then(res => {
					if (res.success) {
						this.oaauditcodelist = res.data;
						if (this.oaauditcodelist.length == 1) {
							this.chainCodeChange(this.oaauditcodelist[0]);
						}
						// 有回显数据的情况下 回显审批流
						if (this.resultDetail) {
							this.setFieldsValueOA();
						}
					}
				});
			}
		},
		handleSearchYu: debounce(function (v, systemCode) {
			if (!v) return;
			API_GETOAUSERBYKEYWORD({ keyword: v, systemCode })
				.then(res => {
					this[`${systemCode}`] = (res.data || []).map(item => {
						return {
							...item,
							text: item.USERNAME + '-' + item.DEPARTMENTPATHNAME,
							value: item.USERNAME + ',' + item.MOBILE + ',' + item.USERID
						};
					});
				})
				.catch(() => {
					this[`${systemCode}`] = [];
				});
		}, 300),
		onChange(e) {
			if (e.target.checked) {
				this.relationForm.setFieldsValue({
					relateOrderNo: null,
					relateContractNo: null
				});
				this.selectedRowKeys = [];
				this.selected = [];
				this.$emit('detail', this.selected);
			}
		},
		showRelationOrderList() {
			this.$refs.RelationContract.showRelationOrderList();
		},
		getRelationOrderDetail(item) {
			this.$emit('detail', item);
		},
		setFieldsValueOA() {
			// 回显审批流
			const data = cloneDeep(this.resultDetail.contract.auditChainAndOperator);
			if (!data) return;
			data.systemVOList = data?.operatorInfo.map(item => {
				return {
					systemName: item.systemName,
					systemCode: item.systemCode
				};
			});
			if (this.oaauditcodelist.length > 1) {
				// 单双流时进行流程选择回显
				this.chainCodeChange(data);
			}
			this.auditChainAndOperator = this.resultDetail.contract.auditChainAndOperator;
			this.$nextTick(() => {
				this.relationForm.setFieldsValue({
					COAL_CCS_MS: {
						key: this.auditChainAndOperator.chainCode,
						label: this.auditChainAndOperator.chainName
					}
				});
			});
			let temp = {};

			(this.auditChainAndOperator.operatorInfo || []).forEach(item => {
				API_GETOAUSERBYKEYWORD({
					keyword: item.operatorName,
					systemCode: item.systemCode
				})
					.then(res => {
						this[`${item.systemCode}`] = (res.data || []).map(item => {
							return {
								...item,
								text: item.USERNAME + '-' + item.DEPARTMENTPATHNAME,
								value: item.USERNAME + ',' + item.MOBILE
							};
						});
					})
					.catch(() => {
						this[`${item.systemCode}`] = [];
					});

				temp = {
					...temp,
					[item.systemCode]: item
				};
				this.defaultRelationValue = temp;
			});
			this.$nextTick(() => {
				this.relationForm.setFieldsValue(temp);
			});
		}
	}
};
</script>
<style scoped lang="less">
::v-deep .sub-title {
	font-weight: bold;
}
.card {
	// border: 1px solid #ccc;
	padding: 10px;
	margin-right: 5px;
	box-shadow: 2px 2px 20px #f5f5f5;
	min-height: 100px;
	position: inherit;
}
</style>
<style scoped lang="stylus">
#orderRelationModal {
  ::v-deep.ant-modal {
    width: 80% !important;
    min-width: 800px;

    .ant-table-body {
      width: 100%;
      overflow: auto;
    }

    .search-wrap {
      .order-wrap {
        .ant-form-item-children > input {
          width: 200px;
        }

        .ant-select {
          width: 200px;
        }

        .ant-calendar-picker-input input {
          width: 85px;
        }
      }
    }

    .ant-table td {
      white-space: nowrap;
    }
  }
}
</style>
