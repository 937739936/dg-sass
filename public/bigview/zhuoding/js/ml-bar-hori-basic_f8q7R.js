/* eslint-disable no-undef */
$(function () {
    let mainDiv = echarts.init($('#ml-bar-hori-basic_f8q7R')[0]);
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
    _get('/riskControl/screen/topic1', function (result) {
        var res = result;
        var option = {
            tooltip: {
                trigger: "axis",
                backgroundColor: 'rgba(0,0,0,0.6)',
                borderWidth: 5,
                borderColor: 'rgba(0,0,0,0.6)',
                padding: 5,
                textStyle: {
                    color: "#ffffff",
                    fontSize: 10,
                },
                axisPointer: {
                    // 坐标轴指示器，坐标轴触发有效
                    type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
                },
            },
            grid: {
                left: "3%",
                right: "4%",
                bottom: "3%",
                containLabel: true,
            },
            xAxis: {
                type: "value",
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: 'rgba(255,255,255,0.1)'
                    }
                },
                axisTick: {
                    show: false
                },
                nameTextStyle: {
                    color: "#FFFFFF",
                    align: 'center'
                },
                splitLine: {
                    lineStyle: {
                        type: 'dashed'
                    }
                },
                axisLabel: {
                    textStyle: {
                        "fontFamily": "Microsoft Yahei",
                        "fontWeight": "normal",
                        "fontSize": 16,
                        color: "#FFFFFF",
                    }
                }
            },
            yAxis: {
                type: "category",
                name: '单位/万元',
                nameTextStyle: {
                    color: "#FFFFFF",
                    align: 'center',
                    "fontSize": 16,
                },
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    textStyle: {
                        "fontFamily": "Microsoft Yahei",
                        "fontWeight": "normal",
                        "fontSize": 16,
                        color: "#FFFFFF",
                    }
                },
                data: res.map(item => item.x),
            },
            series: [
                {
                    name: "统计",
                    type: "bar",
                    barWidth: 20,
                    label: {
                        normal: {
                            show: true,
                            position: "inside",
                            color: '#333',
                            "fontFamily": "Microsoft Yahei",
                            "fontWeight": "normal",
                            "fontSize": 16,
                        },
                    },
                    itemStyle: {
                        color: "#50ffdf"
                    },
                    data: res.map(item => item.y),
                }
            ],
        };
        mainDiv.setOption(option);
    })

})