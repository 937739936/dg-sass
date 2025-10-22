<template>
  <div class="travel">
    <div class="header">
      <a href="https://www.shdatalink.com">
        <img src="../../assets/imgs/travel/logo.png" alt="">
      </a>
    </div>
    <div class="content">
      <div class="center">
        <div class='title'>
          火运轨迹信息
        </div>
        <template v-if="selectBatch.deliverNo">
          <div class="s-card-title">
            <b>发货信息</b>
          </div>
          <div class='no'>
            <b style='margin-right: 24px'>发货批次号：{{selectBatch.deliverNo}}</b>
            <span class='batch'>当前发运下分为{{tabSource.length}}个批次到厂</span>
          </div>
        </template>
        <div>
          <a-tabs @change='changeTab'>
            <a-tab-pane :key="key" :tab="item.enterBatch" v-for='(item,key) in tabSource'>
            </a-tab-pane>
          </a-tabs>
          <a-table :columns="columns" :data-source="selectBatch.ticketOcrInfos" :pagination='false'
                   :scroll="{y: 370 }"
                   style='margin-bottom: 70px'>
            <template slot="action" slot-scope="text, record">
              <a href='javascript:;' @click='waybillDetail(record)'>查看运单详情</a>
            </template>
          </a-table>
        </div>
        <div class="s-card-title" v-if="selectBatch.deliverNo">
          <b>到厂批次全过程跟踪</b>
        </div>
        <div class="s-card-content">
          <a-row>
            <a-col :span="4" style='position: absolute;left: 0;top: 0;z-index: 999;background: #fff;left: 20px;top: 20px;'>
              <div class="content-left" v-if="selectBatch.trajectoryPointInfoList">
                <div v-if="selectBatch.trajectoryPointInfoList && selectBatch.trajectoryPointInfoList.length>0">
                  <div class="record-list-item" v-for="(item,index) in selectBatch.trajectoryPointInfoList" :class="index == selectBatch.trajectoryPointInfoList.length-1 ? '': 'blue'">
                    <em></em>
                    <div v-for="pro in item">
                      <p>
                        <span v-if="pro.trajectoryDesc.indexOf('【') == -1">{{pro.trajectoryDesc}}</span>
                        <span style="display: inline-block;text-indent: -8px;" v-if="pro.trajectoryDesc.indexOf('【') != -1">{{pro.trajectoryDesc}}</span>
                        <!--												<a href="javascript:;" v-if="pro.trajectoryDesc.indexOf('制票') != -1" @click="change('serial')">查看运单信息</a>-->
                        <!--												<a href="javascript:;" v-if="pro.startFlag" @click="change('trail')">查看轨迹信息</a>-->
                      </p>
                      <b style='font-weight: 400;color: rgba(0,0,0,0.8);font-size: 12px'>{{pro.trajectoryDate && pro.trajectoryDate.slice(0,10)}}</b>
                      <b style='font-weight: 400;color: rgba(0,0,0,0.8);font-size: 12px;float: right'>{{pro.trajectoryDate && pro.trajectoryDate.slice(10,20)}}</b>
                    </div>
                  </div>
                </div>
                <div v-else>
                  暂无数据
                </div>
              </div>
            </a-col>
            <a-col :span="24">
              <div class="content-right">
                <div class='right-tab-pane'>
                  <a-radio-group v-model='activeName' button-style="solid" @change='change'>
                    <a-radio-button value="trail">
                      轨迹地图
                    </a-radio-button>
                    <a-radio-button value="serial">
                      运单列表
                    </a-radio-button>
                  </a-radio-group>
                </div>
                <!--                                <a-tabs v-model='activeName' >-->
                <!--                                    <a-tab-pane key="trail" tab="轨迹图">-->
                <!--                                    </a-tab-pane>-->
                <!--                                    <a-tab-pane key="serial" tab="运单表">-->
                <!--                                    </a-tab-pane>-->
                <!--                                </a-tabs>-->
                <div v-show="activeName == 'serial' && trainInfoData"  style='width:80%;float: right'>
                  <div>
                    <h2 style="margin: 20px auto 30px;text-align:center;">货物运单</h2>
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
                          <span>增值税发票类型</span><br/>
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
                      <tr v-for="(item,index) in trainInfoData.waybillVehicleInfoVO">
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
                <MapRouteTrain :siteInfo="siteInfo" v-show="activeName == 'trail'"></MapRouteTrain>
              </div>
            </a-col>
          </a-row>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {API_getSoaBuildWaybillInfoVO, API_ExportTrainTable, API_getSoaTrailRecordTrain} from 'api'
import {
  API_ShipmentPlanTrainDetail
} from "@/v2/center/steels/api/deliverPlan.js";
import MapRouteTrain from "../../components/map/MapRouteTrain"
import comDownload from '@sub/utils/comDownload.js'

