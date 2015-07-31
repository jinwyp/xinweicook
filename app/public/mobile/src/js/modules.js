angular.module('xw', ['xw.config', 'xw.login', 'xw.eat', 'xw.order', 'xw.weixin', 'xw.wxpay', 'xw.me', 'xw.orderlist', 'xw.services']);

angular.module('xw.config', ['ngStorage']);

angular.module('xw.models', ['ngStorage']);

angular.module('xw.login', ['xw.models']);

angular.module('xw.eat', ['xw.models']); // tmp

angular.module('xw.order', ['xw.models', 'xw.weixin']); // tmp

angular.module('xw.orderlist', ['xw.models']); // tmp

angular.module('xw.wxpay', ['xw.weixin']); // tmp

angular.module('xw.me', ['xw.models']); // tmp

angular.module('xw.weixin', []); // tmp

angular.module('xw.services', []);