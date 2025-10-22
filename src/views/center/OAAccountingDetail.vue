<template>
  <div class="oa-accounting-detail">
    <accounting-detail ref="accountingDetail" :isSelfLoad="true"/>
  </div>
</template>
<script>
  /**
   * OA在付款审核页面，对于卓鼎的动力煤付款申请，点击明细显示该页面
   * OA使用路径为"/center/oAAccountingDetail?orderId=${orderId}&id=${paymentId}",orderId、id必要
   */
  import AccountingDetail from '@/v2/components/pay/AccountingDetail'
  export default {
    name: 'OAAccountingDetail',
    components: {
      AccountingDetail
    },
    data(){
      return{
      }
    },
    mounted() {
      this.$refs.accountingDetail.init()
    }
  }
</script>
<style lang="less" scoped>
  .oa-accounting-detail{
    width: 100%;
    height: auto;
  }
</style>