/**
 * Created by jinwyp on 7/22/15.
 */





angular
    .module('RDash')
    .controller('WarehouseController', ['$scope', '$timeout', '$state', '$stateParams', 'Notification', 'Util', 'Warehouses', 'Statistic', warehouseController]);


function warehouseController($scope, $timeout, $state, $stateParams, Notification, Util, Warehouses, Statistic) {

    $scope.data = {
        searchFilter : '',
        searchOptions : {
            sort : '-sortId',
            skip : 0,
            limit : 200,

            query : {
                name :'',
                isActivated : ''
            }

        },

        warehouseListCount : 0,
        warehouseListCurrentPage : 1,
        warehouseListTotalPages : 1,
        warehouseListPagesArray : [],

        currentDeleteIndex : -1,

        warehouseList     : [],
        warehouse         : {
            name : '',
            displayName : {
                zh : '',
                en : ''
            },
            address : '',
            deliveryRange : 1000, //米
            sortId : 0, //排序
            isActivated : false,

            locationGeoLatitude : 0,
            locationGeoLongitude : 0
        },

        warehouseIsActivatedTypeList: [
            {
                name : 'ALL',
                value : ''
            },

            {
                name : '已启用',
                value : 'true'
            },

            {
                name : '未启用',
                value : 'false'
            },

        ]


    };

    $scope.css = {
        isAddNewStatus : true
    };




    $scope.searchWarehouse = function (form) {
        Util.delProperty($scope.data.searchOptions.query);

        Warehouses.getList(Util.formatParam($scope.data.searchOptions, true)).then(function (resultWarehouses) {
            $scope.data.warehouseList = resultWarehouses;
            Notification.success({message: 'Search Success! ', delay: 4000});

        }).catch(function(err){
            Notification.error({message: "Search Failure! Status:" + err.status + " Reason: " + err.data.message , delay: 7000});
        });

    };

    $scope.delWarehouse = function (warehouse) {

        var index = $scope.data.warehouseList.indexOf(warehouse);

        $scope.data.warehouseList[index].remove().then(function (resultWarehouse) {
            $scope.searchWarehouse();

            Notification.success({message : 'Delete Success', delay : 4000});

        }).catch(function (err) {
            Notification.error({ message : "Delete Failure! Status:" + err.status + " Reason: " + err.data.message,  delay   : 7000});
        });

    };







    $scope.updateWarehouse = function (form) {
        if (form.$invalid) {
            return;
        }

        $scope.data.warehouse.put().then(function (resultWarehouse) {
            Notification.success({message : 'Update Success', delay : 4000});
        }).catch(function (err) {
            Notification.error({ message : "Update Failure! Status:" + err.status + " Reason: " + err.data.message, delay   : 7000 });
        });
    };



    $scope.addNewWarehouse = function (form) {
        if (form.$invalid) {
            return;
        }

        var newWarehouse = angular.copy($scope.data.warehouse);

        Warehouses.post(newWarehouse).then(function (resultWarehouse) {
            console.log(resultWarehouse);
            Notification.success({message : 'Save Success', delay : 4000});

        }).catch(function (err) {
            Notification.error({ message : "Added Failure! Status:" + err.status + " Reason: " + err.data.message, delay   : 7000 });
        });
    };





    $scope.showBaiduMap = function (array) {

        var map = new BMap.Map("baidumap_warehouse");          // 创建地图实例

        var point = new BMap.Point(116.404, 39.915);  // 创建点坐标
        var pointXinWeiOffice = new BMap.Point( 121.467155, 31.195693);  // 创建点坐标 longitude 经度 / latitude 纬度
        var pointXinWeiCaohejing = new BMap.Point( 121.40523, 31.175474);  // 创建点坐标 longitude 经度 / latitude 纬度  //经度 ( 121.4051452465212 ) / 纬度 ( 31.17546886907618 )
        var pointXinWeiLujiazui = new BMap.Point( 121.527943, 31.243494);

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
        addMarker(pointXinWeiLujiazui, '新味陆家嘴仓库', '地址:东方路227号', 100);


        var polygonPointList = [
            {
                "sortId" : "0",
                "title"  : "浦电路崂山路",

                "longitude" : "121.53231",
                "latitude"  : "31.225758"

            },
            {
                "sortId" : "1",
                "title"  : "浦电路福山路",

                "longitude" : "121.538858",
                "latitude"  : "31.22802"

            },
            {
                "sortId" : "2",
                "title"  : "世纪大道1666号",

                "longitude" : "121.543188",
                "latitude"  : "31.229294"

            },
            {
                "sortId" : "3",
                "title"  : "松林路浦电路",

                "longitude" : "121.542925",
                "latitude"  : "31.231473"

            },
            {
                "sortId" : "4",
                "title"  : "源深路浦电路",

                "longitude" : "121.544073",
                "latitude"  : "31.231953"

            },
            {
                "sortId" : "5",
                "title"  : "浦东大道源深路",

                "longitude" : "121.535898",
                "latitude"  : "31.246866"

            },
            {
                "sortId" : "6",
                "title"  : "昌邑路源深路",

                "longitude" : "121.534522",
                "latitude"  : "31.248631"

            },
            {
                "sortId" : "7",
                "title"  : "滨江大道源深路",

                "longitude" : "121.533805",
                "latitude"  : "31.249664"

            },
            {
                "sortId" : "8",
                "title"  : "黄浦江点1",

                "longitude" : "121.533457",
                "latitude"  : "31.25224"

            },
            {
                "sortId" : "9",
                "title"  : "黄浦江点2",

                "longitude" : "121.5125",
                "latitude"  : "31.251923"

            },
            {
                "sortId" : "10",
                "title"  : "黄浦江点3",

                "longitude" : "121.499546",
                "latitude"  : "31.245702"

            },
            {
                "sortId" : "11",
                "title"  : "黄浦江点4",

                "longitude" : "121.501924",
                "latitude"  : "31.23934"

            },
            {
                "sortId" : "12",
                "title"  : "黄浦江点5",

                "longitude" : "121.511303",
                "latitude"  : "31.231899"

            },
            {
                "sortId" : "13",
                "title"  : "黄浦江点6",

                "longitude" : "121.517663",
                "latitude"  : "31.221801"
            }
        ];

        angular.forEach(polygonPointList, function(address, addressIndex){

                console.log("陆家嘴多边形点:", addressIndex, address.longitude, address.latitude);

                var pointOrder = new BMap.Point( address.longitude, address.latitude);  // 创建点坐标 longitude 经度 / latitude 纬度

                var title =  address.title + ' / ' + address.sortId;
                var content = '地址: ' ;
                addMarker(pointOrder, title, content, 3);
        });


    };



    if ($state.current.data.type === 'list') {

        $scope.searchWarehouse();
        $scope.showBaiduMap();
    }


    if ($state.current.data.type === 'update') {
        $scope.css.isAddNewStatus = false;

        Warehouses.one($stateParams.id).get().then(function (resultWarehouse) {
            $scope.data.warehouse = resultWarehouse;

        });

    }


}

