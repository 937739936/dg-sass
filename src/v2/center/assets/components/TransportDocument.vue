<template>
	<div>
		<template v-if="checkMenuShow('transportDocument', { receivalVO, deliverInfo })">
			<!--钢材-->
			<SteelTransportDocument
				v-bind="$props"
				v-if="receivalVO && receivalVO.industryType == 'STEEL'"
				ref="SteelTransportDocument"
			/>

			<!--煤炭-->
			<CoalTransportDocument
				v-bind="$props"
				v-if="receivalVO && receivalVO.industryType == 'COAL'"
				ref="CoalTransportDocument"
			/>
		</template>
	</div>
</template>
<script>
import SteelTransportDocument from './steel/TransportDocument.vue';
import CoalTransportDocument from './coal/TransportDocument.vue';
import { checkMenuShow } from '@/v2/center/assets/components/common/LeftTabs.vue';
export default {
	name: 'TransportDocument',
	data() {
		return {
			checkMenuShow
		};
	},
	props: ['editFlag', 'deliverInfo', 'contractInfo', 'noFileName', 'receivalVO'],
	components: {
		SteelTransportDocument,
		CoalTransportDocument
	},
	methods: {
		onSubmit() {
			// 整体提交
			if (this.$refs.SteelTransportDocument) return this.$refs.SteelTransportDocument.onSubmit();
			if (this.$refs.CoalTransportDocument) return this.$refs.CoalTransportDocument.onSubmit();
		}
	}
};
</script>
