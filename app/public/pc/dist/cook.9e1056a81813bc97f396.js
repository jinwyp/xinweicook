webpackJsonp([6],{0:function(e,n,t){"use strict";function i(e){return e&&e.__esModule?e:{"default":e}}var r,u,s,o=t(119),a=t(45),c=t(74),d=i(c),f=t(120),l=i(f);(0,d["default"])(document).ready(function(){Promise.all([a.User.getUser(),a.Dish.getOne((0,d["default"])(".product-info").data("id"))]).then(function(e){s=e[0],r=[e[1]],u=s&&s.shoppingCart||[],(0,o.init)(s),(0,l["default"])(u,r,".product-info")})})},28:function(e,n){"use strict";function t(e){return{dish:e.dish._id,number:e.number,subDish:e.subDish.map(function(e){return{dish:e.dish._id,number:e.number}})}}function i(e,n){return"ready to cook"==e.dish.cookingType?e.dish.stockWarehouse.some(function(e){return e.stock>0}):e.dish.stockWarehouse.some(function(e){return(!n||e.warehouse==n)&&e.stock>0})&&e.subDish&&e.subDish.every(function(e){return i(e,n)})}function r(e){var n={};return e.forEach(function(e){var t=e.dish;t.stockWarehouse.forEach(function(e){var t=e.warehouse;t in n||(n[t]=!0),n[t]=n[t]&&e.stock>0})}),n}function u(e){return e.number*(e.dish.priceOriginal+(e.subDish?e.subDish.reduce(function(e,n){return e+n.dish.priceOriginal},0):0))}function s(e){var n=0;if(e.preferences.length)for(var t=e.preferences,i=0;i<t.length;i++)n+=t[i].foodMaterial.length;return n>1}function o(e,n){return e.dish._id==n.dish._id&&e.subDish.every(function(e){return n.subDish.some(function(n){return e.dish._id==n.dish._id})})&&e.subDish.length==n.subDish.length}function a(e,n){var t;if(!s(e)){var i;return n.some(function(n){return n.dish._id==e.id?(t=n,!0):void 0}),t?i=t.number++:(i=1,n.unshift({dish:e,number:i,subDish:[]})),i}}function c(e,n){var t;return n.some(function(i,r){return i.dish._id==e.id?(t=--i.number,0==t&&n.splice(r,1),!0):void 0}),t}function d(e,n){var t;return e.some(function(e){return e._id==n?(t=e,!0):void 0}),t}Object.defineProperty(n,"__esModule",{value:!0}),n.toPostDish=t,n.hasStock=i,n.availableWarehouse=r,n.price=u,n.hasMultipleSelections=s,n.isSameItemInCart=o,n.plusDish=a,n.minusDish=c,n.getDish=d},45:function(e,n,t){"use strict";function i(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(n,"__esModule",{value:!0}),n.User=n.Dish=void 0;var r=t(27),u=i(r),s=t(28),o=(n.Dish={getList:function(e){return e=e||{},(0,u["default"])("/api/dishes?cookingType="+(e.cookingType||"")+("&skip="+e.skip+"&limit="+e.limit))},getOne:function(e){return(0,u["default"])("/api/dishes/"+e)},like:function(e){return(0,r.put)("/api/dishes/"+e+"/like")}},null),a=n.User={getUser:function(){return(0,u["default"])("/api/user")["catch"](function(){return null})},logout:function(){return(0,r.post)("/api/user/logout",{token_type_hint:"access_token",token:localStorage.access_token})},postCart:function(e){return(0,r.post)("/api/user/shoppingcart",{shoppingCart:e.filter(function(e){return!!e.dish}).map(s.toPostDish)})},postCartRelax:function(e){o||(o=setTimeout(function(){return o=null,a.postCart(e)},2e3))}}},118:function(e,n,t){"use strict";function i(e){return e&&e.__esModule?e:{"default":e}}function r(e,n,t,i){var r=(0,o["default"])(e);r.on("click",n.plus,function(e){var n=(0,o["default"])(e.target).closest("[data-id]").data("id");n&&t(e,n)}),i&&n.minus&&(0,o["default"])(e).on("click",n.minus,function(e){var n=(0,o["default"])(e.target).closest("[data-id]").data("id");n&&i(e,n)})}function u(e,n,t){var i=arguments.length<=3||void 0===arguments[3]?".plusok":arguments[3],r=arguments.length<=4||void 0===arguments[4]?".mius":arguments[4],u=(0,o["default"])('[data-id="'+e+'"]'),s=u.find(i).html(n);0==n&&(s.removeClass("show"),u.find(r).hide()),n>=1&&!s.hasClass("show")&&s.addClass("show"),t&&n>0&&u.find(r).show()}Object.defineProperty(n,"__esModule",{value:!0}),n.bind=r,n.render=u;var s=t(74),o=i(s)},120:function(e,n,t){"use strict";function i(e){if(e&&e.__esModule)return e;var n={};if(null!=e)for(var t in e)Object.prototype.hasOwnProperty.call(e,t)&&(n[t]=e[t]);return n["default"]=e,n}Object.defineProperty(n,"__esModule",{value:!0}),n["default"]=function(e,n,t){function i(t){var i=s.getDish(n,t),u=s.plusDish(i,e);u?(r.User.postCartRelax(e),a.render(t,u,!0)):console.warn("todo: to complete")}function u(t){var i=s.getDish(n,t),u=s.minusDish(i,e);r.User.postCartRelax(e),a.render(t,u)}a.bind(t,{plus:".plus",minus:".mius"},function(e,n){i(n)},function(e,n){u(n)});var o={};e.forEach(function(e){var t=e.dish._id,i=s.getDish(n,t);o[t]?o[t]+=e.number:o[t]={number:e.number,showMinus:!s.hasMultipleSelections(i)}}),Object.keys(o).forEach(function(e){return a.render(e,o[e].number,o[e].showMinus)})};var r=t(45),u=t(28),s=i(u),o=t(118),a=i(o)}});
//# sourceMappingURL=cook.9e1056a81813bc97f396.js.map