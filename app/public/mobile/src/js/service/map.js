angular.module('xw.services').factory('Map', function ($http, Debug) {
    // 如果有必要修改则需要改成provider
    var topDistance = {
        xinweioffice: 6000,
        caohejing1: 1560
    };

    var map = {
        bentoNoReach: 999999,

        topDistance: {
            xinweioffice: 6000,
            caohejing1: 1560
        },

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

        lineDistance2CHJ: function (lat, lng) {
            var CHJ = this.warehouseCoords.caohejing1;
            return this.lineDistance(lat, lng, CHJ.lat, CHJ.lng)
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
         * @param warehouse
         * @returns {HttpPromise}
         */
        walkingDistance: function (lat, lng, warehouse) {
            var args;
            warehouse = warehouse || '';
            if (Array.isArray(arguments[0])) {
                args = arguments[0];
                warehouse = lng;
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
                encodeURIComponent(sval) + '&warehouse=' + warehouse)
            .then(function (res) {
                    var results = res.data.result.elements;
                    var ret = [];
                    var len = results.length / 2;
                    var pair;
                    for (var i = 0; i < len; i++) {
                        results[i].warehouse = 'xinweioffice';
                        results[len + i].warehouse = 'caohejing1';
                        pair = [results[i], results[len + i]];
                        pair = angular.sort(pair, function (a, b) {
                            return (a.distance.value - topDistance.xinweioffice) -
                                (b.distance.value - topDistance.caohejing1)
                        });
                        ret.push(pair);
                    }
                    return ret;
                })
            .catch(function () {
                    console.log('get distance error');
                    return []
                })
        },

        /**
         * 计算距离仓库的距离
         * @param lat gcj02
         * @param lng gcj02
         * @param warehouse - 'CHJ'
         * @returns {*|Promise.<T>}
         */
        distance: function (lat, lng, warehouse) {
            return this.walkingDistance(lat, lng, warehouse).then(function (res) {
                var d = res[0][0].distance.value;
                d = map.fixZero(d, lat, lng);
                var top = topDistance[res[0][0].warehouse];
                return {
                    distance: d,
                    // 百度有时候返回的是null, 此时就当作1000公里
                    isInRange: (d === null ? 999999 : d) <= top,
                    warehouse: res[0][0].warehouse
                }
            }).catch(function (res) {
                Debug.alert('获取步行距离失败');
                Debug.alert(res);
            })
        },

        distances: function (dests, warehouse) {
            dests = Array.isArray(dests) ? dests : [dests];
            return this.walkingDistance(dests, warehouse).then(function (res) {
                return res.map(function (el, i) {
                    var d = map.fixZero(el[0].distance.value, dests[i].lat, dests[i].lng);
                    var top = topDistance[el[0].warehouse];
                    return {
                        distance: d,
                        isInRange: (d === null ? 999999 : d) <= top,
                        warehouse: el[0].warehouse
                    }
                })
            })
        },

        nearestWarehouse: function (lat, lng) {
            var that = this;
            var topDistance2HQ = topDistance['xinweioffice'];
            var topDistance2CHJ = topDistance['caohejing1'];
            var warehouses = angular.sort(['xinweioffice', 'caohejing1'].map(function (name) {
                var warehouse = that.warehouseCoords[name];
                return {
                    name: name,
                    distance: that.lineDistance(lat, lng, warehouse.lat, warehouse.lng)
                }
            }), function (a, b) {
                return (a.distance - topDistance2HQ + 1100) - (b.distance - topDistance2CHJ)
            });
            return warehouses[0].name;

        },

        warehouseCoords: {
            xinweioffice: {
                lat: 31.189426,
                lng: 121.460625
            },
            caohejing1: {
                lat: 31.169250,
                lng: 121.398949
            }
        }
    };

    return map;
});