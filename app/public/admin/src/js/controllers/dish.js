/**
 * Created by jinwyp on 7/22/15.
 */





angular
    .module('RDash')
    .controller('DishController', ['$scope', '$timeout', '$state', '$stateParams', 'Notification', 'Dishes', 'Tags', dishController ]);



function dishController($scope, $timeout, $state, $stateParams, Notification, Dishes, Tags) {

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
        tagList : [],
        dishList : [],
        currentTagFilter : '',
        currentPreferenceCategory : '',
        currentPreference : '',
        currentTopping : '',
        dish : {
            isPublished : false,
            isFromAdminPanel: true,
            sortId : 1000,
            cookingType : 'ready to cook',
            sideDishType : 'main',
            setType : 'single',

            difficulty: '',
            time: '',
            servings: '',
            storageLife: '', // 即食包冷藏保存期

            title : {
                zh : '',
                en : ''
            },
            brief : {
                zh : '',
                en : ''
            },

            cover: [{
                zh : '',
                en : ''
            }],

            kitchenware: [{
                zh : '',
                en : ''
            }],

            infoUniqueFeature: [{
                title: {
                    zh : '',
                    en : ''
                },
                contentType: 'txt',
                value: {
                    zh : '',
                    en : ''
                },
                sortId : 10,
                linkTo : ''
            }],
            infoIngredient: [{
                title: {
                    zh : '',
                    en : ''
                },
                contentType: 'txt',
                value: {
                    zh : '',
                    en : ''
                },
                sortId : 10,
                linkTo : ''
            }],
            infoCookingStep: [{
                title: {
                    zh : '',
                    en : ''
                },
                contentType: 'txt',
                value: {
                    zh : '',
                    en : ''
                },
                sortId : 10,
                linkTo : ''
            }],

            preferences: [],

            //preferences: [{
            //    name : {
            //        zh : '',
            //        en : ''
            //    },
            //    foodMaterial: [{
            //        dish : '',
            //        default : false
            //    }]
            //}],

            topping: [],
            tagFilter: [],

            priceOriginal: 1000,
            priceWholesale: [{
                quantity : '',
                price : ''
            }],

            stock : 20

        },

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

        setTypeList : [
            {
                name : 'ALL',
                value : ''
            },
            {
                name : '单品',
                value : 'single'
            },
            {
                name : '套餐',
                value : 'set'
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
        ],

        contentTypeList :[
            {
                name : '文本',
                value : 'txt'
            },
            {
                name : '文字链接',
                value : 'url'
            },
            {
                name : '图片',
                value : 'pic'
            },
            {
                name : '视频格式MP4',
                value : 'videomp4'
            },
            {
                name : '视频格式FLV',
                value : 'videoflv'
            },
            {
                name : 'PDF',
                value : 'pdf'
            }
        ],

        preferenceCategoryList :[
            {
                zh : '牛肉',
                en : 'beef'
            },
            {
                zh : '菌菇',
                en : 'mushroom'
            }

        ]
    };

    $scope.css = {
        isAddNewStatus : true
    };



    if ($state.current.data.type === 'list'){

    }

    Dishes.getList().then(function (resultDishes) {
        $scope.data.dishList = resultDishes;
    });
    Tags.getList().then(function (tags) {
        $scope.data.tagList = tags;
    });


    if ($state.current.data.type === 'update'){
        $scope.css.isAddNewStatus = false;

        Dishes.one($stateParams.id).get().then(function (resutlDish) {
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
                    }else{
                        angular.forEach(obj[p], function(subobj, index){
                            if(!angular.isUndefined(subobj.zh) && subobj.zh == ''){
                                obj[p].splice(index, 1)
                            }
                            if(!angular.isUndefined(subobj.title) && subobj.title.zh == ''){
                                obj[p].splice(index, 1)
                            }
                            if(!angular.isUndefined(subobj.quantity) && subobj.quantity == ''){
                                obj[p].splice(index, 1)
                            }
                        })
                    }
                }else if (angular.isObject(obj[p])) {
                    console.log (obj[p]);
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
        deleteProperty($scope.data.searchOptions);

        Dishes.getList($scope.data.searchOptions).then(function (resultDish) {
            $scope.data.dishList = resultDish;
            Notification.success({message: 'Search Success! ', delay: 8000});

        }).catch(function(err){
            Notification.error({message: "Search Failure! Status:" + err.status + " Reason: " + err.data.message , delay: 5000});
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


    $scope.addNewDish = function (form) {
        if (form.$invalid) {
            return;
        }

        var newDish = angular.copy($scope.data.dish);
        deleteProperty(newDish);
        console.log (newDish);
        Dishes.post(newDish).then(function (resultDish) {
            console.log(resultDish);
            Notification.success({message: 'Save Success', delay: 8000});

        }).catch(function(err){
            Notification.error({message: "Create New Dish Failure! Status:" + err.status + " Reason: " + err.data.message , delay: 5000});
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

    $scope.addNewCover = function (current) {
        current.push(
            {
                zh : '',
                en : ''
            }
        )
    };
    $scope.addNewFeature = function (current) {
        current.push({
            title : {
                zh : '',
                en : ''
            },
            contentType: 'txt',
            value : {
                zh : '',
                en : ''
            },
            sortId : 100,
            linkTo : ''
        })

    };
    $scope.addNewPriceWholesale = function (current) {
        current.push({
            quantity : '',
            price : ''
        })
    };

    $scope.addNewTagFilter = function (pushArray, data) {
        if (data){
            pushArray.push(data._id);
        }
    };

    $scope.addNewPreference = function () {

        if (angular.isArray($scope.data.dish.preferences) && $scope.data.currentPreferenceCategory && $scope.data.currentPreference){
            var isNewCategory = true;

            angular.forEach($scope.data.dish.preferences, function(preference, key) {

                if (!angular.isUndefined(preference.name)){
                    if(preference.name.zh === $scope.data.currentPreferenceCategory.zh){
                        isNewCategory = false;

                        preference.foodMaterial.push({
                            dish : $scope.data.currentPreference._id,
                            default : false
                        });
                    }
                }
            });

            if (isNewCategory){
                var tempFoodMaterial = [];
                tempFoodMaterial.push({
                    dish : $scope.data.currentPreference._id,
                    default : false
                });
                $scope.data.dish.preferences.push({
                    name : $scope.data.currentPreferenceCategory,
                    foodMaterial : tempFoodMaterial
                });
            }

        }

    };




}
