<template>
	<a-modal
		title="下游合同选择"
		width="1000px"
		@ok="handleOk"
		v-model="visible"
	>
		<a-form
			:form="form"
			:label-col="{ span: 8 }"
			:wrapper-col="{ span: 16 }"
		>
			<a-row>
				<a-col
					:span="8"
					class="row"
				>
					<a-form-item
						label="下游合同编号"
						class="order-wrap"
						:colon="false"
					>
						<a-input
							v-model="params.contractNo"
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
						label="运输方式"
						class="order-wrap"
						:colon="false"
					>
						<a-select
							:allowClear="true"
							v-model="params.transportMode"
							placeholder="请选择"
							:getPopupContainer="triggerNode => triggerNode.parentNode || document.body"
						>
							<a-select-option
								v-for="item in transportMode"
								:value="item.value"
								:key="item.text"
							>
								{{ item.label }}
							</a-select-option>
						</a-select>
					</a-form-item>
				</a-col>
				<!-- <a-col :span="8" class="row">
          <a-form-item
            label="品名"
            class="order-wrap"
            :colon="false">
            <a-input v-model="params.goodsName" placeholder="请输入">
            </a-input>
          </a-form-item>
        </a-col> -->
				<a-col
					:span="8"
					class="row"
				>
					<a-form-item
						label="合同数量"
						class="order-wrap range-input"
						:colon="false"
					>
						<a-input v-model="params.quantityLower"></a-input>
						<span class="range-text">至</span>
						<a-input v-model="params.quantityUpper"></a-input>
						<span class="range-text">吨</span>
					</a-form-item>
				</a-col>
				<a-col
					:span="8"
					class="row"
				>
					<a-form-item
						label="合同日期"
						class="order-wrap"
						:colon="false"
					>
						<a-range-picker
							v-model="contractSignTime"
							format="YYYY-MM-DD"
							:placeholder="['开始日期', '结束日期']"
							@change="getContractSignTime"
						/>
					</a-form-item>
				</a-col>
				<a-col
					:span="8"
					class="row"
				>
					<a-form-item
						:label-col="{ span: 2 }"
						:wrapper-col="{ span: 22 }"
					>
						<a-button
							@click="search"
							type="primary"
							html-type="submit"
							class="search-btn"
						>
							查询
						</a-button>
						<a-button
							html-type="reset"
							@click="reset"
						>
							重置
						</a-button>
					</a-form-item>
				</a-col>
			</a-row>
		</a-form>
		<div class="table-wrap">
			<a-table
				:rowSelection="rowSelection"
				:columns="columns"
				rowKey="id"
				:dataSource="dataSource"
				:pagination="false"
				:loading="loading"
				:customRow="onClickRow"
				:scroll="{ x: true }"
			>
				<span
					slot="receiverName"
					slot-scope="receiverName"
				>
					{{ receiverName || '-' }}
				</span>
			</a-table>
		</div>
		<i-pagination
			:pagination="pagination"
			@change="getList"
		/>
	</a-modal>
</template>

<script>
import iPagination from "@sub/components/iPagination";
import { collectionContractPage } from '@/v2/center/steels/api/funds.js';
import { filterSteelsCodeByKey } from '@sub/utils/globalCode.js';

const columns = [
	{ title: '下游合同编号', dataIndex: 'contractNo', width: 160 },
	{ title: '下游企业名称', dataIndex: 'buyCompanyName', width: 135 },
	{ title: '运输方式', dataIndex: 'transportModeDesc', width: 130 },
	{ title: '合同数量（吨）', dataIndex: 'quantity', width: 120 },
	// { title: '合同单价（元/吨）', dataIndex: 'contractPrice', width: 120, scopedSlots: { customRender: 'contractPrice' }},
	// { title: '合同总价（元）', dataIndex: 'contractAmount', width: 150, scopedSlots: { customRender: 'contractAmount' }},
	{ title: '合同起始日', dataIndex: 'effectiveStartDate', width: 150 },
	{ title: '合同到期日期', dataIndex: 'effectiveEndDate', width: 160 }
];

export default {
	name: 'DownstreamContractNo',

	components: {
		iPagination
	},
	data() {
		return {
			columns,
			transportMode: filterSteelsCodeByKey('transportMode'),
			form: this.$form.createForm(this),
			visible: false,
			dataSource: [],
			contractSignTime: null,
			params: {},
			loading: false,
			selectedRowKeys: [],
			contractData: {},
			pagination: {
				total: 0,
				pageNo: 1
			},
			transportModeList: this.$store.getters['config/VUEX_ST_ALLCODE']['transportModeDictSTEAM_COAL_001']
		};
	},
	computed: {
		rowSelection() {
			const { selectedRowKeys } = this;
			const t = this;
			return {
				type: 'radio',
				selectedRowKeys: selectedRowKeys,
				onSelect: record => {
					t.contractData = record;
					t.selectedRowKeys = [record.id];
				}
			};
		}
	},
	methods: {
		getContractSignTime(value, dateString) {
			// 查询合同日期区间
			this.params.effectiveStartDateRange = dateString[0];
			this.params.effectiveEndDateRange = dateString[1];
		},
		showModal(id) {
			//展示弹窗
			this.visible = true;
			this.id = id;
			this.getList();
		},

		handleOk() {
			// 选中数据后确定传给伏组件
			if (this.selectedRowKeys.length <= 0) {
				this.$message.error('请先选择一条行数据');
			} else {
				this.visible = false;
				this.$emit('getDownstreamContractNo', this.contractData);
			}
		},

		getList(pageNo, pageSize) {
			this.params.collectionId = this.id;
			this.params.pageSize = pageSize || 10;
			this.pagination.pageNo = pageNo || this.pagination.pageNo;
			this.params.pageNo = this.pagination.pageNo;

			collectionContractPage(this.params).then(res => {
				if (res.success) {
					this.dataSource = res.data.records;
					this.pagination.total = res.data.total;
				}
			});
		},

		search() {
			this.pagination.pageNo = 1;
			this.getList();
		},

		reset() {
			this.params = {};
			this.contractSignTime = [];
			this.pagination.pageNo = 1;
			this.deliverDate = null;
			this.getList();
		},

		onClickRow(record) {
			return {
				on: {
					click: () => {
						this.contractData = record;

						this.selectedRowKeys = [record.id];
					}
				}
			};
		}
	}
};
</script>

<style lang="less" scoped>
.search-btn {
	margin-left: 100px;
	margin-right: 20px;
}
.setting-icon {
	display: inline-block;
	margin-left: 2px;
	font-size: 15px;
}
.range-input input {
	width: 80px;
}
.ant-form ::v-deep.ant-form-item-label {
	text-align: right;
}
</style>
