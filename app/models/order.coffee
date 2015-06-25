# 订单
autoIncrement = require "mongoose-auto-increment"
module.exports =
  schema:
    orderNumber: type: String, unique: true# 订单号
    user: type: Schema.ObjectId, ref: "user"
    cookingType: String # ready to cook, ready to eat, credit

    address: # 收货地址
      geo:
        lat: Number
        lng: Number
      province: String
      city: String
      region: String
      street : String
      fullAddress: String
      isValid: type: Boolean, default: false

      fullName: String
      mobile: String
      alias: String
      remark: String

    express: # 快递
      name: String
      number: String
      displayName: zh:String, en:String
      info: zh:String, en:String

    delivery: # 送达时间
      date: String
      time: String

    client3rd: String # desktop, mobile, ios, android, wechat(公众号支付), 第三方

    payment: String # 支付方式
    status: String # 未支付 已支付 制作中 已发货 已取消

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
      unless Array.isArray req.body.dishList
        throw new Err "Field validation error,  dishList must be ArrayObject", 400
      else
        for dish,dishIndex in req.body.dishList
          unless libs.validator.isInt dish.number, {min: 1, max: 100}
            throw new Err "Field validation error,  dish.number must be 1-100", 400
          unless libs.validator.isLength dish.dish, 24, 24
            throw new Err "Field validation error,  dishID must be 24-24", 400
  }
  methods: {}
  rest: {}
  plugin: (schema) ->
    schema.plugin autoIncrement.plugin, model: "order", field: "id"
