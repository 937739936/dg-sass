<template>
  <div class="slMain">
    <Breadcrumb />
    <a-card :bordered="false">
      <div class="methods-wrap">
        <span slot="title" class="slTitle">价格趋势查看</span>
      </div>
      <div class="new-detail" v-if="info">
        <div class="top-box">
          <div class="top-title">
            <p style="font-weight:600;color:font-size: 16px;color: rgba(0, 0, 0, 0.8);"> {{info.indexName}}：{{info.indicatorName}}</p>
            <p style="margin-left:26px;color: rgba(0, 0, 0, 0.6);font-size: 12px;">
              <span>更新频率：{{info.updateFrequencyDesc}} （{{info.updateRuleDesc}}）</span>
              <span>（单位：{{info.unit}}）</span>
            </p>
          </div>
          <div class="top-title2">
            <div class='top-itm'>
              <div class="item-title">最新价格</div>
              <p class="price" >{{info.latestPrice}}</p>
              <img src="@/assets/imgs/makeToMarket/money.png" alt="">
            </div>

            <div class='top-itm' :class="[info.lastFluctuateValue > 0 ? 'up' : info.lastFluctuateValue < 0 ? 'down' : 'common']">
              <p  class="top-tim-title">对比上期</p>
              <p v-if="info.lastFluctuateValue > 0" style="color:#DD4444" class="item-content">
                <span>+{{info.lastFluctuateValue}}</span>
                <span style="margin-left:5px">+{{(info.lastFluctuatePercent * 100).toFixed(2)}}%</span>
              </p>
              <p v-else-if="info.lastFluctuateValue < 0" style="color:#45BF83" class="item-content">
                <span>{{info.lastFluctuateValue}}</span>
                <span style="margin-left:5px">{{(info.lastFluctuatePercent * 100).toFixed(2)}}%</span>
              </p>
              <p v-else-if="info.lastFluctuateValue == 0" class="item-content">
                <span>{{info.lastFluctuateValue}}</span>
                <span style="margin-left:5px">{{(info.lastFluctuatePercent * 100).toFixed(2)}}%</span>
              </p>
              <p v-else>
                -
              </p>
              <img style="width:100px" v-if="info.lastFluctuateValue > 0" src="@/assets/imgs/makeToMarket/up.png" alt="">
              <img style="width:100px" v-if="info.lastFluctuateValue < 0" src="@/assets/imgs/makeToMarket/down.png" alt="">

            </div>
            <div class='top-itm' v-if="info.updateFrequency !='MONTH'" :class="[info.beginningOfMonthFluctuateValue > 0 ? 'up' : info.beginningOfMonthFluctuateValue < 0 ? 'down' : 'common']">
              <p  class="top-tim-title">对比月初</p>
              <p v-if="info.beginningOfMonthFluctuateValue > 0" style="color:#DD4444" class="item-content">
                <span>+{{info.beginningOfMonthFluctuateValue}}</span>
                <span  style="margin-left:5px">+{{(info.beginningOfMonthFluctuatePercent * 100).toFixed(2)}}%</span>
              </p>
              <p v-else-if="info.beginningOfMonthFluctuateValue < 0" style="color:#45BF83" class="item-content">
                <span>{{info.beginningOfMonthFluctuateValue}}</span>
                <span  style="margin-left:5px">{{(info.beginningOfMonthFluctuatePercent * 100).toFixed(2)}}%</span>
              </p>
              <p  v-else-if="info.beginningOfMonthFluctuateValue == 0" class="item-content">
                <span>{{info.beginningOfMonthFluctuateValue}}</span>
                <span  style="margin-left:5px">{{(info.beginningOfMonthFluctuatePercent * 100).toFixed(2)}}%</span>
              </p>
              <p v-else>
                -
              </p>
              <img style="width:100px" v-if="info.beginningOfMonthFluctuateValue > 0" src="@/assets/imgs/makeToMarket/up.png" alt="">
              <img style="width:100px" v-if="info.beginningOfMonthFluctuateValue < 0" src="@/assets/imgs/makeToMarket/down.png" alt="">
            </div>
            <div class='top-itm'    v-if="info.updateFrequency !='MONTH'" :class="[info.lastMonthFluctuateValue > 0 ? 'up' : info.lastMonthFluctuateValue < 0 ? 'down' : 'common']">
              <p  class="top-tim-title">对比上月同期</p>
              <p v-if="info.lastMonthFluctuateValue > 0" style="color:#DD4444" class="item-content">
                <span>+{{info.lastMonthFluctuateValue}}</span>
                <span style="margin-left:5px">+{{(info.lastMonthFluctuatePercent * 100).toFixed(2)}}%</span>
              </p>
              <p v-else-if="info.lastMonthFluctuateValue < 0" style="color:#45BF83" class="item-content">
                <span>{{info.lastMonthFluctuateValue}}</span>
                <span style="margin-left:5px">{{(info.lastMonthFluctuatePercent * 100).toFixed(2)}}%</span>
              </p>
              <p v-else-if='info.lastMonthFluctuateValue == 0' class="item-content">
                <span>{{info.lastMonthFluctuateValue}}</span>
                <span style="margin-left:5px">{{(info.lastMonthFluctuatePercent * 100).toFixed(2)}}%</span>
              </p>
              <p v-else>-</p>
              <img style="width:100px" v-if="info.lastMonthFluctuateValue > 0" src="@/assets/imgs/makeToMarket/up.png" alt="">
              <img style="width:100px" v-if="info.lastMonthFluctuateValue < 0" src="@/assets/imgs/makeToMarket/down.png" alt="">
            </div>
            <div class='top-itm'  :class="[info.twoMonthAgoFluctuateValue > 0 ? 'up' : info.twoMonthAgoFluctuateValue < 0 ? 'down' : 'common']">
              <p  class="top-tim-title">对比上上月同期</p>
              <p v-if="info.twoMonthAgoFluctuateValue > 0" style="color:#DD4444" class="item-content">
                <span>+{{info.twoMonthAgoFluctuateValue}}</span>
                <span style="margin-left:5px">+{{(info.twoMonthAgoFluctuatePercent * 100).toFixed(2)}}%</span>
              </p>
              <p v-else-if="info.twoMonthAgoFluctuateValue < 0" style="color:#45BF83" class="item-content">
                <span>{{info.twoMonthAgoFluctuateValue}}</span>
                <span >{{(info.twoMonthAgoFluctuatePercent * 100).toFixed(2)}}%</span>
              </p>
              <p v-else-if="info.twoMonthAgoFluctuateValue == 0" class="item-content">
                <span>{{info.twoMonthAgoFluctuateValue}}</span>
                <span style="margin-left:5px">{{(info.twoMonthAgoFluctuatePercent * 100).toFixed(2)}}%</span>
              </p>
              <p v-else>
              -
              </p>
              <img style="width:100px" v-if="info.twoMonthAgoFluctuateValue > 0" src="@/assets/imgs/makeToMarket/up.png" alt="">
              <img style="width:100px" v-if="info.twoMonthAgoFluctuateValue < 0" src="@/assets/imgs/makeToMarket/down.png" alt="">
            </div>
            <div class='top-itm'  :class="[info.beginningOfYearFluctuateValue > 0 ? 'up' : info.beginningOfYearFluctuateValue < 0 ? 'down' : 'common']">
              <p  class="top-tim-title">对比年初</p>
              <p v-if="info.beginningOfYearFluctuateValue > 0" style="color:#DD4444" class="item-content">
                <span>+{{info.beginningOfYearFluctuateValue}}</span>
                <span style="margin-left:5px">+{{(info.beginningOfYearFluctuatePercent * 100).toFixed(2)}}%</span>
              </p>
              <p v-else-if="info.beginningOfYearFluctuateValue < 0" style="color:#45BF83" class="item-content">
                <span>{{info.beginningOfYearFluctuateValue}}</span>
                <span style="margin-left:5px">{{(info.beginningOfYearFluctuatePercent * 100).toFixed(2)}}%</span>
              </p>
              <p v-else-if="info.beginningOfYearFluctuateValue == 0" class="item-content">
                <span>{{info.beginningOfYearFluctuateValue}}</span>
                <span style="margin-left:5px">{{(info.beginningOfYearFluctuatePercent * 100).toFixed(2)}}%</span>
              </p>
              <p v-else>
                -
              </p>
              <img style="width:100px" v-if="info.beginningOfYearFluctuateValue > 0" src="@/assets/imgs/makeToMarket/up.png" alt="">
              <img style="width:100px" v-if="info.beginningOfYearFluctuateValue < 0" src="@/assets/imgs/makeToMarket/down.png" alt="">
            </div>
          </div>
        </div>
        <div id='main' style="width:100%;height:600px"></div>
      </div>
    </a-card>
  </div>
