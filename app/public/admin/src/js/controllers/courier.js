/**
 * Created by jinwyp on 7/22/15.
 */





angular
    .module('RDash')
    .controller('CourierController', ['$scope', '$timeout', '$state', '$stateParams', 'Notification', 'Util', 'Users', 'Couriers', 'Statistic', courierController]);


function courierController($scope, $timeout, $state, $stateParams, Notification, Util, Users, Couriers, Statistic) {

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
    };

    $scope.searchUser = function (form) {
        Util.delProperty($scope.data.searchOptions);

        var options = angular.extend({}, $scope.data.searchOptions, $scope.data.searchSort);

        Users.getList(options).then(function (resultUsers) {
            $scope.data.userList = resultUsers;
            Notification.success({message: 'Search Success! ', delay: 8000});

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








}

