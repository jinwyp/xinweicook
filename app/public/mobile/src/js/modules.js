angular.module('xw', ['xw.config', 'xw.login', 'xw.eat', 'xw.order', 'xw.me', 'xw.weixin']);

angular.module('xw.config', ['ngStorage']);

angular.module('xw.models', ['ngStorage']);

angular.module('xw.login', ['xw.models']);

angular.module('xw.eat', ['xw.models']); // tmp

angular.module('xw.order', ['xw.models']); // tmp

angular.module('xw.me', ['xw.models']); // tmp

angular.module('xw.weixin', []);