angular.module('xw.controllers').controller('favCtrl', function ($scope, User, ScopeDecorator) {

    ScopeDecorator.common($scope);

    function init() {
        User.getUserInfo().then(function (res) {
            var dishList = res.data.dishLikeList;
            $scope.cookList = dishList.filter(function (dish) {
                return dish.cookingType == 'ready to cook';
            });

            $scope.eatList = dishList.filter(function (dish) {
                return dish.cookingType == 'ready to eat';
            })
        })
    }

    init();
})