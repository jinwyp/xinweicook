weixinPay = require "./libs/weixinpay.js"
geetest = require("./libs/geetest.js");



initController = require "./controllers/initproject.coffee"
deliveryTraceController = require "./controllers/deliveryTrace.coffee"
userController = require "./controllers/user.coffee"
deviceController = require "./controllers/device.coffee"
tokenController = require "./controllers/token.coffee"
smsController = require "./controllers/sms.coffee"
articleController = require "./controllers/article.coffee"
announcementController = require "./controllers/announcement.coffee"
dishController = require "./controllers/dish.coffee"
cookController = require "./controllers/cook.coffee"
couponController = require "./controllers/coupon.coffee"
tagController = require "./controllers/tag.coffee"
orderController = require "./controllers/order.coffee"
deliveryController = require "./controllers/delivery.js"
dishStatController = require "./controllers/dishStatistic.js"
orderStatController = require "./controllers/orderStatistic.js"
userStatController = require "./controllers/userStatistic.js"


cronJobController = require "./controllers/cronjob.coffee"






#cronJobController.runCronJob()


expressRoutes = (app) ->
#  app.get("/adminnew", (req, res) ->
#    res.render('admin/index.html', { title : 'XinWeiCook' })
#  )




  app.post("/api/orders/payment/alipay/mobile", orderController.updateOrderAlipayNotify)
  app.post("/api/orders/payment/alipay/notify/account", userController.chargeAccountAlipayNotify)

  app.post("/mobile/wxpay/notify", weixinPay.parserNotifyMiddleware, orderController.updateOrderWeixinPayNotify)
  app.post("/mobile/wxpay/notifyaccountdetail", weixinPay.parserNotifyMiddleware, userController.chargeAccountWeixinPayNotify)

  app.get("/api/orders/payment/weixinpay/oauthcode", orderController.getWeixinPayUserOauthCode)
  app.get("/api/orders/payment/weixinpay/openid", orderController.getWeixinPayUserOpenId)




#  app.use libs.secure.middleware

  app.get("/api/announcements", announcementController.getAnnouncementList)
  app.get("/api/announcements/:_id", announcementController.getSingleAnnouncement)

  app.get("/api/dishes", dishController.dishList)
  app.get("/api/dishes/:_id", dishController.dishSingleInfo)
  app.put("/api/dishes/:_id/like", libs.auth("member"), dishController.updateDishStatisticLike)


  app.get("/api/articles", articleController.articleList)
  app.get("/api/articles/:_id", articleController.articleSingleInfo)

  app.get("/api/tagfilters", tagController.tagFilterList)



  app.post("/api/qiniu/token/upload", userController.getUploadQiniuToken)

  app.get("/api/user/weixin/oauthcode", userController.getWeixinUserOauthCode)
  app.get("/api/user/weixin/openid", userController.getWeixinUserOpenId)
  app.get("/api/user/weixin/userinfo", userController.getWeixinUserInfo)

  app.post("/api/user/device", deviceController.addNewDevice)
  app.post("/api/user/token", tokenController.tokenSignIn)
  app.post("/api/user/logout", tokenController.tokenRevoke)

  app.get("/api/user/signup/geetest/register", geetest.getGeeTestRegisterChallenge)
  #app.post("/api/user/sms", smsController.sendSMS)
  app.post("/api/user/sms", geetest.middleware, smsController.sendSMS)
  app.post("/api/user/signup", userController.userSignUp)

  app.post("/api/user/resetpassword", userController.resetPassword)


  app.get("/api/user", libs.auth("member"), userController.userInfo)
  app.get("/api/user/address", libs.auth("member"), userController.getUserAddress)
  app.post("/api/user/address", libs.auth("member"), userController.addNewAddress)
  app.put("/api/user/address/:_id", libs.auth("member"), userController.updateAddress)
  app.delete("/api/user/address/:_id", libs.auth("member"), userController.deleteAddress)
  app.post("/api/user/address/suggestion", libs.auth("member"), userController.getPlaceSuggestion)



  app.get("/api/user/coupon/friends", libs.auth("member"), couponController.getCouponForUserShare)
  app.get("/api/user/coupon/invitation/:invitationCode", libs.auth("member"), couponController.getCouponForUserInvitationSendCode)
  app.get("/api/user/coupon/code/:code", libs.auth("member"), couponController.getCouponFromCouponCode)



  app.get("/api/user/messages", libs.auth("member"), userController.getUserMessages)
  app.put("/api/user", libs.auth("member"), userController.updateUserInfo)
  app.post("/api/user/shoppingcart", libs.auth("member"), userController.updateShoppingCart)


  app.get("/api/user/account", libs.auth("member"), userController.userInfoAccount)
  app.get("/api/user/account/details", libs.auth("member"), userController.userAccountDetail)
  app.post("/api/user/account/details", libs.auth("member"), userController.chargeAccount)
  app.post("/api/user/account/chargecode", libs.auth("member"), userController.chargeAccountFromAccoutChargeCode)

  app.get("/api/coupons/:_id", libs.auth("member"), couponController.couponSingleInfo)
  app.get("/api/coupons/code/:code", libs.auth("member"), couponController.couponSingleInfoByCode)

  app.get("/api/orders", libs.auth("member"), orderController.orderListByUser)
  app.get("/api/orders/:_id", libs.auth("member"), orderController.orderSingleInfo)


  app.post("/api/orderprice", libs.auth("member"), orderController.calculateOrderPrice)
  app.post("/api/orders", libs.auth("member"), orderController.addNewOrder)
  app.post("/api/orders/payment/weixinpay/unifiedorder", libs.auth("member"), orderController.generateWeixinPayUnifiedOrder)
  app.post("/api/orders/payment/weixinpay/config", userController.getWeixinDeveloperJsapiTicket) ##去掉libs.auth("member"), 获取jssdk config对匿名用户也应当可以使用, 否则无法对匿名用户在列表页进行定位.

  app.put("/api/orders/:_id", libs.auth("member"), orderController.updateOrder)
  app.post("/api/orders/delivery/time", libs.auth("member"), orderController.deliveryTimeArithmetic)
  app.post("/api/orders/delivery/time/eat/warehouse", libs.auth("member"), orderController.deliveryTimeArithmeticForEatWithWareHouse)
  app.get("/api/orders/delivery/range", libs.auth("member"), deliveryController.deliveryAddressForCook)


  app.get("/api/order/push", libs.auth("member"), orderController.pushMobileMessage)










  app.put("/api/courier/trace", libs.auth("courier"), deliveryTraceController.updateTrace)





  app.get("/api/administrator/export/orderall", orderStatController.orderList)
  app.get("/api/administrator/export/orders", orderStatController.orderExportList)
  app.get("/api/administrator/export/ordersinternal", orderStatController.orderExportInternalList)

  app.get("/api/administrator/shiplist/:orderId", orderStatController.orderPrintShippingList)
  app.get("/api/administrator/shiplist/orders", orderStatController.orderPrintShippingList)

  app.post("/api/administrator/orders/sms", smsController.sendSMSFromCSToUser)


  app.get("/api/administrator/order/delivery/ksudi/order/:_id", orderController.searchDeliveryKSuDi)
  app.post("/api/administrator/order/delivery/ksudi/order/:_id", orderController.createDeliveryKSuDi)
  app.post("/api/administrator/order/delivery/ksudi/notify", orderController.deliveryKSuDiNotify)

  app.get("/api/administrator/export/coupon15", couponController.verifyCoupon150000)




  app.get("/api/administrator/initadminuser", initController.createAdmin)
  app.get("/api/administrator/initwarehouse", libs.auth("admin"), initController.createWarehouse)
  app.get("/api/administrator/initfixinventory", initController.fixDishInventoryForCaohejin1)
  app.get("/api/administrator/initfixuserclientfrom", initController.addUserStatisticsClientFrom)
  app.get("/api/administrator/initwarehousestock", libs.auth("admin"), initController.fixDishWarehouseStock)
  app.get("/api/administrator/inittag", libs.auth("admin"), initController.createDishAndTag)
