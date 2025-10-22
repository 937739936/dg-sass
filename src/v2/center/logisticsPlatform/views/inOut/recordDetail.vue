<template>
  <div class="slMain">
    <Breadcrumb/>
    <a-spin :spinning="loading">
      <a-card :bordered="false">
        <div class="methods-wrap">
          <span class="slTitle">{{typestr}}库详情</span>
          <a-button 
            v-if="data.generateType == 'WEIGH_CLIENT' && VUEX_ST_COMPANYSUER.company.companyType == 'CORE_COMPANY'" 
            type="primary" 
            @click="edit"
          >编辑</a-button>          
        </div>

        <div class="slTitleAssis">计划信息</div>
        <ul class="grid-wrap">
          <li>
            <span class="label">{{type == 'IN'?'上煤计划编号':'下煤计划编号'}}</span>
            <span>{{data.coalPlanNo||"-"}}</span>
          </li>
          <li>
            <span class="label">合同编号</span>
            <span>
              <a href="javascript:;" @click="goContract">{{data.contractNo||"-"}}</a>
            </span>
          </li>
          <li>
            <span class="label">{{type == 'IN'?'入库日期':'出库时间'}}</span>
            <span>{{data.storageDate}}</span>
          </li>
          <li>
            <span class="label">煤种</span>
            <span>{{data.coalType}}</span>
          </li>
          <li>
            <span class="label">运输方式</span>
            <span>{{data.transportModeText}}</span>
          </li>
          <li>
            <span class="label">派车方式</span>
            <span>{{data.generateTypeDesc}}</span>
          </li>
          <li>
            <span class="label">发货单位</span>
            <span>{{data.deliveryCompanyName}}</span>
          </li>
          <li>
            <span class="label">收货单位</span>
            <span>{{data.receivingCompanyName}}</span>
          </li>
          <li>
            <span class="label">仓房</span>
            <span>{{data.houseName}}</span>
          </li>
          <li>
            <span class="label">货位</span>
            <span>{{data.goodsAllocation}}</span>
          </li>
          <li>
            <span class="label">{{type == 'IN'?'发站':'到站'}}</span>
            <span>{{data.sendStation || '-'}}</span>
          </li>
          <li v-if="type =='OUT'">
            <span class="label">卸货电话</span>
            <span>{{data.unloadedMobile||'-'}}</span>
          </li>
          <li v-if="data.actualLadingUnit">
            <span class="label">实际提货单位</span>
            <span>{{data.actualLadingUnit||'-'}}</span>
          </li>
          <li v-if="data.actualReceivingUnit">
            <span class="label">实际收货单位</span>
            <span>{{data.actualReceivingUnit||'-'}}</span>
          </li>
          <li v-if="data.generateType == 'WEIGH_CLIENT'">
            <template>
              <span class="label">同步原因</span>
              <span>{{ data.syncReason }}</span>
            </template>
            <!-- <template v-else>
              <span class="label"></span>
              <span></span>
            </template> -->
          </li>
          <li v-else-if="type =='IN' || data.actualLadingUnit">
            <span class="label"></span>
            <span></span>
          </li>
        </ul>

        <div class="slTitleAssis">车辆信息</div>
        <ul class="grid-wrap">
          <li>
            <span class="label">车牌号</span>
            <span>{{weightInfo.licensePlateNumber||'-'}}</span>
          </li>
          <li>
            <span class="label">司机姓名</span>
            <span>{{weightInfo.driverName||'-'}}</span>
          </li>
          <li>
            <span class="label">司机电话</span>
            <span>{{weightInfo.driverMobile||'-'}}</span>
          </li>
        </ul>

        <div class="slTitleAssis">称重信息</div>
        <ul class="grid-wrap">
          <li>
            <span class="label">{{typestr}}库净重(吨)</span>
            <span class="red">{{weightInfo.netWeight||'-'}}</span>
          </li>
          <li>
            <span class="label">{{typestr}}库毛重(吨)</span>
            <span>{{weightInfo.grossWeight||'-'}}</span>
          </li>
          <li>
            <span class="label">{{typestr}}库皮重(吨)</span>
            <span>{{weightInfo.tareWeight||'-'}}</span>
          </li>
          <li v-if="type=='IN'">
            <span class="label">矿发净重(吨)</span>
            <span>{{weightInfo.loadingWeight||'-'}}</span>
          </li>
          <li v-if="type=='IN'">
            <span class="label">亏损(吨)</span>
            <span>{{weightInfo.lossWeight||'-'}}</span>
          </li>
          <li v-if="type=='IN'">
            <span class="label">扣水、杂(吨)</span>
            <span>{{weightInfo.otherWeight||'-'}}</span>
          </li>
          <li v-if="type=='IN'">
            <span class="label">矿发磅单</span>
            <span class="images special" v-if="weightInfo.loadingTicket">
              <div class="image">
                <img :src="imgUrl(weightInfo.loadingTicket)" alt="矿发磅单" @click="handlePreview(imgUrl(weightInfo.loadingTicket))">
              </div>
            </span>
            <span v-else>/</span>
          </li>
          <li v-if="type=='IN'">
            <span class="label">矿发时间</span>
            <span>{{weightInfo.loadingDate||'-'}}</span>
          </li>
          <li>
            <span class="label">过毛时间</span>
            <span>{{weightInfo.grossWeightTime}}</span>
          </li>
          <li>
            <span class="label">过皮时间</span>
            <span>{{weightInfo.tareWeightTime}}</span>
          </li>
          <li>
            <span class="label">场收员</span>
            <span>{{weightInfo.unloadingName||'-'}}</span>
          </li>
          <li v-if="type=='IN'">
            <span class="label"></span>
            <span></span>
          </li>
        </ul>
        <div class="table-box">
          <a-table
            class="new-table"
            style="margin-top:20px;"
            :bordered="false"
            :columns="columns"
            :rowKey="(record,index) => String(index)"
            :dataSource="weighRecords"
            :pagination="false"
            :scroll="{ x: true }"
          >
            <template slot="images" slot-scope="truckPic, record">
              <div class="images">
                <div class="image" v-for="(item,index) in record.attachList" :key="index">
                  <img :src="item.url" :alt="item.typeDesc" @click="handlePreview(item.url)">
                </div>
              </div>
            </template>
          </a-table>
        </div>
      </a-card>
      <div class="btns">
        <a-button style="width:100px"  @click="goback" >返回</a-button>
      </div>
    </a-spin>
    <img :src="previewImg" style="display: none" ref="viewer" v-viewer /> 
    <InDetailEdit ref="inDetailEdit" :id="id" @reload="doFetch" v-if="type=='IN'"></InDetailEdit>
    <OutDetailEdit ref="outDetailEdit" :id="id" @reload="doFetch" v-if="type=='OUT'"></OutDetailEdit>
  </div>
