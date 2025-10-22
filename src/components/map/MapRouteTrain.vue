<template>
  <div id="container" class="map-route-train">地图加载中...</div>
</template>

<script>
import { loadMP } from '@/v2/utils/map.js'
export default {
  name: 'MapRouteTrain',
  created() {
    // 延迟加载高德地图
    // if (!document.getElementById('amapscript')) {
    //     var secScript = document.createElement("script");
    //     secScript.setAttribute("type", "text/javascript");
    //     secScript.setAttribute("id", "amapscript");
    //     secScript.setAttribute("src", "https://webapi.amap.com/maps?v=1.4.15&key=c4aeac2b33af41a72874473226613edb");
    //     document.body.insertBefore(secScript, document.body.lastChild);
    // }
  },
  mounted() {
    this.initMap()
  },
  props: {
    siteInfo: {
      required: true,
    },
  },
  watch: {
    siteInfo: {
      handler(value) {
        this.initMap()
      },
    },
  },
  methods: {
    async initMap() {
      await loadMP()
      // 默认北京为中心，否则传入的第一个点为地图显示中心
      let mapCenter = [
        this.siteInfo[0] && this.siteInfo[0].longitude ? this.siteInfo[0] && this.siteInfo[0].longitude : 116.416262,
        this.siteInfo[0] && this.siteInfo[0].latitude ? this.siteInfo[0] && this.siteInfo[0].latitude : 39.910039,
      ]
      this.map = new AMap.Map('container', {
        resizeEnable: true,
        center: mapCenter,
        zoom: 4.5,
      })

      // 画点及路线
      let path = []
      this.siteInfo.forEach((item, index) => {
        let marker = ''
        if (!item.longitude || !item.latitude) return false
        if (index == 0 && item.type == 1) {
          // 起点
          marker = new AMap.Marker({
            position: new AMap.LngLat(item.longitude, item.latitude),
            offset: new AMap.Pixel(-12, -22),
            icon: require('../../assets/imgs/map/marker_start.png'),
            title: item.station,
            animation: 'AMAP_ANIMATION_DROP',
            label: item.station,
            zIndex: 110,
          })
        } else if (item.type == 3) {
          // 终点
          marker = new AMap.Marker({
            position: new AMap.LngLat(item.longitude, item.latitude),
            offset: new AMap.Pixel(-10, -25),
            title: item.station,
            icon: require('../../assets/imgs/map/marker_end.png'),
            animation: 'AMAP_ANIMATION_DROP',
            zIndex: 110,
          })
        } else {
          // 途经点
          marker = new AMap.Marker({
            position: new AMap.LngLat(item.longitude, item.latitude),
            offset: new AMap.Pixel(-8, -20),
            title: item.station,
            icon: require('../../assets/imgs/map/marker.png'),
            animation: 'AMAP_ANIMATION_DROP',
            zIndex: 110,
          })
        }
         marker.setLabel({
            offset: new AMap.Pixel(-8, 10),
            content: "<div class='marker_info'>" + item.station + '</div>',
            direction: 'right', //设置文本标注方位
            zIndex: 120,
          })
        this.map.add(marker)
        try {
          path.push(new AMap.LngLat(item.longitude, item.latitude))
        } catch (error) {
          throw new Error(error)
        }
      })
      let polyline = new AMap.Polyline({
        path: path || [],
        strokeWeight: 8,
        showDir:true,
        strokeColor: '#2EBB86', // 线条颜色
        lineJoin: 'round', // 折线拐点连接处样式
      })

      // 将折线添加至地图实例
      setTimeout(() => {
        this.map.add(polyline)
      }, 1000)

      const that = this
      AMap.plugin(['AMap.ToolBar'], function () {
        // 在图面添加工具条控件，工具条控件集成了缩放、平移、定位等功能按钮在内的组合控件
        that.map.addControl(
            new AMap.ToolBar({
              // 简易缩放模式，默认为 false
              liteStyle: true,
            })
        )
      })
    },
  },
}
</script>

<style lang="less">
.map-route-train {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  .marker_info {
    line-height: 24px;
    padding: 0 8px;
    border-radius: 4px;
    font-size: 14px;
    position: relative;
    height: 24px;
    background: rgba(30,39,57,0.7);
    color: #fff;
    p {
      line-height: 24px;
      margin: 0;
      padding: 0;
    }
  }
  .marker_info:before {
    box-sizing: content-box;
    width: 0px;
    height: 0px;
    position: absolute;
    top: 24px;
    left: 0;
    padding: 0;
    border-left: 6px solid rgba(30, 39, 57, 0.7);
    border-top: 6px solid transparent;
    border-bottom: 6px solid transparent;
    border-right: 6px solid transparent;
    margin-top: -6px;
    display: block;
    content: '';
    z-index: 12;
  }
  .amap-marker-label {
    border: none;
    background: transparent;
    top: -33px!important;
    left: 7px!important;
  }
  .amap-toolbar {
    top: -10px!important;
  }
  .amap-touch-toolbar .amap-zoomcontrol {
    top: 22px!important;
    right: 4px;
    bottom: 100%!important;
    height: 87px;
  }
}
</style>

