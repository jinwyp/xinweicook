/**
 * Created by jinwyp on 7/22/15.
 */





angular
    .module('RDash')
    .controller('UserController', ['$scope', '$timeout', '$state', '$stateParams', 'Notification', 'Util', 'Users', 'UserAccounts', 'UserAccountDetails', 'Coupons', 'Statistic', userController]);


function userController($scope, $timeout, $state, $stateParams, Notification, Util, Users, UserAccounts, UserAccountDetails, Coupons, Statistic) {

    $scope.data = {
        searchFilter : '',
        searchOptions : {
            sort : '-createdAt',
            skip : 0,
            limit : 200,

            query : {
                createdAt :'',
                group : '',
                lang : '',
                _id : '',
                mobile : '',
                invitationSendCode : '',
                sharedInvitationSendCodeTotalCount : 0,
                sharedInvitationSendCodeUsedTime : 0
            }

        },

        sharedInvitationSendCodeTotalCountNumber: 0,
        sharedInvitationSendCodeUsedTimeNumber: 0,


        datePickerIsOpen : false,

        searchDateFrom : '',
        searchDateTo : '',


        userListCount : 0,
        userListCurrentPage : 1,
        userListTotalPages : 1,
        userListPagesArray : [],

        currentDeleteIndex : -1,

        currentDailyUserIndex : '',

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

        userStatisticOfNewComers : {},
        userStatisticLoyalPurchaseFrequency : {},
        userStatisticNewFirstOrderUserDaily : [],
        userStatisticChartNewFirstOrderUserDaily : [],

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
        ],

        userLanguageList: [
            {
                name : 'ALL',
                value : ''
            },
            {
                name : '中文',
                value : 'zh'
            },
            {
                name : '英文',
                value : 'en'
            }
        ]
    };

    $scope.css = {
        isAddNewStatus : true,
        showTable : 'users',
        searchUserStatisticSortBy : '-date'
    };



    $scope.chartNewFirstOrderUserDaily = {
        options: {
            chart: {
                type: 'line'
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
            text: '每日有下单新用户'
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
                text: '用户数'
            }
        },
        loading: false,
        size: {}
    };



    $scope.datePickerOpen = function($event) {
        $scope.data.datePickerIsOpen = true;
    };



    $scope.searchUserCount = function (){

        $scope.css.showTable = 'users';

        if ($scope.data.searchDateTo){
            $scope.data.searchOptions.query.createdAt = '<=' + new Date($scope.data.searchDateTo);
        }else{
            $scope.data.searchOptions.query.createdAt = '';
        }


        if ($scope.data.sharedInvitationSendCodeUsedTimeNumber){
            $scope.data.searchOptions.query.sharedInvitationSendCodeUsedTime = '>=' + $scope.data.sharedInvitationSendCodeUsedTimeNumber;
        }else{
            $scope.data.searchOptions.query.sharedInvitationSendCodeUsedTime = '';
        }


        if ($scope.data.sharedInvitationSendCodeTotalCountNumber){
            $scope.data.searchOptions.query.sharedInvitationSendCodeTotalCount = '>=' + $scope.data.sharedInvitationSendCodeTotalCountNumber;
        }else{
            $scope.data.searchOptions.query.sharedInvitationSendCodeTotalCount = '';
        }


        Util.delProperty($scope.data.searchOptions.query);

        Users.one('count').get(Util.formatParam($scope.data.searchOptions)).then(function (users) {
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
        Util.delProperty($scope.data.searchOptions.query);

        Users.getList(Util.formatParam($scope.data.searchOptions, true)).then(function (resultUsers) {
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



    $scope.showUserStatistic = function () {
        $scope.css.showTable = 'stat';

        if ($scope.data.searchDateTo !==''){
            $scope.data.searchOptions.query.createdAt = new Date($scope.data.searchDateTo);
        }

        $scope.searchUserStatisticOfNewComers();
        $scope.searchUserStatisticLoyalPurchaseFrequency();
    };



    $scope.searchUserStatisticOfNewComers = function () {

        Util.delProperty($scope.data.searchOptions.query);

        Statistic.getUserStatisticOfNewComers($scope.data.searchOptions.query).then(function (result) {
            $scope.data.userStatisticOfNewComers = result.data;
            Notification.success({message: 'Search Success! ', delay: 8000});
        }).catch(function(err){
            console.log(err);
            Notification.error({message: "Search Failure! Status:" + err.status + " Reason: " + err.data.message , delay: 5000});
        });
    };

    $scope.searchUserStatisticLoyalPurchaseFrequency = function () {

        Util.delProperty($scope.data.searchOptions.query);

        Statistic.getUserStatisticLoyalPurchaseFrequency($scope.data.searchOptions.query).then(function (result) {
            $scope.data.userStatisticLoyalPurchaseFrequency = result.data;
            //Notification.success({message: 'Search Success! ', delay: 8000});
        }).catch(function(err){
            console.log(err);
            Notification.error({message: "Search Failure! Status:" + err.status + " Reason: " + err.data.message , delay: 5000});
        });

    };


    $scope.searchUserStatisticNewFirstOrderUserDaily = function (form, sortBy) {

        $scope.css.showTable = 'statNewFirstOrderUserDaily';
        $scope.css.searchUserStatisticSortBy = sortBy;


        if ($scope.data.searchDateTo !==''){
            $scope.data.searchOptions.query.createdAt = new Date($scope.data.searchDateTo);
        }

        Util.delProperty($scope.data.searchOptions.query);

        Statistic.getUserStatisticNewFirstOrderUserDaily($scope.data.searchOptions.query).then(function (result) {
            $scope.data.userStatisticNewFirstOrderUserDaily = result.data;

            $scope.data.userStatisticChartNewFirstOrderUserDaily = result.data;

            $scope.chartNewFirstOrderUserDaily.series = Util.chartDataFormat($scope.data.userStatisticChartNewFirstOrderUserDaily);
            $scope.chartNewFirstOrderUserDaily.xAxis.categories = Util.chartxAxisFormat($scope.data.userStatisticChartNewFirstOrderUserDaily);


            Notification.success({message: 'Search Success! ', delay: 8000});
        }).catch(function(err){
            console.log(err);
            Notification.error({message: "Search Failure! Status:" + err.status + " Reason: " + err.data.message , delay: 5000});
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

        UserAccountDetails.getList({query : {user : $stateParams.id}, sort : '-createdAt'}).then(function (resultUserAccountDetails) {
            $scope.data.userAccountDetails = resultUserAccountDetails;
            Notification.success({message: 'Search Success', delay: 8000});

        }).catch(function(err){
            Notification.error({message: "Search Failure! Status:" + err.status + " Reason: " + err.data.message , delay: 5000});
        });

    };


    $scope.showUserCoupons = function () {

        Coupons.getList({query : {user : $stateParams.id}, sort : '-createdAt'}).then(function (resultUserCoupons) {
            $scope.data.userCouponList = resultUserCoupons;
            Notification.success({message: 'Search Success', delay: 8000});

        }).catch(function(err){
            Notification.error({message: "Search Failure! Status:" + err.status + " Reason: " + err.data.message , delay: 5000});
        });

    };







}

