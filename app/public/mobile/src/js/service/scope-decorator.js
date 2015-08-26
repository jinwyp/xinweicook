angular.module('xw.services').factory('ScopeDecorator', function () {
    return {
        common: function (scope) {
            if (!scope) return;
            scope.back = function () {
                if (history.length > 1) history.back();
                else location.href = '/mobile/'
            }
        }
    }
});