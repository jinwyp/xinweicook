/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(191);

/***/ },

/***/ 191:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _jquery = __webpack_require__(192);

	var _jquery2 = _interopRequireDefault(_jquery);

	__webpack_require__(193);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	//ajax setting with access_token

	var cartObj;
	var cart;

	// load cart
	_jquery2.default.get('/api/user').then(function (res) {
	    cart = res.shoppingCart;
	    cartObj = cart.reduce(function (obj, item) {
	        var id = item.dish._id;
	        if (!obj[id]) {
	            obj[id] = item;
	        }
	        return obj;
	    }, {});

	    (0, _jquery2.default)('.menus > li, .eatlist > li, .product-info').each(function () {
	        var $li = (0, _jquery2.default)(this);
	        var id = $li.data('id');
	        if (cartObj[id]) {
	            $li.find('.plusok').html(cartObj[id].number).addClass('show');
	            $li.find('.mius').show();
	        }
	    });

	    var mobile = res.mobile;
	    (0, _jquery2.default)('#signin').hide();
	    (0, _jquery2.default)('#account').show().html(mobile.substr(0, 3) + '****' + mobile.substr(7, 4));
	});

	function postCart(_cart) {
	    _jquery2.default.post('/api/user/shoppingcart', JSON.stringify({
	        shoppingCart: _cart
	    })).then(function (res) {
	        cart = res.shoppingCart;
	    });
	}

	(0, _jquery2.default)(document).ready(function () {
	    // 添加值购物车事件绑定
	    (0, _jquery2.default)('.menus, .eatlist, .buy').on('click', '.plus, .mius', function () {
	        var _cart;
	        var $btn = (0, _jquery2.default)(this);
	        if (!cart) {
	            location.href = '/sign';
	            return;
	        }

	        var $li = $btn.closest('li, .product-info');
	        var id = $li.data('id');
	        var exist = false;
	        var emptyArray = [];

	        var isAdd = $btn.hasClass('plus');
	        var _number;
	        var oldLength = cart.length;
	        var newLength;

	        _cart = cart.map(function (item) {
	            var number = item.number;
	            if (id == item.dish._id) {
	                if (isAdd) number++;else number--;
	                _number = number;
	                exist = true;
	            }
	            return {
	                dish: item.dish._id,
	                number: number,
	                subDish: emptyArray
	            };
	        }).filter(function (item) {
	            return !!item.number;
	        });

	        newLength = _cart.length;

	        // 添加一个不存在购物车中的菜品到购物车
	        if (isAdd && !exist) {
	            _cart.push({
	                dish: id,
	                number: 1,
	                subDish: emptyArray
	            });
	            _number = 1;
	            $btn.siblings('.mius').show();
	        }

	        // 减去一个购物车中不存在的菜品
	        if (!isAdd && !exist) return;

	        var el = $li.find('.plusok').addClass('show');
	        el.html(_number);

	        // 如果购物车中的商品被删掉了
	        if (oldLength > newLength) {
	            el.removeClass('show');
	            $btn.hide();
	        }

	        postCart(_cart);
	    });

	    // tab切换事件绑定
	    var $tabs = (0, _jquery2.default)('.tabs > div');
	    var $tabBtnContainer = (0, _jquery2.default)('.tabbtn');
	    var $tabBtns = $tabBtnContainer.children();
	    $tabBtnContainer.on('click', function (e) {
	        var index = (0, _jquery2.default)(e.target).index();
	        $tabBtns.removeClass('act').eq(index).addClass('act');
	        $tabs.hide().eq(index).show();
	    });
	});

/***/ },

/***/ 192:
/***/ function(module, exports) {

	module.exports = jQuery;

/***/ },

/***/ 193:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _jquery = __webpack_require__(192);

	var _jquery2 = _interopRequireDefault(_jquery);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	if (localStorage.access_token) {
	    _jquery2.default.ajaxSetup({
	        headers: {
	            Authorization: 'Bearer ' + localStorage.access_token,
	            'Content-Type': 'application/json'
	        },
	        error: function error(xhr, status) {
	            console.log('err', status);
	        },
	        processData: false
	    });
	}

/***/ }

/******/ });