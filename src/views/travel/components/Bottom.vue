<template>
	<div class="bottomContent">
		<div class="content-right" v-if="type ==='TRAIN' && trainInfoData">
			<p>运单详情</p>
			<div>
				<div>
					<h2 style="margin:0 auto 10px;text-align:center;">货物运单</h2>
					<p style="overflow:hidden;padding-bottom: 5px;"><span style="float: left;">需求号：{{trainInfoData.demandNo}}</span><span style="float: right;">运单号：{{trainInfoData.serialNo}}</span></p>
					<table cellspacing="0" cellpadding="0" class="modalTable">
						<tr>
							<td rowspan="4" colspan="1" style="padding: 5px 8px;">托运人</td>
							<td colspan="2">发站(公司)</td>
							<td colspan="4">{{trainInfoData.departureStation}}({{trainInfoData.departureRailwayName}})</td>
							<td colspan="2">专用线</td>
							<td colspan="6">{{trainInfoData.sendSpecialLine}}</td>
							<td colspan="2">货区</td>
							<td colspan="6"></td>
						</tr>
						<tr>
							<td colspan="2" rowspan="2">名称</td>
							<td colspan="7" rowspan="2">{{trainInfoData.consignorName}}</td>
							<td colspan="2">经办人</td>
							<td colspan="3"></td>
							<td colspan="2">货位</td>
							<td colspan="6"></td>
						</tr>
						<tr>
							<td colspan="2">手机号</td>
							<td colspan="3"></td>
							<td colspan="2">车种&nbsp;&nbsp;车号</td>
							<td colspan="6">{{trainInfoData.carType}}&nbsp;&nbsp;{{trainInfoData.carNumber}}</td>
						</tr>
						<tr>
							<td colspan="2">
								<a-checkbox disabled style="margin-right:5px;"></a-checkbox>上门取货
							</td>
							<td colspan="2">取货地址</td>
							<td colspan="5">{{trainInfoData.receiveGoodsAddress}}</td>
							<td colspan="2">联系电话</td>
							<td colspan="3"></td>
							<td colspan="2">取货里程(km)</td>
							<td colspan="6"></td>
						</tr>
						<tr>
							<td rowspan="4" colspan="1" style="padding: 5px 8px;">收货人</td>
							<td colspan="2">到站(公司)</td>
							<td colspan="4">{{trainInfoData.arriveStation}}({{trainInfoData.arriveRailwayName}})</td>
							<td colspan="2">专用线</td>
							<td colspan="6">{{trainInfoData.receiveSpecialLine}}</td>
							<td colspan="2">运到期限</td>
							<td colspan="2">{{trainInfoData.transportTimeLimit}}</td>
							<td colspan="2">标重(吨)</td>
							<td colspan="2">{{trainInfoData.deliverQuantity}}</td>
						</tr>
						<tr>
							<td colspan="2" rowspan="2">名称</td>
							<td colspan="7" rowspan="2">{{trainInfoData.consigneeName}}</td>
							<td colspan="2">经办人</td>
							<td colspan="3"></td>
							<td colspan="2">施封号</td>
							<td colspan="6"></td>
						</tr>
						<tr>
							<td colspan="2">手机号</td>
							<td colspan="3"></td>
							<td colspan="2">蓬布号</td>
							<td colspan="6"></td>
						</tr>
						<tr>
							<td colspan="2">
								<a-checkbox disabled style="margin-right:5px;"></a-checkbox>上门送货
							</td>
							<td colspan="2">送货地址</td>
							<td colspan="5">{{trainInfoData.sendGoodeAddress}}</td>
							<td colspan="2">联系电话</td>
							<td colspan="3"></td>
							<td colspan="2">送货里程(km)</td>
							<td colspan="6">{{trainInfoData.transportMileage}}</td>
						</tr>
						<tr >
							<td colspan="2">付款方式</td>
							<td colspan="7">
								<a-checkbox disabled style="margin-right:5px;"></a-checkbox>现金
								<a-checkbox disabled style="margin-right:5px;"></a-checkbox>支票
								<a-checkbox disabled style="margin-right:5px;"></a-checkbox>银行卡<br/>
								<a-checkbox disabled style="margin-right:5px;"></a-checkbox>预付款
								<a-checkbox disabled style="margin-right:5px;"></a-checkbox>汇总支付
							</td>
							<td colspan="2">领货方式</td>
							<td colspan="4">
								<a-checkbox disabled style="margin-right:5px;"></a-checkbox>电子领货<br/>
								<a-checkbox disabled style="margin-right:5px;"></a-checkbox>纸质领货
							</td>
							<td colspan="2">装车方</td>
							<td colspan="2"></td>
							<td colspan="2">施封方</td>
							<td colspan="2"></td>
						</tr>
						<tr>
							<td colspan="3">货物名称</td>
							<td colspan="1">件数</td>
							<td colspan="1">包装</td>
							<td colspan="2">货物价格(元)</td>
							<td colspan="2">重量(吨)</td>
							<td colspan="2">箱型箱类</td>
							<td colspan="2">箱号</span></td>
							<td colspan="2">集装箱施封号</td>
							<td colspan="2">承运人确定重量(吨)</td>
							<td colspan="2">体积(m3)</td>
							<td colspan="2">运价号</td>
							<td colspan="2">计费重量(吨)</td>
						</tr>
						<tr>
							<td colspan="3">{{trainInfoData.productName}}</td>
							<td colspan="1"></td>
							<td colspan="1"></td>
							<td colspan="2">{{trainInfoData.valuationAmount}}</td>
							<td colspan="2">{{trainInfoData.weight}}</td>
							<td colspan="2">{{trainInfoData.boxShape}}&nbsp;&nbsp;{{trainInfoData.boxType}}</td>
							<td colspan="2"></td>
							<td colspan="2"></td>
							<td colspan="2">{{trainInfoData.weight}}</td>
							<td colspan="2"></td>
							<td colspan="2"></td>
							<td colspan="2">{{trainInfoData.weight}}</td>
						</tr>
						<tr>
							<td colspan="3">合计</td>
							<td colspan="1"></td>
							<td colspan="1"></td>
							<td colspan="2"></td>
							<td colspan="2"></td>
							<td colspan="2"></td>
							<td colspan="2"></td>
							<td colspan="2"></td>
							<td colspan="2"></td>
							<td colspan="2"></td>
							<td colspan="2"></td>
							<td colspan="2"></td>
						</tr>
						<tr>
							<td colspan="3" rowspan="4">选择服务</td>
							<td colspan="3">
								<template v-if="trainInfoData.loadingToDoor!=null">
									<a-checkbox disabled :defaultChecked="Boolean(trainInfoData.loadingToDoor)"  style="margin-right:5px;"></a-checkbox>上门装车
								</template>
							</td>
							<td colspan="3"></td>
							<td colspan="3">费目</td>
							<td colspan="2">金额(元)</td>
							<td colspan="2">税额(元)</td>
							<td colspan="3">费目</td>
							<td colspan="2">金额(元)</td>
							<td colspan="2">税额(元)</td>
						</tr>
						<tr>
							<td colspan="3">
								<template v-if="trainInfoData.unloadingToDoor!=null">
									<a-checkbox disabled :defaultChecked="Boolean(trainInfoData.unloadingToDoor)"  style="margin-right:5px;"></a-checkbox>上门卸车
								</template>
							</td>
							<td colspan="3"></td>
							<td colspan="3"></td>
							<td colspan="2"></td>
							<td colspan="2"></td>
							<td colspan="3"></td>
							<td colspan="2"></td>
							<td colspan="2"></td>
						</tr>
						<tr>
							<td colspan="6">
								<template v-if="trainInfoData.transportSafeValue!=null">
									<a-checkbox disabled :defaultChecked="trainInfoData.transportSafeValue != null ? Boolean(trainInfoData.transportSafeValue) : false"  style="margin-right:5px;"></a-checkbox>保价运输
								</template>
								<a-checkbox disabled style="margin-right:5px;"></a-checkbox>装载加固材料<br/>
								<a-checkbox disabled style="margin-right:5px;"></a-checkbox>仓储
								<a-checkbox disabled style="margin-right:5px;"></a-checkbox>冷藏(保温)
							</td>
							<td colspan="3"></td>
							<td colspan="2"></td>
							<td colspan="2"></td>
							<td colspan="3"></td>
							<td colspan="2"></td>
							<td colspan="2"></td>
						</tr>
						<tr>
							<td colspan="2">其他服务</td>
							<td colspan="4">{{trainInfoData.otherService?'是':'否'}}</td>
							<td colspan="3"></td>
							<td colspan="2"></td>
							<td colspan="2"></td>
							<td colspan="3"></td>
							<td colspan="2"></td>
							<td colspan="2"></td>
						</tr>
						<tr>
							<td colspan="3" rowspan="3">
								<span style="display:inline-block;height: 28px;">增值税发票类型</span><br/>
								<template v-if="trainInfoData.vatInvoiceType!=null">
									<a-checkbox disabled :defaultChecked="trainInfoData.vatInvoiceType == 1"  style="margin-right:5px;"></a-checkbox>普通票<br/>
								</template>
								<template v-if="trainInfoData.vatInvoiceType!=null">
									<a-checkbox disabled :defaultChecked="trainInfoData.vatInvoiceType != null ? trainInfoData.vatInvoiceType == 2 : false"  style="margin-right:5px;"></a-checkbox>专用票
								</template>
							</td>
							<td colspan="6" rowspan="3"></td>
							<td colspan="3"></td>
							<td colspan="2"></td>
							<td colspan="2"></td>
							<td colspan="3"></td>
							<td colspan="2"></td>
							<td colspan="2"></td>
						</tr>
						<tr>
							<td colspan="3"></td>
							<td colspan="2"></td>
							<td colspan="2"></td>
							<td colspan="3"></td>
							<td colspan="2"></td>
							<td colspan="2"></td>
						</tr>
						<tr>
							<td colspan="3">费用合计</td>
							<td colspan="2">{{trainInfoData.totalCost}}</td>
							<td colspan="2">大写:</td>
							<td colspan="7">{{text}}</td>
						</tr>
						<tr>
							<td colspan="9" rowspan="3" style="height: 74px;">{{trainInfoData.shipperRemember}}</td>
							<td colspan="14" rowspan="3" style="height: 74px;">{{trainInfoData.carrierRemember}}</td>
						</tr>
					</table>
					<p style="text-align: right;padding: 5px;" v-if="trainInfoData.makePaperDate">制票日期:&nbsp;{{trainInfoData.makePaperDate}}</p>
				</div>
				<!-- 整列运输情况下，才展示车号表 -->
				<div v-if="trainInfoData.vehicleFlag">
					<h2 style="margin: 50px auto 30px;text-align:center;position: relative;">车号表<a-button type="primary" @click="exportXls" style="position: absolute;right:10px;top:0;">导出</a-button></h2>
					<div style="display: flex;flex-direction: row;justify-content: space-between;;margin-bottom: 20px;font-size:16px;font-weight:bold;">
						<span>整列运输运单-车辆附表</span>
						<span>运单号码【{{trainInfoData.serialNo}}】共【{{trainInfoData.waybillVehicleInfoVO?trainInfoData.waybillVehicleInfoVO.length:0}}】车</span>
					</div>
					<div style="display: flex;flex-direction: row;margin-bottom: 20px;justify-content: space-between;font-weight:bold;">
						<span>发站：{{trainInfoData.departureStation}}({{trainInfoData.departureRailwayName}})</span>
						<span>到站：{{trainInfoData.arriveStation}}({{trainInfoData.arriveRailwayName}})</span>
						<span>日期：{{trainInfoData.departureTime}}</span>
					</div>
					<table cellspacing="0" cellpadding="0" class="modalTable" style="margin-bottom: 20px;" v-if="trainInfoData.waybillVehicleInfoVO && trainInfoData.waybillVehicleInfoVO.length > 0">
						<tr>
							<th colspan="2">序号</th>
							<th colspan="4">需求号</th>
							<th colspan="3">车种车号</th>
							<th colspan="3">货物重量(吨)</th>
							<th colspan="3">计费重量(吨)</th>
							<th colspan="3">施/蓬号</th>
							<th colspan="2">备注</th>
						</tr>
						<tr v-for="(item,index) in trainInfoData.waybillVehicleInfoVO" :key="index">
							<td colspan="2">{{index+1}}</td>
							<td colspan="4">{{item.demandId}}</td>
							<td colspan="3">{{item.carInfo}}</td>
							<td colspan="3">{{item.weight}}</td>
							<td colspan="3">{{item.totalWeight}}</td>
							<td colspan="3">{{item.tentnum}}</td>
							<td colspan="2">{{item.remark}}</td>
						</tr>
					</table>
					<div v-if="!trainInfoData.waybillVehicleInfoVO">暂无数据</div>
				</div>
			</div>
		</div>

		<div v-if="type === 'SHIP' && mmsi">
			<a-tabs @change="changeTab" :activeKey="activeKey" :defaultActiveKey='1'>
				<a-tab-pane key="1" tab="轨迹查询">
					<div class="trail-box">
						<div class="trail-title">
							<div>
								<a-range-picker
								:show-time="{ format: 'HH:mm' }"
								format="YYYY-MM-DD HH:mm"
								:placeholder="['开始时间', '结束时间']"
								style="width: 300px"
								v-model="trackDate"
								@change="handleChangeTrackDate"
								:disabled-date="disabledDate"
								:disabled-time="disabledRangeTime"
								@calendarChange="calendarPriceRangeChange"
								/>
								<a-button type="primary" @click="trackSearch('')">查询</a-button>
							</div>
							<div class="pointer">
								<span :class="trackDays === 7 ? 'blue': ''" @click="trackSearch(7)">近7日</span>
								<span :class="trackDays === 15 ? 'blue': ''" @click="trackSearch(15)">近15日</span>
								<span :class="trackDays === 30 ? 'blue': ''" @click="trackSearch(30)">近1个月</span>
								<span :class="trackDays === 60 ? 'blue': ''" @click="trackSearch(60)">近2个月</span>
							</div>
						</div>
						<a-table
							class="table"
							:columns="columns"
							:rowKey="(record) => record.id"
							:dataSource="dataSource"
							:pagination="false"
							:loading="loading"
							:scroll="{ x: true }"
						>
							<span slot="shipName" slot-scope="record">
								<a href="javascript:;" @click="showShipTrack(record)">{{record.shipName}}</a>
							</span>
							<div slot="customTitle">
								<div @click="clearFunc">
									<img src="../../../assets/imgs/travel/clear.png" alt="" class="clear-btn">
								</div>
							</div>
							<span slot="clear" slot-scope="record">
								<a href="javascript:;" @click="deleteFunc(record)">删除</a>
							</span>
							<span slot="action" slot-scope="record">
								<a href="javascript:;" @click="showPortRecord(record)">靠港记录</a>
							</span>
						</a-table>
					</div>
				</a-tab-pane>
				<a-tab-pane key="2" tab="靠港记录">
					<div class="trail-box">
						<div class="trail-title">
							<div>
								<a-range-picker
								:show-time="{ format: 'HH:mm' }"
								format="YYYY-MM-DD HH:mm"
								:placeholder="['开始时间', '结束时间']"
								style="width: 300px"
								v-model="portDate"
								@change="handleChangePortDate"
								:disabled-date="disabledDate1"
								:disabled-time="disabledRangeTime1"
								@calendarChange="calendarPriceRangeChange1"
								/>
								<a-button type="primary" @click="portSearch('')">查询</a-button>
							</div>
							<div class="pointer">
								<span :class="portDays === 30 ? 'blue': ''" @click="portSearch(30)">近1个月</span>
								<span :class="portDays === 60 ? 'blue': ''" @click="portSearch(60)">近2个月</span>
								<span :class="portDays === 90 ? 'blue': ''" @click="portSearch(90)">近3个月</span>
								<span :class="portDays === 180 ? 'blue': ''" @click="portSearch(180)">近6个月</span>
							</div>
						</div>
						<a-table
							class="table"
							:columns="columnsPort"
							:rowKey="(record) => record.id"
							:dataSource="portRecordList"
							:pagination="false"
							:loading="loadingPort"
							:scroll="{ x: true }"
						>
							<div slot="portNameChs" slot-scope="record">
								<span>{{record.portNameChs}}/{{record.portNameEn}}</span>
							</div>
						</a-table>
						<i-pagination :pagination="pagination" @change="getPortList" />
					</div>
				</a-tab-pane>
			</a-tabs>
		</div>
	</div>
