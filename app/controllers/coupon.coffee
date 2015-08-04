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
      models.user.checkNotFound (resultUser)
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




