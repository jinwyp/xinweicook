angular.module('xw.filters').filter('adapt', function () {
    var width = Math.floor(screen.width * window.devicePixelRatio);
    var height = Math.floor(width * 2 / 3);
    var query = '?imageView2/1/w/' + width + '/h/' + height;
    return function (src) {
        return src + query;
    }
});