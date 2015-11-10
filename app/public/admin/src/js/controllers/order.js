/**
 * Created by jinwyp on 7/22/15.
 */





angular
    .module('RDash')
    .controller('OrderController', ['$scope', '$timeout', '$state', '$stateParams', '$localStorage', 'Notification', 'Util', 'Users', 'Orders', 'Statistic', orderController ]);



function orderController($scope, $timeout, $state, $stateParams, $localStorage, Notification, Util, Users, Orders, Statistic) {

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
                deliveryDateType : ''
            }
        },
        exportOrderIdList : [],


        datePickerIsOpen : false,

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



        orderStatisticByAddressList : [],
        orderStatisticByAddressListAuto : [],
        orderStatisticByDailySalesList : [],
        orderStatisticChartByDaily : [],

        orderStatisticByHourSalesList : [],
        orderStatisticChartByHour : [],


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
            {
                name : '已确认',
                value : 'confirmed'
            },
            {
                name : '菜品已制作完成',
                value : 'dish finished'
            },
            {
                name : '已打包',
                value : 'packaged'
            },
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
            }
        ],
    };

    $scope.css = {
        isAddNewStatus : false,
        showTable : 'orders',
        searchOrderStatisticSortBy : '-date'
    };



    $scope.chartDaily = {
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
            text: '订单每日总金额'
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
                text: '总金额'
            }
        },
        loading: false,
        size: {}
    };


    $scope.chartHour = {
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
            text: '订单每小时总金额'
        },
        credits: {
            enabled: true
        },

        xAxis: {
            title: {
                text: '小时'
            },
            categories: []
            //labels: {
            //    enabled: i === 0
            //}
        },
        yAxis : {
            title: {
                text: '总金额'
            }
        },
        loading: false,
        size: {}
    };


    $scope.datePickerOpen = function($event) {
        $scope.data.datePickerIsOpen = true;
    };





    $scope.searchOrderCount = function (){
        $scope.css.showTable = 'orders';

        if ($scope.data.searchDateFrom){
            //console.log (new Date($scope.data.searchDateFrom));
            $scope.data.searchOptions.query.createdAt = '>=' + new Date($scope.data.searchDateFrom);
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

        Orders.one('count').get(Util.formatParam($scope.data.searchOptions)).then(function (orders) {


            $localStorage.orderSearchOptions = {

                status : $scope.data.searchOptions.query.status,
                isSplitOrder : $scope.data.searchOptions.query.isSplitOrder,
                isChildOrder : $scope.data.searchOptions.query.isChildOrder,
                cookingType : $scope.data.searchOptions.query.cookingType,
                clientFrom : $scope.data.searchOptions.query.clientFrom,
                deliveryDateType : $scope.data.searchOptions.query.deliveryDateType
            };




            $scope.data.orderListCount = orders.count;
            $scope.data.orderListTotalPages = Math.ceil(orders.count / $scope.data.searchOptions.limit);

            $scope.data.orderListPagesArray= [];
            for (var i = 1; i <= $scope.data.orderListTotalPages; i++){
                $scope.data.orderListPagesArray.push( {value : i} )
            }

            $scope.searchOrder();

        });
    };


    $scope.searchOrder = function (form) {

        Util.delProperty($scope.data.searchOptions.query);

        Orders.getList(Util.formatParam($scope.data.searchOptions, true)).then(function (resultOrder) {
            $scope.data.orderList = resultOrder;
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

    $scope.delOrder = function (order) {

        var index = $scope.data.orderList.indexOf(order);

        $scope.data.orderList[index].remove().then(function (resultOrder) {
            $scope.searchOrderCount();

            Notification.success({message : 'Delete Success', delay : 4000});

        }).catch(function (err) {
            Notification.error({
                message : "Delete Failure! Status:" + err.status + " Reason: " + err.data.message,
                delay   : 7000
            });
        });

    };


    $scope.getOrderById = function () {
        $scope.css.isAddNewStatus = false;

        Orders.one($stateParams.id).get().then(function (resutlOrder) {
            $scope.data.order = resutlOrder;

            // 不能重复取消订单
            $scope.data.order.currentOrderStatus = $scope.data.order.status;

            //编辑order时， 处理order express 显示
            if (angular.isUndefined($scope.data.order.express)){
                $scope.data.order.express = {
                    name : '',
                    displayName : {
                        zh : '',
                        en : ''
                    },
                    info :{
                        zh : '',
                        en : ''
                    },
                    number : ''
                }
            }


            //编辑order时， 处理order dishList 菜品详情 显示
            if (angular.isArray($scope.data.order.dishList) && angular.isArray($scope.data.order.dishHistory) ){
                $scope.data.order.dishListHash = {};

                angular.forEach($scope.data.order.dishHistory, function(dish, dishIndex){
                    $scope.data.order.dishListHash[dish.dish._id] = dish
                });
                angular.forEach($scope.data.order.dishList, function(dish, dishIndex){
                    dish.detail = $scope.data.order.dishListHash[dish.dish];

                    if (angular.isArray(dish.subDish) ){
                        angular.forEach(dish.subDish, function(subDish, subDishIndex) {
                            subDish.detail = $scope.data.order.dishListHash[subDish.dish]
                        })
                    }

                });
            }

        });
    };


    if ($state.current.data.type === 'list'){
        if ($localStorage.orderSearchOptions){
            $scope.data.searchOptions.query = $localStorage.orderSearchOptions;
        }

        //if ($scope.data.searchOptions.query.createdAt){
        //    if ($scope.data.searchOptions.query.createdAt.toString().indexOf('>') > -1){
        //        $scope.data.searchDateFrom = $scope.data.searchOptions.query.createdAt.substring(2);
        //    }else{
        //        $scope.data.searchDateFrom = $scope.data.searchOptions.query.createdAt;
        //    }
        //
        //}else{
        //    $scope.data.searchDateFrom = '';
        //}

        $scope.searchOrderCount();

    }

    if ($state.current.data.type === 'update'){
        $scope.getOrderById();


        Users.getList({query : {group : 'courier'}}).then(function (resultUsers) {
            $scope.data.couriersList = resultUsers;
        }).catch(function(err){
            Notification.error({message: "Search Failure! Status:" + err.status + " Reason: " + err.data.message , delay: 7000});
        });

    }
    $scope.updateOrder = function (form) {
        if (form.$invalid) {
            return;
        }

        $scope.data.order.put().then(function (resultOrder) {
            console.log(resultOrder);
            Notification.success({message: 'Update Success! ', delay: 4000});
        }).catch(function(err){
            console.log(err);
            Notification.error({message: "Update Failure! Status:" + err.status + " Reason: " + err.data.message , delay: 7000});
        });
    };

    $scope.updateOrderCourier = function () {
        $scope.data.order.expressPersonId = $scope.data.currentCourier._id;
        $scope.data.order.expressPersonName = $scope.data.currentCourier.fullName;
        $scope.data.order.expressPersonMobile = $scope.data.currentCourier.mobile;

        //$scope.data.order.put().then(function (resultOrder) {
        //    console.log(resultOrder);
        //    Notification.success({message: 'Update Success! ', delay: 4000});
        //}).catch(function(err){
        //    console.log(err);
        //    Notification.error({message: "Update Failure! Status:" + err.status + " Reason: " + err.data.message , delay: 7000});
        //});
    };



    $scope.createOrderDeliveryKSuDi = function (form) {
        if (form.$invalid) {
            return;
        }

        Statistic.createOrderDeliveryKSuDi($scope.data.order._id).then(function (result) {
            console.log(result);
            $scope.data.order.expressStatus = 'waitForConfirm';
            Notification.success({message: 'Update Success! ', delay: 4000});
        }).catch(function(err){
            console.log(err);
            Notification.error({message: "Update Failure! Status:" + err.status + " Reason: " + err.data.message , delay: 7000});
        });
    };

    $scope.searchOrderDeliveryKSuDi = function (form) {
        if (form.$invalid) {
            return;
        }

        Statistic.searchOrderDeliveryKSuDi($scope.data.order._id).then(function (result) {
            console.log(result);
            $scope.getOrderById();
            Notification.success({message: 'Update Success! ', delay: 4000});
        }).catch(function(err){
            console.log(err);
            Notification.error({message: "Update Failure! Status:" + err.status + " Reason: " + err.data.message , delay: 7000});
        });
    };


    $scope.clickExpressRadio = function (express) {
        $scope.data.order.express.name = express.name;
        $scope.data.order.express.displayName = express.displayName;
        $scope.data.order.express.info = express.info;
    };















    $scope.searchOrderStatisticByAddress = function () {
        $scope.css.showTable = 'statisticByAddress';

        if ($scope.data.searchDateFrom !==''){
            $scope.data.searchOptions.query.createdAt = new Date($scope.data.searchDateFrom);
        }


        Util.delProperty($scope.data.searchOptions.query);

        Statistic.getOrderStatisticByAddress($scope.data.searchOptions.query).then(function (resultOrder) {
            $scope.data.orderStatisticByAddressList = resultOrder.data;
            Notification.success({message: 'Search Success! ', delay: 4000});
        }).catch(function(err){
            console.log(err);
            Notification.error({message: "Search Failure! Status:" + err.status + " Reason: " + err.data.message , delay: 7000});
        });
    };


    $scope.searchOrderStatisticByAddressAuto = function () {
        $scope.css.showTable = 'statisticByAddressAuto';

        if ($scope.data.searchDateFrom !==''){
            $scope.data.searchOptions.query.createdAt = new Date($scope.data.searchDateFrom);
        }

        Util.delProperty($scope.data.searchOptions.query);

        Statistic.getOrderStatisticByAddressAuto($scope.data.searchOptions.query).then(function (resultOrder) {
            $scope.data.orderStatisticByAddressListAuto = resultOrder.data;

            $scope.showBaiduMap();

            Notification.success({message: 'Search Success! ', delay: 4000});
        }).catch(function(err){
            console.log(err);
            Notification.error({message: "Search Failure! Status:" + err.status + " Reason: " + err.data.message , delay: 7000});
        });
    };


    $scope.searchOrderStatisticByDailySales = function (form, sortBy) {
        $scope.css.showTable = 'statisticByDailySales';
        $scope.css.searchOrderStatisticSortBy = sortBy;

        if ($scope.data.searchDateFrom !==''){
            $scope.data.searchOptions.query.createdAt = new Date($scope.data.searchDateFrom);
        }


        Util.delProperty($scope.data.searchOptions.query);

        Statistic.getOrderStatisticByDailySales($scope.data.searchOptions.query).then(function (resultOrder) {
            $scope.data.orderStatisticByDailySalesList = resultOrder.data;

            $scope.data.orderStatisticChartByDaily = resultOrder.data;

            $scope.chartDaily.series = Util.chartDataFormat($scope.data.orderStatisticChartByDaily);
            $scope.chartDaily.xAxis.categories = Util.chartxAxisFormat($scope.data.orderStatisticChartByDaily);

            Notification.success({message: 'Search Success! ', delay: 4000});
        }).catch(function(err){
            console.log(err);
            Notification.error({message: "Search Failure! Status:" + err.status + " Reason: " + err.data.message , delay: 7000});
        });

    };



    $scope.searchOrderStatisticByHourSales = function (form, sortBy) {
        $scope.css.showTable = 'statisticByHourSales';
        $scope.css.searchOrderStatisticSortBy = sortBy;

        if ($scope.data.searchDateFrom !==''){
            $scope.data.searchOptions.query.createdAt = new Date($scope.data.searchDateFrom);
        }


        Util.delProperty($scope.data.searchOptions.query);

        Statistic.getOrderStatisticByHourSales($scope.data.searchOptions.query).then(function (resultOrder) {
            $scope.data.orderStatisticByHourSalesList = resultOrder.data;

            $scope.data.orderStatisticChartByHour = resultOrder.data;

            $scope.chartHour.series = Util.chartDataFormat($scope.data.orderStatisticChartByHour);
            $scope.chartHour.xAxis.categories = Util.chartxAxisFormat($scope.data.orderStatisticChartByHour);

            Notification.success({message: 'Search Success! ', delay: 4000});
        }).catch(function(err){
            console.log(err);
            Notification.error({message: "Search Failure! Status:" + err.status + " Reason: " + err.data.message , delay: 7000});
        });

    };



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


    $scope.sendOrderSMS = function (smsType) {

        var postData = {
            orderId : $scope.data.order._id,
            type : smsType
        };

        if(smsType === 'orderShipped2' && ($scope.data.order.express.name == '' || $scope.data.order.express.number == '') ){
            Notification.error({message: "快递名称 和 快递单号 未填写!! 填写后请先保存订单.", delay: 7000});
        }else{
            Statistic.orderSendSMS(postData).then(function (result) {

                Notification.success({message: 'Search Success! ', delay: 4000});
            }).catch(function(err){
                console.log(err);
                Notification.error({message: "Search Failure! Status:" + err.status + " Reason: " + err.data.message , delay: 7000});
            });
        }


    };











    $scope.showBaiduMap = function (array) {

        $scope.css.showTable = 'statisticByAddressAuto';
        var map = new BMap.Map("baidumap");          // 创建地图实例

        var point = new BMap.Point(116.404, 39.915);  // 创建点坐标
        var pointXinWeiOffice = new BMap.Point( 121.467155, 31.195693);  // 创建点坐标 longitude 经度 / latitude 纬度
        var pointXinWeiCaohejing = new BMap.Point( 121.40523, 31.175474);  // 创建点坐标 longitude 经度 / latitude 纬度  //经度 ( 121.4051452465212 ) / 纬度 ( 31.17546886907618 )

        map.centerAndZoom(pointXinWeiOffice, 15);                 // 初始化地图，设置中心点坐标和地图级别 . 如果center类型为Point时，zoom必须赋值，范围3-19级，若调用高清底图（针对移动端开发）时，zoom可赋值范围为3-18级。如果center类型为字符串时，比如“北京”，zoom可以忽略，地图将自动根据center适配最佳zoom级别。


        map.addControl(new BMap.NavigationControl());   // 平移缩放控件
        map.addControl(new BMap.ScaleControl());   // 比例尺控件
        map.addControl(new BMap.OverviewMapControl()); // 缩略图控件

        map.addControl(new BMap.MapTypeControl());
        map.setCurrentCity("上海"); // 仅当设置城市信息时，MapTypeControl的切换功能才能可用



        // 覆盖物
        //var marker = new BMap.Marker(pointXinWeiOffice);        // 创建标注
        //map.addOverlay(marker);                     // 将标注添加到地图中



        // 创建图标对象
        function addMarker(point, title, content, percentage){


            var iconUrl = '';

            if (percentage >= 2){
                iconUrl = '/admin/src/img/marker100.png';
            }else if (percentage >= 1.5){
                iconUrl = '/admin/src/img/marker80.png';
            }else if (percentage >= 1.1){
                iconUrl = '/admin/src/img/marker70.png';
            }else if (percentage >= 0.8){
                iconUrl = '/admin/src/img/marker60.png';
            }else if (percentage >= 0.6){
                iconUrl = '/admin/src/img/marker40.png';
            }else if (percentage >= 0.4){
                iconUrl = '/admin/src/img/marker30.png';
            }else{
                iconUrl = '/admin/src/img/marker20.png';
            }

            if (percentage === 100){
                iconUrl = '/admin/src/img/marker_home.png';
            }

            if (percentage > 0.2){

                var myIcon = new BMap.Icon(iconUrl, new BMap.Size(25, 30), {

                    anchor: new BMap.Size(25, 30), //图标的定位点相对于图标左上角的偏移值。 角各偏移10像素和25像素。您可以看到在本例中该位置即是。  图标中央下端的尖角位置。

                    imageOffset: new BMap.Size(0, 0),   // 设置图片偏移 当您需要从一幅较大的图片中截取某部分作为标注图标时，您需要指定大图的偏移位置，此做法与css sprites技术类似。
                    imageSize : new BMap.Size(25, 30)   //设置图片缩放 图标所用的图片的大小，此功能的作用等同于CSS中的background-size属性。可用于实现高清屏的高清效果。
                });


                // 创建标注对象并添加到地图
                var marker = new BMap.Marker(point, {icon: myIcon, title:title});


                marker.addEventListener("click", function(event){
                    console.log(event.target);
                    console.log(event.target.getTitle());

                    var pointInfoWindows = new BMap.Point(event.target.getPosition().lng, event.target.getPosition().lat);

                    var infoWindowOpts = {
                        width : 300,     // 信息窗口宽度
                        height: 100,     // 信息窗口高度
                        title : title  // 信息窗口标题
                    };

                    var infoWindow = new BMap.InfoWindow(content, infoWindowOpts);  // 创建信息窗口对象 窗口内容

                    marker.openInfoWindow(infoWindow, pointInfoWindows);      // 打开信息窗口
                });

                map.addOverlay(marker);
            }

        }

        addMarker(pointXinWeiOffice, '新味办公室', '地址:中山南二路510号3楼', 100);
        addMarker(pointXinWeiCaohejing, '新味漕河泾仓库', '地址:虹梅路2008号红梅大楼', 100);




        angular.forEach($scope.data.orderStatisticByAddressListAuto, function(address, addressIndex){

            if (address.orderList[0].addressLongitude && address.orderList[0].addressLatitude){
                console.log(address.orderList[0].addressLongitude, address.orderList[0].addressLatitude);

                var pointOrder = new BMap.Point( address.orderList[0].addressLongitude, address.orderList[0].addressLatitude);  // 创建点坐标 longitude 经度 / latitude 纬度

                var title =  address.saleTotalPrice.toFixed(0) + '元/' + (address.totalPricePercent * 100).toFixed(1) + '% - ' + address.orderList[0].addressAddress + ' - ' + address.orderList[0].addressContactPerson + ' ' + address.orderList[0].addressContactMobile;
                var content = '地址: ' + address.orderList[0].addressStreet + " " + address.orderList[0].addressAddress + "<br/> 联系人: " + address.orderList[0].addressContactPerson + ' ' + address.orderList[0].addressContactMobile + "<br/> 订单号: " + address.orderList[0].orderNumber + "<br/> 该地址销售额: " + address.saleTotalPrice.toFixed(0) + '/' + (address.totalPricePercent * 100).toFixed(1) + '%' ;
                addMarker(pointOrder, title, content, address.totalPricePercent*100);

            }

        });



    };





}


