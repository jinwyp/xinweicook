# 短信

geetest = require("geetest")("ab95acaebd61c6ef7dc6e8a5493f4899", '745d959dec1191e086febd11aa684c9d');

YunPian = require "../libs/yunpian.js"
yp = YunPian({})


exports.getGeeTestRegisterChallenge = (req, res, next) ->
  # https://github.com/GeeTeam/gt-node-sdk
  geetest.register( (err, challenge) ->
    if err
      next(err)

    if challenge
      res.json({challenge: challenge})
    else
      res.json({challenge: 'geetest_server_error'})
  )


exports.sendSMS = (req, res, next) ->
  # 发送短信验证码
  { type, mobile, isVoice} = req.body

#  if type is "signUp"
#    logger.error("---- Send SMS: Registration", JSON.stringify(req.body))
#
#  if type is "resetPassword"
#    logger.error("---- Send SMS: Reset Password", JSON.stringify(req.body))
#
#  if type is "verifyMobile"
#    logger.error("---- Send SMS: Verify Mobile", JSON.stringify(req.body))
#
#  if type is "orderShipped"
#    logger.error("---- Send SMS: Order delivery notification 已发货通知", JSON.stringify(req.body))


  models.user.validationMobile(mobile)
  models.sms.validationSMSType(type)


  tempCode = ""
  models.sms.logCode(type, mobile).then (code) ->
    tempCode = code

    if type is "signUp"
      text = models.sms.constantTemplateVerifyCodeSignUp(code)
    else
      text = models.sms.constantTemplateVerifyCode(code)

    if isVoice is "true"
      yp.sendVoiceAsync(mobile, code)
    else
      yp.sendSMSAsync(mobile, text)

  .then (result) ->
    if result and result.code isnt 0
      throw new Err "Send SMS failed, type:" + type + ", "+ result.msg, 400, Err.code.sms.sendFailed

    if conf.debug
      res.json code: tempCode
    else
      res.json code: 1

  .catch( next)






exports.sendSMSFromCSToUser = (req, res, next) ->
  # 客服给用户发送通知短信
  { orderId, type} = req.body

  models.order.validationOrderId(orderId)
  models.sms.validationSMSType(type)


  models.order.findOneAsync({"_id": orderId}).then (resultOrder) ->

    models.order.checkNotFound(resultOrder)

    if resultOrder

      if type is "orderShipped2"
        text = models.sms.constantTemplateOrderShipped2(resultOrder.orderNumber, resultOrder.express.displayName.zh, resultOrder.express.number)

      if type is "moneyRefund"
        text = models.sms.constantTemplateMoneyRefund()

      if type is "newCoupon1"
        text = models.sms.constantTemplateNewCoupon1()

      yp.sendSMSAsync(resultOrder.address.mobile, text).then (result) ->
        if result and result.code isnt 0
          throw new Err "Send SMS CSToUser failed:" + type + ", "+ result.msg, 400, Err.code.sms.sendFailed

        res.json {status:"ok", message:result}
      .catch( next)

  .catch(next)
