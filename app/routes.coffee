userController = require "./controllers/user.coffee"
tokenController = require "./controllers/token.coffee"
smsController = require "./controllers/sms.coffee"
articleController = require "./controllers/article.coffee"
dishController = require "./controllers/dish.coffee"
orderController = require "./controllers/order.coffee"





expressRoutes = (app) ->
  app.get("/api/dishes", dishController.dishList)
  app.get("/api/dishes/:_id", dishController.dishSingleInfo)

  app.get("/api/articles", articleController.articleList)
  app.get("/api/articles/:_id", articleController.articleSingleInfo)



  app.post("/api/user/token", tokenController.tokenSignIn)
  app.post("/api/user/logout", tokenController.tokenRevoke)

  app.post("/api/user/signup", userController.userSignUp)
  app.post("/api/user/sms", smsController.sendSMS)

  app.post("/api/user/resetpassword", userController.resetPassword)


  app.get("/api/user", libs.auth("member"), userController.userInfo)


  app.get("/api/orders", libs.auth("member"), orderController.orderListByUser)
  app.get("/api/orders/:_id", libs.auth("member"), orderController.orderSingleInfo)
  app.post("/api/orders", libs.auth("member"), orderController.addNewOrder)







module.exports = expressRoutes