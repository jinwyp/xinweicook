# 订单
autoIncrement = require "mongoose-auto-increment"


module.exports =
  schema:
    orderNumber: type: String, unique: true# 订单号
    user: type: Schema.ObjectId, ref: "user"

    isSplitOrder : type: Boolean, default: false # 订单分割
    isChildOrder : type: Boolean, default: false # 是否是子订单
    childOrderList : [type: Schema.ObjectId, ref: "order"] # 子订单列表

    cookingType: String # ready to cook, ready to eat

    address: # 收货地址
      geoLatitude: Number # 纬度
      geoLongitude: Number # 经度

      country : String
      province: String
      city: String
      district: String
      street : String
      address: String

      isValid: type: Boolean, default: false

      contactPerson: String
      mobile: String
      alias: String
      remark: String

      distanceFrom : Number   # 距离新味办公室发货 单位米 3公里还是4公里 快递不一样

    clientFrom: String # website, ios, android, wechat(公众号支付), 第三方

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
      number: String
      displayName: zh:String, en:String
      info: zh:String, en:String

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

  statics:
    checkNotFound : (order) ->
      if not order
        throw new Err "Order ID or OrderNumber not found !", 400
    checkInvalidDishIdListh : (sourceDishIdList, dataBaseDishIdList) ->
      invalidDishIdList = _.difference(sourceDishIdList, dataBaseDishIdList)
      if invalidDishIdList.length > 0
        throw new Err "Some dish invalid in this order ! " + sourceDishIdList.toString(), 400

    constantStatus : () ->
      status =
        notpaid : "not paid"
        paid : "paid"
        makingdish : "making dish"
        shipped : "shipped"
        finished : "finished"
        canceled : "canceled"
    constantPayment : () ->
      payment =
        alipaydirect : "alipay direct"
        weixinpay : "weixinpay"
        paypal : "paypal"
        cod : "cod"
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
          text : "10:00 - 12:00 AM"
          status : true
        time17:
          name : "17"
          text : "12:00 - 17:00 PM"
          status : true
        time20:
          name : "20"
          text : "17:00 - 20:00 PM"
          status : true

    validationOrderId : (_id) ->
      unless libs.validator.isLength _id, 24, 24
        return throw new Err "Field validation error,  orderID _id length must be 24-24", 400

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
          return throw new Err "Field validation error,  order status must be string canceled", 400

      unless libs.validator.isBoolean order.isPaymentPaid
        return throw new Err "Field validation error,  paymentStatus must be true or false", 400

    validationNewOrder : (newOrder) ->
      unless libs.validator.isLength newOrder.cookingType, 3, 30
        return throw new Err "Field validation error,  cookingType must be string", 400
      unless libs.validator.isLength newOrder.clientFrom, 2, 100
        return throw new Err "Field validation error,  clientFrom must be string", 400
      unless libs.validator.isLength newOrder.userComment, 0, 600
        return throw new Err "Field validation error,  userComment must be string 0-600", 400

      unless libs.validator.isInt newOrder.credit, {min: 0}
        return throw new Err "Field validation error,  credit must be number", 400
      unless libs.validator.isInt newOrder.freight, {min: 5}
        return throw new Err "Field validation error,  freight must be number > 4", 400
      unless libs.validator.isLength newOrder.payment, 3, 20
        return throw new Err "Field validation error,  payment length must be 3-20", 400

      if newOrder.payment isnt @constantPayment().alipaydirect and newOrder.payment isnt @constantPayment().weixinpay and newOrder.payment isnt @constantPayment().paypal and newOrder.payment isnt @constantPayment().cod
        return throw new Err "Field validation error,  payment text wrong", 400

      unless libs.validator.isBoolean newOrder.paymentUsedCash
        return throw new Err "Field validation error,  paymentUsedCash must be true or false", 400


      if newOrder.deliveryDateCook
        unless libs.validator.isLength newOrder.deliveryDateCook, 10, 10
          return throw new Err "Field validation error,  deliveryDateCook length must be 10-10", 400
        unless libs.validator.isLength newOrder.deliveryTimeCook, 5, 5
          return throw new Err "Field validation error,  deliveryTimeCook length must be 5-5", 400
      else
        unless libs.validator.isLength newOrder.deliveryDateEat, 10, 10
          return throw new Err "Field validation error,  deliveryDateCook length must be 10-10", 400
        unless libs.validator.isLength newOrder.deliveryTimeEat, 5, 5
          return throw new Err "Field validation error,  deliveryTimeCook length must be 5-5", 400

      unless Array.isArray newOrder.dishList
        return throw new Err "Field validation error,  dishList must be ArrayObject", 400
      else
        if newOrder.dishList.length is 0
          return throw new Err "Field validation error,  dishList must have some dish", 400

        for dish,dishIndex in newOrder.dishList
          unless libs.validator.isInt dish.number, {min: 1, max: 100}
            return throw new Err "Field validation error,  dish.number must be 1-100", 400
          unless libs.validator.isLength dish.dish, 24, 24
            return throw new Err "Field validation error,  dishID must be 24-24", 400

          if Array.isArray dish.subDish
            for subDish,subDishIndex in dish.subDish
              unless libs.validator.isInt subDish.number, {min: 1, max: 100}
                return throw new Err "Field validation error,  subDish.number must be 1-100", 400
              unless libs.validator.isLength subDish.dish, 24, 24
                return throw new Err "Field validation error,  subDishID must be 24-24", 400
          else
            if dish.subDish
              throw new Err "Field validation error,  subDish must be Array", 400

      unless libs.validator.isFloat newOrder.address.geoLatitude
        return throw new Err "Field validation error,  geoLatitude must be isFloat", 400
      unless libs.validator.isFloat newOrder.address.geoLongitude
        return throw new Err "Field validation error,  geoLongitude must be isFloat", 400
      unless libs.validator.isLength newOrder.address.province, 2, 200
        return throw new Err "Field validation error,  province must be 2-200", 400
      unless libs.validator.isLength newOrder.address.city, 2, 200
        return throw new Err "Field validation error,  city must be 2-200", 400
      unless libs.validator.isLength newOrder.address.district, 2, 200
        return throw new Err "Field validation error,  district must be 2-200", 400
      unless libs.validator.isLength newOrder.address.address, 2, 1000
        return throw new Err "Field validation error,  detail address must be 2-1000", 400
      unless libs.validator.isLength newOrder.address.contactPerson, 2, 99
        return throw new Err "Field validation error,  contactPerson must be 2-99", 400
