# 订单
autoIncrement = require "mongoose-auto-increment"


module.exports =
  schema:
    orderNumber: type: String, unique: true# 订单号
    user: type: Schema.ObjectId, ref: "user"
    warehouse :type: Schema.ObjectId, ref: "warehouse"

    isSplitOrder : type: Boolean, default: false # 订单分割
    isChildOrder : type: Boolean, default: false # 是否是子订单
    childOrderList : [type: Schema.ObjectId, ref: "order"] # 子订单列表

    cookingType: String # ready to cook, ready to eat

    addressId : type: Schema.ObjectId, ref: "useraddress"

    address: # 收货地址
      geoLatitude: Number # 纬度
      geoLongitude: Number # 经度

      country : String
      province: String
      city: String
      district: String
      street : String
      street_number : String
      address: String

      isValid: type: Boolean, default: false

      contactPerson: String
      mobile: String
      alias: String
      remark: String

      distanceFrom : Number   # 距离新味办公室发货 单位米 3公里还是4公里 快递不一样

    clientFrom: String # website, mobileweb, ios, android, wechat(公众号支付),

    payment: String # 支付方式 alipay direct / weixinpay / paypal
    paymentUsedCash: type: Boolean # 是否现金支付
    isPaymentPaid: type: Boolean, default: false # 未支付 已支付

    paymentAlipay :
      notify_time : type: String
      notify_type : type: String
      notify_id : type: String
      sign_type: type: String
      sign: type: String
      out_trade_no : type: String
      subject : type: String
      payment_type : type: String
      trade_no : type: String
      trade_status : type: String
      price : type: Number
      total_fee : type: Number
      quantity : type: Number
      body : type: String
      is_total_fee_adjust : type: String
      use_coupon : type: String
      gmt_create : type: String
      gmt_payment : type : String
      refund_status : type : String
      gmt_refund : type : String
      seller_email : type : String
      buyer_email : type : String
      seller_id : type : String
      buyer_id : type : String

    paymentWeixinpay :

