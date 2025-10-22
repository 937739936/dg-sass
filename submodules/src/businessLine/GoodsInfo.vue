<template>
  <div class="goods-info">
    <a-tabs v-model="tab" @change="changeTab" v-if="isShowTab">
      <a-tab-pane key="deliver" :tab="deliverLabel"> </a-tab-pane>
      <a-tab-pane key="goodsTransfer" :tab="goodsTransferLabel"> </a-tab-pane>
    </a-tabs>
    <!-- 发运信息 -->
    <div class="table-box"  v-if="tab == 'deliver'">
      <a-table
        :columns="deliverDtoColumns"
        class="new-table"
        :bordered="false"
        rowKey="no"
        :scroll='{x:400}'
        :dataSource="deliverList"
        :pagination="false"
      >
        <template slot="statusDesc" slot-scope="text,items">
            <!-- 状态 -->
            <span class="status"  :class="`delivery-status status-${items.status}`">{{items.statusDesc}}</span>
        </template>

        <template slot="action" slot-scope="text,items">
          <a-space :size="20">
            <a href="javascript:;" v-if="!isBank" @click="goSendDetail(items)">详情</a>
            <a href="javascript:;" v-if="items.receiveConfirmButton && !isBank && type == 'rest'"  @click="goConfirmReceive(items)">确认收货</a>
            <!-- 当运输方式为“火运”，或“船运”时，展示“轨迹”按钮 -->
            <a href="javascript:;" v-if="['TRAIN', 'SHIP'].includes(items.despatchType)" @click="goTrack(items)">轨迹</a>
            <a href="javascript:;" v-if="isMonitoringAuth(items) && ['SHIP'].includes(items.despatchType)"  @click="goMonitoring(items)">监控</a>


          </a-space>
        </template>
      </a-table>
    </div>
    <!-- 货转信息 -->
    <div class="table-box"  v-if="tab == 'goodsTransfer'">
      <a-table
        :columns="goodsTransferColumns"
        class="new-table"
        :bordered="false"
        rowKey="no"
        :scroll='{x:400}'
        :dataSource="goodsTransferList"
        :pagination="false"
      >
        <template slot="status" slot-scope="text,items">
          <!-- 状态 -->
          <span class="status" :class="`goods-status status-${items.status}`" >{{items.statusName}}</span>
        </template>
        <template slot="action" slot-scope="text,items" >
            <a href="javascript:;"  v-if="!isBank" @click="goGoodsTransferDetail(items)">详情</a>
            <a href="javascript:;" v-if="!isBank" style="margin-left:20px" @click="downloadGoodsTransferFile(items)">下载</a>
        </template>
      </a-table>
    </div>
    <!-- 轨迹 -->
    <a-modal
      class="del-modal slModal"
      :visible="trackVisible"
      :width='720'
      @cancel="trackVisible = false"
      title="轨迹"
      :footer='null'
    >
      <a-table
        :columns="trackColumns"
        class="new-table"
        style="margin-bottom:20px"
        :bordered="false"
        rowKey="no"
        :scroll='{x:true}'
        :dataSource="trackList"
       
        :pagination="false"
      >
        <template slot="action" slot-scope="text,items">
          <a-space >
             <a href="javascript:;" @click="goShip(items)">轨迹查询</a>
             <a href="javascript:;" v-if="items.shipMonitorButton" @click="jumpToMonitor(items)">监控查询</a>
          </a-space>
        </template>
      </a-table>
    </a-modal>

  </div>
</template>

<script>
import { formatMoney } from '@sub/filters'
//发运信息table colums
 const deliverDtoColumns = [
  { title: "批次号", dataIndex: "batchNo"  ,width: 200},
  { title: "发货日期", dataIndex: "deliverDate"  ,width: 150},
  { title: "运输方式", dataIndex: "despatchTypeDesc" ,width: 150},
  { title: "发货数量(吨)", dataIndex: "deliverQuantity",width: 150 , customRender: t => formatMoney(t)},
  { title: "收货数量(吨)", dataIndex: "receiveQuantity" , width: 150, customRender: t => formatMoney(t)},
  { title: "状态", dataIndex: "statusDesc", scopedSlots: { customRender: "statusDesc" } , width: 150},
  { title: "发货地", dataIndex: "deliverPlace",width: 150},
  { title: "收货地", dataIndex: "receivePlace",width: 150},
  { title: "操作", dataIndex: "action", scopedSlots: { customRender: "action" },width:250,fixed:'right' },

]
// 货转
const goodsTransferColumns = [
  { title: "货转编号", dataIndex: "goodsTransferNo",width: 250 },
  { title: "货转开具日期", dataIndex: "signDate" ,width: 150 },
  { title: "货转数量(吨)", dataIndex: "goodsTransferQuantity" ,width: 150, customRender: t => formatMoney(t)},
  { title: "品名", dataIndex: "goodsName"  ,width: 150},
  { title: "运输方式", dataIndex: "transTypeDesc" ,width: 150 },
  { title: "状态", dataIndex: "status", scopedSlots: { customRender: "status" } ,width: 150 },
  { title: "操作", dataIndex: "action", scopedSlots: { customRender: "action" } ,width: 130,fixed:'right' },

]
// 轨迹
const trackColumns = [
  { title: "船舶名称", dataIndex: "shipName"  ,},
  { title: "航次号", dataIndex: "voyageNo"  ,},
  { title: "MMSI", dataIndex: "identifierNo" ,},
  { title: "发货量", dataIndex: "deliverQuantity", },
  { title: "操作", dataIndex: "action", scopedSlots: { customRender: "action" }, width: 150 },
]

