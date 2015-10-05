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

/**
 * 将查询返回的派送时间转换成下单所需要的形式
 * time为{hour: ''}, 当type为eat时,
 * time为{day:{day:''}, time: {name: ''}}, 当type为cook时,
 * time为{eat: {hour}, cook:{day,time}}, 当type为all时.
 */
angular.module('xw.filters').filter('orderTime', function () {
    return function filter(time, type) {
        var ret;
        if (type == 'eat') {
            return {
                deliveryDateEat: time.hour.substr(0, 10),
                deliveryTimeEat: time.hour.substr(11, 5)
            }
        } else if (type == 'cook') {
            ret = {deliveryDateCook: time.day.day};
            ret.deliveryTimeCook = time.time ? time.time.name+':00' : '12:00';
            return ret;
        } else if (type == 'all') {
            ret = {};
            if (time.eat) ret = filter(time.eat, 'eat');
            if (time.cook) angular.extend(ret, filter(time.cook, 'cook'));
            return ret;
        }
    }
});

/**
 * 有多种不同的dishList类型, 有些是从后端获得的, 有些是作为更新购物车post回去的,
 * 有些是前端为了展示方便而构造的, 此处对其做统一转换, 免去放在controller中的苦恼.
 * dishes: 待转换待原始数据. dType:target type. sType: source type
 * type: 'displayCart',用来展示待购物车的dish list
 *       'order', 用来下单的list
 *
 * examples:
 * displayCart, 为 {cookList: [], eatList: []}, 其中[]为如下形式
 * [{
 *   dish: Dish, // {_id: '', title: {zh:'', en: ''}, ... , number: '从shoppingCart的item上获取的'}
 *   outOfStock: boolean,
 *   subDish: Dish
 * }, ..]
 *
 * order, 为 {dishList: []}, 其中[]为如下形式
 * [{
 *   dish: _id,
 *   number: number,
 *   subDish: [..]
 * }, ..]
 */
angular.module('xw.filters').filter('dishes', function () {
    return function (dishes, tType, sType) {
        var ret;
        // 将displayCart 转换为 order 类型的dishList
        if (tType == 'order' && sType == 'displayCart') {
            ret = [];
            Object.keys(dishes).forEach(function (key) {
                var hashMap = {};
                dishes[key].forEach(function (el) {
                    var id = el.dish._id;
                    if (!hashMap[id]) hashMap[id] = {
                        dish: id,
                        number: el.dish.number,
                        subDish: []
                    };
                    if (el.subDish) {
                        hashMap[id].subDish.push({
                            dish: el.subDish._id,
                            number: el.subDish.number
                        })
                    }
                });

                for (var id in hashMap) {
                   ret.push(hashMap[id])
                }
            });

            return {dishList: ret}
        } else return dishes
    }
});

/**
 * 优惠券下单数据转换.要求传入当数据格式为: {code: '优惠码字符串', card: {优惠券对象}}
 */
angular.module('xw.filters').filter('coupon', function () {
    return function (coupon) {
        var ret = {};
        if (coupon.code) {
            ret.promotionCode = coupon.code;
            if (coupon.code.length == 8) {
                // tcl 优惠券特殊处理. 我们的优惠券要求必须是10位
                ret.promotionCode = 'zz' + ret.promotionCode;
            }
        }
        if (coupon.card) {
            ret.coupon = coupon.card._id;
        }
        return ret;
    }
});

