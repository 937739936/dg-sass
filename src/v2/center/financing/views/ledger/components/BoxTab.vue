<template>
	<div class="box-tab-content">
		<a-space size="8px">
			<div
				:class="activeKey === item.key ? 'tab-item-active' : 'tab-item'"
				v-for="item in tabList"
				:key="item.key"
				@click="handleTabItemClick(item.key)"
			>
				<span>{{ item.label }}</span>
			</div>
		</a-space>
	</div>
</template>

<script>
export default {
	name: 'BoxTab',
	props: {
		initKey: {
			type: String
		},
		tabList: {
			type: Array
		},
		onTabChange: {
			type: Function
		}
	},
	data() {
		let activeKey;
		if (this.tabList && this.tabList.length > 0) {
			activeKey = this.tabList[0].key;
		}
		if (this.initKey) {
			activeKey = this.initKey;
		}
		return {
			activeKey: activeKey
		};
	},
	methods: {
		handleTabItemClick(key) {
			this.activeKey = key;
			if (this.onTabChange) {
				this.onTabChange(key);
			}
			this.$emit('onTabChange', key);
		}
	}
};
</script>

<style lang="less" scoped>
.box-tab-content {
	box-sizing: border-box;
	border-radius: 4px;
	padding: 4px 8px;
	border: 1px solid #e5e6eb;
	display: inline-flex;
	flex-direction: row;
	align-items: center;
	.tab-item-active {
		line-height: 24px;
		min-width: 180px;
		min-height: 24px;
		border-radius: 2px;
		background-color: @primary-color;
		color: #fff;
		font-size: 14px;
		text-align: center;
		cursor: pointer;
	}
	.tab-item {
		line-height: 24px;
		min-width: 180px;
		min-height: 24px;
		border-radius: 2px;
		background-color: #fff;
		color: #000000cc;
		font-size: 14px;
		text-align: center;
		cursor: pointer;
	}
}
</style>