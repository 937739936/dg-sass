<!-- 提示信息过长时，显示 tooltip 
	作者：datalink
	日期：2024-05-16
	版本：v1.0.0
	更新日志：
		- 2024-05-16 v1.0.0 完成基本功能	
	使用方法：
	1. 在需要显示提示信息的地方，使用 TextOverflowTooltip 组件包裹需要显示的文本
	2. 设置 tipText 属性为需要显示的提示信息
	3. 样式可根据需要自行修改
	示例：
		<template>
			<div>
				<TextOverflowTooltip
					tipText="这是一个很长的提示信息，可能会导致页面卡顿，因此建议只在必要时使用"
				>
					<span> 这是一个很长的文本，可能会导致页面卡顿，因此建议只在必要时使用 </span>
				</TextOverflowTooltip>
			</div>
		</template>
-->

<template>
	<a-tooltip placement="topLeft">
		<template
			v-if="isShowTip"
			slot="title"
		>
			<span> {{ tipString }} </span>
		</template>
		<div
			ref="textContainer"
			class="textContainer"
		>
			<slot>{{ tipString }}</slot>
		</div>
	</a-tooltip>
</template>

<script>
export default {
	name: 'TextOverflowTooltip',
	props: {
		tipText: {
			type: [String, Number]
		},
		isNotShowOverflowTooltip: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			tooltipVisible: false
		};
	},
	computed: {
		// 显示 tooltip 的文字
		tipString() {
			if (!this.tipText) {
				return '';
			}
			return this.tipText.toString();
		},
		// 是否显示 tooltip
		isShowTip() {
			if (this.isNotShowOverflowTooltip === true) {
				return false;
			}
			let show = this.tooltipVisible && this.tipString.length > 0;
			return show;
		}
	},
	mounted() {
		this.checkTextOverflow();
	},
	watch: {
		tipText: {
			handler() {
				this.checkTextOverflow();
			}
		}
	},
	methods: {
		checkTextOverflow() {
			// 使用 $nextTick 确保 DOM 更新完成
			this.$nextTick(() => {
				const textContainer = this.$refs.textContainer;
				if (textContainer) {
					// 检查 scrollWidth 是否大于 offsetWidth
					this.tooltipVisible = textContainer.scrollWidth > textContainer.offsetWidth;
				}
			});
		}
	}
};
</script>

<style lang="less" scoped>
.textContainer {
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
}
</style>