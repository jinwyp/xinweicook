angular.module('xw.directives').directive('thanksgiving', function ($timeout) {
    return {
        restrict: 'E',
        templateUrl: 'thanksgiving.html',
        link: function (scope) {
            $timeout(function () {
                scope.close()
            }, 4500);
        }
    }
});