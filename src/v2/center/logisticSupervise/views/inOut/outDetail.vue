<template>
  <div  class="slMain">
    <Breadcrumb :type="type"></Breadcrumb>
    <InOutDetail 
       :getInOutDetailList='getInOutDetailList' 
       :detailInfo='detailInfo' 
       :logList='logList'
       @handlePreview='handlePreview'
       @download='download'
       :type='type'
       @goGoods='goGoods'
       @goContract='goContract'
       @goReleaseInstruct='goReleaseInstruct'
      @goCoalplan='goCoalplan'
       @exportDetailData='exportDetailData'
       @goInOutDetail='goInOutDetail'
       @openBusinessLine="openBusinessLine"
       :isCoreCompany="isCoreCompany"
       :isManager="isManager"
      ></InOutDetail>
     <ImageViewer ref="imageViewer" />
  </div>
</template>

<script>
import Breadcrumb from "@/v2/components/breadcrumb/index";
import { getInOutDetailList, getInOutLogList, getInOutDetail, exportInOutDetailList, downloadFile} from "@/v2/center/logisticsPlatform/api/inout";
import InOutDetail from './components/InOutDetail.vue'
import comDownload from "@sub/utils/comDownload.js";
import moment from 'moment'
import { mapGetters } from "vuex";
import ImageViewer from '@sub/components/viewer/image.vue';

export default {
  data() {
    return {
       previewImg: '',
       detailInfo: {
       },
       logList: [],
       type: 'OUT',
    }
  },
  computed: {
    ...mapGetters("user", {
      VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER',
      VUEX_COMPANY_SERVICES: 'VUEX_COMPANY_SERVICES',
    }),
    isCoreCompany(){
      return this.VUEX_ST_COMPANYSUER?.company?.companyType  == 'CORE_COMPANY'
    },
    //是否是站台管理服务
    isManager(){
      return this.VUEX_COMPANY_SERVICES.includes("LOGISTICS_STATION_MANAGE");
    },
  },
  created(){
  },
  mounted() {
    this.getLogList()
    this.getDetail()
  },
  methods: {
    getInOutDetailList,
    // 获取操作记录
    async getLogList() {
       const params = {
        receiveSerialNo: this.$route.query.receiveSerialNo,
        id: this.$route.query.id,
        source: 'LOGIC_DELIVER'
      }
       const res = await getInOutLogList(params)
       this.logList = res.data || []
    },
    async getDetail() {
      const params = {
        id: this.$route.query.id,
        source: 'LOGIC_DELIVER'
      }
      const res = await getInOutDetail(params)
      this.detailInfo = res.data || {}
           if(this.detailInfo.receiveNo) {
        this.detailInfo.receiveNoList = this.detailInfo.receiveNo.split(',')
      }
    },
    handlePreview (data) {
      let url = data?.url
      if (!url) return
      this.$refs.imageViewer.showFile(url);
    },
    async exportDetailData(item) {
      const res = await exportInOutDetailList({...item, source: "LOGIC_DELIVER"})
      const name = `${this.type == 'IN' ? '入' : '出'}库明细-${moment().format('YYYY-MM-DD')}.xls`
      comDownload(res, undefined, name)
    },
    async download(item) {

      const params = {
        fileList: item.list.map(el => {
          return {
            name: el.name,
            path: el.path,
          }
        })
      }
      let name = ''
      if(item.list.length == 1) {
        name = item.list[0].name
      } else {
        name = `${this.type == 'IN' ? '入库附件' : '出库附件'}.zip`
      }
      const res = await downloadFile(params)
      comDownload(res, undefined, name)
      
    },
    // 去往合同
    goContract(info) {
      let contractType  = this.type == 'IN' ? 'BUY' : 'SELL'
      let path = `/center/logisticSupervise/contract/transport/detail?id=${info.contractId}&type=${contractType}`


      window.open(path)
    },
    // 放货指令详情
    goReleaseInstruct(info) {
      if(!info) {
        return;
      }
      let path = `/center/ladingbill/delivery/detail?id=${info.releaseInstructId}`;
      window.open(path)
    },
    // 关联收货编号 关联发货编号
    goGoods(info) {
      let path = `/center/logisticSupervise/receive/send/detail?deliverId=${info.receiveId}&from=receive`
      window.open(path)
    },
    // 去往上下煤计划
    goCoalplan(info) {

      let path = `/center/logisticsPlatform/coalplan/IN/detail?id=${info.coalPlanId}&contractType=${info.contractType}`
      if(this.type == 'OUT') {
        path = `/center/logisticsPlatform/coalplan/OUT/detail?id=${info.coalPlanId}&contractType=${info.contractType}`
      }
      window.open(path)
    },
    // 出入库流水号明细
    goInOutDetail(item) {

      let query = {
        id:item.id,
        type: this.type,
      }
      if(item.transportMode == "AUTOMOBILE"){
        this.$router.push({
          path:`/center/logisticSupervise/${this.type}/records/detail?type=${this.type}`,
          query
        })
        return 
      }
      if(item.transportMode == "TRAIN"){
        this.$router.push({
          path:`/center/logisticSupervise/${this.type}/records/train/detail?type=${this.type}`,
          query
        })
        return
      }
    },
    openBusinessLine(data){
      const {upOrderNo,downOrderNo,type,businessLineNo} = data
      let query = `?upOrderNo=${upOrderNo}&downOrderNo=${downOrderNo}&businessLineType=${type}&businessLineNo=${businessLineNo}&contractType=0`
      window.open(`/center/monitoring/dynamicMonitoring/detail${query}`,"_blank")
    }

  
  },
  components: {
    Breadcrumb,
    InOutDetail,
    ImageViewer

  }
}
</script>

<style scoped  lang='less' >

</style>
