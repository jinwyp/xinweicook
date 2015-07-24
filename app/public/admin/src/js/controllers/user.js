/**
 * Created by jinwyp on 7/22/15.
 */





angular
    .module('RDash')
    .controller('UserController', ['$scope', '$timeout', '$state', '$stateParams', 'Notification', 'Users', userController]);


function userController($scope, $timeout, $state, $stateParams, Notification, Users) {

    $scope.data = {
        searchFilter : '',
        userList     : [],
        user         : {}
    };

    $scope.css = {
        isAddNewStatus : true
    };


    if ($state.current.data.type === 'list') {
        Users.getList().then(function (users) {
            $scope.data.userList = users;
        });
    }

    if ($state.current.data.type === 'update') {
        $scope.css.isAddNewStatus = false;

        Users.one($stateParams.id).get().then(function (resutlUser) {
            $scope.data.user = resutlUser;

            //编辑user时， 处理user group 显示
            angular.forEach($scope.data.userGroup, function (user) {
                if (user.zh === $scope.data.user.group.zh) {
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
            Notification.success({message : 'Save Success', delay : 8000});

        }).catch(function (err) {
            Notification.error({
                message : "Update Failure! Status:" + err.status + " Reason: " + err.data.message,
                delay   : 5000
            });
        });
    };

    $scope.updateUser = function (form) {
        if (form.$invalid) {
            return;
        }

        $scope.data.user.put().then(function (resultUser) {
            console.log(resultUser);
            Notification.success({message : 'Update Success', delay : 8000});
        }).catch(function (err) {
            console.log(err);
            Notification.error({
                message : "Update Failure! Status:" + err.status + " Reason: " + err.data.message,
                delay   : 5000
            });
        });
    };

    $scope.delUser = function (user) {

        var index = $scope.data.userList.indexOf(user);

        $scope.data.userList[index].remove().then(function (resultUser) {
            Users.getList().then(function (users) {
                $scope.data.userList = users;
            });

            Notification.success({message : 'Delete Success', delay : 8000});

        }).catch(function (err) {
            Notification.error({
                message : "Delete Failure! Status:" + err.status + " Reason: " + err.data.message,
                delay   : 5000
            });
        });

    };

}


var aa = [{
    "_id"             : "55b1b25612e798ef1214701a",
    "modifiedAt"      : "2015-07-24T04:06:31.497Z",
    "createdAt"       : "2015-07-24T03:34:46.587Z",
    "autoIncrementId" : 10019,
    "username"        : "x@x.com",
    "pwd"             : "$2a$04$5eRSmUTN7GYePtrf0nH1IOzWeGZK/HkYJ1kzR/Z13Ps4NVFnozg/2",
    "mobile"          : "13564568301",
    "email"           : "x@x.com",
    "dishLikeList"    : [],
    "couponList"      : [],
    "shoppingCart"    : [],
    "isPromoOn"       : true,
    "isSpam"          : false,
    "credit"          : 0,
    "address"         : [],
    "group"           : "admin",
    "__v"             : 0
}, {
    "_id"             : "55b1b25612e798ef1214701b",
    "modifiedAt"      : "2015-07-24T09:23:19.335Z",
    "createdAt"       : "2015-07-24T03:34:46.588Z",
    "autoIncrementId" : 10020,
    "username"        : "shaoxiaoqing",
    "pwd"             : "$2a$04$yf7ZeNzCwZPqm49dioDCieFmairDcQhotZvTHrdcPdGxvDfJmqjtG",
    "mobile"          : "18602327056",
    "email"           : "dreamer0321@foxmail.com",
    "fullName"        : "邵晓青",
    "dishLikeList"    : [],
    "couponList"      : [],
    "shoppingCart"    : [],
    "isPromoOn"       : true,
    "isSpam"          : false,
    "credit"          : 0,
    "address"         : [],
    "group"           : "admin",
    "__v"             : 0
}, {
    "_id"             : "55b1b25612e798ef1214701c",
    "modifiedAt"      : "2015-07-24T04:12:41.046Z",
    "createdAt"       : "2015-07-24T03:34:46.590Z",
    "autoIncrementId" : 10021,
    "username"        : "chensilu",
    "pwd"             : "$2a$04$4hzZc05jAveFE7XboebGjOo1SXZ6CNWK.yCE5vsCgTNejZ0eqEhYu",
    "mobile"          : "18601799423",
    "email"           : "690363236@qq.com",
    "fullName"        : "陈思璐",
    "dishLikeList"    : [],
    "couponList"      : [],
    "shoppingCart"    : [],
    "isPromoOn"       : true,
    "isSpam"          : false,
    "credit"          : 0,
    "address"         : [],
    "group"           : "admin",
    "__v"             : 0
}, {
    "_id"             : "55b1b25612e798ef1214701d",
    "modifiedAt"      : "2015-07-24T09:38:03.339Z",
    "createdAt"       : "2015-07-24T03:34:46.591Z",
    "autoIncrementId" : 10022,
    "username"        : "mengfei",
    "pwd"             : "$2a$04$/NoM3UfPbN2gferzISQ1a.beakJcvKtCUZDZk2Oz7F6.5hKVilZeu",
    "mobile"          : "18215563108",
    "email"           : "918372085@qq.com",
    "fullName"        : "赵梦菲",
    "dishLikeList"    : [],
    "couponList"      : [],
    "shoppingCart"    : [],
    "isPromoOn"       : true,
    "isSpam"          : false,
    "credit"          : 0,
    "address"         : [],
    "group"           : "admin",
    "__v"             : 0
}, {
    "_id"             : "55b1b3db12e798ef121470d4",
    "modifiedAt"      : "2015-07-24T03:41:15.720Z",
    "createdAt"       : "2015-07-24T03:41:15.720Z",
    "autoIncrementId" : 10023,
    "mobile"          : "13120529020",
    "pwd"             : "$2a$04$5aaw5QQnttQAW9MABcrpDOC76UvvlH3UDdP8j8WCsM3dJFeyR.r.m",
    "dishLikeList"    : [],
    "couponList"      : [],
    "shoppingCart"    : [],
    "isPromoOn"       : true,
    "isSpam"          : false,
    "credit"          : 0,
    "address"         : [],
    "group"           : "member",
    "__v"             : 0
}, {
    "_id"             : "55b1b4fb4c2900bb159cb4df",
    "modifiedAt"      : "2015-07-24T05:33:30.745Z",
    "createdAt"       : "2015-07-24T03:46:03.037Z",
    "autoIncrementId" : 10024,
    "mobile"          : "18768145317",
    "pwd"             : "$2a$04$MqtbMg0lrWNFFcz2rruUc.QuzwpnZhtLvHUHQCvv56ge60ksaspJK",
    "dishLikeList"    : [],
    "couponList"      : [],
    "shoppingCart"    : [{
        "number"  : 1,
        "dish"    : "55b1b46e4c2900bb159cafdb",
        "_id"     : "55b1ce2aca15939a23b7bb1c",
        "subDish" : []
    }, {"number" : 2, "dish" : "55b0a37a181e6a7007c0371b", "_id" : "55b1ce2aca15939a23b7bb1b", "subDish" : []}],
    "isPromoOn"       : true,
    "isSpam"          : false,
    "credit"          : 0,
    "address"         : [],
    "group"           : "member",
    "__v"             : 20
}, {
    "_id"             : "55b1b5304c2900bb159cb4ed",
    "modifiedAt"      : "2015-07-24T03:46:56.296Z",
    "createdAt"       : "2015-07-24T03:46:56.296Z",
    "autoIncrementId" : 10025,
    "mobile"          : "15779310795",
    "pwd"             : "$2a$04$ZhZkH5R0JBMH8.KuBQOQcehEENc1qszE84.0HHU0Mc8FB9zWZnNZq",
    "dishLikeList"    : [],
    "couponList"      : [],
    "shoppingCart"    : [],
    "isPromoOn"       : true,
    "isSpam"          : false,
    "credit"          : 0,
    "address"         : [],
    "group"           : "member",
    "__v"             : 0
}, {
    "_id"             : "55b1b6604c2900bb159cb5a7",
    "modifiedAt"      : "2015-07-24T03:52:00.738Z",
    "createdAt"       : "2015-07-24T03:52:00.738Z",
    "autoIncrementId" : 10026,
    "mobile"          : "13781174069",
    "pwd"             : "$2a$04$1WuxPVgYRZi4HvRJCMZyHOiAWWJo6bO/foUBXKt8JbiZF.3iOZ5n2",
    "dishLikeList"    : [],
    "couponList"      : [],
    "shoppingCart"    : [],
    "isPromoOn"       : true,
    "isSpam"          : false,
    "credit"          : 0,
    "address"         : [],
    "group"           : "member",
    "__v"             : 0
}, {
    "_id"             : "55b1b7c14c2900bb159cb65b",
    "modifiedAt"      : "2015-07-24T05:07:48.604Z",
    "createdAt"       : "2015-07-24T03:57:53.243Z",
    "autoIncrementId" : 10027,
    "mobile"          : "18621378962",
    "pwd"             : "$2a$04$J3j/xZv6g3kXYHhOMTK.autCjDU0jLKVGNLERARY.5OfHp9bsMewS",
    "dishLikeList"    : [],
    "couponList"      : [],
    "shoppingCart"    : [{
        "number"  : 2,
        "dish"    : "55b0a37a181e6a7007c0371b",
        "_id"     : "55b1c7194c2900bb159cb796",
        "subDish" : []
    }, {"number" : 3, "dish" : "55b1b46e4c2900bb159cafbd", "_id" : "55b1c7194c2900bb159cb795", "subDish" : []}],
    "isPromoOn"       : true,
    "isSpam"          : false,
    "credit"          : 0,
    "address"         : [],
    "group"           : "member",
    "__v"             : 7
}, {
    "_id"             : "55b1bb7e4c2900bb159cb6f4",
    "modifiedAt"      : "2015-07-24T04:13:50.469Z",
    "createdAt"       : "2015-07-24T04:13:50.469Z",
    "autoIncrementId" : 10029,
    "mobile"          : "18261809621",
    "pwd"             : "$2a$04$WMEnPK9J0b.OHwKbntmVr.k83Lpp5nbGlc5ELlOxeTfT2lYuqdIPq",
    "dishLikeList"    : [],
    "couponList"      : [],
    "shoppingCart"    : [],
    "isPromoOn"       : true,
    "isSpam"          : false,
    "credit"          : 0,
    "address"         : [],
    "group"           : "member",
    "__v"             : 0
}, {
    "_id"             : "55b1bfab4c2900bb159cb723",
    "modifiedAt"      : "2015-07-24T09:17:46.759Z",
    "createdAt"       : "2015-07-24T04:31:39.155Z",
    "autoIncrementId" : 10030,
    "mobile"          : "18801910359",
    "pwd"             : "$2a$04$Ui0p7XgnpL6ClmqOgdfZR.qnWIVie8W85ulYcmxmjFj5WhQTmn7w6",
    "dishLikeList"    : [],
    "couponList"      : [],
    "shoppingCart"    : [{
        "number"  : 1,
        "dish"    : "55b0a37a181e6a7007c0371b",
        "_id"     : "55b202baca15939a23b7bf03",
        "subDish" : []
    }, {"number" : 1, "dish" : "558a602a3eba152266ff2c01", "_id" : "55b202baca15939a23b7bf02", "subDish" : []}],
    "isPromoOn"       : true,
    "isSpam"          : false,
    "credit"          : 0,
    "address"         : [],
    "group"           : "member",
    "__v"             : 6
}, {
    "_id"             : "55b1c1bf4c2900bb159cb73e",
    "modifiedAt"      : "2015-07-24T04:42:08.275Z",
    "createdAt"       : "2015-07-24T04:40:31.556Z",
    "autoIncrementId" : 10031,
    "mobile"          : "18661658291",
    "pwd"             : "$2a$04$9pLEJV4.XIigQUCfRnmededWeQrKoU2X5OrquLLq/I71HY1VT/Ks.",
    "dishLikeList"    : [],
    "couponList"      : [],
    "shoppingCart"    : [],
    "isPromoOn"       : true,
    "isSpam"          : false,
    "credit"          : 0,
    "address"         : [],
    "group"           : "member",
    "__v"             : 2
}, {
    "_id"             : "55b1c3f44c2900bb159cb76a",
    "modifiedAt"      : "2015-07-24T04:49:56.464Z",
    "createdAt"       : "2015-07-24T04:49:56.464Z",
    "autoIncrementId" : 10032,
    "mobile"          : "18516272908",
    "pwd"             : "$2a$04$.I/YyfFLrGQHM88IM3NifOBj5LRzmIyRaDKcRC0NYCZC4k.E8zNfK",
    "dishLikeList"    : [],
    "couponList"      : [],
    "shoppingCart"    : [],
    "isPromoOn"       : true,
    "isSpam"          : false,
    "credit"          : 0,
    "address"         : [],
    "group"           : "member",
    "__v"             : 0
}, {
    "_id"             : "55b1c88bbd4f871b224b1441",
    "modifiedAt"      : "2015-07-24T05:09:31.134Z",
    "createdAt"       : "2015-07-24T05:09:31.134Z",
    "autoIncrementId" : 10033,
    "mobile"          : "13728628651",
    "pwd"             : "$2a$04$Nbp8tjzHhjYifIZemkovT.5bxUIDhR/fbwcS/EglE2I1Cfj8G8H0y",
    "dishLikeList"    : [],
    "couponList"      : [],
    "shoppingCart"    : [],
    "isPromoOn"       : true,
    "isSpam"          : false,
    "credit"          : 0,
    "address"         : [],
    "group"           : "member",
    "__v"             : 0
}, {
    "_id"             : "55b1d36fca15939a23b7bb3c",
    "modifiedAt"      : "2015-07-24T09:14:38.702Z",
    "createdAt"       : "2015-07-24T05:55:59.656Z",
    "autoIncrementId" : 10034,
    "mobile"          : "13916231267",
    "pwd"             : "$2a$04$ffZRCEEHLtWGC2xmgUK2tOa9RlNx4BMNBxz0Ee4kkZSsj54FjGA/S",
    "dishLikeList"    : [],
    "couponList"      : [],
    "shoppingCart"    : [{
        "number"  : 1,
        "dish"    : "55b0a37a181e6a7007c0371b",
        "_id"     : "55b201feca15939a23b7bef3",
        "subDish" : []
    }],
    "isPromoOn"       : true,
    "isSpam"          : false,
    "credit"          : 0,
    "address"         : [],
    "group"           : "member",
    "__v"             : 3
}, {
    "_id"             : "55b1bad04c2900bb159cb6b0",
    "modifiedAt"      : "2015-07-24T05:04:56.494Z",
    "createdAt"       : "2015-07-24T04:10:56.837Z",
    "autoIncrementId" : 10028,
    "mobile"          : "18916881532",
    "pwd"             : "$2a$04$eWyrSKWSnLSBczhRyxH0dORe.1GcvTyYwBgJTNvB5yEuu1jBcBotK",
    "dishLikeList"    : [],
    "couponList"      : [],
    "shoppingCart"    : [{
        "number"  : 1,
        "dish"    : "55b1b46e4c2900bb159cafbd",
        "_id"     : "55b1c76e4c2900bb159cb7b1",
        "subDish" : []
    }, {
        "number"  : 1,
        "dish"    : "55b1b46e4c2900bb159cafdb",
        "_id"     : "55b1c76e4c2900bb159cb7b0",
        "subDish" : []
    }, {"number" : 1, "dish" : "55b1b46e4c2900bb159cafc5", "_id" : "55b1c76e4c2900bb159cb7af", "subDish" : []}],
    "isPromoOn"       : true,
    "isSpam"          : false,
    "credit"          : 0,
    "address"         : [],
    "group"           : "member",
    "__v"             : 3
}, {
    "_id"             : "55b1d761ca15939a23b7bb8d",
    "modifiedAt"      : "2015-07-24T06:12:49.436Z",
    "createdAt"       : "2015-07-24T06:12:49.436Z",
    "autoIncrementId" : 10036,
    "mobile"          : "15901809512",
    "pwd"             : "$2a$04$d0L8i1w.E0nkykWWtrIkyORDTiVzmq20f3mKsb1pDtUIdOduXCiY.",
    "dishLikeList"    : [],
    "couponList"      : [],
    "shoppingCart"    : [],
    "isPromoOn"       : true,
    "isSpam"          : false,
    "credit"          : 0,
    "address"         : [],
    "group"           : "member",
    "__v"             : 0
}, {
    "_id"             : "55b1e1dcca15939a23b7bbaf",
    "modifiedAt"      : "2015-07-24T06:57:32.015Z",
    "createdAt"       : "2015-07-24T06:57:32.015Z",
    "autoIncrementId" : 10037,
    "mobile"          : "13761362858",
    "pwd"             : "$2a$04$CRUFZ1FPZ1DuXSX0Ua9z7.Xttd1JdORK7oKMQW.jj/IFAi9uiWI8G",
    "dishLikeList"    : [],
    "couponList"      : [],
    "shoppingCart"    : [],
    "isPromoOn"       : true,
    "isSpam"          : false,
    "credit"          : 0,
    "address"         : [],
    "group"           : "member",
    "__v"             : 0
}, {
    "_id"             : "55b1e55dca15939a23b7bc42",
    "modifiedAt"      : "2015-07-24T07:12:29.391Z",
    "createdAt"       : "2015-07-24T07:12:29.391Z",
    "autoIncrementId" : 10038,
    "mobile"          : "13816178203",
    "pwd"             : "$2a$04$5lFmZmJFakZKuBXS20kNU.foO.iFvgeJnFxpAhprSdRYNc6Ssto7O",
    "dishLikeList"    : [],
    "couponList"      : [],
    "shoppingCart"    : [],
    "isPromoOn"       : true,
    "isSpam"          : false,
    "credit"          : 0,
    "address"         : [],
    "group"           : "member",
    "__v"             : 0
}, {
    "_id"             : "55b1d724ca15939a23b7bb81",
    "modifiedAt"      : "2015-07-24T09:04:50.645Z",
    "createdAt"       : "2015-07-24T06:11:48.524Z",
    "autoIncrementId" : 10035,
    "mobile"          : "18629641521",
    "pwd"             : "$2a$04$v0kaEy23cfcNVu2r4.OnSOA5L6BrV5P8rU76Bs1zw3noJ686Uozr.",
    "dishLikeList"    : [],
    "couponList"      : [],
    "shoppingCart"    : [{
        "number"  : 1,
        "dish"    : "55b1b46e4c2900bb159cafbd",
        "_id"     : "55b1ff1fca15939a23b7bed1",
        "subDish" : []
    }, {"number" : 1, "dish" : "55b1b46e4c2900bb159cafd2", "_id" : "55b1ff1fca15939a23b7bed0", "subDish" : []}],
    "isPromoOn"       : true,
    "isSpam"          : false,
    "credit"          : 0,
    "address"         : [{
        "mobile"        : "18629641521",
        "contactPerson" : "李凯",
        "geoLongitude"  : 121.4679209914917,
        "province"      : "上海",
        "_id"           : null,
        "street"        : "小木桥路中山南二路",
        "address"       : "510号3楼",
        "alias"         : "",
        "city"          : "上海市",
        "geoLatitude"   : 31.19758635531479,
        "district"      : "徐汇区",
        "country"       : "china",
        "remark"        : "",
        "sortOrder"     : 0,
        "isDefault"     : false,
        "isValid"       : true,
        "isTemporary"   : false
    }],
    "group"           : "member",
    "__v"             : 5
}, {
    "_id"             : "55b1f591ca15939a23b7bddb",
    "modifiedAt"      : "2015-07-24T08:41:11.610Z",
    "createdAt"       : "2015-07-24T08:21:37.528Z",
    "autoIncrementId" : 10040,
    "mobile"          : "18140031310",
    "pwd"             : "$2a$04$JN6a.aN8lEsq5VxVMktSP.GzKO5mXqOWrG/F2yFgOAktIRl6pJt0q",
    "dishLikeList"    : [],
    "couponList"      : [],
    "shoppingCart"    : [],
    "isPromoOn"       : true,
    "isSpam"          : false,
    "credit"          : 0,
    "address"         : [{
        "mobile"        : "18140031310",
        "contactPerson" : "索晶",
        "geoLongitude"  : 121.5055740059258,
        "province"      : "上海",
        "_id"           : null,
        "street"        : "上南三村小学",
        "address"       : "102",
        "alias"         : "",
        "city"          : "上海市",
        "geoLatitude"   : 31.1790064481098,
        "district"      : "普陀区",
        "country"       : "china",
        "remark"        : "",
        "sortOrder"     : 0,
        "isDefault"     : false,
        "isValid"       : true,
        "isTemporary"   : false
    }],
    "group"           : "member",
    "__v"             : 1
}, {
    "_id"             : "55b1fb37ca15939a23b7be72",
    "modifiedAt"      : "2015-07-24T08:45:43.643Z",
    "createdAt"       : "2015-07-24T08:45:43.643Z",
    "autoIncrementId" : 10041,
    "mobile"          : "15921170788",
    "pwd"             : "$2a$04$XnNMLrK/MxG8KphZqFEDMefNO0KQAJmBICUlEXsA5tsM3IAuiI1Li",
    "dishLikeList"    : [],
    "couponList"      : [],
    "shoppingCart"    : [],
    "isPromoOn"       : true,
    "isSpam"          : false,
    "credit"          : 0,
    "address"         : [],
    "group"           : "member",
    "__v"             : 0
}, {
    "_id"             : "55b1f20fca15939a23b7bcbb",
    "modifiedAt"      : "2015-07-24T08:49:04.955Z",
    "createdAt"       : "2015-07-24T08:06:39.925Z",
    "autoIncrementId" : 10039,
    "mobile"          : "15001992807",
    "pwd"             : "$2a$04$XtORFh3Wi16Y7E/aXywp2OcbMUdy4Lk4gbXwz1AP20pkQWLQILr66",
    "dishLikeList"    : [],
    "couponList"      : [],
    "shoppingCart"    : [{
        "number"  : 1,
        "dish"    : "55b1b46e4c2900bb159cafcd",
        "_id"     : "55b1fc00ca15939a23b7be96",
        "subDish" : []
    }, {
        "number"  : 3,
        "dish"    : "55b1b46e4c2900bb159cafb9",
        "_id"     : "55b1fc00ca15939a23b7be95",
        "subDish" : []
    }, {"number" : 1, "dish" : "55b0a37a181e6a7007c0371b", "_id" : "55b1fc00ca15939a23b7be94", "subDish" : []}],
    "isPromoOn"       : true,
    "isSpam"          : false,
    "credit"          : 0,
    "address"         : [{
        "mobile"        : "15001992807",
        "contactPerson" : "好",
        "geoLongitude"  : 114.0601080238275,
        "province"      : "湖北",
        "_id"           : null,
        "street"        : "武汉绕城高速公路",
        "address"       : "提供",
        "alias"         : "",
        "city"          : "武汉",
        "geoLatitude"   : 30.58156836263739,
        "district"      : "汉阳区",
        "country"       : "china",
        "remark"        : "",
        "sortOrder"     : 0,
        "isDefault"     : false,
        "isValid"       : true,
        "isTemporary"   : false
    }],
    "group"           : "member",
    "__v"             : 88
}, {
    "_id"             : "55b1fd92ca15939a23b7beae",
    "modifiedAt"      : "2015-07-24T08:55:46.136Z",
    "createdAt"       : "2015-07-24T08:55:46.136Z",
    "autoIncrementId" : 10042,
    "mobile"          : "13564516681",
    "pwd"             : "$2a$04$XqxseCma.to1WA3MksACdeP1kb9DOxnKf0rqeOp784KuTX8GtDLn2",
    "dishLikeList"    : [],
    "couponList"      : [],
    "shoppingCart"    : [],
    "isPromoOn"       : true,
    "isSpam"          : false,
    "credit"          : 0,
    "address"         : [],
    "group"           : "member",
    "__v"             : 0
}]