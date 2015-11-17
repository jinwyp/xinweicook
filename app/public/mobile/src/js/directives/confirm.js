angular.module('xw.directives').directive('confirm', function ($q) {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            show: "="
        },
        templateUrl: 'modal.html',
        link: function (scope) {
            var deferred;
            scope.show = function () {
                deferred = $q.defer();
                scope.showModal();
                return deferred.promise;
            };

            scope.confirm = function () {
                scope.close(true);
                deferred.resolve(true);
            };

            scope.cancel = function () {
                scope.close();
            };

            scope.preClose = function () {
                deferred.resolve(false);
            }
        }
    }
});