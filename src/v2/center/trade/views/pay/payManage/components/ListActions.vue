<template>
	<div>
		<a-space>
			<div
				v-for="(action, index) in actions"
				:key="index"
			>
				<a @click="clickAction(action)">{{ action.title }}</a>
			</div>
		</a-space>
	</div>
</template>

<script>
export default {
	name: 'ListActions',
	props: {
		record: {
			type: Object,
			required: true
		},
		actions: {
			type: Array,
			required: true
		},
		maxDisplayCount: {
			type: Number,
			default: 3
		}
	},
	data() {
		return {};
	},
	methods: {
		clickAction() {
			//
		}
	},
	computed: {}
};
</script>

<style lang="less" scoped>
</style>