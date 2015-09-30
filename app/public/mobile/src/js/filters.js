/**
 * 图片自适应为屏幕宽度
 */
angular.module('xw.filters').filter('adapt', function () {
    var width = Math.floor(screen.width * window.devicePixelRatio);
    var height = Math.floor(width * 2 / 3);
    var prefix = '?imageView2/1/w/';
    var query = prefix + width + '/h/' + height;
    return function (src, ratio) {
        return src + (ratio ?
                prefix + width + '/h/' + Math.floor(width * ratio) :
                query)
    }
});

/**
 *  将类似于1/2的文本显示为¹⁄₂
 */
angular.module('xw.filters').filter('fraction', function () {
    var superscripts = ['⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹'];
    var subscripts = ['\u2080', '\u2081', '\u2082', '\u2083', '\u2084',
        '\u2085', '\u2086', '\u2087', '\u2088', '\u2089'];

    function i2s(sval, scripts) {
        var ret = '';
        for (var i = 0; i < sval.length; i++) {
            ret += scripts[sval[i]]
        }
        return ret;
    }

    return function (str) {
        return str.replace(/(\d+)\/(\d+)/g, function (_, sup, sub) {
            return i2s(sup, superscripts) + '⁄' + i2s(sub, subscripts) + ' ';
        })
    }
});

/**
 * 将服务器传回来的dish结构的数据转换为post dish更新购物车时需要的格式(不在模板中使用)
 */
angular.module('xw.filters').filter('postDish', function () {
    return function (dish) {
        return {
            dish: dish.dish._id,
            number: dish.number,
            subDish: dish.subDish.map(function (el) {
                return {
                    dish: el.dish._id,
                    number: el.number
                }
            })
        }
    }
});

/**
 * 使mobile变成 133 3333 3333这种形式, 有更好的可读性
 */
angular.module('xw.filters').filter('beautifyMobile', function () {
    return function (mobile) {
        if (!/^\d{11}$/.test(mobile)) return mobile;
        return mobile.replace(/^(\d{3})(\d{4})(\d{4})$/,
            function (_, m1, m2, m3) {
                return m1 + ' ' + m2 + ' ' + m3;
            })
    }
});

/**
 * 使title变成 '/土豆泥' 这样的形式
 */
angular.module('xw.filters').filter('subDishTitle', function () {
    return function (title) {
        if (typeof title != 'string') return title;
        return '/' + title;
    }
});

angular.module('xw.filters').filter('orderTime', function () {
    return function (time, type) {
        if (type == 'eat') {
            return {
                deliveryDateEat: time.substr(0, 10),
                deliveryTimeEat: time.substr(11, 5)
            }
        } else if (type == 'cook') {
            var ret = {deliveryDateCook: time.day.day};
            ret.deliveryTimeCook = time.time ? time.time.name+':00' : '12:00';
            return ret;
        }
    }
})