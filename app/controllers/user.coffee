# 用户




exports.userInfo = (req, res, next) ->
  # 取用户信息
#  obj = req.u.toJSON()
  res.json req.u





exports.userSignUp = (req, res, next) ->
  # 注册
  { mobile, pwd, code } = req.body
  models.user.signUp mobile, pwd, code
  .then ->
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
  models.user.resetPwd(mobile, pwd, code).then ->
    res.sendStatus 200
  , next



exports.updateShoppingCart = (req, res, next) ->
  # 加入购物车

  models.user.validationShoppingCart req

  req.u.shoppingCart = req.body.shoppingCart
  req.u.saveAsync()
  .spread (resultUser, numberAffected) ->
    resultUser.populate({path: 'shoppingCart.dish'})
    .populateAsync({path: 'shoppingCart.subDish.dish'})
  .then (user) ->
    res.json user
  .catch next
