<template>
	<div>
		<div
			class="title"
			style="justify-content: space-between"
		>
			<span> <i class="title_icon" />待开具货权清单</span>
			<a-button
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
			:rowKey="record => record.mainId"
			:dataSource="goodsTransferData"
			:pagination="false"
			:locale="{ emptyText: '暂无数据' }"
		>
		</a-table>
	</div>
</template>

<script>
import comDownload from '@sub/utils/comDownload.js';
import { exportContractPurchase } from '@/v2/center/steels/api/goodsTransfer.js';
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
		dataIndex: 'specs'
	},
	{
		title: '材质',
		dataIndex: 'materialTexture'
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
	},
	{
		title: '计量方式',
		dataIndex: 'metrologyWay'
	}
];
export default {
	props: {
		goodsTransferData: {
			default: () => []
		},
		uploadIds: {
			default: () => []
		}
	},
	watch: {
		uploadIds(val) {
			this.receiveIds = val;
			const list = [];
			this.goodsTransferData.forEach(el => {
				this.receiveIds.forEach(el2 => {
					if (el2 == el.mainId) {
						list.push(el);
					}
				});
			});
			// if(this.receiveIds.length) {
			//   this.$emit('send', list)
			// }
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
						disabled: record.surplusQuantity <= 0 || this.ifEditable
					}
				})
			};
		},
		// 提交
		ifEditable() {
			return this.$route.query.flag == 'submit';
		}
	},
	methods: {
		// 导出
		async exportFile() {
			const params = {
				contractId: this.$route.query.contractId,
				goodsTransferId: this.$route.query.goodsTransferId,
				isModify: this.isEdit ? 1 : 0
			};
			const res = await exportContractPurchase(params);
			comDownload(res, null, '货转清单.xls');
		}
	},
	components: {}
};
</script>

<style scoped></style>
