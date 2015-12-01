# 订单
KSuDi = require "../libs/ksudi.js"
WXPay = require "../libs/weixinpay.js"
AliPay = require "../libs/alipay.js"


configAlipay =
  notify_url : "http://m.xinweicook.com/api/orders/payment/alipay/mobile"
  mobile_return_url : "http://m.xinweicook.com/mobile/alipay/return"

alipay = AliPay(configAlipay)




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

kuaiSuDi = KSuDi()








exports.getWeixinPayUserOauthCode = (req, res, next) ->
  orderId = req.query.orderid
  unless libs.validator.isLength orderId, 24, 24
    return res.redirect("/mobile/wxpay/" + encodeURIComponent("Weixin Pay Oauth, Field validation error,  orderID _id length must be 24-24") + encodeURIComponent(orderId) )

#  return res.redirect("/mobile/wxpay/" + orderId)

  models.order.findOneAsync({"_id": orderId}).then (resultOrder) ->
    if resultOrder

      models.user.findOneAsync({"_id": resultOrder.user.toString()}).then (resultUser) ->
        if resultUser

#          if resultUser.weixinId.openid?
#            return res.redirect("/mobile/wxpay/" + encodeURIComponent("Weixin Pay Oauth Error, can not found this userId of this order"))
#          else
#            return res.redirect("/mobile/wxpay/" + encodeURIComponent("Weixin Pay Oauth Error, can not found this userId of this order"))

          return res.redirect(weixinpay.getUserOauthUrl("http://m.xinweicook.com/api/orders/payment/weixinpay/openid", resultOrder._id.toString()))

        else
          return res.redirect("/mobile/wxpay/" + encodeURIComponent("Weixin Pay Oauth Error, can not found this userId of this order"))
    else
      return res.redirect("/mobile/wxpay/" + encodeURIComponent("Weixin Pay Oauth Error, can not found this orderId"))

  .catch (err)->
    return res.redirect("/mobile/wxpay/" + encodeURIComponent("Weixin Pay Oauth Error") + encodeURIComponent(JSON.stringify(err)) )










exports.getWeixinPayUserOpenId = (req, res, next) ->
  logger.error("-------- Order Oauth Code Return Url: " + JSON.stringify(req.url) + " ----- " + JSON.stringify(req.query) )
  code = req.query.code
  order_number_state = req.query.state

  if not req.query.code?
    logger.error("Order OpenID Failed code not found: "+JSON.stringify(req.query) )

#  models.order.validationOrderId order_number_state

  unless libs.validator.isLength order_number_state, 24, 24
#    return throw new Err "Field validation error,  orderID _id length must be 24-24", 400
    return res.redirect("/mobile/wxpay/" + encodeURIComponent("Weixin Pay Open Id, Field validation error,  orderID _id length must be 24-24") + encodeURIComponent(order_number_state) )

  if not code or code.length is 0
#    throw new Err "Weixin Pay OpenId get code error,  code is null", 400
    return res.redirect("/mobile/wxpay/" + encodeURIComponent("Weixin Pay Open Id Code Error") + encodeURIComponent(JSON.stringify(req.query)) )


  models.order.findOneAsync({"_id": order_number_state}).then (resultOrder) ->
    if resultOrder

      models.user.findOneAsync({"_id": resultOrder.user.toString()}).then (resultUser) ->
        if resultUser

          if resultUser.weixinId and resultUser.weixinId.openid
            return res.redirect("/mobile/wxpay/" + order_number_state)

          else

            weixinpay.getUserOpenId(code, (err, result) ->

              if err
          #      next(throw new Err "Weixin Pay OpenId get code error,  code is null", 400)
                return res.redirect("/mobile/wxpay/" + encodeURIComponent("Weixin Pay Open Id Request access_token 500 Error") + encodeURIComponent(JSON.stringify(err)) )

              if not result.errcode
                resultUser.weixinId.access_token = result.access_token
                resultUser.weixinId.openid = result.openid
                resultUser.weixinId.refresh_token = result.refresh_token

                resultUser.saveAsync().then (resultUser2) ->
                  return res.redirect("/mobile/wxpay/" + order_number_state)
                .catch (err)->
                    logger.error("Order OpenID Failed Save User error:", JSON.stringify(err))
              else
                # 给开发发送Open短信
                if not conf.debug
                  logger.error("Order OpenID weixin error:", JSON.stringify(result))
                  text = models.sms.constantTemplateSystemErrorNotify("OpenID错误")
                  models.sms.sendSmsVia3rd("13564568304", text)    # 王宇鹏电话
                  models.sms.sendSmsVia3rd("15900719671", text)     # 岳可诚电话

                return res.redirect("/mobile/wxpay/" + encodeURIComponent("Weixin Pay Open Id Request access_token 400 Error errcode found") + encodeURIComponent(JSON.stringify(result)) )
            )

        else
          return res.redirect("/mobile/wxpay/" + encodeURIComponent("Weixin Pay Open Id Error, can not found user of this order"))
      .catch (err)->
          logger.error("Order OpenID Failed Search User error:", JSON.stringify(err))
    else
      return res.redirect("/mobile/wxpay/" + encodeURIComponent("Weixin Pay Open Id Error, can not found this orderId"))

  .catch (err)->
      logger.error("Order OpenID Failed Search OrderId mongo error:", JSON.stringify(err))
      return res.redirect("/mobile/wxpay/" + encodeURIComponent("Weixin Pay Open Id Request access_token 400 Error") + encodeURIComponent(JSON.stringify(err)) )











