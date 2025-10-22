<template>
	<div>
		<!-- 关联采购、销售合同弹窗 -->
		<a-drawer
			class="slDrawer"
			title="新增退款"
			placement="right"
			:visible="visible"
			@ok="handleSubmit"
			@close="onClose"
			:footer="null"
			destroyOnClose
		>
			<a-tabs
				v-model="currentOrderLineType"
				@change="resetValuesRelation"
			>
				<a-tab-pane
					key="ONLINE"
					tab="电子合同"
				>
				</a-tab-pane>
				<a-tab-pane
					key="OFFLINE"
					tab="线下合同"
				>
				</a-tab-pane>
			</a-tabs>
			<SlFormNew
				:list="searchList"
				layout="inline"
				@change="getRelationOrderList"
				:isShowIcon="false"
				:isShowSearchBox="true"
				:colSpan="8"
				ref="slFormNew"
			></SlFormNew>
			<!-- 表格 -->
			<div class="table-box">
				<a-table
					class="new-table"
					:bordered="false"
					:scroll="{ x: 1136 }"
					:rowSelection="rowSelection"
					:dataSource="dataSource"
					:columns="columns"
					:pagination="false"
					:rowKey="currentOrderLineType === 'ONLINE' ? record => record.orderId : record => record.contractId"
					:customRow="onClickRow"
					:loading="loading"
				>
					<template
						slot="contractNo"
						slot-scope="text, items"
					>
						{{ currentOrderLineType === 'ONLINE' ? text : items.paperContractNo }}
					</template>
					<template
						slot="paidAmount"
						slot-scope="text"
					>
						<p>{{ text | formatMoney(2) }}</p>
					</template>
					<template
						slot="deliveryStartDate"
						slot-scope="deliveryStartDate, items"
					>
						<span v-if="items.deliveryStartDate">{{ items.deliveryStartDate }}至{{ items.deliveryEndDate }}</span>
					</template>
				</a-table>
			</div>
			<i-pagination
				:pagination="paginationRelation"
				size="small"
				@change="handleTableChange"
			/>
			<!-- 底部 -->
			<div class="footer">
				<a-space :size="30">
					<a-button
						class="cancel-btn"
						@click="onClose"
						>取消</a-button
					>
					<a-button
						type="primary"
						@click="handleSubmit"
						:disabled="!this.selectedRowKeys.length || !Boolean(this.selected)"
						>{{ confirmText }}</a-button
					>
				</a-space>
			</div>
		</a-drawer>
	</div>
</template>

