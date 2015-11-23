angular.module('xw.directives').directive('errTip', function () {
    return {
        scope: {
            form: '=',
            error: '@',
            name: '@'
        },
        transclude: true,
        templateUrl: 'err-tip.html'
    }
})