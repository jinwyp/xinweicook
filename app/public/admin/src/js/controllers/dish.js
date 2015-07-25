/**
 * Created by jinwyp on 7/22/15.
 */





angular
    .module('RDash')
    .controller('DishController', ['$scope', '$timeout', '$state', '$stateParams', 'Notification', 'Dishes', dishController ]);



function dishController($scope, $timeout, $state, $stateParams, Notification, Dishes) {

    $scope.data = {
        searchFilter : '',
        searchOptions : {
            cookingType : '',
            sideDishType : '',
            isPublished : '',
            title : {
                zh : ''
            }
        },

        dishList : [],
        dish : {},

        dishCookingType : [
            {
                name : 'ALL',
                value : ''
            },
            {
                name : '食材包',
                value : 'ready to cook'
            },
            {
                name : '既食包',
                value : 'ready to eat'
            }
        ],

        sideDishTypeList : [
            {
                name : 'ALL',
                value : ''
            },
            {
                name : '主菜',
                value : 'main'
            },
            {
                name : '配菜（属性选项）',
                value : 'preferences'
            },
            {
                name : '浇头',
                value : 'topping'
            }
        ],

        isPublishedList : [
            {
                name : 'ALL',
                value : ''
            },
            {
                name : '已上架',
                value : 'true'
            },
            {
                name : '未上架',
                value : 'false'
            }
        ]
    };

    $scope.css = {
        isAddNewStatus : false
    };

    if ($state.current.data.type === 'list'){
        Dishes.getList().then(function (resultDishes) {
            $scope.data.dishList = resultDishes;
        });
    }

    if ($state.current.data.type === 'update'){
        $scope.css.isAddNewStatus = false;

        Dishs.one($stateParams.id).get().then(function (resutlDish) {
            $scope.data.dish = resutlDish;

            //编辑dish时， 处理dish group 显示
            //angular.forEach($scope.data.dishGroup, function(dish) {
            //    if (dish.zh === $scope.data.dish.group.zh){
            //        $scope.data.dish.group = dish;
            //    }
            //});
        });
    }

    function deleteProperty (obj){

        for(var p in obj) {
            if (obj.hasOwnProperty(p)) {
                if (obj[p] ===''){
                    delete obj[p];
                }
                if (angular.isArray(obj[p]) ){
                    if(obj[p].length === 0){
                        delete obj[p];
                    }
                }else if (angular.isObject(obj[p])) {
                    deleteProperty(obj[p]);

                    var hasPro = false;
                    for(var pchild in obj[p]) {
                        hasPro = true;
                    }
                    if (!hasPro){
                        delete obj[p];
                    }
                }
            }
        }
    }

    $scope.searchDish = function (form) {
        console.log ($scope.data.searchOptions);
        deleteProperty($scope.data.searchOptions);

        Dishes.getList($scope.data.searchOptions).then(function (resultDish) {
            $scope.data.dishList = resultDish;
            Notification.success({message: 'Search Success! ', delay: 8000});

        }).catch(function(err){
            Notification.error({message: "Search Failure! Status:" + err.status + " Reason: " + err.data.message , delay: 5000});
        });

    };



    $scope.updateDish = function (form) {
        if (form.$invalid) {
            return;
        }

        $scope.data.dish.put().then(function (resultDish) {
            console.log(resultDish);
            Notification.success({message: 'Update Success! ', delay: 8000});
        }).catch(function(err){
            console.log(err);
            Notification.error({message: "Update Failure! Status:" + err.status + " Reason: " + err.data.message , delay: 5000});
        });
    };



    $scope.delDish = function (dish) {

        var index = $scope.data.dishList.indexOf(dish);

        $scope.data.dishList[index].remove().then(function (resultDish) {
            Dishes.getList().then(function (resultDishes) {
                $scope.data.dishList = resultDishes;
            });

            Notification.success({message: 'Delete Success', delay: 8000});

        }).catch(function(err){
            Notification.error({message: "Delete Failure! Status:" + err.status + " Reason: " + err.data.message , delay: 5000});
        });

    };

}