const columns = [
  {
    title: '序号',
    dataIndex: '',
    key: 'rowIndex',
    width: 60,
    align: 'center',
    customRender: function(t, r, index) {
      return parseInt(index) + 1
    }
  },
  {
    title: '运单号',
    align: 'center',
    dataIndex: 'waybillSerialNo'
  },
  {
    title: '托运人名称',
    align: 'center',
    dataIndex: 'shipperName'
  },
  {
    title: '发站',
    align: 'center',
    dataIndex: 'departureStation'
  },
  {
    title: '到站',
    align: 'center',
    dataIndex: 'arriveStation'
  },
  {
    title: '车种 车号',
    align: 'center',
    dataIndex: 'carTypeNumber'
  },
  {
    title: '票重(吨)',
    align: 'center',
    dataIndex: 'ticketWeight'
  },
  {
    title: '制单日期',
    align: 'center',
    dataIndex: 'makeBillDate'
  },
  {
    title: '所属文件名',
    align: 'center',
    dataIndex: 'fileName'
  },
  {
    title: '操作',
    dataIndex: 'action',
    align: 'center',
    scopedSlots: { customRender: 'action' }
  }
];
export default {
  name : "logisticsDetailNew",
  data(){
    return {
      siteInfo: [],
      tabSource: [],
      dataSource: [],
      columns,
      url: {
        detail: "/sys/waybill/trajectory/detail",
        getWaybillInfoVO: '/sys/waybill/trajectory/buildWaybillInfoVO'
      },
      selectBatch: [], // 发货信息
      statusData: [], // 运输状态的判断
      activeName: 'trail', // 展示轨迹还是运单信息
      trainInfoData: {}, // 货物运单表数据
      text: '0', // 货物运单金额大写
      waybillId: this.$route.query.id, // 运单id
    };
  },
  mounted(){
    this.getTrailRecord()
    if (this.$route.query.screenshot) this.columns = this.columns.filter(item=> item.dataIndex !=='fileName')
  },
  components: {
    MapRouteTrain
  },
  methods:{
    getTrailRecord() { // 获取轨迹信息 传参运单号
      let API = this.$route.query.from === 'steels' ? API_ShipmentPlanTrainDetail:API_getSoaTrailRecordTrain
      API({id: this.$route.query.waybillId}).then(res => {
        if (res.success) {
          this.tabSource = res.data
          this.selectBatch = res.data[0]
          this.setMap()
          this.getDocument(this.selectBatch.ticketOcrInfos[0]?.waybillSerialNo,this.selectBatch.ticketOcrInfos[0]?.shipperName)
        }
      })
    },
    setMap(){
      let data = this.selectBatch.waybillPhaseTraceInfoVO
      if (data.length > 0) {
        data.forEach((item)=>{
          this.statusData.push(item.name)
        })
      }
      let records = this.selectBatch.trailRecordItemList || []
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
    exportXls() { // 导出车号表
      API_ExportTrainTable({id: this.$route.query.waybillId}).then(res => {
        comDownload(res, undefined, '运单【' + this.trainInfoData.serialNo + '】车辆附表.xls')
      })
    },
    change(e) {
      this.activeName = e.target.value
    },
    changeTab(e){
      this.selectBatch = this.tabSource[e]
      this.setMap()
      this.getDocument(this.selectBatch.ticketOcrInfos[0]?.waybillSerialNo,this.selectBatch.ticketOcrInfos[0]?.shipperName)
    },
    waybillDetail(record){
      this.getDocument(record.waybillSerialNo,record.shipperName)
      this.change({target:{value:'serial'}})
    },
    getDocument(waybillNo,shipperName){
      if(waybillNo){
        API_getSoaBuildWaybillInfoVO({waybillNo,shipperName}).then(res=>{
          if(res.success){
            this.trainInfoData = res.data
            this.text = this.smallToBig(this.trainInfoData.totalCost)
          }
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.travel {
  position: absolute;
  width: 100%;
  min-height: 100%;
  overflow-y: auto;
  top: 0px;
  padding-top: 60px;
  left: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  background: #f4f5f8;
  .header{
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
    height: 60px;
    z-index: 99;
    background-color: #FFFFFF;
    padding-left: 30px;
    padding-top: 15px;
    img{
      height: 32px;
      cursor: pointer;
    }
  }
  .content {
    width: 100%;
    height: 100%;
    padding: 30px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    .center {
      width: 100%;
      height: 100%;
      background: #fff;
      padding: 20px;
      display: flex;
      flex-direction: column;
      .title{
        font-size: 20px;
        font-weight: bold;
        color: rgba(0,0,0,0.8);
        line-height: 28px;
        padding-bottom: 22px;
        border-bottom: 1px solid #E9EFFC;
        margin-bottom: 30px ;
      }
      .s-card-title {
        font-size: 16px;
        margin: 0 0 24px 0;
        color: rgba(0,0,0,0.8);
        padding-left: 10px;
        border-left: none;
        &:before{
          content: '';
          display: block;
          width: 2px;
          height: 16px;
          border-top-left-radius: 2px;
          border-bottom-left-radius: 2px;
          position: relative;
          top: 0px;
          background: #4682F3;
          left: -8px;
        }
      }
      .no{
        height: 24px;
        font-size: 14px;
        font-weight: 500;
        color: rgba(0,0,0,0.8);
        line-height: 24px;
        margin-bottom: 32px;
        &:before{
          content:'批';
          float:left;
          display: block;
          width: 18px;
          height: 18px;
          font-weight: 500;
          color: #4682F3;
          text-align: center;
          line-height: 18px;
          border-radius: 4px;
          position: relative;
          top: 3px;
          margin-right: 12px;
          background: rgb(238,243,253);
        }
        .batch{
          height: 24px;
          font-size: 12px;
          font-weight: 400;
          color: #8495AA;
          line-height: 24px;
          margin-left: 18px;
        }
      }
      .s-card-info {
        font-size: 12px;
        line-height: 20px;
        .ant-col strong {
          font-family: PingFangSC-Medium;
          color: #383A3F;
          i {
            display: inline-block;
            width: 42px;
            height: 14px;
            margin: 0 18px;
            position: relative;
            top:2px;
            background: url('../../assets/imgs/travel/route_icon.png') no-repeat 100%/cover;
          }
        }
        .ant-col p {
          font-family: PingFangSC-Regular;
          padding: 0 0 3px 10px;
          em {
            font-style: normal;
            display: inline-block;
            width: 72px;
          }
          span {
            display: inline-block;
            margin-left: 60px;
          }
        }
        .ant-form>.ant-row>.ant-col {
          height:28px;
        }
        .text-strong{
          font-weight: bold!important;
        }
        .ant-form-item-label {
          text-align:left;
        }
      }
      .s-card-status {
        padding: 22px 102px 28px 102px;
        display: flex;
        flex-direction: row;
        align-items: center;
        ul {
          margin: 0 auto;
          li {
            display:inline-block;
            span {
              display: inline-block;
              text-align: center;
              width: 40px;
              height: 40px;
              border-radius: 50%;
              background: #DDDFE4;
              font-family: PingFangSC-Regular;
              font-size: 12px;
              color: #6B6F76;
              line-height: 12px;
              padding-top: 14px;
              margin:0 8px;
            }
            i {
              display: inline-block;
              width:72px;
              height: 1px;
              background-color: #DDDFE4;
              position: relative;
              top: -4px;
            }
          }
          li.active{
            span {
              color: #FFFFFF;
              background: #0053DB;
            }
            i {
              background-color: #0053DB;
            }
          }
          li:last-child i {display: none;}
        }
      }
      .s-card-content {
        height: 780px;
        flex: 1;
        position: relative;
        .content-left {
          box-shadow: 0px 3px 3px 2px rgba(6,31,77,0.03);
          border-radius: 6px;
          padding: 30px 20px 20px 20px;
          height: 740px;
          overflow-y: auto;
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
              top: -8px;
              width: 10px;
              height: 10px;
              background: url("../../assets/imgs/travel/now.png") no-repeat;
            }
            b {
              font-weight: normal;
              display: inline-block;
              margin-bottom: 15px;
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
          }
          .blue{
            border-left: 1px solid rgba(70,130,243,0.2);
            p{
              font-weight: 500;
              color: #4682F3;
              margin-bottom: 6px
            }
            em{
              background: url("../../assets/imgs/travel/blue-icon.png") no-repeat;
            }
          }
        }
        .content-right {
          border: 1px solid #EEF0F2;
          height: 780px;
          border-radius: 4px;
          overflow-y: auto;
          position: relative;
          .right-tab-pane{
            position: absolute;
            right: 52px;
            top: 20px;
            z-index: 999;
          }
        }
      }
      ::v-deep .ant-tabs-bar{
        margin-bottom: 20px!important;
      }
      ::v-deep .ant-table-thead > tr > th{
        background: #F5F7FD;
        font-weight: 500;
        color: #8495AA;
      }
      ::v-deep .ant-radio-button-wrapper{
        width: 120px;
        height: 38px;
        line-height: 38px;
        text-align: center;
        border: 1px solid #4682F3;
      }
      ::v-deep .ant-radio-group-solid .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled){
        background: #4682F3;
        border-color: #4682F3;
      }
      ::v-deep .ant-table-tbody > tr > td{
        border-bottom: 1px solid #ECF2FD;
      }
      ::v-deep .ant-tabs-nav .ant-tabs-tab-active{
        font-weight: 500;
        color: #4682F3
      }
      ::v-deep .ant-tabs-ink-bar{
        background-color: #4682F3;
      }
    }
  }
}
/deep/.ant-form-item .ant-form-item-label {
  text-align: left;
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
</style>
