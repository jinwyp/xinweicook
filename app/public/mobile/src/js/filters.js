angular.module('xw.filters').filter('adapt', function () {
    var width = Math.floor(screen.width * window.devicePixelRatio);
    var height = Math.floor(width * 2 / 3);
    var prefix = '?imageView2/1/w/';
    var query = prefix + width + '/h/' + height;
    return function (src, ratio) {
        return src + (ratio ?
                prefix + width + '/h/' + Math.floor(width * ratio) :
                query)
    }
});