#      JSSdkConfigSign :
#        nonceStr: String
#        timeStamp: String
#        jsapi_ticket: String
#        url: String
#        signature :String

      mobileSign :
        appId : String
        timeStamp: String
        nonceStr: String
        package: String
        signType: String
        paySign: String

      nativeSign :
        appId : String
        partnerId : String
        prepayId : String
        packageValue : String
        nonceStr: String
        timeStamp: String
        sign : String


      nonce_str : type: String # 微信返回的随机字符串
      sign : type: String
      trade_type : type: String # 调用接口提交的交易类型，取值如下：JSAPI，NATIVE，APP，详细说明见参数规定
      prepay_id: type: String # 微信生成的预支付回话标识，用于后续接口调用中使用，该值有效期为2小时
      code_url: type: String # trade_type为NATIVE是有返回，可将该参数值生成二维码展示出来进行扫码支付

      device_info : type: String  # 下面是通知返回字段
      out_trade_no : type: String
      openid : type: String
      bank_type : type: String
      total_fee : type: Number #总金额
      fee_type : type: String
      cash_fee : type: Number # 现金支付金额
      cash_fee_type : type: String # 现金支付货币类型
      coupon_fee : type: Number
      coupon_count : type: Number #代金券或立减优惠使用数量
      transaction_id : type: String
      time_end : type: String


    status: type: String, default: "not paid" # not paid未支付  paid已支付 making dish制作中 shipped已发货 canceled已取消 finished已完成

    express: # 快递
      name: String
      number: String # 快递号
      displayName: zh:String, en:String
      info: zh:String, en:String

    expressStatus: type: String

    expressPersonId: type: Schema.ObjectId, ref: "user"
    expressPersonName: type: String
    expressPersonMobile: type: String
    expressComment: type: String




    deliveryDateTime: Date   # 送达时间
    deliveryDate : String  #一周时间
    deliveryTime : String  #10-12  #12-17 #17-20
    deliveryDateType : String  # 当天送还是第二天送 'today' 'tomorrow'

    dishList:[
      dish: type: Schema.ObjectId, ref: "dish"
      number: Number
      remark: String
      subDish : [
        dish : type: Schema.ObjectId, ref: "dish"
        number: Number
      ]
    ]
    dishHistory: Array


    promotionCode: String # 优惠码
    promotionDiscount: Number # 优惠码金额

    coupon: String # 优惠券ID
    couponDiscount: Number # 优惠券金额

    accountUsedDiscount: Number # 使用的余额

    credit: Number # 积分抵扣
    dishesPrice: Number # 菜品总价
    freight: Number # 运费
    totalPrice: Number # 总价


    userComment: String # 用户备注
    csComment: String # 客服备注

    language: String # 中文zh 英文en

    packageType : String  # 纸盒 paperbox 或者泡沫箱 foambox

  statics:
    fields : ->
      selectFields = "-__v"

    constantStatus : () ->
      status =
        notpaid : "not paid"
        paid : "paid"
        confirmed : "confirmed"
        dishFinished : "dish finished"
        packaged : "packaged"
        shipped : "shipped"
        finished : "finished"
        canceled : "canceled"
    constantExpressStatus : () ->
      status =
        waitForConfirm : "waitForConfirm"
        waitForPick : "waitForPick"
        shipping : "shipping"
        finished : "finished"
        canceled : "canceled"
    constantPayment : () ->
      payment =
        alipaydirect : "alipay direct"
        weixinpay : "weixinpay"
        paypal : "paypal"
        cod : "cod"
        account : "account balance"
    constantClientFrom : () ->
      clientFromType =
        website : "website"
        mobileweb : "mobileweb"
        ios : "ios"
        android : "android"
        wechat : "wechat"
    constantDeliverTimeSegment : () ->
      segment =
        time12:
          name : "12"
          text : "10:00-12:00"
          status : true
        time17:
          name : "17"
          text : "12:00-17:00"
          status : true
        time20:
          name : "20"
          text : "17:00-20:00"
          status : true
        time24:
          name : "10"
          text : "10:00-20:00"
          status : true

    constantDeliveryName : () ->
      deliveryName =
        ksudi : "快速递"

    checkNotFound : (order) ->
      if not order
        throw new Err "Order ID or OrderNumber not found !", 400, Err.code.order.notFound

    checkInvalidDishIdList : (sourceDishIdList, dataBaseDishIdList) ->
      invalidDishIdList = _.difference(sourceDishIdList, dataBaseDishIdList)
      if invalidDishIdList.length > 0
        throw new Err "Some dish invalid in this order ! " + invalidDishIdList.toString(), 400, Err.code.order.dishIdInvalid

    checkInvalidDrink : (dishList) ->
      drinkList = []
      dishWithoutPreferencesList = []

      for dish,dishIndex in dishList
        # 饮料不能单独点
        if dish.sideDishType is models.dish.constantSideDishType().drink
          drinkList.push(dish)

        if dish.sideDishType isnt models.dish.constantSideDishType().preferences
          dishWithoutPreferencesList.push(dish)

      if drinkList.length is dishWithoutPreferencesList.length
        throw new Err "Can't order drink only !", 400, Err.code.order.notOnlyDrink

      if drinkList.length > 10
        throw new Err "Can't order 11 or more drinks!", 400, Err.code.order.notOverTenDrinks


    validationOrderId : (_id) ->
      unless libs.validator.isLength _id, 24, 24
        return throw new Err "Field validation error,  orderID _id length must be 24-24", 400, Err.code.order.orderIdWrong

    validationOrderNumber : (orderNumber) ->
      unless libs.validator.isLength orderNumber, 21, 22
        return throw new Err "Field validation error,  order Number must be 21-22", 400, Err.code.order.orderNumberWrong

    validationGetOrderList : (query) ->
      if query.skip
        unless libs.validator.isInt query.skip, {min: 0}
          return throw new Err "Field validation error,  query skip must be integer", 400
      else
        query.skip = 0

      if query.limit
        unless libs.validator.isInt query.limit, {min: 0, max: 200}
          return throw new Err "Field validation error,  query limit must be integer 0-200", 400
      else
        query.limit = 100

    validationUpdateOrder : (order) ->
      if order.status
        unless libs.validator.equals order.status, @constantStatus().canceled
          return throw new Err "Field validation error,  order status must be string canceled", 400, Err.code.order.orderStatusWrong

      unless libs.validator.isBoolean order.isPaymentPaid
        return throw new Err "Field validation error,  paymentStatus must be true or false", 400, Err.code.order.orderPaymentStatusWrong

    validationNewOrder : (newOrder) ->
      unless libs.validator.isLength newOrder.cookingType, 3, 30
        return throw new Err "Field validation error,  cookingType must be string", 400, Err.code.order.cookingTypeWrong
      unless libs.validator.isLength newOrder.clientFrom, 2, 100, Err.code.order.cookingTypeWrong
        return throw new Err "Field validation error,  clientFrom must be string", 400
      unless libs.validator.isLength newOrder.userComment, 0, 600, Err.code.order.userCommentWrong
        return throw new Err "Field validation error,  userComment must be string 0-600", 400

      unless libs.validator.isInt newOrder.credit, {min: 0}, Err.code.order.creditWrong
        return throw new Err "Field validation error,  credit must be number", 400
      unless libs.validator.isInt newOrder.freight, {min: 0}, Err.code.order.freightWrong
        return throw new Err "Field validation error,  freight must be number > 0", 400
      unless libs.validator.isLength newOrder.payment, 3, 20, Err.code.order.paymentWrong
        return throw new Err "Field validation error,  payment length must be 3-20", 400

      if newOrder.payment isnt @constantPayment().alipaydirect and newOrder.payment isnt @constantPayment().weixinpay and newOrder.payment isnt @constantPayment().paypal and newOrder.payment isnt @constantPayment().cod and newOrder.payment isnt @constantPayment().account
        return throw new Err "Field validation error,  payment text wrong", 400, Err.code.order.paymentWrong

      unless libs.validator.isBoolean newOrder.paymentUsedCash
        return throw new Err "Field validation error,  paymentUsedCash must be true or false", 400, Err.code.order.paymentUsedCashWrong


      if newOrder.deliveryDateCook
        unless libs.validator.matches(newOrder.deliveryDateCook, /^\d{4}-\d{2}-\d{2}$/)
          return throw new Err "Field validation error,  deliveryDateCook length must be 10-10", 400, Err.code.order.deliveryDateCookWrong
        unless libs.validator.matches newOrder.deliveryTimeCook, /^\d{2}:\d{2}$/
          return throw new Err "Field validation error,  deliveryTimeCook length must be 5-5", 400, Err.code.order.deliveryTimeCookWrong

        if newOrder.deliveryDateEat
          unless libs.validator.matches(newOrder.deliveryDateEat, /^\d{4}-\d{2}-\d{2}$/)
            return throw new Err "Field validation error,  deliveryDateCook length must be 10-10", 400, Err.code.order.deliveryDateEatWrong
          unless libs.validator.matches newOrder.deliveryTimeEat, /^\d{2}:\d{2}$/
            return throw new Err "Field validation error,  deliveryTimeCook length must be 5-5", 400, Err.code.order.deliveryTimeEatWrong

      else
        unless libs.validator.matches(newOrder.deliveryDateEat, /^\d{4}-\d{2}-\d{2}$/)
          return throw new Err "Field validation error,  deliveryDateCook length must be 10-10", 400, Err.code.order.deliveryDateEatWrong
        unless libs.validator.matches newOrder.deliveryTimeEat, /^\d{2}:\d{2}$/
          return throw new Err "Field validation error,  deliveryTimeCook length must be 5-5", 400, Err.code.order.deliveryTimeEatWrong

        if newOrder.deliveryDateCook
          unless libs.validator.matches(newOrder.deliveryDateCook, /^\d{4}-\d{2}-\d{2}$/)
            return throw new Err "Field validation error,  deliveryDateCook length must be 10-10", 400, Err.code.order.deliveryDateCookWrong
          unless libs.validator.matches newOrder.deliveryTimeCook, /^\d{2}:\d{2}$/
            return throw new Err "Field validation error,  deliveryTimeCook length must be 5-5", 400, Err.code.order.deliveryTimeCookWrong


      unless Array.isArray newOrder.dishList
        return throw new Err "Field validation error,  dishList must be ArrayObject", 400, Err.code.order.dishListArrayWrong
      else
        if newOrder.dishList.length is 0
          return throw new Err "Field validation error,  dishList must have some dish", 400, Err.code.order.dishListArrayWrong

        for dish,dishIndex in newOrder.dishList
          unless libs.validator.isInt dish.number, {min: 1, max: 100}
            return throw new Err "Field validation error,  dish.number must be 1-100", 400, Err.code.order.dishListDishNumberWrong
          unless libs.validator.isLength dish.dish, 24, 24
            return throw new Err "Field validation error,  dishID must be 24-24", 400, Err.code.order.dishListDishIdWrong

          if Array.isArray dish.subDish
            for subDish,subDishIndex in dish.subDish
              unless libs.validator.isInt subDish.number, {min: 1, max: 100}, Err.code.order.dishListSubDishNumberWrong
                return throw new Err "Field validation error,  subDish.number must be 1-100", 400
              unless libs.validator.isLength subDish.dish, 24, 24, Err.code.order.dishListSubDishIdWrong
                return throw new Err "Field validation error,  subDishID must be 24-24", 400
          else
            if dish.subDish
              throw new Err "Field validation error,  subDish must be Array", 400, Err.code.order.dishListSubDishArrayWrong

      if newOrder.addressId or newOrder.addressId is ""
        unless libs.validator.isLength newOrder.addressId, 24, 24
          return throw new Err "Field validation error,  address _id length must be 24-24", 400, Err.code.order.addressIdWrong

      else
        unless libs.validator.isFloat newOrder.address.geoLatitude
          return throw new Err "Field validation error,  geoLatitude must be isFloat", 400, Err.code.order.addressLatitudeWrong
        unless libs.validator.isFloat newOrder.address.geoLongitude
          return throw new Err "Field validation error,  geoLongitude must be isFloat", 400, Err.code.order.addressLongitudeWrong
        unless libs.validator.isLength newOrder.address.province, 2, 200
          return throw new Err "Field validation error,  province must be 2-200", 400, Err.code.order.addressProvinceWrong
        unless libs.validator.isLength newOrder.address.city, 2, 200
          return throw new Err "Field validation error,  city must be 2-200", 400, Err.code.order.addressCityWrong
        unless libs.validator.isLength newOrder.address.district, 2, 200
          return throw new Err "Field validation error,  district must be 2-200", 400, Err.code.order.addressDistrictWrong
        unless libs.validator.isLength newOrder.address.street, 2, 200
          return throw new Err "Field validation error,  street must be 2-200", 400, Err.code.user.addressStreetWrong
