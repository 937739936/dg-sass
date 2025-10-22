<template>
  <div>
    <div class="detail-info">
      <div class="description">
        <div class="row">
          <div class="col">
            <span class="label mark">业务线号：</span>
            <a  class="text a-b" @click="openBusinessLine">{{ detail.businessLineNo }}</a>
            <span class="status">{{ detail.businessLineInfo.status }}</span>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <span class="label">业务线名称：</span>
            <span class="text">{{ detail.businessLineInfo.businessLineName }}</span>
          </div>
          <div class="col">
            <span class="label">上游合同号：</span>
            <a class="text a" @click="goContract('BUY')">{{ detail.businessLineInfo.upContractNo }}</a>
          </div>
          <div class="col">
            <span class="label">下游合同号：</span>
            <a class="text a" @click="goContract('SELL')">{{ detail.businessLineInfo.downContractNo }}</a>
          </div>
        </div>
      </div>
      <div class="warining" @click="showWarningModal">
        <span class="tag">风险预警</span>
        <div class="num">{{ count.total }}</div>
      </div>
    </div>
    <div class="card-list">
      <div class="card">
        <span class="title">账面库存(吨)</span>
        <div class="text">{{ detail.totalInventory | toNumberString}}</div>
      </div>
      <!-- <div class="card orange">
        <span class="title">实际库存(吨)</span>
        <div class="text">167,375.5134</div>
      </div>
      <div class="card cyan">
        <span class="title">库存货值(元)</span>
        <div class="text">167,375.5134</div>
      </div> -->
      <div class="card orange">
        <span class="title">已付款金额(元)</span>
        <div class="text">{{ detail.businessLineInfo.paymentAmount | toNumberString }}</div>
      </div>
      <div class="card cyan">
        <span class="title">累计入库数量(吨)</span>
        <div class="text">{{ detail.inInventory | toNumberString }}</div>
      </div>
      <div class="card">
        <span class="title">累计出库数量(吨)</span>
        <div class="text">{{ detail.outInventory | toNumberString }}</div>
      </div>
      <template v-if="source == 'admin'">
        <div class="card cyan">
          <div class="title-container">
            <span class="title">库存货值(元)</span>
            <div class="type-tag inventory">账面</div>
          </div>
          <div class="text">{{ detail.totalGoodsValue | toNumberString }}</div>
        </div>
        <div class="card">
          <div class="title-container">
            <span class="title">库存货值(元)</span>
            <div class="type-tag market">盯市</div>
          </div>
          <div class="text">{{ detail.marketTotalGoodsValue | toNumberString }}</div>
        </div>
        <div class="card orange">
          <span class="title">累计入库货值(元)</span>
          <div class="text">{{ detail.inGoodsValue | toNumberString }}</div>
        </div>
        <div class="card cyan">
          <span class="title">累计出库货值(元)</span>
          <div class="text">{{ detail.outGoodsValue | toNumberString }}</div>
        </div>
      </template>
    </div>
    <div class="chart">
      <InventoryOverviewChart 
        ref="invetoryOverviewChart" 
        @change="doFetchChart" 
        @export="doExport"
        @toRecord="toRecord"
      ></InventoryOverviewChart>
      <CoalInventoryList :list='coalTypeinventoryList' @goInOutDetail='goInOutDetail'></CoalInventoryList> 
    </div>
    <WarningModal 
      ref="warningModal" 
      :businessLineNo="detail.businessLineNo"
      :request="requestRisk.requestList"
      :count="count"
      :source="source"
      @warningDetail="warningDetail"
    ></WarningModal>
  </div>
