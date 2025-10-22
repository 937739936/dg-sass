<template>
  <a-spin :spinning="loading">
    <div class="inventory-overview-line">
      
      <div class="actions">
        <div class="search-wrap">
          <div class="radio-wrap">
            <span @click="change('all')" :class="activeKey=='all'?'active':''">全部</span>
            <span @click="change('week')" :class="activeKey=='week'?'active':''">本周</span>
            <span @click="change('month')" :class="activeKey=='month'?'active':''">本月</span>
            <span @click="change('lastMonth')" :class="activeKey=='lastMonth'?'active':''">上月</span>
            <span @click="change('lastThreeMonths')" :class="activeKey=='lastThreeMonths'?'active':''">近三个月</span>
            <span @click="change('lastSixMonths')" :class="activeKey=='lastSixMonths'?'active':''">近六个月</span>
          </div>
          <sl-range-picker  
            style="width:350px" 
            addonBeforeTitle="自定义时间" 
            :value="[startDate,endDate]"
            @change="onChange"
            :disabledDate="disabledDate"
          />
        </div>

        <a-space :size="20">
          <a class="export-btn" @click="doExport">
            <exportIcon />
            <span>数据导出</span>
          </a>
          <a-button type="primary" @click="toRecord('IN')" ghost>入库明细</a-button>
          <a-button type="primary" @click="toRecord('OUT')" ghost>出库明细</a-button>
        </a-space>
        
      </div>
      <div id="echartLine" class="echart"></div>
    </div>
    <InventoryOverviewPie ref="pie" />
  </a-spin>
