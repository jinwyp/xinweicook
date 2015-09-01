/**
 * Created by jinwyp on 7/22/15.
 */





angular
    .module('RDash')
    .controller('UserAccountDetailController', ['$scope', '$timeout', '$state', '$stateParams', 'Notification', 'Util', 'Users', 'UserAccounts', 'UserAccountDetails', 'Devices', userAccountDetailController]);


function userAccountDetailController($scope, $timeout, $state, $stateParams, Notification, Util, Users, UserAccounts, UserAccountDetails, Devices) {

    $scope.data = {
        searchFilter : '',
        searchOptions : {
            skip : 0,
            limit : 1000,
            isPlus : '',
            user : '',
            order : ''
        },

        searchSort : {
            sort : '-createdAt'
        },

        accountDetailListCount : 0,
        accountDetailListCurrentPage : 1,
        accountDetailListTotalPages : 1,
        accountDetailListPagesArray : [],

        currentDeleteIndex : -1,


        accountDetailList     : [],

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
        ]

    };

    $scope.css = {
        isAddNewStatus : true
    };



    $scope.searchAccountDetailCount = function (){
        Util.delProperty($scope.data.searchOptions);

        UserAccountDetails.one('count').get($scope.data.searchOptions).then(function (users) {
            $scope.data.accountDetailListCount = users.count;
            $scope.data.accountDetailListTotalPages = Math.ceil(users.count / $scope.data.searchOptions.limit);

            $scope.data.accountDetailListPagesArray= [];
            for (var i = 1; i <= $scope.data.accountDetailListTotalPages; i++){
                $scope.data.accountDetailListPagesArray.push( {value : i} )
            }

            $scope.searchAccountDetail();

        });
    };

    $scope.searchAccountDetail = function (form) {
        Util.delProperty($scope.data.searchOptions);

        var options = angular.extend({}, $scope.data.searchOptions, $scope.data.searchSort);

        UserAccountDetails.getList(options).then(function (result) {
            $scope.data.accountDetailList = result;
            Notification.success({message: 'Search Success! ', delay: 8000});

        }).catch(function(err){
            Notification.error({message: "Search Failure! Status:" + err.status + " Reason: " + err.data.message , delay: 5000});
        });

    };

    $scope.changePagination = function (currentPageNo) {
        $scope.data.accountDetailListCurrentPage = currentPageNo;
        $scope.data.searchOptions.skip = ($scope.data.accountDetailListCurrentPage-1) * $scope.data.searchOptions.limit;
        $scope.searchAccountDetail();
    };


    $scope.delAccountDetail = function (user) {

        var index = $scope.data.accountDetailList.indexOf(user);
        $scope.data.accountDetailList[index].remove().then(function (resultDevice) {
            $scope.searchAccountDetailCount();

            Notification.success({message : 'Delete Success', delay : 8000});

        }).catch(function (err) {
            Notification.error({
                message : "Delete Failure! Status:" + err.status + " Reason: " + err.data.message,
                delay   : 5000
            });
        });

    };




    if ($state.current.data.type === 'list') {

        $scope.searchAccountDetailCount();
    }

    if ($state.current.data.type === 'update') {
        $scope.css.isAddNewStatus = false;

        UserAccountDetails.one($stateParams.id).get().then(function (resultAccountDetail) {
            $scope.data.user = resultAccountDetail;

            //编辑user时， 处理user group 显示
            //angular.forEach($scope.data.userGroup, function (user) {
            //    if (user.zh === $scope.data.user.group.zh) {
            //        $scope.data.user.group = user;
            //    }
            //});
        });


    }




    $scope.updateAccountDetail = function (form) {
        if (form.$invalid) {
            return;
        }


        $scope.data.user.put().then(function (resultAccountDetail) {
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

