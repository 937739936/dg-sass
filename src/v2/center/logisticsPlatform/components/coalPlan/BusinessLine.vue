<template>
  <div class="business-line">
    <div class="slTitleAssis">业务线信息</div>
    <a-table
      class="new-table"
      :bordered="false"
      :columns="columns"
      :rowKey="(record) => record.businessLineNo"
      :dataSource="dataSource"
      :pagination="false"
      :scroll="{ y:dataSource.length > 5 ?210:false }"
      :customRow="onClickRow"
      :rowSelection="action =='view'?null:{type:'radio',onChange:onSelected,selectedRowKeys:selectedRowKeys}"
    >
      <template slot="businessLineNo" slot-scope="text,record">
        <a @click="openTab(record)" v-if="isCoreCompany">{{ text }}</a>
        <span v-else>{{ text }}</span>
      </template>
    </a-table>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
const columns = [
  {
    title: "业务线号",
    key: "businessLineNo",
    dataIndex: "businessLineNo",
    width:200,
    scopedSlots: { customRender: "businessLineNo" },
  },
  {
    title: "业务线名称",
    key: "businessLineName",
    dataIndex: "businessLineName",
  },
]
export default {
  props:["type","action"],
  data(){
    return {
      columns,
      tableLoading:false,
      dataSource:[],
      selectedRowKeys:[],
    }
  },
  computed: {
    ...mapGetters("user", {
      VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER'
    }),
    isCoreCompany(){
      return this.VUEX_ST_COMPANYSUER?.company?.companyType  == 'CORE_COMPANY'
    }
  },
  created(){
    if(this.type == "IN"){
      this.columns[2] = {
        title: "下游销售合同编号",
        key: "downContractNo",
        dataIndex: "downContractNo",
      }
    }else{
      this.columns[2] = {
        title: "上游采购同编号",
        key: "upContractNo",
        dataIndex: "upContractNo",
      }
    }
  },
  mounted(){
    
  },
  methods:{
    setData(list){
      this.dataSource = list||[]
      if(this.dataSource.length == 1){
        this.selectedRowKeys = this.dataSource.map(item => item.businessLineNo)
        this.change()
      }
    },
    onClickRow(record) {
      return {
        on: {
          click: () => {
            this.selectedRowKeys = [record.businessLineNo];
            this.change()
            // this.$forceUpdate();
          },
        },
      };
    },
    onSelected(key,selectedRows){
      this.selectedRowKeys = selectedRows.map(item => item.businessLineNo)
      this.change()
    },
    change(){
      
      this.$emit("change",this.selectedRowKeys[0],this.dataSource.find(item => item.businessLineNo == this.selectedRowKeys[0]))
    },
    openTab(record){
      const {upOrderNo,downOrderNo,type,businessLineNo} = record
      let query = `?upOrderNo=${upOrderNo}&downOrderNo=${downOrderNo}&businessLineType=${type}&businessLineNo=${businessLineNo}&contractType=0`
      window.open(`/center/monitoring/dynamicMonitoring/detail${query}`,"_blank")
    }
  }
}
</script>
<style lang="less" scoped>
@import url("~@/v2/style/table-cover.less");
.business-line{
  .new-table{
    margin-top:20px !important;
    ::v-deep{
      .ant-table-row{
        cursor: pointer;
      }
    }
  }
}
</style>
