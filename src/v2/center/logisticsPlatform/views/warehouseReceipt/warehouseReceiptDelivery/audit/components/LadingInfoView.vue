<template>
	<div>
		<a-spin :spinning="loading">
			<a-descriptions bordered>
				<a-descriptions-item label="提货方">
					{{ detailData.deliveryCompanyName || '-' }}
				</a-descriptions-item>
				<a-descriptions-item label="仓单原持有人">
					{{ detailData.holderCompanyName || '-' }}
				</a-descriptions-item>
				<a-descriptions-item label="仓库名称">
					{{ detailData.place || '-' }}
				</a-descriptions-item>
				<a-descriptions-item label="货物名称">
					{{ detailData.goodsName || '-' }}
				</a-descriptions-item>
				<a-descriptions-item label="提货数量合计"> {{ detailData.quantity | formatMoney(4) }}吨 </a-descriptions-item>
			</a-descriptions>
		</a-spin>
	</div>
</template>

<script>
export default {
	name: 'LadingInfoView',
	components: {},
	props: {
		detailData: {
			type: Object,
			default: () => {
				return {};
			}
		},

		loading: {
			type: Boolean,
			default: () => {
				return false;
			}
		}
	},
	data() {
		return {};
	},
	mounted() {},
	watch: {},
	computed: {},
	methods: {}
};
</script>

<style lang="less" scoped>
::v-deep.ant-descriptions {
	font-weight: 400;
	line-height: 20px;
	padding-top: 0 !important;
	.ant-descriptions-item-label {
		background-color: rgba(243, 245, 246, 1);
		color: #77889d;
		width: 160px;
		height: 48px;
		padding: 0;
		padding-left: 10px;
	}
	.ant-descriptions-item-content {
		color: rgba(0, 0, 0, 0.8);
		padding-left: 12px;
		padding-right: 12px;
		// width: inherit;
		width: 22%;
	}
}
</style>
