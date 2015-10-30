angular.module('xw.directives').directive('shoppingProgressBar', function () {
    return {
        templateUrl: 'shopping-progress-bar.html',
        scope: true,
        link: function (scope) {
            var path = location.pathname;
            if (path == '/mobile/cart') {
                scope.state = 'state1';
            } else if (path == '/mobile/orderaddress') {
                scope.state = 'state2'
            } else if (path == '/mobile/orderpay') {
                scope.state = 'state3'
            }
        }
    }
})