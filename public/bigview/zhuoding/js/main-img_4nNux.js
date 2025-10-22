/* eslint-disable no-undef */
$(function () {
    let mainDiv = echarts.init($('#main-img_4nNux-main')[0]);
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
    _get('/business/screen/topic6', function (result) {
        var res = result;
        var option = {
            "tooltip": {
                "show": true, "title": "",
                "axisPointer": {
                    "type": "line", "axis": "auto", "snap": false,
                    "label": {
                        "show": false, "precision": 0, "margin": 3,
                        "textStyle": { "color": "#ffffff", "fontStyle": "normal", "fontWeight": "normal", "fontFamily": "Microsoft Yahei", "fontSize": 10 },
                        "backgroundColor": 'rgba(0, 0, 0, 0)', "borderColor": 'rgba(0, 0, 0, 0)', "borderWidth": 0
                    },
                    "lineStyle": { "color": "#555", "width": 1, "type": "solid", "opacity": 1 },
                    "shadowStyle": { "color": 'rgba(150, 150, 150, 0.3)', "opacity": 1 },
                    "crossStyle": { "color": "#555", "width": 1, "type": "dashed", "opacity": 1 }
                },
                formatter: "{a} <br/>{b}: {c} ({d}%)",
                "triggerOn": "mousemove", "backgroundColor": "#83c686", "borderColor": "#f5f5f5", "borderWidth": 0, "padding": 5,
                "textStyle": { "color": "#ffffff", "fontStyle": "normal", "fontWeight": "normal", "fontFamily": "Microsoft Yahei", "fontSize": 18 }
            },
            "grid": {
                "show": false, "left": "10", "top": "6", "right": "10", "bottom": "20", "width": "", "height": "", "containLabel": true,
                "backgroundColor": "rgba(0,0,0,0)",
                "borderColor": "#ccc",
                "borderWidth": 0
            },
            color: ["rgb(194 53 49)", "rgb(47 69 84)", "rgb(97 160 168)","rgb(212 130 101)", "rgb(145 199 174)", "rgb(116 159 131)"],
            "animation": true,
            series: [
                {
                    name: "",
                    type: "pie",
                    data: res.map(item => {
                        return { value: item.quantity, name: item.buyerName }
                    }),
                    "legendHoverLink": true,
                    "hoverAnimation": true,
                    "selectedMode": true,
                    "selectedOffset": 10,
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
                            "show": true,
                            "textStyle": { "color": "#ffffff", "fontStyle": "normal", "fontWeight": "normal", "fontFamily": "Microsoft Yahei", "fontSize": 16 }
                        },
                        "emphasis": {
                            "show": true,
                            "textStyle": { "color": "#ffffff", "fontStyle": "normal", "fontWeight": "normal", "fontFamily": "Microsoft Yahei", "fontSize": 15 }
                        }
                    },
                    "labelLine": {
                        "normal": {
                            "show": true, "length": 9, "length2": 15, "smooth": 0.1,
                            "lineStyle": {
                                "color": "#cd95d6",
                                "width": 2, "type": "solid", "opacity": 1
                            }
                        },
                        "emphasis": {
                            "show": true,
                            "lineStyle": {
                                "color": "#f5f5f5",
                                "width": 1, "type": "solid", "opacity": 1
                            }
                        }
                    },
                    "itemStyle": {
                        "normal": {
                            "defaultColor": true,
                            "borderColor": "#69BA6D",
                            "borderWidth": 0,
                            "borderType": "solid",
                            "opacity": 1
                        },
                        "emphasis": {
                            "color": "#5bffb0",
                            "borderColor": "#000",
                            "borderWidth": 0, "borderType": "solid", "opacity": 1
                        }
                    }

                },
            ],
        }
        mainDiv.setOption(option);
    })
})