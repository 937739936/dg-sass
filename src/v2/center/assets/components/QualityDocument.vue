<template>
	<div>
		<template v-if="checkMenuShow('qualityDocument', { receivalVO, recvInfo })">
			<!--钢材-->
			<SteelQualityDocument
				v-bind="$props"
				v-if="receivalVO && receivalVO.industryType == 'STEEL'"
				ref="SteelQualityDocument"
			/>

			<!--煤炭-->
			<CoalQualityDocument
				v-bind="$props"
				v-if="receivalVO && receivalVO.industryType == 'COAL'"
				ref="CoalQualityDocument"
			/>
		</template>
	</div>
</template>
<script>
import SteelQualityDocument from './steel/QualityDocument.vue';
import CoalQualityDocument from './coal/QualityDocument.vue';
import { checkMenuShow } from '@/v2/center/assets/components/common/LeftTabs.vue';
export default {
	name: 'QualityDocument',
	data() {
		return {
			checkMenuShow
		};
	},
	props: ['editFlag', 'recvInfo', 'contractInfo', 'noFileName', 'receivalVO', 'isChange'],
	components: {
		SteelQualityDocument,
		CoalQualityDocument
	},
	methods: {
		onSubmit() {
			// 整体提交
			if (this.$refs.SteelQualityDocument) return this.$refs.SteelQualityDocument.onSubmit();
			if (this.$refs.CoalQualityDocument) return this.$refs.CoalQualityDocument.onSubmit();
		}
	}
};
</script>