exports.orderListByUser = (req, res, next) ->
  # 获取该用户所有订单
  models.order.validationGetOrderList req.query

  models.order.find user: req.u._id
  .sort "-createdAt"
  .skip (req.query.skip)
  .limit (req.query.limit)
  .populate({path: 'dishList.dish', select: models.dish.fieldsLess()})
  .populate({path: 'dishList.subDish.dish', select: models.dish.fieldsLess()})
  .execAsync()
  .then (orders) ->
    res.json orders
  , next





exports.orderSingleInfo = (req, res, next) ->
  # 获取某个订单
  models.order.validationOrderId req.params._id

  models.order.findOne _id: req.params._id
  .populate({path: 'dishList.dish', select: models.dish.fieldsLess()})
  .populate({path: 'dishList.subDish.dish', select: models.dish.fieldsLess()})
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









exports.calculateOrderPrice = (req, res, next) ->

  models.order.validationOrderPrice req.body
  models.coupon.validationCouponId req.body.coupon if req.body.coupon or req.body.coupon is ""
  models.coupon.validationCouponCode req.body.promotionCode if req.body.promotionCode or req.body.promotionCode is ""


  dishIdList = []
  dishNumberList = {}

  result =
    dishQuantity : 0
    freight : 6
    dishesPrice : 0
    totalPrice : 0


  for dish,dishIndex in req.body.dishList
    dishIdList.push dish.dish
    dishNumberList[dish.dish] = dish.number + if dishNumberList[dish.dish] then dishNumberList[dish.dish] else 0
    result.dishQuantity = result.dishQuantity + dish.number

    if dish.subDish
      for subDish,subDishIndex in dish.subDish
        dishIdList.push subDish.dish
        dishNumberList[subDish.dish] = subDish.number + if dishNumberList[subDish.dish] then dishNumberList[subDish.dish] else 0
        result.dishQuantity = result.dishQuantity + subDish.number


  models.dish.find99({"_id" : {$in:dishIdList}}).then (resultDishes) ->

    # 处理订单菜品数量和总价
    for dish,dishIndex in resultDishes
      result.dishesPrice = result.dishesPrice + dish.getPrice(dishNumberList[dish._id]) * dishNumberList[dish._id]

    # 计算订单总金额 满100免运费
    if result.dishesPrice > 100 and req.body.cookingType is models.dish.constantCookingType().eat
      result.freight = 0

    result.totalPrice = result.dishesPrice + result.freight

    res.json result





