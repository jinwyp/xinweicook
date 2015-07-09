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

    dishesPrice: Number # 菜品总价

    credit: Number # 积分抵扣
    freight: Number # 运费
    totalPrice: Number # 总价
    promotionCode: String # 优惠码
    coupon: String # 优惠券

    userComment: String # 用户备注
    csComment: String # 客服备注

  statics:{
    OrderNotFound : (order) ->
      if not order
        throw new Err "Order ID or OrderNumber not found !", 400
    OrderStatus : () ->
      status =
        notpaid : "not paid"
        paid : "paid"
        makingdish : "making dish"
        shipped : "shipped"
        finished : "finished"
        canceled : "canceled"
    OrderPayment : () ->
      payment =
        alipaydirect : "alipay direct"
        weixinpay : "weixinpay"
        paypal : "paypal"


    validationOrderId : (_id) ->
      unless libs.validator.isLength _id, 24, 24
        return throw new Err "Field validation error,  orderID length must be 24-24", 400

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
        unless libs.validator.equals order.status, @OrderStatus().canceled
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
      unless libs.validator.isLength newOrder.payment, 4, 30
        return throw new Err "Field validation error,  payment length must be 4-30", 400

      if newOrder.payment is @OrderPayment().weixinpay
        unless libs.validator.isIP newOrder.spbill_create_ip
          return throw new Err "Field validation error,  spbill_create_ip must IP valid address", 400
        unless libs.validator.isLength newOrder.trade_type, 3,7
          return throw new Err "Field validation error,  trade_type length must be 3-7", 400

      unless libs.validator.isBoolean newOrder.paymentUsedCash
        return throw new Err "Field validation error,  paymentUsedCash must be true or false", 400
      unless libs.validator.isLength newOrder.deliveryTime, 2, 2
        return throw new Err "Field validation error,  deliveryTime length must be 2-2", 400
      unless libs.validator.isLength newOrder.deliveryDate, 10, 10
        return throw new Err "Field validation error,  deliveryTime length must be 10-10", 400

      unless Array.isArray newOrder.dishList
        return throw new Err "Field validation error,  dishList must be ArrayObject", 400
      else
        for dish,dishIndex in newOrder.dishList
          unless libs.validator.isInt dish.number, {min: 1, max: 100}
            return throw new Err "Field validation error,  dish.number must be 1-100", 400
          unless libs.validator.isLength dish.dish, 24, 24
            return throw new Err "Field validation error,  dishID must be 24-24", 400

    validationAlipayNotify : (order) ->
        unless libs.validator.isLength order.out_trade_no, 21, 22
          return throw new Err "Field validation error,  out_trade_no must be 21-22", 400

    validationWeixinPayNotify : (order) ->
      unless libs.validator.isLength order.return_code, 4, 7
        return throw new Err "Field validation error,  return_code must be 4-7", 400
      unless libs.validator.isLength order.out_trade_no, 21, 22
        return throw new Err "Field validation error,  out_trade_no must be 21-22", 400
  }
  methods: {}
  rest: {}
  plugin: (schema) ->
    schema.plugin autoIncrement.plugin, model: "order", field: "autoIncrementId", startAt: 10000
