# 订单




exports.orderListByUser = (req, res, next) ->
  # 获取该用户所有订单
  models.order.validationGetOrderList req

  models.order.find user: req.u._id
  .sort "-createdAt"
  .limit (50)
  .skip (req.query.skip)
  .execAsync()
  .then (orders) ->
    res.json orders
  , next





exports.orderSingleInfo = (req, res, next) ->
  # 获取某个订单
  models.dish.findOneAsync _id: req.params._id
  .then (dish) ->
    res.json dish
  , next



exports.addNewOrder = (req, res, next) ->
  # 新增用户订单
  models.order.validationNewOrder req

  dishIdList = []
  dishNumberList = {}
  dishHistoryList = []

  for dish,dishIndex in req.body.dishList
    dishIdList.push dish.dish
    dishNumberList[dish.dish] = dish.number + if dishNumberList[dish.dish] then dishNumberList[dish.dish] else 0
    for subDish,subDishIndex in dish.subDish
      dishIdList.push subDish.dish
      dishNumberList[subDish.dish] = subDish.number + if dishNumberList[subDish.dish] then dishNumberList[subDish.dish] else 0


  newOrder =
    orderNumber : moment().format('YYYYMMDDHHmmssSSS') + (Math.floor(Math.random() * 9000) + 1000)
    user : req.u._id.toString()
    cookingType : req.body.cookingType
    address : req.body.address
    dishList : req.body.dishList
    userComment : req.body.userComment
    clientFrom : req.body.clientFrom
    status : "not paid"
    payment : req.body.payment
    isPaymentPaid : false
    paymentUsedCash : req.body.paymentUsedCash
    coupon : req.body.coupon
    promotionCode : req.body.promotionCode
    credit : req.body.credit
    freight : req.body.freight
    dishesPrice : 0
    totalPrice : 0
    deliveryDateTime : moment(req.body.deliveryDate + "T" + req.body.deliveryTime + ":00:00")
    deliveryDate : req.body.deliveryDate
    deliveryTime : req.body.deliveryTime


  models.dish.find {"_id" : {$in:dishIdList}}
#  .populate "preferences.foodMaterial.dish"
#  .populate "topping"
  .execAsync()
  .then (resultDishes) ->

    for dish,dishIndex in resultDishes
      newOrder.dishesPrice = newOrder.dishesPrice + dish.getPrice(dishNumberList[dish._id]) * dishNumberList[dish._id]
      dishHistoryList.push dish

    newOrder.totalPrice = newOrder.dishesPrice + newOrder.freight
    newOrder.dishHistory = dishHistoryList
    models.order.createAsync newOrder
  .then (resultOrder) ->
    res.json resultOrder
  , next




exports.updateOrder = (req, res, next) ->
  # 修改订单
  models.order.validationUpdateOrder req

  models.order.findById req.params._id
#  .populate "preferences.foodMaterial.dish"
#  .populate "topping"
  .execAsync()
  .then (resultOrder) ->
    if not resultOrder
      throw new Err "Order ID not found !", 400
    resultOrder.isPaymentPaid = true if req.body.isPaymentPaid
    resultOrder.saveAsync()
  .spread (resultOrder, numberAffected) ->
    res.json resultOrder
  .catch next