exports.addNewOrder = (req, res, next) ->
  # 新增用户订单


  models.order.validationNewOrder req.body
  models.coupon.validationCouponId req.body.coupon if req.body.coupon or req.body.coupon is ""
  models.coupon.validationCouponCode req.body.promotionCode if req.body.promotionCode or req.body.promotionCode is ""


  if req.body.warehouseId
    models.warehouse.validationId(req.body.warehouseId)


  languageStr = req.acceptsLanguages()

  if languageStr[0] is "en"
    languageStr = "en"
  else
    languageStr = "zh"



  if req.body.address and req.body.address.fromDistance?
    req.body.address.distanceFrom = req.body.address.fromDistance

  # 新增地址ID
  if req.body.addressId or req.body.addressId is ""
    models.useraddress.validationId(req.body.addressId)



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
  dishReadyToEatWithoutDrinkList = []




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
    warehouse : req.body.warehouseId or "56332187594b09af6e6c7dd2" # 新味办公室仓库ID
    addressId : req.body.addressId
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

  if newOrder.freight < 6
    newOrder.freight = 6


  if req.body.cookingType is models.dish.constantCookingType().cook
    newOrder.deliveryDate = req.body.deliveryDateCook
    newOrder.deliveryTime = req.body.deliveryTimeCook
    newOrder.deliveryDateTime = moment(req.body.deliveryDateCook + "T" + req.body.deliveryTimeCook + ":00")
    newOrder.deliveryDateType = models.order.deliveryDateTypeIsNextDayChecker(req.body.deliveryDateCook)

  else
    newOrder.deliveryDate = req.body.deliveryDateEat
    newOrder.deliveryTime = req.body.deliveryTimeEat
    newOrder.deliveryDateTime = moment(req.body.deliveryDateEat + "T" + req.body.deliveryTimeEat + ":00")
    newOrder.deliveryDateType = models.order.deliveryDateTypeIsNextDayChecker(req.body.deliveryDateEat)



  newOrderReadyToCook =
    orderNumber : moment().format('YYYYMMDDHHmmssSSS') + (Math.floor(Math.random() * 9000) + 1000)
    user : req.u._id.toString()
    cookingType :  models.dish.constantCookingType().cook
    isChildOrder : true
    warehouse : "56332187594b09af6e6c7dd2" # 新味办公室仓库ID
    addressId : req.body.addressId
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
    freight : 0
    dishesPrice : 0
    totalPrice : 0
    deliveryDateTime : moment(req.body.deliveryDateCook + "T" + req.body.deliveryTimeCook + ":00") if req.body.deliveryTimeCook
    deliveryDate : req.body.deliveryDateCook
    deliveryTime : req.body.deliveryTimeCook
    deliveryDateType : models.order.deliveryDateTypeIsNextDayChecker(req.body.deliveryDateCook)

  newOrderReadyToEat =
    orderNumber : moment().format('YYYYMMDDHHmmssSSS') + (Math.floor(Math.random() * 9000) + 1000)
    user : req.u._id.toString()
    cookingType :  models.dish.constantCookingType().eat
    isChildOrder : true
    warehouse : req.body.warehouseId or "56332187594b09af6e6c7dd2" # 新味办公室仓库ID
    addressId : req.body.addressId
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
    freight : 0
    dishesPrice : 0
    totalPrice : 0
    deliveryDateTime : moment(req.body.deliveryDateEat + "T" + req.body.deliveryTimeEat + ":00") if req.body.deliveryDateEat
    deliveryDate : req.body.deliveryDateEat
    deliveryTime : req.body.deliveryTimeEat
    deliveryDateType : models.order.deliveryDateTypeIsNextDayChecker(req.body.deliveryDateCook)


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

    models.useraddress.findOneAsync({_id:req.body.addressId})
  .then (resultAddress) ->

    if resultAddress
      if newOrder.cookingType is models.dish.constantCookingType().eat and not resultAddress.isAvailableForEat
        throw new Err "Field validation error,  user address not deliver", 400, Err.code.user.addressNotDeliver

      newOrder.address = resultAddress

      newOrderReadyToEat.address = resultAddress
      newOrderReadyToCook.address = resultAddress

      if resultAddress.warehouse

        newOrder.warehouse = resultAddress.warehouse
        newOrderReadyToEat.warehouse = resultAddress.warehouse.toString()
      else
        # 针对食材包处理
        newOrder.warehouse = "56332187594b09af6e6c7dd2"
        newOrderReadyToCook.warehouse = "56332187594b09af6e6c7dd2"





    if newOrder.address.city is "上海市"
      newOrder.packageType = "paperbox"
      newOrderReadyToCook.packageType = "paperbox"
    else
      newOrder.packageType = "foambox"
      newOrderReadyToCook.packageType = "foambox"





    models.dish.find99({"_id" : {$in:dishIdList}})
  .then (resultDishes) ->

    tempResultDishIdList = _.map(resultDishes, (dish) ->
      dish._id.toString()
    )
    # 判断是否有不存在的菜品ID
    models.order.checkInvalidDishIdList(dishIdList, tempResultDishIdList)

    # 判断饮料不能单独下单，数量不超过十个
    models.order.checkInvalidDrink(resultDishes)

    # 处理订单菜品数量和总价
    for dish,dishIndex in resultDishes
      # 判断菜品库存
      if not newOrder.warehouse
        logger.error("error warehouseid: ",newOrder)

      models.dish.checkOutOfStock(dish, newOrder.warehouse)

      newOrder.dishesPrice = newOrder.dishesPrice + dish.getPrice(dishNumberList[dish._id]) * dishNumberList[dish._id]
      dishHistoryList.push({dish:dish, number:dishNumberList[dish._id]})
      dishDataList[dish._id] = dish


    # 计算订单总金额 满100免运费
    if newOrder.dishesPrice > 100 and req.body.cookingType is models.dish.constantCookingType().eat
      newOrder.freight = 0

    newOrder.totalPrice = newOrder.dishesPrice + newOrder.freight


    # 计算感恩节优惠
    timeNow = moment()
    if req.u.sharedInvitationSendCodeTotalCount > 2 and timeNow.month() is 10 and timeNow.date() < 28 and timeNow.date() > 21 and timeNow.day() is 4
      newOrder.totalPrice = newOrder.totalPrice - 10
      if newOrder.userComment
        newOrder.userComment = newOrder.userComment  + " Thanksgiving Day Discount! "
      else
        newOrder.userComment = "Thanksgiving Day Discount! "


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

      # 处理订单分子订单
      if dishDataList[dish.dish].cookingType is models.dish.constantCookingType().cook
        newOrderReadyToCook.dishesPrice = newOrderReadyToCook.dishesPrice + dishDataList[dish.dish].getPrice(dish.number) * dish.number
        dishReadyToCookList.push({dish:dishDataList[dish.dish], number:dish.number})
        newOrderReadyToCook.dishList.push dish

        if dish.remark?
          if not newOrderReadyToCook.userComment
            newOrderReadyToCook.userComment = ""
          newOrderReadyToCook.userComment = newOrderReadyToCook.userComment + " (" + dishDataList[dish.dish].title.zh + " " + dish.remark + "), "
      else
        # 排除drink 饮品 用于是否拆单判断
        if dishDataList[dish.dish].cookingType is models.dish.constantCookingType().eat and dishDataList[dish.dish].sideDishType is models.dish.constantSideDishType().main
          dishReadyToEatWithoutDrinkList.push({dish:dishDataList[dish.dish], number:dish.number})

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


    if dishReadyToCookList.length > 0 and dishReadyToEatWithoutDrinkList.length > 0
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
    if req.body.promotionCode and resultOrder.promotionDiscount > 0
      promotionCode.used(req.u)

    # 优惠券已使用后处理
    if req.body.coupon and resultOrder.couponDiscount > 0
      coupon.used(req.u)


    # 余额已使用后处理
    if isUsedAccountBalance
      userAccount.reduceMoney(resultOrder.accountUsedDiscount, {zh : "在线消费",en : "Online Pay"}, "", resultOrder._id.toString())


    # 删除用户购物车商品
    if req.u.shoppingCart.length > 0
      cartLength = req.u.shoppingCart.length-1
      for i in [cartLength..0]
        if req.u.shoppingCart[i].dish and dishIdList.indexOf(req.u.shoppingCart[i].dish.toString()) > -1
          req.u.shoppingCart.splice(i, 1)



    # 新增用户的收货地址到用户地址信息里面
    if not req.body.addressId

      newAddress = {}
      newAddress.geoLatitude = req.body.address.geoLatitude if req.body.address.geoLatitude
      newAddress.geoLongitude = req.body.address.geoLongitude if req.body.address.geoLongitude

      newAddress.country = req.body.address.country if req.body.address.country
      newAddress.province = req.body.address.province if req.body.address.province
      newAddress.city = req.body.address.city if req.body.address.city
      newAddress.district = req.body.address.district if req.body.address.district
      newAddress.street = req.body.address.street if req.body.address.street
      newAddress.street_number = req.body.address.street_number if req.body.address.street_number
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


    # 记录最后下单时间
    req.u.lastOrderDate = moment()

    # 新味币支付需要扣除库存等操作
    if resultOrder.totalPrice is 0 and resultOrder.accountUsedDiscount > 0

      # 扣除商品库存
      dishHistoryIdList = []
      dishIdList = {}
      for dish, dishIndex in resultOrder.dishHistory
        dishHistoryIdList.push(dish.dish._id)
        dishIdList[dish.dish._id] = dish.number

      models.dish.find({_id:{ $in:dishHistoryIdList} }).then (resultDishList) ->
        if resultDishList
          for dish, dishIndex in resultDishList
            dish.reduceStock(dishIdList[dish._id.toString()], resultOrder.warehouse, req.u, "userOrder", resultOrder._id.toString())

      # 给客服发送新订单短信
      #models.sms.sendSMSToCSNewOrder(resultOrder.orderNumber)


      # 该用户完成支付后可以再次分享邀请码
      req.u.sharedInvitationSendCodeTotalCount = req.u.sharedInvitationSendCodeTotalCount + 1

      if req.u.sharedInvitationSendCodeTotalCount > req.u.sharedInvitationSendCodeUsedTime
        req.u.isSharedInvitationSendCode = false


    req.u.saveAsync().catch (err)->
      logger.error "New Order User Save error", err



    # 发送iOS 推送
