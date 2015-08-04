angular.module('xw.controllers').controller('addressEditCtrl', function ($scope, Debug, Address, User, $localStorage, Map) {
    var user, oldAddress;

    $scope.Address = Address;
    $scope.address = null;
    $scope.isEdit = false; // false表示新建地址
    $scope.css = {
        showFakeInput: true
    };

    $scope.search = function () {
        if ($scope.address.street) {
            Map.suggestion($scope.address.street, $scope.address.city || '全国').then(function (res) {
                $scope.searchAddresses = res.data.filter
            })
        }
    }


    $scope.deleteAddress = function () {
        if (user) {
            user.address.some(function (addr, i) {
                var equal = Object.keys(addr).every(function (key) {
                    return addr[key] == $scope.address[key];
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

    $scope.updateAddress = function (form) {
        if (form.$valid) {

            if (user) {
                if ($scope.isEdit) {
                    var found = user.address.some(function (addr, i) {
                        var equal = Object.keys(addr).every(function (key) {
                            return addr[key] == oldAddress[key];
                        });
                        if (equal) {
                            user.address[i] = $scope.address;
                            return true;
                        }
                    });
                    Debug.assert(found, 'should find the local address in the remote address list');

                } else {
                    user.address.push($scope.address);
                }

                User.updateUser(user).then(function () {
                    history.back();
                }).catch(Debug.promiseErrFn('更新地址失败'))

            } else {
                $scope.updateAddress.called = true;
            }
        }
    }

    function init() {
        if ($localStorage.editAddress) {
            $scope.address = $localStorage.editAddress;
            oldAddress = angular.copy($scope.address);
            $scope.isEdit = true;
            delete $localStorage.editAddress;
        } else {
            $scope.address = {}
        }

        User.getUserInfo().then(function (res) {
            user = res.data; // 仅仅为了更新.
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