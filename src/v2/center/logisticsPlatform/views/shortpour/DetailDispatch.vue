<template>
  <div style="padding-top: 20px;">
    <SlFormNew :list="searchList" layout="inline" @change="changeSearch" :isShowIcon='false'></SlFormNew>
    <div class="table-box">
      <div class="export-box" @click="doExport">
        <ExportIcon class="export-icon"></ExportIcon>
        <span class="export-text">数据导出</span>
      </div>
      <a-table
        :columns="columns"
        class="new-table"
        :bordered="false"
        rowKey="id"
        :dataSource="list"
        :pagination="false"
        :loading="loading"
        :scroll="{ x: true }"
      >
        <template slot="status" slot-scope="text">
          {{statusDic[text]}}
        </template>
        <div slot="action" slot-scope="text, record">
          <a-space>
            <a @click.prevent="detail(record)">查看</a>
          </a-space>
        </div>
      </a-table>
      <i-pagination 
        :pagination="pagination" 
        size="small" 
        :pageSizeOptions="['50', '100', '150', '200']" 
        :defaultPageSize='100' 
        @change="getList" 
      />
    </div>
    <a-modal
      :visible="visible"
      title="派车单详情"
      width="80%"
      @cancel="close"
      :destroyOnClose="true"
      class="slModal"
      :footer="null"

    >
      <DetailDispatchDetail :id="dispatchId"></DetailDispatchDetail>
    </a-modal>
    
  </div>
</template>

<script>
import SlFormNew from '@sub/components/ui-new/Form/sl-form'
import iPagination from "@sub/components/iPagination";
import DetailDispatchDetail from "./DetailDispatchDetail";
import {getTruckingOrderList,truckingOrderExport} from "../../api";
import comDownload from "@sub/utils/comDownload.js";
import store from "@/store";
import { ExportIcon } from '@sub/components/svg'
export default {
  props:["id"],
  components:{
    SlFormNew,
    iPagination,
    DetailDispatchDetail,
    ExportIcon
  },
  data(){
    
    return {
      columns,
      dispatchId:"",
      statusDic:{
        FIRST_WEIGH:"一次过磅",
        MARCH_OUT:"已完成"
      },
      searchList: [
        {
          decorator: ['licensePlateNumber'],
          addonBeforeTitle: '车牌号',
          type: 'input',
          placeholder: '请输入车牌号',
          allowClear:true,
        },
        {
          decorator: ['status'],
          addonBeforeTitle: '状态',
          type: 'select',
          placeholder: '请选择状态',
          allowClear:true,
          options:[
            {
              key:"FIRST_WEIGH",
              label:"一次过磅"
            },
            {
              key:"MARCH_OUT",
              label:"已完成"
            }
            
          ]
        },
      ],
      searchParams: {},
      pagination: {
        total: 0, // 总条数
        pageNo: 1,
        pageSize: 10,
      },
      loading: false,
      visible:false,
      list:[]
    }
  },
  mounted(){
    this.getList();
  },
  methods:{
    getList(pageNo = this.pagination.pageNo, pageSize = this.pagination.pageSize) {
      this.loading = true;
      getTruckingOrderList({pageNo,pageSize,...this.searchParams,type:"SHORT",planId:this.id}).then(({success,data}) => {
        this.loading = false;
        if(!success){
          return
        }
        this.list = data.records;
        this.pagination.total = data.total
        this.pagination.pageSize = pageSize
        this.pagination.pageNo = pageNo
      })
    },
    changeSearch(info){
      this.searchParams = info;
      this.pagination.pageNo = 1;
      this.getList();
    },
    detail(record){
      this.visible = true;
      this.dispatchId = record.id

    },
    close(){
      this.visible = false;
      this.dispatchId = "";
    },
    doExport(){
      truckingOrderExport({planId:this.id,planType:"SHORT",...this.searchParams}).then((res) => {
        comDownload(res.data, null,res.name)
      })
    },
    back(){
      this.$router.back();
    }
  }
}

const columns = [
{ title: "编号", dataIndex: "serialNo", key: "serialNo", },
{ title: "车牌号", dataIndex: "licensePlateNumber", key: "licensePlateNumber", },
{ title: "毛重(吨)", dataIndex: "grossWeight", key: "grossWeight", },
{ title: "净重(吨)", dataIndex: "netWeight", key: "netWeight", },
{ title: "货重(吨)", dataIndex: "goodsWeight", key: "goodsWeight", },
{ title: "到站", dataIndex: "sendStation", key: "sendStation", },
{ title: "状态", dataIndex: "status", key: "status", scopedSlots: { customRender: "status" } },
{ title: "派车时间", dataIndex: "createdDate", key: "createdDate", },
{ title: "司机", dataIndex: "driverName", key: "driverName", },
{ title: "联系电话", dataIndex: "driverMobile", key: "driverMobile", },
{ title: "操作", dataIndex: "操作", key: "操作", fixed: 'right', scopedSlots: { customRender: "action" } },
]
</script>

<style lang="less" scoped>
@import url("~@/v2/style/table-cover.less");
</style>
<style lang="less" scoped>
.table-box {
    position: relative;
    margin-top: 30px;
    .export-box {
      position: absolute;
      right: 0;
      top: -25px;
      text-align: right;
      cursor: pointer;
      .export-icon {
        width: 14px;
        height: 14px;
        margin-right: 5px;
        position: relative;
        top: 1px;
      }
      .export-text {
        font-family: PingFangSC-Regular, PingFang SC;
        color: @primary-color;
        line-height: 20px;
      }
    }
  }
</style>