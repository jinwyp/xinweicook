/**
 * Created by jinwyp on 7/22/15.
 */





angular
    .module('RDash')
    .controller('LogController', ['$scope', '$timeout', '$state', '$stateParams', 'Notification', 'Util', 'Logs', logController ]);



function logController($scope, $timeout, $state, $stateParams, Notification, Util, Logs) {

    $scope.data = {
        searchFilter : '',
        searchOptions : {
            skip : 0,
            limit : 500,
            level : ''
        },
        logListCount : 0,
        logListCurrentPage : 1,
        logListTotalPages : 1,
        logListPagesArray : [],

        currentDeleteIndex : -1,

        logList : [],
        log : {}
    };

    $scope.css = {
        isAddNewStatus : true
    };



    $scope.searchLogCount = function (){

        Util.delProperty($scope.data.searchOptions);

        Logs.one('count').get($scope.data.searchOptions).then(function (logs) {
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
        Util.delProperty($scope.data.searchOptions);

        Logs.getList($scope.data.searchOptions).then(function (resultLog) {
            $scope.data.logList = resultLog;
            Notification.success({message: 'Search Success! ', delay: 8000});

        }).catch(function(err){
            Notification.error({message: "Search Failure! Status:" + err.status + " Reason: " + err.data.message , delay: 5000});
        });

    };

    $scope.changePagination = function (currentPageNo) {
        $scope.data.logListCurrentPage = currentPageNo;
        $scope.data.searchOptions.skip = ($scope.data.logListCurrentPage-1) * $scope.data.searchOptions.limit;
        $scope.searchLog();
    };







    if ($state.current.data.type === 'list'){
        $scope.searchLogCount()
    }

    if ($state.current.data.type === 'update'){
        $scope.css.isAddNewStatus = false;

        Logs.one($stateParams.id).get().then(function (resutlLog) {
            $scope.data.log = resutlLog;

            //编辑log时， 处理log group 显示
            //angular.forEach($scope.data.logGroup, function(log) {
            //    if (log.zh === $scope.data.log.group.zh){
            //        $scope.data.log.group = log;
            //    }
            //});
        });
    }


    $scope.searchLog = function (form) {

        for(var p in $scope.data.searchOptions) {
            if ($scope.data.searchOptions.hasOwnProperty(p)) {
                if ($scope.data.searchOptions[p] ===''){
                    delete $scope.data.searchOptions[p];
                }
            }
        }

        Logs.getList($scope.data.searchOptions).then(function (result) {
            $scope.data.logList = result;
            Notification.success({message: 'Search Success! ', delay: 8000});

        }).catch(function(err){
            Notification.error({message: "Search Failure! Status:" + err.status + " Reason: " + err.data.message , delay: 5000});
        });

    };


}
