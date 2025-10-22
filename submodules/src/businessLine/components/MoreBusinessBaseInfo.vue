<template>
  <div class="base-info">
    <div class="slTitleAssis" style="margin-top:0px"><span>业务线基础信息</span></div>
    <div style="margin-top:20px">
      <div class="no-box"> 
        <span class="no-box-label">业务线号：</span> 
        <a href="javascript:;" @click="goDetail">{{selectItem.businessLineNo}}</a>
        <a-tooltip>
        		<template slot="title">
              <div>{{ selectItem.businessLineDisplayStatusDesc }}</div>
              <div v-if="rejectStatusList.includes(selectItem.businessLineDisplayStatus) && selectItem.upStreamRejectReason">
                上游驳回：{{ selectItem.upStreamRejectReason }}
              </div>
              <div v-if="rejectStatusList.includes(selectItem.businessLineDisplayStatus) && selectItem.downStreamRejectReason">
                下游驳回：{{ selectItem.downStreamRejectReason }}
              </div>
            </template>
            <span
              class="text status"
              :class="selectItem.businessLineDisplayStatus"
              >{{ selectItem.businessLineDisplayStatusDesc }}</span
            >
          </a-tooltip>
        <!-- <span class="text status" :class="selectItem.businessLineDisplayStatus">{{selectItem.businessLineDisplayStatusDesc}}</span> -->
      </div>
      <div class="no-box"> 
        <span class="no-box-label">采购合同：</span> 
        <a href="javascript:;" @click="goContract('buy')">{{selectItem.upContractNo}}</a>
      </div>
      <div class="no-box"> 
        <span class="no-box-label">销售合同：</span> 
        <a href="javascript:;"  @click="goContract('sell')">{{selectItem.downContractNo}}</a>
      </div>
    </div>
    <div class="slTitleAssis"  style="margin-top:20px"><span>业务线执行进度</span></div>
    <div class="execute">
      <div class="execute-item">
        <div class="execute-item-left"> {{deliveryLabel ? isDelivery?  '货转进度' : '发运进度' : '发运进度'}} </div>
        <div  class="execute-item-right progress-bar-tooltips" style="width:200px" v-if="isDelivery">
          <div class="execute-item-right-1  ">
            <a-progress :percent="dispatchRate" :show-info="false"/>
            <span class="percent-bg">
              <PercentBgIcon></PercentBgIcon>
              <span class="text">{{dispatchRate}}%</span>
            </span>
            <div class="over-percent" v-if="dispatchRate>100">
              <em></em>
              <i></i>
            </div>
          </div>
          <div class="execute-item-right-1"> <span class="label">合同量：</span> <span>{{formatMoney(selectItem.contractQuantity)}}吨</span> </div>
          <div class="execute-item-right-1" v-if="selectItem.deliveryQuantity" style="margin-bottom:0"><span class="label">已发运：</span> <span>{{formatMoney(selectItem.deliveryQuantity)}}吨</span></div>
          <div class="execute-item-right-1" v-else style="margin-bottom:0"><span class="label">已开货转：</span> <span>{{formatMoney(selectItem.goodsTransferQuantity)}}吨</span></div>
        </div>
        <div  class="execute-item-right progress-bar-tooltips" style="color: rgba(0, 0, 0, 0.25);" v-else>
          未发运
        </div>
      </div>
      <div class="execute-item">
        <div class="execute-item-left">资金进度</div>
        <div  class="execute-item-right progress-bar-tooltips">
          <div class="execute-item-right-1"> <span class="label">向上游支付：</span> 
            <span v-if="selectItem.payAmount">{{formatMoney(selectItem.payAmount)}}元</span> 
            <div class="no-result" v-else>未付款</div>
          </div>
          <div class="execute-item-right-1" style="margin-bottom:0">
            <template v-if="!['UP', 'ONLINE'].includes(selectItem.businessLineType)">
              <span class="label">业务线回款：</span> 
              <span  v-if="selectItem.receiveAmount">{{formatMoney(selectItem.receiveAmount)}}元</span>
              <span v-else style="color: rgba(0, 0, 0, 0.25);">业务线未回款</span>
            </template>
            <template v-else>
               <span class="label">下游付款：</span> 
              <span  v-if="selectItem.receiveAmount">{{formatMoney(selectItem.receiveAmount)}}元</span>
              <span v-else style="color: rgba(0, 0, 0, 0.25);">未付款</span>
            </template>
            
          </div>
        </div>
      </div>
      <div class="execute-item">
        <div class="execute-item-left">结算进度</div>
        <div  class="execute-item-right progress-bar-tooltips">
          <div class="execute-item-right-1"> 
            <span class="label">上游结算：</span> 
            <span style="color: rgba(0, 0, 0, 0.25);"  v-if="!selectItem.upStreamSettleQuantity && !selectItem.upStreamSettleAmount" >未结算</span>
            <span v-else>{{formatMoney(selectItem.upStreamSettleQuantity)}}吨 | {{formatMoney(selectItem.upStreamSettleAmount)}}元</span> 
          </div>
          <div class="execute-item-right-1" style="margin-bottom:0">
            <span class="label">下游结算：</span> 
            <span style="color: rgba(0, 0, 0, 0.25);" v-if="!selectItem.downStreamSettleQuantity && !selectItem.downStreamSettleAmount">未结算</span>
            <span v-else>{{formatMoney(selectItem.downStreamSettleQuantity)}}吨 | {{formatMoney(selectItem.downStreamSettleAmount)}}元</span>
          </div>
        </div>
      </div>
      <div class="execute-item">
        <div class="execute-item-left">开票进度</div>
        <div  class="execute-item-right progress-bar-tooltips">
          <div class="execute-item-right-1"> 
            <span class="label">上游开票：</span> 
            <span  v-if="selectItem.upStreamInvoiceAmount">{{formatMoney(selectItem.upStreamInvoiceAmount)}}元</span> 
            <span style="color: rgba(0, 0, 0, 0.25);" v-else>未开票</span>
          </div>
          <div class="execute-item-right-1" style="margin-bottom:0">
            <span class="label">下游开票：</span> 
            <span  v-if="selectItem.downStreamInvoiceAmount">{{formatMoney(selectItem.downStreamInvoiceAmount)}}元</span>
            <span style="color: rgba(0, 0, 0, 0.25);" v-else>未开票</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { formatMoney } from '@sub/filters';
