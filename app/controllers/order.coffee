# 订单
WXPay = require "../libs/weixinpay"


configWeiXinPay =
  appid: conf.weixinpay.appid
  mch_id: conf.weixinpay.mch_id
  secret: conf.weixinpay.secret
  key: conf.weixinpay.key
  notify_url : conf.url.base + conf.weixinpay.notify_url

configWeiXinAppPay =
  appid: conf.weixinAppPay.appid
  mch_id: conf.weixinAppPay.mch_id
  secret: conf.weixinAppPay.secret
  key: conf.weixinAppPay.key
  notify_url : conf.url.base + conf.weixinAppPay.notify_url


weixinpay = WXPay(configWeiXinPay)


exports.getWeixinDeveloperAccessToken = (req, res, next) ->
  # 增加生成微信developerAccessToken备用


  models.setting.findOneAsync({name:"weixinPayJSSdkConfig", isExpired:false})
  .then (resultSetting) ->
    if resultSetting
      if models.setting.checkExpired(resultSetting)
        weixinpay.getDeveloperAccessToken( (err, resultTicket) ->
          if err
            next(err)

          if resultTicket
            weixinpayJSSdkConfigSign =
              noncestr: weixinpay.util.generateNonceString()
              timestamp: Math.floor(Date.now()/1000)+""
              jsapi_ticket: resultTicket.ticket
              url: req.body.url

            weixinpayJSSdkConfigSign.signature = weixinpay.signSha1(weixinpayJSSdkConfigSign)

            resultSetting.value = weixinpayJSSdkConfigSign
            resultSetting.expiredDate =  moment().add(60, 'minutes')
            resultSetting.saveAsync()
            res.json weixinpayJSSdkConfigSign
        )
      else
        weixinpayJSSdkConfigSign =
          noncestr: resultSetting.value.noncestr
          timestamp: Math.floor(Date.now()/1000)+""
          jsapi_ticket: resultSetting.value.jsapi_ticket
          url: req.body.url

        weixinpayJSSdkConfigSign.signature = weixinpay.signSha1(weixinpayJSSdkConfigSign)
        resultSetting.value = weixinpayJSSdkConfigSign
        resultSetting.saveAsync()
        res.json resultSetting.value
    else
      weixinpay.getDeveloperAccessToken( (err, resultTicket) ->
        if err
          next(err)

        if resultTicket

          weixinpayJSSdkConfigSign =
            noncestr: weixinpay.util.generateNonceString()
            timestamp: Math.floor(Date.now()/1000)+""
            jsapi_ticket: resultTicket.ticket
            url: req.body.url

          weixinpayJSSdkConfigSign.signature = weixinpay.signSha1(weixinpayJSSdkConfigSign);

          newInfo2 =
            name : "weixinPayJSSdkConfig"
            key : "weixinPayJSSdkConfig"
            value : weixinpayJSSdkConfigSign
            expiredDate : moment().add(60, 'minutes')

          models.setting.createAsync(newInfo2)
          res.json weixinpayJSSdkConfigSign
      )
  .catch next











exports.getWeixinPayUserOpenId = (req, res, next) ->
#  console.log "========================WeixinPayOpenId :: ", req.query

  code = req.query.code;
  order_number_state = req.query.state;
  models.order.validationOrderId order_number_state

  if not code or code.length is 0
    throw new Err "Weixin Pay OpenId get code error,  code is null", 400
  else
    weixinpay.getUserOpenId(code, (err, result) ->

      if err
        next(throw new Err "Weixin Pay OpenId get code error,  code is null", 400)

      if !result.errcode
        models.order.findOneAsync({"_id": order_number_state}).then (resultOrder) ->
          if resultOrder
#            console.log "========================OrderId :: ", resultOrder
            models.user.findOneAsync({"_id": resultOrder.user.toString()}).then (resultUser) ->
              if resultUser
                console.log "========================UserId :: ", resultUser
                resultUser.weixinId.access_token = result.access_token
                resultUser.weixinId.openid = result.openid
                resultUser.weixinId.refresh_token = result.refresh_token

                resultUser.saveAsync()

          res.redirect("/mobile/wxpay/" + order_number_state)
#        res.send result
        .catch next
    )







