angular.module('xw.services').factory('Utils', function () {
    return {
        // todo: base64编码后的字符包括大小写字母各26各,以及数字,以及 + / = 这3个字符
        // 而 +(这个...) 和 / 在url中会被转义,因此需要再做替换,这里替换 + 为 - , / 替换为 _
        utf2b64: function (str) {
            return btoa(unescape(encodeURIComponent(str))).replace(/\+/g, '-').replace(/\//g, '_');
        },
        b642utf: function (str) {
            return decodeURIComponent(escape(window.atob(str.replace(/-/g, '+').replace(/_/g, '/'))));
        },

        // 两个购物车item是否是同一个,购物车item结构为:{dish:dish, number:, subDish:[]}
        isSameItemInCart: function (item1, item2) {
            return item1.dish._id == item2.dish._id && //主dish是否相同
                item1.subDish.every(function (a) { //子dish是否全部相同
                    return item2.subDish.some(function (b) {
                        return a.dish._id == b.dish._id
                    })
                })
        },

        // 合并本地购物车和线上购物车, 将数据全部合并到本地购物车.
        // local dish的数量(非dish.number)只会增加不会减少
        mergeCarts: function (local, server) {
            if (!local || !local.length) return server;
            for (var i = 0; i < local.length; i++) {
                for (var j = 0; j < server.length; j++) {
                    if (!this.isSameItemInCart(local[i], server[j])) {
                        local.splice(++i, 1, server[j]);
                    }
                }
            }
            return local
        }
    }
});