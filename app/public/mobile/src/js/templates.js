angular.module("xw.directives").run(["$templateCache", function($templateCache) {$templateCache.put("add-dish-bar.html","<div class=\"selection-cover\" ng-cloak ng-if=\"dish\" ng-click=\"hide()\"></div><div class=\"selections-container\" ng-if=\"dish\" ng-cloak><div class=\"block\"><h4 class=\"text-center\">{{dish.title.zh}}<span ng-click=\"hide()\" class=\"button close-button\"></span></h4><ul class=\"properties\" ng-if=\"dish.preferences.length\"><li ng-repeat=\"property in dish.preferences track by property._id\"><h5>{{property.name.zh}}</h5><ul class=\"selections\"><li ng-repeat=\"selection in property.foodMaterial track by selection._id\" ng-click=\"(!selection.dish.outOfStock && selection.dish.isPublished) && (dish.curSelection[property.name.zh] = selection.dish)\" ng-class=\"{\'no-stock\': (selection.dish.outOfStock || !selection.dish.isPublished), selected: dish.curSelection[property.name.zh] == selection.dish}\">{{selection.dish.title.zh}}</li></ul></li></ul><div class=\"counter-wrapper\"><i>份数</i><div class=\"counter text-center\"><span ng-click=\"dish.count>0 && (dish.count=dish.count-1)\" class=\"minus\">-</span> <span class=\"number\">{{dish.count}}</span> <span ng-click=\"dish.count=dish.count+1\" class=\"add\">+</span></div></div><div class=\"add-to-cart-button text-center\" ng-class=\"{invalid: dish.count == 0}\" ng-click=\"dish.count>0 && addToCart(dish)\">加入购物袋</div></div></div>");
$templateCache.put("address-list.html","<ul class=\"address-list\" capture-click=\"watchAddress($event)\"><li class=\"address-item\" ng-repeat=\"address in addresses\"><address cur=\"{{address.isDefault}}\" range=\"range\" out-address=\"address\" hide=\"hideAddress($index)\" leave=\"handler.leave[$index]\" save=\"handler.save[$index]\" valid=\"handler.valid[$index]\" delete-hook=\"remove($index)\"></address></li><li ng-if=\"range\" class=\"address-item\"><address range=\"range\" out-address=\"data.newAddress\" cur=\"{{!addresses.length}}\" hide=\"hideAddress(-2)\" leave=\"handler.leave.newAddress\" save=\"handler.save.newAddress\" valid=\"handler.valid.newAddress\"></address></li></ul>");
$templateCache.put("address-selection.html","<div class=\"address-selection\" flash-class=\"{exp: animateTrigger, duration: 400}\" ng-if=\"show\" ng-cloak><a href=\"/mobile/orderaddress?path={{path}}&dishId={{dishId}}\"><div ng-show=\"path != \'/eat\' && address\" class=\"address-tip\">配送至:{{address.street + address.address | limitTo: 18}}</div><div ng-show=\"noAddress\" class=\"no-address-tip\">您没有可以配送的地址,请先新建地址</div><div ng-show=\"path == \'/eat\' && (address && !address.isAvailableForEat)\" class=\"no-address-tip\">当前地址不在便当配送范围内(如果该地址以前可用,请点此重新编辑后再试)</div><div ng-show=\"path == \'/eat\' && address.isAvailableForEat\" class=\"address-tip\">配送至:{{address.street + address.address | limitTo: 18}}</div></a></div>");
$templateCache.put("address.html","<div ng-if=\"css.isNewAddress && css.edit\" class=\"new-address-tip\">请填写有效的地址以便按时送达</div><div ng-hide=\"hide()\" class=\"address-component\" ng-class=\"{cur: css.cur || css.isNewAddress, edit: css.edit}\" ng-click=\"choose($event)\"><div class=\"address-block\" ng-if=\"!css.isNewAddress\"><span class=\"deliverable-tag\" ng-if=\"addr.isAvailableForEat\">便当可送达</span><div>{{addr.contactPerson}}</div><div class=\"cur-show\">{{addr.mobile | beautifyMobile}}</div><div class=\"cur-show\">{{addr.province + \' \' + addr.city + \' \' + addr.district}}</div><div>{{addr.street}}</div><div class=\"cur-show\">{{addr.address}}</div><div class=\"user-actions\"><span class=\"glyphicon glyphicon-pencil\"></span> <span ng-click=\"deleteAddress($event)\" class=\"glyphicon glyphicon-trash\"></span></div></div><div class=\"new-address-block\" ng-if=\"css.isNewAddress && !css.edit\">+ 新建收货地址</div><form ng-model-options=\"{ updateOn: \'default blur\', debounce: { \'default\': 500, \'blur\': 0 } }\" ng-class=\"{\'new-address\': css.isNewAddress}\" ng-if=\"css.edit\" name=\"form\"><div ng-init=\"initForm(form, addr)\" ng-class=\"{\'with-tag\': addr.isAvailableForEat}\"><input name=\"contactPerson\" type=\"text\" placeholder=\"收货人\" ng-model=\"addr.contactPerson\" auto-focus minlength=\"2\" required><err-tip form=\"form\" name=\"contactPerson\" error=\"required\">必填</err-tip><err-tip form=\"form\" name=\"contactPerson\" error=\"minlength\">联系人姓名至少2个字</err-tip></div><div><input name=\"mobile\" type=\"tel\" placeholder=\"手机号\" ng-model=\"addr.mobile\" pattern=\"^1\\d{10}$\" required><err-tip form=\"form\" name=\"mobile\" error=\"required\">必填</err-tip><err-tip form=\"form\" name=\"mobile\" error=\"pattern\">请填写11位手机号</err-tip></div><div ng-show=\"!css.showFakeInput\" class=\"selects\"><div class=\"select\"><select required name=\"province\" id=\"province\" ng-options=\"province for province in options()\" ng-change=\"trySelectUnique()\" ng-model=\"addr.province\"></select></div><div class=\"select\"><select required name=\"city\" id=\"city\" ng-options=\"city for city in options(addr.province)\" ng-model=\"addr.city\"></select></div><div class=\"select\"><select required name=\"district\" id=\"district\" ng-options=\"district for district in options(addr.province, addr.city)\" ng-model=\"addr.district\"></select></div></div><div ng-if=\"css.showFakeInput\"><input type=\"text\" placeholder=\"省、市、区\" ng-click=\"css.showFakeInput = false\"> <span class=\"err-tip\" ng-if=\"(form.province.$error.required||form.city.$error.required||form.district.$error.required) &&form.$submitted\">必填</span></div><div ng-click=\"showSearchAddress()\">{{addr.street}} <input type=\"hidden\" name=\"street\" placeholder=\"街道\" ng-model=\"addr.street\" required> <span ng-if=\"!addr.street\" class=\"placeholder\">街道</span><err-tip form=\"form\" name=\"street\" error=\"required\">必填</err-tip></div><div><input name=\"address\" type=\"text\" minlength=\"2\" placeholder=\"楼层、门牌号\" required ng-model=\"addr.address\"><err-tip form=\"form\" name=\"address\" error=\"required\">必填</err-tip><err-tip form=\"form\" name=\"address\" error=\"minlength\">至少2个字符</err-tip></div></form><div class=\"search-address\" ng-if=\"css.edit && css.showSearchAddress\"><form id=\"address-form\"><div><input type=\"text\" placeholder=\"小区、写字楼、地标名称\" id=\"address\" ng-model=\"data.street\" ng-model-options=\"{debounce: 400}\" auto-focus ng-change=\"searchAddress()\"></div></form><div class=\"find-address-tip\" ng-if=\"data.streetList.length\">您要找的是不是?</div><div class=\"no-address-tip\" ng-if=\"data.street && !data.streetList.length\"><h4>未能找到此地址</h4><p>建议只输入小区、写字楼、地标名称等</p></div><ul class=\"results\"><li ng-click=\"confirmStreet($event, street)\" ng-repeat=\"street in data.streetList\"><h4>{{street.name}}</h4><p>{{street.address}}</p></li></ul></div></div>");
$templateCache.put("confirm.html","<div class=\"xw-confirm\" ng-click><modal close=\"close\" show=\"showModal\" pre-close=\"preClose\"><div class=\"text\" ng-transclude></div><div class=\"button-group\"><span ng-click=\"cancel()\">取消</span><span ng-click=\"confirm()\">确定</span></div></modal></div>");
$templateCache.put("err-tip.html","<span class=\"err-tip\" ng-if=\"(form[name].$dirty||form.$submitted) && form[name].$error[error]\" ng-transclude></span>");
$templateCache.put("geetest-sms-button.html","<div class=\"geetest-sms-button-group\"><div id=\"geetestContainer\" ng-show=\"state==2\"></div><span class=\"geetest-sms-button\" ng-if=\"state <= 1\" ng-class=\"{invalid: state === 0}\" ng-click=\"state == 1 && showGeetest()\">获取验证码</span> <span class=\"geetest-sms-button invalid\" ng-if=\"state == 3\">发送成功 {{remains}}</span> <span ng-click=\"state == 5 && showGeetest()\" class=\"geetest-sms-button\" ng-class=\"{invalid: state == 4}\" ng-if=\"state > 3\">重新获取</span></div>");
$templateCache.put("menu-nav.html","<nav class=\"menu-nav\" ng-class=\"{\'empty\': !localBag.length}\"><div><a href=\"/mobile/me\"><span>帐号</span></a></div><div ng-class=\"{active: path == \'/eat\'}\"><a href=\"/mobile/#/eat\"><span>便当</span></a></div><div ng-class=\"{active: path == \'/cook\' || !path}\"><a href=\"/mobile/#/cook\"><span>食材包</span></a></div><div class=\"go-to-cart\" ng-class=\"{invalid: !isAddressOk()}\" ng-if=\"localBag.length\" flash-class=\"{exp: localBag.length, duration: 400}\" ng-click=\"isAddressOk({isClick: true}) && goToCart()\"><div class=\"icon bag-icon\"><i class=\"number\" ng-bind=\"localBag.length\"></i></div><span class=\"price\" ng-bind=\"localBag.price || 0 | number: 1\"></span></div></nav>");
$templateCache.put("modal.html","<div class=\"xw-modal-container\" ng-show=\"css.show\"><div class=\"xw-modal-backdrop\" ng-click=\"close()\"></div><div class=\"xw-modal-content\" ng-transclude></div></div>");
$templateCache.put("shopping-progress-bar.html","<div class=\"shopping-progress-bar\"><div class=\"states\"><span ng-class=\"{cur: state == \'state1\'}\" class=\"state1\">筛选购物袋</span> <span ng-class=\"{cur: state == \'state2\'}\" class=\"state2\">确认送货地址</span> <span ng-class=\"{cur: state == \'state3\'}\" class=\"state3\">支付</span></div><div class=\"state-bar-container\"><div class=\"indicator\" ng-class=\"state\"></div></div></div>");
$templateCache.put("sms-button.html","<div class=\"sms-button-group\"><span class=\"sms-button\" ng-if=\"state <= 1\" ng-class=\"{invalid: state === 0}\" ng-click=\"state == 1 && getSmsCode()\">获取验证码</span> <span class=\"sms-button invalid\" ng-if=\"state == 2\">{{remains}}秒后重新获取</span> <span ng-click=\"state == 4 && getSmsCode()\" class=\"sms-button\" ng-class=\"{invalid: state == 3}\" ng-if=\"state > 2\">重新获取</span></div>");}]);