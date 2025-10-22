<template>
	<div>
		<div v-if="isSell">
			<SellCreate></SellCreate>
		</div>
		<div v-if="isBuy">
			<BuyCreate></BuyCreate>
		</div>
	</div>
</template>

<script>
import BuyCreate from '../contract/buy/Create.vue';
import SellCreate from '../contract/sell/Create.vue';
import { mapMutations } from 'vuex';
import { API_SteelsContractDetail, API_GETLOGINBYMOBILE } from '@/v2/center/steels/api/contract.js';
export default {
	data() {
		return {
			isSell: false,
			isBuy: false
		};
	},
	computed: {},
	mounted() {
		const { contractId, companyUserId } = this.$route.query;
		API_GETLOGINBYMOBILE({
			contractId,
			companyUserId
		}).then(res => {
			this.VUEX_MU_USERTOKEN(res.token);
			this.getDetail();
		});
	},
	methods: {
		//
		...mapMutations({
			VUEX_MU_USERTOKEN: 'user/VUEX_MU_USERTOKEN'
		}),
		// 判断销售合同 和 采购合同
		async getDetail() {
			const { contractId } = this.$route.query;
			if (!contractId) return;
			const res = await API_SteelsContractDetail(contractId);
			this.isSell = res.data.buyCompanyUscc != res.data.initiator;
			this.isBuy = res.data.buyCompanyUscc == res.data.initiator;
		}
	},
	components: {
		BuyCreate,
		SellCreate
	}
};
</script>

<style scoped></style>
