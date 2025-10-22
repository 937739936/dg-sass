<template>
	<AddInvoice
		invoiceType="INPUT"
		industryType="COAL"
		@stopSkip="getTaskFlag"
	></AddInvoice>
</template>

<script>
import { mapMutations } from 'vuex';
import AddInvoice from '@/v2/components/newInvoice/AddInvoice.vue';
import storage from "@sub/utils/storage";
export default {
	name: 'AddBuy',
	data() {
		return {
			name: true,
			isStop: false
		};
	},

	beforeRouteLeave(to, form, next) {
		if (this.isStop) {
			const answer = window.confirm('系统可能不会保存你所做的更改');
			if (answer) {
				next();
			} else {
				this.VUEX_MU_CURRENT_PATH('/center/invoice/buy/list');
				storage.session.set('openKeys', ['进项发票']);
				next(false);
			}
		} else {
			next();
		}
	},
	methods: {
		...mapMutations({
			SET_VUEX_GE_CENTERMENUS: 'user/SET_VUEX_GE_CENTERMENUS',
			VUEX_MU_CURRENT_PATH: 'user/VUEX_MU_CURRENT_PATH'
		}),
		getTaskFlag(flag) {
			this.isStop = flag;
		}
	},
	components: { AddInvoice }
};
</script>
