/**
 * Created by jinwyp on 7/22/15.
 */





angular
    .module('RDash')
    .controller('CouponController', ['$scope', '$timeout', '$state', '$stateParams', 'Notification', 'Util', 'Coupons', couponController ]);



function couponController($scope, $timeout, $state, $stateParams, Notification, Util, Coupons) {

    $scope.data = {
        searchFilter : '',
        searchOptions : {
            skip : 0,
            limit : 1000,
            createdAt :'',
            usedTime : '',
            couponType : '!=coupon',
            _id : ''

        },
        searchSort : {
            sort : '-createdAt'
        },

        couponListCount : 0,
        couponListCurrentPage : 1,
        couponListTotalPages : 1,
        couponListPagesArray : [],

        currentDeleteIndex : -1,


        couponList : [],
        coupon : {
            name:{
                zh : '',
                en : ''
            },

            description:{
                zh : '',
                en : ''
            },
            couponType : 'promocode',
            price : 10,
            code : '',
            priceLimit : 10,
            usedTime : 1,
            usedCountLimitOfOneUser : 1,
            isUsed : false,
            user : ''

        }
    };

    $scope.css = {
        isAddNewStatus : true
    };



    $scope.searchOrderCount = function (){

        Util.delProperty($scope.data.searchOptions);

        Coupons.one('count').get($scope.data.searchOptions).then(function (resultCoupons) {

            $scope.data.couponListCount = resultCoupons.count;
            $scope.data.couponListTotalPages = Math.ceil(resultCoupons.count / $scope.data.searchOptions.limit);

            $scope.data.couponListPagesArray= [];
            for (var i = 1; i <= $scope.data.couponListTotalPages; i++){
                $scope.data.couponListPagesArray.push( {value : i} )
            }

            $scope.searchCoupon();

        });
    };

    $scope.searchCoupon = function (form) {
        Util.delProperty($scope.data.searchOptions);

        var options = angular.extend({}, $scope.data.searchOptions, $scope.data.searchSort);
        Coupons.getList(options).then(function (resultCoupon) {
            $scope.data.couponList = resultCoupon;
            Notification.success({message: 'Search Success! ', delay: 8000});

        }).catch(function(err){
            Notification.error({message: "Search Failure! Status:" + err.status + " Reason: " + err.data.message , delay: 5000});
        });

    };

    $scope.changePagination = function (currentPageNo) {
        $scope.data.couponListCurrentPage = currentPageNo;
        $scope.data.searchOptions.skip = ($scope.data.couponListCurrentPage-1) * $scope.data.searchOptions.limit;
        $scope.searchCoupon();
    };



    if ($state.current.data.type === 'list'){
        $scope.searchOrderCount();
    }

    if ($state.current.data.type === 'update'){
        $scope.css.isAddNewStatus = false;

        Coupons.one($stateParams.id).get().then(function (resutlCoupon) {
            $scope.data.coupon = resutlCoupon;


        });
    }

    if ($state.current.data.type === 'add'){

        if ($stateParams.userId) {
            $scope.data.coupon.user = $stateParams.userId;
            $scope.data.coupon.couponType = 'coupon';
        }

    }

    $scope.delCoupon = function (order) {

        var index = $scope.data.couponList.indexOf(order);

        $scope.data.couponList[index].remove().then(function (resultCoupon) {
            Coupons.getList().then(function (coupons) {
                $scope.data.couponList = coupons;
            });

            Notification.success({message : 'Delete Success', delay : 8000});

        }).catch(function (err) {
            Notification.error({
                message : "Delete Failure! Status:" + err.status + " Reason: " + err.data.message,
                delay   : 5000
            });
        });

    };


    $scope.addNewCoupon = function (form) {
        if (form.$invalid) {
            return;
        }

        var newCoupon = angular.copy($scope.data.coupon);
        Util.delProperty(newCoupon);
        Coupons.post(newCoupon).then(function (resultCoupon) {
            console.log(resultCoupon);
            Notification.success({message: 'Save Success', delay: 8000});

        }).catch(function(err){
            Notification.error({message: "Update Failure! Status:" + err.status + " Reason: " + err.data.message , delay: 5000});
        });
    };

    $scope.updateCoupon = function (form) {

        if (form.$invalid) {
            return;
        }

        $scope.data.coupon.put().then(function (resultCoupon) {
            console.log(resultCoupon);
            Notification.success({message: 'Update Success', delay: 8000});
        }).catch(function(err){
            console.log(err);
            Notification.error({message: "Update Failure! Status:" + err.status + " Reason: " + err.data.message , delay: 5000});
        });
    };


}
