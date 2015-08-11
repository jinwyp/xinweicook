angular.module('xw.controllers').controller('favCtrl', function ($scope, User, ScopeDecorator) {

    ScopeDecorator.common($scope);

    function outOfStock (dish) {
        return dish.outOfStock || !dish.isPublished;
    }

    function init() {
        User.getUserInfo().then(function (res) {
            var dishList = res.data.dishLikeList;
            $scope.cookList = [];
            $scope.eatList = [];

            dishList.forEach(function (dish) {
                dish.outOfStock = outOfStock(dish);
                if (dish.cookingType == 'ready to cook') {
                    $scope.cookList.push(dish);
                } else {
                    $scope.eatList.push(dish);
                }
            });
        })
    }

    init();
})