</template>
<script>
import InventoryOverviewChart from "@sub/logisticsPlatform/InventoryOverviewChart";
import CoalInventoryList from "@sub/logisticsPlatform/CoalInventoryList";
import WarningModal from "./business/WarningModal";
export default {
  props:{
    source:{
      type:String,
      default:() => "rest"
    },
    requestDetail:{
      type:Function,
      default:() => (async () =>  {})
    },
    requestChart:{
      type:Function,
      default:() => (async () => {})
    },
    exportChart:{
      type:Function,
      default:() => (async () => {})
    },
    requestRisk:{
      type:Object,
      defafult:() => {
        return  {
          requestCount:async () => {},
          requestList:async () =>  {}
        }
      }
    },
    coalTypeinventoryList: {
      type: Array,
      default:() => (async () => [])
    },
  },
  components:{
    InventoryOverviewChart,
    WarningModal,
    CoalInventoryList
  },
  data(){
    return {
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
    }
  },
  mounted(){
    this.doFetch()
    this.doFetchRiskCount();
  },
  methods:{
    goInOutDetail(data, type) {
      this.$emit("goInOutDetail", {data, type})
    },
    goContract(contractType){
      this.$emit("goContract",contractType,this.detail.businessLineInfo)
    },
    doFetchRiskCount(){
      this.requestRisk.requestCount().then(({success,result}) => {
        if(!success){
          return
        }
        this.count= result||{};
      }).catch((e) => {

      })
    },
    doFetch(){
      this.loading = true;
      this.requestDetail().then(({success,data}) => {
        this.loading = false
        if(!success){
          return
        }
        this.detail = data;
      }).catch(() => {
        this.loading = false
      })
    },
    doFetchChart(startDate,endDate){
      this.chartLoadingn = true;
      this.requestChart(startDate,endDate).then(({success,data}) => {
        this.chartLoadingn = false;
        if(!success){
          return
        }
        // 库存小于等于0的数据不展示
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
      return this.exportChart(startDate,endDate)
    },
    showWarningModal(){
      this.$refs.warningModal.show();
    },
    openBusinessLine(){
      this.$emit("openBusinessLine",this.detail)
    },
    toRecord(data){
      this.$emit("toRecord",data,this.detail)
    },
    warningDetail(data){
      this.$emit("warningDetail",data)
    }
  }
}
</script>
<style lang="less" scoped>
::v-deep{
  .pie-wrap{
    padding-bottom:20px;
  }
 
}
.detail-info{
  padding:0 30px;
 
  display:flex;
  justify-content: space-between;
  background-color:#fff;
  .description{
    flex:1;
    .row{
      margin-bottom:20px;
      display:flex;
      align-items:flex-start;
      &:last-child{
        margin-bottom:0;
      }
    }
    .col{
      margin-right:20px;
      flex:1;
      display:flex;
      align-items:flex-start;
      font-size:14px;
      line-height:20px;
      .label{
        flex-shrink:0;
        color:rgba(#000,0.4);
        &.mark{
          font-size:16px;
          font-weight: bold;
          color:rgba(#000,0.8);
        }
      }
      .text{
        color:rgba(#000,0.8);
        &.a-b{
          font-size:16px;
          color: @primary-color;
        }
        &.a{
          font-size:14px;
          color: @primary-color;
        }
      }
      .status{
        margin-left:20px;
        padding:0 6px;
        height:20px;
        font-size:12px;
        line-height:20px;
        color:#4682F3;
        background-color:#C1D7FF;
        border-radius:3px;

      }
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
}
.card-list{
  padding-top:30px;
  padding-left:30px;
  padding-right:10px;
  padding-bottom:20px;
  display: flex;
  flex-wrap: wrap;
  background-color:#fff;
  .card{
    // flex:1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-bottom:20px;
    margin-right: 20px;
    padding:14px 12px;
    min-width: calc(25% - 20px);
    // max-width: 306px;
    height: 88px;
    border-radius: 6px;
    background-color:#F0F8FF;
    box-sizing:border-box;
    &.orange{
      background-color:#FFF9F0;
    }
    &.cyan{
      background-color:#EBFAEF;
    }
    .title{
      color:rgba(#000,0.4);
      font-size:14px;
      line-height:20px;
      font-family: PingFangSC;
      font-weight:normal;
    }
    .text{
      margin-top:12px;
      color:rgba(#000,0.8);
      font-size:20px;
      line-height:28px;
      font-weight: bold;
    }
    .title-container {
      display: flex;
      flex-direction: row;
      align-items: center;
      .type-tag{
        margin-left: 20px;
        padding: 0 12px;
        height: 20px;
        font-size: 12px;
        line-height: 20px;
        border-radius: 20px;
        color: #fff;
        background-color: #C1D7FF;
        &.inventory {
          background-color: #45C041;
        }
        &.market {
          background-color: #4B8CCE;
        }
      }
    }
  }
}
.chart{
  margin-top:20px;
  padding: 0 30px 30px;
  background-color:#fff;
}
</style>