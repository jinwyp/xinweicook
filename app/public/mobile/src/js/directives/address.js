angular.module('xw.directives').directive('address', function ($timeout, $location, Address, Utils, $q, Weixin, Map, Alert) {
    return {
        restrict: 'E',
        scope: {
            // 外部传入的数据
            outAddress: '=', // 待编辑的地址, 如果为空, 则表示是新地址
            range: '=', // 省市区数据

            // 供外部调用的方法
            save: '=',
            leave: '=',
            valid: '=',

            // 需要调用的外部方法
            deleteHook: '&', // 当删掉当前地址后给予外部的回调接口
            hide: '&', // 接收隐藏条件

            // 是否为当前状态地址的默认参数.
            cur: '@'
        },
        templateUrl: 'address.html',
        link: function ($scope) {
            var addr;

            var css = $scope.css = {
                edit: false,
                cur: $scope.cur == "true",
                showSearchAddress: false,
                form: null,
                locating: false,
                isWeixin: Weixin.isWeixin,
                isNewAddress: Object.keys($scope.outAddress).length < 2
            };

            var data = $scope.data = {
                street: ''
            };

            // 如果没有一个外部传入的地址,那么这是一个新地址
            // <2 for angular
            if (css.isNewAddress) {
                addr = $scope.addr = {sortOrder: 0};
                if (css.cur) {
                    css.edit = true;
                }
            } else {
                addr = $scope.addr = Utils.regularizeAddress(
                    angular.copy($scope.outAddress), $scope.range);
            }

            $scope.outAddress.cur = css.cur;
            $scope.outAddress.edit = !!css.edit;

            $scope.options = Utils.addressOptions.bind(null, $scope.range);

            $scope.$on('$locationChangeStart', function () {
                if (!css.edit) return;
                var path = $location.path();
                css.showSearchAddress = path == '/search-address'
            });

            $scope.choose = function () {
                if (css.cur) {
                    css.edit = true;
                    $scope.outAddress.edit = true;
                } else {
                    css.cur = true;
                    // 如果这是一个新地址
                    if (css.isNewAddress) {
                        css.edit = true;
                        $scope.outAddress.edit = true;
                    }
                }
                $scope.outAddress.cur = true;
            };

            $scope.trySelectUnique = function () {
                var cities = $scope.options(addr.province);
                if (cities.length == 1) {
                    addr.city = cities[0];
                }
            };

            $scope.deleteAddress = function (event) {
                event.stopPropagation();

                Address.delete(addr._id);
                if ($scope.deleteHook) {
                    $scope.deleteHook();
                }
            };

            $scope.showSearchAddress = function () {
                data.street = addr.street;
                $location.path('search-address');
                $scope.data.streetList && ($scope.data.streetList.length = 0);
                $scope.searchAddress();
            };

            $scope.searchAddress = function () {
                if (data.street) {
                    Map.search(data.street, addr.city || '全国')
                        .then(function (res) {
                            $scope.data.streetList = res.data;
                        });
                }
            };

            $scope.confirmStreet = function (event, street) {
                event.stopPropagation();

                $location.path('');
                if (!street) return;

                addr.street = street.address;
                addr.geoLatitude = street.lat;
                addr.geoLongitude = street.lng;
            };

            $scope.save = function () {
                if (css.form.$invalid) return $q.resolve(false);

                css.edit = css.cur = false;
                $scope.outAddress.edit = $scope.outAddress.cur = false;

                addr.isDefault = true;
                return Address[!css.isNewAddress ? 'update' : 'addOne'](addr)
                .then(function (res) {
                        addr = $scope.addr = res.data;
                        $scope.outAddress.cur = css.cur = true;
                        angular.extend($scope.outAddress, res.data);
                        return res.data;
                    });
            };

            $scope.leave = function () {
                $scope.outAddress.cur = css.cur = false;
            };

            // 会设置form$submitted为true
            $scope.valid = function () {
                css.form.$submitted = true;
                return !css.form.$invalid;
            };

            $scope.initForm = function (form) {
                css.form = form;
                css.showFakeInput = !addr.province;
            };

            // todo:必须要先在外部调用Weixin.config,或许内部也用一个后备?
            $scope.locate = function (event) {
                event.stopPropagation();

                css.locating = true;

                Weixin.getLocation(function (res) {

                    //console.log("weixinGeo:", res);

                    Weixin.getLocationName(res.latitude, res.longitude).then(function (data) {

                        //console.log("baiduGeo:", data.data);

                        var result = data.data.result;
                        result = angular.pick(result.addressComponent, 'province', 'city', 'district', 'street', 'street_number');
                        var location = Map.gcj02ToBd09({
                            lat: res.latitude,
                            lng: res.longitude
                        });
                        result.geoLatitude = location.lat;
                        result.geoLongitude = location.lng;

                        Utils.regularizeAddress(result, $scope.range);

                        angular.extend(addr, result);

                    }).catch(angular.noop).then(function () {
                        css.locating = false; // like finally
                    });
                }, function () {
                    css.locating = false;
                });
            };

        }
    };
});
