<template>
	<div class="pay-detail-wrapper">
		<a-modal
			v-model="visible"
			:footer="null"
			width="1030px"
		>
			<div
				v-if="visible"
				class="detail-wrapper"
			>
				<GoodsvaluerulemangeMNCTimeDetail :calcData="calcData" />
			</div>
		</a-modal>
	</div>
</template>
<script>
import GoodsvaluerulemangeMNCTimeDetail from './GoodsvaluerulemangeMNCTimeDetail';
export default {
	components: {
		GoodsvaluerulemangeMNCTimeDetail
	},
	data() {
		return {
			visible: false,
			calcData: {}
		};
	},
	methods: {
		// 获取初始化数据
		init(data) {
			this.calcData = data || {};
			this.visible = true;
		}
	}
};
</script>
<style lang="less" scoped>
.table-com-container {
	height: 650px;
	overflow: auto;
}
</style>
