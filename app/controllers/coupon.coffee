# 美食趣闻



exports.couponList = (req, res, next) ->
  models.coupon.findAsync {}
  .then (coupons) ->
    res.json coupons
  , next



exports.couponSingleInfo = (req, res, next) ->
  models.coupon.validationCouponId req.params._id

  models.coupon.find1({_id: req.params._id, isExpired : false, isUsed : false}).then (resultCoupon) ->
    models.coupon.checkNotFound resultCoupon
    models.coupon.checkExpired resultCoupon
    models.coupon.checkUsed(resultCoupon, req.u)

    res.json resultCoupon
  .catch(next)


exports.couponSingleInfoByCode = (req, res, next) ->
  models.coupon.validationCouponCode req.params.code

  models.coupon.find1({code: req.params.code, isExpired : false, isUsed : false}).then (resultCoupon) ->
    models.coupon.checkNotFound resultCoupon
    models.coupon.checkExpired resultCoupon
    models.coupon.checkUsed(resultCoupon, req.u)

    res.json resultCoupon
  .catch(next)








# 用户分享朋友圈获得优惠券
exports.getCouponForUserShare = (req, res, next) ->

  if not req.u.isSharedInvitationSendCode

    newCoupon =
      name :
        zh : "分享朋友圈优惠券"
        en : "Share To Friends Coupon"
      price : 5
      couponType : "coupon"
      usedTime : 1
      user : req.u._id.toString()

    Promise.all([models.coupon.addNew(newCoupon), models.coupon.addNew(newCoupon)])
    .then (resultCouponList)->
      for coupon, couponIndex in resultCouponList
        req.u.couponList.push(coupon._id.toString())

      req.u.isSharedInvitationSendCode = true
      req.u.saveAsync()

    .then (user)->

      res.json user[0]

    .catch next
  else
    res.json req.u



# 用户使用朋友的推荐码获得优惠券
exports.getCouponForUserInvitationSendCode = (req, res, next) ->

  models.user.validationInvitationSendCode(req.params.invitationCode)

  if not req.u.isUsedInvitationSendCode

    newCoupon =
      name :
        zh : "好友邀请优惠券"
        en : "Friend Invitation Coupon"
      price : 10
      couponType : "coupon"
      usedTime : 1
      user : req.u._id.toString()

    models.coupon.addNew(newCoupon)
    .then (resultCouponList)->
      req.u.couponList.push(resultCouponList._id.toString())

      req.u.isUsedInvitationSendCode = true
      req.u.saveAsync()

    .then (user)->

      res.json user[0]

    .catch next
  else
    res.json req.u






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