export default {
  props: {
    getUpstreamDeliverBatchList:{},
    getUpstreamGoodsTransferList: {},
    getDownstreamDeliverBatchList: {},
    getDownstreamGoodsTransferList: {},
    getTransDeliverBatchList: {},
    API_GetShipTrackFlag: {},
    API_getRouteInfo: {},

    contractType: {
      default: 'buy'
    },
    // 操作类型
    type: {
      default: 'rest'
    },
    // 业务线类型
    businessLineType: {
      default: '',
    },
    // 金融机构
    isBank: {
      default: false,
    }

  },
  data() {
    return {
      tab: 'deliver',
      deliverDtoColumns,
      goodsTransferColumns,
      trackColumns,
      deliverList: [],
      goodsTransferList: [],
      // 轨迹 和 监控
      trackVisible: false,
      trackList: [],
      trackType: '',
      // 当前发运信息
      currentItem: {}

    }
  },
  computed: {
    deliverLabel() {
      if(!this.deliverList.length) {
        return '发运信息'
      }
      return `发运信息(${this.deliverList.length})`
    },
    goodsTransferLabel() {
      if(!this.goodsTransferList.length) {
        return '货转信息'
      }
      return `货转信息(${this.goodsTransferList.length})`
    },

    /* eslint-disable no-console */
    isShowTab() {
       // 判断 businessLineType
      // UP：上游补录、下游电子
      // ONLINE：上游电子、下游电子
      // DOWN：上游电子、下游补录
      // OFFLINE：上游补录、下游补录

      //  不同的合同类型 产品要求显示的tab不一致
      if(this.businessLineType  == 'ONLINE') {

        return true
      }
      if(this.businessLineType  == 'UP' && this.contractType == 'sell') {
        
        return true
      }
      if(this.businessLineType  == 'DOWN' && this.contractType == 'buy') {
        return true
      }
      
      this.tab = 'deliver' // eslint-disable-line
      return false
    },
    /* eslint-disable */


  },
  mounted() {
    this.getDeliverList()
    this.getGoodsTransferList()
  },

  methods: {
    changeTab() {
      if(this.tab == 'deliver') {
        this.getDeliverList()
      } else {
        this.getGoodsTransferList()
      }
      
    },
    // 发运信息
    async getDeliverList() {
      // 上游发运信息
      let Fn = this.getUpstreamDeliverBatchList
      if(this.contractType == 'sell') {
        // 下游发运信息
         Fn = this.getDownstreamDeliverBatchList
      }
      // 运输合同发运信息
      if(this.contractType == 'trans') {
        Fn = this.getTransDeliverBatchList
      }
      const params = {
        businessLineNo: this.$route.query.businessLineNo,
         ...this.$route.query
      }
      const res = await Fn(params)
      this.deliverList = res.data || []
    },
    // 货转信息
    async getGoodsTransferList() {
      // 上游货转信息
      let Fn = this.getUpstreamGoodsTransferList
      // 下游货转信息
      if(this.contractType == 'sell') {
         Fn = this.getDownstreamGoodsTransferList
      }
      // 运输合同无货转
      if(this.contractType == 'trans') {
        this.goodsTransferList = []
        return 
      }
      const params = {
        businessLineNo: this.$route.query.businessLineNo,
        ...this.$route.query
      }
      const res = await Fn(params)
      this.goodsTransferList = res.data || []
    },
    // 去往发货详情
    goSendDetail(item) {
      if(this.type == 'rest') {
        // 区分采购和销售
        if(this.contractType == 'buy') {
           window.open(`/center/receive/accept/detail?deliverId=${item.id}&businessLineNo=${this.$route.query.businessLineNo}&coreCompanyUscc=${this.$route.query.coreCompanyUscc || ''}&`)
        } else {
           window.open(`/center/receive/send/detail?deliverId=${item.id}&businessLineNo=${this.$route.query.businessLineNo}&coreCompanyUscc=${this.$route.query.coreCompanyUscc || ''}`)
        }
      } else {
         window.open(`/biz/deliver/deliverDetail?deliverId=${item.id}`)
  
      }
     
    },
    // 去往轨迹
    goTrack(items) {
      this.currentItem = items
      this.trackType = 'track'
      if(items.despatchType == 'SHIP') {
        /** 判断当前船运 shipDetailDtos 是不是多个 */
        if(items.shipDetailDtos.length == 1) {
          const firstItem = items.shipDetailDtos[0]
          this.goShip(firstItem)

        } else {
          this.trackVisible = true
          this.trackList = items.shipDetailDtos
        }
        
      } else {

        this.API_getRouteInfo({id:items.waybillId}).then(res=>{
            let hasPath = false
            let info = res.result || res.data
            if(info){
              for (let i = 0; i < info.length; i++) {
                if(info[i].waybillPhaseTraceInfoVO.length){
                  hasPath = true
                  break
                }
              }
            }
            if (!hasPath) {
              this.$message.error('该运单暂无轨迹')
            } else {
              if(this.type == 'rest') {
                 window.open('/logistics/LogisticsDetailTrainNew?waybillId=' + items.waybillId)
              } else {
                 window.open('/logistics/logisticsDetailNew?id=' + items.waybillId)
              }
             
             
            }
              
          })
         
      }
      
    },
    // 去往船运轨迹
    goShip(items) {
      this.API_GetShipTrackFlag({
        deliveryId: this.currentItem.id,
        mmsi: items.identifierNo
      }).then((res) => {
        if (res.success) {
          if(this.type == 'rest') {
            window.open('/logistics/LogisticsDetailShip?mmsi=' + items.identifierNo + '&shipName=' + items.shipName + '&type=historyLocation&deliveryId=' + this.currentItem.id + '&from=yunkong&coalType=COKING_COAL&transType=SHIP')
            return
          }
          window.open('/logistics/shipTrail?mmsi=' + items.identifierNo + '&shipName=' + items.shipName + '&type=2&deliverId=' + this.currentItem.id + '')
          
        } else {
          this.$message.error(res.message || '')
        }
      });
    },
    // 获取监控按钮权限
    isMonitoringAuth(item) {
      
      if(item.shipDetailDtos) {
        if(item.shipDetailDtos.length == 1) {
          const firstItem = item.shipDetailDtos[0]
          return firstItem.shipMonitorButton
        } else {
          return item.shipDetailDtos.some(el => el.shipMonitorButton)
        }

      }
      return false
      
    },
    // 去往监控
    goMonitoring(item) {
      this.currentItem = item
      this.trackType = 'monitoring'
      if(item.shipDetailDtos.length == 1) {
          const firstItem = item.shipDetailDtos[0]
          this.jumpToMonitor(firstItem)
        } else {
          this.trackVisible = true
          this.trackList = items.shipDetailDtos
        }
    },
    //监控查询
    jumpToMonitor(record) {

      if(this.type == 'rest') {
        window.open( "/logistics/monitoringShip?mmsi=" +record.identifierNo + "&deliveryId=" + this.currentItem.id +"&shipId=" +record.id);
      } else {
        let routeUrl = this.$router.resolve({
          path: '/logistics/monitoringShip',
          query: {
            shipId:record.id,
            mmsi:record.mmsi,
            deliverId:this.currentItem.id,
            mainType: 'monitoring'
          }
        });
        window.open(routeUrl.href, '_blank');
      }

    },
    // 去往确认收货
    goConfirmReceive(items) {

      let path = `/center/receive/accept/confirm?deliverId=${items.id}&from=receive&first=true&transType=${items.despatchType}`
    
      window.open(path)
    },
    // 去往货转详情
    goGoodsTransferDetail(items) {
      let path 
      if(this.type == 'rest') {
        path = `/center/transfer/goodsTransfer/detail?goodsTransferNo=${items.goodsTransferNo}`
      } else {
       path = `/biz/goodsTransfer/detail?goodsTransferNo=${items.goodsTransferNo}`
      }
      window.open(path)
    },
    // 下载货转pdf
    downloadGoodsTransferFile(item) {
      this.$emit('downloadGoodsTransferFile', item.goodsTransferNo)
    }



  },
  components: {

  }
}
</script>
<style lang="less" scoped>
@import url("~@sub/style/table-cover.less");
</style>
<style scoped  lang='less' >
.goods-info {
  margin-top: 15px;
  .status {
    display: inline-block;
    border-radius: 4px;
    background: #C5ECDD;
    padding: 1px 6px;
    color: #3EB384;
    font-family: PingFang SC;
    font-size: 12px;
  }
}
.delivery-status.status-1 {
  background: #C9DAFF;
  color: #596FA0;
}

.delivery-status.status-2 {
  background: #FFDBC8;
  color: #FF7937;
}

.delivery-status.status-3 {
  background: #F8DDE8;
  color: #DB81A5;
}

.delivery-status.status-4 {
  background: #C5ECDD;
  color: #3EB384;
}

.delivery-status.status-5 {
  background: #E0E0E0;
  color: #A8A8A8;
}


//待确认
.goods-status.status-7 {
  background: #c9daff;
  color: #596fa0;
}
//审批中
.goods-status.status-2 {
  background: #ffdbc8;
  color: #ff7937;
}
//待签约
.goods-status.status-3 {
  background: #f8dde8;
  color: #db81a5;
}
//已签约
.goods-status.status-4 {
  background: #c5ecdd;
  color: #3eb384;
}
//已作废
.goods-status.status-6 {
  background: #e0e0e0;
  color: #a8a8a8;
}
//退回
.goods-status.status-5 {
  background: #d2dfea;
  color: #7590b9;
}
//驳回
.goods-status.status-8 {
  background: #f2d0d0;
  color: #dd4444;
}
</style>
