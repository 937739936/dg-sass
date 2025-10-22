/* eslint-disable no-undef */
$(function () {
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
    let line = 10, divId = '#main-img_Pu14Y';
    _get('/riskControl/screen/topic5', function (result) {
        var res = result;
        $(divId).empty();
        let arr = [[]];
        let str = '<div class="swiper-wrapper">'
        res.forEach((item, index) => {
            let key = Math.floor(index / line)
            if (!arr[key]) {
                arr[key] = [];
            }
            let keyStr = ''
            keyStr += '<div class="line">'
            keyStr += `<div class="line1">${index + 1}</div>`
            keyStr += `<div class="line2">${item.text}</div>`
            keyStr += '</div>'
            arr[key].push(keyStr)
        })
        arr.map(item => {
            str += "<div class='swiper-slide'>"
            for (let i = 0; i < line; i++) {
                if (item[i]) {
                    str += item[i]
                } else {
                    str += '<div class="line">'
                    str += `<div class="line1">-</div>`
                    str += `<div class="line2">-</div>`
                    str += '</div>'
                }
            }
            str += '</div>'
        })
        str += '</div>'
        $(divId).append(str);
        new Swiper(divId, {
            direction: "vertical",
            autoplay: res.length > line,
            loop: true,
        });
    })

})