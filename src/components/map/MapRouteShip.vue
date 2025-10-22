<template>
	<div class="main">
		<div
			id="container"
			class="map-route-ship"
		>
			地图加载中...
		</div>
		<div
			class="toolBar"
			v-if="toolBar"
		>
			<div
				class="toolBarItem"
				@click="mapSizeAdd"
			>
				<img
					width="18"
					src="~@/assets/imgs/map/map_size_add.png"
				/>
			</div>
			<div class="toolBarLine"></div>
			<div
				class="toolBarItem"
				@click="mapSizeDel"
			>
				<img
					width="12"
					src="~@/assets/imgs/map/map_size_del.png"
				/>
			</div>
		</div>
	</div>
</template>

<script>
import { cloneDeep } from 'lodash';
/*global AMap*/
const dirImg = require('../../assets/imgs/map/dirImg.png');
import { loadMP } from '@/v2/utils/map.js';
import { API_shipBoxShipTrackAddress, API_shipBoxGetDistanceByLocation } from 'api';
var mapMain,
	overlayGroup = {},
	hideTime,
	hoverMarker,
	hoverDataList = [];
export default {
	name: 'MapRouteShip',
	data() {
		return {
			toolBar: false
		};
	},
	mounted() {
		this.initMap();
		hoverDataList = [];
	},
	props: {
		shipData: {
			required: false,
			default: () => {
				return {
					historyShipType: true, //历史轨迹类型，判断轨迹最后一个点是终点还是当前点，默认（完结）终点true,false绘制为当前点
					historyShipData: [], //历史轨迹
					singleShipData: null, //当前坐标点
					portList: [] //电子围栏
				};
			}
		}
	},
	watch: {
		//历史轨迹重新渲染
		'shipData.historyShipData': {
			async handler() {
				await loadMP();
				mapMain = new AMap.Map('container', {
					resizeEnable: true,
					center: [116.416262, 39.910039], // 北京
					zoom: 5
				});
				this.setHistoryShipData();
			},
			deep: true,
			immediate: true
		},
		//当前坐标点重新渲染
		'shipData.singleShipData': {
			async handler() {
				await loadMP();
				mapMain = new AMap.Map('container', {
					resizeEnable: true,
					center: [116.416262, 39.910039], // 北京
					zoom: 5
				});
				this.setSingleShipData();
			}
		},
		//电子围栏重新渲染
		'shipData.portList': {
			async handler() {
				await loadMP();
				mapMain = new AMap.Map('container', {
					resizeEnable: true,
					center: [116.416262, 39.910039], // 北京
					zoom: 5
				});
				this.setPortList();
			}
		}
	},
	computed: {
		//是否到港
		historyShipType() {
			let { historyShipType = true } = this.shipData;
			return cloneDeep(historyShipType);
		},
		//轨迹
		historyShipData() {
			let { historyShipData = [] } = this.shipData;
			return cloneDeep(historyShipData);
		},
		//当前点
		singleShipData() {
			let { singleShipData = null } = this.shipData;
			return cloneDeep(singleShipData);
		},
		//电子围栏
		portList() {
			let { portList = [] } = this.shipData;
			return cloneDeep(portList);
		},
		//目的港
		destination() {
			let destination = this.portList.find(item => item.type == 'destination');
			return cloneDeep(destination);
		}
	},
	methods: {
		async initMap() {
			await loadMP();
			mapMain = new AMap.Map('container', {
				resizeEnable: true,
				center: [116.416262, 39.910039], // 北京
				zoom: 5
			});
			this.setHistoryShipData();
			this.setSingleShipData();
			this.setPortList();
		},
		//鼠标移出隐藏
		hoverkMarkerHide() {
			if (hoverMarker) {
				hideTime = setTimeout(() => {
					hoverMarker.hide();
				}, 300);
			}
		},
		//鼠标移动到点上是hoveri信息
		hoverkMarkerShow(data) {
			if (hoverMarker) {
				hoverMarker.show();
				if (hideTime) {
					clearTimeout(hideTime);
					hideTime = null;
				}
			}
			this.setHoverkMarker(data);
		},
		setHoverkMarker(data) {
			//比对数据，记录数据，如果当前数据没有具体位置时，请求接口调取
			let { lat, lon, gpsTime } = data;
			if (!hoverMarker) {
				let that = this;
				hoverMarker = new AMap.Marker({
					position: new AMap.LngLat(lon, lat),
					anchor: 'middle-left',
					map: mapMain,
					zIndex: 1000,
					offset: new AMap.Pixel(10, 0),
					extData: `${gpsTime}${lon}${lat}`
				});

				hoverMarker.on('mouseover', function () {
					hoverMarker.show();
					if (hideTime) {
						clearTimeout(hideTime);
						hideTime = null;
					}
				});
				hoverMarker.on('mouseout', function () {
					that.hoverkMarkerHide();
				});
			}
			let findData = hoverDataList.find(item => item.lat == lat && item.lon == lon && item.gpsTime == gpsTime);
			//如果数据不存在，进行数据添加
			if (!findData) {
				findData = data;
				hoverDataList.push(data);
			}
			let index = hoverDataList.findIndex(item => item.lat == lat && item.lon == lon && item.gpsTime == gpsTime);
			let infoList = [
				{ name: '时间', key: 'gpsTime' },
				{ name: '位置', key: 'address' }
			];
			//判断有无目的港
			let { destination } = this;
			//如果没有具体位置，请求接口判断
			if (!findData.address) {
				findData.address = '解析中...';
				hoverDataList[index] = findData;
				setTimeout(() => {
					this.getAddress(findData);
				}, 1);
			} else if (destination) {
				infoList.push({ name: '距离目的港(直线)', key: 'distance' });
				//如果没有距离，进行计算
				if (!findData.distance) {
					findData.distance = '计算中...';
					setTimeout(() => {
						this.destinationDistance(findData);
					}, 1);
				}
			}
			// 停留点
			if (findData.parkFlag === true) {
				// 删除时间
				infoList.shift();
				if (findData.durationDesc != null) {
					//
					infoList.push({ name: '停船时长', key: 'durationDesc' });
				}
				if (findData.startTime != null) {
					//
					infoList.push({ name: '开始时间', key: 'startTime' });
				}
				if (findData.endTime != null) {
					//
					infoList.push({ name: '结束时间', key: 'endTime' });
				}
			}
			let str = '';
			infoList.map(item => {
				let val = findData[item.key];
				str += '<div class="markerMainItem">';
				str += item.name + '：' + val;
				str += '</div>';
			});
			str = `<div class="markerLabel markerLabelLeft">${str}</div>`;
			hoverDataList[index] = findData;
			hoverMarker.setPosition(new AMap.LngLat(lon, lat));
			hoverMarker.setContent(str);
			hoverMarker.setExtData(`${gpsTime}${lon}${lat}`);
		},
		//获取详细地址
		async getAddress(data) {
			let { lat, lon, gpsTime, mmsi } = data;
			let address = await new Promise(resolve => {
				API_shipBoxShipTrackAddress({
					lon,
					lat,
					gpsTime,
					mmsi
				}).then(res => {
					if (res.success && res.data) {
						return resolve(res.data);
					} else {
						return resolve('未知');
					}
				});
			});
			let index = hoverDataList.findIndex(item => item.lat == lat && item.lon == lon && item.gpsTime == gpsTime);
			hoverDataList[index] = { ...hoverDataList[index], address };
			let extData = hoverMarker.getExtData();
			//如果是在当前态。进行数据替换
			if (extData == `${gpsTime}${lon}${lat}`) {
				this.setHoverkMarker(hoverDataList[index]);
			}
		},
		//计算距离
		async destinationDistance(data) {
			let { lat, lon, gpsTime } = data;
			let p1 = [this.destination.lon, this.destination.lat];
			let p2 = [lon, lat];
			let res = await API_shipBoxGetDistanceByLocation({
				startLocation: p1.toString(),
				endLocation: p2.toString()
			});
			let distance;
			if (res.success && res.data) {
				distance = res.data;
				distance = `${distance}公里`;
			} else {
				distance = '-';
			}
			let index = hoverDataList.findIndex(item => item.lat == lat && item.lon == lon && item.gpsTime == gpsTime);
			hoverDataList[index] = {
				...hoverDataList[index],
				distance
			};
			let extData = hoverMarker.getExtData();
			//如果是在当前态。进行数据替换
			if (extData == `${gpsTime}${lon}${lat}`) {
				this.setHoverkMarker(hoverDataList[index]);
			}
		},
		//轨迹渲染
		setHistoryShipData() {
			//将数据记录打包
			if (overlayGroup.historyShipData) {
				//清空原先记录
				overlayGroup.historyShipData.clearOverlays();
			} else {
				overlayGroup.historyShipData = new AMap.OverlayGroup();
			}
			overlayGroup.historyShipData.setMap(mapMain);
			if (this.historyShipData?.length) {
				// 画点及路线
				let path = [];
				var labelsLayer = new AMap.LabelsLayer({
					collision: true,
					zIndex: 118,
					allowCollision: true
				});
				let that = this;
				this.historyShipData.forEach((item, index) => {
					let marker = '';
					if (index == 0) {
						// 起点
						marker = new AMap.Marker({
							position: new AMap.LngLat(item.lon, item.lat),
							icon: new AMap.Icon({
								size: [34, 53],
								image: require('../../assets/imgs/map/map_ship_start.png'),
								imageSize: [34, 53]
							}),
							anchor: 'bottom-center',
							zIndex: 130,
							offset: new AMap.Pixel(0, 8)
						});
						marker.on('mouseover', function () {
							that.hoverkMarkerShow(item);
						});
						marker.on('mouseout', function () {
							that.hoverkMarkerHide();
						});
					} else if (index == this.historyShipData.length - 1) {
						// 终点
						//如果到港
						if (this.historyShipType) {
							marker = new AMap.Marker({
								position: new AMap.LngLat(item.lon, item.lat),
								icon: new AMap.Icon({
									size: [34, 53],
									image: require('../../assets/imgs/map/map_ship_end.png'),
									imageSize: [34, 53]
								}),
								anchor: 'bottom-center',
								zIndex: 130,
								offset: new AMap.Pixel(0, 8)
							});
							marker.on('mouseover', function () {
								that.hoverkMarkerShow(item);
							});
							marker.on('mouseout', function () {
								that.hoverkMarkerHide();
							});
						} else {
							//如果没有到，渲染成当前点
							marker = new AMap.Marker({
								position: new AMap.LngLat(item.lon, item.lat),
								icon: new AMap.Icon({
									image: require('../../assets/imgs/map/ship-location.png'),
									size: new AMap.Size(32, 32), //图标大小
									imageSize: new AMap.Size(32, 32)
								}),
								zIndex: 140,
								offset: new AMap.Pixel(-10, -25)
							});
							marker.on('mouseover', function () {
								that.hoverkMarkerShow(item);
							});
							marker.on('mouseout', function () {
								that.hoverkMarkerHide();
							});
						}
					} else {
						let labelMarker,
							image,
							rank = 1,
							anchor = 'center',
							size = [14, 14];
						if (item.parkFlag === true) {
							image = require('../../assets/imgs/map/marker_stop.png');
							anchor = [17, 44];
							size = [34, 51];
							rank = 2;
						} else {
							// 途经点
							image = require('../../assets/imgs/map/marker_dot.png');
						}
						labelMarker = new AMap.LabelMarker({
							position: [item.lon, item.lat],
							icon: {
								image: image,
								anchor,
								size
							},
							rank
						});
						labelMarker.on('mouseover', function () {
							that.hoverkMarkerShow(item);
						});
						labelMarker.on('mouseout', function () {
							that.hoverkMarkerHide();
						});
						labelsLayer.add(labelMarker);
					}
					if (marker) {
						overlayGroup.historyShipData.addOverlay(marker);
					}
					path.push(new AMap.LngLat(item.lon, item.lat));
				});
				if (path.length) {
					//渲染路径
					let line1 = new AMap.Polyline({
						path: path,
						isOutline: true,
						outlineColor: '#0047FF',
						borderWeight: 2, // 描边的宽度，默认为 1
						strokeWeight: 4, // 线条宽度，默认为 1
						strokeColor: '#4988FF', // 线条颜色
						showDir: false,
						zIndex: 50,
						strokeOpacity: 1, //透明度
						lineJoin: 'round' // 折线拐点连接处样式
					});
					overlayGroup.historyShipData.addOverlay(line1);
					//双路径，提供箭头
					let line2 = new AMap.Polyline({
						path: path,
						strokeWeight: 20, // 线条宽度，默认为 1
						showDir: true,
						strokeColor: 'RGBA(0,0,0,0)', // 线条颜色
						dirImg,
						zIndex: 51,
						strokeOpacity: 1, //透明度
						lineJoin: 'round' // 折线拐点连接处样式
					});
					overlayGroup.historyShipData.addOverlay(line2);
				}
				overlayGroup.historyShipData.addOverlay(labelsLayer);
				// //展示工具栏
				this.toolBar = true;
				mapMain.setFitView();
			}
		},
		//当前坐标点渲染
		setSingleShipData() {
			//将数据记录打包
			if (overlayGroup.singleShipData) {
				//清空原先记录
				overlayGroup.singleShipData.clearOverlays();
			} else {
				overlayGroup.singleShipData = new AMap.OverlayGroup();
			}
			overlayGroup.singleShipData.setMap(mapMain);
			if (this.singleShipData?.lon) {
				let marker = '';
				marker = new AMap.Marker({
					position: new AMap.LngLat(this.singleShipData.lon, this.singleShipData.lat),
					icon: new AMap.Icon({
						image: require('../../assets/imgs/map/ship-location.png'),
						size: new AMap.Size(32, 32), //图标大小
						imageSize: new AMap.Size(32, 32)
					}),
					zIndex: 140,
					offset: new AMap.Pixel(-10, -25)
				});
				let that = this;
				marker.on('mouseover', function () {
					that.hoverkMarkerShow(that.singleShipData);
				});
				marker.on('mouseout', function () {
					that.hoverkMarkerHide();
				});
				overlayGroup.singleShipData.addOverlay(mapMain);
				//展示工具栏
				this.toolBar = true;
				mapMain.setFitView();
			}
		},
		//电子围栏
		setPortList() {
			//将数据记录打包
			if (overlayGroup.portList) {
				//清空原先记录
				overlayGroup.portList.clearOverlays();
			} else {
				overlayGroup.portList = new AMap.OverlayGroup();
			}
			overlayGroup.portList.setMap(mapMain);
			if (this.portList?.length) {
				this.portList.map(item => {
					if (item.lon && item.lat && item.radius) {
						//圆
						let circleMap = new AMap.Circle({
							center: [item.lon, item.lat],
							radius: item.radius * 1000, //半径
							strokeColor: '#0047FF',
							strokeOpacity: 1,
							strokeWeight: 2,
							fillOpacity: 0.1,
							strokeStyle: 'dashed',
							strokeDasharray: [2, 2],
							// 线样式还支持 'dashed'
							fillColor: 'rgba(73, 136, 255)',
							zIndex: 50
						});
						overlayGroup.portList.addOverlay(circleMap);
						//圆心点
						let text = '';
						if (item.type == 'origin') {
							text = '始发港：';
						} else if (item.type == 'destination') {
							text = '目的港：';
						}
						text += item.address;
						let markerLabel = new AMap.Marker({
							position: [item.lon, item.lat],
							icon: new AMap.Icon({
								size: [26, 43],
								image: require('../../assets/imgs/map/marker_circ.png'),
								imageSize: [26, 43]
							}),
							anchor: 'bottom-center',
							label: {
								offset: new AMap.Pixel(-10, 14),
								content: `<div class="markerLabel markerLabelRight">${text}</div>`,
								direction: 'left' //设置文本标注方位
							},
							offset: new AMap.Pixel(0, 7),
							zIndex: 49
						});
						overlayGroup.portList.addOverlay(markerLabel);
						//半径
						let bounds = circleMap.getBounds();
						let point_lon = bounds.northeast.lng,
							point_lat = (bounds.northeast.lat + bounds.southwest.lat) / 2;
						let path = [circleMap.getCenter(), new AMap.LngLat(point_lon, point_lat)];
						// 绘制
						let polyline = new AMap.Polyline({
							path: path,
							strokeWeight: 2,
							strokeColor: '#0047FF',
							strokeStyle: 'dashed',
							strokeDasharray: [2, 2]
						});
						overlayGroup.portList.addOverlay(polyline);
						//半径标注
						let text_lon = (circleMap.getCenter().lng + point_lon) / 2;
						let text_lat = point_lat;
						// 绘制
						let polytext = new AMap.Text({
							text: `半径${item.radius}km`,
							anchor: 'top-center', // 设置文本标记锚点
							style: {
								'background-color': 'transparent',
								border: 'none',
								'font-size': '14px',
								'line-height': '28px',
								color: '#4988FF'
							},
							zooms: [10, 20],
							position: [text_lon, text_lat]
						});
						overlayGroup.portList.addOverlay(polytext);
					}
				});
				mapMain.setFitView();
			}
		},
		//地图放大比例
		mapSizeAdd() {
			let currentZoom = mapMain.getZoom();
			if (currentZoom < 20) {
				mapMain.setZoom(currentZoom + 1);
			}
		},
		//地图缩小比例
		mapSizeDel() {
			let currentZoom = mapMain.getZoom();
			if (currentZoom > 2) {
				mapMain.setZoom(currentZoom - 1);
			}
		}
	}
};
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
		height: 87px;
		background: #ffffff;
		.toolBarItem {
			width: 33px;
			height: 43px;
			background: #ffffff;
			box-shadow: 0px 1px 2px 2px rgba(6, 31, 77, 0.05);
			border-radius: 1px;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: center;
			cursor: pointer;
		}
		.toolBarLine {
			width: 23px;
			height: 1px;
			background: #ddd;
			position: absolute;
			left: 5px;
		}
	}
	.map-route-ship {
		height: 100%;
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		/deep/.amap-marker-label {
			border: none;
			background: none;
			padding: 0;
			border: 0;
			background: none;
		}

		/deep/.markerLabel {
			padding: 8px 12px;
			background: #1f2329;
			border-radius: 4px;
			font-family: 'PingFang SC';
			font-style: normal;
			font-weight: 400;
			font-size: 12px;
			line-height: 22px;
			color: #ffffff;
			position: relative;
			top: 0;
			left: 0;
			border: 0;
			white-space: nowrap;
		}

		/deep/.markerLabelRight::before {
			position: absolute;
			top: 0;
			bottom: 0;
			margin: auto;
			left: 100%;
			content: '';
			display: block;
			border-width: 7px;
			border-style: solid;
			width: 0;
			height: 0;
			border-color: transparent transparent transparent #1f2329;
		}
		/deep/.markerLabelLeft::before {
			position: absolute;
			top: 0;
			bottom: 0;
			margin: auto;
			right: 100%;
			content: '';
			display: block;
			border-width: 7px;
			border-style: solid;
			width: 0;
			height: 0;
			border-color: transparent #1f2329 transparent transparent;
		}
	}
}
</style>
