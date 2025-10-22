<template>
	<div class="custom-main-content-inner">
		<div class="page-title">
			<span>销售合同</span>
		</div>
		<SellContractTable type="seller" />
	</div>
</template>
<script>
import SellContractTable from './components/SellContractTable.vue';
export default {
	components: {
		SellContractTable
	},
	data() {
		return {};
	},
	methods: {}
};
</script>
