/**
 * Created by jinwyp on 7/22/15.
 */





angular
    .module('RDash')
    .controller('UserController', ['$scope', '$timeout', '$state', '$stateParams', 'Notification', 'Users', userController ]);



function userController($scope, $timeout, $state, $stateParams, Notification, Users) {

    $scope.data = {
        searchFilter : '',
        userList : [],
        user : {}
    };

    $scope.css = {
        isAddNewStatus : true
    };



    if ($state.current.data.type === 'list'){
        Users.getList().then(function (users) {
            $scope.data.userList = users;
        });
    }

    if ($state.current.data.type === 'update'){
        $scope.css.isAddNewStatus = false;

        Users.one($stateParams.id).get().then(function (resutlUser) {
            $scope.data.user = resutlUser;

            //编辑user时， 处理user group 显示
            angular.forEach($scope.data.userGroup, function(user) {
                if (user.zh === $scope.data.user.group.zh){
                    $scope.data.user.group = user;
                }
            });
        });
    }

    $scope.addNewUser = function (form) {
        if (form.$invalid) {
            return;
        }

        var newUser = angular.copy($scope.data.user);
        //console.log (newUser);
        Users.post(newUser).then(function (resultUser) {
            console.log(resultUser);
            Notification.success({message: 'Save Success', delay: 8000});

        }).catch(function(err){
            Notification.error({message: "Update Failure! Status:" + err.status + " Reason: " + err.data.message , delay: 5000});
        });
    };

    $scope.updateUser = function (form) {
        if (form.$invalid) {
            return;
        }

        $scope.data.user.put().then(function (resultUser) {
            console.log(resultUser);
            Notification.success({message: 'Update Success', delay: 8000});
        }).catch(function(err){
            console.log(err);
            Notification.error({message: "Update Failure! Status:" + err.status + " Reason: " + err.data.message , delay: 5000});
        });
    };

    $scope.delUser = function (user) {

        var index = $scope.data.userList.indexOf(user);

        $scope.data.userList[index].remove().then(function (resultUser) {
            Users.getList().then(function (users) {
                $scope.data.userList = users;
            });

            Notification.success({message: 'Delete Success', delay: 8000});

        }).catch(function(err){
            Notification.error({message: "Delete Failure! Status:" + err.status + " Reason: " + err.data.message , delay: 5000});
        });

    };

}
