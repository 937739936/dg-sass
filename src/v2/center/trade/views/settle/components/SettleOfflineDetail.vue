<template>
	<div>
		<a-descriptions
			bordered
			style="padding: 0"
		>
			<a-descriptions-item label="结算金额"> {{ statementInfo.settleAmount }}元 </a-descriptions-item>
			<a-descriptions-item label="结算数量"> {{ statementInfo.settleQuantity }}吨 </a-descriptions-item>
			<a-descriptions-item label="结算单价"> {{ statementInfo.settleUnitPrice }}元/吨 </a-descriptions-item>
			<a-descriptions-item label="结算日期">
				{{ statementInfo.statementTime }}
			</a-descriptions-item>
			<a-descriptions-item label="供货周期">
				{{ statementInfo.supplyDateStart }}~{{ statementInfo.supplyDateEnd }}
			</a-descriptions-item>
			<a-descriptions-item label="签章状态">
				{{ statementInfo.signStatusDesc }}
			</a-descriptions-item>
			<a-descriptions-item
				label="备注"
				:span="2"
			>
				{{ statementInfo.remark }}
			</a-descriptions-item>
		</a-descriptions>
	</div>
</template>

<script>
export default {
	props: {
		statementInfo: {
			type: Object,
			default: () => {
				return {};
			}
		}
	},
	data() {
		return {};
	},
	watch: {},
	filters: {},
	mounted() {},
	methods: {}
};
</script>
<style lang="less" scoped>
/deep/ .ant-descriptions-bordered .ant-descriptions-item-label {
	background-color: #f3f5f6;
	color: #77889d;
}
/deep/ .ant-descriptions-item-content {
	color: rgba(0, 0, 0, 0.8);
}
</style>
