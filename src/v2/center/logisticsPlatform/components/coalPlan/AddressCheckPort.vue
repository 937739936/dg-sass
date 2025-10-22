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
		<!-- 编辑收货地址 -->
		<div class="title">{{ isEdit ? (isAdd ? '添加收货地址' : '编辑收货地址') : '收货地址详情' }}</div>
		<div class="main">
			<div
				class="map"
				id="circleMap"
				:class="isEdit ? '' : 'main2'"
			></div>
			<div
				class="mapCon"
				v-show="isEdit"
			>
				<a-form
					:form="form"
					:colon="false"
				>
					<div
						class=""
						style="margin-top: 10px"
					>
						<a-form-item
							label="收货地址"
							style="display: inline-block"
						>
							<a-cascader
								:getPopupContainer="getPopupContainer"
								:options="options2"
								:load-data="loadData"
								@change="changeArea"
								placeholder="选择省市区"
								v-decorator="[
									`sendA`,
									{
										rules: [{ required: true, message: `选择省市区` }]
									}
								]"
							/>
						</a-form-item>
						<a-form-item
							label=""
							style="display: inline-block; margin-left: 20px"
						>
							<a-select
								showSearch
								allowClear
								style="width: 424px"
								placeholder="请搜索详细地址"
								:notFoundContent="selectLoading ? '加载中...' : '暂无数据'"
								:default-active-first-option="false"
								:show-arrow="false"
								:filter-option="false"
								:getPopupContainer="getPopupContainer"
								:not-found-content="null"
								optionLabelProp="name"
								@search="handleCircleSearch"
								v-decorator="['circle', formRules.circle]"
								@change="handleCircleChange"
							>
								<a-select-option
									v-for="item in PortSearch"
									:key="`${item.lat}${item.lon}`"
									:name="item.name"
								>
									{{ item.name }}<br />
									<a-tooltip>
										<template slot="title">
											{{ item.address }}
										</template>
										<span class="address">{{ item.address }}</span>
									</a-tooltip>
								</a-select-option>
							</a-select>
						</a-form-item>
					</div>

					<div style="margin-top: 10px">
						<a-form-item
							label="围栏半径"
							style="display: inline-block"
						>
							<a-input-number
								placeholder="请输入电子围栏半径(KM)"
								v-decorator="['radius', formRules.radius]"
								:min="0.1"
								:step="0.1"
								style="width: 240px"
								:precision="1"
								:max="20"
							/>
						</a-form-item>
						<span style="margin-left: 5px; display: inline-block; margin-top: 6px">KM</span>
					</div>
				</a-form>
				<div class="footer">
					<div style="margin-bottom: 20px">
						<a-button
							type="primary"
							@click="affirm"
							>{{ isAdd ? '提交' : '保存' }}</a-button
						>
					</div>
					<a-button
						@click="hide"
						class="cancel"
						>取消</a-button
					>
				</div>
			</div>
			<div
				class="mapCon mapCon2"
				v-show="!isEdit"
			>
				<div style="color: rgba(0, 0, 0, 0.8)">
					<p style="margin-bottom: 10px; color: rgba(0, 0, 0, 0.4)">
						<span>收货地址：</span>
						<span style="margin-left: 14px; color: rgba(0, 0, 0, 0.8)">{{ circle.address }} {{ info.address }}</span>
					</p>
					<p>
						<span style="color: rgba(0, 0, 0, 0.4)">围栏半径：</span>
						<span style="margin-left: 14px; color: rgba(0, 0, 0, 0.8)">{{ circle.radius }}km</span>
					</p>
				</div>
			</div>
		</div>
	</a-modal>
</template>
<script>
import { getPopupContainer } from '@/v2/utils/factory.js';

import { API_BIZPROVINCELIST, API_BIZCITYLIST, API_BIZAREALIST } from '@/v2/center/trade/api/contract';
import { API_shipBoxGetPortListByKeyword } from 'api';
import { cloneDeep } from 'lodash';
// import { updatedStation } from '../../api';
import china from '../china.json';
import { getStationReceiveAddress } from '@/v2/center/logisticsPlatform/api';

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
 *

 */
