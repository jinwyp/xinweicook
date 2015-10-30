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
            sort : '-createdAt',
            skip : 0,
            limit : 200,

            query : {
                name :''
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

            locationGeoLatitude : 0,
            locationGeoLongitude : 0
        },

        warehouseGroupList: [
            {
                name : 'ALL',
                value : ''
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



    if ($state.current.data.type === 'list') {

        $scope.searchWarehouse();
    }


    if ($state.current.data.type === 'update') {
        $scope.css.isAddNewStatus = false;

        Warehouses.one($stateParams.id).get().then(function (resultWarehouse) {
            $scope.data.warehouse = resultWarehouse;

        });

    }




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








}

