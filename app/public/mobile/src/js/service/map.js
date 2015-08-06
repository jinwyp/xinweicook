angular.module('xw.services').factory('Map', function ($http, Debug) {
    return {
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

        /**
         * 对百度地图routematrix api的后端包装,此处原样返回百度的数据
         * @param lat gcj02坐标
         * @param lng
         * @returns {HttpPromise}
         */
        walkingDistance: function (lat, lng) {
            return $http.get('/mobile/distance', {
                params: {
                    lat: lat,
                    lng: lng
                }
            })
        },

        distance: function (lat, lng) {
            return this.walkingDistance(lat, lng).then(function (res) {
                var distance = res.data.result.elements[0].distance.value;
                return {
                    distance: distance,
                    isInRange: distance <= 5500
                }
            }).catch(function (res) {
                Debug.alert('获取步行距离失败');
                Debug.alert(res);
            })
        }
    }
});