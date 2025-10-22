<template>
  <div class="slMain">
    <Breadcrumb/>
    <a-spin :spinning="loading">
      <a-card :bordered="false">
        <div class="methods-wrap">
          <span class="slTitle">{{typestr}}库详情</span>
        </div>
        <div class="slTitleAssis">基本信息</div>
        <a-descriptions bordered>
          <a-descriptions-item label="运输方式">{{data.transportModeText}}</a-descriptions-item>
          <a-descriptions-item :label="typestr+'库日期'">{{data.storageDate}}</a-descriptions-item>
          <a-descriptions-item :label="typestr+'库重量(吨)'">{{data.weight}}</a-descriptions-item>
          <template v-if="data.transportMode === 'TRAIN'">
            <a-descriptions-item label="煤种">{{data.coalType}}</a-descriptions-item>
            <a-descriptions-item label="发站">{{data.sendStation}}</a-descriptions-item>
            <a-descriptions-item label="到站">{{data.arriveStation}}</a-descriptions-item>
            <a-descriptions-item label="车数">{{data.trainNumber}}</a-descriptions-item>
            <a-descriptions-item label="发货人">{{data.deliverName}}</a-descriptions-item>
            <a-descriptions-item label="车次">{{data.trainNo}}</a-descriptions-item>
          </template>
          <template v-if="data.transportMode === 'SHIP'">
            <a-descriptions-item label="起运港">{{data.sendStation}}</a-descriptions-item>
            <a-descriptions-item label="到达港">{{data.arriveStation}}</a-descriptions-item>
            <a-descriptions-item label="船名">{{data.shipName}}</a-descriptions-item>
            <a-descriptions-item label="航次">{{data.trainNo}}</a-descriptions-item>
            <a-descriptions-item label="托运人">{{data.shipper}}</a-descriptions-item>
            <a-descriptions-item label="收货人">{{data.deliverName}}</a-descriptions-item>
          </template>
        </a-descriptions>
        <template v-if="type === 'IN'">
        
        <div class="slTitleAssis">入库明细</div>
          <div class="table-box">
            <a-table
              class="new-table"
              :bordered="false"
              :columns="columns"
              :rowKey="uid"
              :dataSource="data.items"
              :pagination="false"
              :scroll="{ x: true }"
            >
            ></a-table>
          </div>
        </template>
        <div class="slTitleAssis">附件信息</div>
        <div style="width:100%;margin-top:20px;">
          <AttachmentInfo :datasource="this.data.attachments"/>
        </div>
      </a-card>
    </a-spin>
  </div>
</template>
<script>
import {getTrainRecordDetail} from "../../api";
import AttachmentInfo from "@/v2/center/logisticsPlatform/components/AttachmentInfo";
import Breadcrumb from "@/v2/components/breadcrumb/index";
export default {
  components:{
    AttachmentInfo,
    Breadcrumb
  },
  data(){
    let {id,view,type} = this.$route.query;
    return {
      id,
      view,
      type,
      typestr:type=='IN'?'入':'出',
      columns,
      data:{},
      loading:false
    }
  },
  mounted(){
    this.doFetch();
  },
  methods:{
    doFetch(){
      this.loading = true;
      getTrainRecordDetail({id:this.id}).then((res) => {
        if(!res.success){
          return
        }
        this.data = res.data||{};
      }).finally(() => {
        this.loading = false;
      })
      
    },
    uid(){
      return Math.random().toString(36).slice(2);
    },
    asyncFn(fn){
      return new Promise((reslove) => {
        fn(reslove)
      })
    }
  }
}
const columns =  [
  {title: "仓房",key: "houseName",dataIndex: "houseName",},
  {title: "货位",key: "goodsAllocation",dataIndex: "goodsAllocation",},
  {title: "入库重量(吨)",key: "weight",dataIndex: "weight",},
]

</script>
<style lang="less" scoped>
@import url("~@/v2/style/table-cover.less");
</style>