</template>
<script>
import ENV from '@/v2/config/env'
import {getAutoMobileRecordDetail} from "../../api";
import Breadcrumb from "@/v2/components/breadcrumb/index";
import InDetailEdit from "./components/InDetailEdit.vue";
import OutDetailEdit from "./components/outDetailEdit.vue";
import { mapGetters } from "vuex";
export default {
  components:{
    Breadcrumb,
    InDetailEdit,
    OutDetailEdit
  },
  data(){
    let {type,id} = this.$route.query;
    return {
      id,
      type,
      typestr:type=='IN'?'入':'出',
      columns,
      weightInfo:{},
      weighRecords:[],
      data:{},
      loading:false,
      previewImg:""
    }
  },
  computed: {
    ...mapGetters('user', {
      VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER',
    }),
  },
  mounted(){
    this.doFetch();
  },
  methods:{
    edit(){
      if(this.type == "IN"){
        this.$refs.inDetailEdit.show({data:this.data,weightInfo:this.weightInfo})
      }else if(this.type == "OUT"){
        this.$refs.outDetailEdit.show({data:this.data,weightInfo:this.weightInfo})
      }
      
    },
    doFetch(){
      this.loading = true;
      getAutoMobileRecordDetail({id:this.id}).then((res) => {
        if(!res.success){
          return
        }
        let {weightInfo,...data} = res.data ||{};
        let {weighRecords,...weightInfoData} = weightInfo||{};
        this.data = data;
        this.weightInfo = weightInfoData ||{};
        this.weighRecords = weighRecords ||[];
      }).finally(() => {
        this.loading = false;
      });
    },
    imgUrl(url){
      if(/^http/.test(url)) {
        return url
      }
    },
    handlePreview(src){
      this.previewImg = src;
      this.$refs.viewer.$viewer.show();
    },
    goback(){
      this.$router.go(-1);
    },
    goContract() {
      if(!this.data.contractId) {
        return;
      }
      let contractType  = this.type == 'IN' ? 'BUY' : 'SELL'
      let path = `/center/contract/${contractType.toLowerCase()}/online/detail?id=${this.data.contractId}&type=${contractType}`
      if(this.data.contractType == 'OFFLINE') {
        path = `/center/contract/${contractType.toLowerCase()}/offline/detail?id=${this.data.contractId}&type=${contractType.toLowerCase()}`
      }
      window.open(path)
    }
  }
}

