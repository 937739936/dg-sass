<template>
  <div class="table-box">
    <a-table
      class="new-table"
      :bordered="false"
      :columns="columns"
      :rowKey="(record) => record.id"
      :dataSource="data"
      :pagination="false"
      :loading="loading"
      :scroll="{ x: true }"
    >
      <template slot="remark" slot-scope="remark">
        <a-tooltip>
          {{(remark||"").substr(0,20)}}
          <template slot="title" v-if="(remark||'').length >20">{{remark}}</template>
          <template v-if="(remark||'').length >20">....</template>
        </a-tooltip>
      </template>
    </a-table>
  </div>
</template>

<script>
import {
  getEquipmentScalePrinterList,
} from "../../../api";
const columns = [
  {
    title: "打印机名称",
    key: "name",
    dataIndex: "name",
  },
  {
    title: "备注",
    key: "remark",
    dataIndex: "remark",
    scopedSlots: { customRender: "remark" },
  },
]
export default {
  props:["id"],
  data(){
    return {
      columns,
      data:[],
      loading:true
    }
  },
  mounted(){
    this.getEquipmentScalePrinterList();
  },
  methods:{
    //已关联打印机信息
    getEquipmentScalePrinterList(){
      getEquipmentScalePrinterList({scaleId:this.id}).then(({success,data}) => {
        this.loading = false;
        if(!success){
          return
        }
        this.data = data;
      })
    },
  }
}
</script>

<style lang="less" scoped>
@import url("~@/v2/style/table-cover.less");
</style>