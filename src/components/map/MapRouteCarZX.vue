<template>
    <div class="main">
        <div id="container" class="map-route-car">地图加载中...</div>
        <div class="toolBar" v-if="toolBar">
            <div class="toolBarItem" @click="mapSizeAdd">
                <img width="18" src="~@/assets/imgs/map/map_size_add.png" />
            </div>
            <div class="toolBarItem" @click="mapSizeDel">
                <img width="12" src="~@/assets/imgs/map/map_size_del.png" />
            </div>
        </div>
    </div>
</template>

<script>
/*global AMap*/
import { loadMP } from '@/v2/utils/map.js'
export default {
    name: 'MapRouteCarZX',
    data() {
        return {
            toolBar: false,
        }
    },
    mounted() {

        this.initMap()
    },
    props: {
        siteInfo: {
            required: true,
        },
        plateNumber: {
            type: String,
            default: '',
        },
    },
    watch: {
        siteInfo() {
            this.initMap()
        },
    },
    methods: {
        async initMap() {
            await loadMP()
            this.map = new AMap.Map('container', {
                resizeEnable: true,
                center: [116.416262, 39.910039], // 北京
                zoom: 5,
            })
            // 默认北京为中心，否则传入的第一个点和最后一个点的中点为地图显示中心
            if (this.siteInfo?.tracks && this.siteInfo.tracks[0]) {
                let that = this
                let mapCenter = []
                let start = this.siteInfo.tracks[0]
                let end = this.siteInfo.tracks[this.siteInfo.tracks.length - 1]
                mapCenter = [(Number(start.lon) + Number(end.lon)) / 2, (Number(start.lat) + Number(end.lat)) / 2]
                this.map.setCenter(mapCenter)
                // 画点及路线
                let path = []
                let mapCar = require('../../assets/imgs/map/map_car.png')
                this.siteInfo.tracks.forEach((item, index) => {
                    let marker = ''
                    if (index == 0) {
                        // 起点
                        marker = new AMap.Marker({
                            position: new AMap.LngLat(item.lon, item.lat),
                            icon: new AMap.Icon({
                                image: require('../../assets/imgs/map/map_car_start.png'),
                                size: new AMap.Size(21, 25), //图标大小
                                imageSize: new AMap.Size(21, 25),
                            }),
                            offset: new AMap.Pixel(-10, -25),
                            animation: 'AMAP_ANIMATION_DROP',
                        })
                        marker.on('mouseover', function () {
                            marker.setTop(true);
                            marker.setLabel({
                                content:
                                    `<div class="map-info">` +
                                    `<div class="map-info-header"><img width="18" src="${mapCar}" />${that.plateNumber}</div>` +
                                    `<div class="map-info-main">` +
                                    `<div class="map-info-main-item">时间:${item.gpsTime}</div>` +
                                    `<div class="map-info-main-item">速度:${item.speed}km/h</div>` +
                                    `<div class="map-info-main-item">方向:${item.direction}</div>` +
                                    `<div class="map-info-main-item">位置:${that.siteInfo.startPoint}</div>` +
                                    `</div>` +
                                    `</div>`,
                                offset: new AMap.Pixel(20, -80),
                            })
                        })
                        marker.on('mouseout', function () {
                            marker.setTop(false);
                            marker.setLabel({})
                        })
                    } else if (index == this.siteInfo.tracks.length - 1) {
                        // 终点
                        marker = new AMap.Marker({
                            position: new AMap.LngLat(item.lon, item.lat),
                            icon: new AMap.Icon({
                                image: require('../../assets/imgs/map/map_car_end.png'),
                                size: new AMap.Size(21, 25), //图标大小
                                imageSize: new AMap.Size(21, 25),
                            }),
                            offset: new AMap.Pixel(-10, -25),
                            animation: 'AMAP_ANIMATION_DROP',
                        })
                        marker.on('mouseover', function () {
                            marker.setTop(true);
                            marker.setLabel({
                                content:
                                    `<div class="map-info">` +
                                    `<div class="map-info-header"><img width="18" src="${mapCar}" />${that.plateNumber}</div>` +
                                    `<div class="map-info-main">` +
                                    `<div class="map-info-main-item">时间:${item.gpsTime}</div>` +
                                    `<div class="map-info-main-item">速度:${item.speed}km/h</div>` +
                                    `<div class="map-info-main-item">方向:${item.direction}</div>` +
                                    `<div class="map-info-main-item">位置:${that.siteInfo.endPoint}</div>` +
                                    `</div>` +
                                    `</div>`,
                                offset: new AMap.Pixel(20, -80),
                            })
                        })
                        marker.on('mouseout', function () {
                            marker.setTop(false);
                            marker.setLabel({})
                        })
                    }
                    this.map.add(marker)
                    path.push(new AMap.LngLat(item.lon, item.lat))
                })

                this.siteInfo.parks.forEach((item, index) => {
                    // 停车点
                    let marker = new AMap.Marker({
                        position: new AMap.LngLat(item.lon, item.lat),
                        icon: new AMap.Icon({
                            image: require('../../assets/imgs/map/map_car_stop.png'),
                            size: new AMap.Size(21, 21), //图标大小
                            imageSize: new AMap.Size(21, 21),
                        }),
                        offset: new AMap.Pixel(-10, -10),
                        animation: 'AMAP_ANIMATION_DROP',
                    })
                    marker.on('mouseover', function () {
                        marker.setTop(true);
                        marker.setLabel({
                            content:
                                `<div class="map-info">` +
                                `<div class="map-info-header"><img width="18" src="${mapCar}" />${that.plateNumber}</div>` +
                                `<div class="map-info-main">` +
                                `<div class="map-info-main-item">停留开始时间:${item.parkStartTime}</div>` +
                                `<div class="map-info-main-item">停留持续时间(分):${item.partDuration}</div>` +
                                `<div class="map-info-main-item">停留结束时间:${item.parkEndTime}</div>` +
                                `<div class="map-info-main-item">地址:${item.partAddress}</div>` +
                                `</div>` +
                                `</div>`,
                            offset: new AMap.Pixel(20, -80),
                        })
                    })
                    marker.on('mouseout', function () {
                        marker.setTop(false);
                        marker.setLabel({})
                    })
                    this.map.add(marker)
                })
                //渲染路径
                new AMap.Polyline({
                    map: this.map,
                    path: path,
                    strokeWeight: 4, // 线条宽度，默认为 1
                    strokeColor: '#6999F2', // 线条颜色
                    lineJoin: 'round', // 折线拐点连接处样式
                })
                //伸缩合适比例
                this.map.setFitView()
                //展示工具栏
                this.toolBar = true
            }
        },
        //地图放大比例
        mapSizeAdd() {
            let currentZoom = this.map.getZoom()
            if (currentZoom < 20) {
                this.map.setZoom(currentZoom + 1)
            }
        },
        //地图缩小比例
        mapSizeDel() {
            let currentZoom = this.map.getZoom()
            if (currentZoom > 2) {
                this.map.setZoom(currentZoom - 1)
            }
        },
    },
}
</script>

