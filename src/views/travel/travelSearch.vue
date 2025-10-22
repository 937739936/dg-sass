<template>
    <div class="lay-container">
        <div class="lay-wrapper">
			<div class="wrap-top">
				<div class="menu-wrap">
					<div class="menu-block">
						<router-link to="/">
							<img src="~imgs/logo.png" style="width: 122px;" />
						</router-link>
					</div>
				</div>
			</div>
            
            <div class="logistics-box">
				<div class="logistics-detail">
					<div class="info-box">
						<div class="map-box">
							<div class="carMap">
								<MapRouteTrain v-if="type==='TRAIN'" :siteInfo="siteInfo"></MapRouteTrain>
								<MapRouteShip
									v-if="type==='SHIP'"
									:shipData="{historyShipData,singleShipData}"
								></MapRouteShip>
							</div>

							<div
								:class="{
									leftBox: true,
									'left': leftVisible,
									'leftT': !leftVisible,
									'TRAIN': type ==='TRAIN',
									'SHIP': type ==='SHIP',
									'trainInfoData': trainInfoData,
									'shipDetailInfo': shipDetailInfo
								}">
								<div>
									<Left ref="leftContent" @changeKey="changeKey" @getTrainData="getTrainDataFunc" @getShipData="getShipDataFunc"/>
								</div>
								<div class="left-btn-box">
									<div
										:class="{
											'left-btn': true,
											'caret-left': !leftVisible,
											'caret-right': leftVisible,
										}"
										@click="leftVisible = !leftVisible"
									>
										<i></i>
									</div>
								</div>
							</div>
							<div
								v-if="(type==='TRAIN' && trainInfoData) || (type==='SHIP' && mmsi)"
								:class="{
									bottomBox: true,
									'bottom': bottomVisible,
									'bottomT': !bottomVisible,
								}">
								<div>
									<Bottom ref="bottomContent" :type="type" :trainInfoData="trainInfoData" :text="text" :mmsi="mmsi" @historyShipData="historyShipDataFunc"/>
								</div>
								<div class="bottom-btn-box">
									<div
										:class="{
											'bottom-btn': true,
											'caret-up': bottomVisible,
											'caret-down': !bottomVisible,
										}"
										@click="bottomVisible = !bottomVisible"
									>
										<i></i>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
            </div>
        </div>
    </div>
