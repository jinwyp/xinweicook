angular.module('xw.services').factory('Utils', function () {
    return {
        // todo: base64编码后的字符包括大小写字母各26各,以及数字,以及 + / = 这3个字符
        // 而 +(这个...) 和 / 在url中会被转义,因此需要再做替换,这里替换 + 为 - , / 替换为 _
        utf2b64: function (str) {
            return btoa(unescape(encodeURIComponent(str))).replace(/\+/g, '-').replace(/\//g, '_');
        },
        b642utf: function (str) {
            return decodeURIComponent(escape(window.atob(str.replace(/-/g, '+').replace(/_/g, '/'))));
        }
    }
});