const columns = [
  {
    title: "过磅地址",
    key: "scaleNo",
    dataIndex: "scaleNo",
  },
  {
    title: "过磅次数",
    key: "weighCounterText",
    dataIndex: "weighCounterText",
  },
  {
    title: "司磅员",
    key: "weighName",
    dataIndex: "weighName",
  },
  {
    title: "过磅图片",
    key: "truckPic",
    dataIndex: "truckPic",
    scopedSlots: { customRender: "images" },
  },
]
</script>
<style lang="less" scoped>
@import url("~@/v2/style/table-cover.less");
</style>
<style lang="less" scoped>
.btns{
  margin-top:20px;
  display:flex;
  justify-content:center;
  align-items:center;
}
.images{
  display:flex;
  margin-top: 4px;
  .image{
    margin-right:5px;
    width:40px;
    height:40px;
    cursor: pointer;
    &:last-child{
      margin-right:0;
    }
    img{
      width: 100%;
      height:100%;
      vertical-align: top;
    }
  }
}
.special.images {
  display:flex!important;
  justify-content: center;
  margin-top: 0;
  align-items: center;
}
.grid-wrap {
  margin-top: 20px;
  width: 100%;
  border-radius: 3px;
  height: auto;
  overflow: hidden;
  border-left: 1px solid #E5E6EB;
  li {
    width: 33.3%;
    height: 48px;
    float: left;
    border-bottom: 1px solid #E5E6EB;
    border-right: 1px solid #E5E6EB;
    overflow: hidden;
    position: relative;
    span {
      display: inline-block;
      height: 48px;
      line-height: 48px;
      padding: 0 12px;
      text-align: center;
    }
    &>span:first-child {
      border-right: 1px solid #E5E6EB;
    }
    .label{
      width: 120px;
      background: #F3F5F6;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #77889D;
      position: absolute;
      left: 0;
      top: 0;
    }
    span:last-child{
      width: 100%;
      padding-left: 132px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  li:nth-child(1),li:nth-child(2), li:nth-child(3) {
    border-top: 1px solid #E5E6EB;
  }
  li:nth-child(3){
    border-radius: 0 3px 0 0;
  }
  li:last-child {
    border-radius: 0 0 3px 0;
  }
  li.special {
    border-radius: 0 3px 3px 0;
  }
}
.red {
  color:#f5222d;
}
</style>
