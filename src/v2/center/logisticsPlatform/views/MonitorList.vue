<template>
  <div class="slMain">
    <a-spin :spinning="loading">
      <a-card :bordered="false">
        <div class="methods-wrap">
          <span slot="title" class="slTitle">站台监控</span>
        </div>
        <div class="statistics-cards">
          <div class="card name">
            <label class="label">站台名称</label>
            <div class="text">{{summary.stationName}}</div>
          </div>
          <div class="card total">
            <label class="label">监控总数</label>
            <div class="text">{{summary.cameraTotal}}</div>
          </div>
          <div class="card online">
            <label class="label">在线数</label>
            <div class="text">{{summary.cameraOnline}}</div>
          </div>
          <div class="card offline">
            <label class="label">掉线数</label>
            <div class="text">{{summary.cameraOffline}}</div>
          </div>
        </div>
        
        <div class="slTitleAssis" style="margin-bottom:30px;">站台平面展示图</div>
        <PlatformPlan :edit="false" :onPointClick="onPointClick" ref="platformPlan"/>
        <div :class="{fullscreenbox:isfull}" >
          <div class="slTitleAssis hasextra">
            <span>监控画面预览</span>
            <span class="extra" @click="fullscreen">{{isfull?'退出全屏':'全屏展示'}}</span>
          </div>
          <div class="empty" v-if="!loading && warehouseCameras.length <= 0">
            <a-empty ></a-empty>
          </div>
          <a-row class="absolut-box" >
            <a-col v-for="item in warehouseCameras " :key="item.hikSn" :span="6">
              <div class="video" :class="item.online? 'online' : 'offline'" >
                <template v-if="!item.online">
                  <div class="disconnection">
                    <img class="bug" src="@/v2/assets/imgs/logisticsPlatform/bug_icon.png" alt="">
                    <div class="desc">
                      监控已掉线<br/>无法获取监控画面
                    </div>
                  </div>
                </template>
                <template v-else>
                  <div 
                    class="video-play-wrap" 
                    @click="controlMonitor(item)"  
                    @mouseenter="mouseenter(item,$event)"  
                    @mouseleave="mouseleave(item.hikSn)"
                    
                  >
                    <div v-if="item.hikPreviewUrl" class="online-has-image">
                      <img :src="item.hikPreviewUrl" alt="" class="thumbnail-image">
                      <img src="@/v2/assets/imgs/logisticsPlatform/play.png" alt="" class="play-image" >
                    </div>
                    <div v-else class="online-no-image">
                      <div class="disconnection">
                        <img src="@/v2/assets/imgs/logisticsPlatform/monitor-item-bg-normal.png" alt="">
                      </div>
                    </div>
                    <div class="hover-play-wrap"></div>
                  </div>
                  
                </template>
                <div class="name">
                  <div class="name-text">
                    <img src="@/v2/assets/imgs/logisticsPlatform/monitor-item.png" >
                    <span>{{item.name}}</span>
                  </div>
                  <span class="edit-btn" @click="onEditDevice(item)">编辑</span>
                </div>
              </div>
            </a-col>
          </a-row>
        </div>
      </a-card>
    </a-spin>
    <VideoMonitorModal ref="videoMonitorModal" />
    <PlatformPlanEdit ref="platformEdit" :callback="reloadPlatform"/>
    <div class="vide-tmp" style="display: none;">
      <VideoHoverPlay :ref="'video'"></VideoHoverPlay>
    </div>
  </div>
</template>
<script>
import {getMonitorList,getSummary} from "../api";
import VideoMonitorModal from "@/v2/center/logisticsPlatform/components/VideoMonitorModal";
import { mapGetters } from "vuex"
import PlatformPlan from "../components/PlatformPlan";
import PlatformPlanEdit from "../components/PlatformPlanEdit";
import VideoHoverPlay from "../components/VideoHoverPlay";
export default {
  name: "logisticMo",
  data() {
    return {
      loading:false,
      summary:{},
      warehouseCameras:[],
      isfull:false
    };
  },
  components: {
    VideoMonitorModal,
    PlatformPlan,
    PlatformPlanEdit,
    VideoHoverPlay
  },
  mounted() {
    this.doFetch();
  },
  computed: {
    ...mapGetters('user', {
        VUEX_CURRENT_PLATEFORM: 'VUEX_CURRENT_PLATEFORM',
    }),
  },
  methods: {
    fullscreen(){
      this.isfull = !this.isfull
    },
    doFetch(){
      this.getSummary()
      this.getMonitorList();
    },
    getSummary(){
      getSummary().then((res) => {
        if(!res.success){
          return
        }
        this.summary = (res.data||[])[0]||{};
      })
    },
    getMonitorList(){
      this.loading = true;
      getMonitorList().then(({success,data}) => {
        this.loading = false;
        if(!success){
          return
        }
        this.warehouseCameras = data;
        
      },() => {
        this.loading = false;
      })
    },
    // 获取数据
    controlMonitor(item){
      // 国投曹妃甸的视频直接获取
      if (this.VUEX_CURRENT_PLATEFORM.label === '国投曹妃甸') {
        window.open(item.videoUrl, '_blank');
        return
      }
      this.$refs.videoMonitorModal.toControl(item)
    },
    onEditDevice(data){
      this.$refs.platformEdit.show(data);
    },
    mouseenter(item,e){
      this.$refs.video.hover(item.hikSn,e.target.querySelector(".hover-play-wrap"));
      // this.$refs[`video${id}`][0].hover(id);
    },
    mouseleave(id){
      this.$refs.video.blur(id);
      document.querySelector(".vide-tmp").appendChild(this.$refs.video.getElement())
    },
    onPointClick(data){
      const itemData = this.warehouseCameras.filter((item) => item.id == data.id)
      if(itemData.length > 0 && itemData[0].online){
        this.controlMonitor(itemData[0])
      }
    },
    //刷新平面图
    reloadPlatform(data){
      this.$refs.platformPlan.reload(data);
    }
  }
};
</script>
<style lang="less" scoped>
.slMain {
  margin-top: -10px;
}
.line{
  height:1px;
  background-color: #f4f5f8;
}
.slTitleAssis{
  margin-top:50px;
  &.hasextra{
    display: flex;
    justify-content: space-between;
    align-items: center;
    .extra{
      color: @primary-color;
      cursor: pointer;
    }
  }

}
.fullscreenbox{
  position: fixed;
  top: 0;
  right: 0;
  left:0;
  bottom:0;
  padding: 0 10px;
  background-color: #fff;
  z-index:1001;
  .slTitleAssis{
    margin-top:10px;
  }
  .absolut-box{
    margin-top:10px;
  }
}

