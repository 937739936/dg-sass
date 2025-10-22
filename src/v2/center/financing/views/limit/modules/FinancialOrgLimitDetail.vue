<template>
	<div>
		<BaseInfo :detailInfo="detailInfo" />
		<DivideCreditLineInfo
			v-if="isCoreCompanyLimit && detailInfo.creditType == 'CORE_COMPANY_QUOTA'"
			:detailInfo="detailInfo"
		/>
		<FinancingCompanyLimit
			v-if="isCoreCompanyLimit && detailInfo.creditType == 'FINANCING_COMPANY_QUOTA'"
			:detailInfo="detailInfo"
		/>
	</div>
</template>

<script>
import BaseInfo from '../components/financialOrg/BaseInfo';
import DivideCreditLineInfo from '../components/financialOrg/DivideCreditLineInfo';
import FinancingCompanyLimit from '../components/financialOrg/FinancingCompanyLimit';
export default {
	name: 'FinancialOrgLimitDetail',
	components: {
		BaseInfo,
		DivideCreditLineInfo,
		FinancingCompanyLimit
	},
	props: {
		detailInfo: Object // 额度详情
	},
	data() {
		return {};
	},
	computed: {
		// 是否是核心企业额度
		isCoreCompanyLimit() {
			// parentId != null  是融资企业额度明细
			return this.detailInfo.parentId == null;
		}
	},
	methods: {
		getDetailInfo() {
			//
		}
	}
};
</script>

<style lang="less" scoped></style>