</template>
<script>
	import {
		API_ExportTrainTableTool,
		API_GetShipTrackSearchLog,
		API_GetShipPortRecordList,
		API_ClearShipTrackSearchLog,
		API_DeleteShipTrackSearchLog,
		API_GetShipTrackSearch,
	} from "api";
	import comDownload from '@sub/utils/comDownload.js'
	import moment from "moment"
	import { tencentCaptchaYD } from "@/v2/utils/factory";
	import iPagination from "@sub/components/iPagination";
  import { mapGetters } from 'vuex'
	export default {
		name: 'Bottom',
		props: ['type', 'trainInfoData','text','mmsi'],
		components: {
			iPagination,
		},
		data() {
			return {
				activeKey: '1',
				columns: [
					{ title: '船舶名称', key: 'shipName',scopedSlots: { customRender: 'shipName' }},
					{ title: '轨迹起始时间', dataIndex: 'startTimeStr', key: 'startTimeStr'},
					{ title: '轨迹结束时间', dataIndex: 'endTimeStr', key: 'endTimeStr'},
					{ title: '操作',key: 'action', fixed: 'right',scopedSlots: { customRender: 'action' }},
					{ key: 'clear', fixed: 'right', slots: { title: 'customTitle' }, scopedSlots: { customRender: 'clear' } },
				],
				columnsPort: [
					{ title: '港口名称', key: 'portNameChs',scopedSlots: { customRender: 'portNameChs' }},
					{ title: '到港时间', dataIndex: 'inTime', key: 'inTime'},
					{ title: '离港时间', dataIndex: 'outTime', key: 'outTime'},
					{ title: '停靠时间（h）', dataIndex: 'timeInterval', key: 'timeInterval'}
				],
				loading: false,
				loadingPort: false,
				dataSource: [],
				portRecordList: [],
				trackDate: null,
				trackParams: { date: null},
				portDate: null,
				portParams: { date: null},
				trackDays: '',
				portDays: '',
				pagination: {
					type: "",
					total: 0,
					pageNo: 1,
				},
				selectPriceDate: '',
				selectPriceDate1: '',
				offsetDays: 86400000 * 365 //最多选择365天
			}
		},
		watch: {
			'mmsi':function(){
				this.init()
			}
		},
    computed: {
      ...mapGetters('user', {
        VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER',
        VUEX_ST_PERSONALLINFO: 'VUEX_ST_PERSONALLINFO',
      }),
    },
		mounted() {
			if (this.type === 'SHIP' && this.mmsi) {
				this.init()
			}
		},
		methods: {
			init() { // 初始化
				this.activeKey = '1'
				this.loadingPort = false,
				this.dataSource = [],
				this.portRecordList = [],
				this.trackDate = null,
				this.trackParams = { date: null},
				this.portDate = null,
				this.portParams = { date: null},
				this.trackDays = '',
				this.portDays = '',
				this.getTrackLogList()
			},
			exportXls() { // 导出车号表
				API_ExportTrainTableTool({
					shipperName: this.trainInfoData.shipperName,
					serialNo: this.trainInfoData.serialNo
				}).then(res => {
					comDownload(res, undefined, '运单【'+this.trainInfoData.serialNo+'】车辆附表.xls')
				})
			},
			getTrackListFunc({ ticket, randstr }) {
				let params = {
					mmsi: this.mmsi,
					...this.trackParams
				}
				API_GetShipTrackSearch({
					...params,
					ticket,
					randomStr:randstr
				}).then(res=>{
					if(res.success) {
						this.$emit('historyShipData', res.data)
						API_GetShipTrackSearchLog({
							mmsi: this.mmsi,
						}).then(res=>{
							if (res.success) {
								this.dataSource = res.data || []
								this.loading= false;
							}
						})
					}
				})
			},
			getTrackList() { // 获取船舶轨迹查询历史记录
				let params = {
					mmsi: this.mmsi,
					...this.trackParams
				}
				this.loading= true;
				API_GetShipTrackSearch(params).then(res=>{
					if (res.success) {
						this.$emit('historyShipData', res.data)
						API_GetShipTrackSearchLog({
							mmsi: this.mmsi,
						}).then(res=>{
							if (res.success) {
								this.dataSource = res.data || []
								this.loading= false;
							}
						})
					}else {
						if (res.error.code === 666666) {
							tencentCaptchaYD(this.getTrackListFunc,this.VUEX_ST_PERSONALLINFO.mobile)
						}
						this.loading= false;
					}
				})
			},
			getTrackLogList(){ // 获取轨迹查询记录
				this.loading= true;
				API_GetShipTrackSearchLog({
					mmsi: this.mmsi,
				}).then(res=>{
					if (res.success) {
						this.dataSource = res.data || []
						this.loading= false;
					}
				})
			},
			trackSearch(days) {
				if (!this.trackDate) {
					this.trackParams.startTime = null;
					this.trackParams.endTime = null;
				}
				this.trackDays = days
				if(days) {
					this.trackDate = null
					let start = moment().subtract(days, 'days').format('YYYY-MM-DD HH:mm');
            		let end = moment().format('YYYY-MM-DD HH:mm')
					this.trackParams.startTime = start;
					this.trackParams.endTime = end;
				}
				if (!this.trackParams.startTime || !this.trackParams.endTime ) {
					this.$message.error('请输入时间范围查询轨迹')
					return
				}
				this.getTrackList()
			},
			handleChangeTrackDate(value, dateString) {
				this.trackParams.startTime = dateString[0];
				this.trackParams.endTime = dateString[1];
			},
			getPortListFunc({ pageNo = this.pagination.pageNo,
				pageSize = 10,ticket, randstr }) { // 获取船舶轨迹查询历史记录
				this.pagination.pageNo = pageNo;
				this.portParams.pageNo = pageNo;
				this.portParams.pageSize = pageSize;
				let params = {
					mmsi: this.mmsi,
					...this.portParams,
					ticket,
					randomStr:randstr
				}
				this.loadingPort = true
				API_GetShipPortRecordList(params).then(res=>{
					if (res.success) {
						this.portRecordList = res.data.records || []
						this.pagination.total = res.data.total;
						this.loadingPort = false
					}
				})
			},
			getPortList(// 获取出港记录
				pageNo = this.pagination.pageNo,
				pageSize = 10
			) {
				this.pagination.pageNo = pageNo;
				this.portParams.pageNo = pageNo;
				this.portParams.pageSize = pageSize;
				let params = {
					mmsi: this.mmsi,
					...this.portParams
				}
				this.loadingPort = true
				API_GetShipPortRecordList(params).then(res=>{
					if (res.success) {
						this.portRecordList = res.data.records || []
						this.pagination.total = res.data.total;
						this.loadingPort = false
					} else {
						if (res.error.code === 666666) {
							tencentCaptchaYD(this.getPortListFunc,this.VUEX_ST_PERSONALLINFO.mobile)
						}
					}
				})
			},
			portSearch(days) {
				if (!this.portDate) {
					this.portParams.startTime = null;
					this.portParams.endTime = null;
				}
				this.portDays = days
				if(days) {
					this.portDate = null
					let start = moment().subtract(days, 'days').format('YYYY-MM-DD HH:mm');
            		let end = moment().format('YYYY-MM-DD HH:mm')
					this.portParams.startTime = start;
					this.portParams.endTime = end;
				}
				if (!this.portParams.startTime || !this.portParams.endTime ) {
					this.$message.error('请输入时间范围查询靠港记录')
					return
				}
				this.getPortList()
			},
			handleChangePortDate(value, dateString) {
				this.portParams.startTime = dateString[0];
				this.portParams.endTime = dateString[1];
			},
			changeTab(e) {
				this.activeKey = e
			},
			deleteFunc(record) {
				API_DeleteShipTrackSearchLog({id: record.id}).then(res=>{
					if (res.success) {
						this.$message.success('删除成功！')
						this.getTrackLogList()
					}
				})
			},
			clearFunc(){ // 清空
				if (!this.dataSource.length) return
				API_ClearShipTrackSearchLog({mmsi: this.mmsi}).then(res=>{
					if (res.success) {
						this.$message.success('清空成功！')
						this.getTrackLogList()
					}
				})
			},
			showPortRecord(record) {
				this.activeKey = '2'
				this.changeTab('2')
				this.portParams.startTime = record.startTimeStr;
				this.portParams.endTime = record.endTimeStr;
				this.portDate = [record.startTimeStr,record.endTimeStr]
				this.portDays = ''
				this.getPortList()
			},
			showShipTrack(record) {
				this.trackParams.startTime = record.startTimeStr;
				this.trackParams.endTime = record.endTimeStr;
				this.getTrackList()
			},
			range(start, end) {
				const result = [];
				for (let i = start; i < end; i++) {
					result.push(i);
				}
				return result;
			},
			disabledRangeTime(date, type) {
				const currentDate = new Date();
				if(type === "end") {
					if(this.trackDate && moment(this.trackDate[1]).format("YYYY-MM-DD") == moment().format("YYYY-MM-DD")) {
						return {
						disabledHours: () => this.range(0, 24).splice(currentDate.getHours() + 1, 24),
						disabledMinutes: () => this.range(0, 60).splice(currentDate.getMinutes() + 1, 60),
						disabledSeconds: () => [],
						};
					}
					if (this.trackDate) {
						let start = new Date(moment(this.trackDate[0]).format('YYYY-MM-DD')).getTime()
						let end = new Date(moment(this.trackDate[1]).format('YYYY-MM-DD')).getTime()
						if (end-start === this.offsetDays) {
							return {
								disabledHours: () => this.range(0, 24).splice(new Date(moment(this.trackDate[0], 'YYYY-MM-DD').valueOf()).getHours() + 1, 24),
								disabledMinutes: () => this.range(0, 60).splice(new Date(moment(this.trackDate[0], 'YYYY-MM-DD').valueOf()).getMinutes() + 1, 60),
								disabledSeconds: () => [],
							};
						}
					}
					return {
						disabledHours: () => [],
						disabledMinutes: () => [],
						disabledSeconds: () => [],
					};
				}
				return {
					disabledHours: () => [],
					disabledMinutes: () => [],
					disabledSeconds: () => [],
				};
			},
            //选择开始时间/结束时间
            calendarPriceRangeChange(date){
                this.selectPriceDate = date[0]
            },
            //根据选择的开始时间/结束时间，动态渲染要禁用的日期
            disabledDate(current){
                if(this.selectPriceDate){
                    let selectV = moment(this.selectPriceDate, 'YYYY-MM-DD').valueOf()
					if (moment(new Date(selectV+this.offsetDays), 'YYYY-MM-DD')>moment()) {
						return current > moment() ||
                        current < moment(new Date(selectV-this.offsetDays), 'YYYY-MM-DD')
					} else {
						return current > moment(new Date(selectV+this.offsetDays), 'YYYY-MM-DD') ||
                        current < moment(new Date(selectV-this.offsetDays), 'YYYY-MM-DD')
					}

                }else{
                    return current && moment(current).format("YYYY-MM-DD") > moment().format("YYYY-MM-DD");
                }
            },
			disabledRangeTime1(date, type) {
				const currentDate = new Date();
				if(type === "end") {
					if(this.portDate && moment(this.portDate[1]).format("YYYY-MM-DD") == moment().format("YYYY-MM-DD")) {
						return {
						disabledHours: () => this.range(0, 24).splice(currentDate.getHours() + 1, 24),
						disabledMinutes: () => this.range(0, 60).splice(currentDate.getMinutes() + 1, 60),
						disabledSeconds: () => [],
						};
					}
					if (this.portDate) {
						let start = new Date(moment(this.portDate[0]).format('YYYY-MM-DD')).getTime()
						let end = new Date(moment(this.portDate[1]).format('YYYY-MM-DD')).getTime()
						if (end-start === this.offsetDays) {
							return {
								disabledHours: () => this.range(0, 24).splice(new Date(moment(this.portDate[0], 'YYYY-MM-DD').valueOf()).getHours() + 1, 24),
								disabledMinutes: () => this.range(0, 60).splice(new Date(moment(this.portDate[0], 'YYYY-MM-DD').valueOf()).getMinutes() + 1, 60),
								disabledSeconds: () => [],
							};
						}
					}
					return {
						disabledHours: () => [],
						disabledMinutes: () => [],
						disabledSeconds: () => [],
					};
				}
				return {
					disabledHours: () => [],
					disabledMinutes: () => [],
					disabledSeconds: () => [],
				};
			},
            //选择开始时间/结束时间
            calendarPriceRangeChange1(date){
                this.selectPriceDate1 = date[0]
            },
            //根据选择的开始时间/结束时间，动态渲染要禁用的日期
            disabledDate1(current){
                if(this.selectPriceDate1){
                    let selectV = moment(this.selectPriceDate1, 'YYYY-MM-DD').valueOf()
					if (moment(new Date(selectV+this.offsetDays), 'YYYY-MM-DD')>moment()) {
						return current > moment() ||
                        current < moment(new Date(selectV-this.offsetDays), 'YYYY-MM-DD')
					} else {
						return current > moment(new Date(selectV+this.offsetDays), 'YYYY-MM-DD') ||
                        current < moment(new Date(selectV-this.offsetDays), 'YYYY-MM-DD')
					}

                }else{
                    return current && moment(current).format("YYYY-MM-DD") > moment().format("YYYY-MM-DD");
                }
            }
		},

	}
