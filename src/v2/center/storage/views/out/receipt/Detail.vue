<template>
	<div class="background-wrapper">
		<ReceiptInfo
			title="出仓单详情"
			:isDetail="true"
		></ReceiptInfo>
	</div>
</template>

<script>
import ReceiptInfo from './components/ReceiptInfo.vue';

export default {
	name: 'storageCenterOutDetail',
	components: {
		ReceiptInfo
	}
};
</script>
