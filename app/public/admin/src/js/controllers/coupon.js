/**
 * Created by jinwyp on 7/22/15.
 */





angular
    .module('RDash')
    .controller('CouponController', ['$scope', '$timeout', '$state', '$stateParams', 'Notification', 'Util', 'Coupons', 'Statistic', couponController ]);



function couponController($scope, $timeout, $state, $stateParams, Notification, Util, Coupons, Statistic) {

    $scope.data = {
        searchFilter : '',
        searchOptions : {
            sort : '-createdAt',

            skip : 0,
            limit : 200,
            query : {
                usedTime : '',
                isUsedCount : '',
                isUsed : '',
                couponType : '',
                _id : '',
                user : '',
                fromCoupon : '',
                code : '',
                createdAt: ''
            }

        },

        datePickerIsOpenStart : false,
        datePickerIsOpenEnd : false,

        datePickerForSearchIsOpenDateFrom : false,
        datePickerForSearchIsOpenDateTo : false,

        searchDateFrom : '',
        searchDateTo : '',

        couponListCount : 0,
        couponListCurrentPage : 1,
        couponListTotalPages : 1,
        couponListPagesArray : [],

        currentDeleteIndex : -1,

        couponStatisticByName : [],

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
            priceLimit : 50,
            usedTime : 1,
            usedCountLimitOfOneUser : 1,
            isUsed : false,
            user : '',

            startDate : '',
            endDate : ''

        }
    };

    $scope.css = {
        isAddNewStatus : true,
        showTable : 'coupons'
    };


    $scope.datePickerOptions = {
        maxDate: new Date(2060, 12, 30),
        minDate: new Date(2015,1,1),
        startingDay: 1
    };

    $scope.datePickerForSearchOpen = function (type) {
        if (type === 'datefrom'){
            $scope.data.datePickerForSearchIsOpenDateFrom = true;
        }else{
            $scope.data.datePickerForSearchIsOpenDateTo = true;
        }
    };

    $scope.datePickerOpen = function(isStart, $event) {

        if (isStart === 'start'){
            $scope.data.datePickerIsOpenStart = true;
        }else{
            $scope.data.datePickerIsOpenEnd = true;
        }
    };





    $scope.searchCouponCount = function (){

        $scope.css.showTable = 'coupons';

        if ($scope.data.searchDateFrom || $scope.data.searchDateTo){

            $scope.data.searchOptions.query.createdAt = {};

            if ($scope.data.searchDateFrom) {
                $scope.data.searchOptions.query.createdAt['$gte'] = new Date($scope.data.searchDateFrom)
            }
            if ($scope.data.searchDateTo) {
                $scope.data.searchOptions.query.createdAt['$lte'] = new Date($scope.data.searchDateTo)
            }

        }else{
            $scope.data.searchOptions.query.createdAt = '';
        }

        Util.delProperty($scope.data.searchOptions.query);

        Coupons.one('count').get(Util.formatParam($scope.data.searchOptions)).then(function (resultCoupons) {

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
        Util.delProperty($scope.data.searchOptions.query);

        Coupons.getList(Util.formatParam($scope.data.searchOptions, true)).then(function (resultCoupon) {
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




    $scope.searchCouponStatisticByName = function () {

        $scope.css.showTable = 'statisticByName';

        Util.delProperty($scope.data.searchOptions.query);

        Statistic.getUserStatisticCouponByName($scope.data.searchOptions.query).then(function (resultCoupon) {
            $scope.data.couponStatisticByName = resultCoupon.data;

            //Notification.success({message: 'Search Success! ', delay: 4000});
        }).catch(function(err){
            console.log(err);
            Notification.error({message: "Search Failure! Status:" + err.status + " Reason: " + err.data.message , delay: 7000});
        });
    };



    if ($state.current.data.type === 'list'){
        $scope.searchCouponCount();
    }

    if ($state.current.data.type === 'update'){
        $scope.css.isAddNewStatus = false;

        Coupons.one($stateParams.id).get().then(function (resutlCoupon) {
            $scope.data.coupon = resutlCoupon;
            if(typeof $scope.data.coupon.couponType === 'undefined'){
                $scope.data.coupon.couponType = 'promocode'
            }
            $scope.data.coupon.startDate = new Date($scope.data.coupon.startDate);
            $scope.data.coupon.endDate = new Date($scope.data.coupon.endDate);
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
            $scope.searchCouponCount();

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
            Notification.success({message: 'Update Success', delay: 8000});
        }).catch(function(err){
            console.log(err);
            Notification.error({message: "Update Failure! Status:" + err.status + " Reason: " + err.data.message , delay: 5000});
        });
    };







}
