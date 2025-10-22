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
				<template v-if="computedTotal(item.value)">
					(<span class="tip">{{ computedTotal(item.value) }}</span
					>)
				</template>
			</span>
		</a-tab-pane>
	</a-tabs>
</template>

<script>
export default {
	data() {
		return {
			status: 'TAB_ALL'
		};
	},

	props: ['statusData', 'tabNum'],
	watch: {
		tabNum: function (data) {}
	},
	mounted() {
		// 解决tabs条切换抖动问题，故封装成组件
	},
	methods: {
		tabChange(key) {
			this.$emit('callback', key);
		},
		computedTotal(type) {
			if (this.tabNum[type]) {
				return this.tabNum[type];
			}
			return 0;
		}
	}
};
</script>
<style lang="less" scoped>
.tip {
	color: @primary-color;
}
</style>
