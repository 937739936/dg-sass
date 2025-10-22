<template>
	<div class="wrap">
		<div class="container">
			<div
				:class="['step-item', activeIndex >= index ? 'step-item-active' : '']"
				v-for="(item, index) in stepList"
				:key="item.id"
			>
				<span class="dot">{{ index + 1 }}</span>
				<span class="step-title">{{ item.title }}</span>
				<span
					class="step-line"
					v-if="index < stepList.length - 1"
				></span>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		activeIndex: {
			type: Number,
			default: 0
		},
		stepList: {
			type: Array,
			default() {
				return [
					{
						id: 1,
						title: '基本信息'
					},
					{
						id: 2,
						title: '系统审核'
					},
					{
						id: 3,
						title: '认证完成'
					}
				];
			}
		}
	},
	data() {
		return {};
	},
	methods: {
		changeActiveIndex() {
			this.activeIndex = ++this.activeIndex;
		}
	}
};
</script>

<style lang="less" scoped>
.wrap {
	width: 100%;
	display: flex;
	flex-direction: row;
	justify-content: center;
	margin-top: 30px;
	.container {
		width: 508px;
		height: 32px;
		display: flex;
		align-items: center;
	}
	.step-item {
		width: 180px;
		height: 32px;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		margin-right: 24px;
	}
	.dot {
		width: 32px;
		height: 32px;
		display: inline-block;
		border-radius: 50%;
		background: rgba(195, 195, 195, 1);
		text-align: center;
		line-height: 32px;
		color: #fff;
		font-size: 16px;
		font-weight: 500;
	}
	.step-title {
		width: 56px;
		display: inline-block;
		color: rgba(0, 0, 0, 0.4);
		font-size: 14px;
		font-weight: 500;
		margin-left: 12px;
		font-family: PingFang SC;
	}
	.step-line {
		width: 64px;
		height: 2px;
		display: inline-block;
		background: rgba(195, 195, 195, 1);
		margin-left: 16px;
	}
	.step-item-active {
		.dot {
			background: @primary-color;
		}
		.step-title {
			color: rgba(0, 0, 0, 0.8);
		}
	}
}
</style>