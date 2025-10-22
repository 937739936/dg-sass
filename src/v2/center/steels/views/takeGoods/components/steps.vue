<template>
	<a-steps :current="currentStep">
		<a-step
			v-for="(item, index) in stepList"
			:key="index"
			:title="item"
		></a-step>
	</a-steps>
</template>

<script>
export default {
	props: {
		currentStep: {
			type: Number,
			default: 0
		},
		stepList: {
			type: Array,
			default: []
		}
	}
};
</script>

<style></style>
