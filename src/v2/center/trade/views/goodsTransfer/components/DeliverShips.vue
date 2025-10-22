<template>
	<div>
		<a-table
			:columns="columns"
			class="new-table"
			:rowKey="key"
			:dataSource="dataSource"
			:pagination="false"
			:scroll="{ x: true }"
			:row-selection="disabled ? null : rowSelection"
		>
			<div
				slot="batchNo"
				slot-scope="text, item"
			>
				{{ text }}
				<p
					class="tip"
					v-if="!item.shipEscortAttachValidPass"
				>
					未上传数质量凭证，请返回收发货管理上传
				</p>
			</div>

			<span
				slot="Amount"
				slot-scope="text"
			>
				{{ text | formatMoney(2) }}</span
			>
			<div
				slot="action"
				slot-scope="action, item"
			>
				<a
					href="javascript:void(0)"
					@click="handleViewDetail(item)"
					>查看</a
				>
			</div>
		</a-table>
		<ShipList ref="shipList" />
	</div>
</template>

<script>
import { deliverShipsColumns } from '../columns/columns.js';
import ShipList from '@/v2/center/trade/views/receive/components/ShipList';
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
	components: {
		ShipList
	},
	data() {
		return {
			columns: deliverShipsColumns,
			key: 'batchNo', //表单唯一值，select选中值
			selectedRows: [] //选中
		};
	},
	computed: {
		rowSelection() {
			let that = this;
			return {
				columnWidth: 29,
				getCheckboxProps: item => {
					return {
						props: {
							// 船押附件校验 未通过附件
							disabled: !item.canSelect || !item.shipEscortAttachValidPass
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
		//点击查看弹出所有船舶信息列表
		handleViewDetail(item) {
			this.$refs.shipList.showModal(item.deliverId);
		},
		electNoChange() {
			//不能数据监听，方式外部修改导致重复赋值
			if (this.$listeners.electNoChange) {
				this.$emit('electNoChange', {
					data: this.selectedRows,
					ref: 'deliverShips'
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
.tip {
	font-size: 12px;
	color: red;
}
</style>
