<template>
	<div class="wrap">
		<h3 style="margin: 30px 0">待开具货转清单</h3>
		<a-table
			:columns="columns"
			:data-source="list"
			:pagination="false"
		>
		</a-table>
	</div>
</template>

<script>
const columns = [
	{
		dataIndex: '序号',
		key: 'id'
	},
	{
		title: '品名',
		dataIndex: 'materialName'
	},
	{
		title: '材质',
		dataIndex: 'materialTexture'
	},
	{
		title: '规格',
		key: 'specs'
	},
	{
		title: '产地',
		key: 'placeOfOrigin'
	},
	{
		title: '合同件数',
		key: 'pieceQuantity'
	},
	{
		title: '捆包号',
		key: 'baleNo'
	},
	{
		title: '合同数量(吨)',
		key: 'quantity'
	},
	{
		title: '剩余件数',
		key: 'action1'
	},
	{
		title: '剩余数量(吨)',
		key: 'action2'
	}
];
export default {
	data() {
		return {
			columns,
			list: [
				{
					key: '1'
				}
			]
		};
	}
};
</script>

<style lang="less" scoped>
.wrap {
	width: 100%;
	height: auto;
	margin-top: 20px;
	h3 {
		font-size: 21px;
		color: rgba(0, 0, 0, 0.85);
		font-weight: bold;
	}
	h3::before {
		content: '';
		height: 20px;
		margin-right: 10px;
		display: inline-block;
		vertical-align: middle;
		position: relative;
		top: -1px;
		width: 2px;
		background: @primary-color;
	}
}
</style>
