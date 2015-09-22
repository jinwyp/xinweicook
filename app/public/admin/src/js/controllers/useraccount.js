/**
 * Created by jinwyp on 7/22/15.
 */





angular
    .module('RDash')
    .controller('UserAccountController', ['$scope', '$timeout', '$state', '$stateParams', 'Notification', 'Util', 'Users', 'UserAccounts', 'Devices', userAccountController]);


function userAccountController($scope, $timeout, $state, $stateParams, Notification, Util, Users, UserAccounts, Devices) {

    $scope.data = {
        searchFilter : '',
        searchOptions : {
            skip : 0,
            limit : 200,
            user : ''
        },

        searchSort : {
            sort : '-createdAt'
        },

        AccountListCount : 0,
        AccountListCurrentPage : 1,
        AccountListTotalPages : 1,
        AccountListPagesArray : [],

        currentDeleteIndex : -1,


        AccountList     : [],
        userAccount : {},

        isPlusList : [
            {
                name : 'ALL',
                value : ''
            },
            {
                name : '充值',
                value : 'true'
            },
            {
                name : '消费',
                value : 'false'
            }
        ],

        chargeTypeList : [
            {
                name : 'ALL',
                value : ''
            },
            {
                name : '充值码充值',
                value : 'chargecode'
            },
            {
                name : '在线充值',
                value : 'alipaydirect'
            }
        ]

    };

    $scope.css = {
        isAddNewStatus : true
    };



    $scope.searchAccountCount = function (){
        Util.delProperty($scope.data.searchOptions);

        UserAccounts.one('count').get($scope.data.searchOptions).then(function (users) {
            $scope.data.AccountListCount = users.count;
            $scope.data.AccountListTotalPages = Math.ceil(users.count / $scope.data.searchOptions.limit);

            $scope.data.AccountListPagesArray= [];
            for (var i = 1; i <= $scope.data.AccountListTotalPages; i++){
                $scope.data.AccountListPagesArray.push( {value : i} )
            }

            $scope.searchAccount();

        });
    };

    $scope.searchAccount = function (form) {
        Util.delProperty($scope.data.searchOptions);

        var options = angular.extend({}, $scope.data.searchOptions, $scope.data.searchSort);

        UserAccounts.getList(options).then(function (result) {
            $scope.data.AccountList = result;
            Notification.success({message: 'Search Success! ', delay: 8000});

        }).catch(function(err){
            Notification.error({message: "Search Failure! Status:" + err.status + " Reason: " + err.data.message , delay: 5000});
        });

    };

    $scope.changePagination = function (currentPageNo) {
        $scope.data.AccountListCurrentPage = currentPageNo;
        $scope.data.searchOptions.skip = ($scope.data.AccountListCurrentPage-1) * $scope.data.searchOptions.limit;
        $scope.searchAccount();
    };


    $scope.delAccount = function (user) {

        var index = $scope.data.AccountList.indexOf(user);
        $scope.data.AccountList[index].remove().then(function (resultDevice) {
            $scope.searchAccountCount();

            Notification.success({message : 'Delete Success', delay : 8000});

        }).catch(function (err) {
            Notification.error({
                message : "Delete Failure! Status:" + err.status + " Reason: " + err.data.message,
                delay   : 5000
            });
        });

    };




    if ($state.current.data.type === 'list') {

        $scope.searchAccountCount();
    }

    if ($state.current.data.type === 'update') {
        $scope.css.isAddNewStatus = false;

        UserAccounts.one($stateParams.id).get().then(function (resultAccount) {
            $scope.data.userAccount = resultAccount;
            console.log (resultAccount);
            //编辑user时， 处理user group 显示
            //angular.forEach($scope.data.userGroup, function (user) {
            //    if (user.zh === $scope.data.user.group.zh) {
            //        $scope.data.user.group = user;
            //    }
            //});
        });

    }




    $scope.updateAccount = function (form) {
        if (form.$invalid) {
            return;
        }

        $scope.data.userAccount.put().then(function (resultAccount) {
            Notification.success({message : 'Update Success', delay : 8000});
        }).catch(function (err) {
            console.log(err);
            Notification.error({
                message : "Update Failure! Status:" + err.status + " Reason: " + err.data.message,
                delay   : 5000
            });
        });
    };






}