exports.orderListByUser = (req, res, next) ->
  # 获取该用户所有订单
  models.order.validationGetOrderList req.query

  models.order.find user: req.u._id
  .sort "-createdAt"
  .limit (req.query.limit)
  .skip (req.query.skip)
  .populate({path: 'dishList.dish', select: models.dish.fields()})
  .populate({path: 'dishList.subDish.dish', select: models.dish.fields()})
  .execAsync()
  .then (orders) ->
    res.json orders
  , next





exports.orderSingleInfo = (req, res, next) ->
  # 获取某个订单
  models.order.validationOrderId req.params._id

  models.order.findOne _id: req.params._id
  .populate({path: 'dishList.dish', select: models.dish.fields()})
  .populate({path: 'dishList.subDish.dish', select: models.dish.fields()})
  .execAsync()
  .then (resultOrder) ->
    models.order.checkNotFound resultOrder
    res.json resultOrder
  , next








exports.pushMobileMessage = (req, res, next) ->

  models.message.sendMessageToUser(req.u._id, models.message.constantContentType().orderAdd)
  .then (resultPush) ->
    models.message.checkNotFound resultPush
    res.json resultPush

  .catch next







exports.addNewOrder = (req, res, next) ->
  # 新增用户订单
  models.order.validationNewOrder req.body
  models.coupon.validationCouponId req.body.coupon if req.body.coupon
  models.coupon.validationCouponCode req.body.promotionCode if req.body.promotionCode


  dishIdList = []
  dishNumberList = {}
  dishDataList = {}

  promotionCode = {}

  dishHistoryList = []
  dishReadyToCookList = []
  dishReadyToEatList = []



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
    status : models.order.constantStatus().notpaid
    payment : req.body.payment
    isPaymentPaid : false
    paymentUsedCash : req.body.paymentUsedCash
    coupon : req.body.coupon if req.body.coupon
    promotionCode : req.body.promotionCode if req.body.promotionCode
    credit : Number(req.body.credit)
    freight : Number(req.body.freight)
    dishesPrice : 0
    totalPrice : 0


  if req.body.cookingType is models.dish.constantCookingType().cook
    newOrder.deliveryDate = req.body.deliveryDateCook
    newOrder.deliveryTime = req.body.deliveryTimeCook
    newOrder.deliveryDateTime = moment(req.body.deliveryDateCook + "T" + req.body.deliveryTimeCook + ":00")
  else
    newOrder.deliveryDate = req.body.deliveryDateEat
    newOrder.deliveryTime = req.body.deliveryTimeEat
    newOrder.deliveryDateTime = moment(req.body.deliveryDateEat + "T" + req.body.deliveryTimeEat + ":00")

  newOrderReadyToCook =
    orderNumber : moment().format('YYYYMMDDHHmmssSSS') + (Math.floor(Math.random() * 9000) + 1000)
    user : req.u._id.toString()
    cookingType :  models.dish.constantCookingType().cook
    isChildOrder : true
    address : req.body.address
    dishList : []
    userComment : req.body.userComment
    clientFrom : req.body.clientFrom
    status : models.order.constantStatus().notpaid
    payment : req.body.payment
    isPaymentPaid : false
    paymentUsedCash : req.body.paymentUsedCash
#    coupon : req.body.coupon
#    promotionCode : req.body.promotionCode
#    credit : req.body.credit
#    freight : req.body.freight
    dishesPrice : 0
    totalPrice : 0
    deliveryDateTime : moment(req.body.deliveryDateCook + "T" + req.body.deliveryTimeCook + ":00") if req.body.deliveryTimeCook
    deliveryDate : req.body.deliveryDateCook
    deliveryTime : req.body.deliveryTimeCook

  newOrderReadyToEat =
    orderNumber : moment().format('YYYYMMDDHHmmssSSS') + (Math.floor(Math.random() * 9000) + 1000)
    user : req.u._id.toString()
    cookingType :  models.dish.constantCookingType().eat
    isChildOrder : true
    address : req.body.address
    dishList : []
    userComment : req.body.userComment
    clientFrom : req.body.clientFrom
    status : models.order.constantStatus().notpaid
    payment : req.body.payment
    isPaymentPaid : false
    paymentUsedCash : req.body.paymentUsedCash
