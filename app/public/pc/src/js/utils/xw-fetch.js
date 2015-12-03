import fetch from "isomorphic-fetch"

function _fetch(url, options) {
    var access_token = localStorage.access_token;
    if (!access_token) return fetch(url, options);

    options = options || {};
    options.headers = {
        Authorization: 'Bearer ' + access_token
    };

    return fetch(url, args)
}

export default _fetch;

export function post(url, data) {
    return _fetch(url, {
        method: 'post',
        body: JSON.stringify(data)
    })
}