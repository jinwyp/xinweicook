# 订单
WXPay = require "../libs/weixinpay"


configWeiXinPay =
  appid: conf.weixinpay.appid
  mch_id: conf.weixinpay.mch_id
  secret: conf.weixinpay.secret
  key: conf.weixinpay.key
  notify_url : conf.url.base + conf.weixinpay.notify_url

weixinpay = WXPay(configWeiXinPay)




exports.orderListByUser = (req, res, next) ->
  # 获取该用户所有订单
  models.order.validationGetOrderList req.query

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
  models.order.validationOrderId req.params._id

  models.dish.findOneAsync _id: req.params._id
  .then (dish) ->
    res.json dish
  , next





exports.addNewOrder = (req, res, next) ->
  # 新增用户订单
  models.order.validationNewOrder req.body

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

    if resultOrder.payment is models.order.OrderPayment().weixinpay
      weixinpayOrder =
        out_trade_no: resultOrder.orderNumber
        total_fee: resultOrder.totalPrice
#        spbill_create_ip: item.ip || "192.168.1.1", //终端IP APP和网页支付提交用户端ip，Native支付填调用微信支付API的机器IP。

#        notify_url: item.weixin_notify_url || "http://www.xinweicook.com/wxpay/notify",
        trade_type: "NATIVE" #JSAPI，NATIVE，APP，WAP
#      openid: item.openid, //trade_type=JSAPI，此参数必传，用户在商户appid下的唯一标识。下单前需要调用【网页授权获取用户信息】接口获取到用户的Openid
        product_id : resultOrder._id.toString() #trade_type=NATIVE，此参数必传。此id为二维码中包含的商品ID，商户自行定义。

        body:  resultOrder.dishHistory[0].title.zh
        detail:  resultOrder.dishHistory[0].title.zh

        attach: resultOrder._id.toString() #附加数据，在查询API和支付通知中原样返回，该字段主要用于商户携带订单的自定义数据
        goods_tag : "", #商品标记，代金券或立减优惠功能的参数，说明详见代金券或立减优惠

      weixinpay.createUnifiedOrder weixinpayOrder, (err, resultWeixinPay) ->
        if err
          next new Err err

        resultOrder.paymentWeixinpay =
          nonce_str : resultWeixinPay.nonce_str
          sign : resultWeixinPay.sign
          trade_type : resultWeixinPay.trade_type
          prepay_id: resultWeixinPay.prepay_id
          code_url: resultWeixinPay.code_url
        resultOrder.saveAsync().spread (resultOrder2, numberAffected) ->
          res.json resultOrder2
    else
      res.json resultOrder
  .catch next




exports.updateOrder = (req, res, next) ->
  # 修改订单
  models.order.validationOrderId req.params._id
  models.order.validationUpdateOrder req.body

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
  console.log "========================OrderAlipayNotify :: ", req.body
  models.order.validationAlipayNotify req.body

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
#      sign_type: 'RSA',
#      sign: 'MRATG5iMgTJFBw3ksMfKgidJxx2sPtOK42con1bwdQroPaOeBkv6XYZkhYivR0O3uda0vzcme6olG6tdkJhLDm+2SUf1w4DCWNfKjqL/zrUr46lDrbF5KlrcdIKRD3a41FN5gWwctVaOwe7nT+6aw0vqhpwG1uDpe9xGl5brgcY='
      out_trade_no : req.body.out_trade_no
      subject : req.body.subject
      payment_type : req.body.payment_type
      trade_no : req.body.trade_no
      trade_status : req.body.trade_status
      price : req.body.price
      total_fee : req.body.total_fee
      quantity : req.body.quantity
      body : req.body.body
      is_total_fee_adjust : req.body.is_total_fee_adjust
      use_coupon : req.body.use_coupon
      gmt_create : req.body.gmt_create
      gmt_payment : req.body.gmt_payment
#      refund_status : req.body.refund_status
#      gmt_refund : req.body.gmt_refund
      seller_email : req.body.seller_email
      buyer_email : req.body.buyer_email
      seller_id : req.body.seller_id
      buyer_id : req.body.buyer_id


    resultOrder.saveAsync()
  .spread (resultOrder2, numberAffected) ->
    res.set('Content-Type', 'text/plain');
    res.send "success"
  .catch next




exports.updateOrderWeixinPayNotify = (req, res, next) ->
  console.log "========================OrderWeixinPayNotify :: ", req.body

  weixinpay.parserNotify req.body, (err, resWeixinPay)->
    if err
      next new Err err

    models.order.validationWeixinPayNotify resWeixinPay

    models.order.findOne {orderNumber : resWeixinPay.out_trade_no, status : models.order.OrderStatus().notpaid}
    .execAsync()
    .then (resultOrder) ->
      models.order.OrderNotFound(resultOrder)

      resultOrder.isPaymentPaid = true
      resultOrder.status = models.order.OrderStatus().paid

      resultOrder.paymentWeixinpay =
        openid : resWeixinPay.openid
        bank_type : resWeixinPay.bank_type
        total_fee : resWeixinPay.total_fee
        fee_type : resWeixinPay.fee_type
        cash_fee : resWeixinPay.cash_fee
        cash_fee_type : resWeixinPay.cash_fee_type
        coupon_fee : resWeixinPay.coupon_fee
        transaction_id : resWeixinPay.transaction_id
        time_end : resWeixinPay.time_end

      resultOrder.saveAsync()
    .spread (resultOrder2, numberAffected) ->
      weixinpay.responseNotify res, false

    .catch next

