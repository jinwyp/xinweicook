# 优惠券 优惠码

# 优惠券为绑定用户, 用户不能转移
# 优惠码 目前分为几类 1 只能使用一次的优惠码, 2 能使用多次,但每个人只能使用一次. 3 优惠码可以使用多次, 同一个人也可以使用多次,但优惠码有次数限制

module.exports =
  schema:
    name: zh:String, en:String # 名字
    description: zh:String, en:String
    couponType : String   # 目前有两种类型 优惠码 promocode 和 优惠券 coupon
    price: Number
    code: String
    priceLimit: type: Number, default: 10 # 订单金额高于限制才可以使用优惠券
    usedTime : type: Number, default: 0  # 优惠码使用次数限制, 默认为0 即优惠码没有次数限制 0为无限次 / 1为一次. 当为0时 isUsed就没用了
    usedCountLimitOfOneUser : type: Number, default: 1 # 每个用户使用几次, 默认每人只能使用一次 0为每人无限次

    startDate: type: Date, default: moment()
    endDate: type: Date, default: moment().add(90, 'days')
    isExpired : type: Boolean, default:false
    isUsed : type: Boolean, default:false   # 当usedTime为1时 isUsed 才起作用
    isUsedCount : type: Number, default: 0 # 已使用过的次数

    usedUserList : [type: Schema.Types.ObjectId, ref: 'User']  # 记录哪些用户使用过

    user : type: Schema.Types.ObjectId, ref: 'User'  # 当使用次数为1 时 绑定某个用户，只能某个用户使用


  statics :
    fields : ->
      selectFields = "-isExpired"
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
        if coupon.usedCountLimitOfOneUser is 1
          # 可以使用多次,但一个用户只能使用一次
          if coupon.usedUserList.indexOf(user._id) > -1
            throw new Err "Coupon is use by this user!", 400

        if coupon.usedTime > 1 and coupon.isUsedCount >= coupon.usedTime
          throw new Err "Coupon run out used count !", 400
      else
        if coupon.isUsed
          throw new Err "Coupon is use by this user!", 400

    validationCouponId : (_id) ->
      unless libs.validator.isLength _id, 24, 24
        return throw new Err "Field validation error,  coupon ID length must be 24-24", 400

    validationCouponCode : (code) ->
      unless libs.validator.isLength code, 10, 10
        return throw new Err "Field validation error,  promotion code length must be 10-10", 400

    validationNewCoupon : (coupon) ->
      unless libs.validator.isLength coupon.name.zh, 3, 100
        return throw new Err "Field validation error,  coupon zh name length must be 3-100", 400
      unless libs.validator.isInt coupon.price, {min: 1, max: 200}
        return throw new Err "Field validation error,  coupon price must be number 1-200", 400
      unless libs.validator.isLength coupon.couponType, 4, 20
        return throw new Err "Field validation error,  couponType ID length must be 4-20", 400
      unless libs.validator.isInt coupon.usedTime, {min: 0, max: 9000}
        return throw new Err "Field validation error,  coupon usedTime must be 0-9000", 400
      if coupon.couponType is "promocode"
        @validationCouponCode coupon.code

    find1 : (options) ->
      @findOne(options).select(@fields()).execAsync()

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
        price : 2

      createCoupon = _.assign(createCoupon, newCoupon)

      if newCoupon.couponType is "promocode"

        if newCoupon.code and newCoupon.code isnt ""
          createCoupon.code = newCoupon.code
        else
          createCoupon.code = models.coupon.gencode()

      @createAsync(createCoupon)




  methods:
    used : (user) ->
      if @usedTime is 1
        @isUsed = true
      else
        # 是否每人可以多次使用
        if @usedCountLimitOfOneUser is 1
          if @usedUserList.indexOf(user._id) is -1
            @usedUserList.push(user._id)
            @isUsedCount = @isUsedCount + 1
        else
          @isUsedCount = @isUsedCount + 1

      @saveAsync()

  rest:
    middleware : (req, res, next) ->
      if req.method is "POST"
        models.coupon.findOne({$or:[{code:req.body.code}]}, (err, result)->
          if result
            next(new Err("优惠码已经存在 - 后台管理"), 400)
          else
            next()
        )
      else if req.method is "GET"
        if not req.params.id
          if req.query.code is "true"
            req.query.code = { $exists: true }
          else
            req.query.code = { $exists: false }
        next()
      else
        next()
