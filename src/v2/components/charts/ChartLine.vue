<template>
  <div :style="{ height: chartHeight + 'px' }" class="chart-wrapper">
    <div
      class="chart"
      ref="chart"
      v-if="data.xAxisData && data.xAxisData.length > 0"
    ></div>
    <div class="empty" v-else>暂无数据</div>
  </div>
</template>
<script>
import * as echarts from 'echarts';
// import "echarts/map/js/china.js";
import debounce from "lodash/debounce";
import error from "@/v2/assets/imgs/common/error.png";

export default {
  name: "ChartLine",

  props: {
    data: {
      type: [Object, Array],
      default: () => {},
    },
    showLegend: {
      type: Boolean,
      default: true,
    },
    marklineData: {
      type: [Array],
      default: () => [],
    },
    chartHeight: {
      type: Number,
      default: 350,
    },
  },
  // data 数据格式
  /* {
      legendData: ['趋势', '干预1',],
      color: ['#0053DB', '#FF9726',],
      xAxisData: ['A', 'B', 'C', 'D', 'E', 'F'],
      seriesData: [
        [52.84, 205.97, 33.79, 281.55, 398.35, 214.02, ],
        [281.55, 38.35, 214.02, 100, 29.57, 36.14, ],
      ]
    } */

  methods: {
    initChart() {
      const marklineData = this.marklineData.map((item) => {
        return {
          show: false,
          silent: false, // 鼠标悬停事件 true没有，false有
          lineStyle: {
            // 警戒线的样式 ，虚实 颜色
            type: "double",
            color: item.color,
          },
          label: {
            position: "start",
            padding: [-10, -150, 15, -45],
            formatter: item.label,
            fontSize: "12",
          },
          yAxis: item.value, // 警戒线的标注值，可以有多个yAxis,多条警示线 或者采用 {type : 'average', name: '平均值'}，type值有 max min average，分为最大，最小，平均值
        };
      });
      const series = this.data.seriesData.map((item, index) => {
        return {
          name: this.data.legendData[index],
          showSymbol: true, // 显示折线拐点
          type: "line", // 统计图类型为折线图
          // smooth: true, // 是否平滑曲线显示
          // symbolSize: 10, // 数据点的大小，[0,0]//b表示宽度和高度
          symbolSize: (a) => {
            if (
              this.marklineData &&
              this.marklineData.length > 0 &&
              a < this.marklineData[0].value
            ) {
              return 10;
            }
            return 5;
          },
          symbol: (a) => {
            if (
              this.marklineData &&
              this.marklineData.length > 0 &&
              a < this.marklineData[0].value
            ) {
              return `image://${error}`;
            }
            return "emptyCircle";
          },
          itemStyle: {
            // 点样式
            normal: {
              color: this.data.color[index],
              label: {
                show: true,
                textStyle: {
                  color: "#000000",
                },
              },
            },
          },
          lineStyle: {
            // 线条的相关设置
            normal: {
              width: 2,
              // color: '#3deaff', // 线条颜色
              color: this.data.color[index],
            },
          },
          /* areaStyle: { // 区域填充样式
            normal: {
              // 线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(61,234,255, 0.9)', },
                { offset: 0.7, color: 'rgba(61,234,255, 0)', },
              ], false),

              shadowColor: 'rgba(53,142,215, 0.9)', // 阴影颜色
              shadowBlur: 20, // shadowBlur设图形阴影的模糊大小。配合shadowColor,shadowOffsetX/Y, 设置图形的阴影效果。
            },
          }, */
          // data: _.get(this.data, 'seriesData'),
          data: item,
          markLine: {
            symbol: "none",
            data: marklineData,
          },
        };
      });
      const option = {
        /*backgroundColor: '#050d19',
        title: {
          textStyle: {
            color: '#6a9cd5',
          },
          text: '',
          left: 'center',
        },*/
        tooltip: {
          // 鼠标悬浮弹出提示框
          /*trigger: 'axis', // 提示框弹出的触发时间，折线图和柱状图为axis
          formatter: '{a} <br/>{b} : {c} ', // 提示框提示的信息，{a}series内的名字，{b}为块状的名字，{c}为数值
          formatter: (params) => {
            return 123
            // return `${_.get(params[0], 'data.time', '')}<br/>${_.get(params[0], 'data.value')}`
          },*/
          trigger: "axis",
        },
        legend: {
          show: this.showLegend,
          itemWidth: 20,
          itemHeight: 6,
          bottom: "1%",
          data: this.data.legendData,
        },
        grid: {
          // 统计图距离边缘的距离
          top: "8%",
          left: "7%",
          right: "4%",
          bottom: "15%",
        },
        xAxis: [
          {
            // x轴
            type: "category", // 数据类型为不连续数据
            boundaryGap: true, // 坐标轴两边是否留白
            axisLine: {
              // 坐标轴轴线相关设置。数学上的x轴
              show: true,
              lineStyle: {
                color: "#233e64", // x轴颜色
              },
            },
            axisLabel: {
              // 坐标轴刻度标签的相关设置
              // interval: 0, // 横轴信息全部显示
              // rotate: 30, // -30度角倾斜显示
              showMaxLabel: true,
              showMinLabel: true,
              margin: 5,
              formatter: (params) => {
                return params.replace(" ", "\n");
              },
              textStyle: {
                // color: '#a5aab1',
              },
            },
            axisTick: { show: false }, // 刻度点数轴
            symbolSize: 1,
            // splitNumber: 24,
            // data: _.get(this.data, 'xAxisData2'),
            data: this.data.xAxisData,
          },
          /*{
            show: false,
            type: 'category',
            data: _.get(this.data, 'xAxisData2'),
          },*/
        ],
        yAxis: [
          {
            // y轴的相关设置
            type: "value", // y轴数据类型为连续的数据
            data: [10, 20],
            // min: 0, // y轴上的刻度最小值
            // max: 140, // y轴上的刻度最大值
            // splitNumber: 3, // y轴上的刻度段数
            splitLine: {
              // y轴上的y轴线条相关设置
              show: true,
              lineStyle: {
                type: "dotted",
                // color: '#233e64',
                color: "#282c37",
              },
            },
            axisLine: {
              // y轴的相关设置
              show: true,
              lineStyle: {
                color: "#233e64", // y轴颜色
              },
            },
            axisLabel: {
              // y轴的标签相关设置
              // formatter: (params) => {
              //   return this.data.yAxisLabel[params]
              // },
              textStyle: {
                // color: '#6a9cd5',
                // color: '#a5aab1',
              },
            },
            splitArea: {
              show: true,
              areaStyle: {
                color: ["rgba(245, 245, 245, 1.00)", "rgba(250,250,250,0.05)"],
              },
            },
            axisTick: { show: false }, // 刻度点数轴
          },
        ],
        series,
      };
      if (this.marklineData && this.marklineData.length > 0) {
        let valueSet = [];
        this.marklineData.forEach((item) => {
          valueSet = [...valueSet, item.value];
        });
        this.data.seriesData.forEach((item) => {
          valueSet = [...valueSet, ...item];
        });
        const yAxisMax = Math.max(...valueSet);
        option.yAxis[0].max = yAxisMax + 10;
      }

      this.chart = echarts.init(this.$refs.chart);
      this.chart.resize();
      this.chart.setOption(option);
      this.bindEvent();
    },

    getBackgroundColor(value) {
      return {
        backgroundColor: value,
      };
    },

    bindEvent() {
      this.__resizeHanlder = debounce(() => {
        if (this.chart) {
          this.chart.resize();
        }
      }, 300);
      window.addEventListener("resize", this.__resizeHanlder);
    },

    destroyChart() {
      if (this.chart) {
        this.chart.dispose();
        this.chart = null;
      }
    },
  },

  mounted() {
    if (this.data.xAxisData && this.data.xAxisData.length > 0) {
      this.initChart();
    }
  },

  beforeDestroy() {
    window.removeEventListener("resize", this.__resizeHanlder);
    if (this.chart) {
      this.destroyChart();
    }
  },

  activated() {
    if (this.chart) {
      this.chart.resize();
    }
  },

  watch: {
    data() {
      this.destroyChart();
      if (this.data.xAxisData && this.data.xAxisData.length > 0) {
        this.$nextTick(() => {
          this.initChart();
        });
      }
    },
  },
};
</script>
<style lang="less" scoped>
.chart-wrapper {
  width: 100%;
  position: relative;
}
.chart {
  width: 100%;
  height: 100%;
}
.empty {
  text-align: center;
  min-height: 200px;
  line-height: 200px;
}
</style>
