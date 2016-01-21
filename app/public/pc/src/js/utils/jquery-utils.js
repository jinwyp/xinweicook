import $ from  'jquery'

$.fn.fadeList = function (options) {
    options = options || {}
    var actClass = options.actClass || 'act'
    var fadeInClass = options.fadeInClass || 'fade-in'
    var fadeOutClass = options.fadeOutClass || 'fade-out'
    var fadeTime = options.fadeTime || 1000
    var interval = options.interval || 5000
    var pauseHover = options.pauseHover !== false

    var enterClass = 'enter'

    this.eq(0).addClass(actClass)

    var curIndex = 0
    var length = this.length
    var lastPlayedTime = Date.now()
    var nextPlayTimeSpan

    if (pauseHover) {
        this.parent().hover(() => {
            if (timer) {
                clearInterval(timer)
                clearTimeout(timer)
                timer = null
                nextPlayTimeSpan = lastPlayedTime + interval - Date.now()
                nextPlayTimeSpan = nextPlayTimeSpan < 0 ? 0 : nextPlayTimeSpan
            }
        }, () => {
            if (!timer) {
                timer = setTimeout(() => {
                    play()
                    timer = start()
                }, nextPlayTimeSpan)
            }
        })
    }

    var timer = start()
    var that = this
    function start() {
        return setInterval(() => {
            play()
        }, interval)
    }

    function play() {
        var nextIndex = (curIndex + 1) % length
        var $cur = that.eq(curIndex)
        var $next = that.eq(nextIndex)
        $cur.addClass(fadeOutClass)
        $next.addClass(enterClass)
        // let enterClass enable before fade class
        setTimeout(() => {
            $next.addClass(fadeInClass)
            setTimeout(() => {
                $cur.removeClass(actClass + ' ' + fadeOutClass + ' ' + enterClass)
                $next.removeClass(fadeInClass).addClass(actClass)
                curIndex = nextIndex
            }, fadeTime)
            lastPlayedTime = Date.now()
        }, 17)
    }
}


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