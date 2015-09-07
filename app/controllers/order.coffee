# 订单
WXPay = require "../libs/weixinpay"

AliPay = require "../libs/alipay.js"

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
alipay = AliPay()



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
  logger.error("OpenID 回调: " + JSON.stringify(req.url) + " ----- " + JSON.stringify(req.query) )
  code = req.query.code
  order_number_state = req.query.state

  if not req.query.code?
    logger.error("OpenID 失败 code not found: "+JSON.stringify(req.query) )

#  models.order.validationOrderId order_number_state

  unless libs.validator.isLength order_number_state, 24, 24
#    return throw new Err "Field validation error,  orderID _id length must be 24-24", 400
    return res.redirect("/mobile/wxpay/" + encodeURIComponent("Weixin Pay Open Id, Field validation error,  orderID _id length must be 24-24") + encodeURIComponent(order_number_state) )

  if not code or code.length is 0
#    throw new Err "Weixin Pay OpenId get code error,  code is null", 400
    return res.redirect("/mobile/wxpay/" + encodeURIComponent("Weixin Pay Open Id Code Error") + encodeURIComponent(JSON.stringify(req.query)) )


  weixinpay.getUserOpenId(code, (err, result) ->

    if err
#      next(throw new Err "Weixin Pay OpenId get code error,  code is null", 400)
      logger.error("OpenID 失败 网络传输:", JSON.stringify(err))
      return res.redirect("/mobile/wxpay/" + encodeURIComponent("Weixin Pay Open Id Request access_token 500 Error") + encodeURIComponent(JSON.stringify(err)) )



    if not result.errcode
      logger.error("OpenID 成功 code: " + JSON.stringify(result) )
      models.order.findOneAsync({"_id": order_number_state}).then (resultOrder) ->
        if resultOrder
          models.user.findOneAsync({"_id": resultOrder.user.toString()}).then (resultUser) ->
            if resultUser
              resultUser.weixinId.access_token = result.access_token
              resultUser.weixinId.openid = result.openid
              resultUser.weixinId.refresh_token = result.refresh_token

              resultUser.saveAsync()
          return res.redirect("/mobile/wxpay/" + order_number_state)
        else
          return res.redirect("/mobile/wxpay/" + encodeURIComponent("Weixin Pay Open Id Error, can not found this orderId"))

      .catch (err)->
        logger.error("OpenID 失败 查询OrderNumber错误:", JSON.stringify(err))
        return res.redirect("/mobile/wxpay/" + encodeURIComponent("Weixin Pay Open Id Request access_token 400 Error") + encodeURIComponent(JSON.stringify(err)) )

    else
      # 给客服发送新订单短信
      if not conf.debug
        text = models.sms.constantTemplateCustomerNewOrderNotify("OpenID错误")
        models.sms.sendSmsVia3rd("13564568304", text).catch( (err) -> logger.error("短信发送失败OpenID:", err))     # 王宇鹏电话


      result.code = req.query.code
      result.order_number_state = req.query.order_number_state
      logger.error("OpenID 失败 errcode: " + JSON.stringify(result) )
      return res.redirect("/mobile/wxpay/" + encodeURIComponent("Weixin Pay Open Id Request access_token 400 Error errcode found") + encodeURIComponent(JSON.stringify(result)) )
  )







exports.orderListByUser = (req, res, next) ->
  # 获取该用户所有订单
  models.order.validationGetOrderList req.query

  models.order.find user: req.u._id
  .sort "-createdAt"
  .skip (req.query.skip)
  .limit (req.query.limit)
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

  additionalContent =
    userId : req.u._id
    orderId : "testOrderID"

  pushOptions =
    isPushMobile : true

  models.message.sendMessageToUser(req.u._id, models.message.constantContentType().orderAdd, additionalContent, pushOptions)
  .then (resultPush) ->
    models.message.checkNotFound resultPush
    res.json resultPush

  .catch next







