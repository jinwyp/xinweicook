/**
 * Created by jinwyp on 7/22/15.
 */





angular
    .module('RDash')
    .controller('LogController', ['$scope', '$http', '$timeout', '$state', '$stateParams', 'Notification', 'Util', 'Logs', 'Settings', logController ]);



function logController($scope, $http, $timeout, $state, $stateParams, Notification, Util, Logs, Settings) {

    $scope.data = {
        searchFilter : '',
        searchOptions : {
            sort : '-timestamp',
            skip : 0,
            limit : 200,
            query : {
                level : 'error'
            }

        },


        logListCount : 0,
        logListCurrentPage : 1,
        logListTotalPages : 1,
        logListPagesArray : [],

        currentDeleteIndex : -1,

        logList : [],
        log : {},

        settingList : []
    };

    $scope.css = {
        isAddNewStatus : true,
        showTable : 'logs'
    };



    $scope.searchLogCount = function (){

        $scope.css.showTable = 'logs';

        Util.delProperty($scope.data.searchOptions.query);

        Logs.one('count').get(Util.formatParam($scope.data.searchOptions)).then(function (logs) {
            $scope.data.logListCount = logs.count;
            $scope.data.logListTotalPages = Math.ceil(logs.count / $scope.data.searchOptions.limit);

            $scope.data.logListPagesArray= [];
            for (var i = 1; i <= $scope.data.logListTotalPages; i++){
                $scope.data.logListPagesArray.push( {value : i} )
            }

            $scope.searchLog();

        });
    };

    $scope.searchLog = function (form) {
        Util.delProperty($scope.data.searchOptions.query);

        Logs.getList(Util.formatParam($scope.data.searchOptions, true)).then(function (resultLog) {
            $scope.data.logList = resultLog;
            Notification.success({message: 'Search Success! ', delay: 4000});

        }).catch(function(err){
            Notification.error({message: "Search Failure! Status:" + err.status + " Reason: " + err.data.message , delay: 7000});
        });

    };

    $scope.changePagination = function (currentPageNo) {
        $scope.data.logListCurrentPage = currentPageNo;
        $scope.data.searchOptions.skip = ($scope.data.logListCurrentPage-1) * $scope.data.searchOptions.limit;
        $scope.searchLog();
    };





    $scope.searchSetting = function (form) {
        $scope.css.showTable = 'settings';

        $scope.data.searchOptions.query.level = '';
        Util.delProperty($scope.data.searchOptions.query);

        Settings.getList(Util.formatParam($scope.data.searchOptions, true)).then(function (resultSettings) {
            $scope.data.settingList = resultSettings;
            Notification.success({message: 'Search Success! ', delay: 4000});

        }).catch(function(err){
            Notification.error({message: "Search Failure! Status:" + err.status + " Reason: " + err.data.message , delay: 7000});
        });

    };



    $scope.removeSetting = function (form) {
        $scope.css.showTable = 'settings';

        Settings.remove({}).then(function (resultSettings) {
            console.log(resultSettings);
            $scope.data.settingList = resultSettings;
            Notification.success({message: 'Delete Success! ', delay: 4000});

        }).catch(function(err){
            Notification.error({message: "Delete Failure! Status:" + err.status + " Reason: " + err.data.message , delay: 7000});
        });

    };


    $scope.removesetting2 = function () {
        $http.get('/api/administrator/initremovesetting').then(function (resultSettings) {

            $scope.data.settingList = [];
            Notification.success({message: 'Delete Success! ', delay: 4000});

        }).catch(function(err){
            Notification.error({message: "Delete Failure! Status:" + err.status + " Reason: " + err.data.message , delay: 7000});
        });
    };



    $scope.removelog = function () {
        $http.get('/api/administrator/initremovelog').then(function (resultLog) {
            $scope.data.logList = [];
            Notification.success({message: 'Delete Success! ', delay: 4000});

        }).catch(function(err){
            Notification.error({message: "Delete Failure! Status:" + err.status + " Reason: " + err.data.message , delay: 7000});
        });
    };




    if ($state.current.data.type === 'list'){
        $scope.searchLogCount()
    }

    if ($state.current.data.type === 'update'){
        $scope.css.isAddNewStatus = false;

        Logs.one($stateParams.id).get().then(function (resutlLog) {
            $scope.data.log = resutlLog;

        });
    }


}
