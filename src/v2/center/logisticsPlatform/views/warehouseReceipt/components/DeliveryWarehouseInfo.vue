<template>
	<div>
		<a-table
			rowKey="name"
			class="new-table new-table2"
			:columns="columns"
			:dataSource="list"
			:pagination="false"
			:defaultExpandAllRows="true"
			:locale="{ emptyText: '暂无数据' }"
		>
			<template
				slot="warehouseReceiptNo"
				slot-scope="text, record"
			>
				<a
					href="javascript:;"
					@click="viewReceipt(record.warehouseReceiptFilePath)"
					>{{ text }}</a
				>
			</template>
			<template slot="title2"
				><i style="display: inline-block; color: red; margin-right: 10px; position: relative; top: 2px">*</i
				>本次提货数量(吨)</template
			>
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
				slot="outQuantity"
				slot-scope="text, record"
			>
				<a-input-number
					placeholder="请输入数量"
					:precision="4"
					:min="0"
					:max="record.quantity"
					v-model="record.outBoundQuantity"
				/>
			</template>
			<template slot="title3">
				<a
					href="javascript:;"
					@click="handleAllOutQuantity"
					>一键全提</a
				>
			</template>
			<template
				slot="action"
				slot-scope="text, record"
			>
				<a
					href="javascript:;"
					@click="handleOutQuantity(record)"
					>全提</a
				>
			</template>
		</a-table>
		<div class="goods-tips">
			<span>提货合计数量：</span>
			<span style="color: #f46332">{{ allQuantity | formatMoney(4) }}吨</span>
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
			<pdf-preview :url="currentPdf"></pdf-preview>
		</a-modal>
	</div>
</template>

<script>
import { formatMoney } from '@sub/filters';
import PdfPreview from '@sub/components/pdf/index.vue';

const columns = [
	{ title: '仓单编号', dataIndex: 'warehouseReceiptNo', scopedSlots: { customRender: 'warehouseReceiptNo' } },
	{ title: '货物名称', dataIndex: 'goodsName' },
	{
		title: '仓房-货位',
		dataIndex: 'warehouseGoodsAllocationName',
		scopedSlots: { customRender: 'warehouseGoodsAllocationName' }
	},
	{ title: '仓单数量(吨)', dataIndex: 'quantity', customRender: t => formatMoney(t, 4) },
	{ dataIndex: 'outBoundQuantity', slots: { title: 'title2' }, scopedSlots: { customRender: 'outQuantity' } },
	{ slots: { title: 'title3' }, scopedSlots: { customRender: 'action' } }
];
export default {
	props: {
		list: {
			default: () => {
				return [];
			}
		}
	},
	computed: {
		allQuantity() {
			let num = 0;
			this.list.forEach(el => {
				num += el.outBoundQuantity || 0;
			});
			return num;
		}
	},
	watch: {
		allQuantity: {
			handler(val) {
				this.$emit('allQuantityChanged', val);
			}
		}
	},
	data() {
		return {
			columns,
			previewVisible: false,
			currentPdf: ''
		};
	},
	methods: {
		// outBoundQuantityChanged() {
		// 	this.$emit('allQuantityChanged', this.allQuantity);
		// },
		handleOutQuantity(item) {
			item.outBoundQuantity = item.quantity;
			this.$forceUpdate();
		},
		handleAllOutQuantity() {
			this.list.forEach(el => {
				el.outBoundQuantity = el.quantity;
			});
			this.$forceUpdate();
		},
		save(needError) {
			let errMsg = '';
			let flag = this.list.every(el => !el.outBoundQuantity);
			if (flag) {
				errMsg = '提货数量不能全部为0';
			}
			if (errMsg) {
				if (needError != false) {
					this.$message.error(errMsg);
				}
				return;
			}
			const arr = this.list.map(el => {
				return {
					id: el.id,
					warehouseReceiptNo: el.warehouseReceiptNo,
					outBoundQuantity: el.outBoundQuantity || 0
				};
			});
			return { deliveryInfoList: arr, quantity: this.allQuantity };
		},
		viewReceipt(filePath) {
			if (!filePath) {
				return;
			}
			this.currentPdf = filePath;
			this.previewVisible = true;
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
.goods-tips {
	margin-top: 20px;
	font-size: 14px;
	color: rgba(0, 0, 0, 0.4);
	span:nth-child(2n) {
		color: rgba(0, 0, 0, 0.8);
		font-weight: 600;
	}
}
</style>