exports.addNewOrder = (req, res, next) ->
  # 新增用户订单


  models.order.validationNewOrder req.body
  models.coupon.validationCouponId req.body.coupon if req.body.coupon or req.body.coupon is ""
  models.coupon.validationCouponCode req.body.promotionCode if req.body.promotionCode or req.body.promotionCode is ""

  languageStr = req.acceptsLanguages()

  if languageStr[0] is "en"
    languageStr = "en"
  else
    languageStr = "zh"

  if req.body.address.fromDistance?
    req.body.address.distanceFrom = req.body.address.fromDistance


  dishIdList = []
  dishNumberList = {}
  dishDataList = {}

  promotionCode = {}
  coupon = {}
  userAccount = {}
  isUsedAccountBalance = false

  dishHistoryList = []
  dishReadyToCookList = []
  dishReadyToEatList = []




  for dish,dishIndex in req.body.dishList
    dishIdList.push dish.dish
    dishNumberList[dish.dish] = dish.number + if dishNumberList[dish.dish] then dishNumberList[dish.dish] else 0
    if dish.subDish
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
    language : languageStr
    clientFrom : req.body.clientFrom
    status : models.order.constantStatus().notpaid
    payment : req.body.payment
    isPaymentPaid : false
    paymentUsedCash : req.body.paymentUsedCash
    coupon : req.body.coupon if req.body.coupon
    promotionCode : req.body.promotionCode if req.body.promotionCode
    usedAccountBalance : req.body.usedAccountBalance if req.body.usedAccountBalance
    credit : Number(req.body.credit)
    freight : Number(req.body.freight)
    dishesPrice : 0
    totalPrice : 0


  if req.body.cookingType is models.dish.constantCookingType().cook
    newOrder.deliveryDate = req.body.deliveryDateCook
    newOrder.deliveryTime = req.body.deliveryTimeCook
    newOrder.deliveryDateTime = moment(req.body.deliveryDateCook + "T" + req.body.deliveryTimeCook + ":00")
    newOrder.deliveryDateType = models.order.deliveryDateTypeChecker(req.body.deliveryDateCook)

    if req.body.address.city is "上海市"
      newOrder.packageType = "paperbox"
    else
      newOrder.packageType = "foambox"

  else
    newOrder.deliveryDate = req.body.deliveryDateEat
    newOrder.deliveryTime = req.body.deliveryTimeEat
    newOrder.deliveryDateTime = moment(req.body.deliveryDateEat + "T" + req.body.deliveryTimeEat + ":00")
    newOrder.deliveryDateType = models.order.deliveryDateTypeChecker(req.body.deliveryDateEat)



  newOrderReadyToCook =
    orderNumber : moment().format('YYYYMMDDHHmmssSSS') + (Math.floor(Math.random() * 9000) + 1000)
    user : req.u._id.toString()
    cookingType :  models.dish.constantCookingType().cook
    isChildOrder : true
    address : req.body.address
    dishList : []
    userComment : req.body.userComment
    language : languageStr
    clientFrom : req.body.clientFrom
    status : models.order.constantStatus().notpaid
    payment : req.body.payment
    isPaymentPaid : false
    paymentUsedCash : req.body.paymentUsedCash
#    credit : req.body.credit
#    freight : req.body.freight
    dishesPrice : 0
    totalPrice : 0
    deliveryDateTime : moment(req.body.deliveryDateCook + "T" + req.body.deliveryTimeCook + ":00") if req.body.deliveryTimeCook
    deliveryDate : req.body.deliveryDateCook
    deliveryTime : req.body.deliveryTimeCook
    deliveryDateType : models.order.deliveryDateTypeChecker(req.body.deliveryDateCook)

  if req.body.address.city is "上海市"
    newOrderReadyToCook.packageType = "paperbox"
  else
    newOrderReadyToCook.packageType = "foambox"

  newOrderReadyToEat =
    orderNumber : moment().format('YYYYMMDDHHmmssSSS') + (Math.floor(Math.random() * 9000) + 1000)
    user : req.u._id.toString()
    cookingType :  models.dish.constantCookingType().eat
    isChildOrder : true
    address : req.body.address
    dishList : []
    userComment : req.body.userComment
    language : languageStr
    clientFrom : req.body.clientFrom
    status : models.order.constantStatus().notpaid
    payment : req.body.payment
    isPaymentPaid : false
    paymentUsedCash : req.body.paymentUsedCash
