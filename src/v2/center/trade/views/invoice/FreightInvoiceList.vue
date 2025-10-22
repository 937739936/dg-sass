<template>
	<InvoiceList
		invoiceType="DELIVER"
		industryType="COAL"
	></InvoiceList>
</template>

<script>
import InvoiceList from '@/v2/components/newInvoice/List.vue';

export default {
	name: 'FreightInvoiceList',
	components: { InvoiceList }
};
</script>
