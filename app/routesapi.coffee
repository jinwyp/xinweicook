
initController = require "./controllers/initproject.coffee"
userController = require "./controllers/user.coffee"
deviceController = require "./controllers/device.coffee"
tokenController = require "./controllers/token.coffee"
smsController = require "./controllers/sms.coffee"
articleController = require "./controllers/article.coffee"
dishController = require "./controllers/dish.coffee"
cookController = require "./controllers/cook.coffee"
couponController = require "./controllers/coupon.coffee"
tagController = require "./controllers/tag.coffee"
orderController = require "./controllers/order.coffee"
couponController = require "./controllers/coupon.coffee"






expressRoutes = (app) ->
#  app.get("/adminnew", (req, res) ->
#    res.render('admin/index.html', { title : 'XinWeiCook' })
#  )

  app.post("/api/orders/payment/alipay/mobile", orderController.updateOrderAlipayNotify)
  app.post("/api/orders/payment/weixinpay/mobile", orderController.updateOrderWeixinPayNotify)

#  app.use libs.secure.middleware

  app.get("/api/dishes", dishController.dishList)
  app.get("/api/dishes/:_id", dishController.dishSingleInfo)
  app.put("/api/dishes/:_id/like", libs.auth("member"), dishController.updateDishStatisticLike)


  app.get("/api/articles", articleController.articleList)
  app.get("/api/articles/:_id", articleController.articleSingleInfo)

  app.get("/api/tagfilters", tagController.tagFilterList)



  app.post("/api/qiniu/token/upload", userController.getUploadQiniuToken)


  app.post("/api/user/device", deviceController.addNewDevice)
  app.post("/api/user/token", tokenController.tokenSignIn)
  app.post("/api/user/logout", tokenController.tokenRevoke)

  app.post("/api/user/signup", userController.userSignUp)
  app.post("/api/user/sms", smsController.sendSMS)

  app.post("/api/user/resetpassword", userController.resetPassword)


  app.get("/api/user", libs.auth("member"), userController.userInfo)
  app.get("/api/user/messages", libs.auth("member"), userController.getUserMessages)
  app.put("/api/user", libs.auth("member"), userController.updateUserInfo)
  app.post("/api/user/shoppingcart", libs.auth("member"), userController.updateShoppingCart)


  app.get("/api/coupons/:_id", libs.auth("member"), couponController.couponSingleInfo)
  app.get("/api/coupons/code/:code", libs.auth("member"), couponController.couponSingleInfoByCode)

  app.get("/api/orders", libs.auth("member"), orderController.orderListByUser)
  app.get("/api/orders/:_id", libs.auth("member"), orderController.orderSingleInfo)

  app.post("/api/orders", libs.auth("member"), orderController.addNewOrder)
  app.put("/api/orders/:_id", libs.auth("member"), orderController.updateOrder)
  app.post("/api/orders/delivery/time", libs.auth("member"), orderController.deliveryTimeArithmetic)


  app.get("/api/order/push", libs.auth("member"), orderController.pushMobileMessage)




  app.post("/api/administrator/coupons", couponController.addNewCoupon)
  app.post("/api/administrator/coupons/user", couponController.assignCouponToUser)

  app.post("/api/administrator/dishes", dishController.addNewDish)
  app.post("/api/administrator/cooks", cookController.addNewCook)
  app.post("/api/administrator/tags", tagController.addNewTag)




  app.get("/api/administrator/initadminuser", initController.createAdmin)
  app.get("/api/administrator/inittag", libs.auth("admin"), initController.createDishTag)
  app.get("/api/administrator/initolddish", libs.auth("admin"), initController.createOldDish)
  app.get("/api/administrator/initdishtopping", libs.auth("admin"), initController.initNewDish)

  app.get("/api/administrator/initcoupon", libs.auth("admin"), initController.initNewCoupon)
  app.get("/api/administrator/initremoveall", libs.auth("admin"), initController.removeDish)


module.exports = expressRoutes