#    credit : req.body.credit
#    freight : req.body.freight
    dishesPrice : 0
    totalPrice : 0
    deliveryDateTime : moment(req.body.deliveryDateEat + "T" + req.body.deliveryTimeEat + ":00") if req.body.deliveryDateEat
    deliveryDate : req.body.deliveryDateEat
    deliveryTime : req.body.deliveryTimeEat
    deliveryDateType : models.order.deliveryDateTypeChecker(req.body.deliveryDateCook)


  models.useraccount.findOneAsync({user : req.u._id}).then (resultAccount)->
    # 处理账户余额
    if req.body.usedAccountBalance and resultAccount
      userAccount = resultAccount
      isUsedAccountBalance = true
    else
      isUsedAccountBalance = false

    models.coupon.findOne({code: req.body.promotionCode,  couponType: { $in: models.coupon.constantCouponType().code },  isExpired : false, isUsed : false}).execAsync()
  .then (resultPromotionCode) ->
    # 处理优惠码是否有效
    if req.body.promotionCode

      if resultPromotionCode
        models.coupon.checkExpired resultPromotionCode
        models.coupon.checkUsed(resultPromotionCode, req.u)
        promotionCode = resultPromotionCode
      else
        # 15W 活动优惠码
        if models.coupon.verifyCoupon15W(req.body.promotionCode)
          newCoupon =
            name :
              zh : "蒙牛活动优惠码"
              en : "Mengniu Promotion Code"
            price : 50
            priceLimit : 150
            endDate: moment().endOf("year")
            couponType : models.coupon.constantCouponType().promocode
            code : req.body.promotionCode
            usedTime : 0

          models.coupon.addNew(newCoupon).then (resultCoupon)->
            promotionCode = resultCoupon

        else
          models.coupon.checkNotFound resultPromotionCode

    models.coupon.findOne({_id: req.body.coupon, couponType:models.coupon.constantCouponType().coupon, isExpired : false, isUsed : false}).execAsync()
  .then (resultCoupon) ->
    # 处理优惠券是否有效
    if req.body.coupon
      models.coupon.checkNotFound resultCoupon
      models.coupon.checkExpired resultCoupon
      models.coupon.checkUsed(resultCoupon, req.u)
      coupon = resultCoupon

    models.dish.find99({"_id" : {$in:dishIdList}})
  .then (resultDishes) ->

    tempResultDishIdList = _.map(resultDishes, (dish) ->
      dish._id.toString()
    )
    # 判断是否有不存在的菜品ID
    models.order.checkInvalidDishIdListh(dishIdList, tempResultDishIdList)

    # 判断饮料不能单独下单，数量不超过十个
    models.order.checkInvalidDrink(resultDishes)

    # 处理订单菜品数量和总价
    for dish,dishIndex in resultDishes
      # 判断菜品库存
      models.dish.checkOutOfStock(dish)

      newOrder.dishesPrice = newOrder.dishesPrice + dish.getPrice(dishNumberList[dish._id]) * dishNumberList[dish._id]
      dishHistoryList.push({dish:dish, number:dishNumberList[dish._id]})
      dishDataList[dish._id] = dish


    # 计算订单总金额
    newOrder.totalPrice = newOrder.dishesPrice + newOrder.freight

    # 计算优惠券
    if req.body.coupon and newOrder.dishesPrice >= coupon.priceLimit
      newOrder.totalPrice = newOrder.totalPrice - coupon.price
      newOrder.couponDiscount = coupon.price

    # 计算优惠码 有两种，金额折扣和百分比折扣
    if req.body.promotionCode and newOrder.dishesPrice >= promotionCode.priceLimit

      if promotionCode.couponType is models.coupon.constantCouponType().promocodePercentage
        tempTotalPrice = Math.ceil(newOrder.totalPrice * promotionCode.price / 100 * 10) / 10
        newOrder.promotionDiscount = Math.ceil((newOrder.totalPrice - tempTotalPrice) * 10) / 10
        newOrder.totalPrice = tempTotalPrice

      else
        newOrder.totalPrice = newOrder.totalPrice - promotionCode.price
        newOrder.promotionDiscount = promotionCode.price


    if newOrder.totalPrice <= 0
        newOrder.totalPrice = 0.1

    newOrder.totalPrice =  Math.ceil(newOrder.totalPrice * 10) / 10

    # 处理总价减去账户余额 用过优惠券和优惠码后不在使用余额
    if newOrder.totalPrice isnt 0.1
      if isUsedAccountBalance
        # 使用余额支付 检查余额是否够
        if  userAccount.balance >= newOrder.totalPrice
          newOrder.accountUsedDiscount = newOrder.totalPrice
          newOrder.isPaymentPaid = true
          newOrder.status = models.order.constantStatus().paid
          newOrder.totalPrice = 0

          newOrderReadyToCook.isPaymentPaid = true
          newOrderReadyToCook.status = models.order.constantStatus().paid

          newOrderReadyToEat.isPaymentPaid = true
          newOrderReadyToEat.status = models.order.constantStatus().paid

        else
          newOrder.accountUsedDiscount = userAccount.balance
          newOrder.totalPrice = newOrder.totalPrice - userAccount.balance



    # 处理子订单菜品数量和总价
    for dish,dishIndex in req.body.dishList
      # 处理订单备注里面的商品备注
      if dish.remark?
        if not newOrder.userComment
          newOrder.userComment = ""
        newOrder.userComment = newOrder.userComment + " (" + dishDataList[dish.dish].title.zh + " " + dish.remark + "), "

      if dishDataList[dish.dish].cookingType is models.dish.constantCookingType().cook # 处理订单分子订单
        newOrderReadyToCook.dishesPrice = newOrderReadyToCook.dishesPrice + dishDataList[dish.dish].getPrice(dish.number) * dish.number
        dishReadyToCookList.push({dish:dishDataList[dish.dish], number:dish.number})
        newOrderReadyToCook.dishList.push dish

        if dish.remark?
          if not newOrderReadyToCook.userComment
            newOrderReadyToCook.userComment = ""
          newOrderReadyToCook.userComment = newOrderReadyToCook.userComment + " (" + dishDataList[dish.dish].title.zh + " " + dish.remark + "), "
      else
        newOrderReadyToEat.dishesPrice = newOrderReadyToEat.dishesPrice + dishDataList[dish.dish].getPrice(dish.number) * dish.number
        dishReadyToEatList.push({dish:dishDataList[dish.dish], number:dish.number})
        newOrderReadyToEat.dishList.push dish

        if dish.remark?
          if not newOrderReadyToEat.userComment
            newOrderReadyToEat.userComment = ""
          newOrderReadyToEat.userComment = newOrderReadyToEat.userComment + " (" + dishDataList[dish.dish].title.zh + " " + dish.remark + "), "

      if dish.subDish
        for subDish,subDishIndex in dish.subDish
          if dishDataList[dish.dish].cookingType is models.dish.constantCookingType().cook # 处理订单分子订单
            newOrderReadyToCook.dishesPrice = newOrderReadyToCook.dishesPrice + dishDataList[subDish.dish].getPrice(subDish.number) * subDish.number
            dishReadyToCookList.push({dish:dishDataList[subDish.dish], number:subDish.number})
          else
            newOrderReadyToEat.dishesPrice = newOrderReadyToEat.dishesPrice + dishDataList[subDish.dish].getPrice(subDish.number) * subDish.number
            dishReadyToEatList.push({dish:dishDataList[subDish.dish], number:subDish.number})





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


    # 优惠码已使用后处理
    if req.body.promotionCode
      promotionCode.used(req.u)

    # 优惠券已使用后处理
    if req.body.coupon
      coupon.used(req.u)



    # 余额已使用后处理
    if isUsedAccountBalance
      userAccount.reduceMoney(resultOrder.accountUsedDiscount, {zh : "在线消费",en : "Online Pay"}, req.body.remark, resultOrder._id.toString())

    # 删除用户购物车商品
    if req.u.shoppingCart.length > 0
      cartLength = req.u.shoppingCart.length-1
      for i in [cartLength..0]
        if req.u.shoppingCart[i].dish and dishIdList.indexOf(req.u.shoppingCart[i].dish.toString()) > -1
          req.u.shoppingCart.splice(i, 1)


    # 新增用户的收货地址到用户地址信息里面
    newAddress = {}
    newAddress.geoLatitude = req.body.address.geoLatitude if req.body.address.geoLatitude
    newAddress.geoLongitude = req.body.address.geoLongitude if req.body.address.geoLongitude

    newAddress.country = req.body.address.country if req.body.address.country
    newAddress.province = req.body.address.province if req.body.address.province
    newAddress.city = req.body.address.city if req.body.address.city
    newAddress.district = req.body.address.district if req.body.address.district
    newAddress.street = req.body.address.street if req.body.address.street
    newAddress.address = req.body.address.address if req.body.address.address

    newAddress.isDefault = false
    newAddress.contactPerson = req.body.address.contactPerson if req.body.address.contactPerson
    newAddress.mobile = req.body.address.mobile if req.body.address.mobile

    isAddNewFlag = true
    for address, addressIndex in req.u.address
      if (address.contactPerson is newAddress.contactPerson and address.address is newAddress.address) or (address.mobile is newAddress.mobile and address.address is newAddress.address)
        isAddNewFlag = false

    if isAddNewFlag
      req.u.address.push(newAddress)


    req.u.saveAsync().catch (err)->
      logger.error "---- User Save error", err



    # 发送iOS 推送
    additionalContent =
      userId : req.u._id
      orderId : resultOrder._id

    pushOptions =
      isPushMobile : true

    models.message.sendMessageToUser(req.u._id, models.message.constantContentType().orderAdd, additionalContent, pushOptions)


    # 生成支付宝签名
    aliPaySign = alipay.generateWapCreateDirectPayUrl(resultOrder)

    resultTemp = resultOrder.toJSON()
    delete resultTemp.dishList
    resultTemp.aliPaySign = aliPaySign

    res.json resultTemp
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






