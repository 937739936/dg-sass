<template>
	<PayCollectDetail :pageType="pageType"> </PayCollectDetail>
</template>

<script>
import PayCollectDetail from '../components/PayCollectDetail.vue';
export default {
	components: {
		PayCollectDetail
	},
	data() {
		return {
			pageType: 'COLLECT' // 页面类型：付款'PAY' / 收款'COLLECT' / 收款确认'COLLECT_CONFIRM'
		};
	}
};
</script>

<style lang="less" scoped>
</style>