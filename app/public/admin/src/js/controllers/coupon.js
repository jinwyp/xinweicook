/**
 * Created by jinwyp on 7/22/15.
 */





angular
    .module('RDash')
    .controller('CouponController', ['$scope', '$timeout', '$state', '$stateParams', 'Notification', 'Coupons', couponController ]);



function couponController($scope, $timeout, $state, $stateParams, Notification, Coupons) {

    $scope.data = {
        searchFilter : '',
        couponList : [],
        coupon : {
            name:{
                zh : '',
                en : ''
            },
            group : {
                zh : '',
                en : ''
            },
            isFilter : false
        },

        couponGroup : [
            {
                zh : '菜系',
                en : 'Dishes system'
            },
            {
                zh : '食材',
                en : 'Ingredients'
            },
            {
                zh : '场景',
                en : 'Occasion'
            },
            {
                zh : '推荐促销',
                en : 'Promotion'
            }
        ]
    };

    $scope.css = {
        isAddNewStatus : true
    };

    if ($state.current.data.type === 'list'){
        Coupons.getList().then(function (coupons) {
            $scope.data.couponList = coupons;
        });
    }

    if ($state.current.data.type === 'update'){
        $scope.css.isAddNewStatus = false;

        Coupons.one($stateParams.id).get().then(function (resutlCoupon) {
            $scope.data.coupon = resutlCoupon;


        });
    }


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
