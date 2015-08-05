angular.module('xw', ['xw.config', 'xw.services', 'xw.controllers']);

angular.module('xw.config', ['ngStorage']);

angular.module('xw.models', ['ngStorage']);

angular.module('xw.controllers', ['xw.models', 'xw.weixin']);

angular.module('xw.weixin', []); // tmp

angular.module('xw.services', []);