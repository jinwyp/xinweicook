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
    status : models.order.OrderStatus().notpaid
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
    models.order.OrderNotFound(resultOrder)
    if req.body.isPaymentPaid
      resultOrder.isPaymentPaid = true
      resultOrder.status = models.order.OrderStatus().paid
    resultOrder.saveAsync()
  .spread (resultOrder, numberAffected) ->
    res.json resultOrder
  .catch next


exports.updateOrderAlipayNotify = (req, res, next) ->
  console.log "------------------Order======== ::", req
  models.order.validationAlipayNotify req

  models.order.findOne {orderNumber : req.body.out_trade_no, status : models.order.OrderStatus().notpaid}
#  .populate "preferences.foodMaterial.dish"
#  .populate "topping"
  .execAsync()
  .then (resultOrder) ->
    models.order.OrderNotFound(resultOrder)

    resultOrder.isPaymentPaid = true
    resultOrder.status = models.order.OrderStatus().paid

    resultOrder.paymentAlipay =
      notify_time : req.body.notify_time
      notify_type : req.body.notify_type
      notify_id : req.body.notify_id
      out_trade_no : req.body.out_trade_no
      subject : req.body.subject
      payment_type : req.body.payment_type
      trade_no : req.body.trade_no
      trade_status : req.body.trade_status
      total_fee : req.body.total_fee
      quantity : req.body.quantity
      gmt_create : req.body.gmt_create
      gmt_payment : req.body.gmt_payment
      refund_status : req.body.refund_status
      gmt_refund : req.body.gmt_refund

    resultOrder.saveAsync()
  .spread (resultOrder, numberAffected) ->
    res.set('Content-Type', 'text/plain');
    res.send "success"
  .catch next
