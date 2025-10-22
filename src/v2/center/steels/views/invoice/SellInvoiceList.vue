<template>
	<InvoiceList
		invoiceType="OUTPUT"
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
