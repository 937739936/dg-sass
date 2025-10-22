<!-- eslint-disable no-undef -->
<template>
	<a-modal
		:visible="visible"
		@cancel="close"
		width="840px"
		:forceRender="true"
		:destroyOnClose="true"
		class="slModal"
		:footer="null"
	>
		<template slot="title">
			<div class="title">
				<div class="name">{{ title }}</div>
			</div>
		</template>
		<div
			class="location-content"
			v-if="title === '取样定位'"
		>
			<div
				class="map"
				id="circleMap"
			></div>
			<div class="location-info-contain">
				<div class="location-info-item">
					<div class="location-info-title">仓库名称：</div>
					<div
						class="location-info-des"
						v-if="detailInfo.stationName"
					>
						{{ detailInfo.stationName || '' }}
					</div>
				</div>
				<div class="location-info-item">
					<div class="location-info-title">电子围栏半径：</div>
					<div
						class="location-info-des"
						v-if="detailInfo.electronicFenceRadius"
					>
						{{ detailInfo.electronicFenceRadius || '' }}km
					</div>
				</div>
				<div class="location-info-item">
					<div class="location-info-title">仓库地址：</div>
					<div
						class="location-info-des"
						v-if="detailInfo.stationAddress"
					>
						{{ detailInfo.stationAddress || '' }}
					</div>
				</div>
				<div class="location-info-item">
					<div class="location-info-title">取样地址：</div>
					<div class="location-info-des">{{ detailInfo.samplingLocationAddress || '' }}</div>
					<div class="location-status" v-if="detailInfo.inside">
						<img
							class="address-ok"
							src="@/v2/assets/imgs/logisticsPlatform/indicator_normal.png"
							alt=""
						/>
						<div class="address-status-text">已处于站台围栏内</div>
					</div>
				</div>
			</div>
		</div>
		<div
			class="location-content"
			v-else
		>
			<div
				class="map"
				id="circleMap"
			></div>

			<div class="location-info-contain">
				<div class="location-info-item">
					<div class="location-info-title">送检地址：</div>
					<div
						class="location-info-des"
						v-if="detailInfo.submissionLocationAddress"
					>
						{{ detailInfo.submissionLocationAddress || '' }}
					</div>
				</div>
			</div>
		</div>
	</a-modal>
</template>

<script>
import { loadMP } from '@/v2/utils/map.js';

