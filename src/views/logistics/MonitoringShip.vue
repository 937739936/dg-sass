<template>
  <div class="Main">
    <a-spin :spinning="spinning" size="large">
      <div class="wrap-1400">
        <div class="menu-wrap">
          <div class="menu-block">
            <router-link to="/home"
              ><img src="~imgs/logo.png" style="width: 130px"
            /></router-link>
            <div class="divider"></div>
            <img
              src="~imgs/logistics/monitoringShip.png"
              style="width: 126px"
            />
          </div>
          <div class="menu-block">
            <div class="nickname">
              <p class="name">
                {{ VUEX_ST_PERSONALLINFO.name || "未认证" }}
              </p>
              <p class="name companyName" v-if="VUEX_ST_COMPANYSUER.company">
                {{ VUEX_ST_COMPANYSUER.company.abbreviation }}
              </p>
            </div>
            <img
              class="avatar"
              :src="
                VUEX_ST_PERSONALLINFO.picUrl
                  ? ENV.BASE_NET + VUEX_ST_PERSONALLINFO.picUrl
                  : require('@/v2/assets/imgs/person/default-avatar.png')
              "
            />
          </div>
        </div>
        <div class="menu-wrap menu-center">
          <div class="menu-block">
            <img
              src="~imgs/logistics/monitoring.png"
              alt=""
              style="width: 20px"
            />
            <div class="menuTit">监控查询</div>
          </div>
        </div>
      </div>
      <div class="monitoringMain">
        <a-row :gutter="20">
          <a-col :span="5">
            <div class="monitoringMainLeft">
              <div class="mainItem" style="flex: 3">
                <div class="mainItemTit">发货信息</div>
                <div class="mainItemCon">
                  <div class="info">
                    <div
                      class="infoItem"
                      v-for="item in infoList"
                      :key="item.key"
                    >
                      <a-space align="start">
                        <span class="label">{{ item.label }}</span>
                        <span
                          >{{ deliverInfo[item.key] || "-"
                          }}{{ item.unit }}</span
                        >
                      </a-space>
                    </div>
                    <div class="infoMain">
                      <div class="infoMainItem">
                        <div class="infoMainItemLeft">
                          <div class="infoPort infoOrigin">始</div>
                          <div class="infoLine"></div>
                        </div>
                        <div class="infoMainItemRight">
                          <div class="portName">
                            {{ deliverInfo.originPortName }}
                          </div>
                          <div class="portTime">
                            <a-space :size="5"
                              ><a-icon type="clock-circle" />到港时间</a-space
                            >
                            <span>{{
                              deliverInfo.originPortInTime || "暂未到港"
                            }}</span>
                          </div>
                        </div>
                      </div>
                      <div class="infoMainItem">
                        <div class="infoMainItemLeft">
                          <div class="infoPort infoDestination">终</div>
                        </div>
                        <div class="infoMainItemRight">
                          <div class="portName">
                            {{ deliverInfo.destinationPortName }}
                          </div>
                          <div class="portTime">
                            <a-space :size="5">
                              <a-icon type="clock-circle" />到港时间
                            </a-space>
                            <span>{{
                              deliverInfo.destinationPortInTime || "暂未到港"
                            }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="mainItem"
                v-show="deviceList.length && mainType == 'monitoring'"
                style="flex: 2"
              >
                <div class="mainItemTit">
                  {{ endMonitor ? "历史绑定设备" : "已绑定设备" }}
                </div>
                <div class="mainItemCon">
                  <div
                    class="deviceItem"
                    @click="EZUIKitShow(item)"
                    v-for="item in deviceList"
                    :key="item.deviceSerial"
                  >
                    <div class="deviceItemLeft">
                      <a-space direction="vertical" :size="10">
                        <span>{{ item.deviceName }}</span>
                        <span class="serial">{{ item.deviceSerial }}</span>
                        <template v-if="endMonitor">
                          <span class="serial">
                            绑定：{{ item.bindTime }}
                          </span>
                          <span class="serial">
                            解绑：{{ item.unBindTime }}
                          </span>
                        </template>
                      </a-space>
                    </div>
                    <div :class="`status ${item.deviceStatusEnum}`">
                      <a-space :size="4">
                        <b>·</b>{{ item.deviceStatus }}
                      </a-space>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </a-col>
          <a-col :span="19">
            <div class="mainItem">
              <div class="mainCon">
                <div class="mainConTit">
                  <a-space :size="30">
                    <span
                      :class="{ active: item.key == mainType }"
                      v-for="item in mainList"
                      :key="item.key"
                      @click="mainType = item.key"
                    >
                      {{ item.value }}
                    </span>
                  </a-space>
                </div>
                <div class="mainConDevice" v-show="mainType == 'monitoring'">
                  <div class="conDevice" v-if="deviceList.length">
                    <div
                      class="deviceItem"
                      v-for="item in deviceList"
                      :key="item.deviceSerial"
                    >
                      <div class="deviceItemImg" @click="EZUIKitShow(item)">
                        <img
                          :src="url(item.previewPic)"
                          alt=""
                          class="bg"
                          v-if="item.previewPic"
                        />
                        <img src="~imgs/monitor.png" alt="" class="bg" v-else />
                        <img
                          src="~imgs/logistics/play.png"
                          alt=""
                          class="play"
                        />
                      </div>
                      <div class="deviceItemName">
                        <span>{{ item.deviceName }}</span>
                        <!-- 只能查看回放时点击就是回放，无需额外回放 -->
                        <a
                          @click="EZUIKitShow(item, 'playback')"
                          v-if="!endMonitor"
                        >
                          <a-space :size="4" align="center">
                            <img
                              src="~imgs/logistics/vector.png"
                              alt=""
                              width="14"
                            />
                            <span>查看回放</span>
                          </a-space>
                        </a>
                      </div>
                    </div>
                  </div>
                  <div class="deviceNull" v-else>
                    <img src="~imgs/logistics/deviceNull.png" alt="" />
                    <div class="deviceNullCon">
                      您还没有绑定设备<br />可以通过{{ systemConfig.name }}APP进行设备绑定
                    </div>
                  </div>
                </div>
                <div class="mainConMap" v-if="mainType == 'track'">
                  <MapRouteShip
                    :shipData="{
                      historyShipData,
                      portList,
                      historyShipType: deliverInfo.status === 'ARRIVAL',
                    }"
                  />
                </div>
              </div>
            </div>
          </a-col>
        </a-row>
        <EZUIKitJs ref="EZUIKit" />
      </div>
      <div class="monitoringBottom">
        © 2023 {{ systemConfig.name }} All rights reserved {{ systemConfig.fullName }}
        {{ systemConfig.filingInformation.no }}
      </div>
    </a-spin>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ENV from "api/env.js";
