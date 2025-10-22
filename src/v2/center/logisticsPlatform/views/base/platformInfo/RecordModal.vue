<template>
  <a-modal 
    :visible="visible" 
    title="操作记录" 
    class="slModal"
    width="1130px"
    size="small"
    :footer="null"
    @cancel="cancel"
    destroyOnClose
  >
    <a-table
      class="new-table"
      :bordered="false"
      :columns="columns"
      :rowKey="(record) => record.id"
      :dataSource="dataSource"
      :pagination="false"
      :loading="loading"
      :scroll="{ x: 1080 }"
    ></a-table>
  </a-modal>
</template>
<script>
import {getOperationLogById} from "../../../api/contract";
const columns = [
  {
    title: "操作类型",
    key: "optType",
    dataIndex: "optType",
  },
  {
    title: "操作人",
    key: "optCompanyUserName",
    dataIndex: "optCompanyUserName",
  },
  {
    title: "所属公司",
    key: "optCompanyName",
    dataIndex: "optCompanyName",
  },
  {
    title: "操作内容",
    key: "remark",
    dataIndex: "remark",
  },
  {
    title: "操作时间",
    key: "createdDate",
    dataIndex: "createdDate",
  },
]
export default {
  data(){
    return {
      visible:false,
      loading:false,
      dataSource:[],
      id:"",
      columns
    }
  },
  mounted(){
    
  },
  methods:{
    doFetch(){
      this.loading = true
      getOperationLogById(this.id).then(({success,data}) => {
        if(!success){
          return;
        }
        this.loading = false;
        this.dataSource = data;
      })
    },
    show(id){
      this.id = id;
      this.visible = true;
      this.doFetch();
    },
    cancel(){
      this.id = "";
      this.visible = false
    }
  }
}
</script>
<style lang="less" scoped>
  .new-table{
    ::v-deep{
      .ant-table-column-title{
        color:#8B9DB8;
        font-size:14px;
      }
    }
  }
</style>