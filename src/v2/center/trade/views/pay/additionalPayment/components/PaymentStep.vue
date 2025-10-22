<template>
	<a-steps
		style="padding: 20px"
		:current="currentStep"
	>
		<a-step
			v-for="(item, index) in steps"
			:key="index"
			:title="item"
		/>
	</a-steps>
</template>
<script>
const steps = ['选择付款记录', '填写付款信息', '完成'];
export default {
	name: 'PaymentStep',

	props: {
		currentStep: {
			type: [String, Number],
			default: 0
		}
	},
	data() {
		return {
			steps
		};
	}
};
</script>
