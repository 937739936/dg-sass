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
				{{ item.label || item.text }}
				<template v-if="tabNum">
					(<template>{{ computedTotal(item.value) }}</template
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
			status: ''
		};
	},

	props: ['statusData', 'tabNum', 'initStatus'],
	watch: {
		tabNum: function (data) {}
	},
	mounted() {
		this.status = this.initStatus || this.statusData[0].value || '';
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
<style lang="less" scoped></style>
