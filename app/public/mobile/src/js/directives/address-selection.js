angular.module('xw.directives').directive('addressSelection', function () {
    return {
        restrict: 'E',
        scope: {
            animateTrigger: '=',
            show: '=',
            address: '=',
            noAddress: '=',
            dishId: '@',
            path: '@'
        },
        templateUrl: 'address-selection.html'
    }
});