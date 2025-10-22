<template>
  <div id="container" class="map-route-car">地图加载中...</div>
</template>

<script>
import { loadMP } from '@/v2/utils/map.js'
export default {
  name : "MapRouteCar",
  mounted() {

  },
  props:{
    siteInfo:{
      required:true
    },
    finishTime: {
      type: String,
      default: ''
    }
  },
  watch:{
    siteInfo(){
      this.initMap();
    }
  },
  methods:{
    async initMap(){
      await loadMP()
      // 默认北京为中心，否则传入的第一个点和最后一个点的中点为地图显示中心
      let mapCenter = []
      if (this.siteInfo[0]){
        let start = this.siteInfo[0]
        let end = this.siteInfo[this.siteInfo.length-1]
        mapCenter = [(Number(start.longitude)+Number(end.longitude))/2, (Number(start.latitude)+Number(end.latitude))/2]
      } else {
        mapCenter = [116.416262, 39.910039] // 北京
      }
      this.map =  new AMap.Map('container', {
        resizeEnable: true,
        center: mapCenter,
        zoom: 7
      });

      // 画点及路线
      let path = [];
      this.siteInfo.forEach((item, index)=>{
        if (item.longitude && item.latitude) {
          let marker = ''
          if (index == 0) {
            // 起点
            marker = new AMap.Marker({
              position: new AMap.LngLat(item.longitude,item.latitude),
              icon: new AMap.Icon({
                image: require('../../assets/imgs/map/marker_start_car.png'),
                size: new AMap.Size(30, 40),  //图标大小
                imageSize: new AMap.Size(30,40)
              }),
              animation:"AMAP_ANIMATION_DROP",
              offset: new AMap.Pixel(-16, -38)
            })
            this.map.add(marker);
          } else if (index == this.siteInfo.length-1) {
            if (this.finishTime) {
              // 卸货点
              marker = new AMap.Marker({
                position: new AMap.LngLat(item.longitude,item.latitude),
                icon: new AMap.Icon({
                  image: require('../../assets/imgs/map/marker_end_car.png'),
                  size: new AMap.Size(30, 40),  //图标大小
                  imageSize: new AMap.Size(30,40)
                }),
                animation:"AMAP_ANIMATION_DROP",
                offset: new AMap.Pixel(-16, -38)
              })
            } else {
              // 当前点
              marker = new AMap.Marker({
                position: new AMap.LngLat(item.longitude,item.latitude),
                icon: new AMap.Icon({
                  image: require('../../assets/imgs/map/marker_car.png'),
                  size: new AMap.Size(30, 40),  //图标大小
                  imageSize: new AMap.Size(30,40)
                }),
                animation:"AMAP_ANIMATION_DROP",
                offset: new AMap.Pixel(-16, -38)
              })
            }
            this.map.add(marker);
          }
          path.push(new AMap.LngLat(item.longitude,item.latitude))
        }
      })
      let polyline = new AMap.Polyline({
        path: path,
        strokeWeight: 5, // 线条宽度，默认为 1
        strokeColor: 'green', // 线条颜色
        lineJoin: 'round' // 折线拐点连接处样式
      });

      // 将折线添加至地图实例
      setTimeout(()=>{
        this.map.add(polyline);
        polyline.show()
      },1000)



      const that = this
      AMap.plugin([
        'AMap.ToolBar',
      ], function(){
        // 在图面添加工具条控件，工具条控件集成了缩放、平移、定位等功能按钮在内的组合控件
        that.map.addControl(new AMap.ToolBar({
          // 简易缩放模式，默认为 false
          liteStyle: true
        }));
      });
    }
  }
}
</script>

<style lang="less" scoped>
.map-route-car{
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  .amap-marker-label{border:none;background: transparent}
}
</style>
