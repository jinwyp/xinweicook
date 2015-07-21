/**
 * Master Controller
 */

angular.module('RDash')
    .controller('MasterCtrl', ['$scope', '$location', '$localStorage', MasterCtrl]);

function MasterCtrl($scope, $location, $localStorage) {
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

    $scope.$on('$stateChangeSuccess',
        function(event, toState){$scope.title = toState.data && toState.data.title});

    window.onresize = function() {
        $scope.$apply();
    };
}