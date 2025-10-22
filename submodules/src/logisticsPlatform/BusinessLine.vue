<template>
  <div>
    <slForm
      :list="searchList"
      layout="inline"
      @change="handleChange"
    ></slForm>
    <div class="action">
      <a-spin :spinning="exportLoading" size="small">
        <a class="export-btn" @click="doExport">
          <exportIcon />
          <span class="text">数据导出</span>
        </a>
      </a-spin>
    </div>
    <div :class="source =='admin'?'':['table-box ' ,pagination.total > 10 ? 'fixedBottom' : '']">
      <a-table
        class="new-table"
        :bordered="false"
        :columns="columns"
        :rowKey="(record) => record.businessLineNo+'-'+record.stationId+'-'+record.deliveryReceiveCompanyName+'-'+record.companyCreditCode"
        :dataSource="dataSource"
        :pagination="false"
        :loading="tableLoading"
        :scroll="{ x: true }"
      >
        <template slot="businessLineInfo" slot-scope="info,record">
          <div class="business-line-info" v-if="info">
            <div class="order"><a class="no" @click="openBusinessLine(record)">{{ record.businessLineNo }}</a> <span class="status">{{ info.status }}</span></div>
            <div class="row">
              <span class="label">业务线名称：</span>
              <span class="text">{{ info.businessLineName ||"-"}}</span>
            </div>
            <div class="row">
              <span class="label">采购合同号：</span>
              <a class="text a" @click="goContract(record,'BUY')">{{ info.upContractNo }}</a>
            </div>
            <div class="row">
              <span class="label">销售合同号：</span>
              <a class="text a" @click="goContract(record,'SELL')">{{ info.downContractNo }}</a>
            </div>
          </div>
          <div v-else>业务线不存在</div>
        </template>
        <template slot="stationName" slot-scope="text,record">
          <div class="storage-info">
            <div class="row">
              <span class="label">站台名称：</span>
              <span class="text">{{ text }}</span>
            </div>
            <div class="row">
              <span class="label">货主企业：</span>
              <span class="text">{{ record.deliveryReceiveCompanyName }}</span>
            </div>
          </div>
        </template>
        <template slot="inventory" slot-scope="text,record">
          <div class="stock-info">
            <div class="row">
              <div class="card">
                <span class="label">账面库存(吨)</span>
                <span class="text">{{ record.totalInventory }}</span>
              </div>
            </div>
            <div class="row">
              <div class="card">
                <span class="label">累计入库(吨)</span>
                <span class="text">{{ record.inInventory }}</span>
              </div>
              <div class="card">
                <span class="label">累计出库(吨)</span>
                <span class="text">{{ record.outInventory }}</span>
              </div>
            </div>
          </div>
        </template>
        <template slot="paymentAmount" slot-scope="text,record">
          <div class="fund-info">
            <div class="row">
              <div class="card">
                <span class="label">已付款金额(元)</span>
                <span class="text" v-if="record.businessLineInfo">{{ record.businessLineInfo.paymentAmount }}</span>
                <span class="text" v-else>-</span>
              </div>
            </div>
          </div>
        </template>
        <template slot="action" slot-scope="text,record">
          <a @click="detail(record)" v-if="record.businessLineInfo">详情</a>
        </template>
      </a-table>
      <i-pagination :pagination="pagination" @change="toPage" />
    </div>
  </div>
