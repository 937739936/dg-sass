<template>
	<div class="new-detail">
		<DetailInfo :materialInfo="materialInfo"></DetailInfo>
	</div>
</template>

<script>
import { getBondLetterDetail } from '@/v2/center/steels/api/additionalMargin.js';
import DetailInfo from '@sub/components/steels/DetailInfo.vue';
export default {
	data() {
		return {
			materialInfo: {
				contract: {},
				marketPrice: [],
				bondCalcInfo: {}
			}
		};
	},
	mounted() {
		this.getBondLetterDetail();
	},
	methods: {
		// 获取详情
		async getBondLetterDetail() {
			const params = {
				id: this.$route.query.id
			};
			const res = await getBondLetterDetail(params);
			this.materialInfo = res.data;
		}
	},
	components: {
		DetailInfo
	}
};
</script>

<style scoped lang="less">
/deep/ .ant-form-item-label {
	margin-right: 10px;
}
.btn {
	width: 126px;
	height: 44px;
	background: #ffffff;
	border-radius: 6px;
	border: 1px solid @primary-color;
	color: @primary-color;
}
</style>
