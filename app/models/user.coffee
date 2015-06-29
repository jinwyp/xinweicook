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
    mail: type: String, sparse: true, unique: true, trim:true, lowercase:true
    name: type:String, trim:true

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
  statics:
    fields : ->
      selectFields = "-pwd"
    validationUserInfo : (req) ->
      unless Array.isArray req.body.address
        throw new Err "Field validation error,  address must be ArrayObject", 400
      else
        for address,addressIndex in req.body.address
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

    validationShoppingCart : (req) ->
      unless Array.isArray req.body.shoppingCart
        throw new Err "Field validation error,  shoppingCart must be ArrayObject", 400
      else
        for dish,dishIndex in req.body.shoppingCart
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
