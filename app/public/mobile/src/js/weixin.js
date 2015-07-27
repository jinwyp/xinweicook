angular.module('xw.weixin').factory('Weixin',function () {
    var defaultSetting = {
        // todo :remove debug
        debug: true,
        appId: 'wx37a1323e488cef84',
        jsApiList: ['openLocation', 'getLocation', 'chooseWXPay']
    };

    var state = {
        ready: false,
        /**
         * set jsapi config
         * @param setting
         */
        config: function (setting) {
            wx.config(setting, defaultSetting);
        },
        /**
         * pass the wxpaysetting
         * @param setting
         */
        pay : function (setting) {
            setting.signType = 'MD5';
            wx.chooseWXPlay(setting);
        }
    };

    if (/order\/([^/]+)$/.test(location.href)) {
        state.openid = RegExp.$1;
    }


    wx.ready(function(){
        state.ready = true;
    });


    return state;
});