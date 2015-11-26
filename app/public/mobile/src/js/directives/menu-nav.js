angular.module('xw.directives').directive('menuNav', function () {
    return {
        restrict: 'E',
        scope: {
            path: '@',
            localBag: '=',
            tryBuy: '&',
            isValid: '&'
        },
        templateUrl: 'menu-nav.html',
        link: function ($scope) {
            $scope.goToCart = function () {
                if (!$scope.localBag || !$scope.localBag.length) {
                    alert('请至少添加一份菜品');
                    return;
                }
                location.href= '/mobile/cart';
            };

            if (location.pathname == '/mobile/me') {
                $scope.path = '/mobile/me';
            }
        }
    }
})