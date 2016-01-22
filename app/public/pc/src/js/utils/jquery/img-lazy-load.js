import $ from  'jquery'

// 图片延迟加载
var lazyDOMs = []
/**
 * 获取目标元素距离根元素的高度
 */
function getDOMTop(elem) {
    return (document.documentElement.scrollTop || document.body.scrollTop)
        + elem.getBoundingClientRect().top
}

function getWindowBottom() {
    return document.documentElement.clientHeight + (window.scrollY ||
        document.documentElement.scrollTop || document.body.scrollTop);
}

function check() {
    var windowBottom = getWindowBottom();
    for (var i = 0; i < lazyDOMs.length;) {
        if (getDOMTop(lazyDOMs[i][0]) < windowBottom) {
            lazyDOMs[i][0].src = lazyDOMs[i][1]
            lazyDOMs.splice(i, 1);
        } else {
            i++;
        }
    }
}

$.fn.imgLazyLoad = function () {
    if (!$.fn.imgLazyLoad.inited) {
        $.fn.imgLazyLoad.inited = true
        $(window).on('scroll', check)
    }

    for (var i = 0; i < this.length; i++) {
        lazyDOMs.push([this[i], $(this[i]).data('src')])
        this[i].removeAttribute('data-src')
    }
}