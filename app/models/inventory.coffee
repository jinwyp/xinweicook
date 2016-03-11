# 库存变化记录

module.exports =
  schema:
    warehouse :type: Schema.ObjectId, ref: "warehouse"

    dish :type: Schema.ObjectId, ref: "dish"
    user :type: Schema.ObjectId, ref: "user" # 修改人
    order :type: Schema.ObjectId, ref: "order"
    isPlus : type: Boolean, default: false  # 默认是减库存 状态
    price : type:Number   # 菜品价格
    quantity : type:Number   # 该数量可以为正负, 正数即为加库存,负数为减库存,不受到isPlus状态干扰
    cookingType: String # ready to cook食材包, ready to eat便当
    remark : type:String
    deliveryDateTime: Date   # 送达时间
    clientFrom: String # website, mobileweb, ios, android, wechat(公众号支付),
    referrer: String  # 来源于销售推荐

  statics:
    constantRemark : () ->
      type =
        userOrder : "userOrder"
        adminOperation : "adminOperation"
  methods: {}
  rest:{}
