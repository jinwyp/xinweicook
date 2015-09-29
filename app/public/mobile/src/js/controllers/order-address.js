angular.module('xw.controllers').controller('orderAddressCtrl', function ($scope, User, Map) {

    var css = $scope.css = {
        cur: 0,
        edit: -1
    };

    $scope.choose = function (idx, event) {
        if (idx == css.cur) {
            css.edit = idx;
        } else {
            css.cur = idx
        }

        event.stopPropagation();
    };

    $scope.saveAndLeave = function () {
        css.cur = css.edit == -1 ? css.cur : css.edit;
        css.edit = -1;

        //todo save
    };

    function init() {
        User.getUserInfo().then(function (res) {
            $scope.user = res.data;
            $scope.address = res.data.address;

            var hasDefault = $scope.address.some(function (el, i) {
                if (el.isDefault) {
                    $scope.address.splice(i, 1);
                    $scope.unshift(el);
                    return true;
                }
            });
            if (!hasDefault) {
                $scope.address[0].isDefault = true;
            }

            return $scope.address.length
                && Map.distances($scope.address.map(function (addr) {
                    return {
                        lat: addr.geoLatitude,
                        lng: addr.geoLongitude
                    }
                }))
        }).then(function (res) {
            if (res == 0) return;
            $scope.address.forEach(function (addr, i) {
                addr.isInRange = res[i].isInRange
            })
        })
    }

    init();
});