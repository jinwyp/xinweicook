# 用户账户余额变化记录

module.exports =
  schema:
    user :type: Schema.ObjectId, ref: "user"
    order :type: Schema.ObjectId, ref: "order"
    isPlus : type: Boolean, default: false  # 默认是减库存 状态
    amount : type:Number   # 该数量可以为正负, 正数即为加库存,负数为减库存,不受到isPlus状态干扰
    remark : String

  statics: {}
  methods: {

  }
  rest:{}