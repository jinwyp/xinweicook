angular.module('xw.weixin').factory('Weixin',function ($http, Debug) {

    var defaults = {
        //weixin js config
        wx: {
            appId: 'wx37a1323e488cef84',
            jsApiList: ['getLocation']
        },

        // xinwei location, gcj02
        location: {
            longitude: 121.460625,
            latitude: 31.189426
        },

        ak: 'xnKgWtGYXf4gkLgreox7xpjI'
    };

    function distance(latA, lngA, latB, lngB) {
        var earthR = 6371000;
        var x = Math.cos(latA * Math.PI / 180) * Math.cos(latB * Math.PI / 180) * Math.cos((lngA - lngB) * Math.PI / 180);
        var y = Math.sin(latA * Math.PI / 180) * Math.sin(latB * Math.PI / 180);
        var s = x + y;
        if (s > 1) {
            s = 1;
        }
        if (s < -1) {
            s = -1;
        }
        var alpha = Math.acos(s);
        var distance = alpha * earthR;
        return distance;
    }

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

        isInRange: function (target, range, source) {
            range = range || 5000;
            source = source || defaults.location;
            var d = distance(target.latitude, target.longitude, source.latitude, source.longitude);
            Debug.alert('离公司距离：' + d); // todo: remove
            return d <= range;
        },

        /**
         * @param lat
         * @param lng
         * @return promise will resolved with $http res.
         */
        getLoationName: function (lat, lng) {
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
        getJsconfig: function (url) {
            return $http.post('/api/orders/payment/weixinpay/config', {url: url});
        }
    }
});