import { API_GetShipTrackFlag, API_GetShipTrack } from "api";
import { API_DEVICEDEMONITOR } from "@/v2/center/trade/api/device";
import EZUIKitJs from "@/v2/components/EZUIKit/EZUIKitJs";
import systemConfig from '@/v2/config/common';
import MapRouteShip from "../../components/map/MapRouteShip";
const infoList = [
  {
    key: "sellerName",
    label: "卖方企业",
  },
  {
    key: "buyerName",
    label: "买方企业",
  },
  {
    key: "contractNo",
    label: "合同编号",
  },
  {
    key: "batchNo",
    label: "批次编号",
  },
  {
    key: "deliverDate",
    label: "装货日期",
  },
  {
    key: "deliverQuantity",
    label: "装货数量",
    unit: "(吨)",
  },
  {
    key: "shipName",
    label: "船舶名称",
  },
  {
    key: "contactPerson",
    label: "联系人",
  },
  {
    key: "contactPhone",
    label: "联系方式",
  },
];
export default {
  name: "MonitoringShip",
  components: {
    MapRouteShip,
    EZUIKitJs,
  },
  data() {
    return {
      infoList,
      ENV,
      deliverInfo: {}, //
      deviceList: [], //设备列表
      mainList: [
        {
          value: "监控",
          key: "monitoring",
        },
        {
          value: "轨迹",
          key: "track",
        },
      ],
      endMonitor: false, //是否结束监控
      mainType: "monitoring",
      spinning: false,
      params: {}, //传参信息
      historyShipData: [], //轨迹
      portList: [], //电子围栏
      systemConfig
    };
  },
  mounted() {
    this.params = this.$route.query;
    this.getDetail();
  },
  computed: {
    ...mapGetters("user", {
      VUEX_ST_PERSONALLINFO: "VUEX_ST_PERSONALLINFO",
      VUEX_ST_COMPANYSUER: "VUEX_ST_COMPANYSUER",
    }),
  },
  methods: {
    //展开监控
    EZUIKitShow(data, type) {
      if (this.endMonitor) {
        //如果结束监控，视频查看只有回放
        type = "playback";
      }
      this.$refs.EZUIKit.show(data, type);
    },
    url(url) {
      return ENV.BASE_NET + url;
    },
    //获取信息
    async getDetail() {
      this.spinning = true;
      //获取船舶信息，设备信息
      await API_DEVICEDEMONITOR({ shipId: this.params.shipId })
        .then((res) => {
          if (res.success) {
            this.endMonitor = res.data.endMonitor;
            this.deliverInfo = res.data.deliverInfo;
            this.deviceList = res.data.deviceList;

            //判断是否有设置的电子围栏
            let portList = [];
            //判断始发港
            let {
              originPortDetailAddress,
              originPortLat,
              originPortLon,
              originPortElectronicFenceRadius,
            } = this.deliverInfo;
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
            } = this.deliverInfo;
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
        })
        .finally(() => {
          this.spinning = false;
        });
      let { mmsi } = this.params;
      let rest = await API_GetShipTrackFlag({
        deliveryId: this.params.deliveryId,
        mmsi,
      });
      if (rest.success) {
        await API_GetShipTrack({
          source: "BUSINESS_LINE",
          deliveryId: this.params.deliveryId,
          mmsi,
        }).then((res) => {
          if (res.success) {
            this.historyShipData = res.result.map((item) => {
              return { ...item, mmsi };
            });
          }
        });
      } else {
        this.$notification.warning({
          message: "消息提示",
          description: "无法获取轨迹信息，请联系客服",
        });
      }
    },
  },
};
</script>

