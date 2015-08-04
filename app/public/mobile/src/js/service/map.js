angular.module('xw.services').factory('Map', function ($http) {
    return {
        suggestion: function (query, region) {
            return $http.get('/mobile/placesuggestion?query=' + query + '&region=' + region)
        }
    }
})