</template>

<script>
import * as echarts from "echarts";
import Breadcrumb from '@/v2/components/breadcrumb/index';
import {
  getPriceTrend,
} from "@/v2/center/logisticsPlatform/api/inventory"
export default {
  data(){
    return {
      info: null,
      myChart: {},
      startValue: 0,
      endValue: 0,
    }
  },
  components: {
    Breadcrumb,
  },
  mounted(){
   this.getInfo();
  },
  methods:{
    async getInfo() {
      const res = await getPriceTrend({
        indicatorId: this.$route.query.indicatorId
      })
      if (!res.success) return
      this.info = res.data
      let coordinateList = this.info.coordinateList || []
      let dateList = []
        dateList = coordinateList.map(el => el.beginDate)
      const unitPriceList =  coordinateList.map(el => el.price)
      const rateList = coordinateList.map(el => ( el.lastFluctuatePercent * 100).toFixed(2) )
      this.coordinateList = coordinateList
      this.$nextTick(() => {
        this.init(dateList, unitPriceList, rateList, coordinateList)
      })
    },
    init( dateList, unitPriceList, rateList, coordinateList) {
      var chartDom = document.getElementById('main');
      this.myChart = echarts.init(chartDom);
      // /**  */
      let start=unitPriceList[this.startValue]/(1+rateList[this.startValue]/100)
      var minData2 =this.calMin(rateList)
      var maxData2 =this.calMax(rateList)

      if(minData2!=0&&maxData2!=0){
        //如果0不在边界线，重新计算分配
        let max=Math.abs(maxData2);
        let min=Math.abs(minData2);

        let maxD= max+min;
        //刻度
        let scale=maxD/5>0.01?maxD/5:0.01;
        //占比
        let maxProportion=max/maxD*5
        scale=Math.ceil(maxProportion)/maxProportion*scale
        maxProportion=Math.ceil(maxProportion)
        minData2=-(6-maxProportion)*scale;
        maxData2=maxProportion*scale;
      }

      var minData1 = start*(1+minData2/100);
      var maxData1 = start*(1+maxData2/100);
      console.log(minData2,maxData2,minData1,maxData1)
      let that = this

      var option;
      option = {
        tooltip: {
          trigger: 'axis',
          backgroundColor:'#fff',
          borderWidth: '0', //边框宽度设置1
          borderColor: 'rgba(229,233,238,0.5)', //设置边框颜色
          borderRadius: '0',
          padding: 0,
          axisPointer: {
            type: 'line',
            label: {
              show: false
            },
            lineStyle: {
              color: '#1890FF',
              type: 'dashed'
            },
            crossStyle: {
              color: '#1890FF',
              type: 'dashed'
            }
          },
          position: function (point, params, dom, rect, size) {
            // 固定在顶部
            return [point[0] - 68, point[1] - 120];
          },
          formatter: function(params){ // 鼠标移入展示百分比

            let date = ''
            params.forEach(el => {
              date = el.name
            });
            const item = coordinateList.find(el => date.includes(el.beginDate) ) || {}

            date = date.replace('-', '年').replace('-', '月') + '日'
            /** 反查数据 */
            let str1 = `<div class='tooltip2'>
              <div style='color: #8495AA;'>${date}</div>
              <div class='first '>
                 <span class='dot'></span>
                <span style='color: rgba(0, 0, 0, 0.8);'>${item.price}</span>
              </div>

              <div class='sen' style='color:#DD4444'>
                <span> +${item.lastFluctuateValue}</span>
                <span  class='price'> +${(item.lastFluctuatePercent * 100).toFixed(2)}%</span>
              </div>
            </div>`
            let str2 = `<div class='tooltip2'>
              <div style='color: #8495AA;'>${date}</d>
              <div class='first'>
                <span class='dot'></span>
                <span style='color: rgba(0, 0, 0, 0.8);'>${item.price}</span>
              </div>
              <div class='sen' style='color:#45BF83'>
                <span> ${item.lastFluctuateValue}</span>
                <span class='price2'> ${(item.lastFluctuatePercent * 100).toFixed(2)}%</span>
              </div>
            </div>`
            let str3 = `<div class='tooltip2'>
              <div style='color: #8495AA;'>${date}</div>
                <div class='first'>
                  <span class='dot'></span>
                 <span style='color: rgba(0, 0, 0, 0.8);'>${item.price}</span>
              </div>
              <div class='sen'>
                <span>-</span>
                <span>-</span>
              </div>
            </div>`
            if(item.lastFluctuateValue > 0) {
              return str1
            }
            if(item.lastFluctuateValue < 0) {
              return str2
            }
            return str3
          }
        },
        grid: {
        // 纵坐标标题宽度
          top: 50,
          left:80,
          right: 80,
          bottom: 120,
        },
        dataZoom: [
          {
            show: true,
            realtime: false,
            startValue: this.startValue,
            endValue:dateList.length - 1 ,
            backgroundColor: '#F7F9FD',
            borderColor: '#F7F9FD',
            dataBackground: {
              lineStyle: {

              }
             },
            // xAxisIndex: [0, 1]
          }
        ],
        xAxis: [
          {
            type: 'category',
            boundaryGap: true,
            axisLine: {
              show:true,
              lineStyle: {
                color: 'rgba(153, 167, 185, 0.40)',
              }
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              textStyle: {
                color: 'rgba(0, 0, 0, 0.8)'
              },
              margin: 20,
              // padding: [0, 0, 0, 20]
            },
            nameTextStyle: {
              // padding: [0,0,50,50]

            },
            data: dateList,
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '价格',
            nameTextStyle: {
                // fontWeight: ''
                padding: [0,50,16,0],
            },
            axisLabel: {
              formatter: (value) => {
                return value.toFixed(2)
              },
               textStyle: {
                color: 'rgba(0, 0, 0, 0.8)'
              },
            },

            axisLine: {show: false},
            min: minData1,
            max: maxData1,
            splitNumber: 6, //设置坐标轴的分割段数
            interval: (maxData1 - minData1) / 6, // 标轴分割间隔
            axisTick: {
              show: false,
            },
            alignTicks: true,
            splitLine: {
              show: false,
              lineStyle: {
                color: 'rgba(153, 167, 185, 0.40)',
                width: 0.8,
              },
            },
          },
          {
            type: 'value',
            name: '涨跌幅',
            nameTextStyle: {
              fontWeight: ''
            },
            yAxisIndex: 1,
            axisTick: {
              show: false,
            },
            alignTicks: true,
            axisLine: {show: false},
            nameTextStyle: {
               padding: [0,0,16,50],
              // padding: [0, 50, -50, 200]
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: '#EDEDED',
                width: 0.8,
              },
            },
            min: minData2,
            max: maxData2,
            splitNumber: 6,
            interval: (maxData2 - minData2) / 6,
            axisLabel: {
             textStyle: {
              color: (value) => {

                let newVal = Number(value).toFixed(2)
                if(newVal == 0) return '#000'

                if(newVal > 0) return '#DD4444'
                if(newVal < 0) return '#45BF83'
                return '#ccc'

              }
             },
              formatter: (value) => {
              if( value.toFixed(2) == 0) return '0'
                return (value).toFixed(2) + '%'
              },

            }
          }

        ],
        series: [
          {
            name: '价格',
            type: 'line',
            //  yAxisIndex: 1,
            lineStyle: {
              color: '#1890FF'
            },
            itemStyle: {
              normal: {
                color: '#1890FF'
              }
            },
            showSymbol: false,
            tooltip: {
              valueFormatter: function (value) {
                return value;
              }
            },
            data: unitPriceList,
          },
        ]
      };
      // myChart.setOption(option, true);
      this.myChart.setOption(option, true);
      window.onresize = this.myChart.resize;
      // let that = this
      let allDateList = dateList
      this.myChart.on('datazoom', async () => {
        //监听echarts的拖动事件
        let xAxis = that.myChart.getModel().option.dataZoom[0];
        if( xAxis.startValue == this.startValue) {
          return
        }
        this.startValue = xAxis.startValue

        const beginDate = allDateList[this.startValue]
        const params = {
          indicatorId: this.$route.query.indicatorId,
          beginDate,
        }
        const res = await getPriceTrend(params)
        if (!res.success) return
        this.info = res.data
        let coordinateList = this.info.coordinateList || []
        let newDateList = []
        /** 获取x轴日期 */
        newDateList = coordinateList.map(el => el.beginDate)
        /** 获取y轴日期 */
        const unitPriceList = coordinateList.map(el => el.price)
        // 获取最大值 最小值
        const rateList = coordinateList.map(el => ( el.lastFluctuatePercent * 100).toFixed(2) )
        this.myChart && this.myChart.clear()
        this.init(newDateList, unitPriceList, rateList, coordinateList)
      })
    },
    // 获取最大值方法
    calMax(arr) {
      var max = Math.max.apply(null, arr); // 获取最大值方法
      var maxint = Math.ceil(max / 5); // 向上以5的倍数取整
      var maxval = maxint * 5; // 最终设置的最大值
      return maxval; // 输出最大值
    },
    // 获取最小值方法
    calMin(arr) {
      var min = Math.min.apply(null, arr); // 获取最小值方法
      var minint = Math.floor(min / 1); // 向下以1的倍数取整
      var minval = minint * 1; // 最终设置的最小值
      return minval; // 输出最小值
    },
  }
}