</template>
<script>
import SlRangePicker from "@sub/components/ui-new/Form/sl-range-picker.vue"
import exportIcon from "@sub/components/svg/exportIcon.vue"
import InventoryOverviewPie from "./InventoryOverviewPie";
import moment from "moment"
import * as echarts from "echarts";
moment.locale('zh-cn');
export default {
  props:{
    loading:{
      type:Boolean,
      default:() => false
    }
  },
  components:{
    SlRangePicker,
    exportIcon,
    InventoryOverviewPie
  },
  data(){
    return {
      activeKey:"all",
      startDate:moment("2023-01-01"),
      endDate:moment(),
      lineChartData:{
        in:[],
        out:[],
        total:[],
        date:[],
        opening:[]//期初库存
      }
    }
  },
  mounted(){
    this.init();
    this.change(this.activeKey)
    window.addEventListener("resize",this.resize,false)
  },
  beforeDestroy(){
    window.removeEventListener("resize",this.resize,false)
  },
  methods:{
    setData(data){
      this.$refs.pie.setData({
        inPieChartVO:data.inPieChartVO,
        outPieChartVO:data.outPieChartVO,
      })
      let inData = [] ,outData = [] ,total = [],date = [],opening=[]
      data.lineChartVO.forEach((item) => {
        inData.push(item.inInventory)
        outData.push(item.outInventory)
        total.push(item.totalInventory)
        date.push(item.storageDate)
        opening.push(item.openingInventory)
      })
      // const all = [...inData,...outData,...total] 
      this.lineChartData = {
        in:inData,
        out:outData,
        total,
        date,
        opening,
        // min:Math.min.apply(null,all),
        // max:Math.max.apply(null,all)
      } 
      this.refreshChartData();
      
    },
    onChange(momentDate,strDate){
      strDate = strDate || []
      this.startDate = momentDate[0];
      this.endDate = momentDate[1];
      this.$emit("change",  strDate[0] ,strDate[1])
      this.activeKey = "";
    },
    change(key){
      this.activeKey = key
      const today = moment() ;
      switch(key){
        case "all":
          this.startDate = moment("2023-01-01");
          this.endDate = moment();
          break;
        case "week":
          this.startDate = moment().startOf("week");
          this.endDate = moment().endOf("week").add(1,"days");
          break;
        case "month":
          this.startDate = moment().startOf("month");
          this.endDate = moment().endOf("month")
         
          break;
        case "lastMonth":
          const lastMonth = moment().add(-1,"month");
          this.startDate = lastMonth.clone().startOf("month");
          this.endDate = lastMonth.clone().endOf("month")
          break;
        case "lastThreeMonths":
          this.startDate =  moment().add(-2,"month").startOf("month");
          this.endDate = moment().endOf("month")
          break;
        case "lastSixMonths":
          this.startDate =  moment().add(-5,"month").startOf("month");
          this.endDate = moment().endOf("month")
          break;
      }
      this.endDate = today < this.endDate ? today : this.endDate
      this.$emit("change",this.startDate.format("YYYY-MM-DD"),this.endDate.format("YYYY-MM-DD"))
      
    },
    doExport(){
      this.$emit("export",this.startDate.format("YYYY-MM-DD"),this.endDate.format("YYYY-MM-DD"))
    },
    resize(){
      this.myEcharts.resize();
    },
    toRecord(type){
      this.$emit("toRecord",{
        type,
        startDate:this.startDate.format("YYYY-MM-DD"),
        endDate:this.endDate.format("YYYY-MM-DD")
      })
    },
    refreshChartData(){
      const line = this.lineChartData;
      const option = this.myEcharts.getOption();
      option.xAxis[0].data = [...line.date];
      option.series[0].data = line.in;
      option.series[1].data = line.out;
      option.series[2].data = line.total;
      this.myEcharts.setOption(option)
    },
    disabledDate(current){
      return current < moment("2023-01-01") || current > moment();
    },
    init(){
      this.myEcharts = echarts.init(document.getElementById('echartLine'));
      this.myEcharts.setOption({
        color:["#4682F3","#75E7D2","#FF800F"],
        grid: {
          left: "70px",    // 左侧内边距
          right: 10,   // 右侧内边距
          top: '70px',     // 顶部内边距
          // bottom: '64px',  // 底部内边距
          bottom: '90px',  // 底部内边距
        },
        tooltip: {
          trigger: 'axis',
          backgroundColor:"#fff",
          className:"tooltip",
          extraCssText: 'box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);',
          textStyle:{
            color:"rgba(0,0,0,0.8)"
          },
          axisPointer: {
            type: 'shadow',
            shadowStyle: {
              color: '#9C9C9C',
              opacity: 0.1
            }
          },
          formatter:(params) => {
            return `<div class='iol-tooltip'>
                <span class='time'>${params[0].name}</span>  
                <div class='row in'><span class='label'>入库吨位</span><span class='value'>${(params[0].value||0).toNumberString()}</span></div>
                <div class='row out'><span class='label'>出库吨位</span><span class='value'>${(params[1].value||0).toNumberString()}</span></div>
                <div class='row stock'><span class='label'>库存吨位</span><span class='value'>${(params[2].value||0).toNumberString()}</span></div>
                <div class='line'></div>
                <div class='row'><span class='label'>期初库存</span><span class='value'>${(this.lineChartData.opening[params[0].dataIndex]||0).toNumberString()}</span></div>
              </div>`
          }
         
        },
        legend: {
          itemGap:63,
          itemWidth:12,
          itemHeight:12,
          borderRadius:12,
          data: [
            {name:"入库吨位",icon:"circle"}, 
            {name:"出库吨位",icon:"circle"},
            {name:"库存吨位",icon:`path://M0 1C0 0.447715 0.447715 0 1 0H13C13.5523 0 14 0.447715 14 1C14 1.55228 13.5523 2 13 2H1C0.447715 2 0 1.55228 0 1Z`}]
        },
        dataZoom: [
          {
            type: 'slider',
            filterMode: 'empty',
            start: 0,
            end: 100,
            bottom:10,
            backgroundColor: '#F7F9FD',
            textStyle:false,
            dataBackground: {
              lineStyle: {
                color: 'rgba(128, 149, 172, 0.2)'
              },
              areaStyle: {
                color: '#E8EAF0'
              }
            },
            selectedDataBackground: {
              lineStyle: {
                color: 'rgba(128, 149, 172, 0.2)'
              },
              areaStyle: {
                color: '#E8EAF0'
              }
            }
          }
        ],
        xAxis: 
          {
            type: 'category',
            data: [],
            position: 'bottom',
            axisPointer: {
              type: 'shadow'
            },
            axisTick: {
              show: false, // 隐藏 x 轴刻度
            },
            axisLabel: {
              textStyle: {
                color: 'rgba(0, 0, 0, 0.4)', // 设置字体颜色
              },
            },
            axisLine: {
              lineStyle: {
                color: '#E5E6EB', // 设置线的颜色，可以是颜色名称、十六进制颜色码等
              },
            },
          }
        ,
        yAxis: [
          {
            type: 'value',
            name: '{a|单位/吨}',
            axisLine: {
              show: false,
            },
            nameTextStyle: {
              rich: {
                a: {
                  lineHeight: 12, // 调整行高以控制垂直位置
                  color: 'rgba(0, 0, 0, 0.4)',  // 自定义颜色
                  padding: [0, 50, 20, 0], // 调整内边距以控制水平位置
                },
              },
             
            },
            
            axisLabel: {
              textStyle: {
                color: 'rgba(0, 0, 0, 0.4)', // 设置字体颜色
              },
            },
            splitLine: {
              lineStyle: {
                color: '#E5E6EB', // 设置网格线的颜色
              },
            },
            axisTick: {
              show: false,
            },
           
          },
          {
            type: 'value',
            name: '库存吨位',
            show: false,
          },
        ],
        
        series: [
          {
            name: '入库吨位',
            type: 'bar',
            barGap:0,
            barWidth:24,
            // yAxisIndex: 0,
           
            data: [ ]
          },
          {
            name: '出库吨位',
            type: 'bar',
            barWidth:24,
            // yAxisIndex: 0,
            data: []
          },
          {
            name: '库存吨位',
            type: 'line',
            // yAxisIndex: 1,
            data: []
          }
        ]
      })
    }
  }
}
</script>
<style lang="less" scoped>