#    coupon : req.body.coupon
#    promotionCode : req.body.promotionCode
#    credit : req.body.credit
#    freight : req.body.freight
    dishesPrice : 0
    totalPrice : 0
    deliveryDateTime : moment(req.body.deliveryDateEat + "T" + req.body.deliveryTimeEat + ":00") if req.body.deliveryDateEat
    deliveryDate : req.body.deliveryDateEat
    deliveryTime : req.body.deliveryTimeEat

  models.coupon.findOne({code: req.body.promotionCode, isExpired : false, isUsed : false}).execAsync()
  .then (resultCoupon) ->
    # 处理优惠券
    if req.body.promotionCode
      models.coupon.checkNotFound resultCoupon
      models.coupon.checkExpired resultCoupon
      models.coupon.checkUsed(resultCoupon, req.u)
      promotionCode = resultCoupon

    models.dish.find99({"_id" : {$in:dishIdList}})
  .then (resultDishes) ->
    tempResultDishIdList = _.map(resultDishes, (dish) ->
      dish._id.toString()
    )
    invalidDishIdList = _.difference(dishIdList, tempResultDishIdList)
    models.order.checkInvalidDishIdListh invalidDishIdList


    for dish,dishIndex in resultDishes
      newOrder.dishesPrice = newOrder.dishesPrice + dish.getPrice(dishNumberList[dish._id]) * dishNumberList[dish._id]
      dishHistoryList.push({dish:dish, number:dishNumberList[dish._id]})
      dishDataList[dish._id] = dish

    # 处理子订单菜品数量和总价
    for dish,dishIndex in req.body.dishList
      if dishDataList[dish.dish].cookingType is models.dish.constantCookingType().cook # 处理订单分子订单
        newOrderReadyToCook.dishesPrice = newOrderReadyToCook.dishesPrice + dishDataList[dish.dish].getPrice(dish.number) * dish.number
        dishReadyToCookList.push({dish:dishDataList[dish.dish], number:dish.number})
        newOrderReadyToCook.dishList.push dish
      else
        newOrderReadyToEat.dishesPrice = newOrderReadyToEat.dishesPrice + dishDataList[dish.dish].getPrice(dish.number) * dish.number
        dishReadyToEatList.push({dish:dishDataList[dish.dish], number:dish.number})
        newOrderReadyToEat.dishList.push dish

      for subDish,subDishIndex in dish.subDish
        if dishDataList[dish.dish].cookingType is models.dish.constantCookingType().cook # 处理订单分子订单
          newOrderReadyToCook.dishesPrice = newOrderReadyToCook.dishesPrice + dishDataList[subDish.dish].getPrice(subDish.number) * subDish.number
          dishReadyToCookList.push({dish:dishDataList[subDish.dish], number:subDish.number})
        else
          newOrderReadyToEat.dishesPrice = newOrderReadyToEat.dishesPrice + dishDataList[subDish.dish].getPrice(subDish.number) * subDish.number
          dishReadyToEatList.push({dish:dishDataList[subDish.dish], number:subDish.number})


    if newOrder.dishesPrice > promotionCode.priceLimit and (newOrder.dishesPrice - promotionCode.price) > 0
      newOrder.totalPrice = newOrder.dishesPrice + newOrder.freight - promotionCode.price
    else
      newOrder.totalPrice = newOrder.dishesPrice + newOrder.freight

    newOrder.dishHistory = dishHistoryList

    newOrderReadyToCook.totalPrice = newOrderReadyToCook.dishesPrice
    newOrderReadyToCook.dishHistory = dishReadyToCookList

    newOrderReadyToEat.totalPrice = newOrderReadyToEat.dishesPrice
    newOrderReadyToEat.dishHistory = dishReadyToEatList



    if dishReadyToCookList.length > 0 and dishReadyToEatList.length > 0
      newOrder.isSplitOrder = true

    if newOrder.isSplitOrder
      newOrder.childOrderList = []
      models.order.createAsync [newOrderReadyToCook, newOrderReadyToEat]
      .then (resultChildrenOrder) ->
        for childOrder, childOrderIndex in resultChildrenOrder
          newOrder.childOrderList.push childOrder._id
        models.order.createAsync newOrder
    else
      models.order.createAsync newOrder

  .then (resultOrder) ->
    # 优惠券已使用后处理
    if req.body.promotionCode and req.body.promotionCode isnt "testing123"
      promotionCode.used(req.u)

    # 删除用户购物车商品

