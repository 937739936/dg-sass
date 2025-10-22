<template>
	<div>
		<ContractDetail
			:resultDetail="resultDetail"
			:isOa="isOa"
			:type="type"
		></ContractDetail>
		<a-row
			type="flex"
			v-if="!isOa"
		>
			<a-button
				@click="$router.go(-1)"
				style="margin: 50px auto 50px"
				>返回</a-button
			>
		</a-row>
	</div>
</template>

<script>
import ContractDetail from '../components/ContractDetail.vue';
import { API_SteelsContractViewDetail, API_GETLOGINBYMOBILE } from '@/v2/center/steels/api/contract.js';
import { mapMutations, mapGetters } from 'vuex';
import { getPersonalDetail } from '@/v2/utils/factory.js';

export default {
	data() {
		return {
			resultDetail: {
				paymentInfo: null,
				receivable: null,
				steelType: []
			},
			isOa: false
		};
	},
	async mounted() {
		this.isOa = this.$route.name === 'OaSteelsContractBuyDetail';
		const { contractId, companyUserId } = this.$route.query;
		if (this.isOa) {
			const res = await API_GETLOGINBYMOBILE({ contractId, companyUserId });
			this.VUEX_MU_USERTOKEN(res.token);
			getPersonalDetail(this.getOrderDetail);
		} else {
			this.getOrderDetail();
		}
	},
	components: {
		ContractDetail
	},
	computed: {
		...mapGetters('user', {
			VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
		}),
		type() {
			return this.$route.query.flag;
		}
	},
	methods: {
		...mapMutations({
			VUEX_MU_USERTOKEN: 'user/VUEX_MU_USERTOKEN'
		}),
		async getOrderDetail() {
			const res = await API_SteelsContractViewDetail(this.$route.query.contractId);
			this.resultDetail = res.data; // 合同信息

			this.resultDetail.contractPurchaseList.forEach(el => {
				el.test3 = (el.presetUnitPrice / 1.13).toFixed(2);
				el.test4 = el.taxAmount || (el.presetUnitPrice * el.quantity).toFixed(2);
			});

			this.resultDetail.contractPurchaseList.forEach(el => {
				el.materialName = Array.isArray(el.materialName) ? el.materialName.join(',') : el.materialName;
			});
			this.resultDetail.bondLetterSettings = this.resultDetail.bondLetterSettings || {};
			this.resultDetail.receivable = this.resultDetail.receivable ? this.resultDetail.receivable : {};
			this.$forceUpdate();
		}
	}
};
</script>
