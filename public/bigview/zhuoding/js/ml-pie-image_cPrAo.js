/* eslint-disable no-undef */
$(function () {
    let mainDiv = echarts.init($('#ml-pie-image_cPrAo')[0]);
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
    _get('/riskControl/screen/topic3', function (result) {
        var res = result;
        var option = {
            tooltip: {
                trigger: "item",
                formatter: "{a} <br/>{b} : {c} ({d}%)",
                backgroundColor: 'rgba(0,0,0,0.6)',
                borderWidth: 0,
                padding: 10,
                textStyle: {
                    color: "#ffffff",
                    fontSize: 10,
                },
            },
            "grid": {
                "show": false, "left": "10", "top": "0", "right": "10", "bottom": "0", "width": "", "height": "", "containLabel": true,
                "backgroundColor": "rgba(0,0,0,0)",
                "borderColor": "#ccc",
                "borderWidth": 0
            },
            color: ["rgba(82,215,250,1)", "rgba(18,209,129,1)", "rgba(237,95,93,1)"],
            legend: {
                bottom: "0",
                data: res.map(item => item.name),
                "textStyle": { "color": "#ffffff", "fontStyle": "normal", "fontWeight": "normal", "fontFamily": "Microsoft Yahei", "fontSize": 16 }
                // formatter: function (name) {
                //     var oa = option.series[0].data;
                //     var num = oa[0].value + oa[1].value + oa[2].value + oa[3].value;
                //     for (var i = 0; i < option.series[0].data.length; i++) {
                //         if (name == oa[i].name) {
                //             return (
                //                 name +
                //                 "     " +
                //                 oa[i].value +
                //                 "     " +
                //                 ((oa[i].value / num) * 100).toFixed(2) +
                //                 "%"
                //             );
                //         }
                //     }
                // },
            },
            series: [
                {
                    name: "回款天数比例分析",
                    type: "pie",
                    radius: "80%",
                    center: ["50%", "45%"],
                    data: res,
                    "selectedMode": true,
                    "clockwise": true,
                    "startAngle": 20,
                    "minAngle": 0,
                    "roseType": false,
                    "avoidLabelOverlap": true,
                    "stillShowZeroSum": false,
                    "silent": false,
                    "label": {
                        "normal":
                        {
                            formatter: function (params) {
                                var total = 0; //总数量
                                var percent = 0; //占比
                                res.forEach(function (value) {
                                    total += value.value;
                                });
                                percent = ((params.value / total) * 100).toFixed(0);
                                return (
                                    "{yellow|" +
                                    percent +
                                    "%}\n{white|" +
                                    params.name +
                                    "}"
                                );
                            },
                            rich: {
                                yellow: {
                                    color: "#ffc72b",
                                    fontSize: 16,
                                },
                                white: {
                                    color: "#fff",
                                    fontSize: 16,
                                },
                            },
                        }
                    },
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: "rgba(0, 0, 0, 0.5)",
                        },
                        normal: {
                            label: {
                                show: true,
                                //	                            position:'inside',
                                formatter: "{b} : {c} ({d}%)",
                            },
                        },
                        labelLine: { show: true },
                    },
                },
            ],
        };
        mainDiv.setOption(option);
    })

})