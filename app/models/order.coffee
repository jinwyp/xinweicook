# 订单
autoIncrement = require "mongoose-auto-increment"
module.exports =
  schema:
    orderNumber: type: String, unique: true# 订单号
    user: type: Schema.ObjectId, ref: "user"
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


    status: String # not paid未支付  paid已支付 making dish制作中 shipped已发货 canceled已取消 finished已完成

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

    validationGetOrderList : (req) ->
      if req.query.skip
        unless libs.validator.isInt req.query.skip, {min: 0}
          return throw new Err "Field validation error,  query skip must be integer", 400
      else
        req.query.skip = 0

    validationUpdateOrder : (req) ->
      unless libs.validator.isLength req.params._id, 24, 24
        return throw new Err "Field validation error,  orderID length must be 24-24", 400
      unless libs.validator.isBoolean req.body.isPaymentPaid
        return throw new Err "Field validation error,  paymentStatus must be true or false", 400

    validationNewOrder : (req) ->
      unless libs.validator.isLength req.body.cookingType, 3, 30
        throw new Err "Field validation error,  cookingType must be string", 400
      unless libs.validator.isLength req.body.userComment, 0, 300
        throw new Err "Field validation error,  userComment must be string", 400
      unless libs.validator.isLength req.body.clientFrom, 2, 100
        throw new Err "Field validation error,  clientFrom must be string", 400
      unless libs.validator.isInt req.body.credit, {min: 0}
        return throw new Err "Field validation error,  credit must be number", 400
      unless libs.validator.isLength req.body.coupon, 24, 24
        return throw new Err "Field validation error,  coupon id length must be 24-24", 400
      unless libs.validator.isLength req.body.promotionCode, 6, 30
        return throw new Err "Field validation error,  promotionCode id length must be 6-30", 400
      unless libs.validator.isLength req.body.payment, 4, 30
        return throw new Err "Field validation error,  payment length must be 4-30", 400
      unless libs.validator.isBoolean req.body.paymentUsedCash
        return throw new Err "Field validation error,  paymentUsedCash must be true or false", 400
      unless libs.validator.isLength req.body.deliveryTime, 2, 2
        return throw new Err "Field validation error,  deliveryTime length must be 2-2", 400
      unless libs.validator.isLength req.body.deliveryDate, 10, 10
        return throw new Err "Field validation error,  deliveryTime length must be 10-10", 400
      unless Array.isArray req.body.dishList
        throw new Err "Field validation error,  dishList must be ArrayObject", 400
      else
        for dish,dishIndex in req.body.dishList
          unless libs.validator.isInt dish.number, {min: 1, max: 100}
            return throw new Err "Field validation error,  dish.number must be 1-100", 400
          unless libs.validator.isLength dish.dish, 24, 24
            return throw new Err "Field validation error,  dishID must be 24-24", 400

    validationAlipayNotify : (req) ->
        unless libs.validator.isLength req.body.out_trade_no, 21, 22
          return throw new Err "Field validation error,  out_trade_no must be 21-22", 400

  }
  methods: {}
  rest: {}
  plugin: (schema) ->
    schema.plugin autoIncrement.plugin, model: "order", field: "id"
