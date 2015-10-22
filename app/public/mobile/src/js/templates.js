angular.module("xw.directives").run(["$templateCache", function($templateCache) {$templateCache.put("add-dish-bar.html","<div class=\"selection-cover\" ng-cloak ng-if=\"dish\" ng-click=\"hide()\"></div><div class=\"selections-container\" ng-if=\"dish\" ng-cloak><div class=\"block\"><h4 class=\"text-center\">{{dish.title.zh}}<span ng-click=\"hide()\" class=\"button close-button\"></span></h4><ul class=\"properties\" ng-if=\"dish.preferences.length\"><li ng-repeat=\"property in dish.preferences\"><h5>{{property.name.zh}}</h5><ul class=\"selections\"><li ng-repeat=\"selection in property.foodMaterial\" ng-click=\"!selection.dish.outOfStock && (dish.curSelection[property.name.zh] = selection.dish)\" ng-class=\"{\'no-stock\': selection.dish.outOfStock, selected: dish.curSelection[property.name.zh] == selection.dish}\">{{selection.dish.title.zh}}</li></ul></li></ul><div class=\"counter-wrapper\"><i>份数</i><div class=\"counter text-center\"><span ng-click=\"dish.count>0 && (dish.count=dish.count-1)\" class=\"minus\">-</span> <span class=\"number\">{{dish.count}}</span> <span ng-click=\"dish.count=dish.count+1\" class=\"add\">+</span></div></div><div class=\"add-to-cart-button text-center\" ng-class=\"{invalid: dish.count == 0}\" ng-click=\"dish.count>0 && addToCart(dish)\">加入购物袋</div></div></div>");
$templateCache.put("geetest-sms-button.html","<div class=\"geetest-sms-button-group\"><div id=\"geetestContainer\" ng-show=\"state==2\"></div><span class=\"geetest-sms-button\" ng-if=\"state <= 1\" ng-class=\"{invalid: state === 0}\" ng-click=\"state == 1 && showGeetest()\">获取验证码</span> <span class=\"geetest-sms-button invalid\" ng-if=\"state == 3\">发送成功 {{remains}}</span> <span ng-click=\"state == 5 && getSmsCode()\" class=\"geetest-sms-button\" ng-class=\"{invalid: state == 4}\" ng-if=\"state > 3\">重新获取</span></div>");
$templateCache.put("shopping-progress-bar.html","<div class=\"shopping-progress-bar\"><div class=\"states\"><span ng-class=\"{cur: state == \'state1\'}\" class=\"state1\">筛选购物袋</span> <span ng-class=\"{cur: state == \'state2\'}\" class=\"state2\">确认送货地址</span> <span ng-class=\"{cur: state == \'state3\'}\" class=\"state3\">支付</span></div><div class=\"state-bar-container\"><div class=\"indicator\" ng-class=\"state\"></div></div></div>");
$templateCache.put("sms-button.html","<div class=\"sms-button-group\"><span class=\"sms-button\" ng-if=\"state <= 1\" ng-class=\"{invalid: state === 0}\" ng-click=\"state == 1 && getSmsCode()\">获取验证码</span> <span class=\"sms-button invalid\" ng-if=\"state == 2\">{{remains}}秒后重新获取</span> <span ng-click=\"state == 4 && getSmsCode()\" class=\"sms-button\" ng-class=\"{invalid: state == 3}\" ng-if=\"state > 2\">重新获取</span></div>");}]);