.inventory-overview-line{
  width:100%;
}
.actions{
  width:100%;
  display:flex;
  justify-content: space-between;
  align-items:center;
  .export-btn{
    display: flex;
    align-items: center;
    span{
      margin-left:5px;
    }
  }
  .search-wrap{
    padding: 20px 0px 20px;
    display:flex;
    align-items:center;
  }
  .radio-wrap{
    padding:0 8px;
    margin-right:20px;
    display:flex;
    align-items:center;
    height:32px;
    border:1px solid #E5E6EB;
    border-radius:4px;
    span{
      margin-right:6px;
      padding:0 12px;
      height: 20px;
      font-size:14px;
      color:rgba(#000,0.8);
      line-height: 20px;;
      border-radius:2px;
      cursor: pointer;
      background-color:#fff;
      transition:all 0.1s linear;
      &:last-child{
        margin-right: 0;
      }
      &.active{
        color:#fff;
        background-color:@primary-color;
      }
    }
  }
}
.echart{
  margin-top: 10px;
  height: 408px;
}
::v-deep{
  .iol-tooltip{
    width:190px;
    padding:5px;
    display:flex;
    flex-direction: column;
    box-sizing: border-box;
    .time{
      margin-bottom: 10px;
      font-size:12px;
      color:rgba(#000,0.4);
      line-height:17px;
    }
    .row{
      position:relative;
      margin-bottom: 8px;
      display: flex;
      align-items:center;
      justify-content: space-between;
      padding-left:14px;
      font-size:12px;
      line-height: 17px;
      color:rgba(#000,0.8);
      &:last-child{
        margin-bottom:0;
      }
      .label::before{
        content: "";
        position:absolute;
        top:50%;
        left:0;
        transform:translateY(-50%);
      }
      &.in{
        
        .label::before{
          width:6px;
          height:6px;
          border-radius:6px;
          background-color:#4F7EF4;
          
        }
      }
      &.out{
        .label::before{
          width:6px;
          height:6px;
          border-radius:6px;
          background-color:#53DDE5;
        }
      }
      &.stock{
        .label::before{
          width:6px;
          height:2px;
          border-radius:2px;
          background-color:#FF800F;
        }
      }

      .label{
      }
      .value{
        font-weight: bold;
      }
    }
    .line{
      margin-top:10px;
      margin-bottom:10px;
      height:1px;
      background-color:#E5E6EB;
    }
  }
}
</style>