</script>

<style lang="less" scoped>
@import url("~@/v2/style/table-cover.less");
</style>
<style scoped lang='less'>
.new-detail {
  padding-bottom: 80px;
}
.title {
  display: flex;
  align-items: center;
  // font-weight: 600;
  justify-content: space-between;
  padding: 0 7%;
  color:rgba(0, 0, 0, 0.8);
  margin-top: 30px;
}
.btn-box {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
}
::v-deep .tooltip2{

  text-align: left;
  padding: 8px;
  box-sizing: border-box;
  background: #FFFFFF;
  border: 1px solid rgba(229,233,238,0.5);
  background: #FFFFFF;
  border-radius: 4px;
  position: relative;
  border: 1px solid rgba(229, 233, 238, 0.5);
  box-shadow: 0px 2px 5px rgba(24, 144, 255, 0.17);
  padding: 8px;
  .date {
    margin-bottom: 8px;
  }
  .price, .price2 {
    background: rgba(221, 68, 68, 0.1);
    padding: 2px 10px;
    border-radius: 14px;
  }
  .price2 {
      background: rgba(69, 191, 131, 0.1);
      border-radius: 14px;
    }
  .triangle {
    display: block;
    width: 0;
    height: 0;
    border-style: solid;
    position: absolute;
  }
  .bottom-triangle {
    left: 61px;
    border-width: 6px;
    bottom: -12px;
    border-color: rgba(229,233,238,0.5) transparent transparent transparent;
  }
  .top-triangle {
    left: 62px;
    border-width: 5px;
    bottom: -9px;
    border-color:#fff transparent transparent  transparent;
  }
  .first {
    color:#8495AA ;
     margin-top: 6px;
     display: flex;
     align-items: center;
  }
  .dot {
    display: inline-block;
    width: 6px;
    height: 6px;
    background: #1890FF;
    border-radius: 50%;
    margin-right: 4px;
  }
  .sen {
    color: #000;
    font-weight: 400;
    font-size: 14px;
    margin-top: 6px;
  }
}
.top-title {
  display: flex;
  // justify-content: space-between;
  margin: 25px 0;
  align-items: center;
  margin-top: 15px;
  justify-content: space-between;
}
.top-itm {
  width: 15%;
  flex: 1;
  height: 96px;
  padding-top: 8px;
  margin-left: 2%;
  padding-left: 6px;
  padding-right: 6px;
  box-sizing: border-box;
  background: #F2FBFF;
  border-radius: 4px;
  position: relative;

  .top-tim-title {
    margin-bottom: 15px;
  }

  img {
    position: absolute ;
    top: 50%;
    right: 10px;
    width: 44px;
    height: 70px;
    transform: translateY(-50%);
  }
}
@media screen and (max-width: 1680px) {
	.top-itm {
    width: 16%;
    margin-left: 0.8%;
  }
}
.top-itm:nth-child(1) {
  margin-left: 0;
}
.top-itm.up {
  background: rgba(255, 122, 122, 0.1);
}
.top-itm.down {
background: rgba(231, 255, 243, 0.5);
}
.top-itm.common {

background: rgba(239, 239, 239, 0.5);
}
.item-content {
  font-weight: 500;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.item-title {
 font-size: 14px;
    color: rgba(0, 0, 0, 0.6)
}
.price {
  color: rgba(0, 0, 0, 0.8);
  font-weight: 600;
  font-size: 30px;
  margin-bottom: 0;
  margin-top: 10px;
}
.top-title2 {
  display: flex;
  justify-content: space-between;
}
@media screen and (max-width: 1440px)  {
 .top-itm {
  padding-left: 6px;
  padding-right: 6px;
  .price {
    font-size: 30px;
  }
 }
}
</style>
