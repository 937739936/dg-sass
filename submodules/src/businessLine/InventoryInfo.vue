<template>
  <div class="content">
    <div class="content-left">
      <a-timeline>
          <a-timeline-item v-for="item in inventoryLeftList" :key="item.value" @click="selectInfo(item)">
            <span class="name" :class="{'active': selectKey == item.value}">{{item.label}}</span>
            <component :is="item.icon"  v-if="selectKey != item.value" slot="dot"></component>
            <component :is="item.iconActive" v-else slot="dot"> </component>
          </a-timeline-item>
        </a-timeline>
    </div>
    <div class="content-right" id='content-right'>
      <div class="slTitleAssis">基础信息</div>
      <div class="content-right-top" id='content-right-top' style="padding-top:20px">
        <a-descriptions bordered  :column="3" size="middle" >
          <a-descriptions-item label="账面库存(吨)">
            <span>{{ detail.totalInventory | formatMoney }}</span>
          </a-descriptions-item>
          <a-descriptions-item label="已付款金额(元)" >
            <span>￥{{ detail.businessLineInfo.paymentAmount  | formatMoney }}</span>
          </a-descriptions-item>
          <a-descriptions-item label="盯市库存货值(元)" >
            <span>￥{{ detail.marketTotalGoodsValue  | formatMoney }}</span>
          </a-descriptions-item>
          <a-descriptions-item label="账面库存货值(元)" >
            <span>￥{{ detail.totalGoodsValue  | formatMoney }}</span>
          </a-descriptions-item>
          <a-descriptions-item label="累计入库货值(元)" >
            <span>￥{{ detail.inGoodsValue  | formatMoney }}</span>
          </a-descriptions-item>
          <a-descriptions-item label="累计出库货值(元)" >
            <span>￥{{ detail.outGoodsValue  | formatMoney }}</span>
          </a-descriptions-item>
        </a-descriptions>
        <div class="warining" @click="showWarningModal">
          <span class="tag">风险预警</span>
          <div class="num">{{ count.total }}</div>
        </div>
      </div>
      <div class="slTitleAssis">库存统计</div>
      <InventoryOverviewChart
        id='content-right-mid'
        ref="invetoryOverviewChart" 
        source="business"
        @change="doFetchChart" 
        @export="doExport"
      ></InventoryOverviewChart>
      <CoalInventoryList 
        id='content-right-bot'
        :list="coalTypeinventoryList"
        @goInOutDetail='goInOutDetail'></CoalInventoryList>
      <WarningModal 
        ref="warningModal" 
        :businessLineNo="businessLineNo"
        :request="inventoryApi.getBusinessLineRiskPage"
        :count="count"
        source="rest"
        @warningDetail="warningDetail"
      ></WarningModal>
        
    </div>
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
} from '@sub/components/svg'
import InventoryOverviewChart from "@sub/logisticsPlatform/InventoryOverviewChart";
import CoalInventoryList from "@sub/logisticsPlatform/CoalInventoryList";
import WarningModal from "@sub/logisticsPlatform/business/WarningModal";

