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

    $scope.removecoupon = function () {
        $http.get('/api/administrator/initremovecoupon');
    };

    $scope.removeaccountdetail = function () {
        $http.get('/api/administrator/initremoveaccountdetail');
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






    $scope.chartTypes = [
        {"id": "line", "title": "Line"},
        {"id": "spline", "title": "Smooth line"},
        {"id": "area", "title": "Area"},
        {"id": "areaspline", "title": "Smooth area"},
        {"id": "column", "title": "Column"},
        {"id": "bar", "title": "Bar"},
        {"id": "pie", "title": "Pie"},
        {"id": "scatter", "title": "Scatter"}
    ];

    $scope.dashStyles = [
        {"id": "Solid", "title": "Solid"},
        {"id": "ShortDash", "title": "ShortDash"},
        {"id": "ShortDot", "title": "ShortDot"},
        {"id": "ShortDashDot", "title": "ShortDashDot"},
        {"id": "ShortDashDotDot", "title": "ShortDashDotDot"},
        {"id": "Dot", "title": "Dot"},
        {"id": "Dash", "title": "Dash"},
        {"id": "LongDash", "title": "LongDash"},
        {"id": "DashDot", "title": "DashDot"},
        {"id": "LongDashDot", "title": "LongDashDot"},
        {"id": "LongDashDotDot", "title": "LongDashDotDot"}
    ];

    $scope.chartSeries = [
        {"name": "Some data", "data": [1, 2, 4, 7, 3]},
        {"name": "Some data 3", "data": [3, 1, null, 5, 2], connectNulls: true},
        {"name": "Some data 2", "data": [5, 2, 2, 3, 5], type: "column"},
        {"name": "My Super Column", "data": [1, 1, 2, 3, 2], type: "column"}
    ];

    $scope.chartStack = [
        {"id": '', "title": "No"},
        {"id": "normal", "title": "Normal"},
        {"id": "percent", "title": "Percent"}
    ];

    $scope.addPoints = function () {
        var seriesArray = $scope.chartConfig.series;
        var rndIdx = Math.floor(Math.random() * seriesArray.length);
        seriesArray[rndIdx].data = seriesArray[rndIdx].data.concat([1, 10, 20])
    };

    $scope.addSeries = function () {
        var rnd = []
        for (var i = 0; i < 10; i++) {
            rnd.push(Math.floor(Math.random() * 20) + 1)
        }
        $scope.chartConfig.series.push({
            data: rnd
        })
    }

    $scope.removeRandomSeries = function () {
        var seriesArray = $scope.chartConfig.series;
        var rndIdx = Math.floor(Math.random() * seriesArray.length);
        seriesArray.splice(rndIdx, 1)
    }

    $scope.removeSeries = function (id) {
        var seriesArray = $scope.chartConfig.series;
        seriesArray.splice(id, 1)
    }

    $scope.toggleHighCharts = function () {
        this.chartConfig.useHighStocks = !this.chartConfig.useHighStocks
    }

    $scope.replaceAllSeries = function () {
        var data = [
            { name: "first", data: [10] },
            { name: "second", data: [3] },
            { name: "third", data: [13] }
        ];
        $scope.chartConfig.series = data;
    };

    $scope.chartConfig = {
        options: {
            chart: {
                type: 'areaspline'
            },
            plotOptions: {
                series: {
                    stacking: ''
                }
            }
        },
        series: $scope.chartSeries,
        title: {
            text: 'Hello'
        },
        credits: {
            enabled: true
        },
        xAxis: {
            categories: ['Apples', 'Pears', 'Oranges', 'Bananas', 'Carrots']
            //labels: {
            //    enabled: i === 0
            //}
        },
        loading: false,
        size: {}
    }
}