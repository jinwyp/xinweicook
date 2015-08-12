angular.module('xw.controllers').controller('cookCtrl', function ($scope, Dishes, Debug) {


    function init() {
        var paths = location.href.split('/');
        var dishId = paths[paths.length - 1];

        Dishes.getOne(dishId).then(function (res) {
            $scope.dish = res.data;
        }).then(Debug.promiseErrFn('获取Dish失败'))
    }

    init();
})