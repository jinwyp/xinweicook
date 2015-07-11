# 用户

qiniu = require "qiniu"


qiniu.conf.ACCESS_KEY = conf.qiniu.access_key;
qiniu.conf.SECRET_KEY = conf.qiniu.access_key;


exports.getUploadQiniuToken = (req, res, next) ->
  putPolicy = new qiniu.rs.PutPolicy( "userupload" );
  res.send {uploadToken : putPolicy.token()};




exports.userSignUp = (req, res, next) ->
  # 注册
  { mobile, pwd, code } = req.body
  models.user.validationMobile(mobile)
  models.user.validationPassword(pwd)

  models.user.signUp(mobile, pwd, code)
  .then (resultUser)->
    models.token.findTokenByMobilePwd(mobile, pwd)
  .then (t) ->
    libs.cache.setHeader res
    res.json
      access_token: t.access_token
      refresh_token: t.refresh_token
      token_type: "Bearer"
      expires_in: t.getExpiresIn()
  , next



exports.resetPassword = (req, res, next) ->
  # 重置密码
  { mobile, pwd, code } = req.body

  models.user.validationMobile(mobile)
  models.user.validationPassword(pwd)

  models.user.resetPwd(mobile, pwd, code).then ->
    res.sendStatus 200
  .catch next





exports.userInfo = (req, res, next) ->
  # 取用户信息
  #  obj = req.u.toJSON()
  res.json req.u



exports.getUserMessages = (req, res, next) ->

  models.message.find({user:req.u._id})
  .execAsync()
  .then (resultMessages) ->
    res.json resultMessages
  .catch next







exports.updateUserInfo = (req, res, next) ->
  # 修改用户信息 收货地址

  models.user.validationUserInfo req.body

  req.u.address = req.body.address
  req.u.gender = req.body.gender if req.body.gender
  req.u.avatarPic = req.body.avatarPic if req.body.avatarPic

  req.u.saveAsync()
  .spread (resultUser, numberAffected) ->
    res.json resultUser
  .catch next




exports.updateShoppingCart = (req, res, next) ->
  # 加入购物车

  models.user.validationShoppingCart req.body

  req.u.shoppingCart = req.body.shoppingCart
  req.u.saveAsync()
  .spread (resultUser, numberAffected) ->
    resultUser.populate({path: 'shoppingCart.dish', select: models.dish.fields()})
    .populateAsync({path: 'shoppingCart.subDish.dish', select: models.dish.fields()})
  .then (user) ->
    res.json user
  .catch next
