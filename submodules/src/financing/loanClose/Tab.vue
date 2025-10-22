<template>
	<a-tabs
		v-model="status"
		@change="tabChange"
	>
		<a-tab-pane
			v-for="item in list"
			:key="item.value"
		>
			<span slot="tab">
				{{ item.label }}
				<template v-if="tabNum && (item.isShowNum === undefined || item.isShowNum)">
					<span
						style="color: var(--primary-color)"
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
	name: 'SlTab',
	data() {
		return {
			status: 'TAB_ALL',
			newList: []
		};
	},
	props: ['list', 'tabNum', 'currentStatus'],
	mounted() {
		const item = this.list[0] || {};
		this.status = this.currentStatus || item.value;
		// 解决tabs条切换抖动问题，故封装成组件
	},
	watch: {
		currentStatus() {
			this.status = this.currentStatus;
		},
		tabNum: function(data) {},
	},
	methods: {
		tabChange(key) {
			this.$emit('change', key);
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
