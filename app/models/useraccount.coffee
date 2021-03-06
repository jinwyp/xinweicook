# 用户账户余额


module.exports =
  schema:
    user : type: Schema.ObjectId, ref: "user"
    balance : type: Number, default: 0

  statics:

    validationChargeAccount : (account) ->
      unless libs.validator.isInt account.addAmount, {min: 5, max: 900000}
        return throw new Err "Field validation error,  addAmount must be 5-900000", 400

    validationReduceAccount : (account) ->
      unless libs.validator.isInt account.reduceAmount, {min: 1, max: 900000}
        return throw new Err "Field validation error,  addAmount must be 1-900000", 400

    validationAlipayNotify : (account) ->
      unless libs.validator.isLength account.out_trade_no, 24, 24
        return throw new Err "Field validation error,  out_trade_no must be 24-24", 400


    validationUserInfo : (updateUser) ->
      if updateUser.gender
          unless libs.validator.isInt updateUser.gender, {min: 1, max: 9}
            return throw new Err "Field validation error,  gender must be 1-9", 400

      unless Array.isArray updateUser.address
        throw new Err "Field validation error,  address must be ArrayObject", 400
      else
        for address,addressIndex in updateUser.address
          unless libs.validator.isFloat address.geoLatitude
            return throw new Err "Field validation error,  geoLatitude must be isFloat", 400
          unless libs.validator.isFloat address.geoLongitude
            return throw new Err "Field validation error,  geoLongitude must be isFloat", 400
          unless libs.validator.isLength address.province, 2, 200
            return throw new Err "Field validation error,  province must be 2-200", 400
          unless libs.validator.isLength address.city, 2, 200
            return throw new Err "Field validation error,  city must be 2-200", 400
          unless libs.validator.isLength address.district, 2, 200
            return throw new Err "Field validation error,  district must be 2-200", 400
          unless libs.validator.isLength address.address, 2, 1000
            return throw new Err "Field validation error,  detail address must be 2-1000", 400
          unless libs.validator.isLength address.contactPerson, 2, 99
            return throw new Err "Field validation error,  contactPerson must be 2-99", 400
          unless libs.validator.isMobilePhone(address.mobile, 'zh-CN')
            return throw new Err "Field validation error,  mobileNumber must be zh_CN mobile number", 400


    checkNotFound: (useraccount) ->
      unless useraccount
        return throw new Err "User account not found !", 400

    chargeAmountArithmetic : (amount) ->
      result = amount

      result = 350 if amount is 300
      result = 600 if amount is 500
      result = 1250 if amount is 1000
      result = 2600 if amount is 2000
      result = 6000 if amount is 5000
      result = 12000 if amount is 10000
      result = 25000 if amount is 20000

      result = 500 if amount is 480
      result = 1080 if amount is 980
      result = 2200 if amount is 1980
      result = 3400 if amount is 2980


      result

  methods:

    chargeAccountDetail : (amount, name, remark, chargeType, clientFrom) ->

      newAccountDetail =
        chargeType : models.accountdetail.constantChargeType().alipaydirect
        user : @user
        isPlus : true
        amount : Number(amount)
        amountXinwei : models.useraccount.chargeAmountArithmetic(Number(amount))
        clientFrom : models.order.constantClientFrom().wechat
        name :
          zh : "在线充值"
          en : "Online Recharge"

      newAccountDetail.remark = remark if remark
      newAccountDetail.name = name if name
      newAccountDetail.chargeType = chargeType if chargeType
      newAccountDetail.clientFrom = clientFrom if clientFrom

      models.accountdetail.createAsync(newAccountDetail)

    chargeAccountDetailByChargeCode : (amount, name, remark, couponid, clientFrom) ->
      @balance = @balance + Number(amount)

      newAccountDetail =
        chargeType : models.accountdetail.constantChargeType().chargecode
        user : @user
        isPlus : true
        clientFrom : models.order.constantClientFrom().wechat
        amountXinwei : Number(amount)
        name :
          zh : "使用充值码充值"
          en : "Code Recharge"

      newAccountDetail.remark = remark if remark
      newAccountDetail.name = name if name
      newAccountDetail.coupon = couponid if couponid
      newAccountDetail.clientFrom = clientFrom if clientFrom

      models.accountdetail.createAsync(newAccountDetail)
      @saveAsync()

    addMoney : (amount, name, remark, orderId) ->
      @balance = @balance + Number(amount)

      newAccountDetail =
        user : @user
        isPlus : true
        amountXinwei : Number(amount)
        name :
          zh : "订单取消返还"
          en : "Order cancel return"


      if @balance isnt @balance
        logger.error("cronjob refund account balance error:", JSON.stringify(newAccountDetail))

      if newAccountDetail.amountXinwei isnt newAccountDetail.amountXinwei
        logger.error("cronjob refund account amountXinwei error:", JSON.stringify(newAccountDetail))

      newAccountDetail.remark = remark if remark
      newAccountDetail.name = name if name
      newAccountDetail.order = orderId if orderId

      models.accountdetail.createAsync(newAccountDetail)

      @saveAsync()

    reduceMoney : (amount, name, remark, orderId) ->
      @balance = @balance - Number(amount)

      newAccountDetail =
        user : @user
        isPlus : false
        amountXinwei : -Number(amount)

        name :
          zh : "在线消费"
          en : "Online Pay"

      newAccountDetail.name = name if name
      newAccountDetail.remark = remark if remark
      newAccountDetail.order = orderId if orderId

      models.accountdetail.createAsync(newAccountDetail)
      @saveAsync()

  rest:{}