let inspectLocationIcon = require('../../../../../../assets/imgs/map/inspect-location.png');
// let inspectLocationIcon = null;
/*global AMap*/
export default {
	name: 'InspectLocationModal',
	data() {
		return {
			visible: false,
			spinning: false,
			detailInfo: {},
			mapMain: undefined,
			title: '取样定位'
		};
	},
	mounted() {
		this.initMap();
	},
	methods: {
		show(detailInfo, title) {
			this.title = title;
			this.detailInfo = detailInfo;
			this.visible = true;
			this.initMap();
		},
		close() {
			this.detailInfo = {};
			this.visible = false;
		},
		//绘制地图
		async initMap(flag) {
			await loadMP(flag);
			this.$nextTick(() => {
				this.mapMain = new AMap.Map('circleMap', {
					resizeEnable: true,
					center: [116.397506, 39.909152], // 北京
					zoom: 5
				});
				this.drawMapInfo();
			});
		},
		// 绘制地图信息
		drawMapInfo() {
			let overlayGroup = new AMap.OverlayGroup();
			this.overlayGroup = overlayGroup;
			overlayGroup.setMap(this.mapMain);
			overlayGroup.show();
			this.drawStatioEelectronicFences();
			this.drawInspectMarker();
			this.mapMain.setFitView(null, true, [200, 0, 0, 0]);
		},
		// 绘制站台的电子围栏圆
		drawStatioEelectronicFences() {
			if (this.title != '取样定位') {
				return;
			}
			if (!this.overlayGroup) {
				// 地图覆盖物群组不存在
				return;
			}
			let stationVO = this.detailInfo.stationVO ?? {};
			let lon = this.detailInfo.samplingLocationLongitude;
			let lat = this.detailInfo.samplingLocationLatitude;
			let radius = this.detailInfo.electronicFenceRadius;
			if (lon && lat && radius) {
				let circleEelectronicFences = new AMap.Circle({
					center: [lon, lat],
					radius: radius * 1000, //半径
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
				this.overlayGroup.addOverlay(circleEelectronicFences);
				this.drawStationMarker(lon, lat);
			}
		},
		drawStationMarker(lon, lat) {
			let fakeMarker = new AMap.Marker({
				position: [lon, lat],
				anchor: 'center',
				offset: new AMap.Pixel(0, 0),
				content: `<div class='circle'></div>`,
				zIndex: 9999
			});
			this.mapMain.add(fakeMarker);
			let stationAddress = this.detailInfo?.stationVO?.address ?? '';
			let markerLabel = new AMap.Marker({
				position: [lon, lat],
				anchor: 'bottom-center',
				offset: new AMap.Pixel(0, -20),
				content: `<div class="markerLabel markerLabelTop">${stationAddress}</div>`,
				zIndex: 999
			});
			fakeMarker.on('mouseover', () => {
				this.mapMain.add(markerLabel);
			});
			fakeMarker.on('mouseout', () => {
				this.mapMain.remove(markerLabel);
			});
		},
		// 巡库员位置
		drawInspectMarker() {
			let lon =
				this.title == '取样定位' ? this.detailInfo.samplingLocationLongitude : this.detailInfo.submissionLocationLongitude;
			let lat = this.title == '取样定位' ? this.detailInfo.samplingLocationLatitude : this.detailInfo.submissionLocationLatitude;
			let inspectAddress =
				this.title == '取样定位'
					? this.detailInfo.samplingLocationAddress ?? ''
					: this.detailInfo.submissionLocationAddress ?? '';
			if (!lon || !lat) {
				return;
			}
			let fakeMarker = new AMap.Marker({
				position: new AMap.LngLat(lon, lat),
				icon: new AMap.Icon({
					image: inspectLocationIcon,
					size: new AMap.Size(30, 30), //图标大小
					imageSize: new AMap.Size(30, 30)
				}),
				anchor: 'bottom-center',
				zIndex: 999,
				offset: new AMap.Pixel(0, 0)
			});
			this.mapMain.add(fakeMarker);
			let markerLabel = new AMap.Marker({
				position: [lon, lat],
				anchor: 'bottom-center',
				offset: new AMap.Pixel(0, -40),
				content: `<div class="markerLabel markerLabelTop">${inspectAddress}</div>`,
				zIndex: 999
			});
			fakeMarker.on('mouseover', () => {
				this.mapMain.add(markerLabel);
			});
			fakeMarker.on('mouseout', () => {
				this.mapMain.remove(markerLabel);
			});
		}
	}
};
</script>

<style lang="less" scoped>
.slModal {
	.closeIcon {
		width: 22px;
		height: 22px;
	}
	::v-deep {
		.ant-modal-mask,
		.ant-modal-wrap {
			z-index: 1002;
		}
		.ant-modal-header {
			padding: 0 20px;
			height: 58px;
			background-color: #f3f5f6;
			.ant-modal-title {
				height: 100%;
			}
		}
		.ant-modal-body {
			padding: 0px;
		}
		.ant-modal-footer {
			padding: 16px 20px;
		}
	}
	.title {
		display: flex;
		align-items: center;
		height: 100%;
		.name {
			font-size: 18px;
			color: rgba(#000, 0.8);
			font-weight: 500;
		}
	}
	.location-content {
		width: 100%;
		height: 570px;
		.map {
			position: absolute;
			width: 100%;
			height: 100%;
			//覆盖高德原有样式

			/deep/.amap-marker {
				.amap-marker-label {
					display: none;
				}
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

			/deep/.markerLabelTop::before {
				position: absolute;
				top: 100%;
				left: calc(50% - 7px);
				margin: auto;
				content: '';
				display: block;
				border-width: 7px;
				border-style: solid;
				width: 0;
				height: 0;
				border-color: #1f2329 transparent transparent transparent;
			}
		}
		.location-info-contain {
			position: absolute;
			left: 20px;
			right: 20px;
			top: 78px;
			// height: 100px;
			padding: 10px 20px;
			background: #ffffff;
			border-radius: 4px;
			box-shadow: 0px 0px 10px 0px #0000001a;
			.location-info-item {
				display: flex;
				flex-direction: row;
				font-size: 14px;
				margin: 10px 0;
				align-items: flex-start;
			}
			.location-info-title {
				color: #00000066;
				flex-shrink: 0;
			}
			.location-info-des {
				color: #000000cc;
				margin-left: 12px;
			}
			.location-status {
				display: flex;
				flex-direction: row;
				align-items: center;
				height: 22px;
				padding: 0 8px;
				margin-left: 10px;
				background: #dff9de;
				border-radius: 4px;
				flex-shrink: 0;
				.address-ok {
					width: 12px;
					height: 12px;
				}
				.address-status-text {
					margin-left: 8px;
					color: #45c041;
				}
			}
		}
	}
}

/deep/ .circle {
	width: 12px;
	height: 12px;
	background: #ffffff;
	border: 3px solid #1890ff;
	border-radius: 50%;
}
</style>
