<template>
	<InvoiceList
		invoiceType="OUTPUT"
		industryType="COAL"
	></InvoiceList>
</template>

<script>
import InvoiceList from '@/v2/components/newInvoice/List.vue';

export default {
	name: 'SellInvoiceList',
	components: { InvoiceList }
};
</script>
