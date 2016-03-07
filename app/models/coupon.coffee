# 优惠券 优惠码

# 优惠券为绑定用户, 用户不能转移
# 优惠码 目前分为几类 1 只能使用一次的优惠码, 2 能使用多次,但每个人只能使用一次. 3 优惠码可以使用多次, 同一个人也可以使用多次,但优惠码有次数限制

module.exports =
  schema:
    name: zh:String, en:String # 名字
    description: zh:String, en:String
    couponType : String   # 目前有两种类型 优惠码 promocode promocodepercentage 和 优惠券 coupon 和 充值卡码 accountchargecode
    price: Number
    code: String
    priceLimit: type: Number, default: 50 # 订单金额高于限制才可以使用优惠券
    usedTime : type: Number, default: 0  # 优惠码使用次数限制, 默认为0 即优惠码没有次数限制 0为无限次 / 1为一次. 当为0时 isUsed就没用了
    usedCountLimitOfOneUser : type: Number, default: 1 # 每个用户使用几次, 默认每人只能使用一次 0为每人无限次

    startDate: type: Date, default: moment().startOf('day')
    endDate: type: Date, default: moment().startOf('day').add(31, 'days')
    isExpired : type: Boolean, default:false
    isUsed : type: Boolean, default:false   # 当usedTime为1时 isUsed 才起作用
    isUsedCount : type: Number, default: 0 # 已使用过的次数

    usedUserList : [type: Schema.Types.ObjectId, ref: 'user']  # 记录哪些用户使用过

    user : type: Schema.Types.ObjectId, ref: 'user'  # 当usedTime使用次数为1 时 绑定某个用户，只能某个用户使用

    fromCoupon : type: Schema.Types.ObjectId, ref: 'coupon'  # 该优惠券是从哪个优惠券兑换码而来的


  statics :
    fields : ->
      selectFields = "-isExpired"

    constantCouponType : () ->
      type =
        code : ["promocode", "promocodepercentage"]
        promocode : "promocode"
        promocodePercentage : "promocodepercentage"
        coupon : "coupon"
        accountchargecode : "accountchargecode"
        couponchargecode : "couponchargecode"
    checkNotFound : (coupon) ->
      if not coupon
        throw new Err "Coupon not Found or used or expired!", 400, Err.code.coupon.notFound
      else
        coupon

    checkExpired : (coupon) ->
      if moment(new Date(coupon.endDate)).isBefore(moment())
        coupon.isExpired = true
        coupon.save()
        throw new Err "Coupon is expired!", 400, Err.code.coupon.expired
      if moment(new Date(coupon.startDate)).isAfter(moment())
        throw new Err "Coupon is not start to use!", 400, Err.code.coupon.notStart

    checkUsed : (coupon, user) ->
      if coupon.usedTime isnt 1
        if coupon.usedCountLimitOfOneUser is 1
          # 可以使用多次,但一个用户只能使用一次
          if coupon.usedUserList.indexOf(user._id) > -1
            throw new Err "Coupon is used by this user!", 400, Err.code.coupon.used

        if coupon.usedTime > 1 and coupon.isUsedCount >= coupon.usedTime
          throw new Err "Coupon run out used count !", 400, Err.code.coupon.outOfCount
      else
        if coupon.isUsed
          throw new Err "Coupon is use by this user!", 400, Err.code.coupon.used

    validationCouponId : (_id) ->
      unless libs.validator.isLength _id, 24, 24
        return throw new Err "Field validation error,  coupon ID length must be 24-24", 400, Err.code.coupon.couponIdWrong

    validationCouponCode : (code) ->
      unless libs.validator.isLength code, 10, 10
        return throw new Err "Field validation error,  promotion code length must be 10-10", 400, Err.code.coupon.promotionCodeWrong

    validationNewCoupon : (coupon) ->
      unless libs.validator.isLength coupon.name.zh, 3, 100
        return throw new Err "Field validation error,  coupon zh name length must be 3-100", 400
      unless libs.validator.isInt coupon.price, {min: 1, max: 5000}
        return throw new Err "Field validation error,  coupon price must be number 1-5000", 400
      unless libs.validator.isLength coupon.couponType, 4, 20
        return throw new Err "Field validation error,  couponType ID length must be 4-20", 400
      unless libs.validator.isInt coupon.usedTime, {min: 0, max: 9000}
        return throw new Err "Field validation error,  coupon usedTime must be 0-9000", 400
      if coupon.couponType is models.coupon.constantCouponType().promocode or coupon.couponType is models.coupon.constantCouponType().accountchargecode
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
    gencodeCharge : () ->
      randomString = (length = 8)->
        chars = '23456789ABCDEFGHJKMNPQRSTUVWXTZacdefghikmnpqrstuvwxyz'.split('');
        str = ""
        for i in [1..length]
          str += chars[Math.floor(Math.random() * chars.length)];
        str
      return _.sample(['E', 'F', 'G', 'H']) + _.sample(['E', 'F', 'G', 'H']) + randomString(8)

    verifyCoupon15W : (couponcode) ->
      strStart = couponcode.substring(0,2);
      strMid = couponcode.substring(6,9);
      strLast = couponcode.substring(9,10);

      chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
      total = 0
      for j in [0..8]
        total = total + chars.indexOf(couponcode[j])

      # 身份证校验位 Y: 0 1 2 3 4 5 6 7 8 9 10 校验码: 1 0 X 9 8 7 6 5 4 3 2
      verifyCode = ["1", "0", "X", "9", "8", "7",  "6", "5", "4", "3", "2"]

      strtemp = verifyCode[total%11]

