angular.module('xw.weixin').factory('Weixin',function ($http, Debug) {

    var defaults = {
        //weixin js config
        wx: {
            appId: 'wx37a1323e488cef84',
            jsApiList: ['getLocation', 'onMenuShareTimeline', 'onMenuShareAppMessage']
        },

        // xinwei location, gcj02
        location: {
            longitude: 121.460625,
            latitude: 31.189426
        },

        ak: 'xnKgWtGYXf4gkLgreox7xpjI'
    };

    return {

        readyState: false,

        // 微信的事后ready似乎不好用，连个详细的文档都没有，还是自己实现靠谱。
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
            var that = this;
            var _setting = angular.copy(defaults.wx);
            _setting.timestamp = setting.timestamp;
            _setting.nonceStr = setting.nonceStr; // todo: be careful to different backend returned data.
            _setting.signature = setting.signature;

            wx.config(_setting);

            wx.ready(function(){
                that.ready.cb && that.ready.cb();
                that.readyState = true;
            });
        },
        /**
         * @param success - success callback with {lat: . lng: .} arguemnt
         * @param fail - fail callback with unknown arguemnt
         */
        getLocation: function(success, fail) {
            var setting = {type: 'gcj02'};
            success && (setting.success = success);
            fail && (setting.fail = fail);
            wx.getLocation(setting);
        },

        /**
         * 同微信分享朋友圈接口http://mp.weixin.qq.com/wiki/7/aaa137b55fb2e0456bf8dd9148dd613f.html#.E8.8E.B7.E5.8F.96.E2.80.9C.E5.88.86.E4.BA.AB.E5.88.B0.E6.9C.8B.E5.8F.8B.E5.9C.88.E2.80.9D.E6.8C.89.E9.92.AE.E7.82.B9.E5.87.BB.E7.8A.B6.E6.80.81.E5.8F.8A.E8.87.AA.E5.AE.9A.E4.B9.89.E5.88.86.E4.BA.AB.E5.86.85.E5.AE.B9.E6.8E.A5.E5.8F.A3
         * @param settings
         */
        shareTimeline: function (settings) {
            Debug.alert('shareTimeline已经执行')
            wx.onMenuShareTimeline(settings);
        },

        shareAppMessage: function (settings) {
            wx.onMenuShareAppMessage(settings);
        },

        showOptionMenu: function () {
            wx.showOptionMenu();
        },

        hideOptionMenu: function () {
            wx.hideOptionMenu();
        },

        /**
         * get location with baidu api
         * @param lat - gcj02
         * @param lng
         * @return promise will resolved with $http res.
         */
        getLocationName: function (lat, lng) {
            var mapUrl = 'http://api.map.baidu.com/geocoder/v2/?output=json&pois=1&coordtype=gcj02ll&callback=JSON_CALLBACK'
            return $http.jsonp(mapUrl, {
                params: {
                    ak: defaults.ak,
                    location: lat + ',' + lng
                }
            })
        },
        /**
         * 获取jsconfig 参数
         * @param url
         * @returns {HttpPromise}
         */
        getJsconfig: function () {
            return $http.post('/api/orders/payment/weixinpay/config', {
                url: location.href.substr(0, location.href.length - location.hash.length)
            });
        }
    }
});