</script>
<style lang="less" scoped>
	.content-right {
        border: 1px solid #EEF0F2;
        height: 312px;
        border-radius: 4px;
        padding: 10px 50px;
        overflow-y: auto;
		&>p{
			font-size: 20px;
			font-family: PingFangSC-Medium, PingFang SC;
		}
    }
    .modalTable{
        width:100%;
        height:100%;
        border:1px solid #000000;/*设置边框粗细，实线，颜色*/
        text-align:center;/*文本居中*/
        border-collapse: collapse;/*边框重叠，否则你会看到双实线*/
        table-layout:fixed;
		margin-bottom: 20px;
        th,td{
            height: 32px;
            border:1px solid black;
            color: #000000;
            padding: 5px 6px;
        }
    }

	.ant-tabs-tabpane {
		.trail-box {
			width: 100%;
			padding: 0 16px 16px 16px;
			height: 252px;
			overflow: auto;
			.trail-title {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				margin-bottom: 15px;
				span {
					display: inline-block;
					margin-right: 20px;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #8495AA;
					line-height: 22px;
				}
				span.blue {
					color:  @primary-color;
				}

			}
			.pointer {
				cursor: pointer;
			}
		}
	}
	.clear-btn {
		width: 16px;
		height: 18px;
		cursor: pointer;
	}
	.table ::v-deep.ant-table-body tr th {
		font-size: 14px;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: #8495AA!important;
		line-height: 22px
	}
	.table ::v-deep.ant-table-thead tr th {
		font-size: 14px;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: #8495AA!important;
		line-height: 22px
	}


</style>
