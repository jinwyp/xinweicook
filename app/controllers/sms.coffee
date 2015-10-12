# 短信

geetest = require("geetest")("ab95acaebd61c6ef7dc6e8a5493f4899", '745d959dec1191e086febd11aa684c9d');


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
  { type, mobile} = req.body

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
  models.sms.logCode(type, mobile)
  .then (code) ->
    tempCode = code

    if type is "signUp"
      text = models.sms.constantTemplateVerifyCodeSignUp(code)
    else
      text = models.sms.constantTemplateVerifyCode(code)

    models.sms.sendSmsVia3rd(mobile, text)
  .then (result) ->

    if conf.debug
      res.json code: tempCode
    else
      res.json code: ''

  .catch(next)











