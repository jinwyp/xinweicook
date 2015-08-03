# 库存变化记录

module.exports =
  schema:
    dish :type: Schema.ObjectId, ref: "dish"
    user :type: Schema.ObjectId, ref: "user" # 修改人
    isPlus : type: Boolean, default: false  # 默认是减库存 状态
    quantity : type:Number   # 该数量可以为正负, 正数即为加库存,负数为减库存,不受到isPlus状态干扰

  statics: {}
  methods: {}
  rest:{}