<template>
  <div class="detail-bot">
    <a-tabs v-model="contractType" @change="changeContractType">
      <a-tab-pane key="buy" tab="采购合同"> </a-tab-pane>
      <a-tab-pane key="sell" tab="销售合同"> </a-tab-pane>
      <a-tab-pane key="trans" v-if="detailData.transContractNo && !isBank" tab="运输合同"> </a-tab-pane>
      <a-tab-pane v-if="['MORE_TO_ONE','MORE_TO_MORE', 'ONE_TO_MORE'].includes(detailData.businessLineLinkMore)  && !isBank "  key="allBusiness" tab="所关联其他业务线"> </a-tab-pane>
      <a-tab-pane v-if="type!=='admin'" key="inventory"  tab="业务线台账"> </a-tab-pane>
    </a-tabs>
    <!-- 采购 运输 销售 -->
    <div class="content" v-if="['buy', 'sell', 'trans'].includes(contractType)">
      <div class="content-left">
        <a-timeline>
          <a-timeline-item v-for="item in leftList" :key="item.value" @click="selectInfo(item.value)">
            <span class="name" :class="{'active': selectKey == item.value}">{{item.label}}</span>
            <component :is="item.icon"  v-if="selectKey != item.value" slot="dot"></component>
            <component :is="item.iconActive" v-else slot="dot"> </component>
          </a-timeline-item>
        </a-timeline>
      </div>
      <div class="content-right">
        <slot></slot>
      </div>
    </div>
    <!-- 所关联业务线 -->
    <div v-if='contractType == "allBusiness"'>
      <div class="more-business" v-if="detailData.businessLineLinkMore == 'MORE_TO_MORE' ">
        <div class="more-business-item" v-for="item in moreBusinessTab" :class="{'active': activeMore == item.value}" :key="item.value" @click="activeMore = item.value">{{item.label}}</div>
      </div>
      <div>
        <MoreBusiness :detailData='detailData' :type='type' :activeMore='activeMore'></MoreBusiness>
      </div>
    </div>
    <!-- 业务线台账 -->
    <InventoryInfo 
      v-if='contractType == "inventory"' 
      :inventoryApi='inventoryApi'
      @exportChart='exportChart'
      @goInOutDetail='goInOutDetail'
      :businessLineNo="this.$route.query.businessLineNo"
      :companyCreditCode="this.companyCreditCode"
    >
    </InventoryInfo>

    
  </div>
</template>

<script>
import {
  BusinessContract,
  BusinessContractSelect,
  BusinessFundSelect,
  BusinessFund,
  BusinessGoods,
  BusinessGoodsSelect,
  BusinessInvoice,
  BusinessInvoiceSelect,
  BusinessSettle,
  BusinessSettleSelect,
  BusinessTrading,
  BusinessTradingSelect,
  BusinessReturned,
  BusinessReturnedSelect,
} from '@sub/components/svg'







/** 左侧栏 */

