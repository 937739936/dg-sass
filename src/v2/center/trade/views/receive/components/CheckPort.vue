<template>
	<a-modal
		width="1100px"
		:visible="visible"
		:title="null"
		centered
		forceRender
		@cancel="hide"
		:footer="null"
	>
		<div class="title">{{ typeName }}录入</div>
		<div class="main">
			<div
				class="map"
				id="circleMap"
			></div>
			<div class="slMain mapCon">
				<a-form
					:form="form"
					:colon="false"
					class="slFormDetail"
				>
					<a-form-item :label="`${typeName}名称`">
						<a-input
							:placeholder="`请输入${typeName}名称`"
							:maxLength="50"
							v-decorator="['name', formRules.name]"
						/>
					</a-form-item>
					<a-form-item label="港口名称">
						<a-select
							showSearch
							allowClear
							placeholder="请搜索港口地址"
							:notFoundContent="selectLoading ? '加载中...' : '暂无数据'"
							:default-active-first-option="false"
							:show-arrow="false"
							:filter-option="false"
							:getPopupContainer="getPopupContainer"
							:not-found-content="null"
							optionLabelProp="portName"
							@search="handleCircleSearch"
							v-decorator="['circle', formRules.circle]"
						>
							<a-select-option
								v-for="item in PortSearch"
								:key="`${item.originPortLat}${item.originPortLon}`"
								:portName="item.portName"
							>
								{{ item.portName }}<br />
								<a-tooltip>
									<template slot="title">
										{{ item.portDetailAddress }}
									</template>
									<span class="address">{{ item.portDetailAddress }}</span>
								</a-tooltip>
							</a-select-option>
						</a-select>
					</a-form-item>
					<a-form-item label="港口电子围栏半径(KM)">
						<a-input-number
							placeholder="请输入电子围栏半径(KM)"
							v-decorator="['radius', formRules.radius]"
							:min="1"
							:step="1"
							:precision="0"
							:max="20"
						/>
					</a-form-item>
				</a-form>
			</div>
		</div>
		<div class="footer">
			<a-button @click="hide">取消</a-button>
			<a-button
				type="primary"
				@click="affirm"
				>确认</a-button
			>
		</div>
	</a-modal>
</template>
<script>
import { getPopupContainer } from '@/v2/utils/factory.js';
import { API_deliverGetPortSearchHistorys, API_deliverShipPortSearchLogSave } from '@/v2/center/trade/api/receive';
import { API_shipBoxGetPortListByKeyword } from 'api';
import { loadMP } from '@/v2/utils/map.js';
import { geocodeInverse } from '@/v2/api/common';
/*global AMap*/
/*
 * mapMain地图主体
 * circleEditor修改圆
 * circleMap圆主体
 * polyline线，半径主体
 * polytext文本标注
 * MarkerLabel详细地址主体
 * circleRadius半径变动时记录
 * circlePosition圆心点位置变化时记录
 * timeout定时函数
 * overlayGroup 高德覆盖物群组，打包一起操作
 * geocoder高德坐标解析
 * autoComplete高德检索组件
 */
var mapMain,
	circleEditor,
	circleMap,
	polyline,
	polytext,
	circleRadius,
	circlePosition,
	markerLabel,
	timeout1,
	timeout2,
	timeout3,
	overlayGroup,
	geocoder;
