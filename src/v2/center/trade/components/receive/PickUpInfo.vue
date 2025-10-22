<template>
	<div>
		<div class="title"><i class="title_icon"></i>提货信息</div>
		<div class="table-wrap">
			<a-table
				v-if="disabled"
				:columns="columns"
				:rowKey="record => record.id"
				:dataSource="dataSource"
				:pagination="false"
				:locale="{ emptyText: '暂无数据' }"
			>
			</a-table>
			<a-table
				v-if="!disabled"
				:rowSelection="rowSelection"
				:columns="columns"
				:rowKey="record => record.id"
				:dataSource="dataSource"
				:pagination="false"
				:customRow="onClickRow"
				:locale="{ emptyText: '暂无数据' }"
			>
			</a-table>
		</div>
	</div>
</template>

<script>
export default {
	name: 'PickUpInfo',
	computed: {
		rowSelection() {
			const { selectedRowKeys } = this;
			const t = this;
			return {
				type: 'radio',
				selectedRowKeys: selectedRowKeys,
				onSelect: record => {
					t.selectedRowKeys = [record.id];
					t.pickUpId = record.id;
				}
			};
		}
	},
	props: ['dataSource', 'pickUpSelectedRowKeys', 'disabled'],
	mounted() {
		if (this.$route.query.deliverId) {
			this.selectedRowKeys = [this.pickUpSelectedRowKeys];
			this.pickUpId = this.pickUpSelectedRowKeys;
		}
	},
	data() {
		return {
			columns: [
				{
					title: '提货申请编号',
					dataIndex: 'serialNo'
				},
				{
					title: '意向提货数量(吨)',
					dataIndex: 'planQuantity'
				},
				{
					title: '预计提货日期',
					dataIndex: 'planDate'
				},
				{
					title: '可提货数量(吨)',
					dataIndex: 'availableQuantity'
				},
				{
					title: '提货单价',
					dataIndex: 'unitPrice'
				}
			],
			selectedRowKeys: [],
			pickUpId: ''
		};
	},
	methods: {
		onClickRow(record) {
			return {
				on: {
					click: () => {
						this.selectedRowKeys = [record.id];
						this.pickUpId = record.id;
					}
				}
			};
		}
	}
};
</script>

<style scoped>
.table-wrap {
	margin-bottom: 20px;
}
</style>
