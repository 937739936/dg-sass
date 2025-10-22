<template>
  <div class="detail-mid">
    <div class="detail-mid-item">
      <label>合同</label>
       <a-tooltip placement="topLeft"  v-if="detailData.contactStatusStatistic">
        <template slot="title">
          {{detailData.contactStatusStatistic.join(',')}}
        </template>
        <div class="result omit">{{detailData.contactStatusStatistic.join(',')}}</div>
      </a-tooltip>
      
    </div>
    <div class="detail-mid-item">
      <label> {{deliveryLabel ? isDelivery ? '货转' : '发运' : '发运'}} </label>
      <div class="result" v-if="isDelivery">
        <span  v-if="detailData.deliveryQuantity">{{formatMoney(detailData.deliveryQuantity)}}吨</span>
        <span v-else>{{formatMoney(detailData.goodsTransferQuantity)}}吨</span>

        <a-tooltip placement="bottom" overlayClassName="progress-bar-tooltips">
          <template slot="title">
            <a-progress :percent="dispatchRate" :show-info="false"/>
            <em class="percent-bg">
              <PercentBgIcon></PercentBgIcon>
              <span class="text">{{dispatchRate}}%</span>
            </em>
            <div class="over-percent" v-if="dispatchRate>100">
              <em></em>
              <i></i>
            </div>
          </template>
          <span style="margin-left:8px;vertical-align: middle;">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M4 12C2.897 12 2 11.103 2 10V4C2 2.897 2.897 2 4 2H10C11.103 2 12 2.897 12 4V10C12 11.103 11.103 12 10 12H4ZM10 0H4C1.791 0 0 1.791 0 4V10C0 12.209 1.791 14 4 14H10C12.209 14 14 12.209 14 10V4C14 1.791 12.209 0 10 0Z" fill="var(--primary-color)"/>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M9.29302 3.70703C9.03702 3.70703 8.78102 3.80503 8.58602 4.00003L4.00002 8.58603C3.61002 8.97603 3.61002 9.60903 4.00002 10C4.19502 10.195 4.45102 10.293 4.70702 10.293C4.96302 10.293 5.21902 10.195 5.41402 10L10 5.41403C10.391 5.02403 10.391 4.39003 10 4.00003C9.80502 3.80503 9.54902 3.70703 9.29302 3.70703Z" fill="var(--primary-color)"/>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M9.31181 8.05859C8.61981 8.05859 8.05981 8.61959 8.05981 9.31059C8.05981 10.0026 8.61981 10.5636 9.31181 10.5636C10.0038 10.5636 10.5638 10.0026 10.5638 9.31059C10.5638 8.61959 10.0038 8.05859 9.31181 8.05859Z" fill="var(--primary-color)"/>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M4.5999 3.34766C3.9079 3.34766 3.3479 3.90866 3.3479 4.59966C3.3479 5.29166 3.9079 5.85266 4.5999 5.85266C5.2919 5.85266 5.8519 5.29166 5.8519 4.59966C5.8519 3.90866 5.2919 3.34766 4.5999 3.34766Z" fill="var(--primary-color)"/>
            </svg>
          </span>

        </a-tooltip>
      </div>
      <p class="no-result" v-else>未发运</p>
    </div>
    <div class="detail-mid-item">
      <label>付款</label>
      <div class="result" v-if="detailData.payAmount">{{formatMoney(detailData.payAmount)}}元</div>
      <div class="no-result" v-else>未付款</div>
    </div>
    <div class="detail-mid-item">
      <label>上游结算</label>
      <div  v-if="!detailData.upStreamSettleQuantity && !detailData.upStreamSettleAmount" class="no-result">未结算</div>
      <div class="result" v-else>
        <span>{{formatMoney(detailData.upStreamSettleQuantity)}}吨</span>
        <span style="margin: 0px 3px">|</span>
        <span>{{formatMoney(detailData.upStreamSettleAmount)}}元 </span>
      </div>
    </div>
    <div class="detail-mid-item">
      <label>上游发票</label>
      <div class="result" v-if="detailData.upStreamInvoiceAmount">{{formatMoney(detailData.upStreamInvoiceAmount)}}元</div>
      <div class="no-result" v-else>未开票</div>
    </div>
    <div class="detail-mid-item row2">
      <template v-if="!['UP', 'ONLINE'].includes(detailData.businessLineType)">
        <label >回款</label>
         <div class="result" v-if="detailData.receiveAmount">{{formatMoney(detailData.receiveAmount)}}元</div>
        <div class="no-result" v-else>业务线未回款</div>
      </template>
        <template v-else>
        <label >下游付款</label>
         <div class="result" v-if="detailData.receiveAmount">{{formatMoney(detailData.receiveAmount)}}元</div>
        <div class="no-result" v-else>未付款</div>
      </template>
    </div>
    <div class="detail-mid-item row2">
      <label>下游结算</label>
      <div  v-if="!detailData.downStreamSettleQuantity && !detailData.downStreamSettleAmount" class="no-result">未结算</div>
      <div class="result" v-else>
        <span>{{formatMoney(detailData.downStreamSettleQuantity)}}吨</span>
        <span style="margin: 0px 3px">|</span>
        <span>{{formatMoney(detailData.downStreamSettleAmount)}}元 </span>
      </div>
    </div>
    <div class="detail-mid-item row2">
      <label>下游发票</label>
      <div class="result" v-if="detailData.downStreamInvoiceAmount">{{formatMoney(detailData.downStreamInvoiceAmount)}}元</div>
      <div class="no-result" v-else>未开票</div>
    </div>
    <div class="detail-mid-item row2"  v-if="detailData.downStreamHasFinanceInfo || detailData.upStreamHasFinanceInfo">
      <label>融资</label>
      <div class="result" v-if="detailData.financeAmount">
        <span>{{formatMoney(detailData.financeAmount)}}元</span>
         <a-tooltip  overlayClassName="progress-bar-tooltips finance_tooltips" >
          <template slot="title">
            <a-progress :percent="financeRate" :show-info="false"/>
            <em class="percent-bg">
              <PercentBgIcon></PercentBgIcon>
              <span class="text">{{financeRate}}%</span>
            </em>
            <div class="over-percent" v-if="financeRate>100">
              <em></em>
              <i></i>
            </div>
            <p style="font-size:12px;margin-top:15px">已融资：{{formatMoney(detailData.financeAmount)}}元</p>
            <p style="font-size:12px">已还本金：{{formatMoney(detailData.repaymentAmount)}}元</p>
            <p style="font-size:12px">待还本金：{{formatMoney(detailData.financeAmount - detailData.repaymentAmount)}}元</p>
          </template>
        <span style="margin-left:8px;vertical-align: middle;">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M4 12C2.897 12 2 11.103 2 10V4C2 2.897 2.897 2 4 2H10C11.103 2 12 2.897 12 4V10C12 11.103 11.103 12 10 12H4ZM10 0H4C1.791 0 0 1.791 0 4V10C0 12.209 1.791 14 4 14H10C12.209 14 14 12.209 14 10V4C14 1.791 12.209 0 10 0Z" fill="var(--primary-color)"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M9.29302 3.70703C9.03702 3.70703 8.78102 3.80503 8.58602 4.00003L4.00002 8.58603C3.61002 8.97603 3.61002 9.60903 4.00002 10C4.19502 10.195 4.45102 10.293 4.70702 10.293C4.96302 10.293 5.21902 10.195 5.41402 10L10 5.41403C10.391 5.02403 10.391 4.39003 10 4.00003C9.80502 3.80503 9.54902 3.70703 9.29302 3.70703Z" fill="var(--primary-color)"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M9.31181 8.05859C8.61981 8.05859 8.05981 8.61959 8.05981 9.31059C8.05981 10.0026 8.61981 10.5636 9.31181 10.5636C10.0038 10.5636 10.5638 10.0026 10.5638 9.31059C10.5638 8.61959 10.0038 8.05859 9.31181 8.05859Z" fill="var(--primary-color)"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M4.5999 3.34766C3.9079 3.34766 3.3479 3.90866 3.3479 4.59966C3.3479 5.29166 3.9079 5.85266 4.5999 5.85266C5.2919 5.85266 5.8519 5.29166 5.8519 4.59966C5.8519 3.90866 5.2919 3.34766 4.5999 3.34766Z" fill="var(--primary-color)"/>
          </svg>
          </span>
         </a-tooltip>
      </div>
      <div class="no-result" v-else>未融资</div>
    </div>
  </div>
