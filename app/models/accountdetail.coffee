# 用户账户余额变化记录

module.exports =
  schema:
    user :type: Schema.ObjectId, ref: "user"
    order :type: Schema.ObjectId, ref: "order"
    coupon :type: Schema.ObjectId, ref: "coupon"
    chargeType : type: String # 充值方式类型 alipaydirect chargecode
    isPlus : type: Boolean, default: false  # 默认是减
    amount : type:Number   # 该数量可以为正负,不受到isPlus状态干扰
    amountXinwei : type:Number   # 新味币充值多少例如充300人民币得到350新味币
    remark : String
    name : zh:String, en:String

    isPaid :  type: Boolean, default: false

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
      body : type: String
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


  statics:
    constantChargeType : () ->
      type =
        alipaydirect : "alipaydirect"
        chargecode : "chargecode"

    checkNotFound : (accoutDetail) ->
      if not accoutDetail
        throw new Err "accoutDetail ID or accoutDetail not found !", 400

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




  methods: {}
  rest: {}

