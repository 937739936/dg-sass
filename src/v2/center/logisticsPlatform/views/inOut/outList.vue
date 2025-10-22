<template>
  <div class="slMain">
    <WarehouseList 
      type='out' 
      :listFn='getInOutList' 
      :houseApi='getHouseListNew'
      :statisticsApi='getInOutStatistics'
      :delApi='delInOut'
      :modifyInOutRecordPriceApi="modifyInOutRecordPrice"
      @export='exportData'
      @detail='goDetail'
      auth="logisticsStorageCenter:outManage:storage:add"
      @add='add'
      @edit='edit'
      :isCoreCompany="isCoreCompany"
      :isManager="isManager"
    >
    </WarehouseList> 
    <RelationContract
      ref="relationContract" 
      @relation='goAdd'
      source='list'
      tipMessage="注：无生效中放货指令的标准仓押合同，无法进行手动新增出库"
      operationType="ADD_OUTBOUND"
      type="OUT">
    </RelationContract>

  </div>
</template>

<script>
import WarehouseList from '@sub/logisticsPlatform/warehouseList.vue'
import {getInOutStatistics,getInOutList, exportInOutList, delInOut, existRelOrder, modifyInOutRecordPrice} from "../../api/inout.js";

import {getHouseListNew} from "../../api/selectData";
import comDownload from "@sub/utils/comDownload.js";
import moment from "moment";
import { mapGetters } from "vuex";
import RelationContract from './components/relationContract.vue';

export default {
  data() {
    return {
      path: ''
    }
  },
  computed: {
    ...mapGetters("user", {
      VUEX_ST_COMPANYSUER: "VUEX_ST_COMPANYSUER",
      VUEX_CURRENT_PLATEFORM: 'VUEX_CURRENT_PLATEFORM',
      VUEX_COMPANY_SERVICES: 'VUEX_COMPANY_SERVICES',
    }),
       // 是否是仓储企业
    isWarehouseCompany() {
      return this.VUEX_ST_COMPANYSUER.companyType == 'WAREHOUSE'
    },
    isCoreCompany(){
      return this.VUEX_ST_COMPANYSUER.companyType == 'CORE_COMPANY'
    },
    //是否是站台管理服务
    isManager(){
      return this.VUEX_COMPANY_SERVICES.includes("LOGISTICS_STATION_MANAGE");
    }
  },
  created(){
  },
  methods: {
    getHouseListNew,
    getInOutStatistics,
    getInOutList,
    delInOut,
    modifyInOutRecordPrice,
    async exportData(params) {
      const res = await exportInOutList(params)
      const name = `出库管理-${this.VUEX_ST_COMPANYSUER.companyName}-${this.VUEX_CURRENT_PLATEFORM.label}-${moment().format('YYYY-MM-DD')}.xls`
      comDownload(res, undefined, name);
    },
    // 新增
    async add({ type, typeRecord, path }) {
      this.path = path;
      this.type = type;
      this.typeRecord = typeRecord;
      const params = {
        stationId: this.VUEX_CURRENT_PLATEFORM.stationId,
        inOutTypeEnum: 'OUT'
      }
      const res = await existRelOrder(params)
      if(res.data) {
        this.$refs.relationContract.show()
      } else {
         this.$router.push({
          path: this.path,
          query: {
            typeRecord: this.typeRecord
          }
        })
      }
    },
    // 关联合同新增
    goAdd(info = {}) {
      this.$router.push({
        path: this.path,
        query: {
          serialNo: info.serialNo,
          orderTypeEnum: info.contractType,
          typeRecord: this.typeRecord
        }
      })
    },
    edit(item) {
      this.$router.push({
        path: '/center/logisticsPlatform/out/add',
        query: {
          id: item.id
        }
      })
    },
    goDetail(item) {
      this.$router.push({
        path: '/center/logisticsPlatform/out/detail',
        query: {
          id: item.id
        }
      })
    }


  },
  components: {
    WarehouseList,
    RelationContract,
  }
}
</script>

<style scoped  lang='less' >

</style>
