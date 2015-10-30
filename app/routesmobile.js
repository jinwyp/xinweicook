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
        res.render('mobile/eat-list.html', {title: 'XinWeiCook'})
    });
    app.get("/mobile/login", function (req, res) {
        res.render('mobile/login.html', {title: 'XinWeiCook'})
    });
    app.get("/mobile/resetpwd", function (req, res) {
        res.render('mobile/reset-password.html', {title: 'XinWeiCook'})
    });
    app.get("/mobile/me", function (req, res) {
        res.render('mobile/me.html', {title: 'XinWeiCook'})
    });
    app.get("/mobile/orderlist", function (req, res) {
        res.render('mobile/order-list.html', {title: 'XinWeiCook'})
    });
    app.get("/mobile/addresslist", function (req, res) {
        res.render('mobile/address-list.html', {title: 'XinweiCook'})
    });
    app.get("/mobile/addressedit", function (req, res) {
        res.render('mobile/address-edit.html', {title: 'XinweiCook'})
    });
    app.get("/mobile/wxpay/:id", function (req, res) {
        res.render('mobile/wxpay.html', {title: 'XinWeiCook'})
    });
    app.get('/mobile/favlist', function (req, res) {
        res.render('mobile/fav-list.html');
    });
    app.get('/mobile/cart', function (req, res) {
        res.render('mobile/cart.html');
    });
    app.get('/mobile/cook/:id', function (req, res) {
        res.render('mobile/cook.html');
    });
    app.get('/mobile/app', function (req, res) {
        res.render('mobile/app.html');
    });
    app.get('/mobile/invite', function (req, res) {
        res.render('mobile/invite.html');
    });
    app.get('/mobile/invited/:avatar/:code/:name/:place', function (req, res) {
        res.render('mobile/invited.html');
    });
    app.get('/mobile/invited-app/:code', function (req, res) {
        res.render('mobile/invited-app.html');
    });
    app.get('/mobile/coupons', function (req, res) {
        res.render('mobile/coupons.html');
    });
    app.get("/mobile/alipay/return", function (req, res) {
        res.render('mobile/alipay-notify.html');
    });
    app.get("/mobile/alipay/returnaccountdetail", function (req, res) {
        res.render('mobile/alipay-notify.html');
    });
    app.get("/mobile/balance", function (req, res) {
        res.render('mobile/balance.html');
    });
    app.get("/mobile/chargebalance", function (req, res) {
        res.render('mobile/charge-balance.html');
    });
    app.get("/mobile/chargebalanceonline", function (req, res) {
        res.render('mobile/charge-balance-online.html');
    });
    app.get("/mobile/balancerecords", function (req, res) {
        res.render('mobile/balance-records.html');
    });
    app.get("/mobile/orderaddress", function (req, res) {
        res.render('mobile/order-address.html');
    });
    app.get("/mobile/orderpay", function (req, res) {
        res.render('mobile/order-pay.html');
    });
    app.get("/mobile/searchaddress", function (req, res) {
        res.render('mobile/search-address.html');
    });

    app.get("/mobile/wxgzh", function (req, res) {
        res.render('mobile/wxgzh-qrcode.html');
    });



    // 百度place suggestion api不支持jsonp, 只好在服务器端请求
    app.get("/mobile/placesuggestion", function (req, res, next) {
        var query = req.query.query;
        var region = req.query.region;
        var ak = 'SwPFhM6Ari4IlyGW8Okcem2H';

        var params = 'query=' + encodeURIComponent(query) + '&' +
                'region=' + encodeURIComponent(region) + '&' +
                'ak=' + ak + '&' +
                'output=json';

        var url = 'http://api.map.baidu.com/place/v2/suggestion?' + params;
        request(url, function (err, response, body) {
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
    });

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
            var warehouse = warehouseCoords[req.query.warehouse || 'xinweioffice'] ;

            var xwLat = warehouse.lat;
            var xwLng = warehouse.lng;
            var ak = 'SwPFhM6Ari4IlyGW8Okcem2H';

            var params = 'origins=' + encodeURIComponent(xwLat + ',' + xwLng) +
                '&destinations=' + encodeURIComponent(destinations) +
                '&ak=' + ak +
                '&output=json&mode=walking&coord_type=gcj02&tactics=12';
            var url = 'http://api.map.baidu.com/direction/v1/routematrix?' + params;

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