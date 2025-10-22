<template>
	<InvoiceList
		invoiceType="INPUT"
		industryType="STEEL"
	></InvoiceList>
</template>

<script>
import InvoiceList from '@/v2/components/newInvoice/List.vue';

export default {
	name: 'BuyInvoiceList',
	components: { InvoiceList }
};
</script>
