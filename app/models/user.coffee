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
    gender: zh:String, en:String

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

  statics:
    fields : ->
      selectFields = "-pwd"
    validationUserInfo : (updateUser) ->
      if updateUser.gender
        if updateUser.gender.zh
          unless libs.validator.isLength updateUser.gender.zh, 2, 20
            return throw new Err "Field validation error,  gender must be 2-20", 400
        if updateUser.gender.en
          unless libs.validator.isLength updateUser.gender.en, 4, 20
            return throw new Err "Field validation error,  gender must be 4-20", 400

      unless Array.isArray updateUser.address
        throw new Err "Field validation error,  address must be ArrayObject", 400
      else
        for address,addressIndex in updateUser.address
          unless libs.validator.isInt address.geoLatitude, {min: 1, max: 9999}
            return throw new Err "Field validation error,  geoLatitude must be 1-9999", 400
          unless libs.validator.isInt address.geoLongitude, {min: 1, max: 9999}
            return throw new Err "Field validation error,  geoLongitude must be 1-9999", 400
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

    UserFound: (u) ->
      u or throw new Err "找不到该用户", 404
    UserNotSpam: (u) ->
      if u.isSpam
        throw new Err "该用户被举报", 403
      else
        u
    PwdCorrect: (pwd) ->
      (u) ->
        if bcrypt.compareSync pwd.toString(), u.pwd
          u
        else
          throw new Err "密码错误", 401
    signUp: (mobile, pwd, code) ->
      models.sms.verifyCode("signUp", mobile, code).then(->
        # todo: 检查合法性等
        models.user.createAsync(mobile: mobile, pwd: pwd)
      )
    resetPwd: (mobile, pwd, code) ->
      models.sms.verifyCode("resetPassword", mobile, code).then(->
        models.user.findOneAsync(mobile: mobile).then(@UserFound).then(@UserNotSpam).then((u)->
          u.pwd = pwd
          u.saveAsync()
        )
      )
    findUserByMobilePwd: (mobile, pwd) ->
      @findOneAsync(mobile: mobile).then(@UserFound).then(@UserNotSpam).then(@PwdCorrect(pwd))
    findUserById: (userId) ->
      unless Number.isInteger userId
        Promise.reject(new Err "Access Token 错误", 401)
      else
        @findOneAsync(id: userId).then(@UserFound).then(@UserNotSpam)
    findUserBy_Id: (_id) ->
      unless libs.validator.isMongoId _id
        Promise.reject(new Err "用户 _id 错误", 400)
      else
        @findOneAsync(_id: _id).then(@UserFound).then(@UserNotSpam)
    findUserByAccessToken: (access_token) ->
      models.token.findTokenAndUserByAccessToken(access_token).then((t)->
        if t.user
          t.user
          .populate({path: 'dishLikeList'})
          .populate({path: 'couponList'})
          .populate({path: 'shoppingCart.dish'})
          .populateAsync({path: 'shoppingCart.subDish.dish'})
        else
          throw new Err "找不到该用户", 404
      ).then(@UserFound).then(@UserNotSpam)
  methods:
    encryptPwd: (pwd) ->
      bcrypt.hashSync pwd.toString(), 4
  rest: {}
  plugin: (schema) ->
    schema.plugin autoIncrement.plugin, model: "user", field: "id"