</template>

<script>
import { formatMoney } from '@sub//filters'
import { PercentBgIcon } from '@sub/components/svg';
export default {
  props: {
    detailData: {
      default: () => {
        return {
          contract: {}
        }
      }
    },
  },
  computed: {
    // 发运进度
    dispatchRate() {
      let pre = 0
      // 没有合同数量
      if(!this.detailData.contractQuantity) {
        return pre
      }
      if(this.detailData.deliveryQuantity) {
        pre = Number(((this.detailData.deliveryQuantity / this.detailData.contractQuantity) * 100).toFixed(0))
        return pre
      }
      if(!this.detailData.deliveryQuantity && ( this.detailData.deliveryTransType == 'NONE' || !this.detailData.deliveryTransType)) {
        pre = Number(((this.detailData.goodsTransferQuantity / this.detailData.contractQuantity) * 100).toFixed(0))
        return pre
      }
      return pre
    },
    // 判断发运文案
    deliveryLabel() {
  
      if(!this.detailData.deliveryQuantity && (this.detailData.deliveryTransType == 'NONE' || !this.detailData.deliveryTransType)) {
        return true
      }
      return false
    },
    // 判断是否发运
    isDelivery() {
      if(!this.detailData.deliveryQuantity) {
        if(this.detailData.deliveryTransType != 'NONE') {
          return false
        }
        return true

      }
      return true
    },
    // 融资进度条
    financeRate() {
      return   Number(((this.detailData.repaymentAmount / this.detailData.financeAmount) * 100).toFixed(0)) 
    }


  },
  data() {
    return {

    }
  },
  methods: {
    formatMoney,
  },
  components: {
    PercentBgIcon
  }
}
</script>
<style lang="less">
  .progress-bar-tooltips {
    .ant-progress-status-success .ant-progress-bg {
      background-color:@primary-color!important;
    }
    .ant-progress-bg {
      background-color:@primary-color!important;
    }
    .ant-tooltip-inner {
      position: relative;
      .ant-progress {
        padding-right: 40px;
      }
      .ant-progress-inner {
        width: 100px;
      }
      .percent-bg {
        padding-left: 3px;
        position: absolute;
        right: 2px;
        top: 8px;
        font-family:
          PingFangSC-Medium,
          PingFang SC;
        font-weight: 500;
        color: #ffffff;
        line-height: 29px;
        display: inline-block;
        width: 40px;
        height: 16px;
        text-align: center;
        font-style: normal;
        svg {
          position: absolute;
          top: 0;
          left: 0;
        }
        .text {
          display: inline-block;
          overflow: hidden;
          position: absolute;
          top: 0;
          left: 3px;
          z-index: 10;
          font-size: 14px;
          zoom: 0.86;
          width: 47px;
          height: 19px;
          line-height: 19px;
          text-align: center;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }
      }
      .over-percent {
        position: absolute;
        right: 47px;
        top: 8px;
        em {
          display: inline-block;
          width: 4px;
          height: 12px;
          background: @primary-color;
          border-radius: 2px;
        }
        i {
          display: inline-block;
          width: 10px;
          height: 8px;
          background: #F46332;
          border-radius: 0 4px 4px 0;
          position: relative;
          top:-2px;
        }
      }
    }
  }
  .finance_tooltips {
     .ant-tooltip-inner {
      width: 170px;
      box-sizing: border-box;
     }
     .percent-bg {
      right: 15px !important;
     }
  }
</style>
<style scoped  lang='less' >
.detail-mid {
  border-radius: 4px;
  background: #FFF;
  padding: 20px 30px;
  display: flex;
  flex-wrap: wrap;
  height: 170px;
  box-sizing: border-box;
  .row2 {
    margin-top: 30px;
  }
  &-item {
    width: 20%;
    label {
      color: var(--text-40, rgba(0, 0, 0, 0.40));
      font-family: PingFang SC;
      font-size: 14px;
      font-weight: 600;
      font-style: normal;
    }
    .result {
      color: var(--text-80, rgba(0, 0, 0, 0.80));
      font-family: PingFang SC;
      font-size: 16px;
      font-weight: 600;
      font-style: normal;
      margin-top: 4px;
    }
    .no-result {
      color: var(--text-25, rgba(0, 0, 0, 0.25));
      font-family: PingFang SC;
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
       margin-top: 4px;
    }
  }
}
.omit {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

</style>
