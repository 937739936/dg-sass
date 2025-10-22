<template>
	<div class="leftContent">
		<a-button class="train-btn" type="primary" :ghost="key !== 'TRAIN'" @click="change('TRAIN')">火车查询</a-button>
		<a-button class="ship-btn"  type="primary" :ghost="key !== 'SHIP'" @click="change('SHIP')">船舶查询</a-button>
		<!-- 火运 -->
		<div v-if="key === 'TRAIN'" class="train">
			<div class="search-box">
				<p><i>*</i>托运人</p>
				<a-select
					:getPopupContainer="getPopupContainer"
					placeholder="请输入托运人名称"
					v-model="params.shipperName"
					show-search
					:default-active-first-option="false"
					:show-arrow="false"
					:filter-option="false"
					:not-found-content="fetching ? undefined : null"
					@select="handleShipperNameSelect"
					@search="handleShipperNameSearch">
					<a-spin v-if="fetching" slot="notFoundContent" size="small" />
					<a-select-option
						v-for="item in shipperNameList"
						:key="item.name"
						:title="item.name">{{item.name}}
					</a-select-option>
				</a-select>
				<p><i>*</i>运单号</p>
				<a-input v-model="params.serialNo" placeholder="请输入运单号"/>
				<div class="btn-box">
					<a-button type="primary" ghost @click="reset">清空</a-button>
					<a-button type="primary" @click="search">查询</a-button>
				</div>
			</div>
			<div class="s-card-info" v-if="infoData">
				<div class="info-item">
					<p class="label">托运人:</p>
					<p>{{infoData.shipperName}}</p>
				</div>
				<div class="info-item">
					<p class="label">运单号:</p>
					<p>{{infoData.serialNo}}</p>
				</div>
				<div class="info-item">
					<p class="label">发货数量:</p>
					<p>{{infoData.weight}}&nbsp;吨</p>
				</div>
				<div class="info-item">
					<p class="label">发货日期:</p>
					<p>{{infoData.departureTime}}</p>
				</div>
				<div class="info-item">
					<p class="label">状态:</p>
					<p>{{infoData.statueName}}</p>
				</div>
				<div class="info-item">
					<strong><img src="../../../assets/imgs/travel/start.png" alt="">{{infoData.departureStation}}</strong><i></i><strong><img src="../../../assets/imgs/travel/end.png" alt="">{{infoData.arriveStation}}</strong>
				</div>
			</div>

			<div class="s-card-content" v-if="infoData && infoData.trajectoryPointInfoList">
				<div v-if="infoData.trajectoryPointInfoList && infoData.trajectoryPointInfoList.length>0" style="padding-top: 14px;">
					<div class="record-list-item" v-for="(item,index) in infoData.trajectoryPointInfoList" :key="index"  :class="index == infoData.trajectoryPointInfoList.length-1 ? 'end': 'blue'">
						<em></em>
						<div v-for="(pro,i) in item" :key="i" class="record-list-item-text">
							<p>
								<span v-if="pro.trajectoryDesc.indexOf('【') == -1">{{pro.trajectoryDesc}}</span>
								<span style="display: inline-block;text-indent: -8px;" v-if="pro.trajectoryDesc.indexOf('【') != -1">{{pro.trajectoryDesc}}</span>
							</p>
							<b style='font-weight: 400;color: rgba(0,0,0,0.8);font-size: 12px'>{{pro.trajectoryDate && pro.trajectoryDate.slice(0,10)}}</b>
							<b style='font-weight: 400;color: rgba(0,0,0,0.8);font-size: 12px;float: right'>{{pro.trajectoryDate && pro.trajectoryDate.slice(10,16)}}</b>
						</div>
					</div>
				</div>
				<div v-else>
					暂无数据
				</div>
			</div>

		</div>


		<!-- 船运 -->
		<div v-if="key === 'SHIP'" class="ship">
			<div class="search-box">
				<a-input
					class="ship-input"
					placeholder="根据英文船名、MMSI、IMO模糊搜索"
					v-model="shipParams.keyword"
					@input="handleKeyWordSearch"
					@focus="handleKeyWordFocus"
					:maxLength="20">
				</a-input>
				<span @click="handleKeyWordFocus"><img src="../../../assets/imgs/travel/search.png" alt=""></span>
				<div class="history-box" v-if="shipHistoryList && shipHistoryList.length>0">
					<div class="history-item">
						<div v-for="(item,index) in shipHistoryList" :key="index" @click="choose(item)">
							<img src="../../../assets/imgs/travel/ship.png" alt=""><span>{{item.nameEn}}</span>
							<p>{{item.mmsi}}&nbsp;&nbsp;&nbsp;{{item.type}}</p>
						</div>
					</div>
					<p class="clear-btn" @click="clearHistory">清空历史记录</p>
				</div>
				<div class="keyword-box" v-if="keywordList && keywordList.length>0">
					<div class="history-item">
						<div v-for="(item,index) in keywordList" :key="index" @click="choose(item)">
							<img src="../../../assets/imgs/travel/ship.png" alt=""><span>{{item.nameEn}}</span>
							<p>{{item.mmsi}}&nbsp;&nbsp;&nbsp;{{item.type}}</p>
						</div>
					</div>
				</div>
			</div>

			<div class="s-card-info" v-if="shipDetailInfo">
				<div class="title">
					<img src="../../../assets/imgs/travel/ship.png" alt="">&nbsp;{{shipDetailInfo.shipNameChs}}&nbsp;&nbsp;{{shipDetailInfo.countryChs}}
				</div>
				<div class="info-item">
					<p class="label">英文船名:</p>
					<p>{{shipDetailInfo.shipNameEn || '--'}}</p>
				</div>
				<div class="info-item">
					<p class="label">MMSI:</p>
					<p>{{shipDetailInfo.mmsi || '--'}}</p>
				</div>
				<div class="info-item">
					<p class="label">IMO:</p>
					<p>{{shipDetailInfo.imo || '--'}}</p>
				</div>
				<div class="info-item">
					<p class="label">呼号:</p>
					<p>{{shipDetailInfo.callSign || '--'}}</p>
				</div>
				<div class="info-item">
					<p class="label">预到时间:</p>
					<p>{{shipDetailInfo.eta || '--'}}</p>
				</div>
				<div class="info-item">
					<p class="label">长*宽（米）:</p>
					<p>{{shipDetailInfo.length}}*{{shipDetailInfo.breadth}}</p>
				</div>
				<div class="info-item">
					<p class="label">船艏向:</p>
					<p>{{shipDetailInfo.heading != null ? shipDetailInfo.heading +'度' : '--'}}</p>
				</div>
				<div class="info-item">
					<p class="label">航向:</p>
					<p>{{(shipDetailInfo.cog && shipDetailInfo.cog>0) ? parseFloat((shipDetailInfo.cog/10).toFixed(1))+'度': (shipDetailInfo.cog == 0 ? shipDetailInfo.cog+'度': '--')}}</p>
				</div>
				<div class="info-item">
					<p class="label">吃水/航速:</p>
					<p>{{shipDetailInfo.draught != null ? parseFloat((shipDetailInfo.draught/10).toFixed(1))+'米': '--'}}/{{shipDetailInfo.sog != null ? parseFloat((shipDetailInfo.sog/10).toFixed(1))+'节': '--'}}</p>
				</div>
				<div class="info-item">
					<p class="label">目的港:</p>
					<p>{{shipDetailInfo.destPort || '--'}}</p>
				</div>
				<div class="info-item">
					<p class="label">船舶类型:</p>
					<p>{{shipDetailInfo.shipType || '--'}}</p>
				</div>
				<div class="info-item">
					<p class="label">更新时间:</p>
					<p>{{shipDetailInfo.posTime || '--'}}</p>
				</div>
				<div class="info-item">
					<p class="label">经度:</p>
					<p>{{shipDetailInfo.lon || '--'}}</p>
				</div>
				<div class="info-item">
					<p class="label">纬度:</p>
					<p>{{shipDetailInfo.lat || '--'}}</p>
				</div>
				<div class="info-item">
					<p class="label">航行状态:</p>
					<p>{{shipDetailInfo.navStatus || '--'}}</p>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import { getPopupContainer } from "untils/factory.js"
	import { mapGetters } from 'vuex'
	import {
		API_getApiTrainDeliverShipper,
		API_saveTrainDeliverShipper,
		API_saveDeliverInfo,
		API_getActualRouteInfo,
		API_GetShipHistoryList,
		API_ClearShipHistoryList,
		API_ShipSearch,
		API_GetShipDetailInfo
	} from "api";
	import { tencentCaptchaYD, FormatLonLat } from "@/v2/utils/factory";
	import reg from '@sub/utils/reg.js'

	export default {
		name: 'Left',
		computed: {
			...mapGetters('user', {
				VUEX_ST_COMPANYSUER: 'VUEX_ST_COMPANYSUER',
        VUEX_ST_PERSONALLINFO: 'VUEX_ST_PERSONALLINFO',
			}),
		},
		data() {
			return {
				getPopupContainer,
				key: this.$route.query.type,
				params: {
					shipperName: undefined, // 托运人名称
					serialNo: '' // 运单号
				},
				shipperNameList: '', // 托运人列表
				fetching: false,
				infoData: null,
				shipParams: {
					keyword: undefined
				},
				keywordList: [
				],
				shipHistoryList: [],
				shipDetailInfo: null
			}
		},
		watch:{
			//运单号输入时除去空格
			'params.serialNo'(value){
				if(value&&value.indexOf(' ') >= 0){
					this.params.serialNo = value.replace(/\s/g,"")
				}
			}
		},
		methods: {
			change(data) {
				this.key = data
				this.$emit('changeKey', data)
				this.$router.push('/travel/travelSearch?type='+data)

			},
			search() {
				if (!this.params.shipperName) {
					this.$message.error('托运人不能为空')
					return
				} else if (!this.params.serialNo) {
					this.$message.error('运单号不能为空')
					return
				} else if (this.params.serialNo.length != 13 && this.params.serialNo.length != 12) {
					this.$message.error('请输入12位或者13位运单号')
					return
				} 
				// else if (!this.params.code) {
				// 	this.$message.error('托运人编号为空')
				// 	return
				// }
				this.params.dataSource = 0
				this.params.createCompanyName = this.VUEX_ST_COMPANYSUER.companyName
				API_saveDeliverInfo(this.params).then(res => {
					if (res.success) {
						this.getTrailRecord()
					}
				})
			},
			reset() {
				this.params = {
					shipperName: undefined,
					serialNo: ''
				}
				this.infoData = null
				this.$emit('getTrainData', this.infoData)
			},
			handleShipperNameSelect(val) { // 选中托运人
				this.shipperNameList.forEach(item =>{
					if (item.name == val) {
						this.params.code = item.code
						if (!item.existed) { // 如果不存在则推送
							API_saveTrainDeliverShipper({
								shipperName: val
							}).then(res => {
								if (res.success) {
									this.params.code = res.data.code
								}
							})
						}
					}
				})
				this.params.shipperName = val
			},
			handleShipperNameSearch(name) { //获取托运人列表（数据来源已存在和企查查获得）
				name = name.replace(/\s/g,"")

				if(!name)return
				if(!reg.hanZi.test(name)) {
					this.$message.error('请输入至少两个汉字且以汉字结尾')
					return
				}
				this.shipperNameList = []
				this.fetching = true
				API_getApiTrainDeliverShipper({
					keyword: name
				}).then(res => {
					if (res.success) {
						this.fetching = false
						this.shipperNameList = res.data || []
						// 检索托运人为空时支持用户输入的托运人
						if (this.shipperNameList.length == 0) {
							let obj = {}
							obj.name = name
							obj.code = null
							obj.existed = false
							this.shipperNameList.push(obj)
						} else {
							let sameFlag = false
							this.shipperNameList.forEach((item)=>{
							if (item.name == name) {
								sameFlag = true
							}
							})
							if (!sameFlag) {
								let obj = {}
								obj.name = name
								obj.code = null
								obj.existed = false
								this.shipperNameList.unshift(obj)
							}
						}
					}
				})
			},
			getTrailRecordFunc({ ticket, randstr }) {
				API_getActualRouteInfo({
					shipperName:this.params.shipperName,
					shipperCode:this.params.code,
					serialNo:this.params.serialNo,
					ticket,
					randomStr:randstr
				}).then(res=>{
					if(res.success){
						this.infoData= res.data
						this.$emit('getTrainData', this.infoData)
					}
				})
			},
			getTrailRecord() { // 获取火运轨迹详情
				API_getActualRouteInfo({shipperName:this.params.shipperName,shipperCode:this.params.code,serialNo:this.params.serialNo}).then(res=>{
					if(res.success){
						this.infoData= res.data
						this.$emit('getTrainData', this.infoData)
					} else {
						if (res.error.code === 666666) {
							tencentCaptchaYD(this.getTrailRecordFunc,this.VUEX_ST_PERSONALLINFO.mobile)
						}
					}
				})
			},

			handleKeyWordFocus(e) { // 获取历史数据
				if (e.target.value === '') {
					API_GetShipHistoryList().then(res=>{
						if (res.success) {
							this.keywordList = null
							this.shipHistoryList = res.data || []
						}
					})
				} else {
					this.handleKeyWordSearch(e)
				}
			},
			clearHistory() { // 清空历史记录
				this.shipHistoryList = null
				API_ClearShipHistoryList().then(res=>{
					if (res.success) {
						this.shipHistoryList = null
					}
				})
			},
			handleKeyWordSearch(e) { // 获取检索字段
				this.shipHistoryList = null
				API_ShipSearch({keyword: e.target.value}).then(res=>{
					if (res.data) {
						this.keywordList = res.data || []
					}
				})
			},
			choose(item) { // 选中船运信息
				this.shipParams.keyword = item.nameEn
				this.shipHistoryList = null
				this.keywordList = null
				this.mmsi = item.mmsi
				API_GetShipDetailInfo({
					mmsi: item.mmsi
				}).then(res=>{
					if(res.success) {
						this.shipDetailInfo = res.data
						this.shipDetailInfo.lat = FormatLonLat(this.shipDetailInfo.lat, 'lat')
						this.shipDetailInfo.lon = FormatLonLat(this.shipDetailInfo.lon, 'lon')
						this.$emit('getShipData', this.shipDetailInfo)
					} else {
						if (res.error.code === 666666) {
							tencentCaptchaYD(this.getShipDetailFunc,this.VUEX_ST_PERSONALLINFO.mobile)
						}
					}
				})
			},
			getShipDetailFunc({ ticket, randstr }) {
				API_GetShipDetailInfo({
					mmsi: this.mmsi,
					ticket,
					randomStr:randstr
				}).then(res=>{
					if(res.success) {
						this.shipDetailInfo = res.data
						this.shipDetailInfo.lat = FormatLonLat(this.shipDetailInfo.lat, 'lat')
						this.shipDetailInfo.lon = FormatLonLat(this.shipDetailInfo.lon, 'lon')
						this.$emit('getShipData', this.shipDetailInfo)
					}
				})
			}
		}
	}
