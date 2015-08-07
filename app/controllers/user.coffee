# 用户
qiniu = require "qiniu"

qiniu.conf.ACCESS_KEY = conf.qiniu.access_key;
qiniu.conf.SECRET_KEY = conf.qiniu.secret_key;


exports.getUploadResponse = (req, res) ->

  infoObject = req.body

  # 数据形如：
  # {"name":"download.png","hash":"FoO0sxxxx9mFVKcVo4D3wUzHpWW","imageInfo":"{\"format\":\"png\",\"width\":200,\"height\":200,\"colorModel\":\"nrgba\"}","fsize":"3908","key":"FoO0slsknA9mFVKcVo4D3wffffWW","ext":".png","bucket":"xxxxxx"}

  # 处理infoObject，加工存储到数据库等。。
  # do_something_to(infoObject)

  # 返回, 之后七牛服务器会返回给浏览器端
  res.json(infoObject)



exports.getUploadQiniuToken = (req, res, next) ->

  bucketName = "userupload"

  putPolicy = new qiniu.rs.PutPolicy( bucketName );

  callbackBodyObj =
    name: '$(fname)'
    hash: '$(etag)'
    imageInfoW: '$(imageInfo.width)'
    imageInfoH: '$(imageInfo.height)'
    size: '$(fsize)'
    bucket: '$(bucket)'

#  callbackUrl = 'www.baidu.com/qiniu-callback'
#  callbackBodyStr = qs.stringify(callbackBodyObj).replace(/\%24/g, '$')

#  putPolicy.callbackUrl = callbackUrl
#  putPolicy.callbackBody = callbackBodyStr
  putPolicy.expires = 3600 * 24 * 2;

  res.send({uptoken : putPolicy.token()})






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




















# 统一接口 user 信息只在最后返回时 做populate
exports.userInfo = (req, res, next) ->

  models.user.find1({_id : req.u._id}).then (resultUser)->
    res.json resultUser
  .catch next


# 获取用户消息通知 iOS
exports.getUserMessages = (req, res, next) ->

  models.message.find({user:req.u._id})
  .execAsync()
  .then (resultMessages) ->
    res.json resultMessages
  .catch next



# 修改用户信息 收货地址
exports.updateUserInfo = (req, res, next) ->

  models.user.validationUserInfo req.body

  req.u.address = req.body.address
  req.u.gender = req.body.gender if req.body.gender
  req.u.avatarPic = req.body.avatarPic if req.body.avatarPic

  req.u.saveAsync().spread (resultUser, numberAffected) ->
    models.user.checkNotFound(resultUser)
    models.user.find1({_id : resultUser._id})
  .then (user) ->
    res.json user
  .catch next




# 修改或加入 购物车商品
exports.updateShoppingCart = (req, res, next) ->

  models.user.validationShoppingCart req.body

  req.u.shoppingCart = req.body.shoppingCart
  req.u.saveAsync().spread (resultUser, numberAffected) ->
    models.user.find1({_id : resultUser._id})
  .then (user) ->
    res.json user
  .catch next

