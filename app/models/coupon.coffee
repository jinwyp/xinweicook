# 优惠券 优惠码
module.exports =
  schema:
    name: zh:String, en:String # 名字
    description: zh:String, en:String
    price: Number
    code: String
    priceLimit: type: Number, default: 10 # 订单金额高于限制才可以使用优惠券

    startDate: type: Date, default: moment()
    endDate: type: Date, default: moment().add(90, 'days')
    isExpired : type: Boolean, default:false
    isUsed : type: Boolean, default:false
    usedTime : type: Number, default: 1  # 可以使用次数 0 为无限次  1 为一次 当为0时 isUsed就没用了
    usedUserList : [type: Schema.Types.ObjectId, ref: 'User']

    user : type: Schema.Types.ObjectId, ref: 'User'  # 当使用次数为1 时 绑定某个用户，只能某个用户使用


  statics :
    fields : ->
      selectFields = "-isExpired -isUsed"
    checkNotFound : (coupon) ->
      if not coupon
        throw new Err "Coupon not Found or used or expired!", 400
      else
        coupon

    checkExpired : (coupon) ->
      if moment(new Date(coupon.endDate)).isBefore(moment())
        coupon.isExpired = true
        coupon.save()
        throw new Err "Coupon is expired!", 400
      if moment(new Date(coupon.startDate)).isAfter(moment())
        throw new Err "Coupon is not start to use!", 400

    checkUsed : (coupon, user) ->
      if coupon.usedTime isnt 1
        if coupon.usedUserList.indexOf(user._id) > -1
          throw new Err "Coupon is use by this user!", 400

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
      unless libs.validator.isInt coupon.usedTime, {min: 0, max: 9000}
        return throw new Err "Field validation error,  coupon usedTime must be 0-9000", 400
      if coupon.couponType is "promocode"
        if coupon.code
          @validationCouponCode coupon.code

    find1 : (options) ->
      @findOne(options).select(@fields()).execAsync()
      .then (coupon) ->
        models.coupon.checkNotFound coupon
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
        if newCoupon.code
          createCoupon.code = newCoupon.code
        else
          createCoupon.code = models.coupon.gencode()

      createCoupon = _.assign createCoupon, newCoupon
      @createAsync createCoupon




  methods:
    used : (user) ->
      if @.usedTime is 1
        @.isUsed = true
      else
        if @.usedUserList.indexOf(user._id) is -1
          @.usedUserList.push(user._id)
      @.saveAsync()

  rest:
    middleware : (req, res, next) ->
      if req.method is "POST"
        models.coupon.findOne({$or:[{code:req.body.code}]}, (err, result)->
          if result
            next(new Err("优惠码已经存在 - 后台管理"), 400)
          else
            next()
        )
      else
        next()
