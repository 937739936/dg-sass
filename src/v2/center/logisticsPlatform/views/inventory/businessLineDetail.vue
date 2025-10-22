<template>
  <div class="slMain">
    <Breadcrumb />
      <div class="methods-wrap" >
        <span class="slTitle">业务台账详情</span>
        <a-button type="primary" @click="toMonitor">查看监控</a-button>
      </div>
      <BusinessLineDetail 
        :requestDetail="doFetchDetail" 
        :requestChart="requestChart"
        :exportChart="exportChart"
        :requestRisk="{
          requestCount:countQueryByBusinessLine,
          requestList:getBusinessLineRiskPage
        }"
        @openBusinessLine="openBusinessLine"
        @toRecord="toRecord"
        @warningDetail="warningDetail"
        @goContract="goContract"
      ></BusinessLineDetail>
  </div>
</template>
<script>
import Breadcrumb from "@/v2/components/breadcrumb/index";
import BusinessLineDetail from "@sub/logisticsPlatform/BusinessLineDetail"
import {
  getBusinessLineDetail,
  getOverviewEcharts,
  exportBusinessLineEchart,
  countQueryByBusinessLine,
  getBusinessLineRiskPage
} from "../../api/inventory";
import downlodFile from '@/v2/utils/download.js'
import qs from "qs"
export default {
  components:{
    Breadcrumb,
    BusinessLineDetail
  },
  data(){
    let {businessLineNo,companyCreditCode} = this.$route.query
    return {
      loading:false,
      businessLineNo,
      companyCreditCode
    }
  },
  mounted(){
    this.doFetchDetail();
  },
  methods:{
    countQueryByBusinessLine(){
      return countQueryByBusinessLine({businessLineNo:this.businessLineNo})
    },
    getBusinessLineRiskPage(data){
      return getBusinessLineRiskPage(data)
    },
    doFetchDetail(){
      return getBusinessLineDetail({businessLineNo:this.businessLineNo,companyCreditCode:this.companyCreditCode})
    },
    requestChart(startDate,endDate){
      return getOverviewEcharts({startDate,endDate,businessLineNo:this.businessLineNo})
    },
    exportChart(startDate,endDate){
      this.lineLoading = true;
      downlodFile(exportBusinessLineEchart,{startDate,endDate,businessLineNo:this.businessLineNo},"GET",() => {
        this.lineLoading = false;
      })
    },
    openBusinessLine(data){
      const {upOrderNo,downOrderNo,type,businessLineNo} = data.businessLineInfo
      let query = `?upOrderNo=${upOrderNo}&downOrderNo=${downOrderNo}&businessLineType=${type}&businessLineNo=${businessLineNo}&contractType=0`
      window.open(`/center/monitoring/dynamicMonitoring/detail${query}`,"_blank")
    },
    toMonitor(){
      this.$router.push({
        path:"/center/logisticsPlatform/monitorList"
      })
    },
    toRecord({type,startDate,endDate}){
      let query = {storageStartDate:startDate,storageEndDate:endDate,businessLineNo:this.businessLineNo}
      let url = `/center/logisticsPlatform/${type.toLowerCase()}/list?`+qs.stringify(query);
      window.open(url, '_blank');
      
    },
    warningDetail(record){
      let path = record.alertType === 'YJZS' ? '/center/message/riskControlCertDetail': '/center/message/riskControlDetail' 
      if(record.alertType === 'YJSXT') {
        path = '/center/message/facilityDetail'
      }
      this.$router.push({
        path,
        query: {
          id: record.id,
        },
      });
    },
    goContract(contractType,data){
      let type = '',id='';
      if(contractType === 'BUY'){
        type = data.upContractType
        id = data.upOrderId
        if(type == 'OFFLINE'){
          id = data.upContractId
        }
      }else{
        type = data.downContractType
        id = data.downOrderId
        if(type == 'OFFLINE'){
          id = data.downContractId
        }
      }
      let path = `/center/contract/${contractType.toLowerCase()}/online/detail?id=${id}&type=${contractType}`
      if(type == 'OFFLINE') {
        path = `/center/contract/${contractType.toLowerCase()}/offline/detail?id=${id}&type=${contractType.toLowerCase()}`
      }
      window.open(path)
    }
  }
}
</script>
<style lang="less" scoped>
.methods-wrap{
  padding:30px;
  background-color:#fff;
  border-bottom: 0;
}
</style>