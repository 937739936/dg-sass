<template>
	<div>
		<div v-if="!industryType"></div>
		<CoalDetail
			v-else-if="industryType === 'COAL'"
			:detailData="detailData"
		/>
		<SteelDetail
			v-else
			:detailData="detailData"
		/>
	</div>
</template>
<script>
import { API_GetAccountsDetail } from '@/v2/center/assets/api/index.js';
import CoalDetail from './components/CoalDetail.vue';
import SteelDetail from './components/SteelDetail.vue';
export default {
	data() {
		return {
			detailData: {}, // 详情数据
			industryType: ''
		};
	},
	components: {
		CoalDetail,
		SteelDetail
	},
	mounted: function () {
		// this.tabChange(this.$route.query.activeIndex);
		API_GetAccountsDetail({ id: this.$route.query.id }).then(res => {
			if (res.success) {
				this.detailData = res.data;
				this.industryType = this.detailData.receivalVO.industryType;
			}
		});
	}
};
</script>