#    additionalContent =
#      userId : req.u._id
#      orderId : resultOrder._id
#
#    pushOptions =
#      isPushMobile : true
#
#    models.message.sendMessageToUser(req.u._id, models.message.constantContentType().orderAdd, additionalContent, pushOptions)


    # 生成支付宝签名
    if req.u.mobile is "15900719671" or req.u.mobile is "18629641521" or req.u.mobile is "13564568304" or req.u.mobile is "18621870070"  # 内测帐号1分钱下单
      resultOrder.totalPrice = 0.01
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
    if req.body.isCityShanghai is true and req.body.isInRange4KM is true
      result = models.order.deliveryTimeArithmeticForReadyToEat()
    else
      result = []

  res.status(200).json(result)



exports.deliveryTimeArithmeticForEatWithWareHouse = (req, res, next) ->

  models.warehouse.find99({}).then (resultWarehouseList) ->

    tempWarehouse = {}
    result = {}

    for warehouse, warehouseIndex in resultWarehouseList
      tempWarehouse[warehouse._id] = warehouse.toObject()
      tempWarehouse[warehouse.name] = warehouse.toObject()


    if req.body.warehouseName is "xinweioffice"
      result = tempWarehouse[req.body.warehouseName]
      result.timeList = models.order.deliveryTimeArithmeticForReadyToEat()
    else if req.body._id is "56332187594b09af6e6c7dd2"
      result = tempWarehouse[req.body._id]
      result.timeList = models.order.deliveryTimeArithmeticForReadyToEat()


    if req.body.warehouseName is "caohejing1"
      result = tempWarehouse[req.body.warehouseName]
      result.timeList = models.order.deliveryTimeArithmeticForReadyToEatAtCaohejing()
    else if req.body._id is "56332196594b09af6e6c7dd7"
      result = tempWarehouse[req.body._id]
      result.timeList = models.order.deliveryTimeArithmeticForReadyToEatAtCaohejing()


    if req.body.warehouseName is "lujiazui1"
      result = tempWarehouse[req.body.warehouseName]
      result.timeList = models.order.deliveryTimeArithmeticForReadyToEatAtLujiazui()
    else if req.body._id is "564ab6de2bde80bd10a9bc60"
      result = tempWarehouse[req.body._id]
      result.timeList = models.order.deliveryTimeArithmeticForReadyToEatAtLujiazui()

    res.status(200).json(result)

  .catch next




