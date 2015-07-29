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
            alert('Weixin.ready called');
            if (this.readyState) {
                cb();
            } else this.ready.cb = cb;
        },
        /**
         * set jsapi config
         * @param setting
         */
        config: function (setting) {
            var that = this;
            setting.debug = defaultSetting.debug;
            setting.appId = defaultSetting.appId;
            setting.jsApiList = defaultSetting.jsApiList;
            wx.config(setting);

            wx.ready(function(){
                alert('wx.ready called');
                alert(typeof that.ready.cb);
                that.ready.cb && that.ready.cb();
                that.readyState = true;
            });
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






    return state;
});