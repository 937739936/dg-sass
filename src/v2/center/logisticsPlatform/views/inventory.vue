<template>
   <div class="slMain">
    <a-card :bordered="false">
      <div class="methods-wrap">
        <span slot="title" class="slTitle">库存台账</span>
      </div>
      <div class="search" v-if="!isCoreCompany">
        <sl-select 
          addonBeforeTitle="货主" 
          placeholder="请选择货主企业名称" 
          v-model="shipperUscc" 
          @change="shipperChange"
          :allowClear="false"
        >
          <a-select-option value="all">全部</a-select-option>
          <a-select-option 
            :value="item.creditCode" 
            v-for="item in shipperList"
            :key="item.creditCode"
          >{{ item.name }}</a-select-option>
        </sl-select>
        
      </div>
      <div class="summary-wrap">
        <div v-if="!isManager" class="scrroll-box left"  @click="slide('left')">
            <div :class="'left-arrow ' + (summaryScrollLeftEnabled ?'':'disabled')"></div>
        </div>
      <div class="card-list" ref="summaryCardList">
        <div class="card">
          <span class="title">账面库存(吨)</span>
          <div class="text">{{ summary.inventoryTotal }}</div>
        </div>
        <div class="card orange">
          <span class="title">累计入库(吨)</span>
          <div class="text">{{ summary.inInventory }}</div>
        </div>
        <div class="card cyan" v-if="!isManager">
          <span class="title">未关联业务线入库(吨)</span>
          <div class="text">{{ summary.nonBusinessLineInInventory }}</div>
        </div>
        <div class="card">
          <span class="title">累计出库(吨)</span>
          <div class="text">{{ summary.outInventory }}</div>
        </div>
        <div class="card orange" v-if="!isManager">
          <span class="title">未关联业务线出库(吨)</span>
          <div class="text">{{ summary.nonBusinessLineOutInventory }}</div>
        </div>
        <template v-if="!isManager">
          <div class="card cyan">
            <span class="title">库存货值(元)</span>
            <div class="text">{{ summary.totalGoodsValue }}</div>
          </div>
          <div class="card">
            <span class="title">累计入库货值(元)</span>
            <div class="text">{{ summary.inGoodsValue }}</div>
          </div>
          <div class="card orange">
            <span class="title">累计出库货值(元)</span>
            <div class="text">{{ summary.outGoodsValue }}</div>
          </div>
        </template>
      </div>
      <div v-if="!isManager" class="scrroll-box right"  @click="slide('right')">
            <div :class="'right-arrow ' + (summaryScrollRightEnabled ?'':'disabled')"></div>
        </div>
      </div>
      <a-tabs :activeKey="activeKey" @change="onTabChange">
        <a-tab-pane key="overview" tab="库存概览">
          <div class="tab-content">
            <InventoryOverviewChart 
              :loading="lineLoading" 
              ref="overviewLine"
              :isManager="isManager" 
              @change="onOverviewLineChange" 
              @export="doOverviewLineExport" 
            />
            <CoalInventoryList :list='coalTypeinventoryList' @goInOutDetail='goInOutDetail' :isManager="isManager"></CoalInventoryList> 
          </div>
        </a-tab-pane>
        <a-tab-pane key="business" tab="业务线台账" v-if="((VUEX_ST_COMPANYSUER && VUEX_ST_COMPANYSUER.company && VUEX_ST_COMPANYSUER.company.companyType !='WAREHOUSE') || !isManager)">
          <div  class="tab-content">
            <BusinessLine 
              ref='businessLine' 
              :request="getBusinessLinePage" 
              @export="doExport"
              @clickDetail="clickDetail"
              @openBusinessLine="openBusinessLine"
              @goContract="goContract"
            ></BusinessLine>
          </div>
        </a-tab-pane>
      </a-tabs>
    </a-card> 
    
  </div>
</template>
<script>
import {getInventorySummary ,getOverviewEcharts,exportOverview,getBusinessLinePage,exportBusinessLine,getShipperList,getCoalTypeinventoryList} from "../api/inventory";
import InventoryOverviewChart from "@sub/logisticsPlatform/InventoryOverviewChart";
import { getSubsystemOptions, subsystemOptionsEdit } from '@/v2/center/logisticsPlatform/api';
import BusinessLine from "@sub/logisticsPlatform/BusinessLine";
import  SlSelect from "@sub/components/ui-new/Form/sl-select.vue";
import { mapGetters,mapMutations } from "vuex"
import storage from "@sub/utils/storage";
import downlodFile from '@/v2/utils/download.js'
import CoalInventoryList from "@sub/logisticsPlatform/CoalInventoryList";