// 第一种类型
// 线上采购合同 线上销售合同
const onlineLeft = [
  {
    label: '合同签订',
    value: 'contract',
    icon: BusinessContract,
    iconActive: BusinessContractSelect,
  },
  {
    label: '货物运输',
    value: 'goods',
    icon: BusinessGoods,
    iconActive: BusinessGoodsSelect,
  },
  {
    label: '资金流水',
    value: 'fund',
    icon: BusinessFund,
    iconActive: BusinessFundSelect,
  },
  {
    label: '结算单',
    value: 'settle',
    icon: BusinessSettle,
    iconActive: BusinessSettleSelect,
  },
  {
    label: '发票',
    value: 'invoice',
    icon: BusinessInvoice,
    iconActive: BusinessInvoiceSelect,
  },
  {
    label: '融资',
    value: 'trading',
    icon: BusinessTrading,
    iconActive: BusinessTradingSelect,
  },
]
// 线下采购合同
const offlineBuyLeft = [
  {
    label: '合同签订',
    value: 'contract',
    icon: BusinessContract,
    iconActive: BusinessContractSelect,
  },
  {
    label: '资金流水',
    value: 'fund',
    icon: BusinessFund,
    iconActive: BusinessFundSelect,
  },
  {
    label: '结算单',
    value: 'settle',
    icon: BusinessSettle,
    iconActive: BusinessSettleSelect,
  },
  {
    label: '发票',
    value: 'invoice',
    icon: BusinessInvoice,
    iconActive: BusinessInvoiceSelect,
  },
]
// 线下销售合同
const offlineSellLeft = [
  {
    label: '合同签订',
    value: 'contract',
    icon: BusinessContract,
    iconActive:BusinessContractSelect,
  },
  {
    label: '货物运输',
    value: 'goods',
    icon: BusinessGoods,
    iconActive: BusinessGoodsSelect,
  },
  {
    label: '回款',
    value: 'returned',
    icon:BusinessReturned,
    iconActive:BusinessReturnedSelect,
  },
  {
    label: '结算单',
    value: 'settle',
    icon: BusinessSettle,
    iconActive:BusinessSettleSelect,
  },
  {
    label: '发票',
    value: 'invoice',
    icon:BusinessInvoice,
    iconActive: BusinessInvoiceSelect,
  },
]
// 运输合同
const transLeft = [
  {
    label: '合同签订',
    value: 'contract',
    icon: BusinessContract,
    iconActive: BusinessContractSelect,
  },
  // {
  //   label: '货物运输',
  //   value: 'goods',
  //   icon:BusinessGoods,
  //   iconActive: BusinessGoodsSelect,
  // },
  {
    label: '资金流水',
    value: 'fund',
    icon: BusinessFund,
    iconActive: BusinessFundSelect,
  },
  {
    label: '结算单',
    value: 'settle',
    icon: BusinessSettle,
    iconActive:BusinessSettleSelect,
  },
  {
    label: '发票',
    value: 'invoice',
    icon: BusinessInvoice,
    iconActive: BusinessInvoiceSelect,
  },
]

import MoreBusiness from './components/MoreBusiness.vue'
import InventoryInfo from './InventoryInfo.vue'

