<template>
	<div class="slMain">
		<breadcrumb />
		<a-card
			:bordered="false"
			class="content"
		>
			<span
				slot="title"
				class="slTitle"
			>
				查看额度详情
			</span>
			<div v-if="VUEX_ST_COMPANYSUER.companyType === 'FINANCIAL_ORG'">
				<FinancialOrgLimitDetail :detailInfo="data" />
			</div>
			<template v-else>
				<Base :data="data" />
				<Yy
					:data="data"
					v-if="
						(data.creditType == 'CORE_COMPANY_QUOTA' ||
							(VUEX_ST_COMPANYSUER.companyUscc == data.companyUscc && data.creditType == 'FINANCING_COMPANY_QUOTA')) &&
						VUEX_ST_COMPANYSUER.companyType === 'CORE_COMPANY'
					"
				/>
				<Zt :data="data" />
				<Rzqyed
					:data="data"
					v-if="
						VUEX_ST_COMPANYSUER.companyUscc == data.companyUscc &&
						data.creditType == 'FINANCING_COMPANY_QUOTA' &&
						VUEX_ST_COMPANYSUER.companyType === 'CORE_COMPANY'
					"
				/>
				<Edxf
					:data="data"
					v-if="data.creditLineLevel == 1 && data.creditType == 'CORE_COMPANY_QUOTA'"
				/>
			</template>
		</a-card>
	</div>
</template>
<script>
import breadcrumb from '@/v2/components/breadcrumb/index';
import FinancialOrgLimitDetail from './modules/FinancialOrgLimitDetail';
import Base from './components/Base';
import Zt from './components/Zt';
import Yy from './components/Yy';
import Rzqyed from './components/Rzqyed';
import Edxf from './components/Edxf';
import { API_CreditLineDetail } from '@/v2/center/financing/api';
import { mapGetters } from 'vuex';
export default {
	data() {
		return {
			detail: {},
			isOa: false,
			id: this.$route.query.id,
			data: {}
		};
	},
	components: {
		breadcrumb,
		Base,
		Zt,
		Yy,
		Rzqyed,
		Edxf,
		FinancialOrgLimitDetail
	},
	created() {
		this.getDetail();
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		})
	},
	methods: {
		getDetail() {
			API_CreditLineDetail({ id: this.id }).then(res => {
				if (res.success) {
					this.data = res.data;
				}
			});
		}
	}
};
</script>
<style lang="less" scoped>
@import url('~@/v2/style/table-cover.less');
.slMain {
	/deep/ .ant-card-head .ant-card-head-title {
		border-bottom: 1px solid #e5e6eb;
		padding-bottom: 20px;
		margin-bottom: 30px;
	}
}
</style>
