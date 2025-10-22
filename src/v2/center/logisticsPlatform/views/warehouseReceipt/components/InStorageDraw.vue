<template>
	<div>
		<!-- 关联采购、销售合同弹窗 -->
		<a-drawer
			class="slDrawer"
			title="选择入库记录"
			placement="right"
			:visible="orderRelationModal"
			@close="onClose"
			:footer="null"
			destroyOnClose
		>
			<SlFormNew
				:list="searchList"
				layout="inline"
				@change="onSearch"
				@resetFunc="resetFunc"
				:isShowIcon="false"
				:isShowSearchBox="true"
				:colSpan="8"
				ref="slFormNew"
			></SlFormNew>
			<!-- 表格 -->
			<div style="margin-top: 20px">
				<a-table
					class="new-table"
					:bordered="false"
					:scroll="{ x: true }"
					:rowSelection="rowSelection"
					:dataSource="relationOrderList"
					:columns="relationOrderListColumns"
					:pagination="false"
					:rowKey="record => record.inStorageNo"
					:loading="loading"
				>
					<!-- <template slot="inStorageNo" slot-scope="text">
            <a href="javascript:;">{{text}}</a>
          </template> -->
					<template
						slot="goodsName"
						slot-scope="text"
					>
						<a-tooltip v-if="text">
							<template slot="title">{{ text }}</template>
							<p class="omit">{{ text || '-' }}</p>
						</a-tooltip>
						<span v-else>-</span>
					</template>
					<template
						slot="warehouseGoodsAllocationName"
						slot-scope="text"
					>
						<a-tooltip v-if="text">
							<template slot="title">{{ text }}</template>
							<p class="omit">{{ text || '-' }}</p>
						</a-tooltip>
						<span v-else>-</span>
					</template>
					<template
						slot="deliveryCompanyName"
						slot-scope="text"
					>
						<a-tooltip>
							<template slot="title">{{ text }}</template>
							<p class="omit">{{ text }}</p>
						</a-tooltip>
					</template>
				</a-table>
				<p class="tip">已选择入库数量合计：<span>{{allQuantity}}吨</span></p>
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
						class="relation-contract-modal-btn"
						style="margin-right: 8px"
						@click="onClose"
						>取消</a-button
					>
					<a-button
						class="relation-contract-modal-btn"
						:disabled="!selectedRowKeys.length"
						type="primary"
						@click="handleSubmit"
					>
						确定</a-button
					>
				</a-space>
			</div>
		</a-drawer>
	</div>
</template>

<script>
import { filterCodeByKey } from '@sub/utils/globalCode.js';

import { getWarehouseReceiptOpenInList } from '@/v2/center/logisticsPlatform/api/warehouseReceipt';
import { getPopupContainer } from '@sub/utils/factory.js';
import SlFormNew from '@sub/components/ui-new/Form/sl-form.vue';
import iPagination from '@sub/components/iPagination';
import { formatMoney } from '@sub/filters';

const searchListOn = [
	{
		decorator: ['serialNo'],
		addonBeforeTitle: '编号',
		type: 'input',
		placeholder: `请输入采购合同编号、入库编号查询`
	},
	{
		decorator: ['deliveryCompanyName'],
		addonBeforeTitle: `发货单位`,
		type: 'input',
		placeholder: `请输入发货单位`
	},
	{
		decorator: ['storageDate'],
		addonBeforeTitle: `入库日期`,
		type: 'rangePicker',
		realKey: ['beginDate', 'endDate']
	}
];

const relationOrderListColumns = [
	{ title: `入库编号`, key: 'inStorageNo', dataIndex: 'inStorageNo', fixed: 'left' },
	{ title: `入库日期`, key: 'storageDate', dataIndex: 'storageDate' },
	{ title: `品名`, key: 'goodsName', dataIndex: 'goodsName', scopedSlots: { customRender: 'goodsName' } },
	{ title: `入库数量(吨)`, key: 'quantity', dataIndex: 'quantity', customRender: t => formatMoney(t) },

	{
		title: `发货单位`,
		key: 'deliveryCompanyName',
		dataIndex: 'deliveryCompanyName',
		scopedSlots: { customRender: 'deliveryCompanyName' }
	},
	{ title: `仓库名称`, key: 'stationName', dataIndex: 'stationName', customRender: t => t || '-' },
	{
		title: `仓房-货位`,
		key: 'warehouseGoodsAllocationName',
		dataIndex: 'warehouseGoodsAllocationName',
		scopedSlots: { customRender: 'warehouseGoodsAllocationName' }
	}
];

