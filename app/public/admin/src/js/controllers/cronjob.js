/**
 * Created by jinwyp on 7/22/15.
 */





angular
    .module('RDash')
    .controller('CronController', ['$scope', '$timeout', '$state', '$stateParams', 'Notification', 'Util', 'Crons', cronController ]);



function cronController($scope, $timeout, $state, $stateParams, Notification, Util, Crons) {

    $scope.data = {
        searchFilter : '',
        searchOptions : {
            skip : 0,
            limit : 500,
            isActivated : ''
        },
        cronListCount : 0,
        cronListCurrentPage : 1,
        cronListTotalPages : 1,
        cronListPagesArray : [],

        currentDeleteIndex : -1,

        cronList : [],
        cron : {
            name : '',
            type : '',
            isActivated : true,
            value : {},
            dishList : [
                {
                    dishId : '',
                    quantity : 10
                }
            ]
        },


        isActivatedStatusList : [
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
            }
        ]
    };

    $scope.css = {
        isAddNewStatus : true
    };



    function deleteProperty (obj){

        for(var p in obj) {
            if (obj.hasOwnProperty(p)) {
                if (obj[p] ===''){
                    delete obj[p];
                }
                if (angular.isArray(obj[p]) ){
                    if(obj[p].length === 0){
                        delete obj[p];
                    }else{
                        angular.forEach(obj[p], function(subobj, index){
                            if(!angular.isUndefined(subobj.dishId) && subobj.dishId == ''){
                                obj[p].splice(index, 1)
                            }

                        })
                    }
                }else if (angular.isObject(obj[p])) {
                    deleteProperty(obj[p]);

                    var hasPro = false;
                    for(var pchild in obj[p]) {
                        hasPro = true;
                    }
                    if (!hasPro){
                        delete obj[p];
                    }
                }
            }
        }
    }



    $scope.searchCronCount = function (){

        Util.delProperty($scope.data.searchOptions);
        //console.log ($scope.data.searchOptions);
        Crons.one('count').get($scope.data.searchOptions).then(function (crons) {
            $scope.data.cronListCount = crons.count;
            $scope.data.cronListTotalPages = Math.ceil(crons.count / $scope.data.searchOptions.limit);

            $scope.data.cronListPagesArray= [];
            for (var i = 1; i <= $scope.data.cronListTotalPages; i++){
                $scope.data.cronListPagesArray.push( {value : i} )
            }

            $scope.searchCron();

        });
    };

    $scope.searchCron = function (form) {
        Util.delProperty($scope.data.searchOptions);

        Crons.getList($scope.data.searchOptions).then(function (resultCron) {
            $scope.data.cronList = resultCron;
            Notification.success({message: 'Search Success! ', delay: 8000});

        }).catch(function(err){
            Notification.error({message: "Search Failure! Status:" + err.status + " Reason: " + err.data.message , delay: 5000});
        });

    };

    $scope.changePagination = function (currentPageNo) {
        $scope.data.cronListCurrentPage = currentPageNo;
        $scope.data.searchOptions.skip = ($scope.data.cronListCurrentPage-1) * $scope.data.searchOptions.limit;
        $scope.searchCron();
    };



    $scope.delCron = function (cron) {

        var index = $scope.data.cronList.indexOf(cron);

        $scope.data.cronList[index].remove().then(function (resultOrder) {
            $scope.searchCronCount();

            Notification.success({message : 'Delete Success', delay : 8000});

        }).catch(function (err) {
            Notification.error({
                message : "Delete Failure! Status:" + err.status + " Reason: " + err.data.message,
                delay   : 5000
            });
        });

    };



    if ($state.current.data.type === 'list'){
        $scope.searchCronCount()
    }

    if ($state.current.data.type === 'update'){
        $scope.css.isAddNewStatus = false;

        Crons.one($stateParams.id).get().then(function (resutlCron) {
            $scope.data.cron = resutlCron;

            //编辑cron时， 处理cron group 显示
            //angular.forEach($scope.data.cronGroup, function(cron) {
            //    if (cron.zh === $scope.data.cron.group.zh){
            //        $scope.data.cron.group = cron;
            //    }
            //});
        });
    }




    $scope.addNewCron = function (form) {
        if (form.$invalid) {
            return;
        }

        var newCron = angular.copy($scope.data.cron);
        deleteProperty(newCron);
        //console.log (newCron);
        Crons.post(newCron).then(function (resultCron) {
            console.log(resultCron);
            Notification.success({message: 'Save Success', delay: 8000});

        }).catch(function(err){
            Notification.error({message: "Update Failure! Status:" + err.status + " Reason: " + err.data.message , delay: 5000});
        });
    };

    $scope.updateCron = function (form) {
        if (form.$invalid) {
            return;
        }

        $scope.data.cron.put().then(function (resultCron) {
            console.log(resultCron);
            Notification.success({message: 'Update Success', delay: 8000});
        }).catch(function(err){
            console.log(err);
            Notification.error({message: "Update Failure! Status:" + err.status + " Reason: " + err.data.message , delay: 5000});
        });
    };




    $scope.addNewDishId = function (current) {
        current.push({
            quantity : '',
            dishId : ''
        })
    };


}