exports.generateWeixinPayUnifiedOrder = (req, res, next) ->
  logger.error("-------- UnifiedOrder: " + JSON.stringify(req.url) + " ----- " + JSON.stringify(req.body))

  models.order.validationOrderId req.body._id
  models.order.validationWeixinPayUnifiedOrder req.body


  models.order.findByIdAsync(req.body._id).then (resultOrder) ->
    WXPayOrder = WXPay(configWeiXinPay)
    #处理如果是微信支付需要先生成微信支付的统一订单
    if not resultOrder
      throw new Err "Field validation error,  orderID not found!", 200

    if resultOrder.paymentWeixinpay and resultOrder.paymentWeixinpay.out_trade_no
      throw new Err "Field validation error,  this order already pay by weixinpay!", 200

    models.user.findByIdAsync(resultOrder.user).then (resultUser) ->
      if resultUser

        if resultOrder.clientFrom is "ios"
          WXPayOrder = WXPay(configWeiXinAppPay)

        weixinpayOrder =
          out_trade_no: resultOrder.orderNumber
          total_fee: Math.ceil(resultOrder.totalPrice * 100)
          spbill_create_ip: req.ip # 终端IP APP和网页支付提交用户端ip，Native支付填调用微信支付API的机器IP。

          notify_url: "http://m.xinweicook.com/mobile/wxpay/notify"
          trade_type: req.body.trade_type #JSAPI，NATIVE，APP，WAP
