<template>
  <div class="slMain">
    <a-card :bordered="false">
      <div class="methods-wrap">
        <span slot="title" class="slTitle">磅房管理</span>
      </div>
       <!-- 查询区域 -->
      <SlFormNew
        :list="searchList"
        layout="inline"
        @change="handleChange"
      ></SlFormNew>
      <div :class="'table-box ' + (pagination.total > 10 ? 'fixedBottom' : '')">
        <a-table
        class="new-table"
        :bordered="false"
        :columns="columns"
        :rowKey="(record) => record.laneNo"
        :dataSource="dataSource"
        :pagination="false"
        :loading="tableLoading"
        :scroll="{ x: true }"
      >
        <template slot="enable" slot-scope="enable">
          {{enable ? "启用":"禁用"}}
        </template>
        <template slot="remark" slot-scope="remark">
          <a-tooltip>
            {{(remark||"").substr(0,20)}}
            <template slot="title" v-if="(remark||'').length >20">{{remark}}</template>
            <template v-if="(remark||'').length >20">....</template>
          </a-tooltip>
        </template>
        <template slot="action" slot-scope="action, record">
          <a-space>
            <a @click.prevent="detail(record)">查看</a>
            <a @click.prevent="edit(record)" >编辑</a>
          </a-space>
        </template>
        </a-table>
        <i-pagination :pagination="pagination" @change="getList" />
      </div>
    </a-card>
  </div>
</template>

<script>
import {getEquipmentScaleList} from "../../api";
import iPagination from "@sub/components/iPagination";
import { ListMixin } from "@/v2/components/mixin/ListMixin";
const columns = [
  {
    title: "编号",
    key: "laneNo",
    dataIndex: "laneNo",
    width: '20%',
  },
  {
    title: "磅房名称",
    key: "name",
    dataIndex: "name",
    width: '20%',
  },
  {
    title: "状态",
    key: "enable",
    dataIndex: "enable",
    scopedSlots: { customRender: "enable" },
    width: '20%',
  },
  {
    title: "备注",
    key: "remark",
    dataIndex: "remark",
    scopedSlots: { customRender: "remark" },
    width: '20%',
  },
  {
    title: "操作",
    key: "操作",
    dataIndex: "操作",
    scopedSlots: { customRender: "action" },
    width: '20%',
  },
]
const searchList = [
  {
    decorator: ["name"],
    addonBeforeTitle: "磅房名称",
    type: "input",
    placeholder: "请输入磅房名称",
  },
  {
    decorator: ["enable"],
    addonBeforeTitle: "状态",
    type: "select",
    placeholder: "请选择状态",
    options: [
      { value: 1, label: "启用"},
      { value: 0, label: "禁用"}
    ]
  },
]
export default {
  mixins: [ListMixin],
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
        pageSize:10
      },
      url: {
        list: getEquipmentScaleList
      },
      searchList
    }
  },
  methods:{
    handleChange(data) {
      this.searchParams = data
      this.changeSearch(this.searchParams)
    },
    detail(data){
      this.$router.push({
        path:`/center/logisticsPlatform/weighthouse/detail/${data.id}`
      })
    },
    edit(data){
      this.$router.push({
        path:`/center/logisticsPlatform/weighthouse/edit/${data.id}`
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import url("~@/v2/style/table-cover.less");
</style>
<style lang="less" scoped>
.slMain {
  margin-top: -10px;
}
</style>