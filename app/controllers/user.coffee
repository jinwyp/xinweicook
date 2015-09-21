# 用户
qiniu = require "qiniu"

qiniu.conf.ACCESS_KEY = conf.qiniu.access_key;
qiniu.conf.SECRET_KEY = conf.qiniu.secret_key;


WXPay = require "../libs/weixinpay"

AliPay = require "../libs/alipay.js"

configAlipay =
  notify_url : "http://m.xinweicook.com/api/orders/payment/alipay/notify/account"
  mobile_return_url : "http://m.xinweicook.com/mobile/alipay/returnaccountdetail"

alipay = AliPay(configAlipay)


configWeiXinPay =
  appid: conf.weixinpay.appid
  mch_id: conf.weixinpay.mch_id
  secret: conf.weixinpay.secret
  key: conf.weixinpay.key
  notify_url : conf.url.base + conf.weixinpay.notify_url


configWeiXinAppPay =
  appid: conf.weixinAppPay.appid
  mch_id: conf.weixinAppPay.mch_id
  secret: conf.weixinAppPay.secret
  key: conf.weixinAppPay.key
  notify_url : conf.url.base + conf.weixinAppPay.notify_url

weixinpay = WXPay(configWeiXinPay)


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
  { mobile, pwd, code, couponcode } = req.body

  logger.error("----注册请求couponcode", JSON.stringify(req.body))

  models.user.validationMobile(mobile)
  models.user.validationPassword(pwd)

  models.user.signUp(mobile, pwd, code)
  .then (resultUser)->

    models.coupon.addCouponForNewUser(resultUser, req).then (resultUser2) ->
      if couponcode
        models.coupon.addCouponFromCouponChargeCode(resultUser2[0], couponcode)


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
  .sort("-createdAt")
  .execAsync()
  .then (resultMessages) ->
    res.json resultMessages
  .catch next



# 修改用户信息 修改收货地址
exports.updateUserInfo = (req, res, next) ->

  models.user.validationUserInfo req.body

  if req.u.address and req.body.address.length > 0

    for address,addressIndex in req.body.address

      if req.u.address.length-1 >= addressIndex

        req.u.address[addressIndex].geoLatitude = address.geoLatitude if address.geoLatitude
        req.u.address[addressIndex].geoLongitude = address.geoLongitude if address.geoLongitude

        req.u.address[addressIndex].country = address.country if address.country
        req.u.address[addressIndex].province = address.province if address.province
        req.u.address[addressIndex].city = address.city if address.city
        req.u.address[addressIndex].district = address.district if address.district
        req.u.address[addressIndex].street = address.street if address.street
        req.u.address[addressIndex].address = address.address if address.address

        req.u.address[addressIndex].isDefault = address.isDefault if address.isDefault

        req.u.address[addressIndex].contactPerson = address.contactPerson if address.contactPerson
        req.u.address[addressIndex].mobile = address.mobile if address.mobile
        req.u.address[addressIndex].alias = address.alias if address.alias
        req.u.address[addressIndex].remark = address.alias if address.remark

      else
        req.u.address.push(address)

      req.u.address[addressIndex].sortOrder = addressIndex

    if req.u.address.length > req.body.address.length
      req.u.address.splice(req.body.address.length, req.u.address.length - req.body.address.length);

  else
    req.u.address = req.body.address

  req.u.gender = req.body.gender if req.body.gender
  req.u.lang = req.body.language if req.body.language
  req.u.avatarPic = req.body.avatarPic if req.body.avatarPic

  req.u.saveAsync().then (resultUser) ->
    models.user.find1({_id : resultUser[0]._id})
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

  models.accountdetail.find({ $or: [
    { user : req.u._id.toString(), isPaid:true, isPlus:true, chargeType: models.accountdetail.constantChargeType().alipaydirect },
    { user : req.u._id.toString(), isPaid:true, isPlus:true, chargeType: models.accountdetail.constantChargeType().weixinpay },
    { user : req.u._id.toString(), isPlus:true, chargeType: models.accountdetail.constantChargeType().chargecode },
    { user : req.u._id.toString(), isPaid:false, isPlus:false }
  ] })
  .sort("-createdAt")
  .skip(req.query.skip)
  .limit(req.query.skip)
  .execAsync()
  .then (resultAccountDetail)->

    res.json resultAccountDetail

  .catch next


