<template>
  <div class="slMain">
    <a-card :bordered="false">
      <div class="methods-wrap">
        <span slot="title" class="slTitle">下煤短倒计划</span>
        <a-button class="add-btn" type="primary" style="margin-bottom:10px" @click="edit" v-if="isSupportShort">创建短倒计划</a-button>
      </div>
      <SlFormNew
        :list="searchList"
        layout="inline"
        @change="handleChange"
      ></SlFormNew>
      <div :class="'table-box ' + (pagination.total > 10 ? 'fixedBottom' : '')">
        <a-table
          :columns="columns"
          class="new-table new-table2"
          :bordered="false"
          rowKey="id"
          :dataSource="dataSource"
          :pagination="false"
          :loading="tableLoading"
          :scroll="{ x: true }"
        >
          <template slot="planWeight" slot-scope="text">
            {{ text === 0? text:(text||'-') }}
          </template>
          <template slot="deliveryWeight" slot-scope="text">
            {{ text === 0? text:(text||'-') }}
          </template>
          <template slot="sendCarNum" slot-scope="text"> {{ text === 0? text:(text||'-') }}</template>
          <template slot="arriveCarNum" slot-scope="text"> {{ text === 0? text:(text||'-') }}</template>
          <template slot="dispatchLimit" slot-scope="text"> {{ text === 0? text:(text||'-') }}</template>
          <div slot="action" slot-scope="text, record" v-if="isSupportShort">
            <a-space>
              <a @click.prevent="detail(record)">查看</a>
              <a 
                @click.prevent="planStatusEdit(record.id,false)" 
                v-if="record.status == 'UNDERWAY'"
              >关闭</a>
              <a @click.prevent="planStatusEdit(record.id,true)" v-if="record.status == 'FINISHED'">开启</a>
            </a-space>
          </div>
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
import iPagination from "@sub/components/iPagination";
import {getCoalPlanList,coalPlanStatusEdit} from "../api";
import {
  searchShortPlanStatus,
} from "../api/shortPour";
import store from "@/store";
import { ListMixin } from "@/v2/components/mixin/ListMixin";
export default {
  mixins: [ListMixin],
  components: {
    iPagination,
  },
  data(){
    const statusDict = store.getters["config/VUEX_ST_STATIONALLCODE"].coalPlanStatusDict;
    let coalPlanStatusList = Object.keys(statusDict).map((key) => {
      return {
        value:key,
        label:statusDict[key]
      }
    })
    return {
      columns,
      tableLoading:false,
      isSupportShort:false,
      searchList: [
        {
          decorator: ['serialNo'],
          addonBeforeTitle: '编号',
          type: 'input',
          placeholder: '请输入编号',
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
          decorator: ['createDate'],
          addonBeforeTitle: '创建日期',
          realKey: ['createdDateStart', 'createdDateEnd'],
          type: 'rangePicker',
          placeholder: ['开始日期', '结束日期'],
          allowClear:true,
        },
        {
          decorator: ['status'],
          addonBeforeTitle: '状态',
          type: 'select',
          placeholder: '请选择状态',
          allowClear:true,
          options:coalPlanStatusList
        },
        
      ],
      searchParams: {},
      pagination: {
        total: 0, // 总条数
        pageNo: 1,
        pageSize: 10,
      },
      url: {
        list: getCoalPlanList
      },
      defaultParams: {
        type: "SHORT"
      },
    }
  },
  mounted(){
    this.searchShortPlanStatus();
  },
  methods:{
    searchShortPlanStatus(){
      searchShortPlanStatus().then(({success,data}) => {
        if(!success){
          return
        }
        this.isSupportShort = data.status  == "OPEN"
      })
    },
    handleChange(data) {
      this.searchParams = data
      this.pagination.pageNo = 1
      this.changeSearch(this.searchParams)
    },
    detail(data){
      this.$router.push({
        path:"/center/logisticsPlatform/short_pour/plan/detail",
        query:{
          id:data.id
        }
      })
    },
    async planStatusEdit(id,opened){
      let isok = await this.isAsync((resolve) => {
        this.$confirm({
          title:"提示",
          content:opened ? '确认开启吗？':'确认关闭吗？',
          onOk(){
            resolve(true)
          },
          onCancel(){
            resolve(false)
          }
        })
      })
      if(!isok){
        return
      }
      coalPlanStatusEdit({id,opened}).then((result) => {
        if(!result.success){
          return
        }
        this.$message.success('操作成功');
        this.getList()
      })
    },
    isAsync(fn){
      return new Promise(fn);
    },
    edit(){
      this.$router.push({
        path:"/center/logisticsPlatform/short_pour/plan/edit",
        query:{
          
        }
      })
    }
  }
}


const columns = [
  { title: "编号", dataIndex: "serialNo", key: "serialNo", },
  { title: "到站", dataIndex: "sendStation", key: "sendStation", },
  { title: "煤种", dataIndex: "coalType", key: "coalType", },
  { title: "计划吨数(吨)", dataIndex: "planWeight", key: "planWeight",scopedSlots: { customRender: "planWeight" } },
  { title: "送达吨数(吨)", dataIndex: "deliveryWeight", key: "deliveryWeight", scopedSlots: { customRender: "deliveryWeight" }},
  { title: "已派车数(辆)", dataIndex: "sendCarNum", key: "sendCarNum",scopedSlots: { customRender: "sendCarNum" } },
  { title: "已送达车数(辆)", dataIndex: "arriveCarNum", key: "arriveCarNum",scopedSlots: { customRender: "arriveCarNum" } },
  { title: "派车数量上限(辆)", dataIndex: "dispatchLimit", key: "dispatchLimit",scopedSlots: { customRender: "dispatchLimit" },width: 140 },
  { title: "状态", dataIndex: "statusText", key: "statusText", },
  { title: "创建时间", dataIndex: "createdDate", key: "createdDate", },
  { title: "操作", dataIndex: "操作", key: "操作",width:120, scopedSlots: { customRender: "action" }, fixed: 'right' },
]
</script>

<style lang="less" scoped>
@import url("~@/v2/style/table-cover.less");
</style>
<style lang="less" scoped>
.slMain {
  margin-top: -10px;
}
</style>