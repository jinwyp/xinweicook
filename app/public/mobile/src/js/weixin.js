angular.module('xw.weixin').factory('Weixin',function () {
    var defaultSetting = {
        // todo :remove debug
        debug: true,
        appId: 'wx37a1323e488cef84',
        jsApiList: ['openLocation', 'getLocation', 'chooseWXPay']
    };

    var state = {
        ready: false,
        config: function (setting) {
            wx.config(setting, defaultSetting);
        }
    };

    if (location.search) {
        var queries = location.search.slice(1).split('&');
        queries.forEach(function (query, i) {
            var array = query.split('=');
            queries[i] = {
                key: array[0],
                value: array[1]
            };
            if (queries[i].key == 'openid') {
                state.openid = queries[i].value;
            }

        })

    }

    wx.config({
        debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: '', // 必填，公众号的唯一标识
        timestamp: '', // 必填，生成签名的时间戳
        nonceStr: '', // 必填，生成签名的随机串
        signature: '',// 必填，签名，见附录1
        jsApiList: ['openLocation', 'getLocation', 'chooseWXPay'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    });

    wx.ready(function(){
        state.ready = true;
    });


    return state;
});