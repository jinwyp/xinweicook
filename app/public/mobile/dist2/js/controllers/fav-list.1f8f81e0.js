angular.module('xw.controllers').controller('favCtrl', function ($scope, User, ScopeDecorator, $filter) {

    ScopeDecorator.common($scope);

    function outOfStock (dish) {
        return dish.outOfStock || !dish.isPublished;
    }

    var adapt = $filter('adapt');
    $scope.imgAdapt = function (src) {
        return adapt(src);
    };

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
//# sourceMappingURL=fav-list.1f8f81e0.js.map