</template>
<script>
import slForm from "@sub/components/ui-new/Form/sl-form";
import exportIcon from "@sub/components/svg/exportIcon"
import iPagination from "@sub/components/iPagination";
const columns = [
  {
    title: "业务线信息",
    key: "businessLineInfo",
    dataIndex: "businessLineInfo",
    scopedSlots: { customRender: "businessLineInfo" },
  },
  {
    title: "仓储信息",
    key: "stationName",
    dataIndex: "stationName",
    scopedSlots: { customRender: "stationName" },
  },
  {
    title: "库存信息",
    key: "inventory",
    dataIndex: "inventory",
    scopedSlots: { customRender: "inventory" },
  },
  {
    title: "资金信息",
    key: "paymentAmount",
    dataIndex: "paymentAmount",
    scopedSlots: { customRender: "paymentAmount" },
  },
  {
    title: "操作",
    key: "action",
    dataIndex: "action",
    fixed:"right",
    width:88,
    scopedSlots: { customRender: "action" },
  },
]
const searchList = [
  {
    decorator: ["no"],
    addonBeforeTitle: "编号",
    type: "input",
    placeholder: "请输入业务线号或合同编号",
  },
  {
    decorator: ["companyName"],
    addonBeforeTitle: "企业名称",
    type: "input",
    placeholder: "请输入企业名称",
  },
]
export default {
  props:{
    request:{
      type:Function,
      default:()  => (() =>{})
    },
    source:{
      type:String,
      default:() => "rest"
    }
  },
  components:{
    slForm,
    exportIcon,
    iPagination,
  },
  data(){
    return {
      columns,
      searchList,
      dataSource:[],
      tableLoading:false,
      exportLoading:false,
      pagination: {
        total: 20, // 总条数
        pageNo: 1,
        pageSize:10,
      },
    }
  },
  mounted(){
    this.doFetch()
  },
  methods:{
    loading(val){
      this.exportLoading  = val
    },
    doFetch(){
      this.tableLoading = true;
      this.request({...this.pagination,...this.searchParams}).then(({success,data}) => {
        this.tableLoading = false
        if(!success){
          return
        }
        this.dataSource = data.records || []
        this.pagination.total = data.total || 0
      }).catch((e) => {
        this.tableLoading = false;
      })
    },
    detail(data){
      this.$emit("clickDetail",data)
      // this.$router.push({path:"/center/logisticsPlatform/inventory/business/detail"})
    },
    toPage(pageNo = this.pagination.pageNo, pageSize = this.pagination.pageSize){
      this.pagination.pageNo = pageNo
      this.pagination.pageSize = pageSize
      this.doFetch()
    },
    handleChange(data){
      this.searchParams = data
      this.doFetch()
    },
    doExport(){
      this.$emit('export',this.searchParams)
    },
    openBusinessLine(record){
      this.$emit("openBusinessLine",record)
    },
    goContract(data,type){
      this.$emit("goContract",type,data.businessLineInfo)
    }
  }
}
</script>
<style lang="less" scoped>
@import url("~@sub/style/table-cover.less");
::v-deep{
  .sl-form .col{
    margin-top:30px;
  }
  
}

.action{
  display: flex;
  align-items:center;
  justify-content: flex-end;
  margin-top:30px;
  .export-btn{
    display: flex;
    align-items:center;
    .text{
      margin-left:5px;
    }
  }
}
.new-table{
  margin-top:10px;
  
  ::v-deep{
    .ant-table-row{
      td{
        position:relative;
        &:last-child{
          &::after{
            width: 0;
          }
        }
        &::after{
          content:"";
          position:absolute;
          top:50px;
          right:0;
          bottom:20px;
          width:1px;
          background-color:#E5E6EB;
        }
      }
    }
  }
}

.business-line-info{
  padding-bottom:20px;
  margin-bottom: 10px;
  min-width:300px;
  .order{
    margin-top:10px;
    margin-bottom:20px;
    display: flex;
    align-items: center;
    .no{
      font-size:14px;
      color: @primary-color;
    }
    .status{
      margin-left:20px;
      padding:0 6px;
      font-size:12px;
      color:#4682F3;
      height: 20px;
      line-height:20px;
      background-color:#C1D7FF;
      text-align:center;
      border-radius:3px;
    }
  }
  .row{
    margin-bottom:12px;
    display: flex;
    align-items: center;
    font-size:14px;
    line-height: 20px;
    &:last-child{
      margin-bottom: 0;
    }
    .label{
      flex-shrink:0;
      color:rgba(#000,0.4);
    }
    .text{
      color:rgba(#000,0.8);
      &.a{
        color: @primary-color;
      }
    }
  }
}
.storage-info{
  margin-top: 30px;
  max-width:336px;
  min-width:240px;
  .row{
    margin-bottom:12px;
    display: flex;
    align-items: center;
    font-size:14px;
    line-height: 20px;
    &:last-child{
      margin-bottom: 0;
    }
    .label{
      flex-shrink:0;
      color:rgba(#000,0.4);
    }
    .text{
      color:rgba(#000,0.8);
    }
  }
}
.stock-info,.fund-info{
  margin-top:40px;
  max-width:353px;
  min-width:240px;
  .row{
    margin-bottom:20px;
    display: flex;
    align-items: flex-start;
    &:last-child{
      margin-bottom:10px;
    }
    .card{
      margin-right: 40px;
      display: flex;
      flex-direction: column;
      font-size:14px;
      line-height: 20px;
      .label{
        color:rgba(#000,0.4);
      }
      .text{
        margin-top:7px;
        color:rgba(#000,0.8);
        
      }
    }
  }
}
.fund-info{
  min-width: 150px;
}
.businessLineNo,.a{
  color: @primary-color;
}
</style>
