angular.module('xw', ['xw.config', 'xw.login']);

angular.module('xw.config', ['ngStorage', 'ui.router']);

angular.module('xw.models', ['ngStorage', 'restangular']);

angular.module('xw.login', ['xw.models']);