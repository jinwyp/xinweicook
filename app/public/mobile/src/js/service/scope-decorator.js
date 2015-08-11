angular.module('xw.services').factory('ScopeDecorator', function ($location) {
    return {
        common: function (scope) {
            if (!scope) return;
            scope.back = function () {
                history.back();
            }
        },
        nav: function (scope) {
            if (!scope) return;
            scope.$on('$locationChangeStart', function () {
                scope.path = $location.path();
            });
        }
    }
});