# 用户账户余额充值 先生成充值记录明细
exports.chargeAccount = (req, res, next) ->

  models.useraccount.validationChargeAccount(req.body)

  chargeType = models.accountdetail.constantChargeType().alipaydirect

  if req.body.payment and req.body.payment is models.order.constantPayment().weixinpay
    models.order.validationWeixinPayUnifiedOrder req.body
    chargeType = models.accountdetail.constantChargeType().weixinpay

  models.useraccount.findOneAsync({user : req.u._id.toString()}).then (resultAccount)->
    models.useraccount.checkNotFound(resultAccount)

    resultAccount.chargeAccountDetail(req.body.addAmount, {zh : "在线充值", en : "Online Recharge"}, req.body.remark, chargeType)

  .then (resultAccountDetail)->

    if req.body.payment and req.body.payment is models.order.constantPayment().weixinpay
      # 微信支付生成统一订单

      if req.body.trade_type is "APP"
        weixinpay = WXPay(configWeiXinAppPay)

      weixinpayOrder =
        out_trade_no: resultAccountDetail._id.toString()
        total_fee: Math.ceil(resultAccountDetail.amount * 100)
        spbill_create_ip: req.ip  # 终端IP APP和网页支付提交用户端ip，Native支付填调用微信支付API的机器IP。

        notify_url: "http://m.xinweicook.com/mobile/wxpay/notifyaccountdetail"
        trade_type: req.body.trade_type #JSAPI，NATIVE，APP，WAP
#            openid: req.body.openid  #trade_type=JSAPI，此参数必传，用户在商户appid下的唯一标识。下单前需要调用【网页授权获取用户信息】接口获取到用户的Openid
        product_id : resultAccountDetail._id.toString() #trade_type=NATIVE，此参数必传。此id为二维码中包含的商品ID，商户自行定义。

        body:  resultAccountDetail.name.zh
        detail:  resultAccountDetail.name.zh

        attach: resultAccountDetail._id.toString() #附加数据，在查询API和支付通知中原样返回，该字段主要用于商户携带订单的自定义数据
        goods_tag : "", #商品标记，代金券或立减优惠功能的参数，说明详见代金券或立减优惠


      if req.body.trade_type is "JSAPI"
        if req.u.weixinId and req.u.weixinId.openid
          weixinpayOrder.openid = req.u.weixinId.openid
        else
          throw new Err "Field validation error,  need weixin pay user open id for charge account", 400

      if req.u.mobile is "15900719671" or req.u.mobile is "18629641521" or req.u.mobile is "13564568304" or req.u.mobile is "18621870070"  # 内测帐号1分钱下单
        weixinpayOrder.total_fee = 1


      console.log "------------------Weixinpay Unified Order For AccountDetail: ", weixinpayOrder
      weixinpay.createUnifiedOrder weixinpayOrder, (err, resultWeixinPay) ->
        if err
          next (new Err err)

        if resultWeixinPay

          weixinpayMobileSign =
            appId: configWeiXinPay.appid
            timeStamp: parseInt(+new Date() / 1000, 10) + ""
            nonceStr: weixinpay.util.generateNonceString()
            package: "prepay_id="+resultWeixinPay.prepay_id
            signType: "MD5"

          # https://pay.weixin.qq.com/wiki/doc/api/app.php?chapter=8_5
          weixinpayNativeSign =
            appId : configWeiXinAppPay.appid
            partnerId : configWeiXinAppPay.mch_id
            prepayId : resultWeixinPay.prepay_id
            packageValue : 'Sign=WXPay'
            timeStamp: parseInt(+new Date() / 1000, 10) + ""
            nonceStr: weixinpay.util.generateNonceString()

          weixinpayNativeSign.sign = weixinpay.sign(weixinpayNativeSign);
          weixinpayMobileSign.paySign = weixinpay.sign(weixinpayMobileSign);


          newPaymentDetail =
            user : req.u._id
            accountDetail : resultAccountDetail._id
            businessType : models.paymentdetail.constantBusinessType().accountdetail

            orderNumber : resultAccountDetail._id.toString()
            totalPrice : resultAccountDetail.amount
            orderTitle : resultAccountDetail.name.zh

            wxPay_nativeSign: weixinpayNativeSign
            wxPay_mobileSign: weixinpayMobileSign

            wxPay_unified_return_return_code : resultWeixinPay.return_code
            wxPay_unified_return_return_msg : resultWeixinPay.return_msg

            wxPay_unified_return_appid : resultWeixinPay.appid
            wxPay_unified_return_mch_id : resultWeixinPay.mch_id
            wxPay_unified_return_result_code : resultWeixinPay.result_code

            wxPay_unified_return_nonce_str : resultWeixinPay.nonce_str
            wxPay_unified_return_sign : resultWeixinPay.sign
            wxPay_unified_return_trade_type : resultWeixinPay.trade_type
            wxPay_unified_return_prepay_id: resultWeixinPay.prepay_id
            wxPay_unified_return_code_url: resultWeixinPay.code_url

          models.paymentdetail.createAsync(newPaymentDetail).then (resultPaymentDetail) ->

            resultTemp = resultAccountDetail.toJSON()
            resultTemp.weixinPayUnifiedOrder = resultPaymentDetail
            resultTemp.wxPay_nativeSign = weixinpayNativeSign

            res.json resultTemp

          .catch(next)


    else
      # 生成支付宝签名

      subject =
        dish :
          title :
            zh : resultAccountDetail.name.zh
            en : resultAccountDetail.name.en

      alipayOrder =
        totalPrice : resultAccountDetail.amount
        orderNumber : resultAccountDetail._id.toString()
        _id : resultAccountDetail._id
        dishHistory : []

      alipayOrder.dishHistory.push(subject)

      if req.u.mobile is "15900719671" or req.u.mobile is "18629641521" or req.u.mobile is "13564568304" or req.u.mobile is "18621870070"  # 内测帐号1分钱下单
        alipayOrder.totalPrice = 0.01

      aliPaySign = alipay.generateWapCreateDirectPayUrl(alipayOrder)
      resultTemp = resultAccountDetail.toJSON()
      resultTemp.aliPaySign = aliPaySign

      res.json resultTemp



  .catch next





