<template>
	<div class="center-storage-inventory">
		<div class="title-wrapper">
			<div class="title-text">港口存货量</div>
		</div>
		<!-- coreCompanyType==6表示该企业为港口方企业 -->
		<TZGInventory
			v-if="VUEX_ST_COMPANYSUER.companyType !== 'CORE_COMPANY' && VUEX_ST_COMPANYSUER.companyUscc === '913212006087920267'"
		/>
		<CFDInventory
			v-if="VUEX_ST_COMPANYSUER.companyType !== 'CORE_COMPANY' && VUEX_ST_COMPANYSUER.companyUscc === '91130230589656634K'"
		/>
	</div>
</template>
<script>
import TZGInventory from '../components/TZGInventory';
import CFDInventory from '../components/CFDInventory';
import { mapGetters } from 'vuex';
export default {
	name: 'CenterStorageInventory',
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		})
	},
	components: {
		TZGInventory,
		CFDInventory
	}
};
</script>
<style lang="less" scoped>
.center-storage-inventory {
	padding: 20px 0px;
	.title-wrapper {
		padding-bottom: 20px;
		margin-bottom: 40px;
		border-bottom: 1px solid #d8d8d8;
		.title-text {
			font-size: 18px;
			color: rgba(0, 0, 0, 0.65);
		}
	}
}
</style>
