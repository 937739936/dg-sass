<template>
  <div class="slMain">
    <a-card :bordered="false">
      <div class="methods-wrap">
        <span slot="title" class="slTitle"><span>{{type=='IN' ? '入':'出'}}库记录</span></span>
        <a-button 
          type="primary" 
          @click="add" 
          v-auth="'logisticsStorageCenter:inManage:storage:add'" 
          v-if="type == 'IN'">新增入库</a-button>
        <a-button 
          type="primary" 
          @click="add" 
          v-auth="'logisticsStorageCenter:outManage:storage:add'" 
          v-if="type == 'OUT'"
        >新增出库</a-button>
      </div>
       <!-- 查询区域 -->
      <SlFormNew
        :list="searchList"
        layout="inline"
        @change="handleChange"
        ref="SlFormNew"
      ></SlFormNew>
      <div :class="'table-box ' + (pagination.total > 10 ? 'fixedBottom' : '')">
        <div class="export-box" @click="exportDown">
          <ExportIcon class="export-icon"></ExportIcon>
          <span class="export-text">数据导出</span>
        </div>
        <a-table
          class="new-table"
          :bordered="false"
          :columns="columns"
          :rowKey="(record) => record.id"
          :dataSource="dataSource"
          :pagination="false"
          :loading="tableLoading"
          :scroll="{ x: true }"
        >
          <template slot="houseName" slot-scope="text">
            <span v-if="!text">-</span>
            <a-tooltip v-else-if="text.length > 1">
              <template slot="title">{{text.join(",")}}</template>
              {{text[0]}}...
            </a-tooltip>
            <span v-else-if="text.length == 1">{{text[0]}}</span>
            <span v-else>-</span>
          </template>

          <template slot="action" slot-scope="text,record">
            <a-space v-if="type == 'IN'">
              <template v-if="VUEX_CURRENT_PLATEFORM.label === '国投曹妃甸'">
                <a
                v-if="record.transportMode == 'TRAIN'"
                @click.prevent="CFDDetail(record)"
                v-auth="'logisticsStorageCenter:inManage:storage:view'"
              >详情</a>
              </template>
              <template v-else>
                <a 
                  @click.prevent="detail(record,'edit')"
                  v-auth="'logisticsStorageCenter:inManage:storage:modify'"
                  v-if="record.transportMode == 'TRAIN'"
                >编辑</a>
                <a 
                  @click.prevent="detail(record)"
                  v-auth="'logisticsStorageCenter:inManage:storage:view'"
                >详情</a>
                <a 
                  @click.prevent="del(record.id)"
                  v-auth="'logisticsStorageCenter:inManage:storage:delete'"
                  v-if="record.delete"
                >删除</a>
              </template>
            
            </a-space>
            <a-space v-if="type == 'OUT'">
              <template v-if="VUEX_CURRENT_PLATEFORM.label === '国投曹妃甸'">
                <a
                @click.prevent="CFDDetail(record)"
                v-auth="'logisticsStorageCenter:outManage:storage:view'"
              >详情</a>
              </template>
              <template v-else>
                <a 
                  @click.prevent="detail(record,'edit')"
                  v-auth="'logisticsStorageCenter:outManage:storage:modify'"
                  v-if="record.transportMode == 'TRAIN'"
                >编辑</a>
                <a 
                  @click.prevent="detail(record)"
                  v-auth="'logisticsStorageCenter:outManage:storage:view'"
                >详情</a>
                <a 
                  @click.prevent="del(record.id)"
                  v-auth="'logisticsStorageCenter:outManage:storage:delete'"
                  v-if="record.delete"
                >删除</a>
              </template>
            </a-space>
          </template>
        </a-table>
        <i-pagination :pagination="pagination" @change="getList" />
      </div>
    </a-card>
  </div>
