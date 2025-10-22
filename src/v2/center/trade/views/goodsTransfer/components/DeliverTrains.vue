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
		<span
			slot="Amount"
			slot-scope="text"
		>
			{{ text | formatMoney(2) }}</span
		>
	</a-table>
</template>

<script>
import { deliverTrainColumns } from '../columns/columns.js';
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
			columns: deliverTrainColumns,
			key: 'batchNo', //表单唯一值，select选中值
			selectedRows: [] //选中
		};
	},
	computed: {
		rowSelection() {
			let that = this;
			return {
				columnWidth: 29,
				getCheckboxProps: rescord => {
					return {
						props: {
							disabled: !rescord.canSelect
						}
					};
				},
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
					ref: 'deliverTrains'
				});
			}
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
.new-table {
	margin: 20px 0;
}
</style>
