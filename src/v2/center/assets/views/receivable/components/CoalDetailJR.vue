<template>
	<div class="slMain">
		<Breadcrumb />

		<a-card :bordered="false">
			<div
				slot="title"
				class="slTitle"
			>
				<span>查看应收账款</span>
			</div>
			<DetailTitleInfo :detailData="detailData" />
		</a-card>
		<a-card
			:bordered="false"
			style="margin-top: 20px; padding-top: 0px"
		>
			<BaseInfo
				:detailData="detailData"
				:defaultIndex="activeIndex"
			></BaseInfo>
		</a-card>
	</div>
</template>
<script>
import { filterCodeByValueName } from '@sub/utils/globalCode.js';
import Breadcrumb from '@/v2/components/breadcrumb/index';
import DetailTitleInfo from './detailJR/DetailTitleInfo.vue';
import BaseInfo from './detailJR/BaseInfo.vue';
export default {
	props: {
		defaultDetailData: {
			type: Array,
			default: () => {
				return [];
			}
		}
	},
	data() {
		return {
			filterCodeByValueName: filterCodeByValueName,
			activeIndex: this.$route.query.activeIndex,
			detailData: {}, // 详情数据
			currentStatus: {},
			showSTime: false
		};
	},
	watch: {
		defaultDetailData: {
			immediate: true,
			handler() {
				this.getDetail();
			}
		}
	},
	components: {
		DetailTitleInfo,
		BaseInfo,
		Breadcrumb
	},
	mounted: function () {
		this.getDetail();
	},
	methods: {
		getDetail() {
			if (this.defaultDetailData?.length) {
				this.detailData = this.defaultDetailData[0];
				this.$nextTick(() => {
					this.tabChange(this.$route.query.activeIndex);
				});
			}
		},
		tabChange(index) {
			// 下游数据tabs切换
			this.activeIndex = index;
		}
	}
};
</script>
<style lang="less" scoped>
.slTitle {
	margin-bottom: 20px;
}
</style>