#        unless libs.validator.isLength newOrder.address.street_number, 2, 200
#          return throw new Err "Field validation error,  street_number must be 2-200", 400, Err.code.user.addressStreetNumberWrong
        unless libs.validator.isLength newOrder.address.address, 2, 1000
          return throw new Err "Field validation error,  detail address must be 2-1000", 400, Err.code.user.addressAddressWrong
        unless libs.validator.isLength newOrder.address.contactPerson, 2, 99
          return throw new Err "Field validation error,  contactPerson must be 2-99", 400, Err.code.user.addressContactPersonWrong
        unless libs.validator.isMobilePhone(newOrder.address.mobile, 'zh-CN')
          return throw new Err "Field validation error,  mobileNumber must be zh_CN mobile number", 400, Err.code.user.addressMobileWrong


    validationOrderPrice : (newOrder) ->
      unless libs.validator.isLength newOrder.cookingType, 3, 30
        return throw new Err "Field validation error,  cookingType must be string", 400, Err.code.order.cookingTypeWrong
      unless libs.validator.isLength newOrder.clientFrom, 2, 100, Err.code.order.cookingTypeWrong
        return throw new Err "Field validation error,  clientFrom must be string", 400


      unless Array.isArray newOrder.dishList
        return throw new Err "Field validation error,  dishList must be ArrayObject", 400, Err.code.order.dishListArrayWrong
      else
        if newOrder.dishList.length is 0
          return throw new Err "Field validation error,  dishList must have some dish", 400, Err.code.order.dishListArrayWrong

        for dish,dishIndex in newOrder.dishList
          unless libs.validator.isInt dish.number, {min: 1, max: 100}
            return throw new Err "Field validation error,  dish.number must be 1-100", 400, Err.code.order.dishListDishNumberWrong
          unless libs.validator.isLength dish.dish, 24, 24
            return throw new Err "Field validation error,  dishID must be 24-24", 400, Err.code.order.dishListDishIdWrong

          if Array.isArray dish.subDish
            for subDish,subDishIndex in dish.subDish
              unless libs.validator.isInt subDish.number, {min: 1, max: 100}, Err.code.order.dishListSubDishNumberWrong
                return throw new Err "Field validation error,  subDish.number must be 1-100", 400
              unless libs.validator.isLength subDish.dish, 24, 24, Err.code.order.dishListSubDishIdWrong
                return throw new Err "Field validation error,  subDishID must be 24-24", 400
          else
            if dish.subDish
              throw new Err "Field validation error,  subDish must be Array", 400, Err.code.order.dishListSubDishArrayWrong

      unless libs.validator.isLength newOrder.addressId, 24, 24
        return throw new Err "Field validation error,  address _id length must be 24-24", 400, Err.code.order.addressIdWrong



    validationAlipayNotify : (order) ->
      unless libs.validator.isLength order.out_trade_no, 21, 24
        return throw new Err "Field validation error,  out_trade_no must be 21-24", 400


    validationWeixinPayUnifiedOrder : (body) ->
