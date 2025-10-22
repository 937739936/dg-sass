/* eslint-disable no-undef */
$(function () {
    let mainDiv = echarts.init($('#main-img_r9XmK-main')[0]);
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
    _get('/business/screen/topic3', function (result) {
        let c = {
            "legend": { "show": true, "textColor": "#30cfb2" },
            "xAxis": { "show": true, "splitLineShow": false, "labelColor": "white", "axisColor": "#0055bd", "labelFontSize": 12 },
            "yAxis": { "show": true, "splitLineShow": true, "labelColor": "white", "labelFontSize": 13, "axisColor": "#0055bd", "unit_01": "万元", "unit_02": "笔" },
            "series": {
                "a": { "series_name": "融资金额", "value": "1", "width": 20, "color": { "style": "double", "value": "#2846ff", "from": "#ff6e6e", "to": "#ff6e6e", "angle": 0 } },
                "b": { "series_name": "融资余额", "value": "2", "width": 16, "color": { "style": "double", "value": "#ff05c4", "from": "#fb9146", "to": "#ffc96b", "angle": 0 } },
                "c": { "series_name": "融资笔数", "value": "3", "lineWidth": 2.5, "color": "#40a9ff" }
            }
        }
        let a = result
        let d = [], e = [], f = new Map, g = {}, i = c.series.b.width;
        for (let c in a.map((a) => { f.set(a.x, a.y), g[a.s] || (g[a.s] = new Map) }), e = [...f.keys()], g) {
            e.map((a) => { g[c].set(a, 0) });
        }
        a.map((a) => { g[a.s].set(a.x, a.y) })
        for (var j in c.series) {
            d.push({
                name: c.series[j].series_name,
                textStyle: { color: c.legend.textColor }
            });
        }
        let k = {
            color: ["#5793f3", "#d14a61", "#675bba"],
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
            grid: { containLabel: !0 },
            xAxis: [
                {
                    show: c.xAxis.show,
                    type: "category",
                    axisTick: { alignWithLabel: !0 },
                    axisLabel: { color: c.xAxis.labelColor, fontSize: c.xAxis.labelFontSize },
                    splitLine: { show: c.xAxis.splitLineShow, lineStyle: { color: "#03214a", type: "solid", width: 1 } },
                    axisLine: { lineStyle: { color: c.xAxis.axisColor } }, data: e
                }],
            yAxis: [
                {
                    show: c.yAxis.show,
                    type: "value",
                    position: "left",
                    axisTick: { show: true, },
                    axisLabel: { color: c.yAxis.labelColor, formatter: "{value} " + c.yAxis.unit_01, fontSize: c.yAxis.labelFontSize },
                    splitLine: { show: c.yAxis.splitLineShow, lineStyle: { color: "#03214a", type: "solid", width: 1 } },
                    axisLine: { show: true, lineStyle: { color: c.yAxis.axisColor } }
                }, {
                    type: "value", position: "right",
                    axisTick: { show: true, },
                    axisLabel: { color: c.yAxis.labelColor, formatter: "{value}" + c.yAxis.unit_02, fontSize: c.yAxis.labelFontSize },
                    splitLine: { show: c.yAxis.splitLineShow, lineStyle: { color: "#03214a", type: "solid", width: 1 } },
                    axisLine: { show: true, lineStyle: { color: c.yAxis.axisColor } }
                }],
            series: [{
                name: c.series.a.series_name, type: "bar", barWidth: c.series.a.width,
                itemStyle: {
                    normal: {
                        color: {
                            type: "linear", x: 0.5, y: 1, x2: 0.5, y2: 0,
                            colorStops: [{ offset: 0, color: c.series.a.color.from }, { offset: 1, color: c.series.a.color.to }], globalCoord: !1
                        },
                        barBorderRadius: [c.series.a.width / 2, c.series.a.width / 2, c.series.a.width / 2, c.series.a.width / 2]
                    }
                },
                data: [...g[c.series.a.value].values()]
            }, {
                name: c.series.b.series_name, type: "bar", barWidth: c.series.b.width,
                itemStyle: { normal: { color: { type: "linear", x: 0.5, y: 1, x2: 0.5, y2: 0, colorStops: [{ offset: 0, color: c.series.b.color.from }, { offset: 1, color: c.series.b.color.to }], globalCoord: !1 }, barBorderRadius: [i / 2, i / 2, i / 2, i / 2] } },
                data: [...g[c.series.b.value].values()]
            }, {
                name: c.series.c.series_name, type: "line", smooth: !0, yAxisIndex: 1,
                lineStyle: { normal: { color: c.series.c.color, width: c.series.c.lineWidth } },
                data: [...g[c.series.c.value].values()]
            }]
        };
        mainDiv.setOption(k);
    })
})