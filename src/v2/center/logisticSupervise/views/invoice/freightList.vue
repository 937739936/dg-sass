<template>
	<InvoiceList
		invoiceType="DELIVER"
		productCode='LOGIC_DELIVER'
		industryType="COAL"
	></InvoiceList>
</template>

<script>
import InvoiceList from './components/List.vue';

export default {
	name: 'FreightInvoiceList',
	components: { InvoiceList }
};
</script>
