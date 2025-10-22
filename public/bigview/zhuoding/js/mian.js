/* eslint-disable no-undef */
$(function () {
    var changeSize = function () {
        const percentW = document.documentElement.clientWidth / 1920
        const percentH = document.documentElement.clientHeight / 1080
        $('body')[0].style = 'transform:scale(' + percentW + ',' + percentH + ');transform-origin: top left;'
    }
    window.addEventListener('resize', changeSize)
    changeSize()
})