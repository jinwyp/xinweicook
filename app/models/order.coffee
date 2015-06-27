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

    payment: String # 支付方式
    paymentStatus: String # 未支付 已支付

    status: String # not paid未支付  paid已支付 making dish制作中 shipped已发货 canceled已取消 finished已完成

    express: # 快递
      name: String
      number: String
      displayName: zh:String, en:String
      info: zh:String, en:String

    delivery: Date   # 送达时间
    deliveryDate : String
    deliveryTime : String

    dishList:[
      dish: type: Schema.ObjectId, ref: "dish"
      number: Number
      subDish : [
        dish : type: Schema.ObjectId, ref: "dish"
        number: Number
      ]
    ]

    dishesPrice: Number # 菜品总价

    credit: Number # 积分抵扣
    freight: Number # 运费
    discount: Number # 折扣
    totalPrice: Number # 总价

    userComment: String # 用户备注
    csComment: String # 客服备注

  statics:{
    validationNewOrder : (req) ->
      unless libs.validator.isLength req.body.cookingType, 3, 20
        throw new Err "Field validation error,  cookingType must be string", 400
      unless libs.validator.isLength req.body.userComment, 0, 300
        throw new Err "Field validation error,  userComment must be string", 400
      unless libs.validator.isLength req.body.clientFrom, 2, 100
        throw new Err "Field validation error,  clientFrom must be string", 400
      unless libs.validator.isInt req.body.credit, {min: 0}
        return throw new Err "Field validation error,  credit must be number", 400
      unless libs.validator.isInt req.body.discount, {min: 0}
        return throw new Err "Field validation error,  discount must be number", 400
      unless Array.isArray req.body.dishList
        throw new Err "Field validation error,  dishList must be ArrayObject", 400
      else
        for dish,dishIndex in req.body.dishList
          unless libs.validator.isInt dish.number, {min: 1, max: 100}
            return throw new Err "Field validation error,  dish.number must be 1-100", 400
          unless libs.validator.isLength dish.dish, 24, 24
            return throw new Err "Field validation error,  dishID must be 24-24", 400
  }
  methods: {}
  rest: {}
  plugin: (schema) ->
    schema.plugin autoIncrement.plugin, model: "order", field: "id"
