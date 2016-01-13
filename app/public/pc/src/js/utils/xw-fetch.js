import fetch from "isomorphic-fetch"

// get api时, 需要重定向至首页的相关信息
var auth = {
    // 访问userUrl时,发生的所有401都要跳
    userUrl: ['/me', '/cart'].map(url => __PCPREFIX__ + url)
        .reduce((obj, cur) => {
            obj[cur] = true
            return obj
        }, {}),

    // 访问guestUrl时,发生的所有401都不理
    guestUrl:['/sign', 'resetpwd'].map(url => __PCPREFIX__ + url)
        .reduce((obj, cur) => {
            obj[cur] = true
            return obj
        }, {}),

    // 访问其他url时,仅一下api 401时不理
    relaxApi: {
        '/api/user': true,
        '/api/user/address': true
    }
}

function _fetch(url, options) {
    var access_token = localStorage.access_token;
    if (access_token) auth.Authorization = 'Bearer ' + access_token;

    options = options || {};
    options.headers = Object.assign({}, options.headers, auth)
    return fetch(url, options).then(res => {
        // headers.get('Date')
        _fetch.headers = res.headers
        if (res.status >= 400) {
            if (res.status == '401') {
                if (auth.userUrl[location.pathname] ||
                    (!auth.guestUrl[location.pathname] && !auth.relaxApi[url] )) {
                    location.href = __PCPREFIX__ + `/sign?redirect=${location.pathname}`
                }
            }
            return Promise.reject(res)
        }
        return res.json().catch(e => {
            console.warn('parse returned json failed!')
            return Promise.reject(e)
        })
    })
}

export default _fetch;

export function post(url, data) {

    return _fetch(url, {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    }).then(function (json) {
        post.headers = _fetch.headers
        if (url == '/api/user/token' || url == '/api/user/signup') {
            localStorage.access_token = json.access_token;
        }
        return json
    })
}

export function del(url) {
    return _fetch(url, {
        method: 'delete'
    })
}

export function put(url, data) {
    return _fetch(url, {
        method: 'put',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    }).then(json => {
        put.headers = _fetch.headers
        return json
    })
}