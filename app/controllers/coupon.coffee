# 美食趣闻



exports.couponList = (req, res, next) ->
  models.coupon.findAsync {}
  .then (coupons) ->
    res.json coupons
  , next



exports.couponSingleInfo = (req, res, next) ->
  models.coupon.validationCouponId req.params._id

  models.coupon.find1 ({_id: req.params._id, isExpired : false, isUsed : false})
  .then (resultCoupon) ->
    res.json resultCoupon
  , next


exports.couponSingleInfoByCode = (req, res, next) ->
  models.coupon.validationCouponCode req.params.code

  models.coupon.find1 ({code: req.params.code, isExpired : false, isUsed : false})
  .then (resultCoupon) ->
    res.json resultCoupon
  , next



exports.addNewCoupon = (req, res, next) ->

  models.coupon.validationNewCoupon req.body

  models.coupon.addNew req.body
  .then (resultCoupon) ->
    res.json resultCoupon
  .catch next





exports.assignCouponToUser = (req, res, next) ->

  dataUser = {}
  models.user.findOne ({_id : req.body.userId })
    .then (resultUser) ->
      models.user.UserFound (resultUser)
      dataUser = resultUser
      models.coupon.findOne ({_id : req.body.couponId, isUsed:false, isExpired:false })
    .then (resultCoupon) ->
      models.coupon.checkNotFound resultCoupon

      if dataUser.couponList.indexOf(resultCoupon._id) > -1
        throw new Err "user already have this coupon", 400
      if resultCoupon.user
        throw new Err "coupon already belong to other user", 400

      dataUser.couponList.push resultCoupon._id
      dataUser.saveAsync()
      resultCoupon.user = dataUser._id.toString()
      resultCoupon.saveAsync()
    .spread (resultCoupon2, numberAffected) ->
      res.json resultCoupon2
    .catch next





exports.initNewCoupon = (req, res, next) ->

  couponList = [
    _id : ObjectId("55926f10d5eb6b6f834dec8d")
    isUsed : false
    isExpired : false
    name :
      zh : "优惠券111"
      en : "coupon111"
    price : 1
    priceLimit : 10
    code : models.coupon.gencode()
  ,
    _id : ObjectId("55926f4b06d06ab2835cc444")
    isUsed : false
    isExpired : false
    name :
      zh : "优惠券222"
      en : "coupon222"
    price : 2
    priceLimit : 10
    code : models.coupon.gencode()
  ,
    _id : ObjectId("55926f4d06d06ab2835cc451")
    isUsed : false
    isExpired : false
    name :
      zh : "优惠券333"
      en : "coupon333"
    price : 3
    priceLimit : 10
    code : models.coupon.gencode()
  ,
    _id : ObjectId("55926f4e06d06ab2835cc453")
    isUsed : false
    isExpired : false
    name :
      zh : "优惠券444"
      en : "coupon444"
    price : 1
    priceLimit : 100
    code : models.coupon.gencode()
  ,
    _id : ObjectId("55926f4e06d06ab2835cc454")
    isUsed : false
    isExpired : false
    name :
      zh : "优惠券555"
      en : "coupon555"
    price : 2
    priceLimit : 60
    code : models.coupon.gencode()
  ]


  models.coupon.createAsync couponList
  .then (resultCoupon) ->
    res.json resultCoupon
  , next

