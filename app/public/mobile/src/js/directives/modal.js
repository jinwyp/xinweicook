angular.module('xw.directives').directive('modal', function () {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            show: "=",
            close: '=',
            toggle: '=',
            preClose: '=?'
        },
        templateUrl: 'modal.html',
        link: function (scope, el, attrs) {
            scope.css = {show: false};

            if (attrs.default == 'show') {
                scope.css.show = true;
            }

            scope.show = function () {
                setStatus(event, true);
            };

            scope.close = function (ignorePreClose) {
                if (!ignorePreClose && scope.preClose) {
                    scope.preClose();
                }
                setStatus(event, false);
            };

            scope.toggle = function () {
                setStatus(event);
            };

            function setStatus(event, status) {
                event && event.stopPropagation();
                if (status === undefined) {
                    scope.css.show = !scope.css.show;
                } else {
                    scope.css.show = status;
                }
            }
        }
    }
});