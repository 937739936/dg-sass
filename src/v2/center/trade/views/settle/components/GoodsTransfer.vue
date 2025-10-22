<template>
	<a-table
		:columns="columns"
		class="new-table"
		:rowKey="key"
		:dataSource="dataSource"
		:pagination="false"
		:scroll="{ x: true }"
		:row-selection="disabled ? null : rowSelection"
	>
		<a
			slot="goodsTransferNo"
			slot-scope="text"
			@click="handleView(text)"
		>
			{{ text }}
		</a>
		<div
			slot="status"
			slot-scope="status, record"
			:class="`delivery-status status-${status}`"
		>
			{{ record.statusDesc }}
		</div>
		<span
			slot="Amount"
			slot-scope="text"
		>
			{{ text | formatMoney }}</span
		>
		<span
			slot="Quantity"
			slot-scope="text"
		>
			{{ text | formatMoney(4) }}</span
		>
	</a-table>
</template>

<script>
import { goodsTransferColumns } from '../columns/columns.js';
export default {
	props: {
		dataSource: {
			type: Array,
			default: () => {
				return [];
			}
		},
		disabled: {
			type: Boolean,
			default: false
		},
		selectIdList: {
			type: Array,
			default: () => {
				return [];
			}
		}
	},
	data() {
		return {
			columns: goodsTransferColumns,
			key: 'id', //表单唯一值，select选中值
			selectedRows: [] //选中
		};
	},
	computed: {
		rowSelection() {
			let that = this;
			return {
				columnWidth: 29,
				selectedRowKeys: that.selectedRows,
				onSelect: (record, selected) => {
					if (selected) {
						that.selectedRows.push(record[that.key]);
					} else {
						that.selectedRows = that.selectedRows.filter(item => {
							return item != record[that.key];
						});
					}
					that.electNoChange();
				},
				onSelectAll: (selected, selectedRows) => {
					that.selectedRows = selectedRows.map(item => {
						return item[that.key];
					});
					that.electNoChange();
				}
			};
		}
	},
	watch: {
		selectIdList(val) {
			this.selectedRows = val;
		}
	},
	filters: {},
	mounted() {
		this.selectedRows = this.selectIdList || [];
	},
	methods: {
		electNoChange() {
			//不能数据监听，方式外部修改导致重复赋值
			if (this.$listeners.electNoChange) {
				this.$emit('electNoChange', {
					data: this.selectedRows,
					key: 'goodsTransferIdList'
				});
			}
		},
		//打开货转详情页
		handleView(goodsTransferNo) {
			const { href } = this.$router.resolve({
				path: '/center/transfer/goodsTransfer/detail',
				query: {
					goodsTransferNo
				}
			});
			window.open(href);
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
.new-table {
	margin: 20px 0 12px;
}
.delivery-status {
	display: inline-block;
	padding: 4px 6px;
	border-radius: 4px;
	font-size: 12px;
	background: #c1d7ff;
	color: #4682f3;
	cursor: pointer;
}
.delivery-status.status-1 {
	background: #c9daff;
	color: #596fa0;
}

.delivery-status.status-2 {
	background: #ffdbc8;
	color: #ff7937;
}

.delivery-status.status-3 {
	background: #f8dde8;
	color: #db81a5;
}

.delivery-status.status-4 {
	background: #c5ecdd;
	color: #3eb384;
}

.delivery-status.status-5 {
	background: #e0e0e0;
	color: #a8a8a8;
}
</style>
