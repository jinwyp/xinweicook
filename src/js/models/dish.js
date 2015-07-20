angular.module('RDash.models').factory('Dish', function (Restangular) {
    return Restangular.service('dishes');
});