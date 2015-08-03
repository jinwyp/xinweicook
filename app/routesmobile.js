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

    app.get("/mobile/jsconfig")

};


module.exports = expressRoutes;