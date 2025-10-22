<template>
	<a-tabs
		v-model="status"
		@change="tabChange"
	>
		<a-tab-pane
			v-for="item in statusData"
			:key="item.status"
		>
			<span slot="tab">
				{{ item.name }}
				<template v-if="item.count">
					<span style="color: var(--primary-color)">
						({{ item.count }})
					</span>
				</template>
			</span>
		</a-tab-pane>
		<template v-if="!!$listeners.export">
			<div
				slot="tabBarExtraContent"
				class="export-box"
				@click="$emit('export')"
			>
				<ExportIcon class="export-icon"></ExportIcon>
				<span class="export-text">数据导出</span>
			</div>
		</template>
	</a-tabs>
</template>

<script>
import { ExportIcon } from '@sub/components/svg'
export default {
	data() {
		return {
			status: ''
		};
	},

	props: ['statusData', 'exportFunc'],
	watch: {
		tabNum: function (data) {}
	},
	mounted() {
		// 解决tabs条切换抖动问题，故封装成组
	},
	methods: {
		tabChange(key) {
			const item = this.statusData.find(el => el.status == key);
			this.$emit('callback', item);
		},
		computedTotal(type) {
			if (this.tabNum[type]) {
				return this.tabNum[type];
			}
			return 0;
		},
		init(key) {
			this.status = key;
		}
	},
	components: {
		ExportIcon
	}
};
</script>
<style lang="less" scoped>
.export-box {
	cursor: pointer;
	.export-icon {
		width: 14px;
		height: 14px;
		margin-right: 5px;
		position: relative;
		top: 1px;
	}
	.export-text {
		font-family:
			PingFangSC-Regular,
			PingFang SC;
		color: @primary-color;
		line-height: 20px;
	}
}
</style>
