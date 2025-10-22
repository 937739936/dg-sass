<template>
	<a-col class="overview-item-box">
		<img
			:src="itemInfo.value ? itemInfo.activeIcon : itemInfo.inactiveIcon"
			alt=""
		/>
		<div class="info-box">
			<p class="label">{{ itemInfo.label }}</p>
			<slot v-if="itemInfo.value">
				<p>
					{{ itemInfo.value }}
				</p>
			</slot>
			<p
				v-else
				class="empty-value"
			>
				{{ itemInfo.emptyValue }}
			</p>
		</div>
	</a-col>
</template>

<script>
export default {
	name: 'OverviewItemView',

	props: {
		itemInfo: {
			type: Object,
			default: () => ({})
		}
	}
};
</script>

<style lang="less" scoped>
.overview-item-box {
	flex: 1;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-start;
	position: relative;
	& > img {
		margin-left: 17px;
		width: 70px;
		height: 70px;
	}
	.info-box {
		margin-left: 16px;
		font-size: 14px;
		font-weight: 500;
		color: #000000cc;
		line-height: 20px;
		font-family: PingFang SC;
		.label {
			font-size: 16px;
			color: #00000040;
			line-height: 22px;
			margin-bottom: 10px;
			// margin: 5px 0 10px 0;
		}
		.empty-value {
			font-size: 14px;
			color: #00000040;
		}
	}
	&::after {
		content: '';
		width: 1px;
		height: 32px;
		background: #e5e6eb;
		right: 0;
		position: absolute;
		// align-self: center;
	}
}
.overview-item-box:last-child {
	&::after {
		display: none;
	}
}
</style>