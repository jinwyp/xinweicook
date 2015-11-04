angular.module('xw.directives').directive('imgLazyLoad', ['$window', '$document', '$timeout', function ($window, $document, $timeout) {

    var lazyDOMs = [],
        document = $document[0],
        windowBottom;

    /**
     * 获取目标元素距离根元素的高度
     */
    function getDOMTop(elem) {
        var top = elem.offsetTop;
        while (elem = elem.offsetParent) {
            top += elem.offsetTop
        }
        return top;
    }

    function getWindowBottom() {
        return document.documentElement.clientHeight + ($window.scrollY ||
            document.documentElement.scrollTop || document.body.scrollTop);
    }

    getWindowBottom.ok = true;

    angular.element($window).on('scroll', function () {
        windowBottom = getWindowBottom();
        for (var i = 0, el; i < lazyDOMs.length;) {
            if (getDOMTop(lazyDOMs[i][0]) < windowBottom) {
                el = angular.element(lazyDOMs[i][0]);
                el[0].src = lazyDOMs[i][1].$eval(el.attr('img-lazy-load'));
                lazyDOMs.splice(i, 1);
            } else {
                i++;
            }
        }
    });

    return {
        restrict: 'A',
        link: function (scope, el, attr) {
            var dom = el[0];
            lazyDOMs.push([dom, scope]);
            var unwatcher = scope.$watch(attr.imgLazyLoad, function (src) {
                if (src) {
                    unwatcher();
                    if (getWindowBottom.ok) {
                        windowBottom = getWindowBottom();
                        getWindowBottom.ok = false;
                        setTimeout(function () {
                            getWindowBottom.ok = true;
                        }, 120); // 120 ms内不再计算window bottom
                        // qq 浏览器会忽略100ms以下的setTimeout !!!!
                        // http://www.qianduan.net/qqliu-lan-qi-x5nei-he-wen-ti-hui-zong/
                    }
                    // todo: 试着用setTimeout来比较这里的性能
                    if (getDOMTop(dom) < windowBottom) {
                        lazyDOMs.some(function (pair, i) {
                            if (pair[0] == dom) {
                                dom.src = src;
                                lazyDOMs.splice(i, 1);
                                return true;
                            }
                        })
                    }
                }
            });

            if (!scope._lazyDestroyBinded) {
                scope._lazyDestroyBinded = true;
                scope.$on('$destroy', function () {
                    for (var i = 0; i < lazyDOMs.length;) {
                        if (lazyDOMs[i][1] == scope) {
                            lazyDOMs.splice(i, 1);
                        } else {
                            i++;
                        }
                    }
                })
            }
        }
    }
}])