#      console.log strStart,strMid, strLast, strtemp

      if strStart is "XW" and strMid is "XWC" and strLast is strtemp
        return true
      else
        false

    revokeUsed : (couponcode, userId) ->
      promiseCoupon = {}
      if libs.validator.isLength(couponcode, 10, 10)
        promiseCoupon = models.coupon.findOneAsync({code : couponcode})
      else
        promiseCoupon = models.coupon.findOneAsync({_id : couponcode})

      promiseCoupon.then (resultCuopon) ->

        if resultCuopon

          if resultCuopon.usedTime is 1
            resultCuopon.isUsed = false
          else
            # 是否每人可以多次使用
            if resultCuopon.usedCountLimitOfOneUser is 1
              couponIndex = resultCuopon.usedUserList.indexOf(userId)
              if couponIndex > -1
                resultCuopon.usedUserList.splice(couponIndex, 1)
                resultCuopon.isUsedCount = resultCuopon.isUsedCount - 1
            else
              resultCuopon.isUsedCount = resultCuopon.isUsedCount - 1

          resultCuopon.saveAsync()

    addNew : (newCoupon) ->
      @validationNewCoupon newCoupon

      createCoupon =
        name :
          zh : "优惠券"
          en : "coupon"
        price : 2
        couponType : models.coupon.constantCouponType().promocode

      createCoupon = _.assign(createCoupon, newCoupon)

      if newCoupon.couponType is models.coupon.constantCouponType().promocode

        if newCoupon.code and newCoupon.code isnt ""
          createCoupon.code = newCoupon.code
        else
          createCoupon.code = models.coupon.gencode()

      @createAsync(createCoupon)

    addCouponForNewUser : (user, req) ->
      # 新注册用户 送2张5元优惠券
      newCoupon =
        name :
          zh : "新注册用户优惠券"
          en : "NewUserCoupon"
        price : 5
        priceLimit : 10
        couponType : models.coupon.constantCouponType().coupon
        usedTime : 1
        user : user._id.toString()
        endDate: moment().startOf('day').add(90, 'days')

      newCouponList = []
      newCouponList.push(newCoupon)
      newCouponList.push(newCoupon)


      #新iOS用户送1张15元优惠券
      newCouponIOS =
        name :
          zh : "新APP注册用户优惠券"
          en : "New App User Coupon"
        price : 10
        priceLimit : 10
        couponType : models.coupon.constantCouponType().coupon
        usedTime : 1
        user : user._id.toString()
        endDate: moment().startOf('day').add(90, 'days')

      if not user.firstTimeRegFromApp and req.get("user-agent") is "Xinwei Cook"
        newCouponList.push(newCouponIOS)

      models.coupon.createAsync(newCouponList).then (resultCouponList)->

        for coupon, couponIndex in resultCouponList
          user.couponList.push(coupon._id.toString())

        if not user.firstTimeRegFromApp and req.get("user-agent") is "Xinwei Cook"
          user.firstTimeRegFromApp = true

        user.saveAsync()



    addCouponFromCouponChargeCode : (user, couponChargeCode) ->
      # 扫二维码 送1张5元优惠券

      models.coupon.validationCouponCode(couponChargeCode)
      couponData = {}

      models.coupon.findOneAsync({code : couponChargeCode, couponType:models.coupon.constantCouponType().couponchargecode, isExpired : false, isUsed : false})
      .then (resultCoupon)->

        models.coupon.checkNotFound resultCoupon
        models.coupon.checkUsed(resultCoupon, user)
        couponData = resultCoupon

        unless resultCoupon.code.indexOf('XWNOD') is -1
          zhName = "扫二维码优惠券 " + resultCoupon.code
          enName = "QR Code Coupon " + resultCoupon.code
        else
          zhName = resultCoupon.name.zh
          enName = resultCoupon.name.en

        newCoupon =
          name :
            zh : zhName
            en : enName
          price : couponData.price
          priceLimit: couponData.priceLimit or 50
          couponType : models.coupon.constantCouponType().coupon
          usedTime : 1
          user : user._id.toString()
          fromCoupon : resultCoupon._id.toString()
          endDate: couponData.endDate

        models.coupon.createAsync(newCoupon)
      .then (resultCouponList)->
        user.couponList.push(resultCouponList._id.toString())
        couponData.used(user)
        user.saveAsync()



    addCouponForShare : (user) ->
      # 用户分享朋友圈获得2张5元优惠券
      if not user.isSharedInvitationSendCode

        newCoupon =
          name :
            zh : "分享朋友圈优惠券"
            en : "Share To Friends Coupon"
          price : 5
          couponType : models.coupon.constantCouponType().coupon
          usedTime : 1
          user : user._id.toString()

        newCouponList = []
        newCouponList.push(newCoupon)
        newCouponList.push(newCoupon)

        models.coupon.createAsync(newCouponList).then (resultCouponList)->

          for coupon, couponIndex in resultCouponList
            user.couponList.push(coupon._id.toString())

          user.isSharedInvitationSendCode = true
          user.sharedInvitationSendCodeUsedTime = user.sharedInvitationSendCodeUsedTime + 1
          user.saveAsync()

    addCouponFromInvitationSendCode : (user, invitationCode) ->
      # 用户使用朋友的邀请码获得1张10元优惠券
      if not user.isUsedInvitationSendCode

        # 用户不能自己邀请自己
        models.user.findOneAsync({invitationSendCode:invitationCode, _id:{$ne:user._id.toString()} } ).then (resultUser)->
          models.user.checkNotFound(resultUser)

          user.invitationFromCode = resultUser.invitationSendCode
          user.invitationFromUser = resultUser._id.toString()

          newCoupon =
            name :
              zh : "好友邀请优惠券"
              en : "Friend Invitation Coupon"
            price : 10
            priceLimit: 10
            couponType : models.coupon.constantCouponType().coupon
            usedTime : 1
            user : user._id.toString()

          models.coupon.createAsync(newCoupon)

        .then (resultCouponList)->
          user.couponList.push(resultCouponList._id.toString())

          user.isUsedInvitationSendCode = true
          user.saveAsync()

    addCouponForInvitationRebate : (user) ->
      # 该用户首次下单给邀请的人添加优惠券
      if user.invitationFromUser and not user.isHaveFirstOrderCoupon
        models.user.findOneAsync({_id:user.invitationFromUser}).then (fromUser) ->

          if fromUser
            fromUser.invitedUserNumberHaveOrder = fromUser.invitedUserNumberHaveOrder + 1

            newCoupon =
              name :
                zh : "邀请的好友首次下单返利优惠券"
                en : "Friend First Order Rebate Coupon"
              price : 10
              priceLimit: 10
              couponType : models.coupon.constantCouponType().coupon
              usedTime : 1
              user : fromUser._id.toString()

            # 邀请5人下单了送一张35元的优惠券
            newCoupon5Person =
              name :
                zh : "邀请5名好友并下单返利优惠券"
                en : "5 Friends Order Rebate Coupon"
              price : 35
              priceLimit: 10
              couponType : models.coupon.constantCouponType().coupon
              usedTime : 1
              user : fromUser._id.toString()

            # 邀请了10个好友下单得50元优惠券一张
            newCoupon10Person =
              name :
                zh : "邀请10名好友并下单返利优惠券"
                en : "10 Friends Order Rebate Coupon"
              price : 50
              priceLimit: 10
              couponType : models.coupon.constantCouponType().coupon
              usedTime : 1
              user : fromUser._id.toString()

            # 邀请了20个好友下单得100元优惠券
            newCoupon20Person =
              name :
                zh : "邀请20名好友并下单返利优惠券"
                en : "20 Friends Order Rebate Coupon"
              price : 100
              priceLimit: 10
              couponType : models.coupon.constantCouponType().coupon
              usedTime : 1
              user : fromUser._id.toString()

            newCouponList = []
            newCouponList.push(newCoupon)

            if fromUser.invitedUserNumberHaveOrder is 5
              newCouponList.push(newCoupon5Person)

            if fromUser.invitedUserNumberHaveOrder is 10
              newCouponList.push(newCoupon10Person)

            if fromUser.invitedUserNumberHaveOrder is 20
              newCouponList.push(newCoupon20Person)

            models.coupon.createAsync(newCouponList).then (resultCouponList)->
              for coupon, couponIndex in resultCouponList
                fromUser.couponList.push(coupon._id.toString())

              fromUser.saveAsync()
              user.isHaveFirstOrderCoupon = true

              # 发送iOS 推送
              additionalContent = {userId : user._id.toString()}
              pushOptions = {isPushMobile : true}

              models.message.sendMessageToUser(user._id, models.message.constantContentType().coupon, additionalContent, pushOptions)

              user.saveAsync()


    addCouponPaidManyOrder : (user) ->
      # 用户订单超过5单和10单赠送优惠券
      newCouponList = []
      if user.sharedInvitationSendCodeTotalCount >=6 and not user.isPaid5Orders
        newCoupon5 =
          name :
            zh : "满5单优惠券"
            en : "Achieve 5 orders Coupon"
          price : 10
          couponType : models.coupon.constantCouponType().coupon
          usedTime : 1
          user : user._id.toString()

        newCouponList.push(newCoupon5)

      if user.sharedInvitationSendCodeTotalCount >=11 and not user.isPaid10Orders
        newCoupon10 =
          name :
            zh : "满10单优惠券"
            en : "Achieve 10 orders Coupon"
          price : 20
          couponType : models.coupon.constantCouponType().coupon
          usedTime : 1
          user : user._id.toString()
        newCouponList.push(newCoupon10)

      if (user.sharedInvitationSendCodeTotalCount-1) %% 10 is 0 and user.sharedInvitationSendCodeTotalCount <= 101 and user.sharedInvitationSendCodeTotalCount >18
        newCoupon20 =
          name :
            zh : "满" + (user.sharedInvitationSendCodeTotalCount-1).toString() + "单优惠券"
            en : "Achieve" + (user.sharedInvitationSendCodeTotalCount-1).toString()  + " orders Coupon"
          price : 20
          couponType : models.coupon.constantCouponType().coupon
          usedTime : 1
          user : user._id.toString()
        newCouponList.push(newCoupon20)

      if newCouponList.length > 0
        models.coupon.createAsync(newCouponList).then (resultCouponList)->
          for coupon, couponIndex in resultCouponList
            user.couponList.push(coupon._id.toString())
            if coupon.price is 10
              user.isPaid5Orders = true
            if coupon.price is 20
              user.isPaid10Orders = true

          # 发送iOS 推送
          additionalContent = {userId : user._id.toString()}
          pushOptions = {isPushMobile : true}

          models.message.sendMessageToUser(user._id, models.message.constantContentType().coupon, additionalContent, pushOptions)

          user.saveAsync()
      else
        user.saveAsync()






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
    preMiddleware : (req, res, next) ->
      # 检查优惠码是否重复
      if req.method is "POST" and req.body.code
        models.coupon.findOneAsync({$or:[{code:req.body.code}]}).then (result)->

          if result
            next(new Err("优惠码已经存在 - 后台管理"), 400)
          else
            next()

      else if req.method is "PUT" and req.body.code

        req.body.startDate = moment(req.body.startDate).startOf('day').toDate()
        req.body.endDate = moment(req.body.endDate).startOf('day').toDate()


        models.coupon.findOneAsync({_id:req.params.id}).then (result)->

          if result

            if result.code is req.body.code
              next()

            else
              models.coupon.findAsync({code: req.body.code}).then ( result2)->

                if result2 and result2.length > 0
                  next(new Err("优惠码已经存在 - 后台管理"), 400)
                else
                  next()

      else
        next()



    postCreate : (req, res, next) ->

      if req.method is "POST"

        # 给用户新增优惠券
        if req.body.user and req.body.user.length > 23
          models.user.findOneAsync({_id:req.body.user}).then (resultUser) ->
            if resultUser
              models.coupon.findAsync({user:req.body.user}).then (resultCoupons) ->
                if resultCoupons
                  tempLength = resultCoupons.length-1
                  for i in [0..tempLength]
                    if resultUser.couponList.indexOf(resultCoupons[i]._id.toString()) is -1
                      resultUser.couponList.push(resultCoupons[i]._id.toString())

                  resultUser.saveAsync().catch( (err)->
                    logger.error("Create Coupon failed:", JSON.stringify(err))
                  )
      next()