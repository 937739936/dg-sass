<template>
  <a-modal 
    :visible="visible" 
    title="预警信息" 
    class="slModal" 
    :footer="false"
    width="1200px"
    height="688px"
    @cancel="close"
    :maskClosable="false"
  >
    <a-card 
      :bordered="false"
      :tabList="tabList"
      :activeTabKey="activeKey"
      @tabChange="onTabChange"
    >
      <a-table
        class="new-table"
        :bordered="false"
        :columns="columns"
        :rowKey="(record) => record.id"
        :dataSource="dataSource"
        :pagination="false"
        :loading="tableLoading"
      >
        <template slot="alertContent" slot-scope="text">
          <a-tooltip placement="top" :title="text">
            <div class="alertContent">
            {{ text }}
            </div>
          </a-tooltip>
        </template>
        <template slot="riskLevelDesc" slot-scope="text,record">
          <div :class="['level' ,record.riskLevel]">
            <span class="dot"></span>
            <span class="text">{{ text }}</span>
          </div>
        </template>
        
        <template slot="alertStatusDesc" slot-scope="text,record">
          <span :class="['warning-status',record.alertStatus]" >{{ text }}</span>
        </template>
        <template slot="action" slot-scope="text,record">
          <a @click.prevent="toDetail(record)" v-if="activeKey != 'COMPANY' && source =='rest'">详情</a>
        </template>
      </a-table>
      <i-pagination :pagination="pagination" @change="toPage" size="small" />
    </a-card>
  </a-modal>