export default {
	data() {
		return {
			visible: false,
			form: this.$form.createForm(this, {
				onValuesChange: this.onValuesChange
			}),
			formRules: {
				name: {
					rules: [
						{
							required: true,
							message: `请输入港口名称`,
							whitespace: true
						}
					]
				},
				circle: {
					rules: [
						{
							required: true,
							message: `请搜索港口地址`,
							whitespace: true
						}
					]
				},
				radius: {
					rules: [
						{
							required: true,
							message: `请输入数值`
						}
					],
					initialValue: 5 //设置默认值
				}
			},
			selectLoading: false, //港口检索状态
			PortSearchHistory: [], //历史数据
			circleData: [], //加载数据
			circleValue: '', //港口输入时记录
			circle: {
				name: '',
				address: '',
				remove: false, //是否添加点
				lat: '',
				lon: '',
				radius: 5,
				type: '' //港口类型
			}
		};
	},
	computed: {
		PortSearch() {
			let data = [];
			//如果有输入值，加载高德返回，否则限制历史默认
			if (this.circleValue) {
				let circleData = this.circleData;
				data = [...circleData];
			} else {
				let PortSearchHistory = this.PortSearchHistory;
				data = [...PortSearchHistory];
			}
			//如果有移动点，进行插入
			let { circle } = this;
			if (circle.remove) {
				//如果当前值再记录中，不进行添加，否则添加新值
				if (!data.some(item => `${item.originPortLat}${item.originPortLon}` == `${circle.lat}${circle.lon}`)) {
					data.unshift({
						portName: circle.name, //港口名称
						portDetailAddress: circle.address, //港口详细地址
						originPortLat: circle.lat, //港口纬度
						originPortLon: circle.lon //港口经度
					});
				}
			}
			return data;
		},
		typeName() {
			let { type } = this.circle;
			let typeName = '港口';
			//始发港
			if (type == 'origin') {
				typeName = '始发港';
			} else if (type == 'destination') {
				typeName = '目的港';
			}
			return typeName;
		}
	},
	mounted() {
		this.initMap();
	},
	methods: {
		getPopupContainer,
		//查询当前用户最新20条港口地址
		async getPortSearchHistory() {
			this.selectLoading = true;
			let res = await API_deliverGetPortSearchHistorys();
			if (res.success) {
				this.PortSearchHistory = res.data;
			}
			this.selectLoading = false;
		},
		//加载弹框
		async show(circle) {
			//查询当前用户最新20条港口地址
			await this.getPortSearchHistory();
			this.visible = true;
			this.circle = { ...this.circle, ...circle };
			//有半径渲染半径
			if (circle.radius) {
				this.$nextTick(() => {
					this.form.setFieldsValue({
						radius: circle.radius
					});
				});
			}
			//有详细地址渲染表单地址
			if (circle.lon && circle.lat && circle.address && circle.name) {
				//如果当前值再记录中，不进行添加，否则添加新值
				if (!this.PortSearch.some(item => `${item.originPortLat}${item.originPortLon}` == `${circle.lat}${circle.lon}`)) {
					this.circle = { ...this.circle, remove: true };
				}
				this.$nextTick(() => {
					this.form.setFieldsValue({
						circle: `${circle.lat}${circle.lon}`,
						name: circle.name
					});
				});
			}
			//绘图
			this.setCircle();
		},
		//关闭弹框，清空数据
		hide() {
			this.visible = false;
			this.circle = {
				name: '',
				address: '',
				remove: false, //是否添加点
				lat: '',
				lon: '',
				radius: 5
			};
			this.circleValue = '';
			//清空视图
			mapMain.clearMap();
			circleEditor = null;
			this.form.resetFields();
		},
		//确认提交
		affirm() {
			this.form.validateFieldsAndScroll((error, values) => {
				if (!error) {
					let circle = { ...this.circle };
					//提交保存当前港口
					API_deliverShipPortSearchLogSave({
						portName: circle.name, //港口名称
						portDetailAddress: circle.address, //港口详细地址
						originPortLat: circle.lat, //港口纬度
						originPortLon: circle.lon //港口经度
					});
					if (this.$listeners.selectPort) {
						this.$emit('selectPort', { ...circle, name: values.name });
					}
					this.hide();
				}
			});
		},
		//表单发生变化
		onValuesChange(props, values) {
			let { circle } = this;
			//港口方式发生变更
			if (values.hasOwnProperty('circle')) {
				//如果选中港口
				if (values.circle) {
					let circlePort = this.PortSearch.find(item => `${item.originPortLat}${item.originPortLon}` == values.circle);
					if (circlePort.originPortLon != circle.lon || circlePort.originPortLat != circle.lat) {
						// 替换经纬度
						this.circle = {
							...circle,
							remove: false,
							name: circlePort.portName,
							address: circlePort.portDetailAddress,
							lon: circlePort.originPortLon,
							lat: circlePort.originPortLat
						};
					}
				} else {
					// 如果是清空
					// 替换经纬度
					this.circle = {
						...circle,
						remove: false,
						name: '',
						address: '',
						lat: '',
						lon: ''
					};
					//清空检索值
					this.circleValue = '';
				}
				//重绘图像
				this.setCircle();
			}
			//半径发生变化
			if (values.hasOwnProperty('radius')) {
				let radius = values.radius && Number(values.radius);
				this.circle = { ...circle, radius };
				//重绘图像
				this.setCircle();
			}
		},
		//查询地址
		handleCircleSearch(value) {
			this.selectLoading = true;
			this.circleData = [];
			this.fetchCircle(value, data => {
				this.selectLoading = false;
				this.circleData = data;
			});
		},
		//关键字查询
		fetchCircle(value, callback) {
			if (timeout1) {
				clearTimeout(timeout1);
				timeout1 = null;
			}
			this.circleValue = value;
			let { circleValue } = this;
			if (!value) return;
			function fake() {
				API_shipBoxGetPortListByKeyword({
					// types: "150300", //选定类型位港口码头(暂时除去港口分类限制)
					keywords: value
				})
					.then(res => {
						if (res.success) {
							if (circleValue === value) {
								let list = res.data.map(item => {
									return {
										portName: item.name, //港口名称
										portDetailAddress: item.address, //港口详细地址
										originPortLat: item.latitude, //港口纬度
										originPortLon: item.longitude //港口经度
									};
								});
								callback(list);
								return;
							}
						} else {
							callback([]);
						}
					})
					.catch(() => {
						callback([]);
					});
			}
			timeout1 = setTimeout(fake, 300);
		},
		//绘制地图
		async initMap() {
			await loadMP();
			this.$nextTick(() => {
				mapMain = new AMap.Map('circleMap', {
					resizeEnable: true,
					center: [116.416262, 39.910039], // 北京
					zoom: 5
				});
				this.setCircle();
			});
		},
		//绘制图像
		setCircle() {
			let { circle } = this;
			// 圆心位置
			if (!overlayGroup) {
				overlayGroup = new AMap.OverlayGroup();
			}
			overlayGroup.setMap(mapMain);
			if (circle.lon && circle.lat && circle.radius) {
				overlayGroup.show();
				if (circleEditor) {
					circleEditor.open();
				}
			} else {
				overlayGroup.hide();
				if (circleEditor) {
					circleEditor.close();
				}
				return;
			}
			//绘制圆
			this.setCircleMap();
			//绘制详情地址
			this.setMarkerLabel();
			//绘制半径
			// this.setPolyline();
			// 创建纯文本标记（半径值）
			// this.setText();
			mapMain.setFitView();
			let that = this;
			if (!circleEditor) {
				AMap.plugin('AMap.CircleEditor', function () {
					circleEditor = new AMap.CircleEditor(mapMain, circleMap);
					circleEditor.open();
					circleEditor.on('move', function (e) {
						let { lat, lng } = e.lnglat;
						that.circle = {
							...that.circle,
							lat,
							lon: lng,
							address: '加载中...'
						};
						//圆心发生变化时，重新计算半径
						// that.setPolyline();
						// that.setText();
						//绘制详情地址
						that.setMarkerLabel();
						//停止后解析详细地址，设置表单
						that.handleMarker(that.circle);
					});
					circleEditor.on('adjust', function (e) {
						let radius = e.radius / 1000 || 0;
						that.circle = { ...that.circle, radius };
						//半径发生变化时，重新计算半径
						// that.setPolyline();
						// that.setText();
						//自动校验半径合规
						that.handleRadius(radius);
					});
				});
			}
			if (!geocoder) {
				AMap.plugin('AMap.Geocoder', function () {
					geocoder = new AMap.Geocoder();
					// 使用geocoder做地理/逆地理编码
				});
			}
		},
		//绘制圆
		setCircleMap() {
			let { circle } = this;
			//如果圆存在则修改参数，否则新建
			if (circleMap) {
				circleMap.setCenter([circle.lon, circle.lat]);
				circleMap.setRadius(circle.radius * 1000);
			} else {
				if (circle.lon && circle.lat && circle.radius) {
					circleMap = new AMap.Circle({
						center: [circle.lon, circle.lat],
						radius: circle.radius * 1000, //半径
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
					overlayGroup.addOverlay(circleMap);
				}
			}
		},
		//绘制详情标注
		setMarkerLabel() {
			let { circle } = this;
			//如果存在则修改参数，否则新建
			if (markerLabel) {
				markerLabel.setPosition([circle.lon, circle.lat]);
				markerLabel.setContent(`<div class="markerLabel markerLabelRight">${circle.address}</div>`);
			} else {
				markerLabel = new AMap.Marker({
					position: [circle.lon, circle.lat],
					anchor: 'middle-right',
					offset: new AMap.Pixel(-18, 0),
					content: `<div class="markerLabel markerLabelRight">${circle.address}</div>`,
					zIndex: 49
				});
				overlayGroup.addOverlay(markerLabel);
			}
		},
		//绘制半径(暂时不再绘制半径)
		setPolyline() {
			let bounds = circleMap.getBounds();
			let point_lon = bounds.northeast.lng,
				point_lat = (bounds.northeast.lat + bounds.southwest.lat) / 2;
			let path = [circleMap.getCenter(), new AMap.LngLat(point_lon, point_lat)];
			if (polyline) {
				polyline.setPath(path);
			} else {
				// 绘制
				polyline = new AMap.Polyline({
					path: path,
					strokeWeight: 2,
					strokeColor: '#0047FF',
					strokeStyle: 'dashed',
					strokeDasharray: [2, 2]
				});
				overlayGroup.addOverlay(polyline);
			}
		},
		//绘制文本
		setText() {
			let { circle } = this;
			let bounds = circleMap.getBounds();
			let point_lon = bounds.northeast.lng,
				point_lat = (bounds.northeast.lat + bounds.southwest.lat) / 2;
			let text_lon = (circleMap.getCenter().lng + point_lon) / 2;
			let text_lat = point_lat;
			if (polytext) {
				polytext.setText(`半径${circle.radius}km`);
				polytext.setPosition(new AMap.LngLat(text_lon, text_lat));
			} else {
				// 绘制
				polytext = new AMap.Text({
					text: `半径${circle.radius}km`,
					anchor: 'top-center', // 设置文本标记锚点
					style: {
						'background-color': 'transparent',
						border: 'none',
						'font-size': '14px',
						'line-height': '28px',
						color: '#4988FF'
					},
					position: [text_lon, text_lat]
				});
				overlayGroup.addOverlay(polytext);
			}
		},
		//300毫秒后校验半径是否符合规范
		handleRadius(val) {
			if (timeout2) {
				clearTimeout(timeout2);
				timeout2 = null;
			}
			circleRadius = val;
			timeout2 = setTimeout(() => {
				if (val !== circleRadius) return;
				circleRadius = circleRadius < 1 ? 1 : circleRadius;
				circleRadius = circleRadius > 20 ? 20 : circleRadius;
				circleRadius = Math.round(circleRadius);
				let { radius } = this.circle;
				//如果规范后半径和当前半径不同，重新画图
				if (circleRadius != radius) {
					this.circle = { ...this.circle, radius: circleRadius };
					this.$nextTick(() => {
						this.form.setFieldsValue({
							radius: circleRadius
						});
					});
				}
			}, 300);
		},
		//300毫秒解析移动坐标点
		handleMarker(circle) {
			if (timeout3) {
				clearTimeout(timeout3);
				timeout3 = null;
			}
			circlePosition = circle;
			timeout3 = setTimeout(() => {
				if (circle.lon == circlePosition.lon && circle.lat == circlePosition.lat) {
					geocodeInverse(params).then(res => {
						let { circle } = this;
						let formattedAddress = res.data;
						if (circlePosition.lon == circle.lon && circlePosition.lat == circle.lat) {
							this.circle = {
								...circle,
								remove: true,
								name: formattedAddress,
								address: formattedAddress
							};
							this.$nextTick(() => {
								this.form.setFieldsValue({
									circle: `${circle.lat}${circle.lon}`
								});
							});
						}
					});
					// geocoder.getAddress(
					//   [circlePosition.lon, circlePosition.lat],
					//   (status, result) => {
					//     let { circle } = this;
					//     //返回信息时和当前点相同时处理
					//     if (
					//       circlePosition.lon == circle.lon &&
					//       circlePosition.lat == circle.lat
					//     ) {
					//       if (status === "complete") {
					//         // result为对应的地理位置详细信息
					//         let { regeocode } = result;
					//         let { addressComponent, formattedAddress } = regeocode;
					//         //拆去地址名称，先取到名称最后一级，做切割
					//         let pitList = [
					//           "streetNumber",
					//           "street",
					//           "township",
					//           "district",
					//           "province",
					//         ];
					//         let name;
					//         for (let i = 0; i < pitList.length; i++) {
					//           if (name) {
					//             break;
					//           }
					//           //如果地区没有名称，终止本次循环
					//           if (!addressComponent[pitList[i]]) {
					//             continue;
					//           }
					//           name = formattedAddress.split(
					//             addressComponent[pitList[i]]
					//           )[1];
					//         }
					//         name = name || formattedAddress;
					//         this.circle = {
					//           ...circle,
					//           remove: true,
					//           name,
					//           address: formattedAddress,
					//         };
					//         this.$nextTick(() => {
					//           this.form.setFieldsValue({
					//             circle: `${circle.lat}${circle.lon}`,
					//           });
					//         });
					//       } else {
					//         this.$message.error("地址解析失败,请重新选取");
					//         this.$nextTick(() => {
					//           this.form.resetFields(["circle"]);
					//         });
					//       }
					//     }
					//   }
					// );
				}
			}, 300);
		}
	}
};
</script>
<style lang="less" scoped>
.title {
	font-family: 'PingFang SC';
	font-style: normal;
	font-weight: 500;
	font-size: 18px;
	line-height: 58px;
	color: rgba(0, 0, 0, 0.8);
	background: #f3f5f6;
	padding-left: 20px;
	border-radius: 8px 8px 0px 0px;
}

/deep/ .ant-modal-body {
	padding: 0;
}
/deep/ .ant-modal-close-x {
	background: url('~@/v2/assets/imgs/receive/icon_delete.png') no-repeat;
	background-size: cover;
	.ant-modal-close-icon {
		display: none;
	}
}
.main {
	width: 100%;
	height: 570px;
	position: relative;
	.map {
		position: absolute;
		width: 100%;
		height: 100%;
		//覆盖高德原有样式
		/deep/.amap-icon {
			background: url('~@/assets/imgs/map/marker_dot.png');
			background-size: 100%;
			img {
				display: none;
			}
		}
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
	}
	.mapCon {
		position: absolute;
		width: 308px;
		left: 20px;
		top: 20px;
		padding: 20px 14px 20px;
		background: #ffffff;
		border-radius: 10px;
		margin: 0;
		.address {
			font-family: 'PingFang SC';
			font-style: normal;
			font-weight: 400;
			font-size: 12px;
			line-height: 12px;
			color: #77889d;
		}

		.slFormDetail {
			padding: 0;
			.ant-form-item {
				height: 82px;
			}
		}
	}
}
.footer {
	padding: 16px 33px 22px;
	text-align: right;
	.ant-btn {
		margin-left: 30px;
		width: 90px;
		color: rgba(0, 0, 0, 0.4);
		border: 1px solid #c3c3c3;
		border-radius: 4px;
		height: 34px;
	}

	.ant-btn-primary {
		color: #ffffff;
		border: none;
	}
}
</style>
