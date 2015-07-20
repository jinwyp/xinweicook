angular.module('RDash', ['ui.bootstrap', 'ui.router', 'RDash.config', 'RDash.models']);

angular.module('RDash.config', ['ngStorage', 'ui.router']);

angular.module('RDash.models', ['ngStorage', 'restangular']);