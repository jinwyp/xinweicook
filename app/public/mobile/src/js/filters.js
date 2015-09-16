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

angular.module('xw.filters').filter('fraction', function () {
    var superscripts = ['⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹'];
    var subscripts = ['\u2080', '\u2081', '\u2082', '\u2083', '\u2084',
        '\u2085', '\u2086', '\u2087', '\u2088', '\u2089'];
    return function (str) {
        return str.replace(/(\d+)\/(\d+)/g, function (_, sup, sub) {
            return superscripts[sup] + '⁄' + subscripts[sub] + ' ';
        })
    }
});