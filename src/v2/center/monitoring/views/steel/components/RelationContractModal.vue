<template>
	<div>
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
					<!-- <a-col :span="8" class="row">
            <a-form-item label="签订日期" class="order-wrap" :colon="false">
              <a-range-picker
                v-model="signTime"
                :placeholder="['开始时间', '结束时间']"
                format="YYYY-MM-DD"
                @change="getTime"/>
            </a-form-item>
          </a-col> -->
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
import { getAssociatedContractPage } from '@/v2/api/steels.js';;
import { getPopupContainer } from '@/untils/factory.js';
import { filterSteelsCodeByKey } from '@sub/utils/globalCode.js';
const buyColumns = [
	{ title: '合同编号', dataIndex: 'contractNo', width: 150 },
	{ title: '卖方企业名称', dataIndex: 'sellCompanyName', scopedSlots: { customRender: 'sellCompanyName' } },
	{ title: '钢材种类', dataIndex: 'steelTypeDesc', width: 100 },
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
	{ title: '买方企业名称', dataIndex: 'buyCompanyName', scopedSlots: { customRender: 'buyCompanyName' } },
	{ title: '钢材种类', dataIndex: 'steelTypeDesc', width: 100 },
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
		}
	},
	props: ['type', 'OAData', 'oaflag'], // type=buy是关联采购合同，type=sell是关联销售合同
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
			typeData: filterSteelsCodeByKey('steelType'),
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
			selected: {} // 关联合同被选中的数据
		};
	},
	created() {},
	methods: {
		setBuyerId() {},
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
.card {
	// border: 1px solid #ccc;
	padding: 10px;
	margin-right: 5px;
	// box-shadow: 2px 2px 20px #f5f5f5;
	// min-height: 200px;
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
        .ant-table td { white-space: nowrap; }
    }
}
</style>
