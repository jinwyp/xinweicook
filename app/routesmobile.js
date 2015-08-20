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

    app.get("/mobile", function (req, res) {
        res.render('mobile/eat-list.html', {title: 'XinWeiCook'})
    });
    app.get("/mobile/login", function (req, res) {
        res.render('mobile/login.html', {title: 'XinWeiCook'})
    });
    app.get("/mobile/me", function (req, res) {
        res.render('mobile/me.html', {title: 'XinWeiCook'})
    });
    app.get("/mobile/order", function (req, res) {
        res.render('mobile/order.html', {title: 'XinWeiCook'})
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
    app.get('/mobile/app', function (req, res) {
        res.render('mobile/app.html');
    });
    app.get('/mobile/invite', function (req, res) {
        res.render('mobile/invite.html');
    });
    app.get('/mobile/invited/:avatar/:code/:name/:place', function (req, res) {
        res.render('mobile/invited.html');
    });
    app.get('/mobile/coupons', function (req, res) {
        res.render('mobile/coupons.html');
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

    app.get('/mobile/distance', function (req, res, next) {
            // 使用gcj02坐标.
            var lat = req.query.lat;
            var lng = req.query.lng;
            var xwLat = 31.189426;
            var xwLng = 121.460625;
            var ak = 'SwPFhM6Ari4IlyGW8Okcem2H';

            var params = 'origins=' + encodeURIComponent(xwLat + ',' + xwLng) +
                '&destinations=' + encodeURIComponent(lat + ',' + lng) +
                '&ak=' + ak +
                '&output=json&mode=walking&coord_type=gcj02&tactics=12';
            var url = 'http://api.map.baidu.com/direction/v1/routematrix?' + params;

            console.log('url:', url);

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