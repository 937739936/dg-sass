<template>
	<div class="slMain">
		<Breadcrumb />
		<a-card
			:bordered="false"
			v-if="detailData"
		>
			<div
				slot="title"
				class="slTitle"
			>
				<span>应收账款管理</span>
			</div>
			<DetailTitleInfo :detailData="detailData" />
		</a-card>
		<a-card
			:bordered="false"
			style="margin-top: 20px; padding-top: 6px"
		>
			<a-tabs>
				<a-tab-pane
					key="info"
					tab="详情信息"
				>
					<BaseInfo
						:detailData="detailData"
						:defaultIndex="activeIndex"
					/>
				</a-tab-pane>
				<a-tab-pane
					key="log"
					tab="操作记录"
				>
					<AssetsOperation :assetNo="detailData.receivalVO && detailData.receivalVO.serialNo" />
				</a-tab-pane>
			</a-tabs>
		</a-card>
	</div>
</template>
<script>
import DetailTitleInfo from './detail/DetailTitleInfo.vue';
import BaseInfo from './detail/BaseInfo.vue';
import AssetsOperation from '@/v2/center/assets/components/common/AssetsOperation.vue';
import Breadcrumb from '@/v2/components/breadcrumb/index';

export default {
	props: {
		detailData: {
			type: Object,
			default: () => {
				return {};
			}
		}
	},
	data() {
		return {
			activeIndex: this.$route.query.activeIndex
		};
	},
	components: {
		DetailTitleInfo,
		BaseInfo,
		AssetsOperation,
		Breadcrumb
	},
	mounted: function () {
		this.tabChange(this.$route.query.activeIndex);
	},
	methods: {
		tabChange(index) {
			// 下游数据tabs切换
			this.activeIndex = index;
		}
	}
};
</script>
<style lang="less" scoped>
.s-card-content {
	padding: 20px 0;
	border-radius: 8px;
	background: #fff;
	.row .ant-col {
		margin-bottom: 8px;
		text-overflow: ellipse;
		white-space: nowrap;
		overflow: hidden;
	}
	.ant-row .ant-col {
		margin-bottom: 8px;
	}
}

.slTitle {
	margin-bottom: 20px;
}
</style>