# 用户账户余额充值 支付宝通知回调
exports.chargeAccountAlipayNotify = (req, res, next) ->

  models.useraccount.validationAlipayNotify(req.body)

  if req.body.trade_status is "TRADE_SUCCESS" or req.body.trade_status is "TRADE_FINISHED"
    accountDetailData = {}

    models.accountdetail.findOneAsync({_id : req.body.out_trade_no, isPaid:false, isPlus:true}).then (resultAccountDetail)->

      models.accountdetail.checkNotFound(resultAccountDetail)
      accountDetailData = resultAccountDetail

      resultAccountDetail.isPaid = true
      resultAccountDetail.paymentAlipay =
        notify_time : req.body.notify_time
        notify_type : req.body.notify_type
        notify_id : req.body.notify_id
        sign_type: req.body.sign_type,
        sign: req.body.sign_type,

        out_trade_no : req.body.out_trade_no
        subject : req.body.subject
        payment_type : req.body.payment_type
        trade_no : req.body.trade_no
        trade_status : req.body.trade_status
        price : req.body.price
        total_fee : req.body.total_fee
        quantity : req.body.quantity
        body : req.body.body
        is_total_fee_adjust : req.body.is_total_fee_adjust
        use_coupon : req.body.use_coupon
        gmt_create : req.body.gmt_create
        gmt_payment : req.body.gmt_payment
  #      refund_status : req.body.refund_status
  #      gmt_refund : req.body.gmt_refund
        seller_email : req.body.seller_email
        buyer_email : req.body.buyer_email
        seller_id : req.body.seller_id
        buyer_id : req.body.buyer_id

      resultAccountDetail.saveAsync()
    .then (resultAccoutDetail2) ->

      models.useraccount.findOneAsync({user : resultAccoutDetail2[0].user})
    .then (resultAccount)->
      models.useraccount.checkNotFound(resultAccount)
      resultAccount.balance = resultAccount.balance + accountDetailData.amountXinwei
      resultAccount.saveAsync()

    .then (resultAccount2)->
  #    res.json resultAccount2[0]

      res.set('Content-Type', 'text/plain');
      res.send "success"
    .catch next

  else
    res.set('Content-Type', 'text/plain');
    res.send "success"





