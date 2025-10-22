<template>
	<a-row>
		<a-col :span="24">
			<div class="result-title">查验结果:</div>
		</a-col>
		<a-col :span="24">
			<div
				v-for="(indicator, index) in indicatorList"
				:key="indicator.description"
			>
				<div
					v-if="indicator.normal"
					class="indicator-item-line"
				>
					<div style="flex: 1">{{ indicator.description }}</div>
					<img
						class="indicator-result-icon"
						src="@/v2/assets/imgs/logisticsPlatform/indicator_normal.png"
						alt=""
					/>
					<div class="indicator-result-value">{{ indicator.value }}</div>
				</div>
				<div
					v-else
					class="indicator-abnormal-item"
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
							:videoList="indicator.exceptionVideoList"
						/>
					</div>
				</div>
			</div>
		</a-col>
	</a-row>
</template>

<script>
import InspectMediaListView from './InspectMediaListView.vue';

export default {
	name: 'InspectGoodsResultView',
	components: {
		InspectMediaListView
	},
	props: {
		goodsIndicatorList: Array
	},
	data() {
		return {
			indicatorList: []
		};
	},
	computed: {},
	mounted() {
		this.configIndicatorList();
	},
	methods: {
		configIndicatorList() {
			let list = this.goodsIndicatorList ?? [];
			list.map(item => {
				if (item.normal == false) {
					item.expanded = false;
				}
			});
			this.indicatorList = list;
		},
		// 点击指令展开关闭
		onExpand(item, index) {
			let newItem = item;
			newItem.expanded = !item.expanded;
			this.$set(this.indicatorList, index, newItem);
		}
	}
};
</script>

<style lang="less" scoped>
.result-title {
	margin-bottom: 10px;
	color: #000000cc;
	font-size: 14px;
}
.indicator-item {
	display: flex;
	flex-direction: row;
	padding: 10px 0;
	font-size: 14px;
	color: #00000066;
	align-items: center;
	flex: 1;
}
.indicator-item-line {
	display: flex;
	flex-direction: row;
	padding: 10px 0;
	font-size: 14px;
	color: #00000066;
	align-items: center;
	border-bottom: 1px solid #e5e6eb;
	flex: 1;
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

.indicator-abnormal-item {
	font-size: 14px;
	color: #00000066;
	border-bottom: 1px solid #e5e6eb;
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
		margin-bottom: 20px;
	}
	.abnormal-content {
		.abnormal-content-title {
			font-size: 14px;
			color: #00000066;
			margin-bottom: 10px;
			margin-top: 10px;
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
}
</style>