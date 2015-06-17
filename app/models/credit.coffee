# 积分
module.exports =
  schema:
    user: type: Schema.ObjectId, ref: "user"
    order: type: Schema.ObjectId, ref: "order"
    number: Number # 正数为收入 负数为消费
    source: zh:String, en:String # 订单消耗/返还/活动/充值
    info: zh:String, en:String
  statics: {}
  methods: {}
  rest: {}