import { PercentBgIcon } from '@sub/components/svg';
export default {
  props: {
    selectItem: {
      default: () => {return {}}
    },
    type: {
      default: 'rest',
    }
  },
  data() {
    return {
      rejectStatusList: [
				'COMPLETED_AUDIT_REJECT',
				'UP_COMPLETED_AUDIT_REJECT_DOWN_COMPLETED_AUDIT_ING',
				'UP_COMPLETED_AUDIT_REJECT_DOWN_COMPLETED_AUDIT_PASS',
				'UP_COMPLETED_AUDIT_REJECT_DOWN_EXECUTING',
				'UP_EXECUTING_DOWN_COMPLETED_AUDIT_REJECT',
				'UP_COMPLETED_AUDIT_PASS_DOWN_COMPLETED_AUDIT_REJECT',
				'UP_COMPLETED_AUDIT_ING_DOWN_COMPLETED_AUDIT_REJECT'
			],
    }
  },
  computed: {
    // 发运进度
    dispatchRate() {
      let pre = 0
      // 没有合同数量
      if(!this.selectItem.contractQuantity) {
        return pre
      }
      if(this.selectItem.deliveryQuantity) {
        pre = Number(((this.selectItem.deliveryQuantity / this.selectItem.contractQuantity) * 100).toFixed(0))
        return pre
      }
      if(!this.selectItem.deliveryQuantity && (this.selectItem.deliveryTransType == 'NONE' ||  !this.selectItem.deliveryTransType)) {
        pre = Number(((this.selectItem.goodsTransferQuantity / this.selectItem.contractQuantity) * 100).toFixed(0))
        return pre
      }
      return pre
    },
    // 判断发运文案
    deliveryLabel() {

      if(!this.selectItem.deliveryQuantity && (this.selectItem.deliveryTransType == 'NONE' || !this.selectItem.deliveryTransType)) {
        return true
      }
      return false
    },
    // 判断是否发运
    isDelivery() {
      if(!this.selectItem.deliveryQuantity) {
        if(this.selectItem.deliveryTransType != 'NONE') {
          return false
        }
        return true

      }
      return true
    },
  },
  methods: {
    formatMoney,
    goDetail() {
      let path  = this.type == 'rest' ? '/center/businessline/detail' : '/data/DynamicMonitoringDetail'
      const routeData = this.$router.resolve({
        path,
        query: {
          businessLineNo: this.selectItem.businessLineNo,
        }
      })
      window.open(routeData.href, '_blank')
    },
    goContract(type) {
       // UP：上游补录、下游电子
      // ONLINE：上游电子、下游电子
      // DOWN：上游电子、下游补录
      // OFFLINE：上游补录、下游补录

      let id = type == 'buy' ? this.selectItem.upOrderId : this.selectItem.downOrderId 

      let path = `/center/contract/${type}/online/detail?id=${id}&type=${type.toUpperCase()}`
      console.log(this.type)
      if(this.type == 'rest') {
        
        if((type =='buy' && ['UP', 'OFFLINE'].includes(this.selectItem.businessLineType)) || (type =='sell' && ['DOWN', 'OFFLINE'].includes(this.selectItem.businessLineType))) {
          path = `/center/contract/${type}/offline/detail?id=${id}&type=${type}`
        }

      } else {
        path = `/sys/contract/online/detail?id=${id}`
        if((type =='buy' && ['UP', 'OFFLINE'].includes(this.selectItem.businessLineType)) || (type =='sell' && ['DOWN', 'OFFLINE'].includes(this.selectItem.businessLineType))) {
          path = `/sys/contract/offline/detail?id=${id}`
        }
      }
     
      const routeData = this.$router.resolve({ 
        path,
      })

      window.open(routeData.href, '_blank')
    },

  },
  components: {
    PercentBgIcon
  }

}
</script>

