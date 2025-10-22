<template>
	<div>
		<template v-if="checkMenuShow('goodsTransferDocument', { receivalVO, goodTransferInfo })">
			<!--钢材-->
			<SteelGoodsTransferDocument
				v-bind="$props"
				v-if="receivalVO && receivalVO.industryType == 'STEEL'"
				ref="SteelGoodsTransferDocument"
			/>

			<!--煤炭-->
			<CoalGoodsTransferDocument
				v-bind="$props"
				v-if="receivalVO && receivalVO.industryType == 'COAL'"
				ref="CoalGoodsTransferDocument"
			/>
		</template>
	</div>
</template>
<script>
import SteelGoodsTransferDocument from './steel/GoodsTransferDocument.vue';
import CoalGoodsTransferDocument from './coal/GoodsTransferDocument.vue';
import { checkMenuShow } from '@/v2/center/assets/components/common/LeftTabs2.vue';
export default {
	name: 'GoodsTransferDocument',
	data() {
		return {
			checkMenuShow
		};
	},
	props: ['goodTransferInfo', 'contractInfo', 'deliverInfo', 'editFlag', 'noFileName', 'receivalVO'],
	components: {
		SteelGoodsTransferDocument,
		CoalGoodsTransferDocument
	},
	methods: {
		onSubmit() {
			// 整体提交
			if (this.$refs.SteelGoodsTransferDocument) return this.$refs.SteelGoodsTransferDocument.onSubmit();
			if (this.$refs.CoalGoodsTransferDocument) return this.$refs.CoalGoodsTransferDocument.onSubmit();
		}
	}
};
</script>
