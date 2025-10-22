<template>
	<CoalDetail
		v-if="industryType === 'COAL'"
		:defaultIndex="activeIndex || 0"
		:detailData="detailData"
	/>
	<SteelDetail
		v-else-if="industryType === 'STEEL'"
		:defaultIndex="activeIndex || 0"
		:detailData="detailData"
	/>
	<div v-else></div>
</template>
<script>
import { API_GetAccountsDetail } from '@/v2/center/assets/api/index.js';
import CoalDetail from './components/CoalDetail.vue';
import SteelDetail from './components/SteelDetail.vue';

export default {
	data() {
		return {
			activeIndex: this.$route.query.activeIndex,
			detailData: undefined, // 详情数据
			industryType: ''
		};
	},
	components: { CoalDetail, SteelDetail },
	computed: {
		// industryType() {
		// 	let industryType = this.detailData?.receivalVO?.industryType;
		// 	return industryType;
		// }
	},
	mounted: function () {
		API_GetAccountsDetail({ id: this.$route.query.id }).then(res => {
			if (res.success) {
				this.detailData = res.data;
				this.industryType = this.detailData?.receivalVO?.industryType;
			}
		});
	}
};
</script>
