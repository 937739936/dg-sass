<template>
	<div style="width: 100%">
		<a-tabs>
			<a-tab-pane
				key="核心企业额度"
				tab="核心企业额度"
			>
				<CoreCompanyLimit />
			</a-tab-pane>
			<a-tab-pane
				key="融资企业额度明细"
				tab="融资企业额度明细"
			>
				<FinancingCompanyLimit />
			</a-tab-pane>
		</a-tabs>
	</div>
</template>

<script>
import CoreCompanyLimit from './CoreCompany';
import FinancingCompanyLimit from './FinancingCompany.vue';
export default {
	name: 'Financial',
	components: {
		CoreCompanyLimit,
		FinancingCompanyLimit
	}
};
</script>

<style lang="less" scoped></style>
