<template>
  <div>
    <a-descriptions :title="detail.licensePlateNumber"  bordered :columns="2">
      <a-descriptions-item label="毛重(吨)">{{defaultText(detail.grossWeight)}}</a-descriptions-item>
      <a-descriptions-item label="过毛时间">{{defaultText(detail.grossWeightTime)}}</a-descriptions-item>
      <a-descriptions-item label="皮重(吨)">{{defaultText(detail.tareWeight)}}</a-descriptions-item>
      <a-descriptions-item label="过皮时间">{{defaultText(detail.tareWeightTime)}}</a-descriptions-item>
      <a-descriptions-item label="净重(吨)">{{defaultText(detail.netWeight)}}</a-descriptions-item>
      <a-descriptions-item label="箱重(吨)">{{defaultText( detail.containerWeight )}}</a-descriptions-item>
      <a-descriptions-item label="货重(吨)">{{defaultText( detail.goodsWeight )}}</a-descriptions-item>
    </a-descriptions>
    <a-table
      style="margin-top:20px;"
      :columns="columns"
      class="new-table new-table2"
      :bordered="false"
      rowKey="weighDate"
      :dataSource="detail.weighRecords||[]"
      :pagination="false"
      :scroll="{ x: true }"
    >
      <template slot="title">
        <span style="font-weight:bold;font-size:16px;color:rgba(0, 0, 0, 0.85)">称重信息</span>
      </template>
      <template slot="images" slot-scope="truckPic, record">
        <div class="images">
          <div class="image" v-for="(item,index) in record.attachList" :key="index">
            <img :src="item.url" :alt="item.typeDesc" @click="handlePreview(item.url)">
          </div>
        </div>
      </template>
      <template slot="weighCounter" slot-scope="text, record">
        <span v-if="text == 1">第一次过磅</span>
        <span v-else-if="text == 2">第二次过磅</span>
        <span v-else>-</span>
      </template>
    </a-table>
    <img :src="previewImg" style="display: none" ref="viewer" v-viewer /> 
  </div>
</template>

<script>
import {
  getTruckingOrderDetail,
} from "../../api";
export default {
  props:["id"],
  data(){
    return {
      columns,
      previewImg:"",
      detail:{}
    }
  },
  mounted(){
    this.getTruckingOrderDetail();
  },
  watch:{
    
  },
  methods:{
    getTruckingOrderDetail(){
      if(!this.id){
        this.detail = {};
        return
      }
      getTruckingOrderDetail({id:this.id}).then((result) => {
        if(!result.success){
          return
        }
        this.detail = result.data;
      })
    },
    handlePreview(src){
      this.previewImg = src;
      this.$refs.viewer.$viewer.show();
    },
    defaultText(val){
      if(val === 0){
        return val;
      }
      return val||"--"
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
    key: "weighCounter",
    dataIndex: "weighCounter",
    scopedSlots: { customRender: "weighCounter" },
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
.images{
  display:flex;
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
    }
  }
}
</style>