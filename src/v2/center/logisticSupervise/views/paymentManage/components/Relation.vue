<template>
	<div
		class="wrap"
		v-if="oaflag"
	>
		<div class="slTitleAssis">审批流程</div>
		<a-form
			:form="relationForm"
			class="slFormDetail"
		>
			<a-row>
				<a-col :span="8">
					<a-form-item
						v-if="oaauditcodelist.length"
						label="流程选择"
					>
						<a-select
							:getPopupContainer="getPopupContainer"
							placeholder="请选择流程"
							:disabled="$route.query.type == 'submit'"
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
				</a-col>
				<a-col
					:span="8"
					v-for="(item, index) in systemVOList"
					:key="index"
				>
					<a-row
						type="flex"
						:justify="index === 0 ? 'center' : 'end'"
					>
						<a-form-item :label="item.systemName">
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
								@change="getSelectValue"
								:ref="item.systemCode"
							/>
						</a-form-item>
					</a-row>
				</a-col>
			</a-row>
		</a-form>
	</div>
</template>

<script>
import { filterCodeByKey } from '@sub/utils/globalCode.js';
import {
	API_BUYCONTRACTLIST,
	API_SELLCONTRACTLIST,
	API_GETOAAUDITCODELIST,
	API_GETOAUSERBYKEYWORD
} from '@/v2/center/trade/api/pay';
import { getPopupContainer } from '@/v2/utils/factory.js';
import { debounce, cloneDeep } from 'lodash';
import workflowOa from '@/v2/components/workflow.vue';

export default {
	name: 'RelationOrder',
	// type=buy是关联采购合同，type=sell是关联销售合同
	props: {
		layout: {
			typeof: Object,
			default: () => ({
				labelCol: 2,
				wrapperCol: 12
			})
		},
		type: {
			default: ''
		},
		oaflag: {
			default: () => false
		}
	},
	components: {
		workflowOa
	},
	computed: {
		rowSelection() {
			const t = this;
			const { selectedRowKeys } = this;
			return {
				type: 'radio',
				selectedRowKeys,
				onSelect: record => {
					t.selectedRowKeys = [record.id];
					t.relationForm.setFieldsValue({
						relateOrderNo: record.orderSerialNo,
						noRelation: false
					});
					t.$forceUpdate();
					t.selected = record;
				}
			};
		}
	},
	data() {
		return {
			getPopupContainer,
			detailAuditChainAndOperator: {},
			CCS_OA: [],
			MS_OA: [],
			RORY_OA: [],
			WC_OA: [],
			auditChainAndOperator: {
				operatorInfo: []
			},
			oaauditcodelist: [],
			systemVOList: [],
			signTime: null,
			oaUserNameList: [],
			typeData: filterCodeByKey('goods_type'),
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
		setFieldsValue() {
			if (!this.detailAuditChainAndOperator) {
				return;
			}
			const data = cloneDeep(this.detailAuditChainAndOperator);
			data.systemVOList = data?.operatorInfo?.map(item => {
				return {
					systemName: item.systemName,
					systemCode: item.systemCode
				};
			});
			this.chainCodeChange(data);
			this.auditChainAndOperator = this.detailAuditChainAndOperator;
			this.relationForm.setFieldsValue({
				COAL_CCS_MS: {
					key: this.auditChainAndOperator.chainCode,
					label: this.auditChainAndOperator.chainName
				}
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
					[item.systemCode]: item.operatorName
				};
			});
			this.$nextTick(() => {
				this.relationForm.setFieldsValue(temp);
			});
		},
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
				operatorInfo: clear ? [] : this.auditChainAndOperator.operatorInfo
			};
			(this.systemVOList || []).forEach(item => {
				this.relationForm.setFieldsValue({
					[item.systemCode]: null
				});
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
							value: item.USERNAME + ',' + item.MOBILE
						};
					});
				})
				.catch(() => {
					this[`${systemCode}`] = [];
				});
		}, 300),
		onChange(e) {
			if (e.target.checked) {
				this.relationForm.setFieldsValue({ relateOrderNo: null });
				this.selectedRowKeys = [];
				this.selected = [];
				this.$emit('detail', this.selected);
			}
		},
		// 获取签订日期
		getTime(value, dateString) {
			[this.searchModalParamsRelation.minDeliveryDateBegin, this.searchModalParamsRelation.maxDeliveryDateBegin] = dateString;
		},
		showRelationOrderList() {
			this.orderRelationModal = true;
			this.resetValuesRelation();
		},
		getRelationOrderList() {
			// type=buy是关联采购合同，type=sell是关联销售合同
			const API = this.type === 'buy' ? API_BUYCONTRACTLIST : API_SELLCONTRACTLIST;
			API(this.searchModalParamsRelation).then(res => {
				if (res.success) {
					this.relationOrderList = res.result.records;
					const paginationRelation = {
						total: res.result.total,
						pageSize: res.result.size,
						current: res.result.current,
						showTotal: function (total) {
							return `共${total}条记录 第${res.result.current}页 `;
						}
					};
					this.paginationRelation = paginationRelation;
				}
			});
		},
		searchSubmitRelation() {
			this.searchModalParamsRelation.pageNo = 1;
			this.paginationRelation = {
				current: 1
			};
			this.getRelationOrderList(this.searchModalParamsRelation);
		},
		resetValuesRelation() {
			this.searchModalParamsRelation = {
				orderSerialNo: '',
				contractNo: '',
				buyerName: '',
				coalType: undefined
			};
			this.signTime = null;
			this.paginationRelation = {
				current: 1
			};
			this.getRelationOrderList();
		},
		handleTableChange(pagination) {
			this.searchModalParamsRelation.pageNo = pagination.current;
			this.getRelationOrderList(this.searchModalParamsRelation);
		},
		onClickRow(record) {
			return {
				on: {
					click: () => {
						this.selectedRowKeys = [record.id];
						this.relationForm.setFieldsValue({
							relateOrderNo: record.orderSerialNo,
							noRelation: false
						});
						this.$forceUpdate();
						this.selected = record;
					}
				}
			};
		},
		handleSubmit() {
			if (this.selectedRowKeys.length === 0) {
				this.$message.error('请选择要关联的合同！');
				return;
			}
			this.orderRelationModal = false;
			this.$emit('detail', this.selected);
		},
		setDefaultValue(val) {
			if (val) {
				this.systemVOList = val.operatorInfo;
				const temp = {};
				(val.operatorInfo || []).forEach(item => {
					temp[item.systemCode] = {
						...item
					};
				});
				this.defaultRelationValue = temp;
			}
		}
	}
};
</script>
<style scoped lang="less">
.slTitleAssis {
	margin-bottom: 0;
}
.slFormDetail {
	::v-deep.ant-form-item {
		width: 364px;
	}
}
</style>
