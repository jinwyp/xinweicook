//generated by gulp errcode
angular.module("xw.config").constant("errCode", function(){
return {
    user: {
        // todo: 第二第三位的1 是什么意思, sms独立出来??
        wrongMobile   : 1110,
        wrongPassword : 1111,
        alreadyExist  : 1112,
        notFound      : 1113,

        addressIdNotFound : 1210,
        addressNotFound : 1212,

        addressLatitudeWrong  : 1220,
        addressLongitudeWrong : 1221,

        addressProvinceWrong     : 1222,
        addressCityWrong         : 1223,
        addressDistrictWrong     : 1224,
        addressStreetWrong       : 1225,
        addressStreetNumberWrong : 1226,
        addressAddressWrong      : 1227,

        addressContactPersonWrong : 1228,
        addressMobileWrong        : 1229,
        addressSortOrderWrong     : 1230

    },
    order: {
        wrongMobile: 2110
    },
    sms: {
        wrongCode: 3110,
        expired: 3111,
        invalidCode: 3112,
        wrongType: 3113,
        tooManyTries: 3114,
        sendFailed: 3115,
        reachSendLimitation: 3116
    },
    dish: {
        outOfStock: 4110
    },
    coupon: {
        notStart: 5110,
        expired: 5111,
        used: 5112,
        outOfCount: 5113
    }
};
});
angular.module('xw.config').factory('commonInterceptor', ['$localStorage', '$q', function($localStorage, $q) {
    var noRedirectPath = [/^\/mobile\/$/, /^\/mobile\/login/, /^\/mobile\/cook/, /^\/mobile\/cart/, /^\/mobile\/resetpwd$/];
    var noRedirectAPI = ['/api/user', '/api/user/token', '/api/user/shoppingcart'];
    var loginRedirectPath = ['/mobile/me', '/mobile/addresslist', '/mobile/orderaddress',
        '/mobile/invite', '/mobile/coupons', '/mobile/cook', '/mobile/balance', '/mobile/chargebalanceonline'];

    return {
        'request': function(config) {
            if ($localStorage.access_token) {
                config.headers.Authorization = 'Bearer ' + $localStorage.access_token;
            }

            return config;
        },

        'responseError': function(response) {
            // do something on error
            var redirectPath = '';
            if (response.status == 401) {
                // todo: redirect
                console.log(401);
                if (noRedirectPath.some(function (RE) {return RE.test(location.pathname)})) {
                    if (noRedirectAPI.indexOf(response.config.url) != -1) {
                        return $q.reject(response);
                    }
                }
                if (loginRedirectPath.some(function(path){
                        return location.pathname.indexOf(path) != -1
                    })) {
                    redirectPath = '?redirect=' + location.pathname
                }
                setTimeout(function () {
                    // todo:
                    location.replace('/mobile/login' + redirectPath);
                }, 120);
            }
            return $q.reject(response);
        }
    };
}]);


angular.module('xw.config').config(['$httpProvider',
    function($httpProvider) {
        $httpProvider.defaults.headers.common.Accept = 'application/vnd.cook.v1+json';
        $httpProvider.defaults.headers.common['Access-Control-Allow-Origin'] = 'http://m.xinweicook.com';
        $httpProvider.defaults.headers.common['Accept-Language'] = navigator.language == 'zh-CN' ? 'zh-CN' : 'en-US';
        $httpProvider.defaults.headers.common['Content-Type'] = 'application/json';


        $httpProvider.interceptors.push('commonInterceptor');
    }
]);


angular.pick = function (obj) {
    var keys = Array.prototype.slice.call(arguments, 1);
    return keys.reduce(function (o, k) {
        o[k] = obj[k];
        return o;
    }, {});
};

angular.sort = function sort (_array, compare) {
    var array = _array.slice(0);
    var tmp;
    for (var l = array.length - 1; l >= 1; l--) {
        for (var i = 0; i < l; i++) {
            var result = compare(array[i], array[i + 1]);
            if (result > 0) {
                tmp = array[i];
                array[i] = array[i + 1];
                array[i + 1] = tmp;
            }
        }
    }
    return array;
};
