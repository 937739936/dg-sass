<template>
  <div class="slMain">
    <a-card :bordered="false">
      <div class="methods-wrap">
        <span slot="title" class="slTitle">下煤短倒记录</span>
      </div>
      <SlFormNew :list="searchList" layout="inline" @change="changeSearch" :isShowIcon='false' style="margin-bottom:40px"></SlFormNew>
      <div class="table-box"  > 
        <div class="export-box" @click="doExport" >
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
        </a-table>
      </div>
      <i-pagination 
        :pagination="pagination" 
        size="small" 
        :pageSizeOptions="['10','50', '100', '150', '200']" 
        :defaultPageSize='10' 
        @change="getList" 
      />
    </a-card>
  </div>
</template>

<script>
import SlFormNew from '@sub/components/ui-new/Form/sl-form'
import iPagination from "@sub/components/iPagination";
import {shortPourRecords,doExportShortPourRecords} from "../api/shortPour"
import comDownload from "@sub/utils/comDownload.js";
import { ExportIcon } from '@sub/components/svg'
export default {
  components: {
    SlFormNew,
    iPagination,
    ExportIcon
  },
  data(){
    return {
      columns,
      searchList: [
        {
          decorator: ['serialNo'],
          addonBeforeTitle: '过磅单号',
          type: 'input',
          placeholder: '请输入过磅单号',
          allowClear:true,
        },
        {
          decorator: ['licensePlateNumber'],
          addonBeforeTitle: '车牌号',
          type: 'input',
          placeholder: '请输入车牌号',
          allowClear:true,
        },
        {
          decorator: ['sendStation'],
          addonBeforeTitle: '到站',
          type: 'input',
          placeholder: '请输入到站',
          allowClear:true,
        },
        {
          decorator: ['createdDate'],
          addonBeforeTitle: '过磅日期',
          realKey: ['startDate', 'endDate'],
          type: 'rangePicker',
          placeholder: ['开始日期', '结束日期'],
          allowClear:true,
        },
      ],
      searchParams: {},
      pagination: {
        total: 0, // 总条数
        pageNo: 1,
        pageSize: 10,
      },
      loading: false,
      list:[]
    }
  },
  mounted(){
    this.getList();
  },
  methods:{
    getList(pageNo = this.pagination.pageNo, pageSize = this.pagination.pageSize) {
      let params = {...this.searchParams};
      if(params.startDate){
        params.startDate = params.startDate + " 00:00:00"
      }
      if(params.endDate){
        params.endDate = params.endDate + " 23:59:59"
      }
      shortPourRecords({pageNo,pageSize,...params}).then(({success,data}) => {
        if(!success){
          return;
        }
        this.list = data.records;
        this.pagination.total = data.total
        this.pagination.pageSize = pageSize
        this.pagination.pageNo = pageNo
      });
    },
    changeSearch(info){
      this.searchParams = info
      this.pagination.pageNo = 1
      this.getList()
    },
    doExport(){
      let params = {...this.searchParams}
      if(params.startDate){
        params.startDate = params.startDate + " 00:00:00"
      }
      if(params.endDate){
        params.endDate = params.endDate + " 23:59:59"
      }
      doExportShortPourRecords(params).then((res) => {
        comDownload(res.data, null,res.name)
      })
    },
  }
}
const columns = [
  { title: "过磅单号", dataIndex: "serialNo", key: "serialNo", },
  { title: "过磅日期", dataIndex: "firstWeightDate", key: "firstWeightDate", },
  { title: "车牌号", dataIndex: "licensePlateNumber", key: "licensePlateNumber", },
  { title: "到站", dataIndex: "sendStation", key: "sendStation", },
  { title: "煤种", dataIndex: "coalType", key: "coalType", },
  { title: "净重(KG)", dataIndex: "netWeight", key: "netWeight", },
  { title: "货运员", dataIndex: "transportName", key: "transportName", },
]
</script>

<style lang="less" scoped>
@import url("~@/v2/style/table-cover.less");
</style>
<style lang="less" scoped>
.slMain {
  margin-top: -10px;
}
.export-icon {
    width: 14px;
    height: 14px;
    margin-right: 5px;
    position: relative;
    top: 1px!important;
  }
</style>