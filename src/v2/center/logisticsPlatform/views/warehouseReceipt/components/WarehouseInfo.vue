<template>
	<div>
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
				slot-scope="text, record"
			>
				<a
					href="javascript:;"
					@click="pdfView(record)"
					>{{ text }}</a
				>
			</template>
			<template slot="title2"
				><i style="display: inline-block; color: red; margin-right: 10px; position: relative; top: 2px">*</i
				>本次转让数量(吨)</template
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
				slot="transferQuantity"
				slot-scope="text, record"
			>
				<a-input-number
					placeholder="请输入数量"
					:precision="4"
					:min="0"
					:max="record.quantity"
					v-model="record.transferQuantity"
				/>
			</template>
			<template slot="title3">
				<a
					href="javascript:;"
					@click="goAllTransfer"
					>一键全转</a
				>
			</template>
			<template
				slot="action"
				slot-scope="text, record"
			>
				<a
					href="javascript:;"
					@click="goTransfer(record)"
					>全转</a
				>
			</template>
		</a-table>
		<div class="goods-tips">
			<span>转让合计数量：</span>
			<span style="color: #f46332">{{ allQuantity | formatMoney(4) }}吨</span>
		</div>
	</div>
</template>

<script>
import { formatMoney } from '@sub/filters';
import ENV from '@/v2/config/env';
const columns = [
	{ title: '仓单编号', dataIndex: 'warehouseReceiptNo', scopedSlots: { customRender: 'warehouseReceiptNo' } },
	{ title: '货物名称', dataIndex: 'goodsName' },
	{
		title: '仓房&货位',
		dataIndex: 'warehouseGoodsAllocationName',
		scopedSlots: { customRender: 'warehouseGoodsAllocationName' }
	},
	{ title: '仓单数量(吨)', dataIndex: 'quantity', customRender: t => formatMoney(t, 4) },
	{ dataIndex: 'transferQuantity', slots: { title: 'title2' }, scopedSlots: { customRender: 'transferQuantity' } },
	{ slots: { title: 'title3' }, scopedSlots: { customRender: 'action' }, fixed: 'right' }
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
				num += el.transferQuantity || 0;
			});
			return num;
		}
	},
	data() {
		return {
			columns,
			previewImg: ''
		};
	},
	methods: {
		goTransfer(item) {
			item.transferQuantity = item.quantity;
			console.log(item);
			this.$forceUpdate();
		},
		goAllTransfer() {
			this.list.forEach(el => {
				el.transferQuantity = el.quantity;
			});
			this.$forceUpdate();
		},
		save() {
			let flag = this.list.every(
				el => el.transferQuantity === undefined || el.transferQuantity === null || el.transferQuantity === ''
			);
			if (flag) {
				this.$message.error('转让数量不能全部为0');
				return;
			}
			flag = this.list.every(el => el.transferQuantity === 0);

			if (flag) {
				this.$message.error('转让数量不能全部为0');
				return;
			}
			const arr = this.list.map(el => {
				return {
					id: el.id,
					warehouseReceiptNo: el.warehouseReceiptNo,
					transferQuantity: el.transferQuantity || 0
				};
			});

			return arr;
		},
		// 返回的时候用
		save2() {
			let flag = this.list.every(
				el => el.transferQuantity === undefined || el.transferQuantity === null || el.transferQuantity === ''
			);
			if (flag) {
				return;
			}
			flag = this.list.every(el => el.transferQuantity === 0);

			if (flag) {
				return;
			}
			const arr = this.list.map(el => {
				return {
					id: el.id,
					warehouseReceiptNo: el.warehouseReceiptNo,
					transferQuantity: el.transferQuantity || 0
				};
			});

			return arr;
		},
		pdfView(item) {
			let url = item.warehouseReceiptFilePath || item.path;
			if (!url) {
				return;
			}
			this.previewImg = url;
			window.open(this.previewImg, '_blank');
		}
	},
	components: {}
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
