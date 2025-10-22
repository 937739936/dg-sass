<template>
	<a-tabs
		v-model="status"
		@change="tabChange"
	>
		<a-tab-pane
			v-for="item in statusData"
			:key="item.value"
		>
			<span slot="tab">
				{{ item.text }}
			</span>
		</a-tab-pane>
	</a-tabs>
</template>

<script>
export default {
	data() {
		return {
			status: ''
		};
	},
	props: ['statusData'],
	mounted() {
		// 解决tabs条切换抖动问题，故封装成组件
	},
	methods: {
		tabChange(key) {
			this.$emit('callback', key);
		}
	}
};
</script>
