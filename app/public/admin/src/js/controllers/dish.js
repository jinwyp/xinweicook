/**
 * Created by jinwyp on 7/22/15.
 */





angular
    .module('RDash')
    .controller('DishController', ['$scope', '$timeout', '$state', '$stateParams', '$localStorage', 'Notification', 'Util', 'Dishes', 'Inventories', 'Tags', 'Statistic', dishController ]);



function dishController($scope, $timeout, $state, $stateParams, $localStorage, Notification, Util, Dishes, Inventories, Tags, Statistic) {

    $scope.data = {
        searchFilter : '',
        searchOptions : {
            sort : '-sortId',

            query : {
                createdAt : '',
                cookingType : '',
                sideDishType : '',
                isPublished : '',
                _id : ''
            },


            searchDateFrom : '',
            searchDateTo : ''


        },

        datePickerIsOpen : false,


        tagList : [],
        dishAllList : [],
        dishList : [],
        inventoryList : [],
        dishStatisticByStock : [],
        dishStatisticByDaily : [],
        dishStatisticChartByDaily : [],
        dishStatisticChartByWeek : [],

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

            stock : 20,

            addInventory : 20,
            reduceInventory : 1

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
                name : '便当',
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
            },
            {
                name : '饮料',
                value : 'drink'
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
                zh : '主食',
                en : 'Starch'
            },
            {
                zh : '额外加饭',
                en : 'Additional Starch'
            },
            {
                zh : '配汤',
                en : 'Soup'
            },
            {
                zh : '酱汁',
                en : 'Sauce'
            },
            {
                zh : '酱料包',
                en : 'Extra Sauce'
            },
            {
                zh : '口味',
                en : 'Flavor'
            },
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
        isAddNewStatus : true,
        showTable : 'dishes',
        searchDishStatisticSortBy : 'salesToday'
    };


    $scope.chartDaily = {
        options: {
            chart: {
                type: 'column'
            },
            plotOptions: {
                series: {
                    stacking: ''
                }
            }
        },
        legend: {
            enabled: false
            //align : 'right'
        },
        series: [],
        title: {
            text: '菜品日销量'
        },
        credits: {
            enabled: true
        },

        xAxis: {
            title: {
                text: '日期'
            },
            categories: []
            //labels: {
            //    enabled: i === 0
            //}
        },
        yAxis : {
            title: {
                text: '数量'
            }
        },
        loading: false,
        size: {}
    };

    $scope.chartWeek = {
        options: {
            chart: {
                type: 'column'
            }
        },
        legend: {
            enabled: false
            //align : 'right'
        },
        series: [],
        title: {
            text: '菜品周销量'
        },
        credits: {
            enabled: true
        },

        xAxis: {
            title: {
                text: '周'
            },
            categories: []
            //labels: {
            //    enabled: i === 0
            //}
        },
        yAxis : {
            title: {
                text: '数量'
            }
        },
        loading: false,
        size: {}
    };


    $scope.datePickerOpen = function($event) {
        $scope.data.datePickerIsOpen = true;
    };


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

                            if(!angular.isUndefined(subobj.title) && subobj.title.zh == '' && !angular.isUndefined(subobj.value) && subobj.value.zh == ''){
                                obj[p].splice(index, 1)
                            }
                            if(!angular.isUndefined(subobj.quantity) && (subobj.quantity == '' || subobj.quantity == null)) {
                                obj[p].splice(index, 1)
                            }

                        })
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



    $scope.searchDishStatistic = function (form, sortBy) {
        $scope.css.showTable = 'statistic';
        $scope.css.searchDishStatisticSortBy = sortBy;


        if ($scope.css.searchDishStatisticSortBy === 'salesToday' || $scope.data.dishStatisticByStock.length === 0){
            Util.delProperty($scope.data.searchOptions.query);

            Statistic.getDishStatisticByStock($scope.data.searchOptions.query).then(function (result) {
                $scope.data.dishStatisticByStock = result.data;
                Notification.success({message: 'Search Success! ', delay: 8000});
            }).catch(function(err){
                console.log(err);
                Notification.error({message: "Search Failure! Status:" + err.status + " Reason: " + err.data.message , delay: 5000});
            });
        }


    };


    $scope.searchDishStatisticByDaily = function (form, sortBy) {
        $scope.css.showTable = 'statisticDaily';
        $scope.css.searchDishStatisticSortBy = sortBy;

        Util.delProperty($scope.data.searchOptions.query);

        Statistic.getDishStatisticByDaily($scope.data.searchOptions.query).then(function (result) {
            $scope.data.dishStatisticByDaily = result.data;
            Notification.success({message: 'Search Success! ', delay: 8000});
        }).catch(function(err){
            console.log(err);
            Notification.error({message: "Search Failure! Status:" + err.status + " Reason: " + err.data.message , delay: 5000});
        });

    };




    $scope.searchDishStatisticChartByDaily = function (form, sortBy) {
        $scope.css.showTable = 'statisticChart';
        $scope.css.searchDishStatisticSortBy = sortBy;

        Util.delProperty($scope.data.searchOptions.query);

        Statistic.getDishStatisticChartByDaily($scope.data.searchOptions.query).then(function (result) {
            $scope.data.dishStatisticChartByDaily = result.data.byDaily;
            $scope.data.dishStatisticChartByWeek =  result.data.byWeek ;

            $scope.chartDaily.series = Util.chartDataFormat($scope.data.dishStatisticChartByDaily);
            $scope.chartDaily.xAxis.categories = Util.chartxAxisFormat($scope.data.dishStatisticChartByDaily);

            $scope.chartWeek.series = Util.chartDataFormat($scope.data.dishStatisticChartByWeek);
            $scope.chartWeek.xAxis.categories = Util.chartxAxisFormat($scope.data.dishStatisticChartByWeek);

            Notification.success({message: 'Search Success! ', delay: 8000});
        }).catch(function(err){
            console.log(err);
            Notification.error({message: "Search Failure! Status:" + err.status + " Reason: " + err.data.message , delay: 5000});
        });


    };



    $scope.searchDish = function (form) {

        $scope.css.showTable = 'dishes';

        console.log($scope.data.searchDateFrom);
        if ($scope.data.searchDateFrom){
            $scope.data.searchOptions.query.createdAt = '>=' + new Date($scope.data.searchDateFrom);
        }else{
            $scope.data.searchOptions.query.createdAt = '';
        }

        deleteProperty($scope.data.searchOptions.query);


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


    $scope.searchDish();

    Tags.getList().then(function (tags) {
        $scope.data.tagList = tags;
    });

    Dishes.getList().then(function (resultDish) {
        $scope.data.dishAllList = resultDish;
    });

    if ($state.current.data.type === 'list'){

    }


    if ($state.current.data.type === 'update'){
        $scope.css.isAddNewStatus = false;

        Dishes.one($stateParams.id).get().then(function (resultDish) {
            $scope.data.dish = resultDish;
        });
    }






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
        console.log($scope.data.dish.preferences);

        if (form.$invalid) {
            return;
        }
        deleteProperty($scope.data.dish);
        $scope.data.dish.put().then(function (resultDish) {
            Dishes.one($stateParams.id).get().then(function (resultDish) {
                $scope.data.dish = resultDish;
            });
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


    $scope.removePreferenceAllDefault = function (preference, subdish) {
        var index = preference.foodMaterial.indexOf(subdish);

        angular.forEach(preference.foodMaterial, function(dish, dishIndex) {

            if (index !== dishIndex){
                dish.default = false
            }
        });

    };

    $scope.removeEmptyPreference = function (preference, index) {
        preference.foodMaterial.splice(preference, 1);
        if (preference.foodMaterial.length === 0){
            var categoryIndex = $scope.data.dish.preferences.indexOf(preference);
            $scope.data.dish.preferences.splice(categoryIndex, 1);
        }

    };

    $scope.showInventory = function () {

        Inventories.getList({dish : $stateParams.id, sort : '-createdAt'}).then(function (result) {
            $scope.data.inventoryList = result;
            Notification.success({message: 'Search Success', delay: 8000});

        }).catch(function(err){
            Notification.error({message: "Search Failure! Status:" + err.status + " Reason: " + err.data.message , delay: 5000});
        });


    };



    $scope.showChart = function(dishId){
        $scope.data.searchOptions.query._id = dishId;

        $scope.searchDishStatisticChartByDaily();

    };




};