#            openid: req.body.openid  #trade_type=JSAPI，此参数必传，用户在商户appid下的唯一标识。下单前需要调用【网页授权获取用户信息】接口获取到用户的Openid
          product_id : resultOrder._id.toString() #trade_type=NATIVE，此参数必传。此id为二维码中包含的商品ID，商户自行定义。

          body:  resultOrder.dishHistory[0].dish.title.zh
          detail:  resultOrder.dishHistory[0].dish.title.zh

          attach: resultOrder._id.toString() #附加数据，在查询API和支付通知中原样返回，该字段主要用于商户携带订单的自定义数据
          goods_tag : "", #商品标记，代金券或立减优惠功能的参数，说明详见代金券或立减优惠

        if resultUser.weixinId and resultUser.weixinId.openid and resultOrder.clientFrom is "wechat"
          weixinpayOrder.openid = resultUser.weixinId.openid

        if req.u.mobile is "15900719671" or req.u.mobile is "18629641521" or req.u.mobile is "13564568304" or req.u.mobile is "18621870070"  # 内测帐号1分钱下单
          weixinpayOrder.total_fee = 1

        console.log "------------------Weixinpay Unified Order: ", weixinpayOrder
        WXPayOrder.createUnifiedOrder weixinpayOrder, (err, resultWeixinPay) ->
          if err
            next (new Err err)

          if resultWeixinPay

            weixinpayMobileSign =
              appId: configWeiXinPay.appid
              timeStamp: parseInt(+new Date() / 1000, 10) + ""
              nonceStr: WXPayOrder.util.generateNonceString()
              package: "prepay_id="+resultWeixinPay.prepay_id
              signType: "MD5"

            # https://pay.weixin.qq.com/wiki/doc/api/app.php?chapter=8_5
            weixinpayNativeSign =
              appId : configWeiXinAppPay.appid
              partnerId : configWeiXinAppPay.mch_id
              prepayId : resultWeixinPay.prepay_id
              packageValue : 'Sign=WXPay'
              timeStamp: parseInt(+new Date() / 1000, 10) + ""
              nonceStr: WXPayOrder.util.generateNonceString()

            weixinpayNativeSign.sign = WXPayOrder.sign(weixinpayNativeSign);
            weixinpayMobileSign.paySign = WXPayOrder.sign(weixinpayMobileSign);

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
    .catch next


  .catch next





