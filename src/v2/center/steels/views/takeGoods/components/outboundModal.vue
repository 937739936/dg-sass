<template>
	<a-modal
		v-model="visible"
		width="900px"
		@ok="visible = false"
		okText="确定"
		title="三方仓储出库记录"
	>
		<a-table
			:scroll="{ x: true }"
			:dataSource="list"
			rowKey="id"
			:columns="columns"
			:pagination="false"
			:locale="{ emptyText: '暂无数据' }"
		>
		</a-table>
	</a-modal>
</template>

<script>
export default {
	data() {
		return {
			list: [],
			visible: false,
			columns: [
				{
					title: '出库单号',
					dataIndex: 'notifyNo'
				},
				{
					title: '车号',
					dataIndex: 'licensePlate'
				},
				{
					title: '运单号',
					dataIndex: 'transportNo'
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
					title: '厂家',
					dataIndex: 'placeOfOrigin'
				},
				{
					title: '捆包号',
					dataIndex: 'baleNo'
				},
				{
					title: '出库件数（件）',
					dataIndex: 'currentPieceQuantity'
				},
				{
					title: '出库重量（吨）',
					dataIndex: 'currentQuantity',
					fixed: 'right'
				}
			]
		};
	},
	methods: {
		init(list) {
			this.list = list;
			this.visible = true;
		}
	},
	components: {}
};
</script>

<style scoped></style>
