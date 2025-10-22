<template>
	<div>
		<a-alert
			class="a-alert"
			type="info"
		>
			<template slot="message">
				<div class="alert-wrapper">
					<div class="alert-icon">
						<img
							src="@/assets/imgs/warning/warning.png"
							style="width: 16px; height: 16px"
							alt=""
						/>
					</div>
					<span
						class="alert-message"
						v-html="
							`若仓单全部提货，则仓储方审核通过后线下出库，原仓单状态会更新为“已出库”；<br/>
					若仓单部分提货，则原仓单会拆分为存货子仓单、出库子仓单，仓储方审核通过盖章后线下出库，原仓单状态更新为“已核销”，出库子仓单状态会更新为“已出库”，存货子仓单状态更新为“生效中”。`
						"
					></span>
				</div>
			</template>
		</a-alert>
		<div class="table-box">
			<a-table
				class="new-table"
				:columns="columns"
				:dataSource="deliveryReceipts"
				:pagination="false"
				:scroll="{ x: true }"
			>
				<template
					slot="warehouseReceiptNo"
					slot-scope="text, record"
				>
					<span v-if="text">
						<a
							href="javascript:;"
							@click="viewReceiptDetailById(record.id)"
							>{{ text }}</a
						>
					</span>
					<span v-else>-</span>
				</template>
				<template
					slot="outBoundChildWarehouseReceiptNo"
					slot-scope="text, record"
				>
					<span v-if="text">
						<a
							href="javascript:;"
							@click="previewReceipt(record.outBoundChildFilePath)"
							>{{ text }}</a
						>
					</span>
					<span v-else>-</span>
				</template>
				<template
					slot="inventoryChildWarehouseReceiptNo"
					slot-scope="text, record"
				>
					<span v-if="text">
						<a
							href="javascript:;"
							@click="previewReceipt(record.inventoryChildFilePath)"
							>{{ text }}</a
						>
					</span>
					<span v-else>-</span>
				</template>
			</a-table>
		</div>
		<a-modal
			class="slModal slModal2"
			:visible="previewVisible"
			:width="1174"
			@cancel="previewVisible = false"
			title="仓单预览"
			:footer="null"
			:forceRender="true"
			:destroyOnClose="true"
		>
			<div>
				<pdf-preview :url="currentPdf"></pdf-preview>
			</div>
		</a-modal>
	</div>
</template>
<script>
import { formatMoney } from '@sub/filters';
import PdfPreview from '@sub/components/pdf/index.vue';

const customRender = text => text || '-';
const columns = [
	{
		title: '原仓单编号',
		key: 'warehouseReceiptNo',
		dataIndex: 'warehouseReceiptNo',
		scopedSlots: { customRender: 'warehouseReceiptNo' }
	},
	{
		title: '原持有人',
		dataIndex: 'bailorCompanyName',
		customRender
	},
	{
		title: '提货方',
		dataIndex: 'deliveryCompanyName',
		customRender
	},
	{
		title: '货物名称',
		dataIndex: 'goodsName',
		customRender
	},
	{
		title: '仓房-货位',
		dataIndex: 'warehouseGoodsAllocationName',
		customRender
	},
	{
		title: '原仓单数量（吨）',
		dataIndex: 'quantity',
		customRender: t => formatMoney(t, 4)
	},
	{
		title: '出库仓单编号',
		dataIndex: 'outBoundChildWarehouseReceiptNo',
		scopedSlots: { customRender: 'outBoundChildWarehouseReceiptNo' }
	},
	{
		title: '出库仓单数量（吨）',
		dataIndex: 'outBoundQuantity',
		customRender: t => formatMoney(t, 4)
	},
	{
		title: '存货子仓单编号',
		dataIndex: 'inventoryChildWarehouseReceiptNo',
		scopedSlots: { customRender: 'inventoryChildWarehouseReceiptNo' }
	},
	{
		title: '存货子仓单数量（吨）',
		dataIndex: 'inventoryQuantity',
		customRender: t => {
			if (t == 0) {
				return '-';
			}
			return formatMoney(t, 4);
		}
	}
];
export default {
	props: {
		deliveryReceipts: {
			default: []
		}
	},
	components: {
		PdfPreview
	},

	data() {
		return { columns, currentPdf: '', previewVisible: false };
	},
	methods: {
		formatMoney,
		previewReceipt(path) {
			if (!path) return;
			this.currentPdf = path;
			this.previewVisible = true;
		},
		viewReceiptDetailById(id) {
			if (!id) return;
			let path = '/center/logisticsPlatform/warehouseReceipt/warehouseReceiptQuery/detail';
			let routerData = this.$router.resolve({
				path,
				query: {
					id
				}
			});
			window.open(routerData.href, '_blank');
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@sub/style/table-cover.less');
</style>

<style lang="less" scoped>
.table-box {
	/deep/ .ant-table {
		td,
		th {
			white-space: nowrap;
		}
	}
}

.a-alert {
	display: inline-block;
	background: rgba(0, 83, 219, 0.1);
	border: 1px solid #d0dfff;
	border-radius: 4px;
	width: 100%;
	// margin-bottom: 24px;
	.alert-wrapper {
		display: flex;
		flex-direction: row;
	}
	.alert-icon {
		display: flex;
		justify-content: center;
		align-items: center;
		padding-right: 12px;
	}
	.alert-message {
		font-size: 14px;
		color: rgba(0, 0, 0, 0.8);
		letter-spacing: 0;
		line-height: 18px;
	}
}
</style>
