<template>
  <div class="new-detail" style="width:100%">
    <!-- 补录销售合同详情 -->
    <div class="new-detail-content detail-form">
        <h2>基本信息 <span style="opacity: 0;">1</span> </h2>
        <a-row class="df">
          <a-form-item label="下游企业名称">
            <div class="fake-ipt"> {{info.buyCompanyName}}</div>
          </a-form-item>
          <a-form-item label="社会统一信用代码">
            <div class="fake-ipt"> {{info.buyCompanyUscc}}</div>
          </a-form-item>
          <a-form-item label="下游纸质合同编号">
            <a-input class="ipt" disabled v-model="info.contractNo"> </a-input>
          </a-form-item>
          <a-form-item label="合同期限">
             <div class="fake-ipt"> {{info.effectiveStartDate}} - {{info.effectiveEndDate}} </div>
          </a-form-item>
          <a-form-item label="钢材种类">
             <div class="fake-ipt"> {{info.steelTypeDesc}}</div>
          </a-form-item>
          <a-form-item label="合同签订状态">
             <div class="fake-ipt">{{info.contractSignStatusDesc}}</div>
          </a-form-item>
          <a-form-item label="合同总数量（吨）">
             <div class="fake-ipt"> {{info.quantity}}</div>
          </a-form-item>
           <a-form-item label="运输方式">
            <div class="fake-ipt"> 汽运</div>
          </a-form-item>
          <a-form-item label="合同签订日期" >
            <div class="fake-ipt"> {{info.contractSignDate}}</div>
          </a-form-item>
          <a-form-item label="业务经理" v-if="info.assetTeamTraderName">
            <div class="fake-ipt"> {{info.assetTeamTraderName}}{{info.assetTeamTraderPhone}}</div>
          </a-form-item>
        </a-row>
    </div>
  </div>
</template>

<script>
export default {
  props: {
      info: {
        default: () => {}
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

.df {
  display: flex;
  flex-wrap: wrap;
  ::v-deep .ant-form-item {
    width: 33%;
  }
}
    .ipt {
        width: 310px;
        height: 40px;
        background: #F0F3FB;
        border-radius: 6px;
        font-size: 14px;
        color: #8495AA;
        border: 0;
        }
    .fake-ipt {
        width: 310px;
        height: 40px;
        background: #F0F3FB;
        border-radius: 6px;
        font-size: 14px;
        color: #8495AA;
        border: 0;
        padding: 4px 11px;
        display: flex;
        align-items: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
</style>
