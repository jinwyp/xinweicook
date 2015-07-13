# 用户
crypto = require 'crypto';
qs = require 'querystring'
qiniu = require "qiniu"
qiniuTools = require "../libs/qiniu.js"
fs = require 'fs'

qiniu.conf.ACCESS_KEY = conf.qiniu.access_key;
qiniu.conf.SECRET_KEY = conf.qiniu.access_key;


exports.getUploadRespone = (req, res) ->

  infoObject = req.body

  # 数据形如：
  # {"name":"download.png","hash":"FoO0sxxxx9mFVKcVo4D3wUzHpWW","imageInfo":"{\"format\":\"png\",\"width\":200,\"height\":200,\"colorModel\":\"nrgba\"}","fsize":"3908","key":"FoO0slsknA9mFVKcVo4D3wffffWW","ext":".png","bucket":"xxxxxx"}

  # 处理infoObject，加工存储到数据库等。。
  # do_something_to(infoObject)

  # 返回, 之后七牛服务器会返回给浏览器端
  res.json(infoObject)



exports.getUploadQiniuToken = (req, res, next) ->

  bucketName = "userupload"

  putPolicyOwn =
    scope : bucketName
    deadline : Math.floor(Date.now() / 1000) + 3600 * 24 * 2

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




  encoded = qiniuTools.base64encode(qiniuTools.utf16to8(JSON.stringify(putPolicyOwn)));
  console.log encoded
  hmac = crypto.createHmac('sha1', qiniu.conf.SECRET_KEY);
  hmac.update(encoded);
  encoded_signed = hmac.digest('base64');


#  uptoken =  putPolicy.token()
#  uptoken =  "244idmCB2Lsc-R3ylxEmbh97hKBfRXO6cUm1QJJp:we1r8Zy6CpAFvnrZ4cOuYLQ2BzQ=:eyJzY29wZSI6InVzZXJ1cGxvYWQiLCJkZWFkbGluZSI6MTQzNjc5ODA1NH0="
  uptoken =  qiniu.conf.ACCESS_KEY + ":" + qiniuTools.safe64(encoded_signed) + ":" + encoded;


  fs.readFile("README.md", (err, localFile)->
    console.log "-----", err;
    console.log "-----", localFile;

    extra = new qiniu.io.PutExtra()

    qiniu.io.put(uptoken, "aaaaaa", localFile, extra, (err1, result)->
      if err1
        console.log(err1)
      else
        console.log(result)
    )
  )


  res.send({uptoken : uptoken})




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
