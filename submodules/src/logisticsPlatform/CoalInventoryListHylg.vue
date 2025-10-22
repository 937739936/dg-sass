<template>
	<div class="log">
		<div class="title">煤种库存列表</div>
		<a-table
			:columns="columns"
			class="new-table"
			:bordered="false"
			rowKey="id"
			:dataSource="list"
			:pagination="false"
			:scroll="{ x: true }"
		>
		</a-table>
	</div>
</template>

<script>
import { formatMoney } from '@sub/filters';
const columns = [
	{ title: '品名', dataIndex: 'coalTypeProduct' },
  { title: "账面库存（吨）", dataIndex: "totalInventory", customRender: t => formatMoney(t) },
  { title: "累计入库（吨）", dataIndex: "inInventory",customRender: t => formatMoney(t)},
  { title: "累计出库（吨）", dataIndex: "outInventory" , customRender: t => formatMoney(t)},
  { title: "累计掺配产出（吨）", dataIndex: "blendingOutputInventory",customRender: t => formatMoney(t)},
  { title: "累计掺配消耗（吨）", dataIndex: "blendingUseInventory" , customRender: t => formatMoney(t)},
  { title: "累计洗煤产出（吨）", dataIndex: "washOutputInventory",customRender: t => formatMoney(t)},
  { title: "累计洗煤消耗（吨）", dataIndex: "washUseInventory" , customRender: t => formatMoney(t)},
];
export default {
	props: {
		list: {
			default: () => {
				return [];
			}
		},
		columns: {
			default: () => {
				return columns;
			}
		}
	},
	data() {
		return {};
	},
	methods: {},
	components: {}
};
</script>

<style lang="less" scoped>
@import url('../style/table.less');
</style>
<style scoped lang='less'>
.log {
	width: 100%;
	margin-top: 30px;
}
.title {
	padding-left: 16px;
	position: relative;
	font-size: 16px;
	color: rgba(#000, 0.8);
	line-height: 22px;
	margin-bottom: 20px;
	&::before {
		content: '';
		position: absolute;
		top: 50%;
		left: 0;
		width: 4px;
		height: 18px;
		background-color: @primary-color;
		transform: translateY(-50%);
		border-radius: 1px;
	}
}
</style>