exports.generateWeixinPayUnifiedOrder = (req, res, next) ->

  models.order.validationOrderId req.body._id
  models.order.validationWeixinPayUnifiedOrder req.body


  models.order.findByIdAsync(req.body._id).then (resultOrder) ->

    #处理如果是微信支付需要先生成微信支付的统一订单
    if resultOrder

      if resultOrder.clientFrom is "ios"
        weixinpay = WXPay(configWeiXinAppPay)

      tempTotalPrice =  Math.ceil(resultOrder.totalPrice * 100)
      weixinpayOrder =
        out_trade_no: resultOrder.orderNumber
        total_fee: tempTotalPrice
        spbill_create_ip: req.ip # 终端IP APP和网页支付提交用户端ip，Native支付填调用微信支付API的机器IP。

        notify_url: "http://m.xinweicook.com/mobile/wxpay/notify"
        trade_type: req.body.trade_type #JSAPI，NATIVE，APP，WAP
        openid: req.body.openid  #trade_type=JSAPI，此参数必传，用户在商户appid下的唯一标识。下单前需要调用【网页授权获取用户信息】接口获取到用户的Openid
        product_id : resultOrder._id.toString() #trade_type=NATIVE，此参数必传。此id为二维码中包含的商品ID，商户自行定义。

        body:  resultOrder.dishHistory[0].dish.title.zh
        detail:  resultOrder.dishHistory[0].dish.title.zh

        attach: resultOrder._id.toString() #附加数据，在查询API和支付通知中原样返回，该字段主要用于商户携带订单的自定义数据
        goods_tag : "", #商品标记，代金券或立减优惠功能的参数，说明详见代金券或立减优惠

      if req.u.weixinId.openid and resultOrder.clientFrom is "wechat"
        weixinpayOrder.openid = req.u.weixinId.openid

      if req.u.mobile is "15900719671" or req.u.mobile is "18629641521" or req.u.mobile is "13564568304" or req.u.mobile is "18621870070"  # 内测帐号1分钱下单
        weixinpayOrder.total_fee = 1

      console.log "------------------Weixinpay Unified Order: ", weixinpayOrder
      weixinpay.createUnifiedOrder weixinpayOrder, (err, resultWeixinPay) ->
        if err
          next (new Err err)

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
#            console.log "---WeixinPay------Sign", resultOrder.paymentWeixinpay
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

      # 扣除商品库存
      for dish, dishIndex in resultOrder.dishHistory
        models.dish.findOne({_id:dish.dish._id}).then (resultDish) ->
          if resultDish
            resultDish.reduceStock(dish.number, req.u, "userOrder", resultOrder._id.toString())

      # 给客服发送新订单短信
      text = models.sms.constantTemplateCustomerNewOrderNotify(resultOrder.orderNumber)
