<template>
	<!-- coreCompanyType==6表示该企业为港口方企业 -->
	<div class="center-storage-home">
		<!-- 华能曹妃甸-start -->
		<Admission
			v-if="VUEX_ST_COMPANYSUER.companyType !== 'CORE_COMPANY' && VUEX_ST_COMPANYSUER.companyUscc === '91130230589656634K'"
		/>
		<!-- 华能曹妃甸-end -->

		<!-- 泰州港-start -->
		<AdmissionAndExit
			v-if="VUEX_ST_COMPANYSUER.companyType !== 'CORE_COMPANY' && VUEX_ST_COMPANYSUER.companyUscc === '913212006087920267'"
		/>
		<!-- 泰州港-end -->

		<!-- 核心企业-start -->
		<MyStorage v-if="VUEX_ST_COMPANYSUER.companyType === 'CORE_COMPANY'" />
		<!-- 核心企业-end -->
	</div>
</template>
<script>
import Admission from './Admission';
import AdmissionAndExit from './AdmissionAndExit';
import MyStorage from './MyStorage';
import { mapGetters } from 'vuex';
export default {
	name: 'CenterStorageHome',
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		})
	},
	components: {
		Admission,
		AdmissionAndExit,
		MyStorage
	}
};
</script>
<style lang="less" scoped>
.center-storage-home {
	margin: 20px 0px;
}
</style>
