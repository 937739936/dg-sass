<template>
  <div class="slMain">
      <Breadcrumb/>
      <a-spin :spinning="loading">
        <a-card :bordered="false">
          <div class="methods-wrap">
            <span slot="title" class="slTitle">货位视频监控</span>
          </div>
          <a-row style="margin-top: 20px;">
            <a-col :span="24" class="title">
              货位库存：{{summary.currentInventory}}吨
            </a-col>
          </a-row>
          <a-row style="margin-top:20px;">
            <a-col :span="8">仓房：{{summary.houseName}}</a-col>
            <a-col :span="8">货位：{{summary.goodsAllocation}}</a-col>
            <a-col :span="8">煤种：{{summary.coalType}}</a-col>
          </a-row>
        
        <div class="empty" v-if="list.length <= 0">
          <a-empty description="暂无视频" />
        </div>
        <div class="video-list" v-else>
          <div 
            v-for="item in list"  
            :key="item.id"
            :class="['video-card' ,!item.online?'offline-card':item.previewPic?'':'no-cover']" 
          >
            <template v-if="!item.online">
              <div class="offline">
                <img src="@/v2/assets/imgs/logisticsPlatform/monitor-item-bg-disconnection.png" alt="">
                <div class="desc">
                  {{item.name}}<br/>
                  监控已掉线，无法获取监控画面~
                </div>
              </div>
            </template>
            <template v-else-if="!item.previewPic">
              <div class="content">
                <img src="@/v2/assets/imgs/logisticsPlatform/monitor-item-bg-normal.png" alt="">
              </div>
              <div class="footer">
                <span class="text">{{item.name}}</span>
                <span class="view-text" @click="controlMonitor(item)">查看</span>
              </div>
            </template>
            <template v-else>
              <div class="cover" @click="controlMonitor(item)">
                <img :src="item.previewPic" >
              </div>
              <img src="@/v2/assets/imgs/logisticsPlatform/play.png" alt="" class="play-image" @click="controlMonitor(item)"/>
              <div class="default-footer">
                <span class="text">{{item.name}}</span>
              </div>
            </template>
          </div>
        </div>
        </a-card>
    </a-spin>
    <VideoMonitorModal ref="videoMonitorModal" />
  </div>
</template>
<script>
import VideoMonitorModal from "@/v2/center/logisticsPlatform/components/VideoMonitorModal";
import {getGoodsAllocationCameraList,getGoodsAllocationInventorySummary} from "../api";
import { mapGetters } from "vuex"
import Breadcrumb from "@/v2/components/breadcrumb/index";
export default {
  components:{
    VideoMonitorModal,
    Breadcrumb
  },
  data(){
    let {goodsAllocationId,coalType} = this.$route.query||{};
    return {
      goodsAllocationId,
      coalType,
      loading:false,
      list:[],
      summary:{}
    }
  },
  mounted(){
    this.getSummary();
    this.getList();
  },
  computed: {
    ...mapGetters('user', {
        VUEX_CURRENT_PLATEFORM: 'VUEX_CURRENT_PLATEFORM',
    }),
  },
  methods:{
    getList(){
      this.loading = true;
      getGoodsAllocationCameraList({goodsAllocationId:this.goodsAllocationId}).then((res) => {
        this.loading = false;
        if(!res.success){
          return
        }
        this.list = res.data;
      })
    },
    getSummary(){
      getGoodsAllocationInventorySummary({
        goodsAllocationId:this.goodsAllocationId,
        coalType:this.coalType
      }).then((res) => {
        if(!res.success){
          return
        }
        this.summary = res.data ||{};
      } )
    },
    controlMonitor(item){
      // 国投曹妃甸的视频直接获取
      if (this.VUEX_CURRENT_PLATEFORM.label === '国投曹妃甸') {
        window.open(item.videoUrl, '_blank');
        return
      }
      this.$refs.videoMonitorModal.toControl({
        hikSn:item.hikSn,
        name:item.name,
        control:item.control
      })
    },
  }
}
</script>
<style lang="less" scoped>
/deep/ .main-content-inner{
  min-height:unset !important;
}

.empty{
  padding-top:50px;
  display:flex;
  align-items:center;
  justify-content:center;
  background-color:#fff;
}
.title{
  font-size:18px;
  font-weight:bold;
  text-align:center;
}
.video-list{
  display:flex;
  flex-wrap:wrap;
  .video-card{
    position:relative;
    margin-right:16px;
    margin-top:12px;
    width:288px;
    height:186px;
    border-radius:4px;
    background-color:#fff;
    border:1px solid rgba(#252D3E,0.06);
    overflow:hidden;
    .cover{
      position:absolute;
      top:0;
      left:0;
      right:0;
      bottom:0;
      cursor:pointer;
      img{
        width:100%;
        height:100%;
      }
    }
    .play-image{
      position:absolute;
      top:50%;
      left:50%;
      right:0;
      bottom:0;
      width: 40px;
      height: 40px;
      transform:translate(-50%,-50%);
      cursor:pointer;
      z-index:2;
    }
    .default-footer{
      position:absolute;
      left:0;
      right:0;
      bottom:0;
      padding:0 8px;
      display:flex;
      align-items:center;
      height:33px;
      background-color:rgba(#040A15,0.65);
      .text{
        color:#fff;
        &::before{
          content:"";
          display:inline-block;
          width:16px;
          height:16px;
          // background-image:url("~v2/assets/imgs/logisticsPlatform/monitor-item-2.png");
          background-size:100%;
          background-repeat:no-repeat;
          vertical-align: text-bottom;
        }
      }
    }
    &.no-cover{
      display:flex;
      flex-direction:column;
      .content{
        flex:1;
        display:flex;
        justify-content:center;
        align-items:center;
        background-color:rgba(#0053DB,0.09);
        img{
          width:104px;
          height:104px;
        }
      }
      .footer{
        padding:0 8px;
        display:flex;
        align-items:center;
        justify-content:space-between;
        height:33px;
        font-size:14px;
        .text{
          color:#000000;
          &::before{
            content:"";
            display:inline-block;
            width:16px;
            height:16px;
            // background-image:url("~v2/assets/imgs/logisticsPlatform/monitor-item-2.png");
            background-size:100%;
            background-repeat:no-repeat;
            vertical-align: text-bottom;
          }
        }
        .view-text{
          color:#0458DE;
          cursor:pointer;
        }
      }
    }

    &.offline-card{
      display:flex;
      align-items:center;
      justify-content:center;
      
      .offline{
        width:100%;
        height:100%;
        display:flex;
        flex-direction:column;
        align-items:center;
        justify-content:center;
        background-color:rgba(#0053DB,0.09);
      }
      img{
        margin-bottom:14px;
        width:104px;
        height:104px;
      }
      .text{
        font-size:14px;
        color:rgba(#252D3E,0.65);
      }
      
    }
    .desc{
      font-size:14px;
      color:rgba(#252D3E,0.65);
      text-align:center;
    }
  }
}
</style>
