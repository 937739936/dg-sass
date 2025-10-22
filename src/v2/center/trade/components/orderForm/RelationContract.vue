<template>
	<div>
		<!-- 关联采购、销售合同弹窗 -->
		<a-modal
			id="orderRelationModal"
			title=""
			v-model="orderRelationModal"
			@ok="handleSubmit"
			@cancel="
				() => {
					orderRelationModal = false;
				}
			"
		>
			<a-tabs
				v-model="contractType"
				@change="resetValuesRelation"
			>
				<a-tab-pane
					key="on"
					tab="电子合同"
				>
				</a-tab-pane>
				<a-tab-pane
					key="off"
					tab="线下合同"
				>
				</a-tab-pane>
			</a-tabs>
			<a-form
				layout="inline"
				class="search-wrap"
			>
				<a-row>
					<template v-if="contractType == 'on'">
						<a-col
							:span="8"
							class="row"
						>
							<a-form-item
								label="订单编号"
								class="order-wrap"
								:colon="false"
							>
								<a-input
									v-model="searchModalParamsRelation.orderSerialNo"
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
					</template>
					<template v-else>
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
									v-model="searchModalParamsRelation.paperContractNo"
									placeholder="请输入"
								>
								</a-input>
							</a-form-item> </a-col
					></template>
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
								v-model="searchModalParamsRelation.counterParty"
								placeholder="请输入"
								v-if="contractType == 'on'"
							>
							</a-input>
							<a-input
								v-model="searchModalParamsRelation.sellerName"
								placeholder="请输入"
								v-else
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
								v-model="searchModalParamsRelation.counterParty"
								placeholder="请输入"
								v-if="contractType == 'on'"
							>
							</a-input>
							<a-input
								v-model="searchModalParamsRelation.buyerName"
								placeholder="请输入"
								v-else
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
								v-model="searchModalParamsRelation.coalType"
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
							label="运输方式"
							class="order-wrap"
							:colon="false"
						>
							<a-select
								v-model="searchModalParamsRelation.transType"
								placeholder="请选择"
								:getPopupContainer="getPopupContainer"
							>
								<a-select-option
									v-for="(item, index) in transTypeList"
									:key="index"
									:value="item.value"
								>
									{{ item.text }}
								</a-select-option>
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
								@change="getTime"
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
					slot="basicPrice"
					slot-scope="basicPrice, items"
				>
					<p>{{ items.basicPrice || items.basicPriceDesc }}</p>
				</template>
				<template
					slot="sellerName"
					slot-scope="sellerName, items"
				>
					<p v-if="type === 'buy'">{{ items.counterParty }}</p>
					<p v-if="type === 'sell'">{{ items.ownCompany }}</p>
				</template>
				<template
					slot="buyerName"
					slot-scope="buyerName, items"
				>
					<p v-if="type === 'buy'">{{ items.ownCompany }}</p>
					<p v-if="type === 'sell'">{{ items.counterParty }}</p>
				</template>
				<template
					slot="deliveryDateEnd"
					slot-scope="deliveryDateEnd, items"
				>
					<p v-if="items.deliveryDateBegin">{{ items.deliveryDateBegin }}～{{ items.deliveryDateEnd }}</p>
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
import { filterCodeByKey } from '@sub/utils/globalCode.js';
import {
	API_BUYCONTRACTLIST,
	API_SELLCONTRACTLIST,
	API_OFFLINEBUYERORDERLINKLIST,
	API_OFFLINESELLERORDERLINKLIST
} from '@/v2/center/trade/api/contract';
import { getPopupContainer } from '@/v2/utils/factory.js';
var relationOrderListColumnsOn = [
	{ title: '订单编号', dataIndex: 'orderSerialNo', width: 150 },
	{ title: '合同编号', dataIndex: 'contractNo', width: 150 },
	{
		title: '卖方企业名称',
		dataIndex: 'sellerName',
		scopedSlots: { customRender: 'sellerName' }
	},
	{
		title: '买方企业名称',
		dataIndex: 'buyerName',
		scopedSlots: { customRender: 'buyerName' }
	},
	{ title: '煤种', dataIndex: 'coalTypeDesc' },
	{ title: '品名', dataIndex: 'goodsName' },
	{ title: '运输方式', dataIndex: 'transTypeDesc', width: 100 },
	{ title: '数量(吨)', dataIndex: 'quantity', align: 'center', width: 120 },
	{
		title: '基准价格(元/吨)',
		dataIndex: 'basicPrice',
		scopedSlots: { customRender: 'basicPrice' },
		align: 'center',
		width: 150
	},
	{ title: '签订日期', dataIndex: 'signTime' },
	{
		title: '交货期限',
		dataIndex: 'deliveryDateBegin',
		key: 'deliveryDateBegin',
		scopedSlots: { customRender: 'deliveryDateEnd' }
	}
];
var relationOrderListColumnsOff = [
	{ title: '合同编号', dataIndex: 'paperContractNo', width: 150 },
	{ title: '卖方企业名称', dataIndex: 'sellerName' },
	{ title: '买方企业名称', dataIndex: 'buyerName' },
	// { title: "煤种", dataIndex: "coalTypeDesc" },
	{ title: '品名', dataIndex: 'goodsName' },
	{ title: '运输方式', dataIndex: 'transTypeDesc', width: 100 },
	{
		title: '数量(吨)',
		dataIndex: 'contractQuantity',
		align: 'center',
		width: 120
	},
	{
		title: '基准价格(元/吨)',
		dataIndex: 'contractPrice',
		align: 'center',
		width: 150,
		customRender: (text, record) => {
			return record.followTheMarket ? '随行就市' : text;
		}
	},
	{ title: '签订日期', dataIndex: 'contractSignTime' },
	{
		title: '合同执行期',
		dataIndex: 'execDateStart',
		key: 'execDateStart',
		scopedSlots: { customRender: 'execDateEnd' }
	}
];
export default {
	name: 'RelationContract',
	computed: {
		rowSelection() {
			const t = this;
			const { selectedRowKeys } = this;
			return {
				type: 'radio',
				selectedRowKeys,
				onSelect: record => {
					t.selectedRowKeys = [record.id];
					t.$forceUpdate();
					t.selected = record;
				}
			};
		},
		//电子合同，线下合同表头不同
		relationOrderListColumns() {
			let list = [];
			switch (this.contractType) {
				case 'on':
					list = relationOrderListColumnsOn;
					break;
				case 'off':
					list = relationOrderListColumnsOff;
					break;
			}
			//采购关联销售是不要卖方企业名称
			if (this.type === 'sell') {
				list = list.filter(item => {
					return item.dataIndex !== 'sellerName';
				});
			}
			return list;
		}
	},
	props: ['type'], // type=buy是关联采购合同，type=sell是关联销售合同
	data() {
		return {
			getPopupContainer,
			signTime: null,
			typeData: filterCodeByKey('goods_type'),
			searchModalParamsRelation: {},
			selectedRowKeys: [],
			orderRelationModal: false,
			relationOrderList: [],
			paginationRelation: {},
			selected: {}, // 关联合同被选中的数据
			contractType: 'on', //合同类型，电子on,线下off
			transTypeList: filterCodeByKey('onlineTransTypeDict')
		};
	},
	watch: {
		type: function () {
			if (this.orderRelationModal) {
				this.resetValuesRelation();
			}
		}
	},
	created() {},
	methods: {
		// 获取签订日期
		getTime(value, dateString) {
			[this.searchModalParamsRelation.minSignDate, this.searchModalParamsRelation.maxSignDate] = dateString;
			this.searchModalParamsRelation.contractSignTimeStart = dateString[0] ? dateString[0] + ' 00:00:00' : '';
			this.searchModalParamsRelation.contractSignTimeEnd = dateString[1] ? dateString[1] + ' 23:59:59' : '';
		},
		getRelationOrderList() {
			//contractType=on是电子合同，off是线下合同
			// type=buy是关联采购合同，type=sell是关联销售合同
			const API =
				this.contractType === 'on'
					? this.type === 'buy'
						? API_BUYCONTRACTLIST
						: API_SELLCONTRACTLIST
					: this.type === 'buy'
						? API_OFFLINESELLERORDERLINKLIST
						: API_OFFLINEBUYERORDERLINKLIST;
			API(this.searchModalParamsRelation).then(res => {
				if (res.success) {
					let result = res.result || res.data;
					this.relationOrderList = result.records;
					const paginationRelation = {
						total: result.total,
						pageSize: result.size,
						current: result.current,
						showTotal: function (total) {
							return `共${total}条记录 第${result.current}页 `;
						}
					};
					this.paginationRelation = paginationRelation;
				}
			});
		},
		searchSubmitRelation() {
			this.searchModalParamsRelation.pageNo = 1;
			this.paginationRelation = {};
			this.getRelationOrderList();
		},
		//外部引用方法打开弹框
		showRelationOrderList() {
			this.orderRelationModal = true;
			if (this.type) {
				this.resetValuesRelation();
			}
		},
		//切换头部，重置
		resetValuesRelation() {
			this.searchModalParamsRelation = {};
			this.signTime = null;
			this.relationOrderList = [];
			this.paginationRelation = {
				current: 1
			};
			this.getRelationOrderList();
		},
		handleTableChange(pagination) {
			this.searchModalParamsRelation.pageNo = pagination.current;
			this.getRelationOrderList();
		},
		onClickRow(record) {
			return {
				on: {
					click: () => {
						this.selectedRowKeys = [record.id];
						this.$forceUpdate();
						this.selected = record;
					}
				}
			};
		},
		selectHandle(data) {
			this.selectedRowKeys = [data.id];
			this.selected = data;
			this.handleSubmit();
		},
		handleSubmit() {
			if (this.selectedRowKeys.length === 0) {
				this.$message.error('请选择要关联的合同！');
				return;
			}
			let selected = Object.assign({}, this.selected);
			this.orderRelationModal = false;
			//判断选中的合同类型UP-上游补录；DOWN-下游补录；ONLINE-电子合同
			selected[this.type + 'OrderType'] = this.contractType === 'on' ? 'ONLINE' : this.type === 'buy' ? 'UP' : 'DOWN';
			//下游没有订单号采用contractNo,orderId
			selected.orderSerialNo = selected.orderSerialNo || selected.contractNo;
			selected.orderId = selected.orderId || selected.id;
			this.$emit('detail', selected);
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
	min-height: 200px;
	position: inherit;
}
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
