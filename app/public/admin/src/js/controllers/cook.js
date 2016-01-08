/**
 * Created by jinwyp on 7/22/15.
 */





angular
    .module('RDash')
    .controller('CookController', ['$scope', '$timeout', '$state', '$stateParams', 'Notification', 'Util', 'Cooks', 'Coupons', 'Statistic', cookController]);


function cookController($scope, $timeout, $state, $stateParams, Notification, Util, Cooks, Coupons, Statistic) {

    $scope.data = {
        searchFilter : '',
        searchOptions : {
            sort : '-createdAt',
            skip : 0,
            limit : 200,

            query : {
                createdAt :'',
                _id : '',
                mobile : ''

            }

        },

        datePickerIsOpen : false,

        searchDateFrom : '',
        searchDateTo : '',

        cookListCount : 0,
        cookListCurrentPage : 1,
        cookListTotalPages : 1,
        cookListPagesArray : [],

        currentDeleteIndex : -1,


        cookList     : [],
        cook         : {
            name : {
                zh : '',
                en : ''
            },
            description : {
                zh : '',
                en : ''
            },
            mobile : '',
            avatar : ''
        },

        cookGroupList: [
            {
                name : 'ALL',
                value : ''
            },
            {
                name : '普通会员',
                value : 'member'
            },
            {
                name : '快递员',
                value : 'courier'
            },
            {
                name : '客服',
                value : 'cs'
            },
            {
                name : '管理员',
                value : 'admin'
            }
        ]

    };

    $scope.css = {
        isAddNewStatus : true,
        showTable : 'cooks'
    };





    $scope.searchCookCount = function (){


        Util.delProperty($scope.data.searchOptions.query);

        Cooks.one('count').get(Util.formatParam($scope.data.searchOptions)).then(function (cooks) {
            $scope.data.cookListCount = cooks.count;
            $scope.data.cookListTotalPages = Math.ceil(cooks.count / $scope.data.searchOptions.limit);

            $scope.data.cookListPagesArray= [];
            for (var i = 1; i <= $scope.data.cookListTotalPages; i++){
                $scope.data.cookListPagesArray.push( {value : i} );
            }

            $scope.searchCook();

        });
    };

    $scope.searchCook = function (form) {
        Util.delProperty($scope.data.searchOptions.query);

        Cooks.getList(Util.formatParam($scope.data.searchOptions, true)).then(function (resultCooks) {
            $scope.data.cookList = resultCooks;
            Notification.success({message: 'Search Success! ', delay: 4000});

        }).catch(function(err){
            Notification.error({message: "Search Failure! Status:" + err.status + " Reason: " + err.data.message , delay: 7000});
        });

    };

    $scope.changePagination = function (currentPageNo) {
        $scope.data.cookListCurrentPage = currentPageNo;
        $scope.data.searchOptions.skip = ($scope.data.cookListCurrentPage-1) * $scope.data.searchOptions.limit;
        $scope.searchCook();
    };


    $scope.delCook = function (cook) {

        var index = $scope.data.cookList.indexOf(cook);

        $scope.data.cookList[index].remove().then(function (resultCook) {
            $scope.searchCookCount();

            Notification.success({message : 'Delete Success', delay : 4000});

        }).catch(function (err) {
            Notification.error({ message : "Delete Failure! Status:" + err.status + " Reason: " + err.data.message, delay   : 7000 });
        });

    };




    if ($state.current.data.type === 'list') {

        $scope.searchCookCount();
    }

    if ($state.current.data.type === 'update') {
        $scope.css.isAddNewStatus = false;

        Cooks.one($stateParams.id).get().then(function (resultCook) {
            $scope.data.cook = resultCook;

            //编辑cook时， 处理cook group 显示
            //angular.forEach($scope.data.cookGroup, function (cook) {
            //    if (cook.zh === $scope.data.cook.group.zh) {
            //        $scope.data.cook.group = cook;
            //    }
            //});
        });


    }




    $scope.updateCook = function (form) {
        if (form.$invalid) {
            return;
        }

        $scope.data.cook.put().then(function (resultCook) {
            Notification.success({message : 'Update Success', delay : 4000});
        }).catch(function (err) {
            console.log(err);
            Notification.error({  message : "Update Failure! Status:" + err.status + " Reason: " + err.data.message,  delay   : 7000  });
        });
    };



    $scope.addNewCook = function (form) {
        if (form.$invalid) {
            return;
        }

        var newCook = angular.copy($scope.data.cook);
        //console.log (newCook);
        Cooks.post(newCook).then(function (resultCook) {
            console.log(resultCook);
            Notification.success({message : 'Save Success', delay : 4000});

        }).catch(function (err) {
            Notification.error({ message : "Add New Cook Failure! Status:" + err.status + " Reason: " + err.data.message, delay   : 7000 });
        });
    };






}
