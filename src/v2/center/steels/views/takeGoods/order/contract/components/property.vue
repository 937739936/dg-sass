<template>
	<div>
		<div
			class="title"
			style="justify-content: space-between"
		>
			<span> <i class="title_icon" />{{ title }}</span>
			<a-button
				type="primary"
				style="margin-left: 10px"
				@click="exportFile"
				>导出</a-button
			>
		</div>
		<a-table
			:rowSelection="rowSelection"
			:columns="columns"
			:scroll="{ x: true }"
			:rowKey="record => (record.purchaseId ? record.purchaseId : record.mainId)"
			:dataSource="list"
			:pagination="false"
			:locale="{ emptyText: '暂无数据' }"
		>
		</a-table>
	</div>
</template>

<script>
import comDownload from '@sub/utils/comDownload.js';
import { exportContractDetail } from '@/v2/center/steels/api/orderApply.js';
const contractColumns = [
	{
		title: '序号',
		dataIndex: 'index',
		key: 'index',
		align: 'center',
		customRender: function (t, r, index) {
			return parseInt(index) + 1;
		}
	},
	{
		title: '品名',
		dataIndex: 'materialName',
		width: 200
	},
	{
		title: '规格',
		dataIndex: 'specs',
		width: 300
	},
	{
		title: '材质',
		dataIndex: 'materialTexture',
		width: 300
	},

	{
		title: '产地',
		dataIndex: 'placeOfOrigin'
	},
	{
		title: '合同件数',
		dataIndex: 'pieceQuantity'
	},
	{
		title: '捆包号',
		dataIndex: 'baleNo'
	},
	{
		title: '合同数量（吨）',
		dataIndex: 'quantity',
		fixed: 'right'
	}
];
const goodsTransferColumns = [
	{
		title: '序号',
		dataIndex: 'index',
		key: 'index',
		align: 'center',
		customRender: function (t, r, index) {
			return parseInt(index) + 1;
		}
	},
	{
		title: '品名',
		dataIndex: 'materialName'
	},
	{
		title: '规格',
		dataIndex: 'specs',
		width: 300
	},
	{
		title: '材质',
		dataIndex: 'materialTexture',
		width: 300
	},

	{
		title: '产地',
		dataIndex: 'placeOfOrigin'
	},
	{
		title: '货转件数',
		dataIndex: 'pieceQuantity'
	},
	{
		title: '捆包号',
		dataIndex: 'baleNo'
	},
	{
		title: '货转数量（吨）',
		dataIndex: 'quantity',
		fixed: 'right'
	}
	// {
	//   title: '剩余件数',
	//   dataIndex: 'surplusPieceQuantity'
	// },
	// {
	//   title: '剩余数量(吨)',
	//   dataIndex: 'surplusQuantity'
	// },
	// {
	//   title: '计量方式',
	//   dataIndex: 'metrologyWay',
	// },
];
export default {
	props: {
		list: {
			default: () => []
		},
		uploadIds: {
			default: () => []
		},
		appointSpec: {
			default: '1'
		},
		businessLineFullNo: {
			default: ''
		},
		// 判断是 入库 还是厂提
		// WAREHOUSING
		upDeliveryMode: {
			default: ''
		},
		contractDetails: {
			default: () => {}
		}
	},
	watch: {
		uploadIds(val) {
			this.receiveIds = val;
			const arr = this.list.filter(el => val.includes(el.mainId || el.purchaseId));
			if (arr.length) {
				this.warehouse = arr[0].warehouse;
				this.warehouseId = arr[0].warehouseId;
				this.$emit('sendWarehouse', { warehouseId: this.warehouseId, warehouse: this.warehouse });
			}
		}
	},
	data() {
		return {
			receiveIds: [],
			selectData: [],
			goodsTransferColumns,
			// 选择的仓库
			warehouse: '',
			warehouseId: ''
		};
	},
	computed: {
		disabledAll() {
			return ['preview', 'upload', 'input', 'relation', 'oa'].includes(this.$route.query.type);
		},
		rowSelection() {
			const that = this;
			if (this.disabledAll) {
				return null;
			}
			if (this.appointSpec == 0) {
				return null;
			}
			return {
				selectedRowKeys: this.receiveIds,
				hideDefaultSelections: true,
				onChange: (selectedRowKeys, selectedRows) => {
					// 指定规格 并且 是 入库
					if (!this.warehouse) {
						this.warehouse = selectedRows[0].warehouse;
						this.warehouseId = selectedRows[0].warehouseId;
					}
					if (!selectedRows.length) {
						this.warehouse = '';
						this.warehouseId = '';
					}
					this.$emit('sendWarehouse', { warehouseId: this.warehouseId, warehouse: this.warehouse });

					if (this.upDeliveryMode == 'WAREHOUSING') {
						const flag = selectedRows.some(el => el.warehouse != this.warehouse);
						if (flag) {
							this.$message.error('请选择同一个仓库下的货转明细');
							return;
						}
					}

					that.receiveIds = selectedRowKeys;
					that.selectData = selectedRows;
					that.$emit('send', that.selectData, that.receiveIds);
				},
				getCheckboxProps: record => ({
					props: {
						disabled: record.surplusQuantity <= 0
					}
				})
			};
		},
		title() {
			if (this.upDeliveryMode == 'WAREHOUSING') {
				return '货转清单';
			}
			return '合同货物明细';
		},
		columns() {
			if (this.upDeliveryMode == 'WAREHOUSING') {
				return goodsTransferColumns;
			}
			return contractColumns;
		}
	},
	methods: {
		// 导出
		async exportFile() {
			const params = {
				contractId: this.$route.query.contractId,
				isModify: this.isEdit ? 1 : 0,
				takeDeliveryId: this.$route.query.num,
				businessLineFullNo: this.businessLineFullNo
			};
			const res = await exportContractDetail(params);
			comDownload(res, null, '货物明细.xls');
		}
	},
	components: {}
};
</script>
<style lang="less"></style>
<style scoped lang="less">
/deep/ .ant-table-thead {
	.ant-table-selection {
		display: none;
	}
}
.title {
	display: flex;
	align-items: center;
	margin-bottom: 20px;
}
</style>
