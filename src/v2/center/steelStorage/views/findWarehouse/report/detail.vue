<template>
	<div>
		<CommonDetail
			:info="info"
			:ENV="ENV"
			type="rest"
		></CommonDetail>
	</div>
</template>

<script>
import CommonDetail from '@sub/components/steelStorage/CommonDetail.vue';
import { getCheckWarehouseDetail } from '../../../api/findWarehouse.js';
import ENV from '@/v2/config/env';
export default {
	data() {
		return {
			info: {
				noticeUsers: []
			},
			ENV
		};
	},
	mounted() {
		this.getDetail();
	},
	methods: {
		async getDetail() {
			const params = {
				id: this.$route.query.id
			};
			const res = await getCheckWarehouseDetail(params);
			this.info = res.data;
		}
	},
	components: {
		CommonDetail
	}
};
</script>

<style scoped></style>
