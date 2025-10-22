<template>
  <div class="card-chart-list" :class="source">
    <div class="card">
      <h2 class="title">入库</h2>
      <div class="pie-wrap">
        <div class="chart" id="inChart"></div>
        <div class="data-info" v-show="inList.length > 0">
          <ul class="list-item" >
            <li class="item" 
              v-for="(item,index) in inList" 
              :key="item.id" 
              :style="{'--color':getColor('in',index)}"
            >
              <a-tooltip :title="item.name">
                <span class="label">{{ item.name }}</span>
              </a-tooltip>
              <div class="value" >
                <span class="text">{{ item.value | toNumberString}}</span>
                <span class="ratio">{{ item.percentage }}%</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="pagination"  v-show="inList.length > 0">
        <span :class="['pre',inPage <= 1 ? 'disabled':'']" @click="onPage('in',-1)">
          <Arrow />
        </span>
        <span class="text">{{ inPage }}/{{ inTotal }}</span>
        <span :class="['next',inPage >= inTotal ?'disabled':'']" @click="onPage('in',1)">
          <Arrow />
        </span>
      </div>
    </div>
    <div class="card">
      <h2 class="title">出库</h2>
      <div class="pie-wrap">
        <div class="chart"  id="outChart"></div>
        <div class="data-info" v-show="outList.length > 0">
          <ul class="list-item" >
            <li class="item"  
              v-for="(item,index) in outList" 
              :key="item.id" 
              :style="{'--color':getColor('out',index)}"
            >
              <a-tooltip :title="item.name">
                <span class="label">{{ item.name }}</span>
              </a-tooltip>
              <div class="value" >
                <span class="text">{{ item.value | toNumberString}}</span>
                <span class="ratio">{{ item.percentage }}%</span>
              </div>
            </li>
            
          </ul>

        </div>
      </div>
      <div class="pagination" v-show="outList.length > 0" >
        <span :class="['pre',outPage <= 1 ? 'disabled':'']" @click="onPage('out',-1)">
          <Arrow />
        </span>
        <span class="text">{{ outPage }}/{{ outTotal }}</span>
        <span :class="['next',outPage >= outTotal ? 'disabled':'']" @click="onPage('out',1)">
          <Arrow class="icon" />
        </span>
      </div>
    </div>
    <div class="card">
      <h2 class="title">库存</h2>
      <div class="pie-wrap">
        <div class="chart"  id="inventoryChart"></div>
        <div class="data-info" v-show="inventoryList.length > 0">
          <ul class="list-item" >
            <li class="item"  
              v-for="(item,index) in inventoryList" 
              :key="item.id" 
              :style="{'--color':getColor('inventory',index)}"
            >
              <a-tooltip :title="item.name">
                <span class="label">{{ item.name }}</span>
              </a-tooltip>
              <div class="value" >
                <span class="text">{{ item.value | toNumberString}}</span>
                <span class="ratio">{{ item.percentage }}%</span>
              </div>
            </li>
            
          </ul>
        </div>
      </div>
      <div class="pagination"  v-show="inventoryList.length > 0">
        <span :class="['pre',inventoryPage <= 1 ? 'disabled':'']" @click="onPage('inventory',-1)">
          <Arrow />
        </span>
        <span class="text">{{ inventoryPage }}/{{ inventoryTotal }}</span>
        <span :class="['next',inventoryPage >= inventoryTotal ? 'disabled':'']" @click="onPage('inventory',1)">
          <Arrow class="icon" />
        </span>
      </div>
    </div>
  </div>