.statistics-cards{
  margin-top:30px;
  display:flex;
  flex-wrap: wrap;
  .card{
    margin-right:30px;
    padding:14px 20px;
    display: flex;
    flex-direction:column;
    width:250px;
    border-radius:6px;
    background-size:64px;
    background-position: bottom right;
    background-repeat:no-repeat;
    &.name{
      background-color:#F0F8FF;
      background-image:url("~v2/assets/imgs/logisticsPlatform/monitor/card_type_name.png");
    }
    &.total{
      background-color:#FFF9F0;
      background-image:url("~v2/assets/imgs/logisticsPlatform/monitor/card_type_total.png");
    }
    &.online{
      background-color:#EBFAEF;
      background-image:url("~v2/assets/imgs/logisticsPlatform/monitor/card_type_online.png");
    }
    &.offline{
      background-color:#F3F6F9;
      background-image:url("~v2/assets/imgs/logisticsPlatform/monitor/card_type_offline.png");
    }
    .label{
      font-size:14px;
      line-height:20px;
      color:rgba(#000,0.4);
    }
    .text{
      margin-top:12px;
      font-size:20px;
      line-height:28px;
      color:rgba(#000,0.8);
      font-weight:bold;
    }
  }
}
.row{
  margin-bottom:10px;
  display:flex;
  align-items:center;
  &:last-child{
    margin-bottom:0;
  }
  .col{
    flex:1;
  }
  .col-3{
    width:30%;
  }
  label{
    font-size:16px;
    color:#8495AA;
  }
  span{
    padding-left:8px;
    color:#383A3F;
    font-size:16px;
    font-weight:bold;
    &.green{
      color:#81D653;
    }
    &.warning{
      color:#FA5252;
    }
  }
}
.absolut-box{
  position: sticky;
  top: 0;
  margin:30px 0 0 0;
  // position: absolute;
  // top: 68px;
  .ant-col{
    padding:0 8px;
    &:nth-child(4n+1){
      padding-left: 0;
    }
    &:nth-child(4n+4){
      padding-right: 0;
    }
  }
}
.video-play-wrap{
  position: relative; 
  height:100%;
  cursor:pointer;
  .hover-play-wrap{
    display:none;
    position:absolute;
    top:0;
    left:0;
    right:0;
    bottom:0;
  }
}
.title-text{
  height: 24px;
  font-size: 16px;
  font-weight: 500;
  position: relative;
  top: 2px;
  left: -4px;
  color: #383A3F;
  line-height: 24px;
  &:before{
    content:'';
    float:left;
    display: block;
    width: 2px;
    height: 15px;
    background: #0053DB;
    margin-right: 10px;
    margin-top: 5px;
  }
}
.video{
  position: relative;
  margin-bottom: 16px;
  height: 214px;
  border-radius: 4px;
  border: 1px solid rgba(37,45,62,0.06);
  overflow: hidden;
  &.offline{
    display:flex;
    align-items:center;
    justify-content:center;
    background: #F3F5F6;
    .bug{
      width: 48px;
      width: 48px;
      margin-bottom: 10px;
    }
  }
  .name{
    display:flex;
    align-items:center;
    justify-content: space-between;
    padding-left: 8px;
    padding-right: 12px;
    position: absolute;
    left: 0;
    right:0;
    bottom: 0;
    font-size:14px;
    height: 32px;
    color: #ffffff;
    background-color: rgba(#16171B,0.4);
    z-index:11;
    .name-text{
      display:flex;
      align-items:center;
      img{
        margin-right:12px;
        width:14px;
        height:10px;
      }
    }
    .edit-btn{
      font-size:14px;
      cursor:pointer;
    }
    
  }
  .disconnection{
    text-align: center;
    img{
      width: 48px;
      width: 48px;
      margin-bottom: 10px;
    }
    .desc{
      color: rgba(37,45,62,0.65);
    }
  }
}

.online-has-image{
  height: 100%;
  width: 100%;
  position: relative;
  .time{
    height: 20px;
    font-size: 14px;
    font-weight: 400;
    color: #FFFFFF;
    line-height: 20px;
    position: absolute;
    left: 8px;
    top: 6px;
    z-index: 3;
  }
  .thumbnail-image{
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
  }
  .play-image{
    width: 40px;
    height: 40px;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left:-20px;
    margin-top: -20px;
    z-index: 3;
    cursor: pointer;
  }
}
.online-no-image{
  display:flex;
  align-items:center;
  justify-content: center;
  height: 100%;
  background: rgba(0,83,219,0.09);
  .name{
    background: rgba(255,255,255,0.6);
    color: #000000;
  }
}
</style>