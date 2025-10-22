<template>
  <a-modal
    :visible="visible"
    @cancel="close"
    width="766px"
    :footer="false"
    :forceRender="true"
    class="video-modal"
    :destroyOnClose="true"
  >
    <template slot="title">
      <div class="title">
        <div class="name">{{ name }}</div>
        <span class="status">在线</span>
      </div>
    </template>
    <div class="tabs">
      <span @click="onTabs('live')" :class="playType =='live'?'active':''">预览</span>
      <span @click="onTabs('playback')" :class="playType =='playback'?'active':''">回放</span>
    </div>
    <div>
      <div style="width: 100%; position: relative">
        <div class="video-wrapper fullscreen-wrapper">
          <template>
            <div class="control-button" v-if="curCameraData.control && videoLoaded && playType =='live'" >
              <p>
                  操作摄像头
                  <a-tooltip placement="bottom" title="向下转动摄像头">
                    <span class="down" @click="cameraControlling('DOWN')"></span>
                  </a-tooltip>
                  <a-tooltip placement="bottom" title="向上转动摄像头">
                    <span class="up" @click="cameraControlling('UP')"></span>
                  </a-tooltip>
                  <a-tooltip placement="bottom" title="向左转动摄像头">
                    <span class="left" @click="cameraControlling('LEFT')"></span>
                  </a-tooltip>
                  <a-tooltip placement="bottom" title="向右转动摄像头">
                    <span class="right" @click="cameraControlling('RIGHT')"></span>
                  </a-tooltip>
                  <a-tooltip placement="bottom" title="镜头拉近">
                    <span class="zoom-out" @click="cameraControlling('ZOOM_OUT')"></span>
                  </a-tooltip>
                  <a-tooltip placement="bottom" title="镜头拉远">
                    <span class="zoom-in" @click="cameraControlling('ZOOM_IN')"></span>
                  </a-tooltip>
              </p>
            </div>
            
            
            <template v-if="os=='other' && visible">
              <VideoHls
                v-if="cameraPreviewURLs  && playType =='live'"
                :customFullscreenEnter="true"
                ref="videoHls"
                :type="getStaging() ? 'video/mp4' : 'application/x-mpegURL'"
                @change="videoLoaded = true"
                @changeFullScreen="toggle"
                :src="cameraPreviewURLs"
                :key="1"
              ></VideoHls>
              <HikvisionVideo
                v-if="playType =='playback'"
                @change="hikvisionVideoLoaded = true"
                :cameraIndexCode="cameraIndexCode"
                ref="hikvisionVideo"
                :list="[]"
                :playMode="1"
              ></HikvisionVideo>
            </template>
            <!-- 临时先这么写等找到为啥 海康sdk有些视频不能观看在更换 -->
             <template v-if="os=='window'  && visible">
              <div class="skip-plug-preview" v-if="playType =='live' && isSkipPlug">
                <VideoHls
                  v-if="cameraPreviewURLs"
                  :customFullscreenEnter="true"
                  ref="videoHls"
                  :type="getStaging() ? 'video/mp4' : 'application/x-mpegURL'"
                  @change="videoLoaded = true"
                  @changeFullScreen="toggle"
                  :src="cameraPreviewURLs"
                  :key="1"
                ></VideoHls>
                <div class="skip-plug-preview-tip">注：当前为跳过插件直接播放效果，如想展示更清晰、流畅的监控画面，请 <a class="setUp" href='javascript:;' @click='setUpPlug()'>安装插件</a></div>
              </div>
              <HikvisionVideo
                v-else
                @change="hikvisionVideoLoaded = true"
                @skipPlug="skipPlug"
                :isToInstallPlug="isToInstallPlug"
                :cameraIndexCode="cameraIndexCode"
                ref="hikvisionVideo"
                :list="[]"
                :playMode="Number(playType=='playback')"
              ></HikvisionVideo>
            </template>
           
            <div ref="imgContainer" class="img-container"></div>
          </template>
        </div>
      </div>
    </div>
  </a-modal>
</template>
<script>
import VideoHls from '@/v2/components/videoHls/VideoHls.vue'
import HikvisionVideo from './HikvisionVideo.vue'
import { api as fullscreen } from 'vue-fullscreen'
import {
  API_GrainGrainCameraPreviewURLs,
  API_GrainGrainCameraControlling,
} from 'api';

