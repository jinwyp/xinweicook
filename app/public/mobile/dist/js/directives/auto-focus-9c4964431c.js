angular.module('xw.directives').directive('autoFocus', function () {
    return {
        restrict: 'A',
        link: function (scope, el) {
            setTimeout(function () {
                el[0].focus();
            }, 100);
        }
    }
});