export default {
	name: 'RelationContract',
	props: {
		contractId: {
			default:'',
		},
		contractType: {
			default:''
		}
	},
	data() {
		return {
			getPopupContainer,
			relationOrderListColumns,
			searchModalParamsRelation: {},
			orderRelationModal: false,
			relationOrderList: [],
			paginationRelation: {
				current: 1,
				pageNo: 1,
				pageSize: 10,
				total: 0
			},
			searchListOn,
			searchList: [],
			loading: false,
			selectedRowKeys: [],
			selectedRows: [],
			allList: [],
		};
	},
	components: {
		SlFormNew,
		iPagination
	},
	created() {
		this.searchList = this.searchListOn;
		this.getAllList()
	},
	computed: {
		rowSelection() {
			const { selectedRowKeys } = this;
			const t = this;

			return {
				selectedRowKeys,
				onChange: (selectedRowKeys, selectedRows) => {
					this.selectedRowKeys = selectedRowKeys;
					this.selectedRows = selectedRows;
				}
			};
		},
		allQuantity() {
			let num = 0
			this.selectList.forEach(el => {
				num += el.quantity
			})
			return formatMoney(num);
		},
		/** 获取选择的数据 */
		selectList() {
			const list = this.allList.filter(el => this.selectedRowKeys.includes(el.inStorageNo))
			return list || []
		}
	},
	methods: {
		formatMoney,
		resetFunc() {
			this.paginationRelation.current = 1;
			this.paginationRelation.pageNo = 1;
		},
		onSearch(data) {
			this.paginationRelation.current = 1;
			this.paginationRelation.pageNo = 1;
			this.getRelationOrderList(data);
		},
		async getRelationOrderList(data) {
			let API = getWarehouseReceiptOpenInList;
			this.searchModalParamsRelation = data || {};
			this.loading = true;
			const params = {
				...this.searchModalParamsRelation,
				...this.paginationRelation,
			};
			if(this.contractId && this.contractType) {
				params.contractId = this.contractId
				params.contractType = this.contractType

			}
			delete params.showTotal;
			try {
				const res = await API(params);
				let result = res.result || res.data;
				const list = result.records || [];
				this.relationOrderList = list;
				const paginationRelation = {
					total: result.total,
					pageSize: result.size,
					current: result.current,
					pageNo: result.current,
					showTotal: function (total) {
						return `共${total}条记录 第${result.current}页 `;
					}
				};
				this.paginationRelation = paginationRelation;
				this.loading = false;
			} catch (error) {
				this.loading = false;
			}
		},
		async getAllList() {
			const params = {
				pageSize: 1000000,
				pageNo:1,
			}
			const res = await getWarehouseReceiptOpenInList(params)
			this.allList = res.data.records || []
		},
		//外部引用方法打开弹框
		show(selectInList = []) {
			this.selectedRows = selectInList;
			this.selectedRowKeys = selectInList.map(el => el.inStorageNo);

			this.orderRelationModal = true;
			this.resetValuesRelation();
		},
		//切换头部，重置
		resetValuesRelation() {
			this.searchModalParamsRelation = {};
			this.relationOrderList = [];
			this.paginationRelation = {
				current: 1,
				pageNo: 1,
				pageSize: 10,
				total: 0
			};
			this.getRelationOrderList();
			if (this.$refs.slFormNew) {
				this.$refs.slFormNew.resetSearchQuery();
			}
		},
		handleTableChange(pageNo = this.paginationRelation.pageNo, pageSize = this.paginationRelation.pageSize) {
			this.paginationRelation.pageSize = pageSize;
			this.paginationRelation.pageNo = pageNo;
			this.paginationRelation.current = pageNo;
			this.getRelationOrderList(this.searchModalParamsRelation);
		},
		selectContract(item) {
			this.orderRelationModal = false;
			// if(this.contractType == 'buy') {
			//    this.$store.commit('businessLine/updateBuyContract', item)
			// } else {
			//   this.$store.commit('businessLine/updateSellContract', item)
			// }
		},
		onClose() {
			let m = function (e) {
				e.preventDefault();
			};
			document.body.style.overflow = ''; //出现滚动条
			document.body.style.height = '';
			document.removeEventListener('touchmove', m, { passive: true });
			this.orderRelationModal = false;
		},
		handleSubmit() {
			this.orderRelationModal = false;
			this.$emit('select', this.selectList);
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
</style>
<style lang="less" scoped>
.relation-contract-modal-btn {
	// height: 32px;
	// line-height: 32px;
}
.relation-contract-modal-btn[disabled] {
	border: 1px solid transparent;
}
.omit {
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
	display: inline-block;
	vertical-align: bottom;
}
.tip {
	margin-top: 20px;
	color: rgba(0,0,0,0.4);
	span {
		font-weight: 600;
		color: #f46332;
	}
}
</style>
