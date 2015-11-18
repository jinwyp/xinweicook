angular.module('xw.directives').directive('address', function (Address) {
    return {
        restrict: 'E',
        scope: {
            oldAddress: '=',
            deleteHook: '&'
        },
        templateUrl: 'address.html',
        link: function ($scope) {
            var addr;

            var css = $scope.css = {
                edit: false,
                cur: false,
                showSearchAddress: false
            };

            var data = $scope.data = {
                street: ''
            };

            $scope.$on('$locationChangeStart', function () {
                var path = $location.path();
                css.showSearchAddress = path == '/search-address'
            });

            $scope.showSearchAddress = function () {
                data.street = addr.street;
                $location.path('search-address');
                $scope.data.streetList && ($scope.data.streetList.length = 0);
                $scope.searchAddress();
            };

            $scope.searchAddress = function () {
                if (data.street) {
                    Map.suggestion(data.street, addr.city || '全国')
                        .then(function (res) {
                            $scope.data.streetList = res.data.result.filter(function (address) {
                                return (!!address.city && !!address.location && address.name != '漕河泾' )
                            });
                        })
                }
            };


            $scope.choose = function () {
                if (css.cur) {
                    css.edit = true;
                } else {
                    css.cur = true;

                    // 如果没有一个外部传入的地址,那么这是一个新地址
                    if (!$scope.oldAddress) {
                        css.edit = true;
                        addr = $scope.addr = {}
                    } else {
                        addr = $scope.addr = angular.copy($scope.oldAddress);
                    }
                }
            };

            $scope.deleteAddress = function (event) {
                event.stopPropagation();

                Address.delete(addr._id);
                if ($scope.deleteHook) {
                    $scope.deleteHook();
                }
            }

        }
    }
})