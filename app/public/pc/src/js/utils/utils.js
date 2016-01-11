/**
 * 作为对Obj.a.b.c的简写,
 * @param obj - {a: {b: 1}}
 * @param properties - 'a.b'
 * @returns {boolean}
 */
export function truthy(obj, properties) {
    if (!obj || !properties) return false
    properties = properties.split('.')
    for (var i = 0; i < properties.length; i++) {
        var p = properties[i];
        if (!obj[p]) return false
        obj = obj[p]
    }
    return true
}

/**
 * (同步)接收一个验证函数a, 返回一个验证函数b, b在没有提供key时,会对所有refs的所有key进行验证
 * @param validate - (refs, key) => {key: err}
 * @returns {*} (refs[, key]) => {key1: err1[, key2: err2]}
 */
export function getValidator(validate) {
    return function _validate(refs, key) {
        var error
        if (!key) {
            error = {}
            Object.keys(refs).forEach(k => {
                Object.assign(error, _validate(refs, k))
            })
            return error
        }

        error = validate(refs, key)

        return error
    }
}

export function log() {
    __DEV__ && console.log('[xw.debug]:', ...arguments)
}

/**
 * 简单的时间格式化函数
 * @param date
 * @param fmt yyyy-MM-dd hh:mm:ss
 * @returns {*}
 */
export function dateFormat(date, fmt = 'yyyy-MM-dd hh:mm:ss') { //author: meizz
    if (typeof date == 'string') date = new Date(date)
    var o = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "h+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

/**
 * 根据形似?a=b&c=d的查询字符串
 * @param search - 查询字符串, 如果为空, 则使用location.search
 * @returns {*} 你懂的
 */
export function search(search) {
    search = search || location.search;
    return search.slice(1).split('&').reduce(function (obj, cur) {
        if (cur) {
            cur = cur.split('=');
            obj[cur[0]] = decodeURIComponent(cur[1] || '');
        }
        return obj;
    }, {});
}