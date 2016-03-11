/**
 * Created by jinwyp on 7/22/15.
 */





angular
    .module('RDash')
    .controller('Order3rdController', ['$scope', '$timeout', '$state', '$stateParams', '$localStorage', 'Notification', 'Util', 'Users', 'Orders', 'Sales3rd', order3rdController ]);



function order3rdController($scope, $timeout, $state, $stateParams, $localStorage, Notification, Util, Users, Orders, Sales3rd) {

    $scope.data = {
        searchFilter : '',
        searchOptions : {
            sort : '-createdAt',
            skip : 0,
            limit : 200,

            query : {
                createdAt :'',
                status : '',
                orderNumber : '',
                _id : '',
                user : '',
                warehouse : '',
                isSplitOrder : '',
                isChildOrder : '',
                cookingType : '',
                clientFrom : '',
                deliveryDateType : '',
                couponFromChargeCode : '',
                statisticsReferrer : ''
            }
        },
        exportOrderIdList : [],


        datePickerIsOpenDateFrom : false,
        datePickerIsOpenDateTo : false,

        searchDateFrom : '',
        searchDateTo : '',

        "addressContactPerson" : '',
        "addressMobile" : '',


        orderListCount : 0,
        orderListCurrentPage : 1,
        orderListTotalPages : 1,
        orderListPagesArray : [],

        currentDeleteIndex : -1,
        currentDailySalesIndex : false,



        orderList : [],
        order : {},

        couriersList : [],
        currentCourier : {},

        orderStatusList : [
            {
                name : 'ALL',
                value : ''
            },
            {
                name : '未支付',
                value : 'not paid'
            },
            {
                name : '已支付',
                value : 'paid'
            },
            //{
            //    name : '已确认',
            //    value : 'confirmed'
            //},
            //{
            //    name : '菜品已制作完成',
            //    value : 'dish finished'
            //},
            //{
            //    name : '已打包',
            //    value : 'packaged'
            //},
            {
                name : '已发货',
                value : 'shipped'
            },
            {
                name : '已完成',
                value : 'finished'
            },
            {
                name : '已取消',
                value : 'canceled'
            }
        ],
        orderStatusListDetail : [

            {
                name : '未支付',
                value : 'not paid'
            },
            {
                name : '已支付',
                value : 'paid'
            },
            //{
            //    name : '已确认',
            //    value : 'confirmed'
            //},
            //{
            //    name : '菜品已制作完成',
            //    value : 'dish finished'
            //},
            //{
            //    name : '已打包',
            //    value : 'packaged'
            //},
            {
                name : '已发货',
                value : 'shipped'
            },
            {
                name : '已完成',
                value : 'finished'
            },
            {
                name : '已取消',
                value : 'canceled'
            }
        ],

        isSplitOrderList : [
            {
                name : 'ALL',
                value : ''
            },
            {
                name : '已拆分订单（即主订单）',
                value : 'true'
            },
            {
                name : '未拆分的订单（即需要处理发货的订单）',
                value : 'false'
            }
        ],

        isChildOrderList : [
            {
                name : 'ALL',
                value : ''
            },
            {
                name : '子订单',
                value : 'true'
            },
            {
                name : '非子订单（包括不需要拆单的正常订单和需要拆单的主订单）',
                value : 'false'
            }
        ],

        dishCookingTypeList : [
            {
                name : 'ALL',
                value : ''
            },
            {
                name : '食材包',
                value : 'ready to cook'
            },
            {
                name : '便当',
                value : 'ready to eat'
            }
        ],

        clientFromTypeList : [
            {
                name : 'ALL',
                value : ''
            },
            {
                name : 'PC版网站',
                value : 'website'
            },
            {
                name : '移动版网站',
                value : 'mobileweb'
            },
            {
                name : '微信公众平台',
                value : 'wechat'
            },
            {
                name : 'iOS 原生APP',
                value : 'ios'
            },
            {
                name : '安卓 原生APP',
                value : 'android'
            }
        ],

        deliveryDateTypeList : [
            {
                name : 'ALL',
                value : ''
            },
            {
                name : '当天配送',
                value : 'today'
            },
            {
                name : '第二天配送',
                value : 'tomorrow'
            }
        ],

        expressList : [
            {
                name : '顺丰外地',
                displayName : {
                    zh : '顺丰快递',
                    en : 'sf-express'
                },
                info :{
                    zh : '顺丰快递 国内最好的快递',
                    en : 'sf-express'
                }
            },
            {
                name : '顺丰当日',
                displayName : {
                    zh : '顺丰当日快递',
                    en : 'sf-sh'
                },
                info :{
                    zh : '顺丰当日快递 国内最好的快递',
                    en : 'sf-express'
                }
            },
            {
                name : '黑猫',
                displayName : {
                    zh : '黑猫快递',
                    en : '黑猫快递'
                },
                info :{
                    zh : '黑猫快递',
                    en : '黑猫快递'
                }
            },
            {
                name : '快速递',
                displayName : {
                    zh : '快速递',
                    en : '快速递'
                },
                info :{
                    zh : '快速递',
                    en : '快速递'
                }
            },
            {
                name : '趣活',
                displayName : {
                    zh : '趣活快递',
                    en : '趣活快递'
                },
                info :{
                    zh : '趣活快递',
                    en : '趣活快递'
                }
            },
            {
                name : '达达',
                displayName : {
                    zh : '达达快递',
                    en : '达达快递'
                },
                info :{
                    zh : '达达快递',
                    en : '达达快递'
                }
            }
        ],

        warehouseList : [
            {
                name : 'ALL',
                value : ''
            },
            {
                name : '新味办公室',
                value : '56332187594b09af6e6c7dd2'
            },
            {
                name : '漕河泾仓库',
                value : '56332196594b09af6e6c7dd7'
            },
            {
                name : '陆家嘴仓库',
                value : '564ab6de2bde80bd10a9bc60'
            },
            {
                name : '浦江镇仓库',
                value : '56c41a9e632771df68dbae0b'
            }
        ]
    };

    $scope.css = {
        isAddNewStatus : false,
        showTable : 'orders',
        searchOrderStatisticSortBy : '-date'
    };



    $scope.datePickerOptions = {
        maxDate: new Date(2060, 12, 30),
        minDate: new Date(2015,1,1),
        startingDay: 1
    };

    $scope.datePickerOpen = function(type) {
        if (type === 'datefrom'){
            $scope.data.datePickerIsOpenDateFrom = true;
        }else{
            $scope.data.datePickerIsOpenDateTo = true;
        }
    };





    $scope.searchOrderCount = function (){

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


        if($scope.data.addressMobile){
            $scope.data.searchOptions.query['address.mobile'] = $scope.data.addressMobile;
        }else{
            delete $scope.data.searchOptions.query['address.mobile']
        }


        if($scope.data.addressContactPerson){
            $scope.data.searchOptions.query['address.contactPerson'] = $scope.data.addressContactPerson;
        }else{
            delete $scope.data.searchOptions.query['address.contactPerson']
        }



        Util.delProperty($scope.data.searchOptions.query);

        $scope.data.searchOptions.count = true;

        Sales3rd.searchOrder(Util.formatParam($scope.data.searchOptions)).then(function (resultCount) {

            $scope.data.orderListCount = resultCount.data.count;
            $scope.data.orderListTotalPages = Math.ceil($scope.data.orderListCount / $scope.data.searchOptions.limit);

            $scope.data.orderListPagesArray= [];
            for (var i = 1; i <= $scope.data.orderListTotalPages; i++){
                $scope.data.orderListPagesArray.push( {value : i} )
            }

            $scope.searchOrder();

        });
    };


    $scope.searchOrder = function (form) {

        Util.delProperty($scope.data.searchOptions.query);
        $scope.data.searchOptions.count = false;

        Sales3rd.searchOrder(Util.formatParam($scope.data.searchOptions, true)).then(function (resultOrder) {
            console.log($scope.data.orderList);
            $scope.data.orderList = resultOrder.data;
            Notification.success({message: 'Search Success! ', delay: 4000});

        }).catch(function(err){
            Notification.error({message: "Search Failure! Status:" + err.status + " Reason: " + err.data.message , delay: 7000});
        });

    };



    $scope.changePagination = function (currentPageNo) {
        $scope.data.orderListCurrentPage = currentPageNo;
        $scope.data.searchOptions.skip = ($scope.data.orderListCurrentPage-1) * $scope.data.searchOptions.limit;
        $scope.searchOrder();
    };





    $scope.searchOrderCount();









    // toggle selection for a given fruit by name
    $scope.toggleOrderSelection = function toggleSelection(orderId) {
        var idx = $scope.data.exportOrderIdList.indexOf(orderId);

        // is currently selected
        if (idx > -1) {
            $scope.data.exportOrderIdList.splice(idx, 1);
        } else {
            // is newly selected
            $scope.data.exportOrderIdList.push(orderId);
        }

    };


    $scope.arrayToUrl = function (array) {
        return JSON.stringify(array)
    };













}


