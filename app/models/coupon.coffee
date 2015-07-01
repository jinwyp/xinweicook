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
    CouponNotFound : (coupon) ->
      if not coupon
        throw new Err "Coupon not Found or used or expired!", 400
      else
        coupon
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
