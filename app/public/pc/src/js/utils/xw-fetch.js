import fetch from "isomorphic-fetch"

function _fetch(url, options) {
    var access_token = localStorage.access_token;
    if (!access_token) return fetch(url, options);

    options = options || {};
    options.headers = {
        Authorization: 'Bearer ' + access_token
    };
    return fetch(url, options)
}

export default _fetch;

export function post(url, data) {
    return _fetch(url, {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    }).then(res=>res.json()).then(function (json) {
        if (url == '/api/user/token' || url == '/api/user/signup') {
            localStorage.access_token = json.access_token;
        }
        return json
    })
}