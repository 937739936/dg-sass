<template>
	<div>
		<div class="title">
			<span> <i class="title_icon" />合同货物明细</span>
			<a-button
				v-if="editable"
				type="primary"
				style="margin-left: 10px"
				@click="exportFile"
				>待开具导出</a-button
			>
		</div>
		<a-table
			:rowSelection="rowSelection"
			:columns="goodsTransferColumns"
			:scroll="{ x: true }"
			:rowKey="record => record.purchaseId"
			:dataSource="goodsTransferData"
			:pagination="false"
			:locale="{ emptyText: '暂无数据' }"
		>
		</a-table>
	</div>
</template>

<script>
import comDownload from '@sub/utils/comDownload.js';
import { API_exportContractPurchase } from '@/v2/center/steels/api/goodsTransfer.js';
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
		title: '材质',
		dataIndex: 'materialTexture'
	},
	{
		title: '规格',
		dataIndex: 'specs'
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
		dataIndex: 'quantity'
	}
];
export default {
	props: {
		goodsTransferData: {
			default: () => []
		},
		uploadIds: {
			default: () => []
		},
		editable: {
			default: true
		}
	},
	watch: {
		uploadIds: {
			handler(val) {
				this.receiveIds = val;
				const list = [];
				this.goodsTransferData.forEach(el => {
					this.receiveIds.forEach(el2 => {
						if (el2 == el.purchaseId) {
							list.push(el);
						}
					});
				});

				if (this.receiveIds.length) {
					this.$emit('send', list);
				}
			},
			immediate: true,
			deep: true
		}
	},
	data() {
		return {
			receiveIds: [],
			selectData: [],
			goodsTransferColumns
		};
	},
	computed: {
		rowSelection() {
			const that = this;
			return {
				selectedRowKeys: this.receiveIds,
				onChange: (selectedRowKeys, selectedRows) => {
					that.receiveIds = selectedRowKeys;
					that.selectData = selectedRows;
					that.$emit('send', that.selectData);
				},
				getCheckboxProps: record => ({
					props: {
						disabled: record.surplusQuantity <= 0 || !this.editable
					}
				})
			};
		}
	},
	methods: {
		// 导出
		async exportFile() {
			const params = {
				contractId: this.$route.query.contractId
			};
			const res = await API_exportContractPurchase(params);
			comDownload(res, null, '货转清单.xls');
		}
	},
	components: {}
};
</script>

<style lang="less" scoped>
.purchase-list-detail {
	.title {
		margin-bottom: 14px;
		padding-left: 40px;
		font-weight: 500;
		font-size: 18px;
		color: #000;
	}
	.title::before {
		content: '';
		height: 20px;
		margin-right: 10px;
		display: inline-block;
		vertical-align: middle;
		position: relative;
		top: -1px;
		width: 2px;
		background: @primary-color;
	}
}
</style>