// import qs from "qs";
export default {
  components: {
    InventoryOverviewChart,
    BusinessLine,
    SlSelect,
    CoalInventoryList
  },
  data(){
    const activeKey = storage.session.get("inventory.activeKey")||'overview'
    return {
      activeKey,
      tableLoading:false,
      dataSource:[],
      pagination: {
        total: 0, // 总条数
        pageNo: 1,
        pageSize:10,
      },
      loading:false,
      lineLoading:false,
      summary:{},
      shipperList:[],
      shipperUscc:"all",
      coalTypeinventoryList: [],
      summaryScrollLeftEnabled: false,
      summaryScrollRightEnabled: true,
    }
  },
  mounted(){
    if(!this.isCoreCompany){
      this.getShipperList();
    }
    this.getInventorySummary();
    this.getCoalTypeinventoryList();
    if(this.activeKey == 'business' && this.VUEX_ST_COMPANYSUER?.company?.companyType == 'WAREHOUSE'){
      this.activeKey = 'overview'
      storage.session.set("inventory.activeKey",'overview')
    }
  },
  computed: {
    ...mapGetters('user', {
      VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER',
      VUEX_COMPANY_SERVICES: 'VUEX_COMPANY_SERVICES',
      VUEX_CURRENT_PLATEFORM: 'VUEX_CURRENT_PLATEFORM'
      
    }),

    // 是否是核心企业
    isCoreCompany() {
      return this.VUEX_ST_COMPANYSUER?.companyType == 'CORE_COMPANY'
    },
    //是否是站台管理服务
    isManager(){
      return this.VUEX_COMPANY_SERVICES.includes("LOGISTICS_STATION_MANAGE");
    }
  },
  methods:{
    ...mapMutations({
			SET_VUEX_CURRENT_PLATEFORM: 'user/SET_VUEX_CURRENT_PLATEFORM'
		}),
    getCoalTypeinventoryList() {
      getCoalTypeinventoryList({
        companyCreditCode: this.getShipperUscc()
      }).then(({success,data}) => {
        if(!success){
          return 
        }
        this.coalTypeinventoryList = data;
      })
    },
     //获取货主列表
    getShipperList(){
      getShipperList().then(({success,data}) => {
        if(!success){
          return 
        }
        this.shipperList = data;
      })
    },
    getShipperUscc(){
      if(this.shipperUscc == 'all'){
        return 
      }
      return this.shipperUscc
    },
    shipperChange(uscc){
      this.shipperUscc = uscc;
      this.getInventorySummary()
      let {startDate,endDate} = this.$refs.overviewLine;
      this.onOverviewLineChange(startDate.format("YYYY-MM-DD"),endDate.format("YYYY-MM-DD"))
      this.getCoalTypeinventoryList();
    },
    onTabChange(key){
      storage.session.set("inventory.activeKey",key)
      this.activeKey = key;
    },
    //顶部库存汇总
    getInventorySummary(){
      this.loading = true;
      getInventorySummary({companyCreditCode:this.getShipperUscc()}).then(({success,data}) => {
        this.loading = false;
        if(!success){
          return
        }
        this.summary = {
          inventoryTotal:data.inventoryTotal?.toNumberString()||"-",
          inInventory:data.inInventory?.toNumberString()||"-",
          nonBusinessLineInInventory:data.nonBusinessLineInInventory?.toNumberString()||"-",
          outInventory:data.outInventory?.toNumberString()||"-",
          nonBusinessLineOutInventory:data.nonBusinessLineOutInventory?.toNumberString()||"-",
          totalGoodsValue:data.totalGoodsValue?.toNumberString()||"-",
          inGoodsValue:data.inGoodsValue?.toNumberString()||"-",
          outGoodsValue:data.outGoodsValue?.toNumberString()||"-"
        };
      }).catch((e) => {
        this.loading = false;
      })
    },
    onOverviewLineChange(startDate,endDate){
      this.lineLoading = true;
      getOverviewEcharts({startDate,endDate,companyCreditCode:this.getShipperUscc()}).then(({success,data}) => {
        this.lineLoading = false;
        if(!success){
          return
        }
        // 库存小于等于0的数据不展示
        if (data.inventoryPieChartVO?.length) {
          const newData = data.inventoryPieChartVO.filter((item)=>{return item.num>0})
          data.inventoryPieChartVO = newData
        }
        this.$refs.overviewLine.setData(data)
      }).catch(() => {
        this.lineLoading = false;
      })
    },
    doOverviewLineExport(startDate,endDate){
      this.lineLoading = true;
      downlodFile(exportOverview,{startDate,endDate,companyCreditCode:this.getShipperUscc()},"GET",() => {
        this.lineLoading = false;
      })
    },
    getBusinessLinePage(data){
      return getBusinessLinePage(data)
    },
    doExport(search){
      this.$refs.businessLine.loading(true)
      downlodFile(exportBusinessLine,search,"GET",() => {
        this.$refs.businessLine.loading(false)
      })
    },
    openBusinessLine(data){
      const {upOrderNo,downOrderNo,type,businessLineNo} = data.businessLineInfo
      let query = `?upOrderNo=${upOrderNo}&downOrderNo=${downOrderNo}&businessLineType=${type}&businessLineNo=${businessLineNo}&contractType=0`
      window.open(`/center/monitoring/dynamicMonitoring/detail${query}`,"_blank")
    },
    clickDetail(data){
      if (this.isManager) {
        this.$router.push({
          path:"/center/logisticsPlatform/inventory/business/detail",
          query:{
            businessLineNo:data.businessLineNo,
            companyCreditCode:data.companyCreditCode
          }
        })
      } else {
        this.$router.push({
          path:"/center/businessline/detail",
          query:{
            businessLineNo:data.businessLineNo,
            upOrderNo:data.businessLineInfo?.upOrderNo,
            downOrderNo:data.businessLineInfo?.downOrderNo,
            businessLineType: data.businessLineInfo?.type
          }
        })
      }
    },
    toRecord({type,startDate,endDate}){
      let shipperUscc = this.getShipperUscc();
      const shipper = this.shipperList.find(item => item.creditCode == shipperUscc)?.name||"";
      let query = {storageStartDate:startDate,storageEndDate:endDate}
      if(shipper){
        if(this.isManager){
          if(type == "IN"){
            query.deliveryCompanyName = shipper
          }else{
            query.receivingCompanyName = shipper
          }
        }else{
          query.deliveryReceiveCompanyName = shipper
        }
        
      }
      
      // let url = `/center/logisticsPlatform/${type.toLowerCase()}/list?`+qs.stringify(query);
      // window.open(url, '_blank');
      this.$router.push({
        path:`/center/logisticsPlatform/${type.toLowerCase()}/list`,
        query
      })
    },
    // 去往合同
    goContract(contractType,data){
      let type = '',id='';
      if(contractType === 'BUY'){
        type = data.upContractType
        id = data.upOrderId
        if(type == 'OFFLINE'){
          id = data.upContractId
        }
      }else{
        type = data.downContractType
        id = data.downOrderId
        if(type == 'OFFLINE'){
          id = data.downContractId
        }
      }
      let path = `/center/contract/${contractType.toLowerCase()}/online/detail?id=${id}&type=${contractType}`
      if(type == 'OFFLINE') {
        path = `/center/contract/${contractType.toLowerCase()}/offline/detail?id=${id}&type=${contractType.toLowerCase()}`
      }
      window.open(path)
    },
    // 出入库
    async goInOutDetail(record, type) {
			if (!record.stationId) {
				return;
			}
			let isChanged = await this.changePlatformIfNeed(record);
			let routerData = this.$router.resolve({
				path: `/center/logisticsPlatform/${type}/list`,
				query: {
					goodsName: record.coalType,
    
				}
			});
			window.open(routerData.href, '_blank');
			if (isChanged) {
				this.$router.go();
			}
		},
		async changePlatformIfNeed(record) {
			if (record.stationId && this.VUEX_CURRENT_PLATEFORM.stationId != record.stationId) {
				let res = await subsystemOptionsEdit({
					stationId: record.stationId,
					companyCreditCode: record.stationCompanyUscc
				});
				if (!res.success) {
					return;
				}
				// 更新vuex
				let { success, data } = await getSubsystemOptions();
				if (!success) {
					return;
				}
				let currentPlatform = data.filter(item => item.selected)[0] || {};
				this.SET_VUEX_CURRENT_PLATEFORM({
					...currentPlatform,
					allStationList: data
				});
				return true;
			}
		},
    // 距离左侧距离
		summaryCardListScrollLeft() {
			const summaryCardList = this.$refs.summaryCardList;
			return summaryCardList.scrollLeft || 0;
		},
    // 点击滑动业务线链
		slide(direction) {
      const summaryCardList = this.$refs.summaryCardList;
			if (!summaryCardList) {
				return;
			}
      const step =  (summaryCardList.clientWidth - 80) / 5 + 20;

			let left = this.summaryCardListScrollLeft();
			if (direction === 'left') {
				left -= step;
			} else {
				left += step;
			}
			this.summaryCardListScrollToLeft(left);
		},
		summaryCardListScrollToLeft(left) {
			const element = this.$refs.summaryCardList;
			if (!element) {
				return;
			}
      let chainMaxScrollLeft = element.scrollWidth - 20 - element.clientWidth
      if (left > chainMaxScrollLeft) {
        left = chainMaxScrollLeft
      }
			element.scrollTo({
				top: 0,
				left: left,
				behavior: 'smooth'
			});
			this.$nextTick(() => {
				this.summaryScrollLeftEnabled = left > 0;
				this.summaryScrollRightEnabled = left < chainMaxScrollLeft
			});
		},
    checkScrollArrowStatus() {
      let left = this.summaryCardListScrollLeft();
      this.summaryScrollLeftEnabled = left > 0;
      // let rightEnabel = left < this.chainMaxScrollLeft;
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
  ::v-deep{
    .ant-tabs{
      margin-top:0;
    }
  }
}
.search{
  margin-top: 30px;
  width:320px;
}
.statistic-value{
  font-size:28px;
  font-weight:bold;
}
.summary-wrap {
  margin-top: 30px;
  margin-bottom: 36px;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  // justify-content: flex-start;
  .scrroll-box {
    width: 30px;
    height: 88px;
    border-radius: 6px;
    background-color: #F7F9FD;
    &.left {
      margin-right: 16px;
    }
    &.right {
      margin-left: 16px;
    }
    .left-arrow {
      width: 100%;
      height: 100%;
      background: url(~@/v2/assets/imgs/common/scroll_left_active_arrow.png) no-repeat right;
      background-size: 24px 24px;
      cursor: pointer;
      &.disabled {
        filter: opacity(0.2);
      }
    }
    .right-arrow {
      width: 100%;
      height: 100%;
      background: url(~@/v2/assets/imgs/common/scroll_right_active_arrow.png) no-repeat right;
      background-size: 24px 24px;
      cursor: pointer;
      &.disabled {
        filter: opacity(0.2);
      }
    }
  }
  
}
.card-list{
  flex: 1;
  display: flex;
  overflow-x: hidden;
  flex-wrap: nowrap;
  .card {
    // flex-grow: 2;
    // flex:1;
    // display: flex;
    // flex-direction: column;
    justify-content: center;
    margin-bottom: 0;
    margin-right: 20px;
    padding: 14px 12px;
    // min-width: calc((100% - 80px)/5);
    height: 88px;
    border-radius: 6px;
    background-color:#F0F8FF;
    &.orange{
      background-color:#FFF9F0;
    }
    &.cyan{
      background-color:#EBFAEF;
    }
    .title{
      color:rgba(#000,0.4);
      font-size:14px;
      line-height:20px;
      font-family: PingFangSC;
      font-weight:normal;
    }
    .text{
      margin-top:12px;
      color:rgba(#000,0.8);
      font-size:20px;
      line-height:28px;
      font-weight: bold;
      
    }
  }
}

// <=1440
@media screen and (max-width: 1919px ) {
  .card-list{
    .card{
      .text {
        min-width: 166.8px;
      }
    }
  }
}

@media screen and (min-width: 1920px) {
  .card-list{
    .card{
      .text {
        min-width: 264px;
      }
    }
  }
}

.tab-content{
  width:100%;
}
</style>
