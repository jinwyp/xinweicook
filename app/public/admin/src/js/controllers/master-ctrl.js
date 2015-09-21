/**
 * Master Controller
 */

angular.module('RDash')
    .controller('MasterCtrl', ['$scope', '$location', '$localStorage', '$http', 'User', MasterCtrl]);

function MasterCtrl($scope, $location, $localStorage, $http, User) {
    /**
     * Sidebar Toggle & Cookie Control
     */
    var mobileView = 992;

    $scope.getWidth = function() {
        return window.innerWidth;
    };

    $scope.$watch($scope.getWidth, function(newValue, oldValue) {
        if (newValue >= mobileView) {
            if (angular.isDefined($localStorage.toggle)) {
                $scope.toggle = ! $localStorage.toggle ? false : true;
            } else {
                $scope.toggle = true;
            }
        } else {
            $scope.toggle = false;
        }
    });

    $scope.toggleSidebar = function() {
        $scope.toggle = !$scope.toggle;
        $localStorage.toggle = $scope.toggle;
    };


    $scope.$on('$locationChangeSuccess', function () {
        $scope.path = $location.path();
    });

    $scope.$on('$stateChangeSuccess', function(event, toState){
        $scope.title = toState.data && toState.data.title
    });





    $scope.logout = function () {
        User.logOut().then(function () {
            $location.url('/login');
        })
    };

    $scope.inittag = function () {
        $http.get('/api/administrator/inittag');
    };
    $scope.initolddish = function () {
        $http.get('/api/administrator/initolddish');
    };
    $scope.initdishtopping = function () {
        $http.get('/api/administrator/initdishtopping');
    };

    $scope.initAdmin = function () {
        $http.get('/api/administrator/initadminuser')
    };


    $scope.removetag = function () {
        $http.get('/api/administrator/initremovetag');
    };
    $scope.removedish = function () {
        $http.get('/api/administrator/initremovedish');
    };
    $scope.removeinventory = function () {
        $http.get('/api/administrator/initremoveinventory');
    };
    $scope.removeorder = function () {
        $http.get('/api/administrator/initremoveorder');
    };
    $scope.removeuser = function () {
        $http.get('/api/administrator/initremoveuser');
    };
    $scope.removelog = function () {
        $http.get('/api/administrator/initremovelog');
    };
    $scope.removesetting = function () {
        $http.get('/api/administrator/initremovesetting');
    };


    $scope.changeCouponStartDate = function () {
        $http.post('/api/administrator/coupons/date');
    };

    $scope.addcoupons = function () {
        $http.post('/api/administrator/coupons').then(function(result){
            console.log (result.data);
            $scope.couponList = result.data
        });
    };


    window.onresize = function() {
        $scope.$apply();
    };
}