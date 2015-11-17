/**
 * Created by jinwyp on 7/22/15.
 */





angular
    .module('RDash')
    .controller('TagController', ['$scope', '$timeout', '$state', '$stateParams', 'Notification', 'Tags', tagController ]);



function tagController($scope, $timeout, $state, $stateParams, Notification, Tags) {

    $scope.data = {
        searchFilter : '',
        tagList : [],
        tag : {
            name:{
                zh : '',
                en : ''
            },
            group : {
                zh : '',
                en : ''
            },
            isFilter : false
        },

        currentDeleteIndex : -1,

        tagGroup : [
            {
                zh : '菜系',
                en : 'Dishes system'
            },
            {
                zh : '食材',
                en : 'Ingredients'
            },
            {
                zh : '场景',
                en : 'Occasion'
            },
            {
                zh : '推荐促销',
                en : 'Promotion'
            }
        ]
    };

    $scope.css = {
        isAddNewStatus : true
    };






    $scope.searchOrder = function (form) {

        //Util.delProperty($scope.data.searchOptions.query);

        Tags.getList().then(function (resultTagList) {
            $scope.data.tagList = resultTagList;
            Notification.success({message: 'Search Success! ', delay: 4000});

        }).catch(function(err){
            Notification.error({message: "Search Failure! Status:" + err.status + " Reason: " + err.data.message , delay: 7000});
        });

    };


    if ($state.current.data.type === 'list'){
        $scope.searchOrder();
    }

    if ($state.current.data.type === 'update'){
        $scope.css.isAddNewStatus = false;

        Tags.one($stateParams.id).get().then(function (resutlTag) {
            $scope.data.tag = resutlTag;

            //编辑tag时， 处理tag group 显示
            angular.forEach($scope.data.tagGroup, function(tag) {
                if (tag.zh === $scope.data.tag.group.zh){
                    $scope.data.tag.group = tag;
                }
            });
        });
    }


    $scope.addNewTag = function (form) {
        if (form.$invalid) {
            return;
        }

        var newTag = angular.copy($scope.data.tag);
        //console.log (newTag);
        Tags.post(newTag).then(function (resultTag) {
            console.log(resultTag);
            Notification.success({message: 'Save Success', delay: 8000});

        }).catch(function(err){
            Notification.error({message: "Update Failure! Status:" + err.status + " Reason: " + err.data.message , delay: 5000});
        });
    };

    $scope.updateTag = function (form) {
        if (form.$invalid) {
            return;
        }

        $scope.data.tag.put().then(function (resultTag) {
            console.log(resultTag);
            Notification.success({message: 'Update Success', delay: 8000});
        }).catch(function(err){
            console.log(err);
            Notification.error({message: "Update Failure! Status:" + err.status + " Reason: " + err.data.message , delay: 5000});
        });
    };


    $scope.delTag = function (tag) {

        var index = $scope.data.tagList.indexOf(tag);

        $scope.data.tagList[index].remove().then(function (result) {
            $scope.searchOrder();

            Notification.success({message : 'Delete Success', delay : 4000});

        }).catch(function (err) {
            Notification.error({  message : "Delete Failure! Status:" + err.status + " Reason: " + err.data.message, delay   : 7000 });
        });

    };
}
