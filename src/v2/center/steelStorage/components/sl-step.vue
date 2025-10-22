<template>
	<div class="step-box">
		<div
			class="step-item"
			v-for="(item, i) in list"
			:key="i"
			:class="{ active: currentStep >= i }"
		>
			<div class="circle">{{ i + 1 }}</div>
			<span class="tip">{{ item }}</span>
			<div
				class="line"
				:class="{ active: currentStep > i }"
				v-if="i + 1 < list.length"
			></div>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		list: {
			default: () => []
		},
		currentStep: {
			default: 0
		}
	},
	data() {
		return {};
	},
	methods: {},
	components: {}
};
</script>

<style scoped lang="less">
.step-box {
	display: flex;
	align-items: center;
	justify-content: center;
	.step-item {
		display: flex;
		align-items: center;
		.circle {
			width: 32px;
			height: 32px;
			background: #c3c3c3;
			display: flex;
			align-items: center;
			justify-content: center;
			color: #fff;
			font-size: 16px;
			border-radius: 50%;
		}
		.tip {
			color: rgba(0, 0, 0, 0.4);

			font-size: 14px;
			font-weight: 600;
			margin-right: 32px;
			margin-left: 12px;
			display: inline-block;
		}
		.line {
			height: 2px;
			width: 105px;
			background: #c3c3c3;
			margin-right: 16px;
		}
	}
	.step-item.active {
		.circle {
			background: @primary-color;
		}
		.tip {
			color: rgba(0, 0, 0, 0.8);
		}
	}
	.line.active {
		background: @primary-color;
	}
}
</style>