#        unless libs.validator.isIP body.spbill_create_ip
#          return throw new Err "Field validation error,  spbill_create_ip must IP valid address", 400
      unless libs.validator.isLength body.trade_type, 3,7
        return throw new Err "Field validation error,  trade_type length must be 3-7", 400


    validationWeixinPayNotify : (order) ->
      unless libs.validator.isLength order.return_code, 6, 7
        return throw new Err "Field validation error,  return_code must be 4-7 and must be SUCCESS", 400
      unless libs.validator.isLength order.result_code, 6, 7
        return throw new Err "Field validation error,  result_code must be 4-7 and must be SUCCESS", 400
      unless libs.validator.isLength order.out_trade_no, 21, 22
        return throw new Err "Field validation error,  out_trade_no must be 21-22", 400



    find1 : (options) ->
      @findOne(options).select(@fields()).execAsync()

    find99 : (options, limit) ->
      if not limit
        limit = 999

      @find(options).sort("-createdAt").limit(limit).select(@fields()).execAsync()

    deliveryDateTypeIsNextDayChecker : (date) ->
      deliveryDate =  moment(date)
      timeToday = moment().startOf('day')
      timeTomorrow = timeToday.add(1, 'days')

#      console.log deliveryDate.format("YYYY-MM-DD HH:mm:ss A")

      if timeTomorrow.isSame(deliveryDate, "day")
        result = "tomorrow"
      else
        result = "today"

      result

    deliveryTimeArithmeticByRangeForReadyToCook : (isInRange4KM) ->
      timeFormat = "YYYY-MM-DD HH:mm:ss A"
      timeFormat2 = "YYYY-MM-DD"
      timeNow = moment()
      resultTime = []

      if isInRange4KM
        if timeNow.hour() < 17 # 公司6公里范围内： 当天17:00前下单，可以选择当天的下午或者傍晚 以及之后4天的任何时间段。 当天17:00后下单，可以选择明天在内的5填的任何时间段。
          startPoint = timeNow.clone()
        else
          startPoint = timeNow.clone().add(1, 'days')

      else
        if timeNow.hour() < 17 # 公司6公里范围外： 当天17:00前下单，可以选择明天在内的5天的任何时间段。 当天17:00后下单，可以选择后天在内的5天的任何时间段。
          startPoint = timeNow.clone().add(1, 'days')
        else
          startPoint = timeNow.clone().add(2, 'days')

      for i in [1..5]
        segmentDay =
          day : startPoint.clone().add(i-1, 'days').format(timeFormat2)
          segment : []

        segmentDay.segment.push(models.order.constantDeliverTimeSegment().time12)
        segmentDay.segment.push(models.order.constantDeliverTimeSegment().time17)
        segmentDay.segment.push(models.order.constantDeliverTimeSegment().time20)

        # 排除元旦
        if startPoint.clone().add(i-1, 'days').dayOfYear() isnt 1 and startPoint.clone().add(i-1, 'days').dayOfYear() isnt 2 and startPoint.clone().add(i-1, 'days').dayOfYear() isnt 3
          resultTime.push(segmentDay)

        # 排除春节
