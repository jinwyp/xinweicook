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
            code : 'true',
            _id : ''

        },
        searchSort : {
            sort : '-createdAt'
        },

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
            usedTime : 0,
            usedCountLimitOfOneUser : 1

        }
    };

    $scope.css = {
        isAddNewStatus : true
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



    if ($state.current.data.type === 'list'){
        $scope.searchCoupon();
    }

    if ($state.current.data.type === 'update'){
        $scope.css.isAddNewStatus = false;

        Coupons.one($stateParams.id).get().then(function (resutlCoupon) {
            $scope.data.coupon = resutlCoupon;


        });
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
        //console.log (newCoupon);
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