#  app.get("/api/administrator/initolddish", libs.auth("admin"), initController.createOldDishMigrate)
#  app.get("/api/administrator/initdishtopping", libs.auth("admin"), initController.initDishWithTopping)


#  app.get("/api/administrator/initremovetag", libs.auth("admin"), initController.removeTag)
#  app.get("/api/administrator/initremovedish", libs.auth("admin"), initController.removeDish)
#  app.get("/api/administrator/initremoveorder", libs.auth("admin"), initController.removeOrder)
#  app.get("/api/administrator/initremoveuser", libs.auth("admin"), initController.removeUser)

  app.get("/api/administrator/initremovelog", libs.auth("admin"), initController.removeLog)
  app.get("/api/administrator/initremovesetting", libs.auth("admin"), initController.removeSetting)

  app.get("/api/administrator/initremoveInventory", libs.auth("admin"), initController.removeTestInventory)
  app.get("/api/administrator/initremovecoupon", libs.auth("admin"), initController.removeWrongCoupon)
  app.get("/api/administrator/initremoveaccountdetail", libs.auth("admin"), initController.removeNotPaidAccountDetails)








#  app.post("/api/administrator/coupon", couponController.addNewCoupon)
#  app.post("/api/administrator/coupons", couponController.addNewCouponBatch)
#  app.post("/api/administrator/coupons/date", couponController.modifyCouponStartDate)
#  app.post("/api/administrator/coupons/user", couponController.assignCouponToUser)

  app.post("/api/administrator/dishes", dishController.addNewDish)
  app.post("/api/administrator/cooks", cookController.addNewCook)
  app.post("/api/administrator/tags", tagController.addNewTag)







  app.get("/api/admin/statistic/order/address", orderStatController.orderStatisticByAddress)
  app.get("/api/admin/statistic/order/addressauto", orderStatController.orderStatisticByAddressAuto)
  app.get("/api/admin/statistic/order/daily", orderStatController.orderDailySales)
  app.get("/api/admin/statistic/order/hour", orderStatController.orderHourSales)


  app.get("/api/admin/statistic/dish/stock", dishStatController.dishStatisticByStockLast7Day)
  app.get("/api/admin/statistic/dish/daily", dishStatController.dishDailySales)
  app.get("/api/admin/statistic/dish/daily/chart", dishStatController.dishDailySalesChart)

  app.get("/api/admin/statistic/user/newcomer", userStatController.userNewComerRate)
  app.get("/api/admin/statistic/user/frequency", userStatController.userLoyalUserPurchaseFrequency)
  app.get("/api/admin/statistic/user/firstorder/daily", userStatController.userGetFirstOrderDaily)
  app.get("/api/admin/statistic/user/coupon/name", userStatController.couponByNameRate)
  app.get("/api/admin/statistic/user/accoutdetail/paid", userStatController.userAccountDetailsStatistic)


  app.get("/api/admin/cronjob/user/noorder", cronJobController.getNoOrderUserLast7Day)
  app.get("/api/admin/cronjob/user/noorder/test", cronJobController.getNoOrderUserLast7DayTest)
  app.get("/api/admin/cronjob/order/notpaid/cancel", cronJobController.cancelNotPaidOrder)
  app.get("/api/admin/cronjob/user/account/employee", cronJobController.chargeAccountForEmployee)



module.exports = expressRoutes