</script>
<style lang="less" scoped>
	.leftContent {
		padding: 16px 10px 0 10px;
		min-height: 240px;
		max-height: 746px;
		overflow: auto;
		button {
			width: 109px;
		}
		::v-deep.ant-btn-primary:hover, .ant-btn-primary:focus {
			border-color: @primary-color;
			background-color: @primary-color;
		}
		.train-btn {
			border-radius: 4px 0 0 4px;
		}
		.ship-btn {
			border-radius: 0 4px 4px 0;
		}
		.search-box {
			width: 218px;
			margin-bottom: 10px;
			.ant-select {
				width: 100%;
			}
			&>p {
				margin: 8px 0 3px 0;
				i {
					display:inline-block;
					color:red;
					margin-right:10px;
					position:relative;
					top:2px;
				}
			}
			.btn-box {
				text-align: center;
				margin-top: 14px;
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				button {
					width: 100px;
				}
			}
		}

		.s-card-info {
			border-top:1px solid #E9EFFC;
			margin-top: 20px;
			padding-top: 10px;
			font-family: PingFangSC-Regular, PingFang SC;
			color: rgba(0,0,0,0.8);
			margin-bottom: 10px;
			.title {
				font-size: 14px;
				font-family: PingFangSC-Medium, PingFang SC;
				margin-bottom: 8px;
			}
			.info-item {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				p {
					min-width: 60px;
					text-align: right;
					line-height: 22px;
					margin-bottom:5px;
				}
				p.label {
					color: #8495AA;
					text-align: left;
				}
				strong {
					font-style: normal;
					font-family: PingFangSC-Medium, PingFang SC;
				}
				img {
					width: 20px;
					height: 20px;
					margin-right: 10px;
				}
				i {
					display: inline-block;
					width: 20px;
					height: 11px;
					margin: 0 18px;
					position: relative;
					top:5px;
					background: url('../../../assets/imgs/travel/route-icon.png') no-repeat 100%/cover;
				}
			}
		}

		.s-card-content {
			height: 240px;
			margin-top: 10px;
			overflow: auto;
			flex: 1;
			position: relative;
			padding: 7px 16px 14px 16px;
			.record-list-item{
				position: relative;
				border-left: none;
				padding-left: 12px;
				margin-bottom: 12px;
				p {
				position: relative;
				margin-top: -6px;
				margin-bottom: 0px;
				font-weight: bold;
				color: rgba(0,0,0,0.8);
				}
				em {
				display: block;
				position: absolute;
				left: -6px;
				top: -9px;
				width: 10px;
				height: 10px;
				background: url("../../../assets/imgs/travel/now.png") no-repeat;
				}
				b {
				font-weight: normal;
				display: inline-block;
				margin-bottom: 10px;
				font-size: 12px;
				color:#C8CCD5;
				position: relative;
				top:-2px;
				}
				a {
				font-size: 12px;
				float: right;
				margin-top:2px;
				cursor: pointer;
				}
				.record-list-item-text {
					position: relative;
					top: -14px;
					span {
						font-family: PingFangSC-Medium, PingFang SC;
						font-weight: 500;
						color:  @primary-color;
						line-height: 20px;

					}
				}
			}
			.blue{
				border-left: 1px solid rgba(70,130,243,0.2);
				p{
				font-weight: 500;
				color: @primary-color;
				margin-bottom: 4px
				}
				em{
				background: url("../../../assets/imgs/travel/blue-icon.png") no-repeat;
				}
			}
			.end {
				margin-bottom: 0;
				em{
					left: -5px;
					background: url("../../../assets/imgs/travel/blue-icon.png") no-repeat;
				}
				b {
					margin-bottom: 0;
				}
			}
		}

		.ship{
			min-heigth: 300px;
			.search-box {
				width: 220px;
				position: relative;
				.ship-input {
					width: 220px;
					border-radius: 4px;
					padding:4px 14px 4px 2px;
					box-sizing: border-box;
					margin-top: 16px;
				}
				input::-webkit-input-placeholder{ font-size: 12px; }
				&>span {
					display: inline-block;
					width: 18px;
					height: 32px;
					border-left: none;
					position: absolute;
					top: 18px;
					right: 0;
					cursor: pointer;
					img {
						display: block;
						margin: 8px auto;
					}
				}
				.history-box,.keyword-box {
					width: 220px;
					max-height: 246px;
					background: #FFFFFF;
					box-shadow: 0px 0px 6px 0px rgba(0,90,255,0.32);
					border-radius: 4px;
					margin-top:5px;
					.history-item {
						padding: 10px 10px 0 10px;
						max-height: 212px;
						overflow: auto;
						p {
							font-family: PingFangSC-Regular, PingFang SC;
							color: #8495AA;
							line-height: 22px;
							padding-left: 24px;
						}
						span {
							line-height: 22px;
							position: relative;
							top: 1px;
							left: 8px;
						}
					}
					.clear-btn {
						width: 100%;
						height: 34px;
						text-align: center;
						font-size: 10px;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #8495AA;
						line-height: 34px;
						border: 1px solid #E9EFFC;
						cursor: pointer;
					}
				}
				.keyword-box {
					.history-item {
						height: 246px;
					}
				}
			}
		}
	}
	.SHIP {
		.leftContent {
			padding-right: 0px;
			.s-card-info {
				padding-right: 10px;
			}
		}
	}
</style>
