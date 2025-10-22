<template>
	<div>
		<!--钢材-->
		<SteelAccountsTable
			v-bind="$props"
			v-if="receivalVO && receivalVO.industryType == 'STEEL'"
			ref="SteelAccountsTable"
		/>

		<!--煤炭-->
		<CoalAccountsTable
			v-bind="$props"
			v-if="receivalVO && receivalVO.industryType == 'COAL'"
			ref="CoalAccountsTable"
		/>
	</div>
</template>
<script>
import CoalAccountsTable from './coal/AccountsTable.vue';
import SteelAccountsTable from './steel/AccountsTable.vue';
export default {
	name: 'AccountsTable',
	props: ['editFlag', 'accountInfo', 'noFileName', 'receivalVO'],
	components: {
		SteelAccountsTable,
		CoalAccountsTable
	},
	methods: {
		onSubmit() {
			// 整体提交

			if (this.$refs.CoalAccountsTable) return this.$refs.CoalAccountsTable.onSubmit();
			if (this.$refs.SteelAccountsTable) return this.$refs.SteelAccountsTable.onSubmit();
		}
	}
};
</script>