#      models.sms.sendSmsVia3rd("13564568304", text).catch( (err) -> logger.error("短信发送失败:", err))     # 王宇鹏电话
      if not conf.debug
        models.sms.sendSmsVia3rd("18140031310", text).catch( (err) -> logger.error("短信发送新订单通知失败:", err))     # 索晶电话
        models.sms.sendSmsVia3rd("18516272908", text).catch( (err) -> logger.error("短信发送新订单通知失败:", err))     # 何华电话
        models.sms.sendSmsVia3rd("18215563108", text).catch( (err) -> logger.error("短信发送新订单通知失败:", err))     # 赵梦菲电话
        models.sms.sendSmsVia3rd("13761339935", text).catch( (err) -> logger.error("短信发送新订单通知失败:", err))     # 杨唤电话

      # 该用户首次下单给邀请的人添加优惠券
      if req.u.invitationFromUser and not req.u.isHaveFirstOrderCoupon
        models.user.findOneAsync({_id:req.u.invitationFromUser}).then (fromUser) ->
          if fromUser
            newCoupon =
              name :
                zh : "邀请的好友首次下单返利优惠券"
                en : "Friend First Order Rebate Coupon"
              price : 10
              couponType : models.coupon.constantCouponType().coupon
              usedTime : 1
              user : fromUser._id.toString()
            models.coupon.addNew(newCoupon).then (resultCoupon)->
              fromUser.couponList.push(resultCoupon._id.toString())
              fromUser.saveAsync()
              req.u.isHaveFirstOrderCoupon = true

              # 该用户完成支付后可以再次分享邀请码
              req.u.sharedInvitationSendCodeTotalCount = req.u.sharedInvitationSendCodeTotalCount + 1

              if req.u.sharedInvitationSendCodeTotalCount > req.u.sharedInvitationSendCodeUsedTime
                req.u.isSharedInvitationSendCode = false
              req.u.saveAsync()
      else
        # 该用户完成支付后可以再次分享邀请码
        req.u.sharedInvitationSendCodeTotalCount = req.u.sharedInvitationSendCodeTotalCount + 1

        if req.u.sharedInvitationSendCodeTotalCount > req.u.sharedInvitationSendCodeUsedTime
          req.u.isSharedInvitationSendCode = false


        if req.u.sharedInvitationSendCodeTotalCount >= 5 and not req.u.isPaid5Orders
          newCoupon =
            name :
              zh : "满5单优惠券"
              en : "Achieve 5 orders Coupon"
            price : 10
            couponType : models.coupon.constantCouponType().coupon
            usedTime : 1
            user : req.u._id.toString()

          models.coupon.addNew(newCoupon).then (resultCouponList)->
            req.u.couponList.push(resultCouponList._id.toString())
            req.u.isPaid5Orders = true
            req.u.saveAsync()

          # 发送iOS 推送 满5单发充值码
          additionalContent =
            userId : req.u._id
            orderId : resultOrder._id
            code : "XWORDERFIV"

          pushOptions =
            isPushMobile : true

          models.message.sendMessageToUser(req.u._id, models.message.constantContentType().chargeAccountByCode10, additionalContent, pushOptions)

        else if req.u.sharedInvitationSendCodeTotalCount >=10 and not req.u.isPaid10Orders
          newCoupon =
            name :
              zh : "满10单优惠券"
              en : "Achieve 10 orders Coupon"
            price : 20
            couponType : models.coupon.constantCouponType().coupon
            usedTime : 1
            user : req.u._id.toString()

          models.coupon.addNew(newCoupon).then (resultCouponList)->
            req.u.couponList.push(resultCouponList._id.toString())
            req.u.isPaid10Orders = true
            req.u.saveAsync()
        else
          req.u.saveAsync()


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
  models.order.validationAlipayNotify(req.body)

  if req.body.trade_status is "TRADE_SUCCESS"

