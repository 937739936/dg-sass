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
				<template v-if="tabNum && ['TAB_WAIT_ISSUE', 'TAB_MY_CONFIRM', 'TAB_MY_SIGN_SEAL'].includes(item.value)">
					<span
						style="color: @primary-color"
						v-if="computedTotal(item.value)"
					>
						(<template>{{ computedTotal(item.value) }}</template
						>)
					</span>
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
<style lang="less" scoped></style>
