/**
 * Created by jinwyp on 7/22/15.
 */





angular
    .module('RDash')
    .controller('PositionController', ['$scope', '$timeout', '$state', '$stateParams', 'Notification', 'Util', 'Positions', 'Dishes', positionController]);


function positionController($scope, $timeout, $state, $stateParams, Notification, Util, Positions, Dishes) {

    $scope.data = {
        searchFilter : '',
        searchOptions : {
            sort : {"position":1, "sortId":-1 },
            skip : 0,
            limit : 1000,

            query : {
                createdAt :'',
                _id : '',
                position : '',
                sortId : ''
            }
        },

        datePickerIsOpen : false,

        searchDateFrom : '',
        searchDateTo : '',


        dishAllList        : [],

        positionListCount : 0,
        positionListCurrentPage : 1,
        positionListTotalPages : 1,
        positionListPagesArray : [],

        currentDeleteIndex : -1,


        positionList     : [],
        position         : {
            dish : '',
            position : 'index1',
            //description : {
            //    zh : '',
            //    en : ''
            //},
            imgUrl : '',
            linkUrl : '',
            sortId : ''
        },

        positionNameList: [
            {
                name : 'ALL',
                value : ''
            },
            {
                name : '首页推荐位',
                value : 'index1'
            },
            {
                name : '食材包首页推荐位',
                value : 'indexcook1'
            }

        ]

    };

    $scope.css = {
        isAddNewStatus : true,
        showTable : 'positions'
    };





    $scope.searchPositionCount = function (){


        Util.delProperty($scope.data.searchOptions.query);

        Positions.one('count').get(Util.formatParam($scope.data.searchOptions)).then(function (positions) {
            $scope.data.positionListCount = positions.count;
            $scope.data.positionListTotalPages = Math.ceil(positions.count / $scope.data.searchOptions.limit);

            $scope.data.positionListPagesArray= [];
            for (var i = 1; i <= $scope.data.positionListTotalPages; i++){
                $scope.data.positionListPagesArray.push( {value : i} );
            }

            $scope.searchPosition();

        });
    };

    $scope.searchPosition = function (form) {
        Util.delProperty($scope.data.searchOptions.query);

        Positions.getList(Util.formatParam($scope.data.searchOptions, true)).then(function (resultPositions) {
            $scope.data.positionList = resultPositions;
            Notification.success({message: 'Search Success! ', delay: 4000});

        }).catch(function(err){
            Notification.error({message: "Search Failure! Status:" + err.status + " Reason: " + err.data.message , delay: 7000});
        });

    };

    $scope.changePagination = function (currentPageNo) {
        $scope.data.positionListCurrentPage = currentPageNo;
        $scope.data.searchOptions.skip = ($scope.data.positionListCurrentPage-1) * $scope.data.searchOptions.limit;
        $scope.searchPosition();
    };


    $scope.delPosition = function (position) {

        var index = $scope.data.positionList.indexOf(position);

        $scope.data.positionList[index].remove().then(function (resultPosition) {
            $scope.searchPositionCount();

            Notification.success({message : 'Delete Success', delay : 4000});

        }).catch(function (err) {
            Notification.error({ message : "Delete Failure! Status:" + err.status + " Reason: " + err.data.message, delay   : 7000 });
        });

    };




    if ($state.current.data.type === 'list') {

        $scope.searchPositionCount();
    }

    if ($state.current.data.type === 'update') {
        $scope.css.isAddNewStatus = false;

        Positions.one($stateParams.id).get().then(function (resultPosition) {
            $scope.data.position = resultPosition;

            //编辑position时， 处理position group 显示
            //angular.forEach($scope.data.positionGroup, function (position) {
            //    if (position.zh === $scope.data.position.group.zh) {
            //        $scope.data.position.group = position;
            //    }
            //});
        });

        Dishes.getList().then(function (resultDish) {
            $scope.data.dishAllList = resultDish;
        });

    }

    if ($state.current.data.type === 'add'){

        Dishes.getList().then(function (resultDish) {
            $scope.data.dishAllList = resultDish;
        });

    }


    $scope.updatePosition = function (form) {
        if (form.$invalid) {
            return;
        }

        $scope.data.position.put().then(function (resultPosition) {
            Notification.success({message : 'Update Success', delay : 4000});
        }).catch(function (err) {
            console.log(err);
            Notification.error({  message : "Update Failure! Status:" + err.status + " Reason: " + err.data.message,  delay   : 7000  });
        });
    };



    $scope.addNewPosition = function (form) {
        if (form.$invalid) {
            return;
        }

        var newPosition = angular.copy($scope.data.position);
        //console.log (newPosition);
        Positions.post(newPosition).then(function (resultPosition) {
            console.log(resultPosition);
            Notification.success({message : 'Save Success', delay : 4000});

        }).catch(function (err) {
            Notification.error({ message : "Add New Position Failure! Status:" + err.status + " Reason: " + err.data.message, delay   : 7000 });
        });
    };






}
