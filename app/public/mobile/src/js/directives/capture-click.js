angular.module('xw.directives').directive('captureClick',function($parse, $rootScope) {
    /**
     * 监听capture阶段的事件
     * ng-click不支持capture阶段的事件监听,因为和jquery兼容的jqlite不支持.(jquery不支持是因为ie9以下只有冒泡)
     * 基于以下修改:https://github.com/angular/angular.js/blob/master/src/ng/directive/ngEventDirs.js
     */
    return {
        restrict: 'A',
        compile: function($element, attr) {
            var fn = $parse(attr.captureClick, /* interceptorFn */ null, /* expensiveChecks */ true);
            return function ngEventHandler(scope, element) {
                element[0].addEventListener('click', function (event) {
                    var callback = function() {
                        fn(scope, {$event:event});
                    };
                    if ($rootScope.$$phase) {
                        scope.$evalAsync(callback);
                    } else {
                        scope.$apply(callback);
                    }
                }, true);
            };
        }
    };
})