</template>
<script>
import iPagination from "@sub/components/iPagination";
const columns = [
  {
    title: "预警日期",
    key: "alertDate",
    dataIndex: "alertDate",
    width:130,
    customRender:(text) => {
      return text ||"-"
    }
    // scopedSlots: { customRender: "业务线信息" },
  },
  {
    title: "预警内容",
    key: "alertContent",
    dataIndex: "alertContent",
    width:300,
    scopedSlots: { customRender: "alertContent" },
  },
  {
    title: "风险等级",
    key: "riskLevelDesc",
    dataIndex: "riskLevelDesc",
    align:"center",
    width:100,
    scopedSlots: { customRender: "riskLevelDesc" },
  },
  {
    title: "预警状态",
    key: "alertStatusDesc",
    dataIndex: "alertStatusDesc",
    align:"center",
    width:100,
    scopedSlots: { customRender: "alertStatusDesc" },
  },
  {
    title: "规则名称",
    key: "ruleName",
    dataIndex: "ruleName",
    width:200,
    customRender:(text) => {
      return text ||"-"
    }
  },
  {
    title: "最新跟踪时间",
    key: "followTime",
    dataIndex: "followTime",
    width:200,
    customRender:(text) => {
      return text ||"-"
    }
  },
  {
    title: "操作",
    key: "action",
    dataIndex: "action",
    // fixed:"right",
    width:70,
    scopedSlots: { customRender: "action" },
  },
]
export default {
  props:{
    request:{
      type:Function,
      default:() => (async () => {})
    },
    businessLineNo:{
      type:String,
      default:() => ""
    },
    source:{
      type:String,
      default:() => "rest"
    },
    count:{
      type:Object,
      default:() => ({
        total:0,
        companyAlertCount:0,//企业预警
        tradeAlertCount:0,//交易预警
        inventoryAlerCount:0,//库存预警
        makeAlertCount:0//价格预警
      })
    }
  },
  components:{
    iPagination
  },
  data(){
    return {
      
      // tabList:[
      //   {key: 'COMPANY',tab: `企业监控`},
      //   {key: 'TRADE',tab: '交易监控'},
      //   {key: 'MARKET_PRICE',tab: '价格波动'},
      //   {key: 'INVENTORY',tab: '库存监控'},
      // ],
      // tabList:[
      //   {key: 'COMPANY',tab: '企业监控',scopedSlots: { tab: 'COMPANY' },},
      //   {key: 'TRADE',tab: '交易监控',scopedSlots: { tab: 'TRADE' }},
      //   {key: 'MARKET_PRICE',tab: '价格波动',scopedSlots: { tab: 'MARKET_PRICE' }},
      //   {key: 'INVENTORY',tab: '库存监控',scopedSlots: { tab: 'INVENTORY' }},
      // ],
      activeKey:'COMPANY',
      visible:false,
      tableLoading:false,
      dataSource:[],
      columns,
      pagination: {
        total: 0, // 总条数
        pageNo: 1,
        pageSize:10,
      },
    }
  },
  created(){
    
  },
  computed:{
    tabList() {
      const {companyAlertCount,tradeAlertCount,inventoryAlerCount,makeAlertCount} = this.count;
      return [
        {key: 'COMPANY',tab: `企业监控${this.countText(companyAlertCount)}`},
        {key: 'TRADE',tab: `交易监控${this.countText(tradeAlertCount)}`},
        {key: 'MARKET_PRICE',tab: `价格波动${this.countText(inventoryAlerCount)}`},
        {key: 'INVENTORY',tab: `库存监控${this.countText(makeAlertCount)}`},
      ]
    }
  },
  methods:{
    countText(count){
      if(count <= 0){
        return ""
      }
      return `(${count})`
    },
    onTabChange(key){
      this.activeKey = key
      this.dataSource = []
      this.pagination = {
        total: 0, // 总条数
        pageNo: 1,
        pageSize:10,
      }
      this.doFetch()
    },
    doFetch(){
      this.tableLoading = true;
      this.request({
        businessLineNo:this.businessLineNo,
        pageNo:this.pagination.pageNo,
        pageSize:this.pagination.pageSize,
        monitorCategoryEnum:this.activeKey

      }).then(({success,result}) => {
        this.tableLoading = false;
        if(!success){
          return
        }
        const {records,total,current} = result;
        this.dataSource = records;
        this.pagination.total = total;
      }).catch((e) => {
        this.tableLoading = false;
      })
    },
    show(){
      this.visible = true;
      this.doFetch();
    },
    close(){
      this.visible = false;
    },
    toPage(pageNo = this.pagination.pageNo, pageSize = this.pagination.pageSize){
      this.pagination.pageNo = pageNo
      this.pagination.pageSize = pageSize
      this.doFetch()
    },
    toDetail(record){
      this.$emit("warningDetail",{...record,type:this.activeKey})
    }
  }
}
</script>
<style lang="less" scoped>
@import url("~@sub/style/table-cover.less");
.new-table{
  margin-top:20px;
}
.alertContent{
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.slModal {
  ::v-deep{
    .ant-modal-body{
      max-height:688px;
    }
    .ant-card{
      .ant-card-head{
        padding:0;
        border-bottom:0;
      }
      .ant-card-body{
        padding:0;
      }
    }
    .ant-tabs .ant-tabs-large-bar .ant-tabs-tab{
      padding-top:0;
    }
  }
}
.warning-status{
  padding: 0 6px;
  height: 20px;
  font-size:12px;
  color:#4682F3;
  line-height: 20px;
  border-radius: 3px;
  background-color:#C1D7FF;
  &.TO_BE_PROCESS {
    background: #C1D7FF;
    color: #4682F3;
  }

  &.DELAY_HANDLE {
    background: #FFDBC8;
    color: #FF7937;
  }

  &.TO_BE_APPROVED {
    background: #FFDBC8;
    color: #FF7937;
  }

  &.APPROVED_REJECT {
    background: #F8DDE8;
    color: #DB81A5;
  }

  &.PROCESSED {
    background: #C5ECDD;
    color: #3EB384;
  }

  &.ARTIFICIAL_PROCESSED {
    background: #C5ECDD;
    color: #3EB384;
  }

}
.level{
  display: inline-flex;
  align-items:center;
  &.HIGH{
    .text{
      color:#DD4444;
    }
    .dot{
      background-color:#DD4444;
      &::before{
        background-color:rgba(#DD4444,0.2);
      }
    }
  }
  &.MEDIUM{
    .text{
      color:#F5822E;
    }
    .dot{
      background-color:#F5822E;
      &::before{
        background-color:rgba(#F5822E,0.2);
      }
    }
  }
  &.LOW{
    .text{
      color:#147CF6;
    }
    .dot{
      background-color:#147CF6;
      &::before{
        background-color:rgba(#147CF6,0.2);
      }
    }
  }
  .dot{
    margin-right:10px;
    position:relative;
    width:4px;
    height:4px;
    border-radius:4px;
    background-color:#DD4444;
    &::before{
      content:"";
      position: absolute;
      top:-3px;
      left:-3px;
      width:10px;
      height:10px;
      border-radius: 100%;
      background-color:rgba(#DD4444,0.2);
    }
  }
  .text{
    font-size:14px;
    color:#DD4444;
  }
 
}
</style>
