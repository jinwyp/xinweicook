angular.module('xw.services').factory('Map', function ($http, Debug) {
    // 如果有必要修改则需要改成provider
    var topDistance = 6000;
    var map = {
        bentoNoReach: 999999,

        suggestion: function (query, region) {
            return $http.get('/mobile/placesuggestion?query=' + query + '&region=' + region)
        },

        // 坐标转化
        // https://github.com/JackZhouCn/JZLocationConverter/
        gcj02ToBd09: function (location) {
            var y = location.lat;
            var x = location.lng;
            var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * Math.PI);
            var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * Math.PI);
    
            return {
                lng: z * Math.cos(theta) + 0.0065,
                lat: z * Math.sin(theta) + 0.006
            }
        },

        // 在调用百度suggestion api后会用到
        bd09ToGcj02: function (location) {
            var y = location.lat - 0.006;
            var x = location.lng - 0.0065;
            var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * Math.PI);
            var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * Math.PI);
    
            return {
                lng: z * Math.cos(theta),
                lat: z * Math.sin(theta)
            }
        },

        //根据坐标计算直线距离
        //https://github.com/googollee/eviltransform
        lineDistance: function (latA, lngA, latB, lngB) {
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
            return alpha * earthR;
        },

        fixZero: function (d, lat, lng) {
            if (d !== 0) return d;
            var lineD = this.lineDistance(lat, lng, 31.189426, 121.460625);
            return lineD > 1500 ? 999999 : d;
        },

        /**
         * 对百度地图routematrix api的后端包装,此处原样返回百度的数据
         * @param lat gcj02坐标 | [sval, obj, ..]
         * @param lng
         * @returns {HttpPromise}
         */
        walkingDistance: function (lat, lng) {
            var args;
            if (Array.isArray(arguments[0])) {
                args = arguments[0];
            } else {
                args = [{lat: lat, lng: lng}];
            }

            var sval = '';
            args.forEach(function (arg, i) {
                if (i >= 5) return; //百度限制
                var prefix = i == 0 ? '' : '|';
                if (typeof arg == 'string') {
                    sval += prefix + arg;
                } else {
                    sval += prefix + arg.lat + ',' + arg.lng;
                }
            });

            return $http.get('/mobile/distance?destinations=' +
                encodeURIComponent(sval))
        },

        distance: function (lat, lng) {
            return this.walkingDistance(lat, lng).then(function (res) {
                var d = res.data.result.elements[0].distance.value;
                d = map.fixZero(d, lat, lng);
                return {
                    distance: d,
                    // 百度有时候返回的是null, 此时就当作1000公里
                    isInRange: (d === null ? 999999 : d) <= topDistance
                }
            }).catch(function (res) {
                Debug.alert('获取步行距离失败');
                Debug.alert(res);
            })
        },

        distances: function (dests) {
            dests = Array.isArray(dests) ? dests : [dests];
            return this.walkingDistance(dests).then(function (res) {
                return res.data.result.elements.map(function (el, i) {
                    var d = map.fixZero(el.distance.value, dests[i].lat, dests[i].lng);
                    return {
                        distance: d,
                        isInRange: (d === null ? 999999 : d) <= topDistance
                    }
                })
            })
        }
    };

    return map;
});