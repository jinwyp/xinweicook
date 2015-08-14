# 用户账户余额


module.exports =
  schema:
    user : type: Schema.ObjectId, ref: "user"
    balance : type: Number, default: 0

  statics:

    validationChargeAccount : (account) ->
      unless libs.validator.isInt account.addAmount, {min: 1, max: 900000}
        return throw new Err "Field validation error,  addAmount must be 1-900000", 400

    validationReduceAccount : (account) ->
      unless libs.validator.isInt account.reduceAmount, {min: 1, max: 900000}
        return throw new Err "Field validation error,  addAmount must be 1-900000", 400

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

  methods:
    addMoney : (amount, name, remark) ->
      @balance = @balance + Number(amount)

      newAccountDetail =
        user : @user
        isPlus : true
        amount : Number(amount)
        name : "充值"

      newAccountDetail.remark = remark if remark
      newAccountDetail.name = name if name

      models.accountdetail.createAsync(newAccountDetail)
      @saveAsync()

    reduceMoney : (amount, name, remark, orderId) ->
      @balance = @balance - Number(amount)

      newAccountDetail =
        user : @user
        isPlus : false
        amount : -Number(amount)
        name : "消费"

      newAccountDetail.name = name if name
      newAccountDetail.remark = remark if remark
      newAccountDetail.order = orderId if orderId

      models.accountdetail.createAsync(newAccountDetail)
      @saveAsync()

  rest:{}