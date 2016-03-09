angular.module('xw.directives').directive('flashClass', function () {
    return {
        restrict: 'A',
        scope: {options: '=flashClass'},
        link: function (scope, el) {
            var time = scope.options.duration || 700;
            var className = scope.options.className || 'flash';
            scope.$watch('options.exp', function (newVal) {
                if (newVal) {
                    setTimeout(function () {
                        el.addClass(className);
                        setTimeout(function () {
                            el.removeClass(className)
                        }, time)
                    }, 200)
                }
            })
        }
    }
});