</template>
<script>
import MapRouteTrain from "../../components/map/MapRouteTrain"
import MapRouteShip from '../../components/map/MapRouteShip'
import Left from "./components/Left.vue"
import Bottom from "./components/Bottom.vue"
import { 
	API_GetShipPosition
} from 'api'
export default {
    name: 'travelSearch',
    data() {
        return {
			leftVisible: false,
			bottomVisible: false,
			type: this.$route.query.type, //TRAIN SHIP
			trainInfoData: null,
			siteInfo:[],
			statusData: [], // 运输状态的判断
			text: '',
			mmsi: '',
			historyShipData: [],
			singleShipData: '',
			shipName: '',
			shipDetailInfo: ''
        }
    },
    components: {
        MapRouteTrain,
		Left,
		Bottom,
		MapRouteShip
    },
	watch: {
		'type': function(data) {
			this.type = data
		},
		'siteInfo': function(data) {
			this.siteInfo = data
		},
		'trainInfoData': function(data) {
			this.trainInfoData = data
		},
		'text': function(data){
			this.text = data
		},
		'singleShipData': function(data) {
			this.singleShipData = data
		},
		'historyShipData': function(data) {
			this.historyShipData = data
		}
	},
    mounted() {
    },
    methods: {
		changeKey(data) {
			this.type = data
			if (data === 'SHIP') {
				this.$refs.leftContent.reset()
				this.text = null
				this.siteInfo = []
				this.statusData= []
				this.trainInfoData = null
			} else {
				this.shipDetailInfo = null
			}
		},
		getTrainDataFunc(infoData) { // 获取火运数据
			if (!infoData) { // 清除
				this.text = null
				this.siteInfo = []
				this.statusData= []
				this.trainInfoData = null
				return
			}
			this.trainInfoData = infoData?infoData.waybillInfoVO:''
			this.trainInfoData.shipperName = infoData.shipperName
			this.text = this.smallToBig(this.trainInfoData.totalCost)
			let data = infoData.waybillPhaseTraceInfoVO
			if (data.length > 0) {
				data.forEach((item)=>{
					this.statusData.push(item.name)
				})
			}
			let records = infoData.trailRecordItemList || []
			let start =  [] // type=1 起点
			let end = [] // type=3 终点
			let routeList = []
			let middle = ''
			for (let i = 0; i < records.length; i++ ) {
				let item = records[i]
				if (item.type == 1 || item.type == 3) {
					let arr = item.evtDate.split(' ')
					if (arr[1] == '00:00') item.evtDate = arr[0]
					item.arriveDate = ''
					if (item.type == 1) start.push(item)
					if (item.type == 3) end.push(item)
				} else {
					middle = item
					if (i+1 <records.length) {
						if (middle.longitude == records[i+1].longitude && middle.latitude == records[i+1].latitude) {
							middle.arriveDate = records[i+1].evtDate
							routeList.push(middle)
							i++
						} else {
							middle.arriveDate = records[i].evtDate
							routeList.push(middle)
						}
					} else {
						middle.arriveDate = records[i].evtDate
						routeList.push(middle)
					}
				}
			}
			this.siteInfo = [].concat(start).concat(routeList).concat(end)

		},
		smallToBig(money) {
			//  将数字金额转换为大写金额
			var cnNums = new Array(
				"零",
				"壹",
				"贰",
				"叁",
				"肆",
				"伍",
				"陆",
				"柒",
				"捌",
				"玖"
			); //汉字的数字
			var cnIntRadice = new Array("", "拾", "佰", "仟"); //基本单位
			var cnIntUnits = new Array("", "万", "亿", "兆"); //对应整数部分扩展单位
			var cnDecUnits = new Array("角", "分", "毫", "厘"); //对应小数部分单位
			var cnInteger = "整"; //整数金额时后面跟的字符
			var cnIntLast = "元"; //整数完以后的单位
			//最大处理的数字
			var maxNum = 999999999999999.9999;
			var integerNum; //金额整数部分
			var decimalNum; //金额小数部分
			//输出的中文金额字符串
			var chineseStr = "";
			var parts; //分离金额后用的数组，预定义
			if (money == "") {
				return "";
			}

			money = parseFloat(money);
			if (money >= maxNum) {
				//超出最大处理数字
				return "超出最大处理数字";
			}
			if (money == 0) {
				chineseStr = cnNums[0] + cnIntLast + cnInteger;
				return chineseStr;
			}

			//四舍五入保留两位小数,转换为字符串
			money = Math.round(money * 100).toString();
			integerNum = money.substr(0, money.length - 2);
			decimalNum = money.substr(money.length - 2);

			//获取整型部分转换
			if (parseInt(integerNum, 10) > 0) {
				var zeroCount = 0;
				var IntLen = integerNum.length;
				for (var i = 0; i < IntLen; i++) {
				var n = integerNum.substr(i, 1);
				var p = IntLen - i - 1;
				var q = p / 4;
				var m = p % 4;
				if (n == "0") {
					zeroCount++;
				} else {
					if (zeroCount > 0) {
					chineseStr += cnNums[0];
					}
					//归零
					zeroCount = 0;
					chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
				}
				if (m == 0 && zeroCount < 4) {
					chineseStr += cnIntUnits[q];
				}
				}
				chineseStr += cnIntLast;
			}
			//小数部分
			if (decimalNum != "") {
				var decLen = decimalNum.length;
				for (var i = 0; i < decLen; i++) {
				var n = decimalNum.substr(i, 1);
				if (n != "0") {
					chineseStr += cnNums[Number(n)] + cnDecUnits[i];
				}
				}
			}
			if (chineseStr == "") {
				chineseStr += cnNums[0] + cnIntLast + cnInteger;
			} else if (decimalNum == "" || /^0*$/.test(decimalNum)) {
				chineseStr += cnInteger;
			}
			return chineseStr;
		},

		getShipDataFunc(data) {
			this.shipDetailInfo = data
			this.mmsi = data.mmsi
			this.shipName = data.shipNameChs
			this.historyShipData = []
			let {mmsi}=this;
			API_GetShipPosition({mmsi}).then(res=>{
				if (res.success) {
					this.singleShipData = {...res.data,mmsi}
				}
			})
		},
		historyShipDataFunc(data) {
			this.historyShipData = []
			let {mmsi}=this;
			this.historyShipData = data.map((item) => {
              return { ...item, mmsi };
			})
		}
    },
}
</script>

