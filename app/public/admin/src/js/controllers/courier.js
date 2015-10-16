/**
 * Created by jinwyp on 7/22/15.
 */





angular
    .module('RDash')
    .controller('CourierController', ['$scope', '$timeout', '$interval', '$state', '$stateParams', 'Notification', 'Util', 'Users', 'Couriers', 'Statistic', courierController]);


function courierController($scope, $timeout, $interval, $state, $stateParams, Notification, Util, Users, Couriers, Statistic) {

    $scope.data = {
        searchFilter : '',
        searchOptions : {
            skip : 0,
            createdAt :'',
            group : 'courier',
            lang : '',
            _id : '',
            mobile : ''
        },

        searchSort : {
            sort : '-modifiedAt'
        },



        userListCount : 0,
        userListCurrentPage : 1,
        userListTotalPages : 1,
        userListPagesArray : [],

        currentDeleteIndex : -1,

        userList     : [],
        couriersList     : [],
        user         : {
            username : '',
            email : '',
            mobile : '',
            pwd : '',
            fullName : '',
            gender : '',
            group : 'member'
        },


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
        searchUserSortBy : '-timeLeft'
    };




    var stopInterval;

    $scope.searchUserCount = function (){

        $scope.css.showTable = 'users';


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

        $interval.cancel(stopInterval);
        stopInterval = null;

    };

    $scope.searchUser = function (form) {

        Util.delProperty($scope.data.searchOptions);

        var options = angular.extend({}, $scope.data.searchOptions, $scope.data.searchSort);

        Users.getList(options).then(function (resultUsers) {
            $scope.data.userList = resultUsers;
            //Notification.success({message: 'Search Success! ', delay: 8000});

            Couriers.getList().then(function (resultCouriers) {
                $scope.data.couriersList = resultCouriers;

                var tempUser = {};

                angular.forEach($scope.data.couriersList, function(courier, courierIndex){
                    tempUser[courier.user] = courier
                });

                angular.forEach($scope.data.userList, function(user, userIndex){
                    user.geoLatitude = tempUser[user._id].geoLatitude;
                    user.geoLongitude = tempUser[user._id].geoLongitude;
                    user.distanceFrom = tempUser[user._id].distanceFrom;
                    user.isBack = tempUser[user._id].isBack;

                    if (tempUser[user._id].speed) {
                        user.speed = tempUser[user._id].speed;
                    }else{
                        user.speed = 20;  // 公里/小时
                    }

                    if (tempUser[user._id].timeLeft) {
                        user.timeLeft = tempUser[user._id].timeLeft;
                    }else{
                        user.timeLeft = user.distanceFrom / 1000 / user.speed * 60;
                    }

                });

                $scope.refreshBaiduMap();


            }).catch(function(err){
                Notification.error({message: "Search Failure! Status:" + err.status + " Reason: " + err.data.message , delay: 5000});
            });


        }).catch(function(err){
            Notification.error({message: "Search Failure! Status:" + err.status + " Reason: " + err.data.message , delay: 5000});
        });



    };

    $scope.changePagination = function (currentPageNo) {
        $scope.data.userListCurrentPage = currentPageNo;
        $scope.data.searchOptions.skip = ($scope.data.userListCurrentPage-1) * $scope.data.searchOptions.limit;
        $scope.searchUser();
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



    $scope.showBaiduMapInterval = function(){
        $scope.css.showTable = 'map';

        stopInterval = $interval(function() {

            $scope.searchUser();

        }, 20000);
    };




    var map = new BMap.Map("baidumapCourier");          // 创建地图实例

    var point = new BMap.Point(116.404, 39.915);  // 创建点坐标
    var pointXinWeiOffice = new BMap.Point( 121.467155, 31.195693);  // 创建点坐标 longitude 经度 / latitude 纬度

    map.centerAndZoom(pointXinWeiOffice, 16);                 // 初始化地图，设置中心点坐标和地图级别 . 如果center类型为Point时，zoom必须赋值，范围3-19级，若调用高清底图（针对移动端开发）时，zoom可赋值范围为3-18级。如果center类型为字符串时，比如“北京”，zoom可以忽略，地图将自动根据center适配最佳zoom级别。


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


        if (percentage === true){
            iconUrl = '/admin/src/img/marker20.png';
        }else{
            iconUrl = '/admin/src/img/marker100.png';
        }

        if (percentage == 100){
            iconUrl = '/admin/src/img/marker40.png';
        }

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





    $scope.refreshBaiduMap = function(){

        map.clearOverlays();

        addMarker(pointXinWeiOffice, '新味办公室', '地址:中山南二路510号3楼', 100);

        angular.forEach($scope.data.userList, function(user, userIndex){

            if (user.geoLongitude && user.geoLatitude){
                console.log(user.geoLongitude, user.geoLatitude , user.fullName);

                if (!user.fullName){
                    user.fullName = '暂无姓名';
                }

                var pointCourier = new BMap.Point( user.geoLongitude, user.geoLatitude);  // 创建点坐标 longitude 经度 / latitude 纬度

                var title = user.fullName + ' - ' + user.mobile + ' - ' + user.timeLeft + '分钟到';
                var content = '快递员: ' + user.fullName + ' ' + user.mobile + "<br/> 距离新味办公室: " + user.distanceFrom + '米' + "<br/> 还有几分钟到达: " + user.timeLeft + '分钟';

                addMarker(pointCourier, title, content, user.isBack);

            }

        });
    }


}

