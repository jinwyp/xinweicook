angular.module('xw.services').factory('ScopeDecorator', function () {
    return {
        common: function (scope) {
            if (!scope) return;
            scope.back = function () {
                history.back();
            }
        }
    }
});