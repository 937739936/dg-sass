/* eslint-disable no-undef */
$(function () {
    let mainDiv = echarts.init($('#main-img_9Qn1f-main')[0]);
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
    _get('/business/screen/topic1', function (result) {
        let c = { "legend": { "show": true, "textColor": "white" }, "xAxis": { "show": true, "splitLineShow": false, "labelColor": "white", "axisColor": "#0055bd", "labelFontSize": "12" }, "yAxis": { "show": true, "splitLineShow": true, "labelColor": "white", "labelFontSize": "12", "axisColor": "#0055bd", "unit_01": "万吨", "unit_02": "万元" }, "series": { "a": { "series_name": "累计发运量", "lineWidth": 2.5, "color": "#ffd666" }, "b": { "series_name": "累计融资量", "lineWidth": 2.5, "color": "rgb(121, 218, 255)" } } }
        let a = result
        let d = []
        for (var j in c.series) {
            d.push({
                name: c.series[j].series_name,
                icon: 'rect',
                textStyle: { color: c.legend.textColor }
            });
        }
        let k = {
            color: ["#ffd666", "rgb(121, 218, 255)"],
            tooltip: {
                trigger: "axis", axisPointer: { type: "cross" },
                backgroundColor: 'rgba(0,0,0,0.6)',
                borderWidth: 5,
                borderColor: 'rgba(0,0,0,0.6)',
                padding: 5,
                textStyle: {
                    color: "#ffffff",
                    fontSize: 10,
                },
            },
            legend: { show: c.legend.show, data: d },
            grid: { containLabel: !0, left: 10, right: 10, top: 50, bottom: 10 },
            xAxis: [
                {
                    show: c.xAxis.show,
                    type: "category",
                    axisTick: { alignWithLabel: !0 },
                    axisLabel: { color: c.xAxis.labelColor, fontSize: c.xAxis.labelFontSize },
                    splitLine: { show: c.xAxis.splitLineShow, lineStyle: { color: "#03214a", type: "solid", width: 1 } },
                    axisLine: { lineStyle: { color: c.xAxis.axisColor } }, data: a.map(item => { return item.x })
                }],
            yAxis: [
                {
                    show: c.yAxis.show,
                    type: "value",
                    position: "left",
                    name: c.yAxis.unit_01,
                    nameTextStyle: {
                        color: c.yAxis.labelColor,
                    },
                    axisTick: { show: true, },
                    axisLabel: { color: c.yAxis.labelColor, fontSize: c.yAxis.labelFontSize },
                    splitLine: { show: c.yAxis.splitLineShow, lineStyle: { color: "#03214a", type: "solid", width: 1 } },
                    axisLine: { show: true, lineStyle: { color: c.yAxis.axisColor } }
                }, {
                    type: "value", position: "right",
                    name: c.yAxis.unit_02,
                    nameTextStyle: {
                        color: c.yAxis.labelColor,
                    },
                    axisTick: { show: true, },
                    axisLabel: { color: c.yAxis.labelColor, fontSize: c.yAxis.labelFontSize },
                    splitLine: { show: c.yAxis.splitLineShow, lineStyle: { color: "#03214a", type: "solid", width: 1 } },
                    axisLine: { show: true, lineStyle: { color: c.yAxis.axisColor } }
                }],
            series: [{
                name: c.series.a.series_name, type: "line", label: {
                    show: true,
                    position: "top",
                    textStyle: {
                        color: "#ffffff",
                    },
                },
                lineStyle: { normal: { color: c.series.a.color, width: c.series.a.lineWidth } },
                data: a.map(item => { return item.y })
            }, {
                name: c.series.b.series_name, type: "line", yAxisIndex: 1, label: {
                    show: true,
                    position: "top",
                    textStyle: {
                        color: "#ffffff",
                    },
                },
                lineStyle: { normal: { color: c.series.b.color, width: c.series.b.lineWidth } },
                data: a.map(item => { return item.z })
            }]
        };
        mainDiv.setOption(k);
    })
})