#    models.order.findOne {orderNumber : req.body.out_trade_no, status : models.order.constantStatus().notpaid}
    models.order.findOne({orderNumber : req.body.out_trade_no})
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

  else
    res.set('Content-Type', 'text/plain');
    res.send "success"




exports.updateOrderWeixinPayNotify = (req, res, next) ->
  console.log "========================OrderWeixinPayNotify :: ", req.body

  models.order.validationWeixinPayNotify req.body

  models.order.findOne {orderNumber : req.body.out_trade_no}
  .populate "childOrderList"
  .execAsync()
  .then (resultOrder) ->
    models.order.checkNotFound(resultOrder)

    resultOrder.isPaymentPaid = true
    resultOrder.status = models.order.constantStatus().paid

    resultOrder.paymentWeixinpay =
      out_trade_no : req.body.out_trade_no
      openid : req.body.openid
      bank_type : req.body.bank_type
      total_fee : req.body.total_fee
      fee_type : req.body.fee_type
      cash_fee : req.body.cash_fee
      cash_fee_type : req.body.cash_fee_type if req.body.cash_fee_type
      coupon_fee : req.body.coupon_fee if req.body.coupon_fee
      coupon_count : req.body.coupon_count if req.body.coupon_count
      transaction_id : req.body.transaction_id
      time_end : req.body.time_end


    if resultOrder.childOrderList.length > 0
      for childOrder in resultOrder.childOrderList
        childOrder.isPaymentPaid = true
        childOrder.status = models.order.constantStatus().paid
        childOrder.saveAsync()

    resultOrder.saveAsync()
  .spread (resultOrder2, numberAffected) ->
    weixinpay.responseNotify res, true

  .catch next










