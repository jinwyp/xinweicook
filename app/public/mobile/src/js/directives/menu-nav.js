angular.module('xw.directives').directive('menuNav', function () {
    return {
        restrict: 'E',
        scope: {
            path: '@',
            localBag: '=',
            isAddressOk: '&'
        },
        templateUrl: 'menu-nav.html',
        link: function ($scope) {
            $scope.goToCart = function () {
                location.href= '/mobile/cart';
            };

            if (location.pathname == '/mobile/me') {
                $scope.path = '/mobile/me';
            }
        }
    }
})