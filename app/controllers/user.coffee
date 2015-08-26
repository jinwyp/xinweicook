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

    # 新用户新增优惠券
    newCoupon =
      name :
        zh : "新注册用户优惠券"
        en : "NewUserCoupon"
      price : 5
      couponType : "coupon"
      usedTime : 1
      user : resultUser._id.toString()

    Promise.all([models.coupon.addNew(newCoupon), models.coupon.addNew(newCoupon)]).then (resultCouponList)->
      for coupon, couponIndex in resultCouponList
        resultUser.couponList.push(coupon._id.toString())

      resultUser.saveAsync()


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
    res.json code: ''
  .catch next




















# 统一接口 user 信息只在最后返回时 做populate
exports.userInfo = (req, res, next) ->

  models.user.find1({_id : req.u._id}).then (resultUser)->

    # 生成用户自己往外发的邀请码
    if not resultUser.invitationSendCode
      tempcode = []
      tempcode.push(libs.crypto.gencode())
      tempcode.push(libs.crypto.gencode())
      tempcode.push(libs.crypto.gencode())
      tempcode.push(libs.crypto.gencode())
      tempcode.push(libs.crypto.gencode())

      promiseList = [
        models.user.findOneAsync({invitationSendCode : tempcode[0]}),
        models.user.findOneAsync({invitationSendCode : tempcode[1]}),
        models.user.findOneAsync({invitationSendCode : tempcode[2]}),
        models.user.findOneAsync({invitationSendCode : tempcode[3]}),
        models.user.findOneAsync({invitationSendCode : tempcode[4]})
      ]
      Promise.all(promiseList).then (resultUserList)->

        for user, userIndex in resultUserList
          if not user
            resultUser.invitationSendCode = tempcode[userIndex]

        resultUser.saveAsync()
        res.json resultUser
    else
      res.json resultUser

  .catch next




# 获取用户消息通知 iOS
exports.getUserMessages = (req, res, next) ->

  models.message.find({user:req.u._id})
  .execAsync()
  .then (resultMessages) ->
    res.json resultMessages
  .catch next



# 修改用户信息 修改收货地址
exports.updateUserInfo = (req, res, next) ->

  models.user.validationUserInfo req.body

  models.user.findOneAsync({_id : req.u._id}).then (resultUser) ->
    models.user.checkNotFound(resultUser)

    resultUser.address = req.body.address
    resultUser.gender = req.body.gender if req.body.gender
    resultUser.avatarPic = req.body.avatarPic if req.body.avatarPic

    resultUser.saveAsync()
  .then (resultUser) ->
    models.user.find1({_id : resultUser[0]._id})
  .then (user) ->
    res.json user
  .catch next




# 修改或加入 购物车商品
exports.updateShoppingCart = (req, res, next) ->

  models.user.validationShoppingCart req.body

  models.user.findOneAsync({_id : req.u._id}).then (resultUser) ->
    models.user.checkNotFound(resultUser)

    resultUser.shoppingCart = req.body.shoppingCart
    resultUser.saveAsync()
  .spread (resultUser2, numberAffected) ->
    models.user.find1({_id : resultUser2._id})
  .then (user) ->
    res.json user
  .catch next







# 用户账户余额
exports.userInfoAccount = (req, res, next) ->

  models.useraccount.findOneAsync({user : req.u._id}).then (resultAccount)->
    if resultAccount
      resultAccount
    else
      models.useraccount.createAsync({user:req.u._id.toString()})
  .then (resultAccount)->
    res.json resultAccount

  .catch next


# 用户账户余额明细
exports.userAccountDetail = (req, res, next) ->

  models.accountdetail.validationGetAccountDetailList req.query

  models.accountdetail.find({user : req.u._id.toString()})
  .sort "-createdAt"
  .skip(req.query.skip)
  .limit(req.query.skip)
  .execAsync()
  .then (resultAccountDetail)->

    res.json resultAccountDetail

  .catch next


# 用户账户余额充值
exports.chargeAccount = (req, res, next) ->

  models.useraccount.validationChargeAccount(req.body)

  models.useraccount.findOneAsync({user : req.u._id.toString()}).then (resultAccount)->
    models.useraccount.checkNotFound(resultAccount)
    resultAccount.addMoney(req.body.addAmount, {zh : "在线充值", en : "Online Recharge"}, req.body.remark)

  .then (resultAccount)->
    res.json resultAccount[0]

  .catch next