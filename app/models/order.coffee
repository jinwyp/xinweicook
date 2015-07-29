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
      geoLongitude: Number # 纬度

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
      body : type: Number
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

    dishList:[
      dish: type: Schema.ObjectId, ref: "dish"
      number: Number
      subDish : [
        dish : type: Schema.ObjectId, ref: "dish"
        number: Number
      ]
    ]
    dishHistory: Array


    promotionCode: String # 优惠码
    coupon: String # 优惠券
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
    checkInvalidDishIdListh : (dishIdList) ->
      if dishIdList.length > 0
        throw new Err "Some dish invalid in this order ! " + dishIdList.toString(), 400

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
        query.limit = 50

    validationUpdateOrder : (order) ->
      if order.status
        unless libs.validator.equals order.status, @constantStatus().canceled
          return throw new Err "Field validation error,  order status must be string canceled", 400

      unless libs.validator.isBoolean order.isPaymentPaid
        return throw new Err "Field validation error,  paymentStatus must be true or false", 400

    validationNewOrder : (newOrder) ->
      unless libs.validator.isLength newOrder.cookingType, 3, 30
        return throw new Err "Field validation error,  cookingType must be string", 400
      unless libs.validator.isLength newOrder.userComment, 0, 300
        return throw new Err "Field validation error,  userComment must be string", 400
      unless libs.validator.isLength newOrder.clientFrom, 2, 100
        return throw new Err "Field validation error,  clientFrom must be string", 400
      unless libs.validator.isInt newOrder.credit, {min: 0}
        return throw new Err "Field validation error,  credit must be number", 400
      unless libs.validator.isInt newOrder.freight, {min: 0}
        return throw new Err "Field validation error,  freight must be number", 400
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
              throw new Err "Field validation error,  subDish must be Array", 400

    validationAlipayNotify : (order) ->
      unless libs.validator.isLength order.out_trade_no, 21, 22
        return throw new Err "Field validation error,  out_trade_no must be 21-22", 400

    validationWeixinPayUnifiedOrder : (body) ->
#        unless libs.validator.isIP body.spbill_create_ip
#          return throw new Err "Field validation error,  spbill_create_ip must IP valid address", 400
      unless libs.validator.isLength body.trade_type, 3,7
        return throw new Err "Field validation error,  trade_type length must be 3-7", 400


    validationWeixinPayNotify : (order) ->
      unless libs.validator.isLength order.return_code, 4, 7
        return throw new Err "Field validation error,  return_code must be 4-7", 400
      unless libs.validator.isLength order.out_trade_no, 21, 22
        return throw new Err "Field validation error,  out_trade_no must be 21-22", 400


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
          resultTime[0].segment[0].status = false
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

        if timeNow.hour() >= 11 and timeNow.hour() < 20 # 下单时间：11：00 - 20：00
          if timeNow.minute()%30 >= 10
            timeStarter = timeNow.clone().add(1, 'hours').add((30-timeNow.minute()%30), 'minutes')
          else
            timeStarter = timeNow.clone().add(1, 'hours').subtract(timeNow.minute()%30, 'minutes')

          for i in [1..5]
            timeStarterTemp = timeStarter.clone().add(30*(i-1), 'minutes')
            if timeStarterTemp.hour() < 20 or  timeStarterTemp.hour() is 20 and timeStarterTemp.minute() is 0
              segmentHour =
                hour : timeStarterTemp.clone().format("YYYY-MM-DD HH:mm A")

            else
              #  过20:00 要从第二天11:00开始
              timeStarterTemp.add(15, 'hours').subtract(30, 'minutes')

              segmentHour =
                hour : timeStarterTemp.clone().format("YYYY-MM-DD HH:mm A")


            resultTime.push(segmentHour)
        else
          if timeNow.hour() < 11 and timeNow.hour() >0
            timeStarter = timeNow.clone().add(11-timeNow.hour(), 'hours').subtract(timeNow.minute(), 'minutes')
          else
            timeStarter = timeNow.clone().add(35-timeNow.hour(), 'hours').subtract(timeNow.minute(), 'minutes')

          for i in [1..5]
            timeStarterTemp = timeStarter.clone().add(30*(i-1), 'minutes')
            segmentHour =
              hour : timeStarterTemp.clone().format("YYYY-MM-DD HH:mm A")

            resultTime.push(segmentHour)

      resultTime

  methods: {}
  rest: {}
  plugin: (schema) ->
    schema.plugin autoIncrement.plugin, model: "order", field: "autoIncrementId", startAt: 10000