#    for dish, dishIndex in req.u.shoppingCart
#      if dishIdList.indexOf(dish.dish) > -1
#        console.log "--------", dishIdList.indexOf(dish.dish), dish.dish
#        req.u.shoppingCart.splice(dishIndex, 1)


    # 发送iOS 推送
    additionalContent =
      userId : req.u._id
      orderId : resultOrder._id

    models.message.sendMessageToUser(req.u._id, models.message.constantContentType().orderAdd, additionalContent)



    resultTemp = resultOrder.toJSON()
    delete resultTemp.dishList
    res.json resultTemp
  .catch next




exports.generateWeixinPayUnifiedOrder = (req, res, next) ->

  models.order.validationOrderId req.body._id
  models.order.validationWeixinPayUnifiedOrder req.body


  models.order.findByIdAsync(req.body._id).then (resultOrder) ->

    #处理如果是微信支付需要先生成微信支付的统一订单
    if resultOrder

      if resultOrder.clientFrom is "ios"
        weixinpay = WXPay(configWeiXinAppPay)

      weixinpayOrder =
        out_trade_no: resultOrder.orderNumber
        total_fee: resultOrder.totalPrice * 100
        spbill_create_ip: req.ip # 终端IP APP和网页支付提交用户端ip，Native支付填调用微信支付API的机器IP。

        notify_url: "https://api.xinweicook.com/orders/payment/weixinpay/notify"
        trade_type: req.body.trade_type #JSAPI，NATIVE，APP，WAP
        openid: req.body.openid  #trade_type=JSAPI，此参数必传，用户在商户appid下的唯一标识。下单前需要调用【网页授权获取用户信息】接口获取到用户的Openid
        product_id : resultOrder._id.toString() #trade_type=NATIVE，此参数必传。此id为二维码中包含的商品ID，商户自行定义。

        body:  resultOrder.dishHistory[0].dish.title.zh
        detail:  resultOrder.dishHistory[0].dish.title.zh

        attach: resultOrder._id.toString() #附加数据，在查询API和支付通知中原样返回，该字段主要用于商户携带订单的自定义数据
        goods_tag : "", #商品标记，代金券或立减优惠功能的参数，说明详见代金券或立减优惠

      weixinpayOrder.openid = req.u.weixinId.openid if req.u.weixinId.openid

      if resultOrder.promotionCode is "testing123" or req.u.mobile is "15900719671"
        weixinpayOrder.total_fee = 10

      console.log "------------------openId: ", weixinpayOrder
      weixinpay.createUnifiedOrder weixinpayOrder, (err, resultWeixinPay) ->
        if err
          next new Err err

        console.log "---WeixinPay--response", resultWeixinPay
        if resultWeixinPay

          weixinpayMobileSign =
            appId: configWeiXinPay.appid
            timeStamp: parseInt(+new Date() / 1000, 10) + ""
            nonceStr: weixinpay.util.generateNonceString()
            package: "prepay_id="+resultWeixinPay.prepay_id
            signType: "MD5"

          # https://pay.weixin.qq.com/wiki/doc/api/app.php?chapter=8_5
          weixinpayNativeSign =
            appId : configWeiXinAppPay.appid
            partnerId : configWeiXinAppPay.mch_id
            prepayId : resultWeixinPay.prepay_id
            packageValue : 'Sign=WXPay'
            timeStamp: parseInt(+new Date() / 1000, 10) + ""
            nonceStr: weixinpay.util.generateNonceString()

          weixinpayNativeSign.sign = weixinpay.sign(weixinpayNativeSign);
          weixinpayMobileSign.paySign = weixinpay.sign(weixinpayMobileSign);

          resultOrder.paymentWeixinpay =
            nativeSign: weixinpayNativeSign
            mobileSign: weixinpayMobileSign
            nonce_str : resultWeixinPay.nonce_str
            sign : resultWeixinPay.sign
            trade_type : resultWeixinPay.trade_type
            prepay_id: resultWeixinPay.prepay_id
            code_url: resultWeixinPay.code_url

          resultOrder.saveAsync().spread (resultOrder2, numberAffected) ->
#          res.json _.pick(resultOrder, ["orderNumber", "cookingType", "payment", "paymentUsedCash", "totalPrice", "deliveryDate", "deliveryTime", "deliveryDateTime", "status", "isPaymentPaid", "isSplitOrder", "isChildOrder" ])
            resultTemp = resultOrder2.toJSON()
            delete resultTemp.dishList
            console.log "---WeixinPay------Sign", resultOrder.paymentWeixinpay
            res.json resultTemp

    else
      throw new Err "Field validation error,  orderID not found!", 200

  .catch next




