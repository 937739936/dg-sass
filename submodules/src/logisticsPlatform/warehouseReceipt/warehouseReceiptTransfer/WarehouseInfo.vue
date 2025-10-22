<template>
	<div style="width: 100%">
		<div
			class="slTitleAssis"
			style="margin-bottom: 20px"
		>
			过户仓单信息
		</div>
		<div
			class="tips-box"
			v-if="isShowTip"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				viewBox="0 0 20 20"
				fill="none"
			>
				<path
					d="M10 20C4.47715 20 0 15.5228 0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20ZM9 13V15H11V13H9ZM9 5V11H11V5H9Z"
					fill="var(--primary-color)"
				/>
			</svg>
			<span>
				若仓单全部过户，则生成过户子仓单；若仓单部分过户，则原仓单会拆分为存货子仓单、过户子仓单；仓储方审核通过盖章后，原仓单状态会更新为“已核销”，过户子仓单及存货子仓单状态更新为“生效中”。</span
			>
		</div>
		<a-table
			rowKey="name"
			class="new-table new-table2"
			:columns="columns"
			:dataSource="list"
			:pagination="false"
			:scroll="{ x: true }"
			:defaultExpandAllRows="true"
			:locale="{ emptyText: '暂无数据' }"
		>
			<template
				slot="warehouseReceiptNo"
				slot-scope="text, record, i"
			>
				<a
					href="javascript:;"
					v-if="text"
					@click="openModal(record, 'warehouseReceiptFilePath', i)"
					>{{ text || '-' }}</a
				>
				<span v-else>-</span>
			</template>
			<template
				slot="transferChildWarehouseReceiptNo"
				slot-scope="text, record, i"
			>
				<a
					href="javascript:;"
					v-if="text"
					@click="openModal(record, 'transferChildFilePath', i)"
					>{{ text }}</a
				>
				<span v-else>-</span>
			</template>
			<template
				slot="inventoryChildWarehouseReceiptNo"
				slot-scope="text, record, i"
			>
				<a
					href="javascript:;"
					v-if="text"
					@click="openModal(record, 'inventoryChildFilePath', i)"
					>{{ text || '-' }}</a
				>
				<span v-else>-</span>
			</template>
			<template
				slot="warehouseGoodsAllocationName"
				slot-scope="text"
			>
				<a-tooltip v-if="text">
					<template slot="title">{{ text }}</template>
					<div class="omit">{{ text || '-' }}</div>
				</a-tooltip>
				<span v-else>-</span>
			</template>
			<div
				slot="transferChildStatusDesc"
				slot-scope="text, record"
			>
				<span
					class="status"
					:class="record.transferChildStatus"
					>{{ record.transferChildStatusDesc }}</span
				>
			</div>
		</a-table>
		<a-modal
			class="slModal slModal2"
			:visible="previewVisible"
			:width="1174"
			:forceRender="true"
			:destroyOnClose="true"
			@cancel="previewVisible = false"
			title="仓单预览"
			:footer="null"
		>
			<div
				class="content"
				v-if="currentPdf"
			>
				<pdf-preview :url="currentPdf"></pdf-preview>
			</div>
		</a-modal>
	</div>
</template>

<script>
import { formatMoney } from '@sub/filters';

const goodsColumns = [
	{ title: '原仓单编号', dataIndex: 'warehouseReceiptNo', scopedSlots: { customRender: 'warehouseReceiptNo' }, fixed: 'left' },
	{ title: '原持有人', dataIndex: 'transferorName' },
	{ title: '接收方', dataIndex: 'receiverName', customRender: t => t || '-' },
	{ title: '货物名称', dataIndex: 'goodsName' },
	{
		title: '仓房-货位',
		dataIndex: 'warehouseGoodsAllocationName',
		scopedSlots: { customRender: 'warehouseGoodsAllocationName' }
	},
	{ title: '原仓单数量(吨)', dataIndex: 'quantity', customRender: t => formatMoney(t, 4) },
	{
		title: '过户子仓单编号',
		dataIndex: 'transferChildWarehouseReceiptNo',
		scopedSlots: { customRender: 'transferChildWarehouseReceiptNo' }
	},
	{ title: '过户子仓单数量(吨)', dataIndex: 'transferQuantity', customRender: t => formatMoney(t, 4) },
	{
		title: '存货子仓单编号',
		dataIndex: 'inventoryChildWarehouseReceiptNo',
		scopedSlots: { customRender: 'inventoryChildWarehouseReceiptNo' }
	},
	{ title: '存货子仓单数量(吨)', dataIndex: 'inventoryQuantity', customRender: t => formatMoney(t, 4) }
];
import PdfPreview from '@sub/components/pdf/index.vue';
export default {
	props: {
		list: {
			default: () => {
				return [];
			}
		},
		isShowTip: {
			default: true
		},
		goodsColumns: {}
	},
	data() {
		return {
			previewVisible: false,
			currentPdf: ''
		};
	},
	computed: {
		columns() {
			if (this.goodsColumns) {
				return this.goodsColumns;
			}
			return goodsColumns;
		}
	},
	methods: {
		openModal(record, key, i) {
			const item = this.list[i];
			// inventoryChildFilePath
			// transferChildFilePath
			// warehouseReceiptFilePath
			// let index = 0
			// if(key == 'transferChildFilePath') {
			// 	index = 1
			// }
			// if(key == 'inventoryChildFilePath') {
			// 	index = 2
			// }
			// let newList = []
			// if(item.warehouseReceiptFilePath) {
			// 	newList.push({path: item.warehouseReceiptFilePath})
			// }
			// if(item.transferChildFilePath) {
			// 	newList.push({path: item.transferChildFilePath})
			// }
			// if(item.inventoryChildFilePath) {
			// 	newList.push({path: item.inventoryChildFilePath})
			// }
			// this.$emit('viewCarousel', newList, index)
			// 获取当前的PDF
			this.previewVisible = true;
			this.currentPdf = record[key];
		}
	},
	components: {
		PdfPreview
	}
};
</script>
<style lang="less" scoped>
@import url('~@sub/style/table-cover.less');
</style>
<style scoped lang="less">
.tips-box {
	color: rgba(0, 0, 0, 0.8);
	display: flex;
	align-items: center;
	justify-content: flex-start;
	border: 1px solid #d0dfff;
	background: #e1eafe;
	border-radius: 4px;
	padding: 10px 10px;
	margin-bottom: 20px;
	span {
		margin-left: 10px;
	}
}
.status {
	display: inline-block;
	padding: 1px 6px;
	align-items: flex-start;
	gap: 10px;
	text-align: center;
	border-radius: 4px;
	font-family: PingFang SC;
	font-size: 12px;
	margin-left: 4px;

	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
	vertical-align: middle;
	background: #d3dffb;
	color: #4682f3;
}
.AUDITING {
	background: #ffdac8;
	color: #ff7937;
}
.TRANSFERRED,
.OPENED {
	background: #c5ecdd;
	color: #3eb384;
}
.TO_STORAGE_SIGN,
.TO_STORAGE_AUDITING {
	background: #d3dffb;
	color: #4682f3;
}
.EXPIRE {
	background: #e0e0e0;
	color: rgba(0, 0, 0, 0.25);
}
.RECEIVER_REJECT,
.CANCEL,
.STORAGE_REJECT {
	background: #f2d0d0;
	color: #dd4444;
}
</style>
