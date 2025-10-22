<template>
	<div class="wrapper">
		<div v-if="!loading">
			<CompanyInfo
				:companyInfo="companyInfo"
				v-if="companyInfo && !companyInfo.auditStatus"
				v-on:update="getCompanyInfo"
			/>
			<CertifiedDes :companyInfo="companyInfo" v-on:refresh="getCompanyInfo" v-else />
		</div>
		<div v-else class="loading-wrap"><a-spin /></div>
	</div>
</template>

<script>
import { mapActions } from 'vuex';
import CompanyInfo from '../../components/Company.vue';
import CertifiedDes from '../../components/CertifiedDes.vue';
import { API_COMPANYDETAIL } from '@/v2/api/account';

export default {
	name: 'MyCompany',

	components: {
		CompanyInfo,
		CertifiedDes
	},
	computed: {},
	data() {
		return {
			companyInfo: {},
			loading: false
		};
	},
	created() {
		this.getCompanyInfo();
	},
	mounted() {
		this.VUEX_USER_TOKEN();
	},
	methods: {
		...mapActions({
			VUEX_USER_TOKEN: 'user/VUEX_USER_TOKEN'
		}),
		getCompanyInfo() {
			this.companyInfo = {};
			this.loading = true;
			API_COMPANYDETAIL()
				.then(res => {
					if (res.success) {
						this.companyInfo = res.data;
					}
				})
				.finally(() => {
					this.loading = false;
				});
		}
	}
};
</script>
<style lang="less" scoped>
.wrapper {
	min-height: 650px;
}
.loading-wrap {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	padding-top: 200px;
	box-sizing: border-box;
}
</style>
