/* eslint-disable no-undef */
$(function () {
    var options = {
        useEasing: true, // 使用缓和
        useGrouping: false, // 使用分组(是否显示千位分隔符,一般为 true)
        separator: ',', // 分隔器(千位分隔符,默认为',')
        decimal: '.', // 十进制(小数点符号,默认为 '.')
        prefix: '', // 字首(数字的前缀,根据需要可设为 $,¥,￥ 等)
        suffix: ''  // 后缀(数字的后缀 ,根据需要可设为 元,个,美元 等) 
    };
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
    _get('/business/screen/topic4_fy', function (result) {
        let topic4_fy = result;
        new CountUp("topic4_fy_qy", 0, topic4_fy[0].qy, 2, 2, options).start()
        new CountUp("topic4_fy_hy", 0, topic4_fy[0].hy, 2, 2, options).start()
    })
    _get('/business/screen/topic4_rz', function (result) {
        let topic4_rz = result;
        new CountUp("topic4_rz_finCount", 0, topic4_rz[0].finCount, 0, 2, options).start()
        new CountUp("topic4_rz_finAmount", 0, topic4_rz[0].finAmount, 2, 2, options).start()
    })
    _get('/business/screen/topic4_hk', function (result) {
        let topic4_hk = result;
        new CountUp("topic4_hk_hk_amount", 0, topic4_hk[0].hk_amount, 2, 2, options).start()
        new CountUp("topic4_hk_hk_count", 0, topic4_hk[0].hk_count, 0, 2, options).start()
    })
})