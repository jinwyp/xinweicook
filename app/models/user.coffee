# 用户
autoIncrement = require "mongoose-auto-increment"


module.exports =
  schema:
    group: type:String, default:"member"
    pwd: # 密码
      type: String
      set: (pwd) ->
        @encryptPwd(pwd)
    mobile: type: String, unique: true,trim:true
    email: type: String, sparse: true, unique: true, trim:true, lowercase:true
    username: type:String, trim:true
    gender: Number # 1 male 2 female

    fullName : String

    avatarPic: String

    address: [
      geoLatitude: Number # 纬度
      geoLongitude: Number # 纬度

      country : String
      province: String
      city: String
      district: String
      street : String
      address: String

      isTemporary : type: Boolean, default: false  #临时地址 下单后变为false
      isValid: type: Boolean, default: false # 客服验证过true, 上述信息改变false
      isDefault: type: Boolean, default: false

      contactPerson: String
      mobile: String
      alias: String
      remark: String

      sortOrder : type: Number, default: 0
    ]

    credit: type: Number, default: 0
    isSpam: type: Boolean, default: false
    isPromoOn: type: Boolean, default: true
    lang: String

    shoppingCart: [
      dish: type: Schema.ObjectId, ref: "dish"
      number: Number
      subDish : [
        dish : type: Schema.ObjectId, ref: "dish"
        number: Number
      ]
    ]

    couponList :[type: Schema.ObjectId, ref: "coupon"]
    dishLikeList :[type: Schema.ObjectId, ref: "dish"]


    oldUserData :
      mobile:String

    weixinId :
      access_token : String
      openid : String
      refresh_token : String


  statics:
    fields : ->
      selectFields = "-pwd"
    fieldsLess : ->
      selectFields = "-pwd -mobile -address -credit -shoppingCart -couponList -dishLikeList"

    constantUserRole : () ->
      type =
        admin : "admin"
        member : "member"
        partner : "partner"
        guest : "guest"

    validationMobile : (mobileNumber) ->
        unless libs.validator.isMobilePhone(mobileNumber, 'zh-CN')
          return throw new Err "Field validation error,  mobileNumber must be zh_CN mobile number", 400
    validationPassword : (password) ->
      unless libs.validator.isLength password, 6, 20
        return throw new Err "Field validation error,  password mus be 6-20", 400

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
          unless libs.validator.isLength address.province, 2, 99
            return throw new Err "Field validation error,  province must be 2-99", 400
          unless libs.validator.isLength address.city, 2, 99
            return throw new Err "Field validation error,  city must be 2-99", 400
          unless libs.validator.isLength address.district, 2, 99
            return throw new Err "Field validation error,  district must be 2-99", 400

    validationShoppingCart : (updateUser) ->
      unless Array.isArray updateUser.shoppingCart
        throw new Err "Field validation error,  shoppingCart must be ArrayObject", 400
      else
        for dish,dishIndex in updateUser.shoppingCart
          unless libs.validator.isInt dish.number, {min: 1, max: 100}
            return throw new Err "Field validation error,  dish.number must be 1-100", 400
          unless libs.validator.isLength dish.dish, 24, 24
            return throw new Err "Field validation error,  dishID must be 24-24", 400

    checkNotFound: (u) ->
      u or throw new Err "找不到该用户", 404
    checkFound: (user) ->
      if user
        return throw new Err "User Mobile already exist !", 400
    checkNotSpam: (u) ->
      if u.isSpam
        throw new Err "该用户被举报", 403
      else
        u
    checkPwdCorrect: (pwd) ->
      (u) ->
        if bcrypt.compareSync pwd.toString(), u.pwd
          u
        else
          throw new Err "密码错误", 401

    signUp: (mobile, pwd, code) ->
      models.sms.verifyCode("signUp", mobile, code).then((smscode) ->
        if smscode[1] isnt 1
          throw new Err "验证码保存失败", 400
        models.user.findOneAsync(mobile: mobile).then (resultUser) ->
          models.user.checkFound(resultUser)
          models.user.createAsync(mobile: mobile, pwd: pwd)
      )
    resetPwd: (mobile, pwd, code) ->
      models.sms.verifyCode("resetPassword", mobile, code).bind(@).then((smscode)->
        if smscode[1] isnt 1
          throw new Err "验证码保存失败", 400

        models.user.findOneAsync(mobile: mobile).then(@checkNotFound).then(@checkNotSpam).then((u)->
          u.pwd = pwd
          u.saveAsync()
        )
      )
    findUserByMobilePwd: (mobile, pwd) ->
      @findOneAsync(mobile: mobile).then(@checkNotFound).then(@checkNotSpam).then(@checkPwdCorrect(pwd))
    findUserById: (userId) ->
      unless Number.isInteger userId
        Promise.reject(new Err "Access Token 错误", 401)
      else
        @findOneAsync(id: userId).then(@checkNotFound).then(@checkNotSpam)
    findUserBy_Id: (_id) ->
      unless libs.validator.isMongoId _id
        Promise.reject(new Err "用户 _id 错误", 400)
      else
        @findOneAsync(_id: _id).then(@checkNotFound).then(@checkNotSpam)
    findUserByAccessToken: (access_token) ->
      models.token.findTokenAndUserByAccessToken(access_token).then((t)->
        if t.user
          t.user
        else
          throw new Err "找不到该用户", 401
      ).then(@checkNotFound).then(@checkNotSpam)
    find1 : (options) ->
      @findOne(options)
      .select(models.user.fields())
      .populate({path: 'dishLikeList', select: models.dish.fields()})
      .populate({path: 'couponList'})
      .populate({path: 'shoppingCart.dish', select: models.dish.fields()})
      .populate({path: 'shoppingCart.subDish.dish', select: models.dish.fields()})
      .execAsync()
  methods:
    encryptPwd: (pwd) ->
      bcrypt.hashSync pwd.toString(), 4
  rest: {}
  plugin: (schema) ->
    schema.plugin autoIncrement.plugin, model: "user", field: "autoIncrementId", startAt: 10000