<style lang="less" scoped>
::v-deep .ant-row {
  height: 100%;
  .ant-col {
    height: 100%;
  }
}
html {
  font-family: "PingFang SC";
  font-style: normal;
}
.Main {
  background: #f3f5f6;
  height: 100vh;
  overflow: hidden;
}
.wrap-1400 {
  width: 100%;
  background: #ffffff;
  min-width: 1400px;
  padding: 0 20px;
  height: 64px;
  position: relative;
  .menu-wrap {
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    .menu-block {
      display: flex;
      align-items: center;
      .avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
      }
      .divider {
        display: inline-block;
        width: 1px;
        height: 30px;
        background: #e5e6eb;
        margin: 0 20px;
      }
      .menuTit {
        font-weight: 500;
        font-size: 20px;
        line-height: 28px;
        color: rgba(0, 0, 0, 0.8);
        margin-left: 4px;
      }
      .nickname {
        font-size: 14px;
        color: #141517;
        letter-spacing: 0;
        text-align: right;
        line-height: 40px;
        margin-left: 14px;
        .name {
          line-height: 18px;
          display: block;
          margin-right: 10px;
          font-size: 14px;
          font-weight: 500;
          color: rgba(0, 0, 0, 0.8);
        }
        .companyName {
          color: rgba(0, 0, 0, 0.4);
        }
      }
    }
    &.menu-center {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      position: absolute;
      top: 0;
      width: 100%;
    }
  }
}
.monitoringMain {
  width: 100%;
  height: calc(100vh - 100px);
  padding: 20px;
  .monitoringMainLeft {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    width: 100%;
  }
  .mainItem {
    background: #ffffff;
    border-radius: 10px;
    height: 100%;
    width: 100%;
    overflow: hidden;
    &:not(:first-child) {
      margin-top: 20px;
    }
    .mainItemTit {
      font-size: 16px;
      line-height: 22px;
      color: rgba(0, 0, 0, 0.8);
      padding: 20px;
      position: relative;
      &::before {
        content: "";
        display: block;
        position: absolute;
        margin: auto;
        left: 0;
        width: 3px;
        border-top-left-radius: 3px;
        border-bottom-left-radius: 3px;
        height: 22px;
        background: #4682f3;
        transform: matrix(-1, 0, 0, 1, 0, 0);
      }
    }
    .mainItemCon {
      border-top: 1px solid #e5e6eb;
      margin: 0 20px;
      padding: 20px 0;
      height: calc(100% - 62px);
      overflow-y: scroll;
      -ms-overflow-style: none;
      overflow: -moz-scrollbars-none;
      &::-webkit-scrollbar {
        width: 0 !important;
      }
      &.mainItemCon .info {
        .infoItem {
          font-size: 14px;
          line-height: 20px;
          margin-bottom: 14px;
          .label {
            color: #77889d;
            display: inline-block;
            width: 56px;
          }
        }
        .infoMain {
          margin-top: 16px;
          background: #f8fbfe;
          border-radius: 6px;
          padding: 20px 12px;
          .infoMainItem {
            display: flex;
            .infoMainItemLeft {
              display: inline-block;
              margin-right: 12px;
              .infoPort {
                width: 18px;
                height: 18px;
                padding: 3px;
                font-size: 12px;
                line-height: 12px;
                border-radius: 4px;
                color: #ffffff;
                &.infoOrigin {
                  background: #3fc5a5;
                }
                &.infoDestination {
                  background: #f47a21;
                }
              }
              .infoLine {
                width: 1px;
                height: 64px;
                background: rgba(119, 136, 157, 0.2);
                margin: 5px 8px;
              }
            }
            .infoMainItemRight {
              display: inline-block;
              flex: 1;
              .portName {
                font-weight: 500;
                font-size: 14px;
                line-height: 20px;
                color: rgba(0, 0, 0, 0.8);
                word-break: break-all;
                text-overflow: ellipsis;
                overflow: hidden;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2; /* 这里是超出几行省略 */
              }
              .portTime {
                margin-top: 12px;
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                font-size: 12px;
                line-height: 17px;
                color: #77889d;
                ::v-deep.ant-space {
                  flex: 70px;
                }
                span {
                  text-align: right;
                }
              }
            }
          }
        }
      }
      .deviceItem {
        background: #f8fbfe;
        border-radius: 6px;
        padding: 14px;
        cursor: pointer;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        font-weight: 500;
        font-size: 14px;
        line-height: 20px;
        color: rgba(0, 0, 0, 0.8);
        &:not(:first-child) {
          margin-top: 14px;
        }
        .serial {
          font-weight: 400;
          font-size: 14px;
          line-height: 14px;
          color: #77889d;
        }
        .deviceItemLeft {
          flex: 1;
        }
        .status {
          padding: 6px 8px;
          background: #f8fffd;
          border-radius: 4px;
          font-size: 12px;
          line-height: 12px;
          width: 54px;
          margin-left: 4px;
          &.ONLINE {
            border: 1px solid #61cab1;
            color: #3fc5a5;
            background: #f8fffd;
          }
          &.OFFLINE {
            background: #fff6f0;
            border: 1px solid #f47a21;
            color: #f47a21;
          }
        }
      }
    }
    .mainCon {
      width: 100%;
      height: 100%;
      position: relative;
      .mainConTit {
        position: absolute;
        top: 0;
        padding: 20px 20px 13px;
        font-size: 16px;
        line-height: 22px;
        z-index: 10;
        color: #77889d;
        span {
          cursor: pointer;
          font-weight: 600;
        }
        .active {
          color: rgba(0, 0, 0, 0.8);
          position: relative;
          &::before {
            content: "";
            display: block;
            position: absolute;
            margin: auto;
            bottom: -13px;
            height: 3px;
            width: 100%;
            border-top-right-radius: 3px;
            border-top-left-radius: 3px;
            background: #4682f3;
            transform: matrix(-1, 0, 0, 1, 0, 0);
          }
        }
      }
      .mainConDevice {
        position: absolute;
        top: 55px;
        width: 100%;
        padding: 12px 1.54%;
        height: calc(100% - 55px);
        z-index: 1;
        overflow-y: scroll;
        .conDevice {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          .deviceItem {
            max-width: 460px;
            width: 32.3%;
            border: 1px solid #edf0f4;
            border-radius: 6px;
            padding: 1.4%;
            margin-bottom: 1.54%;
            margin-right: 1.54%;
            &:nth-child(3n) {
              margin-right: 0;
            }
            .deviceItemImg {
              position: relative;
              cursor: pointer;
              width: 100%;
              height: 0;
              padding-top: 76.19%;
              &::after {
                content: "";
                display: block;
                position: absolute;
                width: 100%;
                top: 0;
                left: 0;
                height: 100%;
                background: rgba(22, 23, 27, 0.3);
                backdrop-filter: blur(5px);
                z-index: 2;
              }
              .bg {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 1;
              }
              .play {
                position: absolute;
                width: 12.38%;
                height: 16.25%;
                left: 0;
                right: 0;
                top: 0;
                bottom: 0;
                margin: auto;
                z-index: 3;
              }
            }
            .deviceItemName {
              margin-top: 5%;
              font-weight: 500;
              font-size: 16px;
              line-height: 22px;
              color: rgba(0, 0, 0, 0.8);
              display: flex;
              justify-content: space-between;
              align-items: center;
              a {
                font-weight: 400;
                font-size: 14px;
                line-height: 20px;
                color: #157ffb;
                img {
                  vertical-align: unset;
                }
              }
            }
          }
        }
        .deviceNull {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          img {
            width: 16.29%;
          }
          .deviceNullCon {
            margin-top: 14px;
            font-size: 14px;
            line-height: 22px;
            text-align: center;
            color: #77889d;
          }
        }
      }
      .mainConMap {
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 1;
      }
    }
  }
}
.monitoringBottom {
  font-size: 12px;
  line-height: 17px;
  /* identical to box height */
  text-align: center;
  padding-bottom: 19px;
  color: rgba(0, 0, 0, 0.4);
}
</style>
