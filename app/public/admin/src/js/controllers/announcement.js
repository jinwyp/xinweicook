/**
 * Created by jinwyp on 7/22/15.
 */





angular
    .module('RDash')
    .controller('AnnouncementController', ['$scope', '$timeout', '$state', '$stateParams', 'Notification', 'Util', 'Announcements', 'Statistic', announcementController ]);



function announcementController($scope, $timeout, $state, $stateParams, Notification, Util, Announcements, Statistic) {

    $scope.data = {
        searchFilter : '',
        searchOptions : {
            sort : '-createdAt',

            skip : 0,
            limit : 200,
            query : {
                priority : '',
                clientFor : '',
                appVersion : '',
                isActivated : '',
                _id : ''

            }

        },
        
        announcementListCount : 0,
        announcementListCurrentPage : 1,
        announcementListTotalPages : 1,
        announcementListPagesArray : [],

        currentDeleteIndex : -1,

        announcementList : [],
        announcement : {
            title:{
                zh : '',
                en : ''
            },

            description:{
                zh : '',
                en : ''
            },
            priority : 10,
            clientFor : 'all',
            appVersion : ''
        },


        clientForList : [
            {
                name : 'ALL',
                value : ''
            },

            {
                name : '所有端',
                value : 'all'
            },
            {
                name : 'iOS 苹果APP',
                value : 'ios'
            },
            {
                name : 'Android APP',
                value : 'android'
            },
            {
                name : '微信',
                value : 'wechat'
            },
            {
                name : '网站',
                value : 'website'
            }
        ],

        priorityList : [
            {
                name : 'ALL',
                value : ''
            },

            {
                name : '一般(首页)',
                value : 10
            },
            {
                name : '重要(订单结算页面)',
                value : 20
            }
        ],

        isActivatedList : [
            {
                name : 'ALL',
                value : ''
            },

            {
                name : '未发布',
                value : 'false'
            },
            {
                name : '已发布',
                value : 'true'
            }
        ]
    };

    $scope.css = {
        isAddNewStatus : true
    };




    $scope.searchAnnouncementsCount = function (){

        Util.delProperty($scope.data.searchOptions.query);

        Announcements.one('count').get(Util.formatParam($scope.data.searchOptions)).then(function (resultAnnouncements) {

            $scope.data.announcementListCount = resultAnnouncements.count;
            $scope.data.announcementListTotalPages = Math.ceil(resultAnnouncements.count / $scope.data.searchOptions.limit);

            $scope.data.announcementListPagesArray= [];
            for (var i = 1; i <= $scope.data.announcementListTotalPages; i++){
                $scope.data.announcementListPagesArray.push( {value : i} )
            }

            $scope.searchAnnouncements();

        });
    };

    $scope.searchAnnouncements = function (form) {
        Util.delProperty($scope.data.searchOptions.query);

        Announcements.getList(Util.formatParam($scope.data.searchOptions, true)).then(function (resultAnnouncements) {
            $scope.data.announcementList = resultAnnouncements;
            Notification.success({message: 'Search Success! ', delay: 8000});

        }).catch(function(err){
            Notification.error({message: "Search Failure! Status:" + err.status + " Reason: " + err.data.message , delay: 5000});
        });

    };

    $scope.changePagination = function (currentPageNo) {
        $scope.data.announcementListCurrentPage = currentPageNo;
        $scope.data.searchOptions.skip = ($scope.data.announcementListCurrentPage-1) * $scope.data.searchOptions.limit;
        $scope.searchAnnouncements();
    };




    if ($state.current.data.type === 'list'){
        $scope.searchAnnouncementsCount();
    }

    if ($state.current.data.type === 'update'){
        $scope.css.isAddNewStatus = false;

        Announcements.one($stateParams.id).get().then(function (resutlAnnouncements) {
            $scope.data.announcement = resutlAnnouncements;
        });
    }



    $scope.delAnnouncement = function (order) {

        var index = $scope.data.announcementList.indexOf(order);

        $scope.data.announcementList[index].remove().then(function (resultAnnouncements) {
            $scope.searchAnnouncementsCount();

            Notification.success({message : 'Delete Success', delay : 8000});

        }).catch(function (err) {
            Notification.error({
                message : "Delete Failure! Status:" + err.status + " Reason: " + err.data.message,
                delay   : 5000
            });
        });

    };


    $scope.addNewAnnouncement = function (form) {
        if (form.$invalid) {
            return;
        }

        var newAnnouncements = angular.copy($scope.data.announcement);
        Util.delProperty(newAnnouncements);
        Announcements.post(newAnnouncements).then(function (resultAnnouncements) {
            Notification.success({message: 'Save Success', delay: 4000});

        }).catch(function(err){
            Notification.error({message: "Update Failure! Status:" + err.status + " Reason: " + err.data.message , delay: 7000});
        });
    };

    $scope.updateAnnouncement = function (form) {

        if (form.$invalid) {
            return;
        }

        $scope.data.announcement.put().then(function (resultAnnouncements) {
            Notification.success({message: 'Update Success', delay: 4000});
        }).catch(function(err){
            console.log(err);
            Notification.error({message: "Update Failure! Status:" + err.status + " Reason: " + err.data.message , delay: 7000});
        });
    };







}
