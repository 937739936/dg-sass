<template>
  <div class="lay-container">
    <div class="lay-wrapper">
      <div class="wrap-1200">
        <div class="menu-wrap">
          <div class="menu-block">
            <router-link to="/home"
              ><img src="~imgs/logo.png" style="width: 122px"
            /></router-link>
            <strong
              style="
                display: inline-block;
                font-size: 20px;
                line-height: 30px;
                margin-left: 20px;
              "
            >
              船舶轨迹跟踪
            </strong>
          </div>
          <div class="menu-block">
            <img
              class="avatar"
              :src="
                VUEX_ST_PERSONALLINFO.picUrl
                  ? ENV.BASE_NET + VUEX_ST_PERSONALLINFO.picUrl
                  : require('@/v2/assets/imgs/person/default-avatar.png')
              "
            />
            <span>&nbsp;&nbsp;{{ VUEX_ST_PERSONALLINFO.name }}</span>
          </div>
        </div>
      </div>

      <div class="logistics-box">
        <div class="logistics-detail-ship">
          <div style="width: 100%; height: 20px; background: #f4f5f8"></div>
          <div class="info-box">
            <div class="title"><i class="title_icon"></i>发货信息</div>
            <ul class="info">
              <li>
                <label>批次编号：</label><span>{{ shipInfo.batchNo }}</span>
              </li>
              <li>
                <label>装货日期：</label><span>{{ shipInfo.deliverDate }}</span>
              </li>
              <li>
                <label>装货港：</label
                ><span>{{ shipInfo.shipLoadingPortName }}</span>
              </li>
              <li>
                <label>卸货港：</label
                ><span>{{ shipInfo.shipDischargingPortName }}</span>
              </li>
            </ul>
          </div>
          <div style="width: 100%; height: 20px; background: #f4f5f8"></div>
          <div class="info-box">
            <div class="title"><i class="title_icon"></i>轨迹信息</div>
            <ul class="info">
              <li>
                <label>船舶名称：</label><span>{{ shipInfo.shipName }}</span>
              </li>
              <li>
                <label>船舶状态：</label
                ><span>{{ shipInfo.shipTrackStatusDesc }}</span>
              </li>
              <li>
                <label>始发港：</label
                ><span>{{ shipInfo.originPortName }}</span>
              </li>
              <li>
                <label>目的港：</label
                ><span>{{ shipInfo.destinationPortName }}</span>
              </li>
              <li>
                <label>到达始发港时间：</label
                ><span>{{ shipInfo.originPortInTime }}</span>
              </li>
              <li>
                <label>到达目的港时间：</label
                ><span>{{ shipInfo.destinationPortInTime || "-" }}</span>
              </li>
            </ul>
          </div>
          <div style="width: 100%; height: 20px; background: #f4f5f8"></div>
          <div class="map-box">
            <div class="site-map">
              <map-route-ship
                v-if="$route.query.type == 'realLocation'"
                :shipData="{ singleShipData }"
              ></map-route-ship>


              <map-route-ship
                v-if="$route.query.type == 'historyLocation'"
                :shipData="{
                  historyShipData,
                  portList,
                  historyShipType: shipInfo.shipTrackStatus == 'ARRIVAL',
                }"
              ></map-route-ship>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  API_GetSingleShip,
  API_GetShipDeliveryInfo,
  API_GetShipTrack,
  API_GetShipGetShipDeliveryInfo,
  API_GetShipGetShipTrack,
  API_GetShipGetSingleShip,
} from "api";
import MapRouteShip from "../../components/map/MapRouteShip";
import { mapGetters } from "vuex";
import ENV from "api/env.js";
export default {
  name: "logisticsDetailTrain",
  data() {
    return {
      ENV: ENV,
      shipInfo: "",
      singleShipData: "",
      historyShipData: "",
      portList: [], //电子围栏
      params: {},
      source: "",
      // source--接口定义BUSINESS_LINE("业务线录入"),PORT_GOODS_PLEDGE("港口货压录入")，ASSET_MANUAL("资产手动录入"), ORDER_MANUAL("订单管理录入")
      //目前只用来区分资产和交易模块，资产传ASSET_MANUAL，交易默认'BUSINESS_LINE'
    };
  },
  mounted() {
    this.params = this.$route.query || {};
    this.isFromYunkong = this.$route.query.from === "yunkong";
    this.source = this.$route.query.source || "BUSINESS_LINE";
    this.isFromYunkong
      ? this.getInfoNoAuthority()
      : this.getInfoHaveAuthority();
  },
  computed: {
    ...mapGetters("user", {
      VUEX_ST_PERSONALLINFO: "VUEX_ST_PERSONALLINFO",
    }),
  },
  components: {
    MapRouteShip,
  },
  methods: {
    // 云控过来的页面不需要权限,调用单独的接口
    getInfoNoAuthority() {
      // 货运轨迹
      let params = { ...this.$route.query };
      params.source = this.source;
      let { mmsi } = params;
      API_GetShipGetShipDeliveryInfo(params).then((resp) => {
        if (resp.success) this.shipInfo = resp.data;
      });
      if (this.$route.query.type == "realLocation") {
        API_GetShipGetSingleShip({
          source: this.source,
          deliveryId: this.params.deliveryId,
          mmsiOrName: mmsi || this.params.shipName,
          matchType: mmsi ? "mmsi" : "name",
        }).then((resp) => {
          if (resp.success) this.singleShipData = resp.data;
        });
      }
      if (this.$route.query.type == "historyLocation") {
        API_GetShipGetShipTrack({
          source: this.source,
          deliveryId: this.params.deliveryId,
          mmsiOrName: mmsi || this.params.shipName,
          matchType: mmsi ? "mmsi" : "name",
        }).then((resp) => {
          if (resp.success)
            this.historyShipData = resp.data.map((item) => {
              return { ...item, mmsi };
            });
            this.$forceUpdate()
        });
      }
    },
    // 系统内轨迹需要权限
    getInfoHaveAuthority() {
      let params = this.$route.query;
      params.source = this.source;
      API_GetShipDeliveryInfo(params).then((res) => {
        if (res.success) {
          this.shipInfo = res.result;
          //判断是否有设置的电子围栏
          let portList = [];
          //判断始发港
          let {
            originPortDetailAddress,
            originPortLat,
            originPortLon,
            originPortElectronicFenceRadius,
          } = res.result;
          if (
            originPortDetailAddress &&
            originPortLat &&
            originPortLon &&
            originPortElectronicFenceRadius
          ) {
            portList.push({
              address: originPortDetailAddress,
              lat: originPortLat,
              lon: originPortLon,
              radius: originPortElectronicFenceRadius,
              type: "origin",
            });
          }
          //判断目的港
          let {
            destinationPortDetailAddress,
            destinationPortLat,
            destinationPortLon,
            destinationPortElectronicFenceRadius,
          } = res.result;
          if (
            destinationPortDetailAddress &&
            destinationPortLat &&
            destinationPortLon &&
            destinationPortElectronicFenceRadius
          ) {
            portList.push({
              address: destinationPortDetailAddress,
              lat: destinationPortLat,
              lon: destinationPortLon,
              radius: destinationPortElectronicFenceRadius,
              type: "destination",
            });
          }
          this.portList = portList;
        }
      });
      // 只有应收资产是历史，手动录入资产差的是实时的
      // 其他收货、业务线进入的都查看历史轨迹
      if (this.$route.query.type == "realLocation") {
        // 实时位置
        this.getSingleShip({
          source: this.source,
          deliveryId: this.params.deliveryId,
          mmsiOrName: this.params.mmsi || this.params.shipName,
          matchType: this.params.mmsi ? "mmsi" : "name",
        });
      }
      if (this.$route.query.type == "historyLocation") {
        // 历史轨迹
        this.getHistoryShipRoutes({
          source: this.source,
          deliveryId: this.params.deliveryId,
          mmsi: this.params.mmsi,
        });
      }
    },
    getSingleShip(data) {
      // 获取实时位置
      data.source = this.source;
      let mmsi = data.mmsiOrName;
      API_GetSingleShip(data).then((res) => {
        if (res.success) {
          this.singleShipData = { ...res.result,mmsi } || {};
        }
      });
    },
    getHistoryShipRoutes(data) {
      // 获取历史轨迹
      data.source = this.source;
      let { mmsi } = data;
      API_GetShipTrack(data).then((res) => {
        if (res.success) {
          this.historyShipData =
            res.result.map((item) => {
              return { ...item, mmsi };
            }) || [];
        } else {
          this.$message.error(res.message);
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.wrap-1200 {
  width: 1200px;
  margin: 0 auto;
  height: 64px;
  padding: 12px 0;
  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
  .menu-wrap {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    position: relative;
    z-index: 9999;
  }
}
.logistics-box {
  background: #f4f5f8;
  margin-top: -20px;
  .logistics-detail-ship {
    width: 1200px;
    margin: 20px auto;
    background: #f4f5f8;
    .info-box {
      background: #ffffff;
      padding: 0 20px;
      .title {
        border-bottom: 1px solid #ddd;
        font-size: 16px;
        color: #666;
        padding: 15px;
      }
      .info {
        padding: 15px 40px;
        font-size: 16px;
        color: #666;
        li {
          width: 50%;
          display: inline-block;
          margin-bottom: 10px;
          label {
            display: inline-block;
            width: 150px;
          }
          span {
            color: #333;
            word-break: break-all;
          }
        }
      }
    }
    .map-box {
      background: #fff;
      width: 100%;
      padding: 15px;
      .site-map {
        width: 100%;
        height: 613px;
        border: 1px solid #ddd;
        padding: 15px;
      }
    }
  }
}
</style>