export default {
  props: {
    detailData: {
      default: () => {
        return {
          contract: {}
        }
      }
    },
    // 切换上下游
    selectType: {
      default: 'buy'
    },

    type: {
      default:'rest',
    },
    isBank: {
      default: false
    },
    // 库存台账api
    inventoryApi: {

    },
    companyCreditCode: {
      default:''
    }

  },
  data() {
    return {
      contractType: 'buy',
      selectKey: 'contract',
      // 当前的合同信息
      contractInfo: {},
      // leftList: []
      // 多业务线管理
      moreBusinessTab: [
        {value:'ONE_TO_MORE',label: '一对多业务线'},
        {value:'MORE_TO_ONE',label: '多对一业务线'},

      ],
      activeMore: 'ONE_TO_MORE',



    }
  },
  activated() {
    this.contractType = 'buy'
    this.selectKey = 'contract'
  },

  mounted() {


  },
  computed: {
    leftList() {
      // 运输合同 需要优选判断
      if(this.detailData.transContractNo && this.contractType == 'trans') {
        return transLeft
      }
      // 判断 businessLineType
      // UP：上游补录、下游电子
      // ONLINE：上游电子、下游电子
      // DOWN：上游电子、下游补录
      // OFFLINE：上游补录、下游补录
      // 第一种 上游 合同类型
      if(this.detailData.businessLineType  == 'ONLINE') {
        return this.onlineLeftTrading
      }

      if(this.detailData.businessLineType  == 'UP') {
        if(this.contractType == 'buy') {
          return offlineBuyLeft
        }
        return this.onlineLeftTrading
      }

      if(this.detailData.businessLineType  == 'DOWN') {
        if(this.contractType == 'buy') {
          return this.onlineLeftTrading
        }
        return offlineSellLeft
      }
      if(this.detailData.businessLineType  == 'OFFLINE') {
        if(this.contractType == 'buy') {
          return offlineBuyLeft
        }
        return offlineSellLeft
      }

      return this.onlineLeftTrading
    },
    // 需要判断当前融资的模块是否展示
    onlineLeftTrading() {
      // console.log(this.contractType, 'contractType----')
      if(this.detailData.upStreamHasFinanceInfo && this.contractType == 'buy') {
        return onlineLeft
      }
       if(this.detailData.downStreamHasFinanceInfo && this.contractType == 'sell') {
        return onlineLeft
      }
      return [
        {
          label: '合同签订',
          value: 'contract',
          icon: BusinessContract,
          iconActive: BusinessContractSelect,
        },
        {
          label: '货物运输',
          value: 'goods',
          icon: BusinessGoods,
          iconActive: BusinessGoodsSelect,
        },
        {
          label: '资金流水',
          value: 'fund',
          icon: BusinessFund,
          iconActive: BusinessFundSelect,
        },
        {
          label: '结算单',
          value: 'settle',
          icon: BusinessSettle,
          iconActive: BusinessSettleSelect,
        },
        {
          label: '发票',
          value: 'invoice',
          icon: BusinessInvoice,
          iconActive: BusinessInvoiceSelect,
        },
      ]
    }

  },
  watch: {
    // 头部的上下游合同切换 和 当前采购合同 销售合同切换 联动
    selectType: {
      handler(type) {
        this.contractType = type
        this.changeContractType()
      },
      deep: true,
    },
    'detailData.businessLineLinkMore'(str) {
      if(['ONE_TO_MORE', 'MORE_TO_ONE'].includes(str)) {
        this.activeMore = str
      }
    }
  },
  methods: {
    // 切换tab
    changeContractType() {
      // 重置
      this.selectKey = 'contract'
      if(this.contractType != 'allBusiness') {
        this.$emit('changeContractType', this.contractType)
      }
      
  
    },
    selectInfo(key) {
      this.selectKey = key
      this.$emit('selectInfo', this.selectKey)
    },
    exportChart(startDate,endDate) {
      this.$emit('exportChart', startDate,endDate)
    },
    goInOutDetail(data, type) {
      this.$emit("goInOutDetail",data, type)
    }
    
    
  },
  components: {
    MoreBusiness,
    InventoryInfo,
  }
}
</script>

<style scoped  lang='less' >
.content {
  display: flex;
  &-left {
    margin-top:50px ;
    ::v-deep .ant-timeline-item-tail {
      height: 48px;
      // background: rgba(0, 0, 0, 0.4);
      border-left: 1px solid rgba(229, 230, 235, 1);
      top: initial;

    }
    ::v-deep .ant-timeline-item {
      padding: 0 0 30px;
      cursor: pointer;
    }
    ::v-deep .ant-timeline-item-head-custom {
      padding: 0 1px;
    }
    .name {
      color: var(--text-80, rgba(0, 0, 0, 0.80));
      font-family: PingFang SC;
      font-size: 14px;
      cursor: pointer;
      &.active {
        color: @primary-color;
        font-weight: 500;
      }
    }
  }
  &-right {
    // margin-top:30px ;
    flex: 1;
    margin-left: 108px;
    overflow: hidden;
  }
}
.more-business {
  width: 384px;
  height:32px;
  border: 1px solid #E5E6EB;
  border-radius: 4px;
  // padding: 4px 8px 4px 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 30px;
  &-item {
    padding: 2px 12px 2px 12px;
    box-sizing: border-box;
    border-radius: 2px;
    color: rgba(0, 0, 0, 0.80);
    width: 180px;
    text-align: center;
    cursor: pointer;
   
    font-size:14px
    &.active {
     

    }
  }
  .more-business-item.active {
      color:#fff;
       background: @primary-color;
  }

}

</style>
