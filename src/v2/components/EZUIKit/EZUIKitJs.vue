<template>
  <a-modal
    :title="null"
    :visible="visible"
    :footer="null"
    :bodyStyle="{ padding: 0 }"
    @cancel="handleCancel"
    centered
    width="800px"
  >
    <div class="mainVideo">
      <div id="video-container"></div>
      <div class="picker" v-if="type == 'playback'">
        <a-space>
          回放起始时间：
          <a-date-picker
            v-model="datas"
            :getCalendarContainer="getPopupContainer"
            :allowClear="false"
            show-time
            :disabled-date="disabledDate"
            format="YYYY/MM/DD HH:mm:ss"
            @change="onChange"
          />
        </a-space>
      </div>
    </div>
  </a-modal>
</template>

<script>
import EZUIKit from "ezuikit-js";
import moment from "moment";
import { getPopupContainer } from "@/untils/factory.js";
import { API_DEVICEDEACCESSTOKEN } from "@/v2/center/trade/api/device";
var player = null;
var accessToken = null;
function getQueryString(name, url = window.location.search) {
  let p = url.split("?")[1];
  let params = new URLSearchParams(p);
  return params.get(name);
}
export default {
  name: "EZUIKitJs",
  props: {
    msg: String,
  },
  data() {
    return {
      visible: false,
      type: "",
      detail: {},
      startTime: null,
      endTime: null,
      datas: null, //时间范围
    };
  },
  mounted() {
    this.getToken();
  },
  methods: {
    getPopupContainer,
    //获取设备token
    async getToken() {
      await API_DEVICEDEACCESSTOKEN({ type: "YSY" }).then((res) => {
        if (res.success) {
          accessToken = res.data.accessToken;
        }
      });
    },
    //改变时间
    onChange(date) {
      let url = this.detail.recordUrl;
      url += "?begin=" + date.format("YYYYMMDDHHmmss");
      player.stop().then(() => {
        player.play(url);
      });
    },
    disabledDate(current) {
      // Can not select days before today and today
      return current < this.startTime || current > this.endTime;
    },
    show(data, type) {
      this.visible = true;
      this.type = type;
      this.detail = data;
      let url = data.liveUrl;
      if (type == "playback") {
        url = data.recordUrl;
        //如果是回放
        let begin = moment(data.bindTime).format("YYYYMMDDHHmmss");
        this.startTime = moment(data.bindTime);
        this.datas = moment(data.bindTime);
        url += "?begin=" + begin;
        if (data.unBindTime) {
          this.endTime = moment(data.unBindTime);
        } else {
          this.endTime = moment();
        }
      }
      this.getPlayer(url);
    },
    //视频播放
    getPlayer(url) {
      let that = this;
      player = new EZUIKit.EZUIKitPlayer({
        id: "video-container", // 视频容器ID
        accessToken: accessToken,
        url,
        // simple - 极简版; pcLive-pc直播；pcRec-pc回放；mobileLive-移动端直播；mobileRec-移动端回放;security - 安防版;voice-语音版;
        template: that.type == "playback" ? "pcRec" : "security",
        width: 800,
        height: 600,
        handleSuccess: async () => {
          if (that.type == "playback") {
            //如果是回放，判断选择的时间点是否在时间范围内
            let begin = getQueryString("begin", player.url);
            if (
              that.startTime.diff(moment(begin, "YYYYMMDDHHmmss"), "seconds") >
                0 ||
              that.endTime.diff(moment(begin, "YYYYMMDDHHmmss"), "seconds") < 0
            ) {
              // '选择点在开始点之前'或者在终止点之后，重新连接
              player.stop().then(() => {
                player.play(url);
              });
            }
          }
        },
        handleError: async (err) => {
          switch (err.retcode) {
            case 1002:
              //token失效，更新token，重新加检
              await that.stopDestroy();
              await that.getToken();
              await that.getPlayer(url);
              break;
            case 1003:
              //连接断开，请重试
              await that.stopDestroy();
              await that.getPlayer(url);
              break;
          }
        },
      });
    },
    handleCancel() {
      this.visible = false;
      this.datas = null;
      this.stopDestroy();
    },
    //销毁视频
    async stopDestroy() {
      await player.stop();
      await player.destroy();
    },
  },
};
</script>
<style lang="less" scoped>
::v-deep .ant-modal-close {
  color: #fff;
  top: -40px;
  right: -40px;
}
::v-deep .timeline-controls,
::v-deep #video-container-canvas-container {
  display: none !important;
}
/deep/.video-containerparent-wnd > div,
/deep/.video-containerparent-wnd > div > canvas {
  width: 100% !important;
  height: 100% !important;
}
/deep/#video-container {
  width: 100% !important;
  height: calc(100% - 48px) !important;
}
::v-deep .ant-modal-content {
  background: none;
  .ant-modal-close-x {
    &::after {
      display: block;
      content: "";
      background-image: url("~@/v2/assets/imgs/common/close-white.png");
    }
  }
}
.mainVideo {
  width: 800px;
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  #video-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  .picker {
    position: absolute;
    display: inline-block;
    right: 100px;
    top: 8px;
    text-align: center;
    ::v-deep .ant-input {
      background: rgba(0, 0, 0, 0);
      color: #ffffff;
      border: 0;
      &:focus {
        border: 0;
        box-shadow: none;
      }
    }
  }
}
</style>