<style lang="less" scoped>
.main {
    position: relative;
    height: 100%;
    width: 100%;
    .toolBar {
        position: absolute;
        top: 32px;
        right: 16px;
        .toolBarItem {
            width: 26px;
            height: 26px;
            background: #ffffff;
            box-shadow: 0px 1px 2px 2px rgba(6, 31, 77, 0.05);
            border-radius: 1px;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            margin-bottom: 4px;
            cursor: pointer;
        }
    }
}
.map-route-car {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    /deep/.amap-marker-label {
        border: 0;
        background: none;
        white-space: wrap;
    }
    /deep/.map-info {
        width: 218px;
        height: auto;
        background: #ffffff;
        box-shadow: 2px 2px 9px 1px rgba(6, 31, 77, 0.08);
        border-radius: 6px;
        overflow: hidden;
        &:after {
            position: absolute;
            content: '';
            border-right: 12px solid #fff;
            border-top: 12px solid transparent;
            border-bottom: 12px solid transparent;
            top: 90px;
            margin-bottom: -12px;
            left: -6px;
        }
        .map-info-header {
            width: 100%;
            height: 40px;
            background: #4682f3;
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #ffffff;
            line-height: 22px;
            display: flex;
            flex-direction: row;
            align-items: center;
            padding: 0 18px;
            img {
                margin-right: 6px;
            }
        }
        .map-info-main {
            padding: 10px 18px;
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: rgba(0, 0, 0, 0.8);
            line-height: 22px;
            .map-info-main-item {
                white-space: wrap;
                white-space: pre-wrap;
                &:not(:last-child) {
                    margin-bottom: 4px;
                }
            }
        }
    }
}
</style>