const SL_SKIP_PLUG_KEY = 'SL_REST_SKIP_PLUG_KEY'
  
export default {
  name: 'VideoMonitor',

  props: {
    coreCompanyId: {
      type: String,
      default: '',
    }
  },
  components: {
    VideoHls,
    HikvisionVideo
  },
  data() {
    return {
      // ENV,
      os:navigator.userAgent.toLowerCase().includes("window")?"window":"other",
      playType:"live",
      id: '',
      loading: false,
      name:'',
      visible:false,
      fullscreen: false,
      curCameraData: {},
      cameraIndexCode: '',
      cameraPreviewURLs: '',
      videoLoaded: false,
      colSpan: 8,
      isControl: false,
      hikvisionVideoLoaded: false,
      skipPlugString: sessionStorage.getItem(SL_SKIP_PLUG_KEY) || 'false',
      isToInstallPlug: false, // 是否安装插件 
    }
  },
  mounted() {
   
  },
  computed: {
    isSkipPlug: function() {
      return this.skipPlugString == 'true'
    }
  },
  methods: {
    onTabs(type){
      this.playType = type;
    },
    getStaging () {
      return process.env.VUE_APP_CURRENTMODE === 'staging' || process.env.VUE_APP_CURRENTMODE === 'dev'
    },
    toggle () {
      fullscreen.toggle(this.$el.querySelector('.fullscreen-wrapper'), {
        teleport: this.teleport,
        callback: (isFullscreen) => {
          this.fullscreen = isFullscreen
        },
      })
    },
    toControl (data) {
      this.visible = true
      this.curCameraData = data
      this.cameraIndexCode = data.hikSn
      this.name = data.name
      this.isControl = data.control
      this.videoLoaded = false
      this.getCameraPreviewURLs()
    },
    close(){
      this.visible = false;
      this.curCameraData = {}
      this.cameraIndexCode = "";
      this.name = ""
      this.isControl = false
      this.videoLoaded = true
      this.cameraPreviewURLs = null;
      this.playType = "live";
      this.isToInstallPlug = false
    },
    getCameraPreviewURLs() {
      if (this.getStaging()) {
        this.cameraPreviewURLs = this.curCameraData.hlsUrlLow
        return
      }
      API_GrainGrainCameraPreviewURLs({ cameraIndexCode: this.cameraIndexCode, type: 'LOW' }).then((result) => {
        if(!result.success){
          return
        }
        this.cameraPreviewURLs = result.data;
      })
    },
    cameraControlling(v) {
      let params = {}
      if (v) {
        params = {
          cameraIndexCode: this.cameraIndexCode,
          action: 0,
          command: v
        }
      } else {
        params = {
          cameraIndexCode: this.cameraIndexCode,
          action: 1,
          command: 'LEFT'
        }
      }
      API_GrainGrainCameraControlling(params)
    },
    // 跳过插件
    skipPlug() {
      // isSkip = sessionStorage.getItem(SL_SKIP_PLUG_KEY)
      sessionStorage.setItem(SL_SKIP_PLUG_KEY, "true");
      this.skipPlugString = 'true'
    },
    // 安装插件
    setUpPlug() {
      sessionStorage.setItem(SL_SKIP_PLUG_KEY, "false");
      this.isToInstallPlug = true;
      this.skipPlugString = 'false'
    }
  }
};
</script>
<style lang="less" scoped>
.video-modal ::v-deep{
  .ant-modal-mask,.ant-modal-wrap {
    z-index:1002;
  }
  .ant-modal-header{
    padding:0 20px;
    height:58px;
    background-color:#F3F5F6;
    .ant-modal-title{
      height:100%;
    }
  }
  .ant-modal-body{
    padding: 20px;
  }
}
.tabs{
 
  margin-bottom:20px;
  display:flex;
  font-size:16px;
  height:35px;
  border-bottom:1px solid #E5E6EB;
  span{
    font-size:14px;
    margin-right:40px;
    cursor:pointer;
  }
  span.active{
    height:100%;
    display:flex;
    align-items:flex-start;
    position:relative;
    font-weight: bold;
    color: @primary-color;
    &::after{
      content:"";
      position: absolute;
      left:0;
      right:0;
      bottom:1px;
      height:2px;
      background-color: @primary-color;
      border-radius:2px;
    }
  }
}
.title{
  display:flex;
  align-items:center;
  height:100%;
  .name{
    font-size:18px;
    color:rgba(#000,0.8);
  }
  .status{
    margin-left:12px;
    display:flex;
    align-items:center;
    justify-content: center;
    width:36px;
    height:20px;
    font-size:12px;
    color:#3EB384;
    border-radius:4px;
    background-color:#C5ECDD;
  }
}

//img{
//  display: block;
//  width: 100%;
//  height: 246px;
//}
.button{
  padding: 10px;
  text-align: right;
  span{
    line-height: 32px;
  }
}
.item{
  border: 1px solid #EEF0F2;
  border-radius: 4px;
  margin-bottom: 16px;
  margin-left: 10px;
  .item-play {
    width:250px;
    height: 250px;
    background-image: url('~@/assets/imgs/monitor.png');
    background-size: 100%;
    background-position: center;
    background-repeat: no-repeat;
  }
}
.video-wrapper{
  margin: 0 auto;
  position: relative;
  width: 100%;
  max-width: 800px;
  height: 408px;
  border-radius:4px;
  overflow: hidden;
  // padding-top: 37px;
  .control-button{
    width: 100%;
    // position: absolute;
    text-align: right;
    top: 0;
    z-index: 1;
    p{
      padding: 0 16px;
      width: 100%;
      color: #ffffff;
      line-height: 40px;
      height: 40px;
      background: #000000;
      overflow: hidden;
    }
    .up, .down, .right, .left, .zoom-in, .zoom-out, .pause{
      width: 20px;
      height: 20px;
      margin-left: 16px;
      display: inline-block;
      position: relative;
      top: 3px;
      cursor: pointer;
    }
    .up{
      background-image: url("../../../assets/imgs/logisticsPlatform/turnUp.png");
      background-size: cover;
    }
    .down{
      background-image: url("../../../assets/imgs/logisticsPlatform/turnDown.png");
      background-size: cover;
    }
    .right{
      background-image: url("../../../assets/imgs/logisticsPlatform/turnRight.png");
      background-size: cover;
    }
    .left{
      background-image: url("../../../assets/imgs/logisticsPlatform/turnLeft.png");
      background-size: cover;
    }
    .zoom-in{
      background-image: url("../../../assets/imgs/logisticsPlatform/zoomOut.png");
      
      background-size: cover;
    }
    .zoom-out{
      background-image: url("../../../assets/imgs/logisticsPlatform/zoomIn.png");
      background-size: cover;
    }
    //.pause{
    //  background-image: url("../../../assets/imgs/logisticsPlatform/pauseTurn.png");
    //  background-size: cover;
    //}
    .back{
      line-height: 25px;
      padding: 0 18px;
      color: rgba(255,255,255,0.65);
      border: 1px solid rgba(255,255,255,0.65);
      border-radius: 4px;
      position: relative;
      top: 6px;
      cursor: pointer;
      a{
        color: rgba(255,255,255,0.65);
      }
    }
  }
}
.control{
  display: inline-block;
  width: 30px;
  height: 30px;
  position: relative;
  span{
    width: 0px;
    height: 0px;
    border-width: 15px;
    border-style: solid;
    position: absolute;
  }
}
.arrow{
  display: inline-block;
  width: 32px;
  height: 15px;
  font-size: 30px;
  position: relative;
  top: -3px;
  .pause{
    position: absolute;
    top: 5px;
    left: 6px;
    display: inline-block;
    width: 20px;
    height: 20px;
    background: #595959;
  }
  .up{
    position: absolute;
    top: -20px;
  }
  .down{
    position: absolute;
    bottom: -35px;
  }
  .left{
    position: absolute;
    left: -20px;
  }
  .right{
    position: absolute;
    right: -20px;
  }
}
.skip-plug-preview {
  height: 100%; 
  width: 100%;
  display: flex;
  flex-direction: column;
}
.skip-plug-preview-tip {
  margin-top: 16px;
  color: rgba(0, 0, 0, 0.40);
  font-size: 14px;
  .setUp {
    color: @primary-color;;
  }
}
</style>