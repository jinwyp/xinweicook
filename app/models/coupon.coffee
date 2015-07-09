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

    validationCouponId : (_id) ->
      unless libs.validator.isLength _id, 24, 24
        return throw new Err "Field validation error,  coupon ID length must be 24-24", 400

    validationCouponCode : (code) ->
      unless libs.validator.isLength code, 10, 10
        return throw new Err "Field validation error,  coupon code length must be 10-10", 400

    validationNewCoupon : (coupon) ->
      unless libs.validator.isLength coupon.name.zh, 4, 100
        return throw new Err "Field validation error,  coupon zh name length must be 4-100", 400
      unless libs.validator.isInt coupon.price, {min: 1, max: 200}
        return throw new Err "Field validation error,  coupon price must be number 1-200", 400
      unless libs.validator.isLength coupon.couponType, 4, 20
        return throw new Err "Field validation error,  couponType ID length must be 4-20", 400

    find1 : (options) ->
      @findOne(options).select(@fields()).execAsync()
      .then (coupon) ->
        models.coupon.CouponNotFound coupon
        coupon

    gencode : () ->
      randomString = (length = 8)->
        chars = '23456789ABCDEFGHJKMNPQRSTUVWXTZacdefghikmnpqrstuvwxyz'.split('');
        str = ""
        for i in [1..length]
          str += chars[Math.floor(Math.random() * chars.length)];
        str
      return _.sample(['W', 'X', 'Y', 'Z']) + _.sample(['W', 'X', 'Y', 'Z']) + randomString(8)

    addNew : (newCoupon) ->
      @validationNewCoupon newCoupon

      createCoupon =
        name :
          zh : "优惠券"
          en : "coupon"
        price : 1

      if newCoupon.couponType is "promocode"
        createCoupon.code = models.coupon.gencode()

      createCoupon = _.assign createCoupon, newCoupon
      @createAsync createCoupon

  methods: {}
  rest: {}
