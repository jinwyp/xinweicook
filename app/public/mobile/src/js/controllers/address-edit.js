angular.module('xw.controllers').controller('addressEditCtrl', function ($scope, ScopeDecorator, Debug, Address, User, $localStorage, Map) {
    ScopeDecorator.common($scope);

    var user, oldAddress;

    $scope.Address = Address;
    $scope.address = null;
    $scope.css = {
        isEdit: false, // false表示新建地址
        showFakeInput: true,
        showAddressTip: false
    };

    $scope.search = function () {
        if ($scope.address.street) {
            Map.suggestion($scope.address.street, $scope.address.city.Name || '全国').then(function (res) {
                $scope.searchAddresses = res.data.result.filter(function (address) {
                    return (!!address.city && !!address.location )
                });

                if (!$scope.searchAddresses.length) {
                     $scope.css.showAddressTip = true;
                }
            })
        }
    };

    var formKeys = ['province', 'city', 'district', 'street', 'address', 'contactPerson', 'mobile'];
    var objectKeys = ['province', 'city', 'district'];
    $scope.formValid = function () {
        if (!$scope.address) return false;
        return formKeys.every(function (key) {
            return !!$scope.address[key];
        })
    };


    function bindAddr2Scope(addr) {
        Address.some(function (province) {
            var exist = province.City.some(function (city) {
                if (addr.city.indexOf(city.Name) != -1) {
                    $scope.address.city = city;
                    return true;
                }
            });
            if (exist) {
                $scope.address.province = province;
                return true;
            }
        });

        $scope.address.city.Region.some(function (district) {
            if (addr.district.indexOf(district.Name) != -1) {
                $scope.address.district = district;
                return true;
            }
        });
    }

    $scope.setStreet = function (addr) {
        $scope.address.street = addr.street;
        addr.location = Map.bd09ToGcj02(addr.location);
        $scope.address.geoLatitude = addr.location.lat;
        $scope.address.geoLongitude = addr.location.lng;

        //todo: 当改变上级地址时,如省,区,之类的, 应当改变该地址

        bindAddr2Scope(addr);

        $scope.address.street = addr.name;

        $scope.searchAddresses = null;
    };


    $scope.deleteAddress = function () {
        if (user) {
            user.address.some(function (addr, i) {
                var equal = formKeys.every(function (key) {
                    return addr[key].indexOf(
                        objectKeys.indexOf(key) != -1 ?
                        $scope.address[key].Name :
                        $scope.address[key]
                    ) != -1;
                });
                if (equal) {
                    user.address.splice(i, 1);
                    return true;
                }
            });
            User.updateUser(user).then(function () {
                // todo: to see the address if be deleted in the back page.
                history.back();
            }).catch(Debug.promiseErrFn('更新地址失败'))
        } else {
            $scope.deleteAddress.called = true;
        }
    };

    $scope.updateAddress = function () {
        if ($scope.formValid()) {

            var address = angular.copy($scope.address);
            address.province = address.province.Name;
            address.city = address.city.Name;
            address.district = address.district.Name;

            if (user) {
                if ($scope.css.isEdit) {
                    var found = user.address.some(function (addr, i) {
                        var equal = Object.keys(addr).every(function (key) {
                            return addr[key] == oldAddress[key];
                        });
                        if (equal) {
                            user.address[i] = address;
                            return true;
                        }
                    });
                    Debug.assert(found, 'should find the local address in the remote address list');

                } else {
                    user.address.push(address);
                }

                User.updateUser(user).then(function () {
                    $localStorage.selectedAddress = address;
                    setTimeout(function () {
                        alert('地址更新成功');
                        history.back();
                    }, 120);
                }).catch(Debug.promiseErrFn('更新地址失败'))

            } else {
                $scope.updateAddress.called = true;
            }
        }
    };

    function init() {
        if ($localStorage.editAddress) {
            $scope.address = $localStorage.editAddress;
            oldAddress = angular.copy($scope.address);
            $scope.css.isEdit = true;
            delete $localStorage.editAddress;
            bindAddr2Scope(oldAddress);
            $scope.address.street = oldAddress.street;
        } else {
            $scope.address = {}
        }

        User.getUserInfo().then(function (res) {
            user = res.data; // 仅仅为了更新.

            // 为增加坐标之前可能存在的无坐标地址设置一个默认坐标
            user.address.forEach(function (address) {
                address.geoLatitude = address.geoLatitude || 0;
                address.geoLongitude = address.geoLongitude || 0;
            });

            if ($scope.deleteAddress.called) {
                $scope.deleteAddress();
            }
            if ($scope.updateAddress.called) {
                $scope.updateAddress({$valid: true});
            }
        });
        // todo:after get address info, set showFakeInput be false if address has a province property.

        $scope.css.showFakeInput = !$scope.address.province;
    }

    init();
});