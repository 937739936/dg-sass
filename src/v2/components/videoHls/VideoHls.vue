<template>
  <div class="live vue-video-player">
    <video id="videoPlayer" :poster="poster" preload="auto" muted class="vjs-custom-skin video-js hls-video-play-wrap"></video>
  </div>
</template>
<script>
import Videojs from "video.js";
import "videojs-contrib-hls";
import "vue-video-player/src/custom-theme.css";
import "video.js/dist/video-js.css";
import videoZhCn from "video.js/dist/lang/zh-CN.json";

export default {
  name: "videoHls",
  props: {
    src: {
      type: String,
      default: "",
    },
    poster: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "application/x-mpegURL",
    },
    currentTimeDisplay: {
      type: Boolean,
      default: false,
    },
    fullScreen: {
      type: Boolean,
      default: false,
    },
    autoplay: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      videoLoaded: false,
      hlsPlyer: null,
    };
  },
  methods: {
    hideControlBar() {
      if (document.querySelector(".vjs-control-bar")) {
        document.querySelector(".vjs-control-bar").style = "display:none !important";
      }
    },
    async initVideo(nowPlayVideoUrl) {
      const options = {
        autoplay: this.autoplay,
        controls: true,
        duration: 2,
        language: videoZhCn
      };
      this.hlsPlyer = Videojs("videoPlayer", options, () => {
        this.onPlayerLoadedData();
        this.$emit("hlsPlayOk", true);
      });
      const url = await this.$RsaDecrypt.generateFileUrl(nowPlayVideoUrl);
      this.hlsPlyer.src([
        // 如果是以option方式设置的src,是不能实现 换台的
        {
          src: url,
          type: this.type,
        },
      ]);
      Videojs.hook("beforeerror", (player, err) => {
        if (err?.code) {
          this.$message.error("播放失败");
        }
        return null;
      });
    },
    // 播放
    play() {
      this.hlsPlyer.play();
    },
    // 暂停
    pause() {
      this.hlsPlyer.pause();
    },
    // 全屏
    requestFullscreen() {
      this.hlsPlyer.requestFullscreen();
    },
    // 退出全屏
    exitFullscreen() {
      this.hlsPlyer.exitFullscreen();
    },
    onPlayerLoadedData() {
      this.videoLoaded = true;
      this.$emit("change", { status: "init" });
    }
  },
  mounted() {
    this.initVideo(this.src);
  },
  async beforeDestroy() {
    try {
      this.$emit("change", { status: "stop" });
      this.hlsPlyer?.dispose();
      this.hlsPlyer = null;
    } catch (e) {
      throw new Error(e);
    }
  },
};
</script>
<style lang="less" scoped>
.live {
  width: 100%;
  height: 100%;
  // padding: 3px;
  video {
    object-fit: contain;
  }
  .snap {
    position: absolute;
    top: 5px;
    right: 5px;
    z-index: 1;
    background-color: rgba(0, 0, 0, 0);
    color: #fff;
  }
  .vjs-custom-skin {
    width: 100%;
    height: 100%;
  }
  .video-player ::v-deep {
    width: 100%;
    height: 100%;
    .video-js {
      width: 100%;
      height: 100%;
    }
    .vjs-control-bar {
      .fullscreen-enter {
        font-weight: normal;
        font-style: normal;
        border: 1px solid red;
        cursor: pointer;
        position: absolute;
        right: 0;
        top: 0;
      }
    }
    .vjs-control-bar {
      .vjs-icon-custombutton {
        cursor: pointer;
        font-family: VideoJS;
      }
      .vjs-icon-custombutton:before {
        content: "\f108";
        font-size: 1.8em;
        line-height: 1.67;
      }
    }

    .video-js .vjs-volume-panel.vjs-volume-panel-horizontal.vjs-hover,
    .video-js .vjs-volume-panel.vjs-volume-panel-horizontal:active,
    .video-js .vjs-volume-panel.vjs-volume-panel-horizontal:hover,
    .video-js .vjs-volume-panel.vjs-volume-panel-horizontal.vjs-slider-active {
      width: 10em;
      transition: width 0.1s;
      > .vjs-volume-control {
        width: 5em;
        height: 3em;
        margin-right: 0;
        margin-left: 0;
        opacity: 1;
      }
    }
  }
}
</style>