#        if startPoint.clone().add(i-1, 'days').month() isnt 1 or (startPoint.clone().add(i-1, 'days').month() is 1 and startPoint.clone().add(i-1, 'days').date() < 6) or (startPoint.clone().add(i-1, 'days').month() is 1 and startPoint.clone().add(i-1, 'days').date() > 13)
#          resultTime.push(segmentDay)

      if isInRange4KM and timeNow.hour() < 17
        if timeNow.hour() < 12
          resultTime[0].segment.splice(0, 1)
        else
          resultTime[0].segment.splice(0, 2)

      resultTime

    deliveryTimeArithmeticNotInShangHaiForReadyToCook : () ->
      timeNow = moment()
      resultTime = []

      for i in [1..5]
        segmentDay =
          day : timeNow.clone().add(i, 'days').format("YYYY-MM-DD HH:mm:ss")
          segment : [models.order.constantDeliverTimeSegment().time24]

        if timeNow.hour() < 11 # 可选时间段： 无。 只能选择某一天，不能保证到底哪一个时间段送到。 当天11:00 前下单，可以选择明天在内的5天。 当天11:00 后下单，可以选择后天在内的5天。
          segmentDay.day = timeNow.clone().add(i, 'days').format("YYYY-MM-DD")
        else
          segmentDay.day = timeNow.clone().add(i+1, 'days').format("YYYY-MM-DD")

        # 排除元旦
        if timeNow.clone().add(i, 'days').dayOfYear() isnt 1 and timeNow.clone().add(i, 'days').dayOfYear() isnt 2 and timeNow.clone().add(i, 'days').dayOfYear() isnt 3
          resultTime.push(segmentDay)

        # 排除春节