exports.updateOrder = (req, res, next) ->
  # 修改订单
  models.order.validationOrderId req.params._id
  models.order.validationUpdateOrder req.body

  models.order.findById req.params._id
  .populate({path: 'dishList.dish', select: models.dish.fieldsLess()})
  .populate({path: 'dishList.subDish.dish', select: models.dish.fieldsLess()})
  .populate "childOrderList"
  .execAsync()
  .then (resultOrder) ->
    models.order.checkNotFound(resultOrder)

    if req.body.isPaymentPaid is "true" and resultOrder.status isnt models.order.constantStatus().canceled
      # 修改订单支付状态
      resultOrder.isPaymentPaid = true
      resultOrder.status = models.order.constantStatus().paid

      if resultOrder.childOrderList.length > 0
        for childOrder in resultOrder.childOrderList
          childOrder.isPaymentPaid = true
          childOrder.status = models.order.constantStatus().paid
          childOrder.saveAsync()

      # 扣除商品库存
      dishHistoryIdList = []
      dishIdList = {}
      for dish, dishIndex in resultOrder.dishHistory
        dishHistoryIdList.push(dish.dish._id)
        dishIdList[dish.dish._id] = dish.number

      models.dish.find({_id:{ $in:dishHistoryIdList} }).then (resultDishList) ->
        if resultDishList
          for dish, dishIndex in resultDishList
            dish.reduceStock(dishIdList[dish._id.toString()], resultOrder.warehouse, req.u, "userOrder", resultOrder._id.toString())

      # 给客服发送新订单短信
      #models.sms.sendSMSToCSNewOrder(resultOrder.orderNumber)


      # 该用户完成支付后可以再次分享邀请码
      req.u.sharedInvitationSendCodeTotalCount = req.u.sharedInvitationSendCodeTotalCount + 1

      if req.u.sharedInvitationSendCodeTotalCount > req.u.sharedInvitationSendCodeUsedTime
        req.u.isSharedInvitationSendCode = false


      # 避免重复的req.u.save
      if req.u.invitationFromUser and not req.u.isHaveFirstOrderCoupon
        # 该用户首次下单给邀请的人添加优惠券
        models.coupon.addCouponForInvitationRebate(req.u)
      else
        # 用户订单超过5单和10单赠送优惠券

        models.coupon.addCouponPaidManyOrder(req.u)


      if req.u.sharedInvitationSendCodeTotalCount is 7
        # 发送iOS 推送 满6单发新味币充值码
        additionalContent =
          userId : req.u._id
          orderId : resultOrder._id
          code : "XWORDERFIV"

        pushOptions =
          isPushMobile : true

        models.message.sendMessageToUser(req.u._id, models.message.constantContentType().chargeAccountByCode10, additionalContent, pushOptions)

    else
      # 取消订单
      if req.body.status is models.order.constantStatus().canceled and resultOrder.status is models.order.constantStatus().notpaid
        resultOrder.status = models.order.constantStatus().canceled

        if resultOrder.childOrderList.length > 0
          for childOrder in resultOrder.childOrderList
            resultOrder.status = models.order.constantStatus().canceled
            childOrder.saveAsync()

        # 撤销优惠码使用
        if resultOrder.promotionCode
          models.coupon.revokeUsed(resultOrder.promotionCode, req.u._id.toString())

        # 撤销优惠券使用
        if resultOrder.coupon
          models.coupon.revokeUsed(resultOrder.coupon, req.u._id.toString())

        # 撤销余额使用
        if resultOrder.accountUsedDiscount > 0

          models.useraccount.findOneAsync({user : req.u._id.toString()}).then (resultAccount)->
            if resultAccount
              resultAccount.addMoney(resultOrder.accountUsedDiscount, {zh : "订单取消返还",en : "Order cancel return"}, "", resultOrder._id.toString())

    resultOrder.saveAsync()
  .spread (resultOrder, numberAffected) ->
    res.json resultOrder
  .catch next








exports.updateOrderAlipayNotify = (req, res, next) ->
  console.log "========================OrderAlipayNotify :: ", req.body

  models.order.validationAlipayNotify(req.body)

  if req.body.trade_status is "TRADE_SUCCESS" or req.body.trade_status is "TRADE_FINISHED"

#    models.order.findOne {orderNumber : req.body.out_trade_no, status : models.order.constantStatus().notpaid}



    if libs.validator.isLength req.body.out_trade_no, 24, 24
      query = {_id : req.body.out_trade_no}
    else
      query = {orderNumber : req.body.out_trade_no}

    models.order.findOne( query )
    .populate "childOrderList"
    .execAsync()
    .then (resultOrder) ->
      models.order.checkNotFound(resultOrder)


      if resultOrder.isPaymentPaid isnt true
        resultOrder.status = models.order.constantStatus().paid
        resultOrder.isPaymentPaid = true


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



    if resultOrder.isPaymentPaid isnt true
      resultOrder.status = models.order.constantStatus().paid
      resultOrder.isPaymentPaid = true




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












