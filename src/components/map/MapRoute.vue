<template>
    <div id="container">地图加载中...</div>
</template>

<script>
    import { loadMP } from '@/v2/utils/map.js'
    export default {
        name : "MapRoute",
        mounted() {

        },
        props:{
            siteInfo:{
                required:true
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
                // 默认北京为中心，否则传入的第一个点为地图显示中心
                let mapCenter = [this.siteInfo[0] && this.siteInfo[0].longitude ? this.siteInfo[0] && this.siteInfo[0].longitude : 116.416262,this.siteInfo[0] && this.siteInfo[0].latitude ? this.siteInfo[0] && this.siteInfo[0].latitude : 39.910039];
                this.map =  new AMap.Map('container', {
                    resizeEnable: true,
                    center: mapCenter,
                    zoom: 5
                });

                // 画点及路线
                let path = [];
                this.siteInfo.forEach((item,index)=>{
                    let marker = "";
                    // 处理坐标是空的数据
                    if (!item.longitude || !item.latitude) return false
                    if(index ==0){
                        // 起点
                        marker = new AMap.Marker({
                            position: new AMap.LngLat(item.longitude,item.latitude),
                            offset: new AMap.Pixel(-10, -25),
                            icon: require('../../assets/imgs/map/marker_start.png'),
                            title:item.station,
                            animation:"AMAP_ANIMATION_DROP",
                            label:item.station
                        });
                    }else if(index == this.siteInfo.length-1 && item.type!=3){
                        // 途经点的最后一个
                        marker = new AMap.Marker({
                            position: new AMap.LngLat(item.longitude,item.latitude),
                            offset: new AMap.Pixel(-16, -20),
                            title:item.station,
                            icon: require('../../assets/imgs/map/marker.png'),
                            animation:"AMAP_ANIMATION_DROP",
                        });
                        setTimeout(()=>{
                            marker.setLabel({
                                offset: new AMap.Pixel(-8, 10),
                                content: "<div class='marker_info'>" + item.station + "</div>",
                                direction: 'right' //设置文本标注方位
                            });
                        },1000)
                    }else if(item.type ==3){
                        // 终点
                        marker = new AMap.Marker({
                            position: new AMap.LngLat(item.longitude,item.latitude),
                            offset: new AMap.Pixel(-10, -25),
                            title:item.station,
                            icon: require('../../assets/imgs/map/marker_end.png'),
                            animation:"AMAP_ANIMATION_DROP",
                        });
                    } else{
                        // 途经点
                        marker = new AMap.Marker({
                            position: new AMap.LngLat(item.longitude,item.latitude),
                            offset: new AMap.Pixel(-10, -20),
                            title:item.station,
                            icon: require('../../assets/imgs/map/marker.png'),
                            animation:"AMAP_ANIMATION_DROP",
                        });
                    }
                    this.map.add(marker);
                    path.push(new AMap.LngLat(item.longitude,item.latitude));
                })
                let polyline = new AMap.Polyline({
                    path: path,
                    borderWeight: 2, // 线条宽度，默认为 1
                    strokeColor: '#E64F40', // 线条颜色
                    lineJoin: 'round' // 折线拐点连接处样式
                });

                // 将折线添加至地图实例
                setTimeout(()=>{
                    this.map.add(polyline);
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

<style lang="less">
    #container{
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;

        .marker_info{
            width:98px;
            height: 32px;
            line-height: 32px;
            padding-left: 15px;
            background: url("../../assets/imgs/map/marker_info.png");
            font-size: 14px;
        }
        .amap-marker-label{border:none;background: transparent}
    }
</style>
