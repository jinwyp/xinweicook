angular.module('xw.directives').directive('modal', function () {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            show: "=",
            close: '=',
            toggle: '='
        },
        templateUrl: 'modal.html',
        link: function (scope, el, attrs) {
            scope.css = {show: false};

            console.log(attrs.default);
            if (attrs.default == 'show') {
                scope.css.show = true;
            }

            scope.show = function () {
                setStatus(event, true);
            };

            scope.close = function () {
                setStatus(event, false);
            };

            scope.toggle = function () {
                console.log('eatTime');
                setStatus(event);
            };

            function setStatus(event, status) {
                event.stopPropagation();
                if (status === undefined) {
                    scope.css.show = !scope.css.show;
                } else {
                    scope.css.show = status;
                }
            }
        }
    }
});