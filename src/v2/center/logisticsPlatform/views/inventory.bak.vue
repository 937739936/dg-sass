<template>
   <div class="slMain">
    <a-card :bordered="false">
      <div class="methods-wrap">
        <span slot="title" class="slTitle">库存管理</span>
      </div>
      <a-row :gutter="20" style="margin-top: 30px;">
        <a-col :span="8" style="text-align:center">
          <a-statistic title="当前库存(吨)" :value="' '" >
            <template #suffix>
              <span class="statistic-value">{{summary.currentInventory}}</span>
            </template>
          </a-statistic>
        </a-col>
        <a-col :span="8" style="text-align:center">
          <a-statistic title="今日入库(吨)" :value="' '" >
            <template #suffix>
              <a class="statistic-value" @click.prevent="toRecord('IN')">{{summary.inStorageToday}}</a>
            </template>
          </a-statistic>
        </a-col>
        <a-col :span="8" style="text-align:center">
          <a-statistic title="今日出库(吨)" :value="' '" >
            <template #suffix>
              <a class="statistic-value" @click.prevent="toRecord('OUT')">{{summary.outStorageToday}}</a>
            </template>
          </a-statistic>
        </a-col>
      </a-row>
    
      <div :class="'table-box ' + (pagination.total > 10 ? 'fixedBottom' : '')">
        <a-table
          class="new-table"
          :bordered="false"
          :columns="columns"
          :rowKey="getUid"
          :dataSource="dataSource"
          :pagination="false"
          :loading="tableLoading"
          :scroll="{ x: true }"
        >
          <template slot="action" slot-scope="action, record">
            <a-space>
              <a 
                @click.prevent="toRecord('IN',record)"
                v-auth="'logisticsStorageCenter:inventoryManage:inDetail'"
              >入库明细</a>
              <a 
                @click.prevent="toRecord('OUT',record)"
                v-auth="'logisticsStorageCenter:inventoryManage:outDetail'"
              >出库明细</a>
              <a 
                @click.prevent="monitor(record)"
                v-auth="'logisticsStorageCenter:inventoryManage:monitor'"
              >监控</a>
            </a-space>
          </template>
        </a-table>
        <i-pagination :pagination="pagination" @change="getList" />
      </div>
    </a-card>
  </div>
</template>
<script>
import {getInventoryList ,getInventorySummary } from "../api";
import iPagination from "@sub/components/iPagination";
import moment from "moment";
import qs from "qs";
import { mapGetters } from "vuex"
export default {
  components: {
    iPagination,
  },
  data(){
    return {
      columns,
      tableLoading:false,
      dataSource:[],
      pagination: {
        total: 0, // 总条数
        pageNo: 1,
        pageSize:10,
      },
      summary:{}
    }
  },
  mounted(){
    this.getSummary();
    this.getList();
  },
  computed: {
    ...mapGetters('user', {
        VUEX_CURRENT_PLATEFORM: 'VUEX_CURRENT_PLATEFORM',
    }),
  },
  methods:{
    getUid(){
      return Math.random().toString(36).slice(2);
    },
    getSummary(){
      getInventorySummary().then((res) => {
        if(!res.success){
          return
        }
        this.summary = res.data||{};
      })
    }, 
    getList(pageNo = this.pagination.pageNo,pageSize = this.pagination.pageSize){
      this.tableLoading = true;
      getInventoryList({pageNo,pageSize}).then(({success,data}) => {
        this.tableLoading = false;
        if(!success){
          return
        }
        this.dataSource = data.records;
        this.pagination.total = data.total
        this.pagination.pageSize = pageSize
        this.pagination.pageNo = pageNo
      })
    },
    toRecord(type,data){
      let query = {storageDate:moment().format("YYYY-MM-DD")}
      if(data){
        // 同时将仓库名称、收货单位、煤种、仓房和货位
        // 国投曹妃甸的出库明细不传递仓房、货位
        if (type === 'OUT' && this.VUEX_CURRENT_PLATEFORM.label === '国投曹妃甸') {
          query = {
            ...query,
            coalType:data.coalType
          }
        } else {
          query = {
            ...query,
            coalType:data.coalType,
            goodsAllocationId:data.goodsAllocationId,
            houseId:data.houseId
          }
        }
      }
      let url = `/center/logisticsPlatform/${type.toLowerCase()}/list?`+qs.stringify(query);
      window.open(url, '_blank');
      
    },
    monitor(record){
      this.$router.push({
        path:"/center/logisticsPlatform/inventory/goodsAllocation/monitorList",
        query:{
          goodsAllocationId:record.goodsAllocationId,
          coalType:record.coalType
        }
      })
    }
  }
}

const columns = [
  {
    title: "仓房",
    key: "houseName",
    dataIndex: "houseName",
    width: '20%',
  },
  {
    title: "货位",
    key: "goodsAllocation",
    dataIndex: "goodsAllocation",
    width: '20%',
  },
  {
    title: "煤种",
    key: "coalType",
    dataIndex: "coalType",
    width: '20%',
  },
  {
    title: "库存数量(吨)",
    key: "inventory",
    dataIndex: "inventory",
    width: '20%',
  },
  {
    title: "操作",
    key: "action",
    dataIndex: "action",
    scopedSlots: { customRender: "action" },
    width: '20%',
  },
]
</script>
<style lang="less" scoped>
@import url("~@/v2/style/table-cover.less");
</style>
<style lang="less" scoped>
.slMain {
  margin-top: -10px;
}
.statistic-value{
  font-size:28px;
  font-weight:bold;
}
</style>
