# 支付明细变化记录

module.exports =
  schema:
    user :type: Schema.ObjectId, ref: "user"
    order :type: Schema.ObjectId, ref: "order"
    businessType : type: String # 业务类型 订单order  或 新味币accountdetail


  statics:{}

  methods: {}
  rest: {}

