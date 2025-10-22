/* eslint-disable no-undef */
$(function () {
    let mainDiv = echarts.init($('#main-img_2Am3K-main')[0]);
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
    _get('/business/screen/topic5', function (result) {
        var res = result;
        var option = {
            tooltip: {
                alwaysShowContent: true,
                formatter: "<div style='text-align:center;font-weight: bolder;'>{b0}</div><span>发运量：{c0}万吨</span>",
                borderColor: '#6784F7',
                backgroundColor: 'rgba(0,0,0,0)',
                borderWidth: 1,
                padding: 5,
                textStyle: {
                    color: "#ffffff",
                    fontSize: 10,
                },
                position: function () {
                    return { right: 20, top: '50%' }
                }
            },
            visualMap: {
                min: 0,
                max: 1000,
                left: 26,
                bottom: 40,
                showLabel: !0,
                textStyle: {
                    color: "#ffffff",
                },
                pieces: [
                    {
                        gt: 20,
                        label: "[20,∞)",
                        color: "rgb(255, 204, 0)",
                    },
                    {
                        gte: 10,
                        lte: 20,
                        label: "[10,20)",
                        color: "rgb(255, 153, 102)",
                    },
                    {
                        gte: 5,
                        lt: 10,
                        label: "[5,10)",
                        color: "rgb(153, 0, 204)",
                    },
                    {
                        gte: 0,
                        lt: 5,
                        label: "[0,5)",
                        color: "rgb(166, 213, 169)",
                    },
                ],
                show: !0,
            },
            geo: {
                map: "china",
                roam: !1,
                scaleLimit: {
                    min: 1,
                    max: 2,
                },
                zoom: 1.23,
                top: 150,
                left: '13%',
                right: '13%',
                bottom: '20%',
                label: {
                    show: false,
                },
                itemStyle: {
                    normal: {
                        borderColor: "rgb(0, 0, 0)",
                    },
                    emphasis: {
                        borderColor: "rgb(255, 255, 255)",
                    },
                },
                regions: [
                    { // 隐藏南海诸岛
                        name: '南海诸岛',
                        itemStyle: {
                            // 隐藏地图
                            normal: {
                                opacity: 0 // 为 0 时不绘制该图形
                            }
                        },
                        label: {
                            show: false // 隐藏文字
                        }
                    }
                ],
            },
            series: [
                {
                    name: "累计发运量",
                    type: "map",
                    geoIndex: 0,
                    data: res.map(item => {
                        return {
                            name: item.area,
                            value: item.quantity,
                        }
                    }),
                },
            ],
        };
        mainDiv.setOption(option);
    })

})