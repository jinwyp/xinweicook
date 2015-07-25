/**
 * Created by jinwyp on 7/22/15.
 */





angular
    .module('RDash')
    .controller('LogController', ['$scope', '$timeout', '$state', '$stateParams', 'Notification', 'Logs', logController ]);



function logController($scope, $timeout, $state, $stateParams, Notification, Logs) {

    $scope.data = {
        searchFilter : '',
        searchOptions : {
            level : ''
        },
        logList : [],
        log : {}
    };

    $scope.css = {
        isAddNewStatus : true
    };

    if ($state.current.data.type === 'list'){
        Logs.getList().then(function (logs) {
            $scope.data.logList = logs;
        });
    }

    if ($state.current.data.type === 'update'){
        $scope.css.isAddNewStatus = false;

        Logs.one($stateParams.id).get().then(function (resutlLog) {
            $scope.data.log = resutlLog;

            //编辑log时， 处理log group 显示
            angular.forEach($scope.data.logGroup, function(log) {
                if (log.zh === $scope.data.log.group.zh){
                    $scope.data.log.group = log;
                }
            });
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
