/**
 * Created by jinwyp on 7/22/15.
 */





angular
    .module('RDash')
    .controller('UserAccountDetailController', ['$scope', '$timeout', '$state', '$stateParams', 'Notification', 'Util', 'Users', 'UserAccounts', 'UserAccountDetails', 'PaymentDetails', userAccountDetailController]);


function userAccountDetailController($scope, $timeout, $state, $stateParams, Notification, Util, Users, UserAccounts, UserAccountDetails, PaymentDetails) {

    $scope.data = {
        searchFilter : '',
        searchOptions : {
            sort : '-createdAt',
            skip : 0,
            limit : 200,

            query : {
                isPlus : '',
                isPaid : '',
                chargeType : '',
                user : '',
                order : ''
            }

        },


        accountDetailListCount       : 0,
        accountDetailListCurrentPage : 1,
        accountDetailListTotalPages  : 1,
        accountDetailListPagesArray  : [],

        currentDeleteIndex : -1,


        accountDetailList    : [],
        accountPaymentDetail : [],

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
                name : '支付宝在线充值',
                value : 'alipaydirect'
            },
            {
                name : '微信支付在线充值',
                value : 'weixinpay'
            }
        ],

        isPaidTypeList : [
            {
                name : 'ALL',
                value : ''
            },
            {
                name : '完成支付',
                value : 'true'
            },
            {
                name : '未完成支付',
                value : 'false'
            }
        ]

    };

    $scope.css = {
        isAddNewStatus : true
    };



    $scope.searchAccountDetailCount = function (){
        Util.delProperty($scope.data.searchOptions.query);

        UserAccountDetails.one('count').get(Util.formatParam($scope.data.searchOptions)).then(function (accountDetailResult) {
            $scope.data.accountDetailListCount = accountDetailResult.count;
            $scope.data.accountDetailListTotalPages = Math.ceil(accountDetailResult.count / $scope.data.searchOptions.limit);

            $scope.data.accountDetailListPagesArray= [];
            for (var i = 1; i <= $scope.data.accountDetailListTotalPages; i++){
                $scope.data.accountDetailListPagesArray.push( {value : i} )
            }

            $scope.searchAccountDetail();

        });
    };

    $scope.searchAccountDetail = function (form) {
        Util.delProperty($scope.data.searchOptions.query);

        UserAccountDetails.getList(Util.formatParam($scope.data.searchOptions, true)).then(function (result) {
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



    $scope.showAccountPayment = function(accountdetailId){

        $scope.data.currentDeleteIndex = accountdetailId;

        PaymentDetails.getList( {query : {accountDetail:"55ff96483c0b47cb3ef98fee"}}).then(function (result) {
            console.log(result);
            $scope.data.accountPaymentDetail = result;

            Notification.success({message: 'Search Success! ', delay: 8000});

        }).catch(function(err){
            Notification.error({message: "Search Failure! Status:" + err.status + " Reason: " + err.data.message , delay: 5000});
        });
    };



}