<script>
import { filterCodeByKey } from '@sub/utils/globalCode.js';
import { API_RefundOnlineContractList, API_RefundOfflineContractList } from '@/v2/center/trade/api/pay';
import { getPopupContainer } from '@/v2/utils/factory.js';
import SlFormNew from '@sub/components/ui-new/Form/sl-form';
import iPagination from "@sub/components/iPagination";
const searchList = [
	{
		decorator: ['no'],
		addonBeforeTitle: '编号',
		type: 'input',
		placeholder: '请输入订单或合同编号',
		hasType: 'ONLINE'
	},
	{
		decorator: ['contractNo'],
		addonBeforeTitle: '合同编号',
		type: 'input',
		placeholder: '请输入合同编号',
		hasType: 'OFFLINE'
	},
	{
		decorator: ['companyName'],
		addonBeforeTitle: '企业名称',
		type: 'input',
		placeholder: '请输入企业名称'
	},
	{
		decorator: ['consigneeCompanyName'],
		addonBeforeTitle: '收货人',
		type: 'input',
		placeholder: '请输入收货人',
		hasType: 'ONLINE'
	},
	{
		decorator: ['transportMode'],
		addonBeforeTitle: '运输方式',
		type: 'select',
		placeholder: '请选择运输方式',
		options: filterCodeByKey('onlineTransTypeDict').map(item => {
			return { value: item.value, label: item.text };
		})
	},
	{
		decorator: ['signTime'],
		addonBeforeTitle: '签订日期',
		type: 'rangePicker',
		realKey: ['contractSignTimeBegin', 'contractSignTimeEnd'],
		hasType: 'OFFLINE'
	},
	{
		decorator: ['contractType'],
		addonBeforeTitle: '合同类型',
		type: 'select',
		placeholder: '请选择合同类型',
		options: [
			{
				label: '采购合同',
				value: 'BUY'
			},
			{
				label: '销售合同',
				value: 'SELL'
			}
		]
	},
	{
		decorator: ['businessType'],
		addonBeforeTitle: '业务类型',
		type: 'select',
		allowClear: true,
		placeholder: '请选择业务类型',
		options: filterCodeByKey('orderBusinessTypeDescMap')
			.map(item => {
				return { value: item.value, label: item.text };
			})
			.filter(item => item.value != 'DISCOUNT_WAREHOUSE_PLEDGE')
	},
	{
		decorator: ['signTime'],
		addonBeforeTitle: '签订日期',
		type: 'rangePicker',
		realKey: ['contractSignTimeBegin', 'contractSignTimeEnd'],
		hasType: 'ONLINE'
	},
	{
		decorator: ['coalType'],
		addonBeforeTitle: '煤种',
		type: 'select',
		placeholder: '请选择',
		options: filterCodeByKey('goods_type').map(item => {
			return { value: item.value, label: item.text };
		}),
		hasType: 'ONLINE'
	}
];
const columns = [
	{ title: '合同类型', dataIndex: 'contractTypeDesc', width: 90 },
	{ title: '合同编号', dataIndex: 'contractNo', scopedSlots: { customRender: 'contractNo' }, width: 120 },
	{ title: '卖方企业名称', dataIndex: 'sellerName', width: 120 },
	{ title: '买方企业名称', dataIndex: 'buyerName', width: 120 },
	{
		title: '收货人',
		dataIndex: 'consigneeCompanyName',
		width: 100,
		customRender: text => {
			return text || '-';
		}
	},
	{
		title: '交货期限',
		dataIndex: 'deliveryStartDate',
		key: 'deliveryStartDate',
		scopedSlots: { customRender: 'deliveryStartDate' },
		width: 130
	},
	{ title: '签订日期', dataIndex: 'signTime', width: 120 },
	{ title: '已付款金额(元)', dataIndex: 'paidAmount', scopedSlots: { customRender: 'paidAmount' }, width: 120 },
	{ title: '运输方式', dataIndex: 'transportModeDesc', width: 120 },
	{
		title: '品名',
		dataIndex: 'goodsName',
		customRender: text => {
			return text || '-';
		},
		width: 120
	},
	{ title: '煤种', dataIndex: 'coalTypeDesc', hasType: 'ONLINE', width: 80 }
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
					t.selectedRowKeys = [record.orderId || record.contractId];
					t.$forceUpdate();
					t.selected = record;
				}
			};
		},
		columns() {
			let columnsSelect = columns.filter(item => {
				if (!item.hasOwnProperty('hasType') || item.hasType == this.currentOrderLineType) {
					return true;
				} else {
					return false;
				}
			});
			return columnsSelect;
		},
		searchList() {
			let searchSelect = searchList.filter(item => {
				if (!item.hasOwnProperty('hasType') || item.hasType == this.currentOrderLineType) {
					return true;
				} else {
					return false;
				}
			});
			return searchSelect;
		}
	},
	props: {
		orderLineType: {
			default: () => {
				return 'ONLINE';
			}
		},
		orderId: {
			default: () => {
				return '';
			}
		},
		type: {
			default: () => {
				return '';
			}
		},
		confirmText: {
			default: () => {
				return '下一步';
			}
		}
	},
	data() {
		return {
			getPopupContainer,
			searchModalParamsRelation: {},
			selectedRowKeys: [],
			visible: false,
			dataSource: [],
			paginationRelation: {},
			selected: null, // 关联合同被选中的数据
			loading: false,
			currentOrderLineType: this.orderLineType
		};
	},
	components: {
		SlFormNew,
		iPagination
	},
	created() {},
	methods: {
		getRelationOrderList(data) {
			this.searchModalParamsRelation = data || {};
			this.loading = true;
			this.selectedRowKeys = [];
			this.selected = null;
			let API =
				this.currentOrderLineType.toUpperCase() === 'ONLINE' ? API_RefundOnlineContractList : API_RefundOfflineContractList;
			API(this.searchModalParamsRelation)
				.then(res => {
					if (res.success) {
						let result = res.result || res.data;
						this.dataSource = result.records || [];
						const paginationRelation = {
							total: result.total,
							pageSize: this.paginationRelation.pageSize,
							current: this.paginationRelation.current || result.pageNo,
							pageNo: this.paginationRelation.pageNo || result.pageNo,
							showTotal: function (total) {
								return `共${total}条记录 第${result.current}页 `;
							}
						};
						this.paginationRelation = paginationRelation;
						if (this.orderId && this.orderLineType === this.currentOrderLineType) {
							this.selectedRowKeys = [this.orderId];
							this.dataSource.forEach(items => {
								if (items.orderId == this.orderId) {
									this.selected = items;
								}
							});
						}
					}
				})
				.finally(() => {
					this.loading = false;
				});
		},
		//外部引用方法打开弹框
		showModal() {
			this.visible = true;
			if (this.currentOrderLineType) {
				this.resetValuesRelation();
			}
		},
		//切换头部，重置
		resetValuesRelation() {
			this.searchModalParamsRelation = {};
			this.dataSource = [];
			this.paginationRelation = {
				current: 1,
				pageNo: 1
			};
			this.getRelationOrderList();
			if (this.$refs.slFormNew) {
				this.$refs.slFormNew.resetSearchQuery();
			}
		},
		handleTableChange(pageNo = this.paginationRelation.pageNo, pageSize = 10, type) {
			this.paginationRelation.pageSize = pageSize;
			this.paginationRelation.pageNo = type === 'size' ? 1 : pageNo;
			this.paginationRelation.current = type === 'size' ? 1 : pageNo;
			this.searchModalParamsRelation.pageNo = this.paginationRelation.current;
			this.searchModalParamsRelation.pageSize = this.paginationRelation.pageSize;
			this.getRelationOrderList(this.searchModalParamsRelation);
		},
		onClickRow(record) {
			return {
				on: {
					click: () => {
						this.selectedRowKeys = [record.orderId || record.contractId];
						this.$forceUpdate();
						this.selected = record;
					}
				}
			};
		},
		handleSubmit() {
			let selected = Object.assign({}, this.selected);
			selected.orderId = this.selected.orderId || this.selected.contractId;
			selected.orderLineType = this.currentOrderLineType;
			if (
				(this.currentOrderLineType === 'ONLINE' ||
					(this.currentOrderLineType === 'OFFLINE' && selected.contractType === 'BUY')) &&
				selected.paidAmount <= 0
			) {
				this.$message.error('该合同累计付款金额=0，无法发起退款');
				return;
			}
			if (this.currentOrderLineType === 'OFFLINE' && selected.contractType === 'SELL' && selected.paidAmount <= 0) {
				this.$message.error('该合同累计回款金额=0，无法发起退款');
				return;
			}
			this.visible = false;
			this.$emit('detail', selected);
		},
		onClose() {
			this.visible = false;
			this.selectedRowKeys = [];
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
.relation-contract-modal-btn {
	height: 32px;
	line-height: 32px;
}
</style>
