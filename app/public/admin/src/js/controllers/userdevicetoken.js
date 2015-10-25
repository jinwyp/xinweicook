/**
 * Created by jinwyp on 7/22/15.
 */





angular
    .module('RDash')
    .controller('UserDeviceController', ['$scope', '$timeout', '$state', '$stateParams', 'Notification', 'Util', 'Users', 'UserAccounts', 'UserAccountDetails', 'Devices', userDeviceController]);


function userDeviceController($scope, $timeout, $state, $stateParams, Notification, Util, Users, UserAccounts, UserAccountDetails, Devices) {

    $scope.data = {
        searchFilter : '',
        searchOptions : {
            sort : '-createdAt',

            skip : 0,
            limit : 200,

            query : {
                deviceToken : '',
                user : ''
            }

        },


        deviceListCount : 0,
        deviceListCurrentPage : 1,
        deviceListTotalPages : 1,
        deviceListPagesArray : [],

        currentDeleteIndex : -1,


        deviceList     : [],
        device         : {
            user : '',
            deviceToken : ''
        }

    };

    $scope.css = {
        isAddNewStatus : true
    };



    $scope.searchDeviceCount = function (){
        Util.delProperty($scope.data.searchOptions.query);

        Devices.one('count').get(Util.formatParam($scope.data.searchOptions)).then(function (users) {
            $scope.data.deviceListCount = users.count;
            $scope.data.deviceListTotalPages = Math.ceil(users.count / $scope.data.searchOptions.limit);

            $scope.data.deviceListPagesArray= [];
            for (var i = 1; i <= $scope.data.deviceListTotalPages; i++){
                $scope.data.deviceListPagesArray.push( {value : i} )
            }

            $scope.searchDevice();

        });
    };

    $scope.searchDevice = function (form) {
        Util.delProperty($scope.data.searchOptions.query);

        Devices.getList(Util.formatParam($scope.data.searchOptions, true)).then(function (resultDevices) {
            $scope.data.deviceList = resultDevices;
            Notification.success({message: 'Search Success! ', delay: 8000});

        }).catch(function(err){
            Notification.error({message: "Search Failure! Status:" + err.status + " Reason: " + err.data.message , delay: 5000});
        });

    };

    $scope.changePagination = function (currentPageNo) {
        $scope.data.deviceListCurrentPage = currentPageNo;
        $scope.data.searchOptions.skip = ($scope.data.deviceListCurrentPage-1) * $scope.data.searchOptions.limit;
        $scope.searchDevice();
    };


    $scope.delDevice = function (user) {

        var index = $scope.data.deviceList.indexOf(user);

        $scope.data.deviceList[index].remove().then(function (resultDevice) {
            $scope.searchDeviceCount();

            Notification.success({message : 'Delete Success', delay : 8000});

        }).catch(function (err) {
            Notification.error({
                message : "Delete Failure! Status:" + err.status + " Reason: " + err.data.message,
                delay   : 5000
            });
        });

    };




    if ($state.current.data.type === 'list') {

        $scope.searchDeviceCount();
    }

    if ($state.current.data.type === 'update') {
        $scope.css.isAddNewStatus = false;

        Devices.one($stateParams.id).get().then(function (resultDevice) {
            $scope.data.user = resultDevice;

            //编辑user时， 处理user group 显示
            //angular.forEach($scope.data.userGroup, function (user) {
            //    if (user.zh === $scope.data.user.group.zh) {
            //        $scope.data.user.group = user;
            //    }
            //});
        });


    }




    $scope.updateDevice = function (form) {
        if (form.$invalid) {
            return;
        }
        if ($scope.data.user.pwd.length > 20 || $scope.data.user.pwd === ''){
            delete $scope.data.user.pwd;
        }


        $scope.data.user.put().then(function (resultDevice) {
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

