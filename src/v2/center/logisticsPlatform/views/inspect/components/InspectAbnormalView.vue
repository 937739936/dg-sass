<template>
	<div>
		<div
			v-show="isShowTitle"
			class="result-title"
		>
			查验结果：
		</div>
		<div
			v-for="(indicator, index) in abnormalList"
			:key="indicator.description"
			class="indicator-abnormal-item"
			:style="{
				borderBottom: index != abnormalList.length - 1 ? '1px solid #e5e6eb' : 'none'
			}"
		>
			<div class="indicator-title-contain">
				<div
					class="indicator-title-item"
					style="cursor: pointer"
					@click="onExpand(indicator, index)"
				>
					<span>{{ indicator.description }}</span>
					<div :class="indicator.expanded ? 'expand-open' : 'expand-normal'"></div>
				</div>
				<div class="indicator-title-item">
					<img
						class="indicator-result-icon"
						src="@/v2/assets/imgs/logisticsPlatform/indicator_error.png"
						alt=""
					/>
					<div class="indicator-result-value">{{ indicator.value }}</div>
				</div>
			</div>

			<div
				v-show="indicator.expanded"
				class="expanded-view"
				:style="{
					marginBottom: index != abnormalList.length - 1 ? '20px' : '0px'
				}"
			>
				<div
					v-if="indicator.exceptionRemark"
					class="abnormal-content"
				>
					<div class="abnormal-content-title">异常内容:</div>
					<div class="abnormal-content-des">
						{{ indicator.exceptionRemark }}
					</div>
				</div>
				<InspectMediaListView
					title="异常情况视频"
					mediaType="VIDEO"
					titleColor="#00000066"
				/>
			</div>
		</div>
	</div>
</template>

<script>
import InspectMediaListView from './InspectMediaListView.vue';

export default {
	name: 'InspectAbnormalView',
	components: {
		InspectMediaListView
	},
	props: {
		goodsIndicatorList: Array,
		isShowTitle: Boolean
	},
	data() {
		return {
			abnormalList: []
		};
	},
	mounted() {
		this.initAbnormalList();
	},
	methods: {
		// 初始化异常列表添加 是否展开字段
		initAbnormalList() {
			let list = this.goodsIndicatorList ?? [];
			list.map(item => {
				item.expanded = false;
			});
			this.abnormalList = list;
		},
		// 点击指令展开关闭
		onExpand(item, index) {
			let newItem = item;
			newItem.expanded = !item.expanded;
			this.$set(this.abnormalList, index, newItem);
		}
	}
};
</script>

<style lang="less" scoped>
.result-title {
	margin-bottom: 10px;
	color: #000000cc;
	font-size: 14px;
	line-height: 21px;
	height: 21px;
}
.indicator-abnormal-item {
	font-size: 14px;
	color: #00000066;
	border-bottom: 1px solid #e5e6eb;
}
.indicator-title-contain {
	display: flex;
	flex-direction: row;
	padding: 10px 0;
	font-size: 14px;
	color: #dd4444;
	align-items: center;
	flex: 1;

	justify-content: space-between;
}
.indicator-title-item {
	display: flex;
	flex-direction: row;
	align-items: center;
}
.indicator-result-icon {
	width: 16px;
	height: 16px;
	margin-right: 8px;
	display: block;
}
.indicator-result-value {
	min-width: 30px;
	margin-right: 8px;
}
.expand-normal {
	width: 16px;
	height: 16px;
	background-image: url('~@/assets/imgs/table_expand_normal.png');
	background-size: 100%;
	background-position: center;
	background-repeat: no-repeat;
}
.expand-open {
	width: 16px;
	height: 16px;
	background-image: url('~@/assets/imgs/table_expand_open.png');
	background-size: 100%;
	background-position: center;
	background-repeat: no-repeat;
}
.expanded-view {
	// margin-bottom: 20px;
}
.abnormal-content {
	.abnormal-content-title {
		font-size: 14px;
		color: #00000066;
		margin-bottom: 10px;
	}
	.abnormal-content-des {
		padding: 10px;
		margin-bottom: 20px;
		border-radius: 4px;
		background-color: #f3f5f6;
		font-size: 14px;
		color: #dd4444;
	}
}
</style>