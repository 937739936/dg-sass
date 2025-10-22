<template>
	<div>
		<a-modal
			id="contractModal"
			title="选择合同"
			v-model="contractSearchModal"
			@cancel="handleCancel"
			@ok="handleOk"
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
								v-model="searchModalParams.paperContractNo"
								placeholder="请输入订单编号"
							>
							</a-input>
						</a-form-item>
					</a-col>
					<a-col
						:span="8"
						class="row"
					>
						<a-form-item
							label="企业名称"
							class="order-wrap"
							:colon="false"
						>
							<a-input
								v-model="searchModalParams.companyName"
								placeholder="请输入企业名称"
							>
							</a-input>
						</a-form-item>
					</a-col>
					<a-col
						:span="8"
						class="row"
					>
						<a-form-item
							label="煤种"
							class="order-wrap"
							:colon="false"
						>
							<a-select
								v-model="searchModalParams.coalType"
								placeholder="请选择"
								:getPopupContainer="getPopupContainer"
							>
								<a-select-option
									v-for="(items, index) in typeData"
									:key="index"
									:value="items.value"
									>{{ items.text }}</a-select-option
								>
							</a-select>
						</a-form-item>
					</a-col>
					<a-col
						:span="8"
						class="row"
					>
						<a-form-item
							label="签订日期"
							class="order-wrap"
							:colon="false"
						>
							<a-range-picker
								v-model="signTime"
								:placeholder="['开始时间', '结束时间']"
								format="YYYY-MM-DD"
								@change="getSignTime"
							/>
						</a-form-item>
					</a-col>
					<a-col
						:span="8"
						class="row"
					>
						<a-form-item>
							<a-button
								type="primary"
								@click="searchSubmit"
								class="search-btn"
							>
								查询
							</a-button>
							<a-button
								html-type="reset"
								@click="resetValues"
							>
								重置
							</a-button>
						</a-form-item>
					</a-col>
				</a-row>
			</a-form>
			<a-table
				bordered
				:rowSelection="rowSelection"
				:dataSource="contractList"
				:columns="contractColumns"
				:pagination="pagination"
				:rowKey="record => record.id"
				:customRow="onClickRow"
				@change="handleTableChange"
			>
				<template
					slot="contractPrice"
					slot-scope="contractPrice, items"
				>
					<p v-if="items.followTheMarket && contractForm.type === 'BUY'">随行就市</p>
					<p v-else>
						{{ contractPrice }}
					</p>
				</template>
				<template
					slot="execDateEnd"
					slot-scope="execDateEnd, items"
				>
					<p v-if="items.execDateStart">{{ items.execDateStart }}～{{ items.execDateEnd }}</p>
				</template>
			</a-table>
		</a-modal>
	</div>
</template>
<script>
import { getPopupContainer } from '@/v2/utils/factory.js';
import { filterCodeByKey } from '@sub/utils/globalCode.js';
import { API_TerminalContractList } from '@/v2/center/trade/api/settle';

const contractColumns = [
	{ title: '合同编号', key: 'paperContractNo', dataIndex: 'paperContractNo' },
	{ title: '卖方企业名称', key: 'sellerName', dataIndex: 'sellerName' },
	{ title: '买方企业名称', key: 'buyerName', dataIndex: 'buyerName' },
	{ title: '煤种', dataIndex: 'coalTypeDesc' },
	{ title: '品名', dataIndex: 'goodsName' },
	{ title: '运输方式', dataIndex: 'transTypeDesc', width: 100 },
	{ title: '数量(吨)', dataIndex: 'contractQuantity', align: 'center', width: 120 },
	{
		title: '基准价格(元/吨)',
		dataIndex: 'contractPrice',
		scopedSlots: { customRender: 'contractPrice' },
		align: 'center',
		width: 150
	},
	{ title: '签订日期', dataIndex: 'contractSignTime' },
	{
		title: '交货期限',
		dataIndex: 'execDateStart',
		key: 'execDateStart',
		scopedSlots: { customRender: 'execDateEnd' },
		width: 200
	}
];
export default {
	name: 'ContractList',
	data() {
		return {
			searchModalParams: {
				paperContractNo: '',
				companyName: '',
				coalType: undefined
			},
			contractSearchModal: false,
			contractColumns,
			pagination: {},
			getPopupContainer,
			signTime: null,
			contractList: [],
			selectedRowKeys: [],
			selected: {},
			typeData: filterCodeByKey('goods_type')
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
					t.selectedRowKeys = [record.id];
					t.selected = record;
				}
			};
		}
	},
	props: {
		contractForm: {
			default: {}
		}
	},
	methods: {
		onClickRow(record) {
			return {
				on: {
					click: () => {
						this.selectedRowKeys = [record.id];
						this.selected = record;
					}
				}
			};
		},
		handleTableChange(pagination) {
			this.searchModalParams.pageNo = pagination.current;
			this.getList(this.searchModalParams);
		},
		showModel() {
			this.contractSearchModal = true;
			this.resetValues();
		},
		//选择合同重置
		resetValues() {
			this.searchModalParams = {
				paperContractNo: '',
				companyName: '',
				coalType: undefined,
				contractSignTimeBegin: '',
				contractSignTimeEnd: '',
				type: this.contractForm.type
			};
			this.signTime = null;
			this.pagination = {
				current: 1
			};
			this.getList(this.searchModalParams);
		},
		//查询合同列表
		searchSubmit() {
			this.searchModalParams.pageNo = 1;
			this.pagination = {
				current: 1
			};
			this.getList(this.searchModalParams);
		},
		//加载合同列表
		getList(params) {
			API_TerminalContractList(params).then(res => {
				if (res.success) {
					let result = res.result || res.data;
					this.contractList = result.records;
					const pagination = {
						total: result.total,
						pageSize: result.size,
						current: result.current,
						showTotal: function (total) {
							return `共${total}条记录 第${result.current}页 `;
						}
					};
					this.pagination = pagination;
				}
			});
		},
		//获取合同签订时间
		getSignTime(value, dateString) {
			this.searchModalParams.contractSignTimeBegin = dateString[0];
			this.searchModalParams.contractSignTimeEnd = dateString[1];
		},
		handleOk() {
			this.$emit('validateContract', this.selectedRowKeys, this.selected);
			this.contractSearchModal = false;
		},
		handleCancel() {
			this.contractSearchModal = false;
		}
	}
};
</script>
<style lang="less" scoped>
#contractModal {
	/deep/.ant-modal {
		width: 80% !important;
		min-width: 800px;

		.ant-table-body {
			width: 100%;
			overflow: auto;
		}
		.search-wrap {
			padding: 0;
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