exports.createDeliveryKSuDi = (req, res, next) ->
  models.order.validationOrderId req.params._id

  models.order.findById(req.params._id).execAsync()
  .then (resultOrder)->
    if resultOrder
      kuaiSuDi.createOrder(resultOrder, (err, result)->
        if err
          return next(new Err err.msg, 400)

        resultOrder.express.name = models.order.constantDeliveryName().ksudi
        resultOrder.express.displayName.zh = "快速递"
        resultOrder.express.displayName.en = "快速递"
        resultOrder.express.number = result.runningnumber
        resultOrder.expressStatus = models.order.constantExpressStatus().waitForConfirm

        resultOrder.saveAsync();
        res.send(result)
      )

  .catch(next)





exports.deliveryKSuDiNotify = (req, res, next) ->

  models.order.validationOrderNumber req.body.expressnumber

#  simpleDate =
#    sign: 'e5fee55f8339207036f95016cc4e1830',
#    state: '600',
#    charset: 'utf-8',
#    code: '200',
#    runningnumber: '444292490708486',
#    expressnumber: '201509281151233585526',
#    msg: '保存订单成功!',
#    signtype: 'MD5'

  models.order.findOneAsync({orderNumber:req.body.expressnumber})
  .then (resultOrder)->


    if resultOrder
      if req.body.state is "300"
        resultOrder.expressStatus = models.order.constantExpressStatus().waitForPick
        resultOrder.saveAsync();

        kuaiSuDi.searchOrder(resultOrder, (err, result)->

          if err
            return next(new Err(err.msg, 400))

          if result.record.length > 1
            patternPerson = /^【([\u4e00-\u9fa5]+)，/
            patternMobile = /：(1[0-9]{10})/

            if result.record[1].content.match(patternPerson) and result.record[1].content.match(patternMobile)
              resultOrder.expressPersonName = result.record[1].content.match(patternPerson)[1] #  content: '【陈飞，手机号：13761114427】即将收件，请准备好快件,操作人【杨阳】'
              resultOrder.expressPersonMobile = result.record[1].content.match(patternMobile)[1]

            resultOrder.saveAsync();

        )


      if req.body.state is "400"
        resultOrder.expressStatus = models.order.constantExpressStatus().shipping
        resultOrder.saveAsync();


      if req.body.state is "500"
        resultOrder.expressStatus = models.order.constantExpressStatus().finished
        resultOrder.saveAsync();

#      if req.body.state isnt "300" and req.body.state isnt "400" and req.body.state isnt "500" and req.body.state isnt "600"
#      logger.error("========= Ksudi notify:", JSON.stringify(req.body))

    res.send({code : 200})

  .catch(next)







exports.searchDeliveryKSuDi = (req, res, next) ->
  models.order.validationOrderId req.params._id

  models.order.findById(req.params._id).execAsync()
  .then (resultOrder)->

    if resultOrder

      kuaiSuDi.searchOrder(resultOrder, (err, result)->

        if err
          return next(new Err(err.msg, 400))

        resultOrder.express.name = models.order.constantDeliveryName().ksudi
        resultOrder.express.displayName.zh = "快速递"
        resultOrder.express.displayName.en = "快速递"
        resultOrder.express.number = result.express.runningnumber


        if result.record.length > 1
          patternPerson = /^【([\u4e00-\u9fa5]+)，/
          patternMobile = /：(1[0-9]{10})/

          if result.record[1].content.match(patternPerson) and result.record[1].content.match(patternMobile)
            resultOrder.expressPersonName = result.record[1].content.match(patternPerson)[1] #  content: '【陈飞，手机号：13761114427】即将收件，请准备好快件,操作人【杨阳】'
            resultOrder.expressPersonMobile = result.record[1].content.match(patternMobile)[1]


        if result.express.statusclientcode is "待抢单"
          resultOrder.expressStatus = models.order.constantExpressStatus().waitForConfirm
          resultOrder.saveAsync();

        if result.express.statusclientcode is "待取件"
          resultOrder.expressStatus = models.order.constantExpressStatus().waitForPick
          resultOrder.saveAsync();

        if result.express.statusclientcode is "派送中"
          resultOrder.expressStatus = models.order.constantExpressStatus().shipping
          resultOrder.saveAsync();

        if result.express.statusclientcode is "已签收"
          resultOrder.expressStatus = models.order.constantExpressStatus().finished
          resultOrder.saveAsync();

        if result.express.statusclientcode is "取消"
          resultOrder.expressStatus = models.order.constantExpressStatus().canceled
          resultOrder.saveAsync();

        res.send(result)
      )

  .catch(next)
