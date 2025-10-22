<template>
	<div class="wrap">
		<a-form
			:form="relationForm"
			style="display: flex"
			labelAlign="left"
			v-show="showRelation || (oaflag && !OAData)"
		>
			<a-row
				style="width: 50%"
				class="card"
				v-if="showRelation"
			>
				<a-col :span="20">
					<div class="title">采销合同关联</div>
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
							:disabled="Boolean(OAData) || relationForm.getFieldValue('noRelation')"
							v-decorator="[
								`contractNo`,
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
					</a-form-item>
				</a-col>
				<a-col :span="4">
					<a-form-item
						label=""
						:label-col="{
							span: 1
						}"
						:wrapper-col="{
							span: 24
						}"
						style="margin-top: 24px"
					>
						<a-checkbox
							:disabled="Boolean(OAData)"
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
				<slot></slot>
			</a-row>
			<a-row
				:style="{ width: edit ? '100%' : '50%' }"
				class="card"
			>
				<a-col v-if="oaflag && !OAData">
					<div
						class="title"
						v-if="!hideTitle"
					>
						审批流
					</div>
					<a-form-item
						v-if="oaauditcodelist.length > 1"
						label="流程选择"
						:label-col="{
							span: 8
						}"
						:wrapper-col="{
							span: 16
						}"
					>
						<a-select
							:getPopupContainer="getPopupContainer"
							placeholder="请选择流程"
							:disabled="isOa"
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
								:disabled="items.disabled"
							>
								{{ items.chainName }}
							</a-select-option>
						</a-select>
					</a-form-item>
					<a-form-item
						:key="relationForm.getFieldValue('COAL_CCS_MS') + '-' + index"
						v-for="(item, index) in systemVOList"
						:label="item.systemName"
						:label-col="{ span: 8 }"
						:wrapper-col="{ span: 16 }"
					>
						<workflow-oa
							:disabled="isOa"
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
		<!-- 关联采购、销售合同弹窗 -->
		<a-modal
			id="orderRelationModal"
			title="合同查询"
			v-model="orderRelationModal"
			@ok="handleSubmit"
			@cancel="
				() => {
					orderRelationModal = false;
				}
			"
		>
			<a-form
				layout="inline"
				class="search-wrap"
			>
				<a-row>
					<a-col
						:span="8"
						class="row"
					>
						<a-form-item
							label="合同编号"
							class="order-wrap"
							:colon="false"
						>
							<a-input
								v-model="searchModalParamsRelation.contractNo"
								placeholder="请输入"
							>
							</a-input>
						</a-form-item>
					</a-col>
					<a-col
						:span="8"
						class="row"
						v-if="type == 'buy'"
					>
						<a-form-item
							label="卖方企业名称"
							class="order-wrap"
							:colon="false"
						>
							<a-input
								v-model="searchModalParamsRelation.sellCompanyName"
								placeholder="请输入"
							>
							</a-input>
						</a-form-item>
					</a-col>
					<a-col
						:span="8"
						class="row"
						v-if="type == 'sell'"
					>
						<a-form-item
							label="买方企业名称"
							class="order-wrap"
							:colon="false"
						>
							<a-input
								v-model="searchModalParamsRelation.buyCompanyName"
								placeholder="请输入"
							>
							</a-input>
						</a-form-item>
					</a-col>
					<a-col
						:span="8"
						class="row"
					>
						<a-form-item
							label="钢材种类"
							class="order-wrap"
							:colon="false"
						>
							<a-select
								v-model="searchModalParamsRelation.steelType"
								placeholder="请选择"
								:getPopupContainer="getPopupContainer"
							>
								<a-select-option
									v-for="(items, index) in typeData"
									:key="index"
									:value="items.value"
									>{{ items.label }}</a-select-option
								>
							</a-select>
						</a-form-item>
					</a-col>
					<a-col
						:span="8"
						class="row"
					>
						<a-form-item>
							<a-button
								type="primary"
								@click="searchSubmitRelation"
								class="search-btn"
								>查询</a-button
							>
							<a-button
								html-type="reset"
								@click="resetValuesRelation"
							>
								重置
							</a-button>
						</a-form-item>
					</a-col>
				</a-row>
			</a-form>
			<a-table
				:scroll="{ x: true }"
				bordered
				:rowSelection="rowSelection"
				:dataSource="relationOrderList"
				:columns="relationOrderListColumns"
				:pagination="paginationRelation"
				:rowKey="record => record.id"
				:customRow="onClickRow"
				@change="handleTableChange"
			>
				<template
					slot="sellCompanyName"
					slot-scope="sellCompanyName, items"
				>
					<p>{{ items.sellCompanyName }}</p>
				</template>
				<template
					slot="buyCompanyName"
					slot-scope="buyCompanyName, items"
				>
					<p>{{ items.buyCompanyName }}</p>
				</template>
				<template
					slot="effectiveStartDate"
					slot-scope="effectiveStartDate, items"
				>
					<p v-if="items.effectiveStartDate">{{ items.effectiveStartDate }}～{{ items.effectiveEndDate }}</p>
				</template>
			</a-table>
		</a-modal>
	</div>
