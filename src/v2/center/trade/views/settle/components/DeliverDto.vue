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
			slot="batchNo"
			slot-scope="text, record"
			@click="handleView(record)"
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
import { deliverDtoColumns } from '../columns/columns.js';
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
		let { meta } = this.$route;
		return {
			meta,
			columns: deliverDtoColumns,
			key: 'id', //表单唯一值，select选中值
			selectedRows: [] //选中
		};
	},
	computed: {
		type() {
			//判断采购还是销售
			let { meta } = this;
			return meta?.type || '';
		},
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
					key: 'deliveryIdList'
				});
			}
		},
		//打开发货详情页
		handleView(i) {
			//采购结算单跳收货详情，销售跳采购详情
			let type = this.type == 'buy' ? 'accept' : 'send';
			const { href } = this.$router.resolve({
				path: `/center/receive/${type}/detail`,
				query: {
					deliverId: i.id
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
	line-height: 12px;
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
