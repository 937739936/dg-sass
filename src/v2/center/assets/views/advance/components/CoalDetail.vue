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
				<span>预付账款详情</span>
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
					></BaseInfo>
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
import Breadcrumb from '@/v2/components/breadcrumb/index';
import DetailTitleInfo from './detail/DetailTitleInfo.vue';
import BaseInfo from './detail/BaseInfo.vue';
import AssetsOperation from '@/v2/center/assets/components/common/AssetsOperation.vue';

export default {
	data() {
		return {
			activeIndex: this.$route.query.activeIndex
		};
	},
	props: {
		defaultIndex: {
			type: [Number, String],
			default: () => {
				return 0;
			}
		},
		detailData: {
			type: Object,
			default: () => {
				return {};
			}
		}
	},
	watch: {
		defaultIndex(data) {
			this.activeIndex = data;
		}
	},

	components: {
		Breadcrumb,
		DetailTitleInfo,
		BaseInfo,
		AssetsOperation
	},
	computed: {},
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
	padding: 20px 16px 24px 16px;
	border-radius: 8px;
	background: #fff;
	margin: 14px 0 0 0;
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
