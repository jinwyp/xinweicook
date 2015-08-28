/**
 * Created by jinwyp on 7/22/15.
 */





angular
    .module('RDash')
    .controller('UserController', ['$scope', '$timeout', '$state', '$stateParams', 'Notification', 'Util', 'Users', 'UserAccounts', 'UserAccountDetails', 'Coupons', userController]);


function userController($scope, $timeout, $state, $stateParams, Notification, Util, Users, UserAccounts, UserAccountDetails, Coupons) {

    $scope.data = {
        searchFilter : '',
        searchOptions : {
            skip : 0,
            limit : 1000,
            group : '',
            _id : '',
            mobile : '',
            invitationSendCode : ''
        },

        searchSort : {
            sort : '-createdAt'
        },

        userListCount : 0,
        userListCurrentPage : 1,
        userListTotalPages : 1,
        userListPagesArray : [],

        currentDeleteIndex : -1,


        userList     : [],
        user         : {
            username : '',
            email : '',
            mobile : '',
            pwd : '',
            fullName : '',
            gender : '',
            group : 'member'
        },
        userAccount : {},
        userAccountDetails : [],
        userCouponList : [],

        userGroupList: [
            {
                name : 'ALL',
                value : ''
            },
            {
                name : '普通会员',
                value : 'member'
            },
            {
                name : '管理员',
                value : 'admin'
            }
        ]
    };

    $scope.css = {
        isAddNewStatus : true
    };



    $scope.searchUserCount = function (){
        Util.delProperty($scope.data.searchOptions);

        Users.one('count').get($scope.data.searchOptions).then(function (users) {
            $scope.data.userListCount = users.count;
            $scope.data.userListTotalPages = Math.ceil(users.count / $scope.data.searchOptions.limit);

            $scope.data.userListPagesArray= [];
            for (var i = 1; i <= $scope.data.userListTotalPages; i++){
                $scope.data.userListPagesArray.push( {value : i} )
            }

            $scope.searchUser();

        });
    };

    $scope.searchUser = function (form) {
        Util.delProperty($scope.data.searchOptions);

        var options = angular.extend({}, $scope.data.searchOptions, $scope.data.searchSort);

        Users.getList(options).then(function (resultUsers) {
            $scope.data.userList = resultUsers;
            Notification.success({message: 'Search Success! ', delay: 8000});

        }).catch(function(err){
            Notification.error({message: "Search Failure! Status:" + err.status + " Reason: " + err.data.message , delay: 5000});
        });

    };

    $scope.changePagination = function (currentPageNo) {
        $scope.data.userListCurrentPage = currentPageNo;
        $scope.data.searchOptions.skip = ($scope.data.userListCurrentPage-1) * $scope.data.searchOptions.limit;
        $scope.searchUser();
    };


    $scope.delUser = function (user) {

        var index = $scope.data.userList.indexOf(user);

        $scope.data.userList[index].remove().then(function (resultUser) {
            $scope.searchUserCount();

            Notification.success({message : 'Delete Success', delay : 8000});

        }).catch(function (err) {
            Notification.error({
                message : "Delete Failure! Status:" + err.status + " Reason: " + err.data.message,
                delay   : 5000
            });
        });

    };




    if ($state.current.data.type === 'list') {

        $scope.searchUserCount();
    }

    if ($state.current.data.type === 'update') {
        $scope.css.isAddNewStatus = false;

        Users.one($stateParams.id).get().then(function (resultUser) {
            $scope.data.user = resultUser;

            //编辑user时， 处理user group 显示
            //angular.forEach($scope.data.userGroup, function (user) {
            //    if (user.zh === $scope.data.user.group.zh) {
            //        $scope.data.user.group = user;
            //    }
            //});
        });


        UserAccounts.one($stateParams.id).get().then(function (resultUserAccount) {
            $scope.data.userAccount = resultUserAccount;
        });

    }




    $scope.updateUser = function (form) {
        if (form.$invalid) {
            return;
        }
        if ($scope.data.user.pwd.length > 20 || $scope.data.user.pwd === ''){
            delete $scope.data.user.pwd;
        }


        $scope.data.user.put().then(function (resultUser) {
            Notification.success({message : 'Update Success', delay : 8000});
        }).catch(function (err) {
            console.log(err);
            Notification.error({
                message : "Update Failure! Status:" + err.status + " Reason: " + err.data.message,
                delay   : 5000
            });
        });
    };



    $scope.addNewUser = function (form) {
        if (form.$invalid) {
            return;
        }

        var newUser = angular.copy($scope.data.user);
        //console.log (newUser);
        Users.post(newUser).then(function (resultUser) {
            console.log(resultUser);
            Notification.success({message : 'Save Success', delay : 8000});

        }).catch(function (err) {
            console.log(err);
            Notification.error({
                message : "Update Failure! Status:" + err.status + " Reason: " + err.data.message,
                delay   : 5000
            });
        });
    };



    $scope.showUserAccountDetails = function () {

        UserAccountDetails.getList({user : $stateParams.id, sort : '-createdAt'}).then(function (resultUserAccountDetails) {
            $scope.data.userAccountDetails = resultUserAccountDetails;
            Notification.success({message: 'Search Success', delay: 8000});

        }).catch(function(err){
            Notification.error({message: "Search Failure! Status:" + err.status + " Reason: " + err.data.message , delay: 5000});
        });

    };


    $scope.showUserCoupons = function () {

        Coupons.getList({user : $stateParams.id, sort : '-createdAt'}).then(function (resultUserCoupons) {
            $scope.data.userCouponList = resultUserCoupons;
            Notification.success({message: 'Search Success', delay: 8000});

        }).catch(function(err){
            Notification.error({message: "Search Failure! Status:" + err.status + " Reason: " + err.data.message , delay: 5000});
        });

    };

}

