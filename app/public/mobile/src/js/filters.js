/**
 * 图片自适应为屏幕宽度
 */
angular.module('xw.filters').filter('adapt', function () {
    var width = Math.floor(document.body.offsetWidth * window.devicePixelRatio);
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
            subDish: !dish.subDish ? [] : dish.subDish.map(function (el) {
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
    return function (item) {
        var last = item.subDish.length;
        if (!last) return '';
        return '(' + item.subDish.reduce(function (title, cur, i) {
            return title + cur.dish.title.zh + (i == last - 1 ? '' : '/')
        }, '') + ')';
    }
});

/**
 * 将查询返回的派送时间转换成下单所需要的形式[NOT FOR HTML]
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
            ret = {deliveryDateCook: time.day};
            ret.deliveryTimeCook = time.segment ? time.segment.name+':00' : '12:00';
            return ret;
        } else if (type == 'all') {
            ret = {};
            if (time.eat) ret = filter(time.eat, 'eat');
            if (time.cook) angular.extend(ret, filter(time.cook, 'cook'));
            return ret;
        }
    }
});

angular.module('xw.filters').filter('cookTimeUnion', function () {
    return function (times) {
        if (!times) {
            return times
        }

        var hasSegment = !!times[0].segment;

        return times.reduce(function (list, cur) {
            if (hasSegment) {
                cur.segment.forEach(function (item) {
                    list.push({
                        day: cur.day,
                        segment: item
                    })
                })
            } else {
                list.push({day: cur.day})
            }
            return list;
        }, [])
    }
})

/**
 * 有多种不同的dishList类型, 有些是从后端获得的, 有些是作为更新购物车post回去的,
 * 有些是前端为了展示方便而构造的, 此处对其做统一转换, 免去放在controller中的苦恼.
 * dishes: 待转换待原始数据. tType:target type. sType: source type
 * type: 'displayCart',用来展示待购物车的dish list
 *       'order', 用来下单的list
 *
 * examples:
 * displayCart, 为 {cookList: [], eatList: []}, 其中[]为如下形式
 * [{
 *   dish: Dish, // {_id: '', title: {zh:'', en: ''}, ...}
 *   subDish: [{dish},.]
 *   number
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
                dishes[key].forEach(function (el) {
                    ret.push({
                        dish: el.dish._id,
                        number: el.number,
                        subDish: el.subDish.map(function (sDish) {
                            return {
                                dish: sDish.dish._id,
                                number: sDish.number
                            }
                        })
                    });
                });
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

/**
 * 便当配送时间选项补充上请选择时间
 */
angular.module('xw.filters').filter('eatTimeOptions', function () {
    return function (times) {
        if (!times || !times.length) return times;
        times.unshift({hour: '请选择配送时间'});
        return times;
    }
});

angular.module('xw.filters').filter('eatTimeDisplay', function () {
    return function (time) {
        return time.hour
    }
});

angular.module('xw.filters').filter('cookTimeOptions', function () {
    return function (times) {
        if (!times || !times.length) return times;
        times.unshift({day: '请选择配送时间'});
        return times
    }
});

angular.module('xw.filters').filter('cookTimeDisplay', function () {
    return function (time) {
        return time.day == '请选择配送时间' || time.segment ?
            time.day : time.day + ' 送达'
    }
});

// 返回购物车item的价格
angular.module('xw.filters').filter('dishPrice', function () {
    return function (item, total) {
        var price = item.dish.priceOriginal;
        if (item.subDish) {
            for (var i = 0, len = item.subDish.length; i < len; i++) {
                price += item.subDish[i].dish.priceOriginal;
            }
        }
        return price * (total ? item.number : 1);
    }
})


// 订单状态
angular.module('xw.filters').filter('orderStatus', function () {
    var _status = {
        'not paid': '未支付',
        'paid': '已支付',
        'confirmed': '已确认',
        'dish finished': '已完成',
        'packaged': '已打包',
        shipped: '配送中',
        finished: '已完成',
        canceled: '已取消'
    }
    
    return function(status) {
        return _status[status] || ''
    }
})

// 订单状态
angular.module('xw.filters').filter('orderId', function () {
    return function(orderId) {
        if (!orderId) return orderId
        var ret = []
        for (var i = 0; i < orderId.length; i+=4) {
            ret.push(orderId.substr(i, 4))
        }
        return ret.join(' ')
    }
})

// 支付方式
angular.module('xw.filters').filter('payment', function () {
    var _payment = {
        'alipay direct': '支付宝',
        'weixinpay':'微信钱包',
        'account balance': '新味币'
    }
    return function(payment) {
        return _payment[payment] || payment
    }
})

