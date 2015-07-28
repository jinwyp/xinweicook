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
    app.get("/mobile/order/:id", function (req, res) {
        res.render('mobile/order.html', {title: 'XinWeiCook'})
    });

    app.get("/mobile/jsconfig")

};


module.exports = expressRoutes;