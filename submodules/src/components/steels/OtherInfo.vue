<template>
  <div class="new-detail">
    <div class="new-detail-content detail-form"  style="padding-bottom:0;margin-top:10px">
      <h2>基本信息</h2>
      <a-row class="df">
        <a-form-item label="合同编号">
          <div class="fake-ipt">{{contract.contractNo}}</div>
        </a-form-item>
        <a-form-item label="买方名称">
          <div class="fake-ipt">{{contract.buyCompanyName}}</div>
        </a-form-item>
        <a-form-item label="钢材种类">
          <div class="fake-ipt">{{contract.steelTypeDesc}}</div>
        </a-form-item>
        <a-form-item label="网价参考">
           <div class="fake-ipt">{{contract.marketPriceSourceDesc}}</div>
        </a-form-item>
      </a-row>
    </div>
    <div class="new-detail-content detail-form" style="padding-bottom:0;padding-top:0;margin-top:70px">
      <h2>合同履约保证金条款</h2>
      <a-row>
        <a-col span="24">
          <div v-html="contract.performanceBond"> </div>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
export default {
  props:{
    contract: {
      default: () => { return {} }
    }
  },
  data() {
    return {

    }
  },
  methods: {

  },
  components: {

  }
}
</script>

<style scoped lang='less'>
.new-detail {
  color: rgba(0,0,0,0.8);
}
::v-deep label {
  color: rgba(0,0,0,0.8) !important;
}
.df {
  display: flex;
  flex-wrap: wrap;
}
.df {
  display: flex;
  flex-wrap: wrap;
  ::v-deep .ant-form-item {
    width: 33%;
  }
  ::v-deep .ant-form-item-label {
    text-align: left;
  }
}
.ipt {
  width: 364px;
  height: 40px;
  background: #F0F3FB;
  border-radius: 6px;
  color: #8495AA;
  border: 0;
}
.fake-ipt {
  width: 364px;
  height: 40px;
  background: #F0F3FB;
  border-radius: 6px;
  border: 0;
  padding: 6px 14px;
  display: flex;
  align-items: center;
  color: #8495AA;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
</style>
