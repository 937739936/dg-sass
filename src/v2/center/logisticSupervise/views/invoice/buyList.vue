<template>
	<InvoiceList
		invoiceType="INPUT"
		productCode='WAREHOUSE_RENT'
		industryType="COAL"
	></InvoiceList>
</template>

<script>
import InvoiceList from './components/List.vue';

export default {
	name: 'BuyInvoiceList',
	components: { InvoiceList }
};
</script>
