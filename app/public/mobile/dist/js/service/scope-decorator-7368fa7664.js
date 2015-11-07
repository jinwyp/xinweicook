angular.module('xw.services').factory('ScopeDecorator', ["$location", function ($location) {
    return {
        common: function (scope) {
            if (!scope) return;
            scope.back = function () {
                if (history.length > 1) history.back();
                else location.href = '/mobile/'
            }
        },
        nav: function (scope) {
            if (!scope) return;
            scope.$on('$locationChangeStart', function () {
                scope.path = $location.path();
            });
        }
    }
}]);