# 用户




exports.userInfo = (req, res, next) ->
  # 取用户信息
  obj = req.u.toJSON()
  delete obj.pwd
  res.json obj






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



exports.addDishToCart = (req, res, next) ->
  # 加入购物车
  console.log "AAAA: ", req.body.shoppingCart

  unless Array.isArray req.body.shoppingCart
    throw new Err "Field validation error,  shoppingCart must be ArrayObject", 400
  else
    console.log "AAAA: ", req.body.shoppingCart
    req.u.shoppingCart = req.body.shoppingCart
    req.u.saveAsync()
    .spread (resultUser, numberAffected) ->
      console.log "BBBB: ", resultUser, numberAffected
      res.json resultUser
    .catch next

#a = [
#  {
#    dish : "558a602a3eba152266ff2b8c"
#    number : 1
#  }
#]