exports.updateOrder = (req, res, next) ->
  # 修改订单
  models.order.validationOrderId req.params._id
  models.order.validationUpdateOrder req.body

  models.order.findById req.params._id
  .populate({path: 'dishList.dish', select: models.dish.fields()})
  .populate({path: 'dishList.subDish.dish', select: models.dish.fields()})
  .populate "childOrderList"
  .execAsync()
  .then (resultOrder) ->
    models.order.checkNotFound(resultOrder)

    if req.body.isPaymentPaid is "true" and resultOrder.status isnt models.order.constantStatus().canceled
      resultOrder.isPaymentPaid = true
      resultOrder.status = models.order.constantStatus().paid

      if resultOrder.childOrderList.length > 0
        for childOrder in resultOrder.childOrderList
          childOrder.isPaymentPaid = true
          childOrder.status = models.order.constantStatus().paid
          childOrder.saveAsync()
    else
      if req.body.status is models.order.constantStatus().canceled and resultOrder.status is models.order.constantStatus().notpaid
        resultOrder.status = models.order.constantStatus().canceled

        if resultOrder.childOrderList.length > 0
          for childOrder in resultOrder.childOrderList
            resultOrder.status = models.order.constantStatus().canceled
            childOrder.saveAsync()

    resultOrder.saveAsync()
  .spread (resultOrder, numberAffected) ->
    res.json resultOrder
  .catch next








exports.updateOrderAlipayNotify = (req, res, next) ->
#  console.log "========================OrderAlipayNotify :: ", req.body
  models.order.validationAlipayNotify req.body

#  models.order.findOne {orderNumber : req.body.out_trade_no, status : models.order.constantStatus().notpaid}
  models.order.findOne {orderNumber : req.body.out_trade_no}
  .populate "childOrderList"
  .execAsync()
  .then (resultOrder) ->
    models.order.checkNotFound(resultOrder)

    resultOrder.isPaymentPaid = true
    resultOrder.status = models.order.constantStatus().paid

    resultOrder.paymentAlipay =
      notify_time : req.body.notify_time
      notify_type : req.body.notify_type
      notify_id : req.body.notify_id
      sign_type: req.body.sign_type,
      sign: req.body.sign_type,

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

    if resultOrder.childOrderList.length > 0
      for childOrder in resultOrder.childOrderList
        childOrder.isPaymentPaid = true
        childOrder.status = models.order.constantStatus().paid
        childOrder.saveAsync()

    resultOrder.saveAsync()
  .spread (resultOrder2, numberAffected) ->
    res.set('Content-Type', 'text/plain');
    res.send "success"
  .catch next




exports.updateOrderWeixinPayNotify = (req, res, next) ->
  console.log "========================OrderWeixinPayNotify :: ", req.body
  console.log "========================OrderWeixinPayNotify :: ", req.query

  weixinpay.parserNotify req.body, (err, resWeixinPay)->
    if err
      next new Err err

    models.order.validationWeixinPayNotify resWeixinPay

    models.order.findOne {orderNumber : resWeixinPay.out_trade_no, status : models.order.constantStatus().notpaid}
    .execAsync()
    .then (resultOrder) ->
      models.order.checkNotFound(resultOrder)

      resultOrder.isPaymentPaid = true
      resultOrder.status = models.order.constantStatus().paid

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

      if resultOrder.childOrderList.length > 0
        for childOrder in resultOrder.childOrderList
          childOrder.isPaymentPaid = true
          childOrder.status = models.order.constantStatus().paid
          childOrder.saveAsync()

      resultOrder.saveAsync()
    .spread (resultOrder2, numberAffected) ->
      weixinpay.responseNotify res, false

    .catch next














exports.deliveryTimeArithmetic = (req, res, next) ->

  if req.body.cookingType is "ready to cook"
    if req.body.isCityShanghai is true
      result = models.order.deliveryTimeArithmeticByRangeForReadyToCook(req.body.isInRange4KM)
    else
      result = models.order.deliveryTimeArithmeticNotInShangHaiForReadyToCook()
  else
    if req.body.isCityShanghai is true
      result = models.order.deliveryTimeArithmeticForReadyToEat(req.body.isInRange4KM)

  res.status(200).json(result)




