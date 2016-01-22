import $ from  'jquery'

// DOM淡如淡出
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