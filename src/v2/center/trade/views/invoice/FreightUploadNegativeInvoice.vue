<template>
	<UploadNegativeInvoice
		invoiceType="DELIVER"
		industryType="COAL"
	></UploadNegativeInvoice>
</template>

<script>
import UploadNegativeInvoice from '@/v2/components/newInvoice/UploadNegativeInvoice.vue';

export default {
  name: 'FreightUploadNegativeInvoice',
  components: {
    UploadNegativeInvoice
  }
}
</script>

<style lang="less" scoped>

</style>