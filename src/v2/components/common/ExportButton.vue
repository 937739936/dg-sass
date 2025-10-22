<template>
	<div class="export-button">
		<a-button
			type="link"
			:loading="exporting"
			@click="exportClick"
		>
			<ExportIcon v-show="!exporting" class="button-icon"></ExportIcon>
			<span class="button-text">数据导出</span>
		</a-button>
	</div>
</template>

<script>
import { ExportIcon } from '@sub/components/svg'
export default {
	name: 'ExportButton',
	props: {
		// 导出中状态
		exporting: {
			type: Boolean,
			default: false
		}
	},
	components: {
		ExportIcon
	},
	methods: {
		exportClick() {
			this.$emit('exportClick');
		}
	}
};
</script>

<style lang="less" scoped>
.export-button {
	.button-icon {
		width: 14px;
		height: 14px;
		position: relative;
		top: 1px;
	}
	.button-text {
		margin-left: 5px;
	}
	/deep/.ant-btn-link {
		padding: 0;
	}
}
</style>