#      unless libs.validator.isMobilePhone(newOrder.address.mobile, 'zh-CN')
#        return throw new Err "Field validation error,  mobileNumber must be zh_CN mobile number", 400

    validationAlipayNotify : (order) ->
      unless libs.validator.isLength order.out_trade_no, 21, 22
        return throw new Err "Field validation error,  out_trade_no must be 21-22", 400
      if order.trade_status isnt "TRADE_SUCCESS"
        return throw new Err "Field validation error,  trade_status not TRADE_SUCCESS", 400

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


    deliveryDateTypeChecker : (date) ->
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

        if timeNow.hour() < 17 # 公司4公里范围内： 当天17:00前下单，可以选择当天的下午或者傍晚 以及之后4天的任何时间段。 当天17:00后下单，可以选择明天在内的5填的任何时间段。
          for i in [1..5]
            segmentDay =
              day : timeNow.clone().add(i-1, 'days').format(timeFormat2)
              segment : []

            segmentDay.segment.push(models.order.constantDeliverTimeSegment().time12)
            segmentDay.segment.push(models.order.constantDeliverTimeSegment().time17)
            segmentDay.segment.push(models.order.constantDeliverTimeSegment().time20)

            resultTime.push(segmentDay)
#          resultTime[0].segment[0].status = false
          resultTime[0].segment.splice(0, 1)
        else
          for i in [1..5]
            segmentDay =
              day : timeNow.clone().add(i, 'days').format(timeFormat2)
              segment : []

            segmentDay.segment.push(models.order.constantDeliverTimeSegment().time12)
            segmentDay.segment.push(models.order.constantDeliverTimeSegment().time17)
            segmentDay.segment.push(models.order.constantDeliverTimeSegment().time20)

            resultTime.push(segmentDay)
      else

        if timeNow.hour() < 17 # 公司4公里范围外： 当天17:00前下单，可以选择明天在内的5天的任何时间段。 当天17:00后下单，可以选择后天在内的5天的任何时间段。
          for i in [1..5]
            segmentDay =
              day : timeNow.clone().add(i, 'days').format(timeFormat2)
              segment : []

            segmentDay.segment.push(models.order.constantDeliverTimeSegment().time12)
            segmentDay.segment.push(models.order.constantDeliverTimeSegment().time17)
            segmentDay.segment.push(models.order.constantDeliverTimeSegment().time20)

            resultTime.push(segmentDay)
        else
          for i in [1..5]
            segmentDay =
              day : timeNow.clone().add(i+1, 'days').format(timeFormat2)
              segment : []

            segmentDay.segment.push(models.order.constantDeliverTimeSegment().time12)
            segmentDay.segment.push(models.order.constantDeliverTimeSegment().time17)
            segmentDay.segment.push(models.order.constantDeliverTimeSegment().time20)

            resultTime.push(segmentDay)

      resultTime

    deliveryTimeArithmeticNotInShangHaiForReadyToCook : () ->
      timeNow = moment()
      resultTime = []

      for i in [1..5]
        segmentDay =
          day : timeNow.clone().add(i, 'days').format("YYYY-MM-DD HH:mm:ss A")

        if timeNow.hour() < 11 # 可选时间段： 无。 只能选择某一天，不能保证到底哪一个时间段送到。 当天11:00 前下单，可以选择明天在内的5天。 当天11:00 后下单，可以选择后天在内的5天。
          segmentDay.day = timeNow.clone().add(i, 'days').format("YYYY-MM-DD")
        else
          segmentDay.day = timeNow.clone().add(i+1, 'days').format("YYYY-MM-DD")

        resultTime.push(segmentDay)

      resultTime

    deliveryTimeArithmeticForReadyToEat : (isInRange4KM) ->
      resultTime = []

      if isInRange4KM is true
        timeNow = moment()

        today11AM = moment(timeNow.clone().format("YYYY-MM-DD 11"));
        today20PM = moment(timeNow.clone().format("YYYY-MM-DD 20:01"));

        tomorrow11AM = today11AM.clone().add(1, 'days');

        if timeNow.hour() < 10 and timeNow.hour() >=0
          timeStarter = today11AM.clone()

        if timeNow.hour() >= 20 and timeNow.hour() < 24
          timeStarter = tomorrow11AM.clone()

        if timeNow.hour() >= 10 and timeNow.hour() < 20 # 下单时间：11：00 - 20：00
          if timeNow.minute()%30 >= 10
            timeStarter = timeNow.clone().add(1, 'hours').add((30-timeNow.minute()%30), 'minutes')
          else
            timeStarter = timeNow.clone().add(1, 'hours').subtract(timeNow.minute()%30, 'minutes')


        for i in [1..20]
          timeStarterTemp = timeStarter.clone().add(30*(i-1), 'minutes')

          # 处理如果计算出来的时间超过20点  将不在push进去
          if timeStarterTemp.isBefore(today20PM)
            segmentHour =
              hour : timeStarterTemp.clone().format("YYYY-MM-DD HH:mm A")
            resultTime.push(segmentHour)

        # 处理第二天的时间点 不包括星期天
        if timeNow.day() > 0
          for i in [1..18]
            timeStarterTemp2 = tomorrow11AM.clone().add(30*(i-1), 'minutes')
            segmentHour =
              hour : timeStarterTemp2.clone().format("YYYY-MM-DD HH:mm A")
            resultTime.push(segmentHour)

      resultTime


  methods: {}
  rest:
    postProcess : (req, res, next) ->
      if req.method is "PUT" and req.body.status is models.order.constantStatus().shipped
        models.order.findOneAsync({_id:req.params.id}).then (resultOrder) ->
          if resultOrder and resultOrder.status is models.order.constantStatus().shipped
            # 给用户发送短信通知, 订单已发货
            additionalContent =
              userId : resultOrder.user
              orderId : resultOrder._id
              smsText : models.sms.constantTemplateOrderShipped(resultOrder.orderNumber)
            pushOptions =
              isPushSMS : true
            models.message.sendMessageToUser(resultOrder.user, models.message.constantContentType().orderAdd, additionalContent, pushOptions)

  plugin: (schema) ->
    schema.plugin autoIncrement.plugin, model: "order", field: "autoIncrementId", startAt: 10000