</template>
<script>
import * as echarts from "echarts";
import Arrow from "@sub/components/svg/arrow";
const color = [
  "#4682F3","#8CCBC0","#A0A9CA","#FF8D69","#F6A2BB","#AAE8A0","#77D9EE",
  "#7CC6B9","#FEBF50","#F5DF6C","#F39C6B","#E8D8A0","#9F8DE8","#61CDBB",
  "#E0A8DE","#F1E15B","#F47560","#E8C1A0","#9F8DE8","#61CDBB","#DD4444",
  "#45C041","#FFBC0F"
]
export default {
  props: ['source'],
  components:{
    Arrow
  },
  data(){
    return {
      inPage:1,
      outPage:1,
      inventoryPage: 1,
      charts:[],
      chartData:[]
    }
  },
  computed:{
    inTotal(){
      return Math.ceil((this.chartData[0]||[]).length/4);
    },
    outTotal(){
      return  Math.ceil((this.chartData[1]||[]).length/4);
    },
    inList(){
      return (this.chartData[0]||[]).slice((this.inPage-1) * 4,this.inPage * 4);
    },
    outList(){
      return (this.chartData[1]||[]).slice((this.outPage - 1) * 4,this.outPage * 4);
    },
    inventoryTotal() {
       return  Math.ceil((this.chartData[2]||[]).length/4);
    },
    inventoryList() {
      return (this.chartData[2]||[]).slice((this.inventoryPage-1) * 4,this.inventoryPage * 4);
    }

  },
  mounted(){
    this.init(document.querySelector("#inChart"))
    this.init(document.querySelector("#outChart"))
    this.init(document.querySelector("#inventoryChart"))

  
    window.addEventListener("resize",this.resize,false)
  },
  beforeDestroy(){
    window.removeEventListener("resize",this.resize,false)
  },
  methods:{
    onPage(type,num){
      const field = `${type}Page`
      const current = this[field]+num;
      if(num === 1){
        this[field] = Math.min(current,this[`${type}Total`]);
      }else{
        this[field] = Math.max(current,1);
      }
    },
    getColor(type,index){
      return color[(index+(this[`${type}Page`]-1)*4)%color.length];
    },
    getUid(){
      return Math.random().toString(36).slice(2);
    },
    setData({inPieChartVO,outPieChartVO, inventoryPieChartVO}){
      try{
        
        this.chartData[0] = inPieChartVO.map((item) => {
          return {
            value:item.num,
            name:item.goodsName,
            percentage: item.percentage,
            id:this.getUid()}
        })
        this.chartData[1] = outPieChartVO.map((item) => {
          return {
            value:item.num,
            name:item.goodsName,
            percentage:item.percentage,
            id:this.getUid()}
        })
        this.chartData[2] = inventoryPieChartVO.map((item) => {
          return {
            value:item.num,
            name:item.goodsName,
            percentage:item.percentage,
            id:this.getUid()}
        })
        this.chartData = [... this.chartData]
        this.refreshChartData();
      }catch(e){
        console.error(e)
      }
    },
    refreshChartData(){
      this.charts.forEach((chart,index) => {
        const option = chart.getOption();
        option.series[0].data  = this.chartData[index]
        chart.setOption(option)
      })
    },
    resize(){
      this.charts.forEach((chart) => {
        chart.resize();
      })
    },
    init(ele){
      const charts = echarts.init(ele);
      this.charts.push(charts)
      charts.setOption({
        color,
        tooltip: {
          trigger: 'item',
          borderColor:"#fff",
          extraCssText:'box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);',
          position: function(point, params, dom, rect, size) {
            // 自定义 Tooltip 的位置
            return [point[0] + 10, point[1] + 10];
          },
          formatter:function(params){
            return `
              <div class='iop-tooltip' style="--iop-tooltip-color:${params.color}">
                <span class='label'>${params.name}(吨)</span>
                <div class='value' >
                  <span class='text'>${(params.value||0).toNumberString()}</span>
                  <span class='ratio'>${params.percent}%</span>
                </div>  
              </div>
            `
          }
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: ['45%', '90px'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 5,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
            },
            labelLine: {
              show: false
            },
            data: []
          }
        ]
      })
    }
  }
}
</script>
<style lang="less" scoped>
.card-chart-list{
  margin-top:62px;
  display: grid;
  grid-template-columns: 50% 50%;
  grid-row-gap: 30px;
}
.card{
  flex:1;
  border-right:1px solid #E5E6EB;
  padding-left:30px;
  padding-right: 30px;
  &:nth-child(2),&:nth-child(3){
    border:none;
  }
  .title{
    padding-left:16px;
    position: relative;
    font-size:16px;
    color:rgba(#000,0.8);
    line-height:22px;
    &::before{
      content:"";
      position:absolute;
      top:50%;
      left:0;
      width:4px;
      height:18px;
      background-color:@primary-color;
      transform:translateY(-50%);
      border-radius:1px;
    }
  }
  .pie-wrap{ 
    padding-top:24px;
    padding-left:35px;
    display:flex;
    align-items: center;
    .chart{
      // margin-right:15%;
      width:200px;
      height:200px;
    }
    .list-item{
      height: 276px;
      li{
        list-style: none;
      }
      .item{
        margin-bottom:16px;
        .label{
          display: inline-block;
          max-width:200px;
          font-size:12px;
          line-height:17px;
          color:rgba(#000,0.4);
          overflow:hidden;
          text-overflow: ellipsis;
          white-space:nowrap;
          cursor:default;
        }
        .value{
          display: flex;
          align-items:center;
          margin-top:10px;
          position:relative;
          padding-left:16px;
          font-size:14px;
          color:rgba(#000,0.8);
          font-weight: bold;
          &::before{
            content:"";
            position:absolute;
            left:0;
            top:50%;
            width:8px;
            height:8px;
            transform: translateY(-50%);
            background-color:var(--color);
            border-radius:8px;
          }
          .ratio{
            padding:0 5px;
            height:16px;
            line-height:16px;
            margin-left:10px;
            font-size:14px;
            color:#fff;
            font-weight: normal;
            background-color:var(--color);
            border-radius:16px;
          }
          
        }
      }
    }
    .data-info {
      padding-left: 10%;
    }
  }
  .pagination{
    width: 100%;
    display:flex;
    align-items:center;
    justify-content: center;
    .text{
      width:40px;
      font-size:12px;
      text-align: center;
      color:rgba(0,0,0,0.4);
    }
    .pre,.next{
      display:flex;
      align-items:center;
      justify-content: center;
      width:14px;
      height:14px;
      cursor: pointer;
      &.pre{
        transform: rotateY(180deg);
      }

      &.disabled{
        svg{
          ::v-deep{
            path{
              stroke:#c2c2c2;
            }
          }
        }
      }
    }
    svg{
      ::v-deep{
        path{
          stroke:#77889d;
        }
      }
    }

  }
}
::v-deep{
  .iop-tooltip{
    max-width:200px;
    display:flex;
    flex-direction:column;
    .label{
      width:100%;
      font-size:12px;
      color:rgba(#000,0.4);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .value{
      display:flex;
      align-items:center;
      margin-top:10px;
      position:relative;
      padding-left:16px;
      font-size:14px;
      color:rgba(#000,0.8);
      font-weight: bold;
      &::before{
        content:"";
        position:absolute;
        left:0;
        top:50%;
        width:8px;
        height:8px;
        transform: translateY(-50%);
        border-radius:8px;
        background-color:var(--iop-tooltip-color);
      }
      .ratio{
        padding:0 5px;
        height:16px;
        line-height:16px;
        margin-left:10px;
        font-size:14px;
        color:#fff;
        font-weight: normal;
        background-color:var(--iop-tooltip-color);
        border-radius:16px;
      }
    }
  }
}
// <=1440
@media screen and (max-width: 1440px) {
  .card-chart-list{
    flex-direction: column;
    align-items: center;
  }
  .card {
    border: 0;
    padding-left: 0;
    padding-right: 0;
    width: 500px;
    margin-bottom: 20px;


  }
  .chart {
   margin-right: 100px;
  }
}
// >=1920px
@media screen and (min-width: 1920px) {
  .card-chart-list{
    grid-template-columns: 33.3% 33.3% 33.3%;
    .data-info {
      padding-left: 6%;
    }
    .card{
      padding: 20px;
      &:nth-child(2){
        border-right:1px solid #E5E6EB;
      }
      .pie-wrap {
        padding-left: 20px;
        .data-info {
          padding-left: 10%;
        }
      }
    }
  }
}
.business .chart {
  margin-right: 0;
  .data-info {
    padding-left: 6%;
  }
  .chart {
    margin-right: 0;
  }
  .card{
    padding: 20px;
    margin-right: 0;
    &:nth-child(2){
      border-right:1px solid #E5E6EB;
    }
    .pie-wrap {
      padding-left: 20px;
      .data-info {
        padding-left: 10%;
      }
    }
  }
}
@media screen and (min-width: 1920px) {
  .business{
    grid-template-columns: 50% 50%;
  }
}
</style>
