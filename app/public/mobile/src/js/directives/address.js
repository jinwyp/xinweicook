angular.module('xw.directives').directive('address', function ($location, Address, Utils, $q, Weixin, Map) {
    return {
        restrict: 'E',
        scope: {
            // 待编辑的地址, 如果为空, 则表示是新地址
            oldAddress: '=',
            // 省市区数据
            range: '=',
            // 当删掉当前地址后给予外部的回调接口
            deleteHook: '&',
            cur: '@'
        },
        templateUrl: 'address.html',
        link: function ($scope, el, attrs) {
            var addr;

            var css = $scope.css = {
                edit: false,
                cur: $scope.cur == "true",
                showSearchAddress: false,
                form: null,
                locating: false
            };

            var data = $scope.data = {
                street: ''
            };

            // 如果没有一个外部传入的地址,那么这是一个新地址
            if (!$scope.oldAddress) {
                addr = $scope.addr = {}
            } else {
                addr = $scope.addr = Utils.regularizeAddress(
                    angular.copy($scope.oldAddress), $scope.range);
            }

            $scope.options = Utils.addressOptions.bind(null, $scope.range);

            $scope.$on('$locationChangeStart', function () {
                var path = $location.path();
                css.showSearchAddress = path == '/search-address'
            });

            $scope.choose = function () {
                if (css.cur) {
                    css.edit = true;
                } else {
                    css.cur = true;
                    // 如果这是一个新地址
                    if (!$scope.oldAddress) {
                        css.edit = true;
                    }
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
                            $scope.data.streetList = res.data.results
                        })
                }
            };

            $scope.confirmStreet = function (street) {
                $location.path('');
                if (!street) return;

                addr.street = street.name;
                addr.geoLatitude = street.location.lat;
                addr.geoLongitude = street.location.lng;
            };

            $scope.save = function () {
                if (css.form.$invalid) return $q.resolve(false);

                Address[$scope.oldAddress ? 'update' : 'addOne']
                .then(function (res) {
                        addr = $scope.addr = res.data;
                        return res;
                    });
            };

            $scope.initForm = function (form) {
                css.form = form;
                css.showFakeInput = !addr.province;
            };

            // 必须要先在外部调用Weixin.config
            $scope.locate = function (event) {

                css.locating = true;

                event.stopPropagation();

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
                        Utils.regularizeAddress(result);

                        angular.extend(addr, result);
                    }).catch(angular.noop).then(function () {
                        css.locating = false; // like finally
                    })
                }, function () {
                    css.locating = false;
                })
            };

        }
    }
})