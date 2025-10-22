<template>
	<div>
		<a-tooltip
			placement="bottomRight"
			trigger="hover"
			overlayClassName="add-contract-tooltips"
			:getPopupContainer="getPopupContainer"
		>
			<template
				slot="title"
				v-if="tooltipActionList.length > 1"
			>
				<div class="btn-box-menu">
					<div
						v-for="(item, index) in tooltipActionList"
						:key="item.key + index"
						class="btn-box-menu-item"
						@click="clickTooltipButton(item)"
						@mouseover="mouseOver($event)"
						@mouseleave="mouseLeave($event)"
					>
						<img
							class="icon-left"
							:src="item.icon"
							alt=""
						/>
						<div class="btn-box-menu-item-content">
							<p class="btn-box-menu-item-title">{{ item.name }}</p>
							<p class="btn-box-menu-item-tips">{{ item.tips }}</p>
						</div>
						<img
							class="icon-right"
							src="@/v2/assets/imgs/contract/right_arrow_icon.png"
							alt=""
						/>
					</div>
				</div>
			</template>
			<div @click="clickDisplayButton()">
				<slot />
			</div>
		</a-tooltip>
	</div>
</template>

<script>
import { getPopupContainer } from '@/v2/utils/factory.js';
export default {
	name: 'ActionTooltipButton',
	props: {
		tooltipActionList: {
			type: Array,
			default: () => []
		}
	},
	data() {
		return {
			getPopupContainer
		};
	},
	methods: {
		mouseOver($event) {
			$event.currentTarget.className = 'btn-box-menu-item hover';
		},
		mouseLeave($event) {
			$event.currentTarget.className = 'btn-box-menu-item';
		},
		clickDisplayButton() {
			if (this.tooltipActionList.length == 1) {
				this.clickTooltipButton(this.tooltipActionList[0]);
			}
		},
		clickTooltipButton(action) {
			this.$emit('clickTooltipButton', action);
		}
	}
};
</script>

<style lang="less">
.add-contract-tooltips {
	z-index: 100;
	.ant-tooltip-arrow {
		display: none;
	}
	.ant-tooltip-inner {
		width: 270px;
		// height: 161px;
		border-radius: 4px;
		background-color: #fff;
		box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.13);
		padding: 8px;
		position: relative;
		right: 22px;
		z-index: 1000;
	}
}
</style>
<style lang="less" scoped>
.btn-box-menu {
	.btn-box-menu-item {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		cursor: pointer;
		min-height: 64px;
		// margin-bottom: 8px;
		padding: 0 3px 0 12px;
		border-radius: 4px;
		width: 254px;
		.icon-left {
			width: 40px;
			height: 40px;
		}
		.icon-right {
			width: 14px;
			height: 14px;
			vertical-align: middle;
		}
		.btn-box-menu-item-content {
			flex: 1;
			margin: 0 20px;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: flex-start;
			.btn-box-menu-item-title {
				font-size: 16px;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: rgba(0, 0, 0, 0.8);
				line-height: 22px;
			}
			.btn-box-menu-item-tips {
				font-size: 14px;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #77889d;
				line-height: 20px;
			}
		}
	}
	.btn-box-menu-item.hover {
		background: #e4ebf4;
	}
	.btn-box-menu-item:not(:nth-last-of-type(1)) {
		position: relative;
		margin-bottom: 16px;
		& > ::after {
			content: '';
			width: 250px;
			height: 1px;
			background: #e5e6eb;
			position: absolute;
			left: 12px;
			bottom: -8px;
		}
	}
}
</style>