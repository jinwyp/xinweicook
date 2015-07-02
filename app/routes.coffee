userController = require "./controllers/user.coffee"
tokenController = require "./controllers/token.coffee"
smsController = require "./controllers/sms.coffee"
articleController = require "./controllers/article.coffee"
dishController = require "./controllers/dish.coffee"
cookController = require "./controllers/cook.coffee"
couponController = require "./controllers/coupon.coffee"
tagController = require "./controllers/tag.coffee"
orderController = require "./controllers/order.coffee"





expressRoutes = (app) ->

  app.post("/api/orders/payment/alipay/mobile", orderController.updateOrderAlipayNotify)


  app.use libs.secure.middleware

  app.get("/api/dishes", dishController.dishList)
  app.get("/api/dishes/:_id", dishController.dishSingleInfo)

  app.get("/api/articles", articleController.articleList)
  app.get("/api/articles/:_id", articleController.articleSingleInfo)

  app.get("/api/tagfilters", tagController.tagFilterList)



  app.post("/api/user/token", tokenController.tokenSignIn)
  app.post("/api/user/logout", tokenController.tokenRevoke)

  app.post("/api/user/signup", userController.userSignUp)
  app.post("/api/user/sms", smsController.sendSMS)

  app.post("/api/user/resetpassword", userController.resetPassword)


  app.get("/api/user", libs.auth("member"), userController.userInfo)
  app.put("/api/user", libs.auth("member"), userController.updateUserInfo)
  app.post("/api/user/shoppingcart", libs.auth("member"), userController.updateShoppingCart)

  app.get("/api/orders", libs.auth("member"), orderController.orderListByUser)
  app.get("/api/orders/:_id", libs.auth("member"), orderController.orderSingleInfo)
  app.post("/api/orders", libs.auth("member"), orderController.addNewOrder)
  app.put("/api/orders/:_id", libs.auth("member"), orderController.updateOrder)






  app.post("/api/administrator/coupons", couponController.addNewCoupon)
  app.post("/api/administrator/coupons/user", couponController.assignCouponToUser)

  app.post("/api/administrator/dishes", dishController.addNewDish)
  app.post("/api/administrator/cooks", cookController.addNewCook)
  app.post("/api/administrator/tags", tagController.addNewTag)

  app.get("/api/administrator/initdish", dishController.initNewDish)
  app.get("/api/administrator/initcoupon", couponController.initNewCoupon)

module.exports = expressRoutes