</template>

<script>
import { API_GETOAAUDITCODELIST, API_GETOAUSERBYKEYWORD } from '@/v2/center/steels/api';
import { getAssociatedContractPage } from '@/v2/center/steels/api/contract.js';
// import { getPopupContainer } from "@/untils/factory.js";
import { getPopupContainer } from '@/v2/utils/factory';
import { filterSteelsCodeByKey } from '@sub/utils/globalCode.js';
import { debounce, cloneDeep } from 'lodash';
import workflowOa from '@/v2/components/workflow.vue';

const buyColumns = [
	{ title: '合同编号', dataIndex: 'contractNo', width: 150 },
	{
		title: '卖方企业名称',
		dataIndex: 'sellCompanyName',
		scopedSlots: { customRender: 'sellCompanyName' }
	},
	{ title: '钢材种类', dataIndex: 'steelTypeDesc', width: 100 },
	{ title: '生成方式', dataIndex: 'generateWayDesc', width: 100 },
	{ title: '运输方式', dataIndex: 'transportModeDesc', width: 100 },
	{ title: '数量(吨)', dataIndex: 'quantity', align: 'center', width: 120 },
	{ title: '签订日期', dataIndex: 'contractSignDate' },
	{
		title: '合同期限',
		dataIndex: 'effectiveStartDate',
		key: 'effectiveStartDate',
		scopedSlots: { customRender: 'effectiveStartDate' }
	}
];
const sellColumns = [
	{ title: '合同编号', dataIndex: 'contractNo', width: 150 },
	{
		title: '买方企业名称',
		dataIndex: 'buyCompanyName',
		scopedSlots: { customRender: 'buyCompanyName' }
	},
	{ title: '钢材种类', dataIndex: 'steelTypeDesc', width: 100 },
	{ title: '生成方式', dataIndex: 'generateWayDesc', width: 100 },
	{ title: '运输方式', dataIndex: 'transportModeDesc', width: 100 },
	{ title: '数量(吨)', dataIndex: 'quantity', align: 'center', width: 120 },
	{ title: '签订日期', dataIndex: 'contractSignDate' },
	{
		title: '合同期限',
		dataIndex: 'effectiveStartDate',
		key: 'effectiveStartDate',
		scopedSlots: { customRender: 'effectiveStartDate' }
	}
];
export default {
	name: 'RelationOrder',
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
						contractNo: record.contractNo,
						noRelation: false
					});
					t.$forceUpdate();
					t.selected = record;
				}
			};
		},
		relationOrderListColumns() {
			if (this.type == 'buy') {
				return buyColumns;
			}
			return sellColumns;
		},
		typeData() {
			return this.type == 'buy' ? filterSteelsCodeByKey('steelType') : filterSteelsCodeByKey('sellSteelType');
		}
	},
	props: ['type', 'OAData', 'oaflag', 'isOa', 'showRelation', 'hideTitle', 'resultDetail', 'edit'], // type=buy是关联采购合同，type=sell是关联销售合同
	watch: {
		resultDetail: {
			handler(newVal) {
				if (newVal.auditChainAndOperator) {
					if (
						newVal.auditChainAndOperator.operatorInfo &&
						newVal.auditChainAndOperator.operatorInfo.length &&
						newVal.auditChainAndOperator.operatorInfo[0] &&
						newVal.auditChainAndOperator.operatorInfo[0].systemCode === this.systemVOList[0].systemCode
					) {
						this.setFormValue(newVal);
					}
				}
			},
			deep: true,
			immediate: true
		}
	},
	data() {
		return {
			getPopupContainer,
			detailAuditChainAndOperator: {},
			CCS_OA: [],
			MS_OA: [],
			RORY_OA: [],
			auditChainAndOperator: {},
			oaauditcodelist: [],
			systemVOList: [],
			signTime: null,
			oaUserNameList: [],
			searchModalParamsRelation: {
				contractNo: '',
				sellCompanyName: '',
				buyCompanyName: '',
				steelType: undefined,
				size: 10,
				page: 1
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
		setFormValue(value = {}) {
			if (!value.auditChainAndOperator) return;
			this.chainCodeChange(
				{
					chainName: value?.auditChainAndOperator?.chainName,
					chainCode: value?.auditChainAndOperator?.chainCode,
					systemVOList: value?.auditChainAndOperator?.operatorInfo
				},
				false
			);
			value?.auditChainAndOperator?.operatorInfo.forEach(item => {
				this.defaultRelationValue[item.systemCode] = {
					...item
				};
			});
			this.$nextTick(() => {
				this.auditChainAndOperator.operatorInfo = value?.auditChainAndOperator?.operatorInfo;
				this.relationForm.setFieldsValue({
					COAL_CCS_MS: {
						key: value?.auditChainAndOperator?.chainCode,
						label: value?.auditChainAndOperator?.chainName
					}
				});
				value?.auditChainAndOperator?.operatorInfo.forEach(item => {
					this.relationForm.setFieldsValue({
						[item.systemCode]: item
					});
				});
			});
		},
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
			data.systemVOList = data?.operatorInfo.map(item => {
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
		chainCodeChange(v, flag = false) {
			this.systemVOList = v.systemVOList || this.getSystemVOListFromList(v.key || v.chainCode);
			this.auditChainAndOperator = {
				chainName: v?.label?.replace(/\n|\s/g, '') || v?.chainName,
				chainCode: v.key || v.chainCode,
				operatorInfo: []
			};
			(this.systemVOList || []).forEach(item => {
				this[`handleSearchYu${item.systemCode}`] = v => {
					this.handleSearchYu(v, item.systemCode);
				};
			});
			if (flag) {
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
				API_GETOAAUDITCODELIST({
					industryType: 'STEEL',
					t: new Date().getTime()
				}).then(res => {
					if (res.success) {
						this.oaauditcodelist = res.data;
						this.setFormValue(this.resultDetail);
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
				this.relationForm.setFieldsValue({ contractNo: null });
				this.selectedRowKeys = [];
				this.selected = [];
				this.$emit('detail', this.selected);
			}
		},
		// 获取签订日期
		getTime(value, dateString) {
			[this.searchModalParamsRelation.signStartDate, this.searchModalParamsRelation.signEndDate] = dateString;
		},
		showRelationOrderList() {
			this.orderRelationModal = true;
			this.resetValuesRelation();
		},
		getRelationOrderList() {
			// type=buy是关联采购合同，type=sell是关联销售合同
			const params = {
				...this.searchModalParamsRelation,
				contractType: this.type === 'buy' ? 'BUY' : 'SELL',
				pageNo: this.searchModalParamsRelation.page,
				pageSize: this.searchModalParamsRelation.size
			};
			getAssociatedContractPage(params).then(res => {
				if (res.success) {
					this.relationOrderList = res.data.records;
					const paginationRelation = {
						total: res.data.total,
						pageSize: 10,
						current: this.searchModalParamsRelation.page,
						showTotal: total => {
							return `共${total}条记录 第${this.searchModalParamsRelation.page}页 `;
						}
					};
					this.paginationRelation = {
						...paginationRelation
					};
				}
			});
		},
		searchSubmitRelation() {
			this.orderRelationModal = true;
			this.searchModalParamsRelation.page = 1;
			this.searchModalParamsRelation.size = 10;
			this.paginationRelation = {
				current: 1
			};
			this.getRelationOrderList(this.searchModalParamsRelation);
		},
		resetValuesRelation() {
			this.searchModalParamsRelation = {
				contractNo: '',
				buyCompanyName: '',
				sellCompanyName: '',
				steelType: undefined,
				size: 10,
				page: 1
			};
			this.signTime = null;
			this.paginationRelation = {
				current: 1
			};
			this.getRelationOrderList();
		},
		handleTableChange(pagination) {
			this.searchModalParamsRelation.page = pagination.current;
			this.getRelationOrderList(this.searchModalParamsRelation);
		},
		onClickRow(record) {
			return {
				on: {
					click: () => {
						this.selectedRowKeys = [record.id];
						this.relationForm.setFieldsValue({
							contractNo: record.contractNo,
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
		}
	}
};
</script>
<style scoped lang="less">
::v-deep .sub-title {
	font-weight: bold;
}
.wrap {
	margin-top: 20px;
}
.card {
	padding: 10px;
	margin-right: 5px;
	box-shadow: 2px 2px 20px #f5f5f5;
	min-height: 200px;
	position: inherit;
}
#orderModal {
	::v-deep.ant-modal {
		width: 80% !important;
		min-width: 800px;
		.ant-table-body {
			width: 100%;
			overflow: auto;
		}
	}
	::v-deep.ant-table td {
		white-space: nowrap;
	}
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
