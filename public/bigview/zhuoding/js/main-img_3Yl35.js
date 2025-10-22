/* eslint-disable no-undef */
$(function () {
    let mainDiv = echarts.init($('#main-img_3Yl35-main')[0]);
    var baseUrl = '/dg-trade-api/api'
    var _get = function (url, callback) { // 网络请求
        url = baseUrl + url
        $.ajax({
            url: url,
            type: 'GET',
            success: callback,
            dataType: 'json',

        });
    }
    _get('/business/screen/topic7', function (result) {
        var res = result
        let max = Math.max.apply(null, res.map(item => item.quantity));
        var option = {
            grid: {
                left: 0,
                right: 0,
                top: 10,
                bottom: 0,
            },
            xAxis: {
                show: false,
                max,
            },
            yAxis: [
                {
                    type: "category",
                    inverse: true,
                    axisLabel: {
                        show: false,
                    },
                    splitLine: {
                        show: false,
                    },
                    axisTick: {
                        show: false,
                    },
                    axisLine: {
                        show: false,
                    },
                    data: res.map(item => item.buyerName),
                },
            ],
            dataZoom:
            {
                // 开始位置的数值
                startValue: 0,
                // 结束位置的数值
                endValue: 5,
                type: "slider",
                maxValueSpan: 5, //显示数据的条数(默认显示10个)
                show: false,
                yAxisIndex: [0, 1],
                handleSize: 0, //滑动条的 左右2个滑动条的大小
                borderColor: "rgba(43,48,67,0.8)",
                fillerColor: "#33384b", //滑动块的颜色
                showDataShadow: false, //是否显示数据阴影 默认auto
                showDetail: false, //即拖拽时候是否显示详细数值信息 默认true
            },
            series: [

                {
                    name: "背景",
                    type: "bar",
                    barWidth: "10",
                    barGap: "-100%",
                    data: res.map(() => max),
                    itemStyle: {
                        color: "rgba(57, 82, 143, 0)",
                    },
                    label: {
                        color: "rgb(255, 197, 61)",
                        show: true,
                        distance: 10,
                        position: 'insideBottomRight',
                        textStyle: {
                            fontSize: 16,
                        },
                        formatter: function (a) {
                            return `${res[a.dataIndex].quantity}万吨`;
                        },
                    },
                },
                {
                    name: "值",
                    type: "bar",
                    zlevel: 1,
                    barWidth: "10",
                    barGap: "100%",
                    data: res.map(item => item.quantity),
                    label: {
                        color: "#FFFFFF",
                        show: true,
                        position: [0, "-16px"],
                        textStyle: {
                            fontSize: 16,
                        },
                        rich: {
                            //富文本
                            index: {
                                width: 42,
                                color: 'rgb(59, 246, 255)',
                                fontSize: 16,
                            },
                            name: {
                                //自定义颜色
                                color: "#ffffff",
                                width: 450,
                                fontSize: 16,
                            },
                        },
                        formatter: function (value) {
                            return (
                                "{index|" +
                                Number(value.dataIndex + 1) +
                                "}{name|" +
                                value.name +
                                "}"
                            );
                        },
                    },
                }
            ],
        }
        mainDiv.setOption(option);
        var MyMarhq1;
        MyMarhq1 = setInterval(function () {
            option.dataZoom.startValue++;
            option.dataZoom.endValue++;
            if (option.dataZoom.endValue == res.length) {
                option.dataZoom.startValue = 0;
                option.dataZoom.endValue = 5;
            }
            mainDiv.setOption(option);
        }, 1000)
    })
})