china.children.forEach(el => {
	el.value = String(el.label);

	el.children &&
		el.children.forEach(el2 => {
			el2.value = String(el2.label);
			el2.children &&
				el2.children.forEach(el3 => {
					el3.value = String(el3.label);
				});
		});
});

var mapMain,
	circleEditor,
	circleMap,
	polyline,
	polytext,
	circleRadius,
	circlePosition,
	markerLabel,
	fakeMarker,
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
							message: `请输入详细地址`,
							whitespace: true
						}
					]
				},
				circle: {
					rules: [
						{
							required: true,
							message: `请输入收货地址`,
							whitespace: true
						}
					]
				},
				radius: {
					rules: [
						{
							required: true,
							message: `请输入围栏半径`
						}
					],
					initialValue: 1.0 //设置默认值
				}
			},
			selectLoading: false, //港口检索状态
			PortSearchHistory: [], //历史数据
			circleData: [], //加载数据
			circleValue: '', //港口输入时记录
			circle: {
				area: [],
				address: '',
				remove: false, //是否添加点
				lat: '',
				lon: '',
				radius: 1
			},
			info: {},
			options: [],
			options2: china.children,
			isEdit: true,
			isAdd: false, // 是否是添加地址
			china
		};
	},
	computed: {
		PortSearch() {
			let data = [];
			//如果有输入值，加载高德返回，否则限制历史默认
			if (this.circleValue) {
				// 高德
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
				if (!data.some(item => `${item.lat}${item.lon}` == `${circle.lat}${circle.lon}`)) {
					data.unshift(circle);
					// data.unshift({
					// 	portName: circle.name, //港口名称
					// 	portDetailAddress: circle.address, //港口详细地址
					// 	originPortLat: circle.lat, //港口纬度
					// 	originPortLon: circle.lon //港口经度
					// });
				}
			}

			return data;
		}
	},
	mounted() {
		this.initMap();
	},
	watch: {
		// isEdit: {
		// 	handler(val) {
		// 		if (circleEditor) {
		// 			if (val) {
		// 				circleEditor.open();
		// 			} else {
		// 				circleEditor.close();
		// 				fakeMarker.setAnchor('center');
		// 			}
		// 		}
		// 	},
		// 	immediate: true,
		// 	deep: true
		// }
	},
	methods: {
		getPopupContainer,
		changeArea() {
			this.form.resetFields('circle');
		},
		async getPortSearchHistory() {
			// this.selectLoading = true;
			let res = await getStationReceiveAddress();
			if (res.success) {
				let list = res.data.map(item => {
					return this.circleFromAddress(item);
				});
				this.PortSearchHistory = list;
			}
			// this.selectLoading = false;
		},
		/*** 获取站台详情 */
		// 地址信息数据转化
		circleFromAddress(info) {
			let {
				receiveArea,
				receiveAddress,
				receiveLongitude,
				receiveLatitude,
				receiveElectronicFenceRadius,
				receiveAddressKeywords
			} = info;
			return {
				address: receiveAddress,
				area: receiveArea ? receiveArea.split('/') : undefined,
				radius: receiveElectronicFenceRadius,
				lon: receiveLongitude,
				lat: receiveLatitude,
				name: receiveAddressKeywords
			};
		},
		//加载弹框
		async show(addressInfo, flag) {
			this.isEdit = flag;
			if (addressInfo) {
				const newInfo = cloneDeep(addressInfo);
				let circle = this.circleFromAddress(newInfo);

				this.handleCircleSearch(circle.address);
				this.$forceUpdate();
				// this.info = newInfo;
				this.circle = { ...circle };
				this.isAdd = false;
			} else {
				this.isAdd = true;
			}

			//查询当前用户最新20条港口地址
			await this.getPortSearchHistory();
			this.visible = true;

			//有半径渲染半径
			if (this.circle.radius) {
				this.$nextTick(() => {
					this.form.setFieldsValue({
						radius: this.circle.radius
					});
				});
			}
			//有详细地址渲染表单地址
			if (this.circle.lon && this.circle.lat && this.circle.address) {
				//如果当前值再记录中，不进行添加，否则添加新值
				if (!this.PortSearch.some(item => `${item.lat}${item.lon}` == `${this.circle.lat}${this.circle.lon}`)) {
					this.circle = { ...this.circle, remove: true };
				}

				this.$nextTick(() => {
					this.form.setFieldsValue({
						circle: `${this.circle.lat}${this.circle.lon}`,
						name: this.circle.address ?? this.circle.name
					});
				});
			}
			/** 回显 */
			// 11', '1101', '110101'
			// const areaArr = this.info.areaCode.split('/')
			const areaArr = this.circle.area && this.circle.area.length ? this.circle.area : ['北京市', '北京市', '东城区'];
			this.form.setFieldsValue({
				sendA: areaArr
			});
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
				radius: 1
			};
			this.circleValue = '';
			//清空视图
			mapMain.clearMap();
			circleEditor = null;
			this.form.resetFields();
		},
		//确认提交
		affirm() {
			this.form.validateFieldsAndScroll(async (error, values) => {
				if (!error) {
					let circle = { ...this.circle };

					/*** 反查地址 */
					// const arr = values.sendA;

					// const params = {
					// 	stationId: this.info.id,
					// 	area: values.sendA.join('/'),
					// 	areaCode: values.sendA.join('/'),
					// 	addressKeywords: circle.name,
					// 	address: circle.address,
					// 	electronicFenceRadius: circle.radius,
					// 	latitude: circle.lat,
					// 	longitude: circle.lon
					// };

					// await updatedStation(params);
					this.info = circle;
					this.info.area = values.sendA.join('/');
					this.circle.area = values.sendA.join('/');
					this.$forceUpdate();
					this.$emit('selectPort', { ...circle });
					// this.isEdit = false;
					this.hide();
				}
			});
		},
		//表单发生变化
		async onValuesChange(props, values) {
			//地址变化,反向渲染
			// if (values.hasOwnProperty("sendA")) {
			//   let option = this.options.filter((item) => {
			//     return item.value == values.sendA[0];
			//   });

			//   if (!option[0].children) {
			//     await this.loadData(option);
			//   }
			//   let options = option[0].children.filter((item) => {
			//     return item.value == values.sendA[1];
			//   });
			//   if (!options[0].children) {
			//     await this.loadData(options);
			//   }
			// }
			let { circle } = this;
			//港口方式发生变更
			if (values.hasOwnProperty('circle')) {
				//如果选中港口
				if (values.circle) {
					let circlePort = this.PortSearch.find(item => `${item.lat}${item.lon}` == values.circle);

					if (circlePort.lon != circle.lon || circlePort.lat != circle.lat || circlePort.radius != circle.radius) {
						// 替换经纬度
						if (!circlePort.radius) {
							circlePort.radius = circle.radius ?? 1;
						}
						this.circle = { ...circlePort, remove: false };

						// this.circle = {
						// 	...circle,
						// 	remove: false,
						// 	name: circlePort.portName,
						// 	address: circlePort.portDetailAddress,
						// 	lon: circlePort.originPortLon,
						// 	lat: circlePort.originPortLat
						// };
						if (circlePort.area) {
							const sendA = circlePort.area;
							/** 回显站台地址 省市区 */
							this.form.setFieldsValue({ sendA });
						}
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
		//
		handleCircleChange(val, e) {
			console.log(val, e);
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
									let { name, address, longitude, latitude, pname, adname, cityname } = item;
									return {
										name,
										address,
										lon: longitude,
										lat: latitude,
										area: [pname ?? '', cityname ?? '', adname ?? '']
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
				callback([]);
			}
			timeout1 = setTimeout(fake, 300);
		},
		//绘制地图
		async initMap(flag) {
			await loadMP(flag);
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
			if (this.isEdit) {
				if (circleEditor) {
					circleEditor.open();
				}
			} else {
				if (circleEditor) {
					circleEditor.close();
				}
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
			if (fakeMarker) {
				fakeMarker.setPosition([String(circle.lon), String(circle.lat)]);
				fakeMarker.setAnchor('center');
				fakeMarker.setContent(`<div class='circle'></div>`);
			} else {
				fakeMarker = new AMap.Marker({
					position: [circle.lon, circle.lat],
					anchor: 'center',
					offset: new AMap.Pixel(0, 0),
					// icon: '~@/assets/imgs/map/marker_dot.png',
					content: `<div class='circle'></div>`,
					zIndex: 9999
				});
				overlayGroup.addOverlay(fakeMarker);
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
				circleRadius = circleRadius < 0.1 ? 0.1 : circleRadius;
				circleRadius = circleRadius > 20 ? 20 : circleRadius;
				circleRadius = circleRadius.toFixed(1);
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
					const params = {
						longitude: circlePosition.lon,
						latitude: circlePosition.lat
					};
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
				}
			}, 300);
		},
		async loadData(selectedOptions) {
			const targetOption = selectedOptions[selectedOptions.length - 1];

			targetOption.loading = true;
			let children = [];
			if (targetOption.hierarchy == 1) {
				//选择省
				children = await this.getCityData(targetOption.value);
			} else if (targetOption.hierarchy == 2) {
				//选择市
				children = await this.getAreaData(targetOption.value);
			}
			if (children.length) {
				targetOption.children = children;
			} else {
				targetOption.isLeaf = true;
			}
			targetOption.loading = false;
			this.options = [...this.options];
		},
		// 获取省
		async getProvinceData() {
			let res = await API_BIZPROVINCELIST({ countryCode: 1, containsAll: true, t: Math.random() });
			if (res.success) {
				this.options = res.result.map(item => {
					return {
						value: item.code,
						label: item.name,
						hierarchy: 1,
						isLeaf: false
					};
				});
			}
		},
		// 获取市
		async getCityData(provinceCode) {
			let options = [];
			let res = await API_BIZCITYLIST({ provinceCode, containsAll: true });
			if (res.success) {
				options = res.result.map(item => {
					return {
						value: item.code,
						label: item.name,
						hierarchy: 2,
						isLeaf: false
					};
				});
			}
			return options;
		},
		// 获取区县
		async getAreaData(cityCode) {
			let options = [];
			let res = await API_BIZAREALIST({ cityCode, containsAll: true });
			if (res.success) {
				options = res.result
					.filter(item => {
						return item;
					})
					.map(item => {
						return {
							value: item?.code,
							label: item?.name
						};
					});
			}
			return options;
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
		/deep/ .amap-icon {
			// display: none;
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
		width: 1060px;
		left: 20px;
		top: 20px;
		padding: 20px 14px 20px;
		background: #ffffff;
		border-radius: 10px;
		margin: 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
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
/deep/ .circle {
	width: 12px;
	height: 12px;
	background: #ffffff;
	border: 3px solid #1890ff;
	border-radius: 50%;
}
.main {
	/deep/ .circle {
		display: none !important;
	}
}
.main2 {
	/deep/ .amap-marker:first-child {
		// display: none !important;
	}
	/deep/ .circle {
		display: block !important;
	}
}

.footer {
	// padding: 16px 33px 22px;
	text-align: right;
	margin-right: 20px;
	border-left: 1px solid #e5e6eb;
	// &::before {
	//   content: '';
	//   width: 1px;
	//   height: 2px;
	// }
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
		box-shadow: none;
	}
}
.mapCon {
	.df {
		display: flex;
		align-items: center;
		margin-top: 12px;
	}

	/deep/ .ant-form-item {
		// display: flex;
		// align-items: center;
		margin-bottom: 0px;
	}
	/deep/ .ant-select-selection {
		border: 1px solid #e5e6eb;
	}
	/deep/ .ant-input {
		border: 1px solid #e5e6eb;
	}
	/deep/ .ant-input-number {
		border: 1px solid #e5e6eb;
	}
	/deep/ .ant-form-item-control-wrapper {
		flex: 1;
		display: inline-block;
	}
	/deep/ .ant-form-item-label {
		line-height: 32px;
		color: rgba(0, 0, 0, 0.4);

		vertical-align: top;

		& > label {
			color: rgba(0, 0, 0, 0.4);
		}
	}
	/deep/ .ant-form-item-control {
		line-height: 32px;
		color: rgba(0, 0, 0, 0.8);
	}

	.special {
		/deep/ .ant-form-item-label {
			// line-height: 20px;
			margin-left: 10px;
		}
	}
}
.cancel {
	border-radius: 4px;
	border: 1px solid  @primary-color!important;
	background: #fff !important;
	color:  @primary-color!important;
}
</style>
