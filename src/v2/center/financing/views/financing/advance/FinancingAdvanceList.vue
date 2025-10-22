<template>
	<div>
		<FinancingAdvanceList
			:listApi="API_FinancingAdvanceMangList"
			:API_GetFinancingStatusTip="API_GetFinancingStatusTip"
			:getFinancingAdvanceStatistics="getFinancingAdvanceStatistics"
			@export="exportFiles"
			@goApply="goApply"
		></FinancingAdvanceList>
		<FinancingAdvanceApplyDraw
			ref="financingApplyDraw"
			type="list"
		></FinancingAdvanceApplyDraw>
	</div>
</template>

<script>
import FinancingAdvanceList from '@sub/financing/financingAdvanceList.vue';
import {
	API_FinancingAdvanceMangList,
	API_FinancingExportXls,
	API_GetFinancingStatusTip,
	getFinancingAdvanceStatistics
} from '@/v2/center/financing/api/index.js';
import FinancingAdvanceApplyDraw from '@/v2/center/financing/components/FinancingAdvanceApplyDraw.vue';
import comDownload from '@sub/utils/comDownload';
export default {
	data() {
		return {};
	},
	computed: {
		VUEX_ST_COMPANYSUER() {
			if (this.$store.state.user) {
				return this.$store.state.user.VUEX_ST_COMPANYSUER;
			}
			return {};
		}
	},
	methods: {
		API_FinancingAdvanceMangList,
		API_GetFinancingStatusTip,
		getFinancingAdvanceStatistics,
		// 导出
		exportFiles(data) {
			API_FinancingExportXls({ ...data, time2: null }).then(res => {
				comDownload(res, undefined, '应收融资管理.xls');
			});
		},
		goApply() {
			this.$refs.financingApplyDraw.showRelationOrderList();
		}
	},
	components: {
		FinancingAdvanceList,
		FinancingAdvanceApplyDraw
	}
};
</script>

<style scoped lang="less"></style>
