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

        searchSort : {
            sort : '-createdAt'
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

        var options = angular.extend({}, $scope.data.searchOptions, $scope.data.searchSort);

        Logs.getList(options).then(function (resultLog) {
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


}