<style lang="less" scoped>
.lay-container {
	height: 100%;
	.lay-wrapper {
		height: 100%;
		position: relative;
		.wrap-top {
			width:100%;
			height: 64px;
			background: #fff;
			position: absolute;
			top: 0;
			padding: 12px 30px;
			.menu-wrap {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: center;
				position: relative;
				z-index: 9999;
			}
		}
	} 
}
.logistics-box {
    background: #f4f5f8;
    padding: 94px 30px 22px 30px;
	width: 100%;
	height: 100%;
    .logistics-detail {
        width: 100%;
		height: 100%;
        margin: 0px auto;
        .info-box {
            background: #ffffff;
			height: 100%;
			padding: 30px 20px;
        }
    }
    .map-box {
        position: relative;
        height: 100%;
        overflow: hidden;
        .carMap {
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: 5px;
            overflow: hidden;
        }
		.leftBox {
			width:240px;
			height: auto;
			max-height: 746px;
			background: #fff;
			border-radius: 6px;
			position: absolute;
			top: 20px;
			box-shadow: 0px -1px 2px 2px rgba(6, 31, 77, 0.05);
			z-index: 1000;
			.left-btn-box {
				position: absolute;
				left: 238px;
				top: 100px;
				.left-btn {
					height: 46px;
					width: 16px;
					i {
						display: inline-block;
						height: 46px;
						width: 16px;
					}
				}
				.caret-left  i{
					background: url('../../assets/imgs/travel/left-close.png')  no-repeat 100%/cover
				}
				.caret-right i{
					background: url('../../assets/imgs/travel/left-open.png')  no-repeat 100%/cover
				}
			}
		}
		.trainInfoData .left-btn-box {
			top: 254px;
		}
		.shipDetailInfo .left-btn-box {
			top: 254px;
		}
		.left { 
			left:-240px; 
			transition: left 0.5s;
		}
		.leftT {
			left: 16px;
			transition: left 0.5s;
		}
		.bottomBox {
			width: 1052px;
			height: 312px;
			background: #fff;
			border-radius: 6px;
			position: absolute;
			right: 16px;
			box-shadow: 0px -1px 2px 2px rgba(6, 31, 77, 0.05);
			z-index: 1000;
			.bottom-btn-box {
				position: absolute;
				bottom: 310px;
				left: 520px;
				.bottom-btn {
					height: 16px;
					width: 46px;
					i {
						display: inline-block;
						height: 16px;
						width: 46px;
					}
				}
				.caret-up i{
					background: url('../../assets/imgs/travel/bottom-open.png')  no-repeat 100%/cover
				}
				.caret-down i{
					background: url('../../assets/imgs/travel/bottom-close.png')  no-repeat 100%/cover
				}
			}
		}
		.bottom { 
			bottom:-312px; 
			transition: bottom 0.5s;
		}
		.bottomT {
			bottom:16px;
			transition: bottom 0.5s;
		}
	}
}
</style>
