# 用户账户余额变化记录

module.exports =
  schema:
    user :type: Schema.ObjectId, ref: "user"
    order :type: Schema.ObjectId, ref: "order"
    isPlus : type: Boolean, default: false  # 默认是减库存 状态
    amount : type:Number   # 该数量可以为正负, 正数即为加库存,负数为减库存,不受到isPlus状态干扰
    remark : String
    name : String

  statics:
    validationGetAccountDetailList : (query) ->
      if query.skip
        unless libs.validator.isInt query.skip, {min: 0}
          return throw new Err "Field validation error,  query skip must be integer", 400
      else
        query.skip = 0

      if query.limit
        unless libs.validator.isInt query.limit, {min: 0, max: 200}
          return throw new Err "Field validation error,  query limit must be integer 0-200", 400
      else
        query.limit = 200

  methods: {

  }
  rest:{}