<style scoped  lang='less' >
.base-info {
  background-color: #F3F5F6;
  width: 368px;
  padding: 20px;
  .no-box {
    .no-box-label {
      color: rgba(0, 0, 0, 0.4);
    }
  }
  .percent-bg {
    right: -5px !important;
  }
  .execute {
   
    &-item {
      display: flex;
      height: 103px;
      background: #fff;
      width: 328px;
      margin-top: 20px;
      border-radius: 4px;
      &-left {
        background: #D3E1E8;
        width: 38px;
        writing-mode: vertical-rl;
        text-align: center;
        line-height: 38px;
        color: #77889D;
        font-weight: 600;
        letter-spacing: 6px;
        border-radius: 4px 0px 0 4px;

      }
      &-right {
        padding:12px 12px ;
        display: flex;
        flex-direction: column;
        justify-content: center;
        border-radius: 0px 4px 4px 0px;
        &-1 {
          display: flex;
          margin-bottom: 12px;
          font-size: 14px;
          position: relative;
          span {
             color: rgba(0, 0, 0, 0.8);
          }
        }
        .label {
          color: rgba(0, 0, 0, 0.4);
        }
      }
    }

  }
}
  .progress-bar-tooltips {
    .ant-progress-status-success .ant-progress-bg {
      background-color:@primary-color!important;
    }
    .ant-progress-bg {
      background-color:@primary-color!important;
    }
    .ant-progress {
      padding-right: 40px;
    }
    .ant-progress-inner {
      width: 100px;
    }
    .percent-bg {
      padding-left: 3px;
      position: absolute;
      right: 0;
      top: 3px;
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
        color: #fff;
      }
    }
    .over-percent {
      position: absolute;
      right: 39px;
      top: 2.5px;
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
.status {
  display: inline-block;
  padding: 3px 6px;
  align-items: flex-start;
  gap: 10px;
  border-radius: 4px;
  font-family: PingFang SC;
  font-size: 12px;
  margin-left: 4px;
  background: #FFDAC8;
  color: #FF7937;
  margin-left: 20px;
  cursor: pointer;
  text-align: center;
  max-width: 85px;
  text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    vertical-align: middle;

}
.COMPLETED_AUDIT_REJECT, 
.UP_COMPLETED_AUDIT_REJECT_DOWN_COMPLETED_AUDIT_ING,
.UP_COMPLETED_AUDIT_REJECT_DOWN_COMPLETED_AUDIT_PASS,
.UP_COMPLETED_AUDIT_REJECT_DOWN_EXECUTING,
.UP_EXECUTING_DOWN_COMPLETED_AUDIT_REJECT {
  background: #F2D0D0;
  color: #D44;
}
.EXECUTING {
  background: #C1D7FF;
  color: var(--VI-, #4682F3);
}
</style>
