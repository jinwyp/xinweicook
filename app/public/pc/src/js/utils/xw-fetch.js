import fetch from "isomorphic-fetch"

function _fetch(url, options) {
    var access_token = localStorage.access_token;
    if (!access_token) return fetch(url, options);

    options = options || {};
    options.headers = Object.assign({}, options.headers,
        {Authorization: ('Bearer ' + access_token)})
    return fetch(url, options).then(res => {
        if (res.status >= 400) {
            if (res.status == '401') {
                location.href = '/sign'
            }
            return Promise.reject(res)
        }
        return res.json()
    })
}

export default _fetch;

export function post(url, data) {

    return _fetch(url, {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    }).then(function (json) {
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
        body: JSON.stringfy(data)
    }).then(res=>res.json())
}