</template>
<script>
import {getHouseList,getTransportModeList} from "../../api/selectData";
import {getCoalTypeAllList,getRecordsList,getRecordsExport,deleteRecords} from "../../api";
import comDownload from '@sub/utils/comDownload.js';
import iPagination from "@sub/components/iPagination";
import moment from "moment";
import { mapGetters } from "vuex"
import { ListMixin } from "@/v2/components/mixin/ListMixin";
import SlFormNew from "@sub/components/ui-new/Form/sl-form.vue";
import { ExportIcon } from '@sub/components/svg'
export default {
  mixins: [ListMixin],
  components: {
    iPagination,
    ExportIcon
  },
  data(){
    let {type} = this.$route.params;
    type = type?.toUpperCase()
   
    return {
      type,
      typestr:type=='IN'?'入':'出',
      searchList:renderType(type),
      columns:renderColumns(type),
      tableLoading:false,
      dataSource:[],
      pagination: {
        total: 0, // 总条数
        pageNo: 1,
        pageSize:10,
      },
      houseList:[],
      goodsAllocations:[],
      transportModeList:[],
      coalTypeList:[],
      loadingExport:false,//导出
      url: {
        list: getRecordsList
      },
      defaultParams: {
        type: type
      },
      selfLoad: true,
    }
  },
  computed: {
      ...mapGetters('user', {
          VUEX_CURRENT_PLATEFORM: 'VUEX_CURRENT_PLATEFORM',
      }),
  },
  components: {
    SlFormNew,
  },
  watch:{
    $route(to){
      this.type = to.params.type?.toUpperCase();
      this.typestr = this.type=='IN'?'入':'出';
      this.columns = renderColumns(this.type)
      this.searchList = renderType(this.type)
      this.defaultParams.type = this.type
      this.initData()
      this.$forceUpdate()
    },
    searchParams(data) {
      this.getGoodsAllocations(data.houseId)
    }
  },

  async mounted(){
    this.defaultParams.type = this.type
    this.initData();
  },
  methods:{
    initData(){
      return new Promise(async (resolve) => {
        await this.getHouseList();
        await this.getTransportModeList();
        await this.getCoalTypeList();
        let {houseId,goodsAllocationId ,storageDate} = this.$route.query||{};
        if(houseId){
          this.getGoodsAllocations(houseId)
        }
        let search = {houseId,goodsAllocationId}
        if(storageDate){
          search.storageDate = [moment(),moment()];
          search.storageDateStart = moment().format('YYYY-MM-DD')
          search.storageDateEnd = moment().format('YYYY-MM-DD')
        }
        
        if (Object.keys(this.$route.query).length) {
          this.$refs.SlFormNew.initData(search)
        }
        delete search.storageDate
        this.handleChange(search)
        resolve(true);
      })
    },
    handleChange(data) {
      this.searchParams = data
      this.changeSearch(this.searchParams)
    },
    exportDown() {
      let params = {
        ...this.searchParams,
        ...this.defaultParams
      }
      this.loadingExport = true;
      getRecordsExport(params)
        .then((res) => {
          comDownload(res, undefined, `${this.typestr}库记录.xls`);
        })
        .finally(() => {
          this.loadingExport = false;
        });
    },
    //删除
    del(id){
      this.$confirm({
        title:"提示",
        content:"确认删除吗?",
        onOk:() => {
          deleteRecords({id}).then((result) => {
            if(!result.success){
              return;
            }
            this.$message.success("操作成功")
            this.getList();
          })
        },
      })
    },
    //获取煤种
    getCoalTypeList(){
      return getCoalTypeAllList().then((res) => {
        if(!res.success){
          return
        }
        this.coalTypeList = res.data ||[];
        this.searchList.forEach(item=>{
          if (item.decorator[0] === 'coalType') {
            item.options = this.coalTypeList.map((item) => {
              return { value: item.name, label: item.name};
            })
          }
        })
      })
    },
    //获取运输方式
    getTransportModeList(){
      return getTransportModeList().then((res) => {
        if(!res.success){
          return
        }
        this.transportModeList = res.data ||[];
        this.searchList.forEach(item=>{
          if (item.decorator[0] === 'transportMode') {
            item.options = this.transportModeList.map((item) => {
              return { value: item.key, label: item.value};
            })
          }
        })
      })
    },
    getGoodsAllocations(id){
      this.goodsAllocations = (this.houseList.filter((item) => item.id == id )[0]||{}).goodsAllocations||[];
      this.searchList.forEach(item=>{
        if (item.decorator[0] === 'goodsAllocationId') {
          item.options = this.goodsAllocations.map((item) => {
            return { value: item.id, label: item.name};
          })
        }
      })
    },
    getHouseList(){
      return getHouseList().then((res) => {
        if(!res.success){
          return
        }
        this.houseList = res.data;
        this.searchList.forEach(item=>{
          if (item.decorator[0] === 'houseId') {
            item.options = this.houseList.map((item) => {
              return { value: item.id, label: item.name, goodsAllocations: item.goodsAllocations };
            })
          }
        })
      })
    },
    filterOptions(input, option){
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    },
    add(){
      this.$router.push({path:`/center/logisticsPlatform/${this.type}/records/add`})
    },
    detail(record,type){
      let query = {id:record.id}
      if(record.transportMode == "AUTOMOBILE"){
        this.$router.push({
          path:`/center/logisticsPlatform/${this.type}/records/detail`,
          query
        })
        return 
      }
      if(type == "edit"){
        query.view = type;
      }
      if(record.transportMode == "TRAIN"){
        this.$router.push({
          path:`/center/logisticsPlatform/${this.type}/records/train/detail`,
          query
        })
        return
      }
    },
    // 曹妃甸详情
    CFDDetail(record){
      let query = {id:record.id}
      this.$router.push({
        path:`/center/logisticsPlatform/${this.type}/records/CFDdetail`,
        query
      })
    },
  }
}
function renderColumns(type){
  let typestr = type == "IN"?'入':'出';
  return [
    {title: `${typestr}库单号`,key: "serialNo",dataIndex: "serialNo",},
    {title: "发货单位",key: "deliveryCompanyName",dataIndex: "deliveryCompanyName",hide:type == "OUT"},
    {title: "收货单位",key: "receivingCompanyName",dataIndex: "receivingCompanyName",hide:type == "OUT"},
    {title: "煤种名称",key: "coalType",dataIndex: "coalType",},
    {
      title: "矿发净重(吨)",
      key: "loadingWeight",
      dataIndex: "loadingWeight",
			customRender: (text) => {
        return text || '-'
			},
      hide:type == "OUT"
    },
    {title: `${typestr}库重量(吨)`,key: "weight",dataIndex: "weight",},
    {
      title: "亏损(吨)",
      key: "lossWeight",
      dataIndex: "lossWeight",
			customRender: (text) => {
        return text || '-'
			},
      hide:type == "OUT"
    },
    {title: `${typestr}库日期`,key: "storageDate",dataIndex: "storageDate",},
    {title: "车牌号",key: "licensePlateNumber",dataIndex: "licensePlateNumber",hide:type == "OUT"},
    {title: "运输方式",key: "transportModeText",dataIndex: "transportModeText",},
    {
      title: "派车方式",
      key: "generateTypeDesc",
      dataIndex: "generateTypeDesc",
    },
    {
      title: "仓房",
      key: "houseName",
      dataIndex: "houseName",
      scopedSlots: { customRender: "houseName" },
    },
    {
      title: "货位",
      key: "goodsAllocation",
      dataIndex: "goodsAllocation",
      scopedSlots: { customRender: "houseName" },
    },
    {title: "车次号",key: "trainSerialNo",dataIndex: "trainSerialNo",hide:type == "IN"},
    {
      title: "操作",
      key: "操作",
      dataIndex: "操作",
      fixed:"right",
      scopedSlots: { customRender: "action" },
    },
  ].filter(item=>{
    return !item.hide
  })
}
function renderType(type){
  let typestr = type == "IN"?'入':'出';
  return [
  {
    decorator: ["deliveryCompanyName"],
    addonBeforeTitle: "发货单位",
    type: "input",
    placeholder: "请输入发货单位",
    isShow: type === 'IN',
  },
  {
    decorator: ["receivingCompanyName"],
    addonBeforeTitle: "收货单位",
    type: "input",
    placeholder: "请输入收货单位",
    isShow: type === 'IN',
  },
  {
    decorator: ["licensePlateNumber"],
    addonBeforeTitle: "车牌号",
    type: "input",
    placeholder: "请输入车牌号",
    isShow: type === 'IN',
  },
  {
    decorator: ["serialNo"],
    addonBeforeTitle: `${typestr}库单号`,
    type: "input",
    placeholder: `请输入${typestr}库单号`,
  },
  {
    decorator: ["storageDate"],
    addonBeforeTitle: `${typestr}库日期`,
    type: "rangePicker",
    realKey: ["storageDateStart", "storageDateEnd"],
  },
  {
    decorator: ["transportMode"],
    addonBeforeTitle: "运输方式",
    type: "select",
    placeholder: "请选择运输方式",
    options: [],
  },
  {
    decorator: ["houseId"],
    addonBeforeTitle: "仓房",
    type: "select",
    placeholder: "请选择仓房",
    options: [],
  },
  {
    decorator: ["goodsAllocationId"],
    addonBeforeTitle: "货位",
    type: "select",
    placeholder: "请选择货位",
    options: [],
  },
  {
    decorator: ["coalType"],
    addonBeforeTitle: "煤种",
    type: "select",
    placeholder: "请选择煤种",
    options: [],
  },
  {
    decorator: ["trainSerialNo"],
    addonBeforeTitle: "车次号",
    type: "input",
    placeholder: "请输入车次号",
    isShow: type === 'OUT',
  },
  {
    decorator: ["generateType"],
    addonBeforeTitle: "派车方式",
    type: "select",
    placeholder: "请选择派车方式",
    options: [{
        title: '司机扫码',
        value: 'DRIVER_SCAN'
    }, {
        title: '手动录入',
        value: 'MANUAL'
    },],
    },
];
}
</script>
<style lang="less" scoped>
@import url("~@/v2/style/table-cover.less");
</style>
<style lang="less" scoped>
.slMain {
  margin-top: -10px;
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
}
</style>