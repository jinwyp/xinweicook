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