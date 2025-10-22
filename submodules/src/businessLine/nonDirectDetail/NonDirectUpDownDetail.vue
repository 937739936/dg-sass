<template>
	<div class="detail-container">
		<OverviewInfoView :contractInfo="contractInfoNotEmpty" />
		<div class="line"></div>
		<SegmentDetail
			:contractInfo="contractInfoNotEmpty"
			:segmentItems="segmentItems"
			:contentLoading="false"
			@segmentTypeChange="segmentTypeChange"
		>
		</SegmentDetail>
	</div>
</template>

<script>
import OverviewInfoView from './OverviewInfoView.vue';
import SegmentDetail from './SegmentDetail.vue';

export default {
	name: 'NonDirectUpDownDetail',
	components: {
		OverviewInfoView,
		SegmentDetail
	},
	props: {
		contractInfo: {
			type: Object,
			default: () => ({})
		},
		segmentItems: {
			type: Array,
			default: () => []
		},
		initSegmentType: {
			type: String,
			default: 'contract'
		}
	},
	data() {
		return {};
	},
	computed: {
		contractInfoNotEmpty() {
			return this.contractInfo || {};
		}
	},
	methods: {
		segmentTypeChange(type) {
			this.segmentType = type;
		}
	}
};
</script>

<style lang="less" scoped>
.detail-container {
	background: #f3f5f6;
	.line {
		background: #f3f5f6;
		height: 16px;
		// margin-top: -4px;
		// // margin-bottom: -4px;
		// z-index: -1;
	}
}
</style>