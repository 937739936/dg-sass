<template>
  <div>
    <default-layout>
      <div class="logistics-detail-car">
        <div class="title">
          车辆轨迹跟踪
        </div>
        <div class="car-info">
          <span>车牌号：{{detail.plateNumber}}</span>
          <span>装货地：{{detail.deliverAddr}}</span>
          <span>卸货地：{{detail.receiveAddr}}</span>
          <span>装货数量：{{detail.deliverQuantity}}</span>
          <span>装货时间：{{detail.deliveryTime}}</span>
        </div>
        <div v-if="detail.platformType == '1'" class="site-info">
          <div v-if="loading" class="site-map">
            地图加载中...
          </div>
          <iframe v-else class="site-map-iframe" :src="url"></iframe>
        </div>
        <div v-else class="site-info">
          <div class="site-map-iframe">
            <MapRouteCar :finishTime="detail.finishTime" :siteInfo="siteInfo"></MapRouteCar>
          </div>
        </div>
      </div>
    </default-layout>
  </div>

</template>

<script>
import DefaultLayout from "layout/default";
import {
  API_getDeliverGetTruckTraceInfo,
  API_getDeliverListTraceInfoByDeliveryNum,
  API_getDeliverGetTruckTraceInfoZczy
} from "api/index";
import MapRouteCar from "../../components/map/MapRouteCar"

export default {
  name : "logisticsDetailCar",
  data(){
    return{
      detail: {},
      siteInfo: [],
      url: '',
      loading: true
    }
  },
  mounted(){
    this.detail = JSON.parse(decodeURI(this.$route.query.record || '{}'))
    // 1-物泊 返回的轨迹是url  其他返回的轨迹是坐标
    switch (this.detail.platformType+'') {
      case '1': this.handleViewTrack();break
      case '2': this.getCoordinate();break
      case '3': this.getTruckTraceInfoZczy();break
    }
  },
  components: {
    DefaultLayout,
    MapRouteCar
  },
  methods: {
    // 查看轨迹
    handleViewTrack() {
      API_getDeliverGetTruckTraceInfo({
        deliveryId: this.detail.transTicketNo, // 车辆id
        vehicleNum: this.detail.plateNumber // 车牌号
      }).then(resp => {
        if (resp.success) {
          this.loading = false
          this.url = resp.result
        }
      })
    },
    getCoordinate () {
      API_getDeliverListTraceInfoByDeliveryNum({
        deliveryNum: this.detail.transTicketNo,
        platformType: this.detail.platformType
      }).then(resp => {
        if (resp.success) {
          this.siteInfo = []
          this.loading = false
          let arr = resp.result || []
          arr.forEach(item => {
            if (item.longitude !== null && item.longitude !== undefined && item.latitude !== null && item.latitude !== undefined) this.siteInfo.push(item)
          })
        }
      })
    },
    getTruckTraceInfoZczy() {
      API_getDeliverGetTruckTraceInfoZczy({
        deliveryNum: this.detail.transTicketNo,
        publishNum: this.detail.publishNum
      }).then(resp => {
        if (resp.success) {
          this.siteInfo = []
          this.loading = false
          let arr = resp.result || []
          arr.forEach(item => {
            if (item.longitude !== null && item.longitude !== undefined && item.latitude !== null && item.latitude !== undefined) this.siteInfo.push(item)
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.logistics-detail-car{
  width: 1200px;
  margin:0 auto;
  .title{
    border:1px solid #ddd;
    font-size: 18px;
    color:#666;
    padding:20px 28px;
    margin-top: 40px;
    margin-bottom: 40px;
  }
  .car-info{
    border:1px solid #ddd;
    margin-bottom: 40px;
    padding:20px 28px;
    span{
      display: inline-block;
      &+span{
        margin-left: 40px;
      }
    }
  }
  .site-info{
    width: 100%;
    flex-direction: row;
    .site-map{
      width:100%;
      height:613px;
      border:1px solid #ddd;
      padding:20px;
    }
    .site-map-iframe{
      width:100%;
      height:613px;
      border:1px solid #ddd !important;
    }
  }
}
</style>
