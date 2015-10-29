angular.module('xw.directives').directive('backButton', function () {
    return {
        template: '<div class="back-icon" ng-click="back()"></div>',
        link: function ($scope) {
            // 有些路径需要直接调用 navigator.back(), 有些路径
            $scope.back = function () {
                if (history.length <= 1) location.href = '/mobile/';
                history.back();
            }
        }
    }
})