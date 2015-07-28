angular.module('xw.weixin').factory('Weixin',function () {
    var defaultSetting = {
        // todo :remove debug
        debug: true,
        appId: 'wx37a1323e488cef84',
        jsApiList: ['openLocation', 'getLocation', 'chooseWXPay']
    };

    var state = {
        readyState: false,
        ready: function (cb) {
            if (this.readyState) {
                cb();
            } else this.ready.cb = cb;
        },
        /**
         * set jsapi config
         * @param setting
         */
        config: function (setting) {
            setting.debug = defaultSetting.debug;
            setting.appId = defaultSetting.appId;
            setting.jsApiList = defaultSetting.jsApiList;
            setting.nonceStr = setting.noncestr;

            wx.config(setting);
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



    wx.ready(function(){
        state.cb && state.cb();
    });


    return state;
});