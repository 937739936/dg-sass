<template>
	<div>
		<template v-if="checkMenuShow('invoice', { receivalVO, invoiceInfo })">
			<!--钢材-->
			<SteelInvoice
				v-bind="$props"
				v-if="receivalVO && receivalVO.industryType == 'STEEL'"
				ref="SteelInvoice"
			/>

			<!--煤炭-->
			<CoalInvoice
				v-bind="$props"
				v-if="receivalVO && receivalVO.industryType == 'COAL'"
				ref="CoalInvoice"
			/>
		</template>
	</div>
</template>
<script>
import SteelInvoice from './steel/Invoice.vue';
import CoalInvoice from './coal/Invoice.vue';
import LeftTabs, { checkMenuShow } from '@/v2/center/assets/components/common/LeftTabs.vue';
export default {
	name: 'Invoice',
	data() {
		return {
			checkMenuShow
		};
	},
	props: ['invoiceInfo', 'editFlag', 'lineId', 'isAdvance', 'receivalVO'],
	components: {
		SteelInvoice,
		CoalInvoice
	},
	methods: {
		onSubmit() {
			// 整体提交
			if (this.$refs.SteelInvoice) return this.$refs.SteelInvoice.onSubmit();
			if (this.$refs.CoalInvoice) return this.$refs.CoalInvoice.onSubmit();
		}
	}
};
</script>
