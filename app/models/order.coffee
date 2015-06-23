# 订单
autoIncrement = require "mongoose-auto-increment"
module.exports =
  schema:
    number: type: String, unique: true # 订单号
    user: type: Schema.ObjectId, ref: "user"
    cookingType: String # ready to cook, ready to eat, credit

    address: # 收货地址
      geo:
        lat: Number
        lng: Number
      province: String
      city: String
      region: String
      addr: String
      isValid: type: Boolean, default: false
      name: String
      mobile: String
      alias: String
      remark: String
    delivery: # 送达时间
      date: String
      time: String

    client3rd: String # desktop, mobile, ios, android, wechat(公众号支付), 第三方

    payment: String # 支付方式
    status: String # 未支付 已支付 制作中 已发货 已取消

    dish:[
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


    express: # 快递
      name: String
      number: String
      displayName: zh:String, en:String
      info: zh:String, en:String

    userComment: String # 用户备注
    csComment: String # 客服备注

  statics: {}
  methods: {}
  rest: {}
  plugin: (schema) ->
    schema.plugin autoIncrement.plugin, model: "order", field: "id"
