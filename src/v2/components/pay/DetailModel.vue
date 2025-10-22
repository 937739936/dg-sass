<template>
  <div class="pay-detail-wrapper">
    <a-modal
      v-model="visible"
      :footer="null"
      width="930px">
      <accounting-detail ref="accountingDetail" :isSelfLoad="isSelfLoad"/>
    </a-modal>
  </div>
</template>
<script>
  import AccountingDetail from './AccountingDetail'
  export default {
    name: 'payDetailModel',
    components: {
      AccountingDetail
    },
    props: {
      // 初始化数据是从外部传入还是组建自己请求接口，false代表从外部传入,例如新建付款申请时数据从外部传入，查看付款申请时数据组件内部获取
      isSelfLoad: {
        type: Boolean,
        default: false
      }
    },
    data(){
      return {
        visible: false
      }
    },
    methods: {
      init(data, totalAmountData){
        this.visible = true
        this.$nextTick(() => {
          this.$refs.accountingDetail.init(data, totalAmountData)
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  .pay-detail-modal{

  }
  ::v-deep.table-com-container{
    height: 650px;
    overflow: auto;
  }
</style>