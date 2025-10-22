<template>
	<div>
		<a-tabs @change="tabChange">
			<a-tab-pane
				v-for="item in tabPanes"
				:key="item.key"
			>
				<span slot="tab">
					{{ item.tab }}
					<template v-if="item.count">
						<span style="color: var(--primary-color)"> ({{ item.count }}) </span>
					</template>
				</span>
				<slot :name="item.key"></slot>
			</a-tab-pane>
			<template slot="tabBarExtraContent">
				<a-space :size="rightExtraSpaceSize">
					<slot name="countTabsExportLeft"></slot>
					<ExportButton
						v-if="$listeners.exportClick"
						:exporting="exporting"
						@exportClick="exportClick"
					></ExportButton>
					<slot name="countTabsExportRight"></slot>
				</a-space>
			</template>
		</a-tabs>
	</div>
</template>

<script>
import ExportButton from '@/v2/components/common/ExportButton';

export default {
	name: 'CountTabs',
	components: {
		ExportButton
	},
	props: {
		// 接收父组件传递的props
		/**
		 * {
		 * 	key: 指定tab的key值,
		 * 	tab: tab的名称,
		 * 	count: 数量,
		 *  customRender: 自定义渲染函数 | slot-scope="{ item }",
		 * }
		 */
		tabPanes: {
			type: Array,
			default: () => []
		},
		// 是否正在导出
		exporting: {
			type: Boolean,
			default: false
		},
		rightExtraSpaceSize: {
			type: Number,
			default: 10
		}
	},
	methods: {
		tabChange(key) {
			this.$emit('tabChange', key);
		},
		exportClick() {
			this.$emit('exportClick');
		}
	}
};
</script>

<style lang="less" scoped>
</style>