export default {
  props: {
    inventoryApi: {

    },
    businessLineNo: {
      default:''
    },
    companyCreditCode: {
      default:''
    }
  },
  data() {
    return {
      /** 库存台账 左侧 */
      inventoryLeftList: [
        {
          label: '库存数据总览',
          value: 'overview',
          icon: BusinessContract,
          iconActive: BusinessContractSelect,
          offset: 0,
        },
        {
          label: '库存统计',
          value: 'statistics',
          icon: BusinessGoods,
          iconActive: BusinessGoodsSelect,
          offset: 120,

        },
        {
          label: '煤种库存列表',
          value: 'coalList',
          icon: BusinessFund,
          iconActive: BusinessFundSelect,
          offset: 1460,

        },

      ],
      selectKey: 'overview',
      loading:false,
      chartLoadingn:false,
      count:{
        total:0,
        companyAlertCount:0,//企业预警
        tradeAlertCount:0,//交易预警
        inventoryAlerCount:0,//库存预警
        makeAlertCount:0//价格预警
      },
      detail:{
        businessLineInfo:{}
      },
      targetOffset: undefined,
      coalTypeinventoryList: [],
      type: {
        default: 'rest'
      }
    }
  },
  mounted() {

    const dom =   document.querySelector('.content-right')
    let t = this
    dom.addEventListener('scroll', function(e) {
        let offset  = e.target.scrollTop
        if(offset <= 80) {
          t.selectKey = 'overview'
        }
        if(offset > 80) {
          t.selectKey = 'statistics'
        }
        if(offset > 1200) {
          t.selectKey = 'coalList'
        }
    });
    this.doFetch();
    this.getCoalTypeinventoryList();
    this.doFetchRiskCount();

  },
  methods: {
    // 获取煤种库存列表
    getCoalTypeinventoryList() {
      this.inventoryApi.getCoalTypeinventoryList({
        businessLineNo:this.businessLineNo,
        companyCreditCode:this.companyCreditCode
      }).then(({success,data}) => {
        if(!success){
          return 
        }
        this.coalTypeinventoryList = data;
      })
    },
    // 获取业务线详情数据
    doFetch(){
      this.loading = true;
      this.inventoryApi.getBusinessLineDetail({
        businessLineNo:this.businessLineNo,
        companyCreditCode:this.companyCreditCode
      }).then(({success,data}) => {
        this.loading = false
        if(!success){
          return
        }
        this.detail = data;
      }).catch(() => {
        this.loading = false
      })
    },
    getCurrentAnchor() {
      return '#content-right-top';
    },
    selectInfo(item) {
      this.selectKey = item.value
      const dom =  document.querySelector('.content-right')
      dom.scrollTo(0, item.offset)
    },
    goContract(contractType){
      this.$emit("goContract",contractType,this.detail.businessLineInfo)
    },
    doFetchRiskCount(){
      this.inventoryApi.countQueryByBusinessLine({
        businessLineNo:this.businessLineNo
      }).then(({success,result}) => {
        if(!success){
          return
        }
        this.count= result||{};
      }).catch((e) => {

      })
    },
    doFetchChart(startDate,endDate){
      this.chartLoadingn = true;
      this.inventoryApi.getOverviewEcharts({startDate,endDate, businessLineNo: this.businessLineNo}).then(({success,data}) => {
        this.chartLoadingn = false;
        if(!success){
          return
        }
        // 库存小于0的数据不展示
        if (data.inventoryPieChartVO?.length) {
          const newData = data.inventoryPieChartVO.filter((item)=>{return item.num>0})
          data.inventoryPieChartVO = newData
        }
        this.$refs.invetoryOverviewChart.setData(data)
      }).catch((e) => {
        this.chartLoadingn = false;
      })
    },
    doExport(startDate,endDate){
      console.log(startDate,endDate)
      this.$emit('exportChart', startDate,endDate)
    },
    showWarningModal(){
      this.$refs.warningModal.show();
    },
    openBusinessLine(){
      this.$emit("openBusinessLine",this.detail)
    },
    goInOutDetail(data, type){
      this.$emit("goInOutDetail",data, type)
    },
    warningDetail(data){
      this.$emit("warningDetail",data)
    }
  },
  components: {
    InventoryOverviewChart,
    CoalInventoryList,
    WarningModal
  }
}
</script>

<style scoped  lang='less' >
.content {
  display: flex;
  max-height: 600px;
  overflow: auto;
  &-left {
    margin-top:50px ;
    width: 150px;
    padding-left: 5px;
    flex-shrink: 0;
    box-sizing: border-box;

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
    margin-left: 45px;
    flex-shrink: 0;
    overflow-x: hidden;
    // overflow: hidden;
  }
  /deep/ .ant-descriptions {
		font-weight: 400;
		line-height: 20px;
		padding: 0 !important;
		.ant-descriptions-item-label {
			background-color: rgba(243, 245, 246, 1);
			color: #77889d;
			width: 160px;
			height: 48px;
			padding: 0;
			padding-left: 10px;
		}
		.ant-descriptions-item-content {
			color: rgba(0, 0, 0, 0.8);
			padding-left: 12px;
			padding-right: 12px;
			width: inherit;
			// width: 22%;
		}
	}
  .warining{
    width:88px;
    height:100px;
    border-radius:5px;
    background-color:#DAE0E6;
    cursor: pointer;
    .tag{
      display: block;
      margin:4px;
      height:24px;
      font-size:14px;
      font-weight:bold;
      line-height:24px;
      color:#fff;
      border-radius:4px;
      background-color:#FF800F;
      text-align:center;
    }
    .num{
      display:flex;
      align-items:center;
      justify-content: center;
      margin:0 4px 0;
      height:64px;
      font-size:40px;
      color:rgba(#000,0.8);
      border-radius:4px;
      background-color:#fff;
    }
  }
  .content-right::-webkit-scrollbar {
    display: none!important;
  }
  .content-right-top {
    display: grid;
    grid-template-columns: 1fr 100px;
    grid-column-gap: 140px;
  }
}
</style>
