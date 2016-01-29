var articleController, cookController, couponController, deviceController, dishController, expressRoutes, initController, orderController, smsController, tagController, tokenController, userController;
initController = require("./controllers/initproject.coffee");
userController = require("./controllers/user.coffee");
deviceController = require("./controllers/device.coffee");
tokenController = require("./controllers/token.coffee");
smsController = require("./controllers/sms.coffee");
articleController = require("./controllers/article.coffee");
dishController = require("./controllers/dish.coffee");
cookController = require("./controllers/cook.coffee");
couponController = require("./controllers/coupon.coffee");
tagController = require("./controllers/tag.coffee");
orderController = require("./controllers/order.coffee");
couponController = require("./controllers/coupon.coffee");

var request = require('request');

expressRoutes = function(app) {


    var pathPrefix = '';
    if (process.env.NODE_ENV == 'production' || process.env.PREVIEW == 'true') {
        // views dir: /views/  .see app.coffee
        pathPrefix = 'mobile/'
    } else {
        // views dir: /public/
        pathPrefix = 'mobile/src/html/'
    }

    app.get("/", function (req, res) {
        res.redirect('/mobile');
    });


    app.get("/r/:id", function (req, res) {
        var urlMap = {
            // DiTui Promotion 01 01
            'DTP0101': '/mobile/login?couponcode=XWNODLVR01#/signup',
            'DTP0102': '/mobile/login?couponcode=XWNODLVR02#/signup',
            'DTP0103': '/mobile/login?couponcode=XWNODLVR03#/signup'
        };
        res.redirect(urlMap[req.params.id] || '/mobile');
    });

    app.get("/mobile", function (req, res) {
        res.render(pathPrefix + 'eat-list.html', {title: 'XinWeiCook'})
    });
    app.get("/mobile/login", function (req, res) {
        res.render(pathPrefix + 'login.html', {title: 'XinWeiCook'})
    });
    app.get("/mobile/resetpwd", function (req, res) {
        res.render(pathPrefix + 'reset-password.html', {title: 'XinWeiCook'})
    });
    app.get("/mobile/me", function (req, res) {
        res.render(pathPrefix + 'me.html', {title: 'XinWeiCook'})
    });
    app.get("/mobile/orderlist", function (req, res) {
        res.render(pathPrefix + 'order-list.html', {title: 'XinWeiCook'})
    });
    app.get("/mobile/orders", function (req, res) {
        res.render(pathPrefix + 'order-list2.html')
    })
    app.get("/mobile/addresslist", function (req, res) {
        res.render(pathPrefix + 'address-list.html', {title: 'XinweiCook'})
    });
    app.get("/mobile/wxpay/:id", function (req, res) {
        res.render(pathPrefix + 'wxpay.html', {title: 'XinWeiCook'})
    });
    app.get('/mobile/favlist', function (req, res) {
        res.render(pathPrefix + 'fav-list.html');
    });
    app.get('/mobile/cart', function (req, res) {
        res.render(pathPrefix + 'cart.html');
    });
    app.get('/mobile/cook/:id', function (req, res) {
        res.render(pathPrefix + 'cook.html');
    });
    app.get('/mobile/app', function (req, res) {
        res.render(pathPrefix + 'app.html');
    });
    app.get('/mobile/invite', function (req, res) {
        res.render(pathPrefix + 'invite.html');
    });
    app.get('/mobile/invited/:avatar/:code/:name/:place', function (req, res) {
        res.render(pathPrefix + 'invited.html');
    });
    app.get('/mobile/invited-app/:code', function (req, res) {
        res.render(pathPrefix + 'invited-app.html');
    });
    app.get('/mobile/coupons', function (req, res) {
        res.render(pathPrefix + 'coupons.html');
    });
    app.get("/mobile/alipay/return", function (req, res) {
        res.render(pathPrefix + 'alipay-notify.html');
    });
    app.get("/mobile/alipay/returnaccountdetail", function (req, res) {
        res.render(pathPrefix + 'alipay-notify.html');
    });
    app.get("/mobile/balance", function (req, res) {
        res.render(pathPrefix + 'balance.html');
    });
    app.get("/mobile/chargebalance", function (req, res) {
        res.render(pathPrefix + 'charge-balance.html');
    });
    app.get("/mobile/chargebalanceonline", function (req, res) {
        res.render(pathPrefix + 'charge-balance-online.html');
    });
    app.get("/mobile/balancerecords", function (req, res) {
        res.render(pathPrefix + 'balance-records.html');
    });
    app.get("/mobile/orderaddress", function (req, res) {
        res.render(pathPrefix + 'order-address.html');
    });
    app.get("/mobile/orderpay", function (req, res) {
        res.render(pathPrefix + 'order-pay.html');
    });
    app.get("/mobile/searchaddress", function (req, res) {
        res.render(pathPrefix + 'search-address.html');
    });

    app.get("/mobile/wxgzh", function (req, res) {
        res.render(pathPrefix + 'wxgzh-qrcode.html');
    });

    app.get('/mobile/promotion01', function (req, res) {
        res.render(pathPrefix + 'promotion01.html');
    })



    var warehouseCoords = {
        xinweioffice: {
            lat: 31.189426,
            lng: 121.460625
        },
        caohejing1: {
            lat: 31.169250,
            lng: 121.398949
        }
    };
    app.get('/mobile/distance', function (req, res, next) {
            // 使用gcj02坐标.
            var destinations = req.query.destinations || '';
            //var warehouse = warehouseCoords[req.query.warehouse || 'xinweioffice'] ;
            var office = warehouseCoords.xinweioffice;
            var chj1 = warehouseCoords.caohejing1;

            var ak = 'SwPFhM6Ari4IlyGW8Okcem2H';

            var params = 'origins=' + encodeURIComponent(office.lat + ',' + office.lng)
                    + '|' + encodeURIComponent(chj1.lat + ',' + chj1.lng) +
                '&destinations=' + encodeURIComponent(destinations) +
                '&ak=' + ak +
                '&output=json&mode=walking&coord_type=gcj02&tactics=12';
            var url = 'http://api.map.baidu.com/direction/v1/routematrix?' + params;

            console.log(url)
            request(url, function(err, response, body) {
                if (err) {
                    next(err)
                } else {
                    try {
                        res.json(JSON.parse(body));
                    } catch (e) {
                        next(e);
                    }
                }
            })
        }
    )

};


module.exports = expressRoutes;
