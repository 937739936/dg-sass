<template>
	<div>
		<FinancingList
			:listApi="API_FinancingList"
			:syncApi="API_FinancingSync"
			:getFinancingStatistics="getFinancingStatistics"
			:API_GetFinancingStatusTip="API_GetFinancingStatusTip"
			@export="exportFiles"
			@goApply="goApply"
		></FinancingList>
		<FinancingApplyDraw
			ref="financingApplyDraw"
			:isShangHai="isShangHai"
			type="list"
		></FinancingApplyDraw>
	</div>
</template>

<script>
import {
	API_FinancingList,
	API_FinancingExportXls,
	API_FinancingSync,
	API_GetFinancingStatusTip,
	getFinancingStatistics
} from '@/v2/center/financing/api/index.js';
import FinancingApplyDraw from '@/v2/center/financing/components/FinancingApplyDraw.vue';
import comDownload from '@sub/utils/comDownload';
import FinancingList from '@sub/financing/financingList';
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
		},
		isShangHai() {
			return this.VUEX_ST_COMPANYSUER.companyUscc == '913101150935451053';
		}
	},
	methods: {
		API_FinancingList,
		API_FinancingSync,
		API_GetFinancingStatusTip,
		getFinancingStatistics,
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
		FinancingList,
		FinancingApplyDraw
	}
};
</script>

<style scoped lang="less"></style>