# 用户账户余额充值 微信支付通知回调
exports.chargeAccountWeixinPayNotify = (req, res, next) ->
  console.log "======================== WeixinPayNotify :: ", req.body

  models.paymentdetail.validationWeixinPayNotify req.body

  accountDetailData = {}

  models.paymentdetail.findOneAsync({orderNumber : req.body.out_trade_no})
  .then (resultPaymentDetail) ->
    models.paymentdetail.checkNotFound(resultPaymentDetail)

    resultPaymentDetail.wxPay_notify_return_return_code = req.body.return_code
    resultPaymentDetail.wxPay_notify_return_return_msg = req.body.return_msg

    resultPaymentDetail.wxPay_notify_return_appid = req.body.appid
    resultPaymentDetail.wxPay_notify_return_mch_id = req.body.mch_id
    resultPaymentDetail.wxPay_notify_return_sub_mch_id = req.body.sub_mch_id
    resultPaymentDetail.wxPay_notify_return_nonce_str = req.body.nonce_str
    resultPaymentDetail.wxPay_notify_return_sign = req.body.sign
    resultPaymentDetail.wxPay_notify_return_result_code = req.body.result_code

    resultPaymentDetail.wxPay_notify_return_openid = req.body.openid
    resultPaymentDetail.wxPay_notify_return_is_subscribe = req.body.is_subscribe

    resultPaymentDetail.wxPay_notify_return_trade_type = req.body.trade_type
    resultPaymentDetail.wxPay_notify_return_bank_type = req.body.bank_type
    resultPaymentDetail.wxPay_notify_return_total_fee = req.body.total_fee
    resultPaymentDetail.wxPay_notify_return_fee_type = req.body.fee_type
    resultPaymentDetail.wxPay_notify_return_cash_fee = req.body.cash_fee
    resultPaymentDetail.wxPay_notify_return_cash_fee_type = req.body.cash_fee_type
    resultPaymentDetail.wxPay_notify_return_coupon_fee = req.body.coupon_fee
    resultPaymentDetail.wxPay_notify_return_coupon_count = req.body.coupon_count

    resultPaymentDetail.wxPay_notify_return_out_trade_no = req.body.out_trade_no
    resultPaymentDetail.wxPay_notify_return_attach = req.body.attach
    resultPaymentDetail.wxPay_notify_return_transaction_id = req.body.transaction_id
    resultPaymentDetail.wxPay_notify_return_time_end = req.body.time_end


    resultPaymentDetail.saveAsync()
  .then (resultPaymentDetail2) ->

    models.accountdetail.findOneAsync({_id : resultPaymentDetail2[0].orderNumber, isPaid:false, isPlus:true})
  .then (resultAccountDetail)->
    models.accountdetail.checkNotFound(resultAccountDetail)

    accountDetailData = resultAccountDetail
    resultAccountDetail.isPaid = true
    resultAccountDetail.saveAsync()

  .then (resultAccoutDetail2) ->

    models.useraccount.findOneAsync({user : resultAccoutDetail2[0].user})

  .then (resultAccount)->
    models.useraccount.checkNotFound(resultAccount)
    resultAccount.balance = resultAccount.balance + accountDetailData.amountXinwei
    resultAccount.saveAsync()

    weixinpay.responseNotify res, true

  .catch next






# 用户账户 使用充值码充值
exports.chargeAccountFromAccoutChargeCode = (req, res, next) ->

  models.coupon.validationCouponCode(req.body.accountChargeCode)
  couponData = {}
  models.coupon.findOneAsync({code : req.body.accountChargeCode, couponType:models.coupon.constantCouponType().accountchargecode, isExpired : false, isUsed : false})
  .then (resultCoupon)->
    models.coupon.checkNotFound resultCoupon
    models.coupon.checkExpired resultCoupon
    models.coupon.checkUsed(resultCoupon, req.u)
    couponData = resultCoupon

    models.useraccount.findOneAsync({user : req.u._id.toString()})
  .then (resultAccount)->
      models.useraccount.checkNotFound(resultAccount)

      resultAccount.chargeAccountDetailByChargeCode(couponData.price, {zh : "使用充值码充值", en : "Code Recharge"}, req.body.remark, couponData._id.toString())
  .then (resultAccount)->
      couponData.used(req.u)
      res.json resultAccount[0]

  .catch next