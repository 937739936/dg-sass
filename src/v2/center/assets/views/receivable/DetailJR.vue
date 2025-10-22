<template>
	<div>
		<CoalDetailJR
			v-if="industryType === 'COAL'"
			:defaultDetailData="detailData"
		/>
		<SteelDetailJR
			v-else-if="'STEEL'"
			:defaultDetailData="detailData"
		/>
	</div>
</template>
<script>
import { API_GetAccountsDetailJR } from '@/v2/center/assets/api/index.js';
import CoalDetailJR from './components/CoalDetailJR.vue';
import SteelDetailJR from './components/SteelDetailJR.vue';
export default {
	data() {
		return {
			detailData: [], // 详情数据
			industryType: ''
		};
	},
	components: {
		CoalDetailJR,
		SteelDetailJR
	},
	mounted: function () {
		// this.tabChange(this.$route.query.activeIndex);
		API_GetAccountsDetailJR({ id: this.$route.query.id }).then(res => {
			if (res.success) {
				this.detailData = res.data || [];
				let { industryType, assetType } = res.data[0].receivalVO;
				// 判断资产类型,如果是煤炭，并且不是线下补 用新样式
				if (industryType === 'COAL' && assetType !== 'ACCOUNTS_RECEIVABLE_DOWN_MANUAL') {
					this.industryType = industryType;
				} else {
					this.industryType = 'STEEL';
				}
			}
		});
	}
};
</script>
