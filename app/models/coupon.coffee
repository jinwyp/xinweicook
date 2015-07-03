# 优惠券 优惠码
module.exports =
  schema:
    name: zh:String, en:String # 名字
    description: zh:String, en:String
    price: Number
    code: String
    priceLimit: type: Number, default: 0 # 订单金额高于限制才可以使用优惠券

    startDate: type: Date, default: moment()
    endDate: type: Date, default: moment().add(30, 'days')
    isUsed : type: Boolean, default:false
    isExpired : type: Boolean, default:false
    user : type: Schema.Types.ObjectId, ref: 'User'

  statics :
    fields : ->
      selectFields = "-isExpired -isUsed"
    CouponNotFound : (coupon) ->
      if not coupon
        throw new Err "Coupon not Found or used or expired!", 400
      else
        coupon
    validationCouponId : (req) ->
      unless libs.validator.isLength req.params._id, 24, 24
        return throw new Err "Field validation error,  coupon ID length must be 24-24", 400

    gencode : () ->
      randomString = (length = 8)->
        chars = '23456789ABCDEFGHJKMNPQRSTUVWXTZacdefghikmnpqrstuvwxyz'.split('');
        str = ""
        for i in [1..length]
          str += chars[Math.floor(Math.random() * chars.length)];
        str
      return _.sample(['W', 'X', 'Y', 'Z']) + _.sample(['W', 'X', 'Y', 'Z']) + randomString(8)
  methods: {}
  rest: {}
