angular.module('RDash.models').factory('User', function ($http, $localStorage) {
    return {
        login: function (username, password) {
            return $http.post('/api/user/token', {
                username: username,
                password: password,
                grant_type: 'password'
            }).then(function (data) {
                if (data.data && data.data.access_token) {
                    $localStorage.access_token = data.data.access_token;
                }

                return data;
            })
        }
    }
});



angular.module('RDash.models').factory('Users', function (Restangular) {
    return Restangular.service('users');
});




angular.module('RDash.models').factory('Dishes', function (Restangular) {
    return Restangular.service('dishes');
});

angular.module('RDash.models').factory('Tags', function (Restangular) {
    return Restangular.service('tags');
});

angular.module('RDash.models').factory('Orders', function (Restangular) {
    return Restangular.service('orders');
});


angular.module('RDash.models').factory('Coupons', function (Restangular) {
    return Restangular.service('coupons');
});









angular.module('RDash.models').factory('Logs', function (Restangular) {
    return Restangular.service('logs');
});