#        if timeNow.clone().add(i, 'days').month() isnt 1 or (timeNow.clone().add(i, 'days').month() is 1 and timeNow.clone().add(i, 'days').date() < 6) or (timeNow.clone().add(i, 'days').month() is 1 and timeNow.clone().add(i, 'days').date() > 13)
#          resultTime.push(segmentDay)

      resultTime

    deliveryTimeArithmeticForReadyToEat : () ->
      resultTime = []

      timeNow = moment()
      worktimeStart = moment(timeNow.clone().format("YYYY-MM-DD 10:11"));
      worktimeEnd = moment(timeNow.clone().format("YYYY-MM-DD 19:01"));

      today11AM = moment(timeNow.clone().format("YYYY-MM-DD 11:00"));
      tomorrow11AM = today11AM.clone().add(1, 'days');

      if timeNow.isBefore(worktimeStart)
        startPoint = today11AM.clone()

      if timeNow.isAfter(worktimeEnd)
        startPoint = tomorrow11AM.clone()

      if timeNow.isAfter(worktimeStart) and timeNow.isBefore(worktimeEnd) # 下单时间：11:00 - 19:00
        if timeNow.minute()%30 > 10
          startPoint = timeNow.clone().add(1, 'hours').add((30-timeNow.minute()%30), 'minutes')
        else
          startPoint = timeNow.clone().add(1, 'hours').subtract(timeNow.minute()%30, 'minutes')

      # 处理当天时间段 # 周六周日不发 # 排除元旦
      if timeNow.day() isnt 0 and timeNow.day() isnt 6 and timeNow.dayOfYear() isnt 1 and timeNow.dayOfYear() isnt 2 and timeNow.dayOfYear() isnt 3
        for i in [1..17]
          timeSectionTemp = startPoint.clone().add(30*(i-1), 'minutes')

          # 春节放假前最后一天
          if timeNow.month() is 1 and timeNow.date() is 6
            worktimeEnd = moment(timeNow.clone().format("YYYY-MM-DD 14:20"))

          # 如果计算出来的时间超过 worktimeEnd 点  将不在push进去
          if timeSectionTemp.isBefore(worktimeEnd)
            segmentHour =
              hour : timeSectionTemp.clone().format("YYYY-MM-DD HH:mm")
            resultTime.push(segmentHour)

      # 处理第二天的处理第二天的时间点 不包括周六周日 但如果是星期五后过19点 后会换下周菜单, 也可以下周一订单
      # 排除元旦
      if tomorrow11AM.dayOfYear() isnt 1 and tomorrow11AM.dayOfYear() isnt 2 and tomorrow11AM.dayOfYear() isnt 3

        if timeNow.day() >= 0 and timeNow.day() < 5
          startPointTomorrow = tomorrow11AM.clone()

        if timeNow.day() is 5
          startPointTomorrow = today11AM.clone().add(3, 'days');

        if timeNow.day() is 6
          startPointTomorrow = today11AM.clone().add(2, 'days');

        for i in [1..17]
          timeSectionTemp = startPointTomorrow.clone().add(30*(i-1), 'minutes')

          segmentHour =
            hour : timeSectionTemp.clone().format("YYYY-MM-DD HH:mm")
          resultTime.push(segmentHour)

      resultTime

    deliveryTimeArithmeticForReadyToEatAtCaohejing : () ->
      resultTime = []

      timeNow = moment()

      worktimeStart = moment(timeNow.clone().format("YYYY-MM-DD 10:41"));
      worktimeEnd = moment(timeNow.clone().format("YYYY-MM-DD 13:31"));

      today11AM = moment(timeNow.clone().format("YYYY-MM-DD 11:00"));
      tomorrow11AM = today11AM.clone().add(1, 'days');

      if timeNow.isBefore(worktimeStart)
        startPoint = today11AM.clone()

      if timeNow.isAfter(worktimeEnd)
        startPoint = tomorrow11AM.clone()

      if timeNow.isAfter(worktimeStart) and timeNow.isBefore(worktimeEnd) # 下单时间：10:40 - 13:30
        if timeNow.minute()%30 > 10
          startPoint = timeNow.clone().add(30, 'minutes').add((30-timeNow.minute()%30), 'minutes')
        else
          startPoint = timeNow.clone().add(30, 'minutes').subtract(timeNow.minute()%30, 'minutes')

      # 处理当天时间点 # 周六周日不发 # 并且排除元旦
      if timeNow.day() > 0 and timeNow.day() < 6 and timeNow.dayOfYear() isnt 1 and timeNow.dayOfYear() isnt 2 and timeNow.dayOfYear() isnt 3
        for i in [1..17]
          timeSectionTemp = startPoint.clone().add(30*(i-1), 'minutes')

          # 处理如果计算出来的时间超过 worktimeEnd  将不在push进去
          if timeSectionTemp.isBefore(worktimeEnd)
            segmentHour =
              hour : timeSectionTemp.clone().format("YYYY-MM-DD HH:mm")
            resultTime.push(segmentHour)

      # 处理第二天的时间点 不包括周六和星期天 但如果是星期天过20点 后会换菜单也可以下周一订单
      # 排除元旦
      if tomorrow11AM.dayOfYear() isnt 1 and tomorrow11AM.dayOfYear() isnt 2 and tomorrow11AM.dayOfYear() isnt 3

        if timeNow.day() >= 0 and timeNow.day() < 5
          startPointTomorrow = tomorrow11AM.clone()

        if timeNow.day() is 5
          startPointTomorrow = today11AM.clone().add(3, 'days');

        if timeNow.day() is 6
          startPointTomorrow = today11AM.clone().add(2, 'days');

        for i in [1..6]
          timeSectionTemp = startPointTomorrow.clone().add(30*(i-1), 'minutes')

          segmentHour =
            hour : timeSectionTemp.clone().format("YYYY-MM-DD HH:mm")
          resultTime.push(segmentHour)

      resultTime

    deliveryTimeArithmeticForReadyToEatAtLujiazui : () ->
      resultTime = []

      timeNow = moment()
      worktimeStart = moment(timeNow.clone().format("YYYY-MM-DD 10:41"));
      worktimeEnd = moment(timeNow.clone().format("YYYY-MM-DD 13:31"));

      today11AM = moment(timeNow.clone().format("YYYY-MM-DD 11:00"));
      tomorrow11AM = today11AM.clone().add(1, 'days');

      if timeNow.isBefore(worktimeStart)
        startPoint = today11AM.clone()

      if timeNow.isAfter(worktimeEnd)
        startPoint = tomorrow11AM.clone()

      if timeNow.isAfter(worktimeStart) and timeNow.isBefore(worktimeEnd) # 下单时间：10:40 - 19:00
        if timeNow.minute()%30 > 10
          startPoint = timeNow.clone().add(30, 'minutes').add((30-timeNow.minute()%30), 'minutes')
        else
          startPoint = timeNow.clone().add(30, 'minutes').subtract(timeNow.minute()%30, 'minutes')

      # 处理当天时间点 # 周六周日不发 # 并且排除元旦
      if timeNow.day() > 0 and timeNow.day() < 6 and timeNow.dayOfYear() isnt 1 and timeNow.dayOfYear() isnt 2 and timeNow.dayOfYear() isnt 3
        for i in [1..17]
          timeSectionTemp = startPoint.clone().add(30*(i-1), 'minutes')

          # 处理如果计算出来的时间超过 worktimeEnd  将不在push进去
          if timeSectionTemp.isBefore(worktimeEnd)
            segmentHour =
              hour : timeSectionTemp.clone().format("YYYY-MM-DD HH:mm")
            resultTime.push(segmentHour)

      # 处理第二天的时间点 不包括周六周日 但如果是星期五 过 worktimeEnd  后 会换下周菜单 也可以预订下周一
      # 排除元旦
      if tomorrow11AM.dayOfYear() isnt 1 and tomorrow11AM.dayOfYear() isnt 2 and tomorrow11AM.dayOfYear() isnt 3

        if timeNow.day() >= 0 and timeNow.day() < 5
          startPointTomorrow = tomorrow11AM.clone()

        if timeNow.day() is 5
          startPointTomorrow = today11AM.clone().add(3, 'days');

        if timeNow.day() is 6
          startPointTomorrow = today11AM.clone().add(2, 'days');

        for i in [1..6]
          timeSectionTemp = startPointTomorrow.clone().add(30*(i-1), 'minutes')

          segmentHour =
            hour : timeSectionTemp.clone().format("YYYY-MM-DD HH:mm")
          resultTime.push(segmentHour)

      resultTime

    deliveryTimeArithmeticForReadyToEatAtPujiangzhen : () ->
      resultTime = []

      timeNow = moment()
      worktimeStart = moment(timeNow.clone().format("YYYY-MM-DD 10:01"));
      worktimeEnd = moment(timeNow.clone().format("YYYY-MM-DD 11:01"));

      today11AM = moment(timeNow.clone().format("YYYY-MM-DD 11:00"));
      tomorrow11AM = today11AM.clone().add(1, 'days');

      if timeNow.isBefore(worktimeStart)
        startPoint = today11AM.clone()
      else
        startPoint = tomorrow11AM.clone()


      # 处理当天时间点 # 周六周日不发 # 并且排除元旦
      if timeNow.day() > 0 and timeNow.day() < 6 and timeNow.dayOfYear() isnt 1 and timeNow.dayOfYear() isnt 2 and timeNow.dayOfYear() isnt 3
        for i in [1..1]
          timeSectionTemp = startPoint.clone().add(30*(i-1), 'minutes')

          # 处理如果计算出来的时间超过 worktimeEnd  将不在push进去
          if timeSectionTemp.isBefore(worktimeEnd)
            segmentHour =
              hour : timeSectionTemp.clone().format("YYYY-MM-DD HH:mm")
            resultTime.push(segmentHour)

      # 处理第二天的时间点 不包括周六周日 但如果是星期五 过 worktimeEnd  后 会换下周菜单 也可以预订下周一
      # 排除元旦
      if tomorrow11AM.dayOfYear() isnt 1 and tomorrow11AM.dayOfYear() isnt 2 and tomorrow11AM.dayOfYear() isnt 3

        if timeNow.day() >= 0 and timeNow.day() < 5
          startPointTomorrow = tomorrow11AM.clone()

        if timeNow.day() is 5
          startPointTomorrow = today11AM.clone().add(3, 'days');

        if timeNow.day() is 6
          startPointTomorrow = today11AM.clone().add(2, 'days');

        for i in [1..1]
          timeSectionTemp = startPointTomorrow.clone().add(30*(i-1), 'minutes')

          segmentHour =
            hour : timeSectionTemp.clone().format("YYYY-MM-DD HH:mm")
          resultTime.push(segmentHour)

      resultTime




  methods: {}
  rest:

#    postRead : (req, res, next) ->
#
#      models.order.findOneAsync({_id:req.params.id}).then (resultOrder) ->
#        if resultOrder
#          models.useraddress.findOneAsync({_id:resultOrder.addressId}).then (resultAddress) ->
#            if resultAddress
#              resultOrder.address = resultAddress
#              resultOrder.warehouse = resultAddress.warehouse
#
#            if resultOrder.cookingType is models.dish.constantCookingType().cook
#              # 针对食材包处理
#              resultOrder.warehouse = "56332187594b09af6e6c7dd2"  # 新味办公室仓库ID
#            resultOrder.saveAsync();
#      next()

#      if req.method is "GET"
#
#        if req.query.query
#
#          tempQuery = JSON.parse(req.query.query);
#
#          if tempQuery.addressMobile
#
#            models.order.find({'address.mobile' : tempQuery.addressMobile}).then (resultList) ->
#
#              if req.url.indexOf('count') > -1
#                req.erm.result = {count : resultList.length};
#              else
#                req.erm.result = resultList;
#
#              next()
#
#          else if tempQuery.addressContactPerson
#
#            models.order.find({'address.contactPerson' : tempQuery.addressContactPerson}).then (resultList) ->
#
#              if req.url.indexOf('count') > -1
#                req.erm.result = {count : resultList.length};
#              else
#                req.erm.result = resultList;
#
#              next()
#
#          else
#            next()
#
#        else
#          next()




    postUpdate : (req, res, next) ->
      if req.method is "PUT" and req.body.status is models.order.constantStatus().shipped
        models.order.findOneAsync({_id:req.params.id}).then (resultOrder) ->
          if resultOrder and resultOrder.status is models.order.constantStatus().shipped
            # 给用户发送短信通知, 订单已发货

            if resultOrder.expressPersonName and  resultOrder.expressPersonMobile
              expressText = "配送员 " + resultOrder.expressPersonName + " 手机" + resultOrder.expressPersonMobile
            else
              expressText = ""

            additionalContent =
              userId : resultOrder.user
              orderId : resultOrder._id
              smsText : models.sms.constantTemplateOrderShipped(resultOrder.orderNumber, expressText)
            pushOptions =
              isPushSMS : true
            models.message.sendMessageToUser(resultOrder.user, models.message.constantContentType().orderAdd, additionalContent, pushOptions)


      if req.method is "PUT" and req.body.status is models.order.constantStatus().canceled and req.body.currentOrderStatus is models.order.constantStatus().notpaid
        # 取消订单

        models.order.findOne({_id:req.params.id})
        .populate({path: "dishList.dish", select: models.dish.fieldsLess()})
        .populate({path: "dishList.subDish.dish", select: models.dish.fieldsLess()})
        .populate "childOrderList"
        .execAsync()
        .then (resultOrder) ->
          if resultOrder and resultOrder.status is models.order.constantStatus().canceled

            if resultOrder.childOrderList.length > 0
              for childOrder in resultOrder.childOrderList
                childOrder.status = models.order.constantStatus().canceled
                childOrder.saveAsync()

            # 撤销优惠码使用
            if resultOrder.promotionCode
              models.coupon.revokeUsed(resultOrder.promotionCode, resultOrder.user.toString())

            # 撤销优惠券使用
            if resultOrder.coupon
              models.coupon.revokeUsed(resultOrder.coupon, resultOrder.user.toString())

            # 撤销余额使用
            if resultOrder.accountUsedDiscount > 0

              models.useraccount.findOneAsync({user : resultOrder.user.toString()}).then (resultAccount)->
                if resultAccount
                  resultAccount.addMoney(resultOrder.accountUsedDiscount, {zh : "订单取消返还",en : "Order cancel return"}, "", resultOrder._id.toString())
      next()

  plugin: (schema) ->
    schema.plugin autoIncrement.plugin, model: "order", field: "autoIncrementId", startAt: 10000
