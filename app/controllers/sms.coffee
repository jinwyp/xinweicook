# 短信



exports.sendSMS = (req, res, next) ->
  # 发送短信验证码
  { type, mobile } = req.body
  tempCode = ""

  models.user.validationMobile(mobile)
  models.sms.validationSMSType(type)
  if type is "signUp"
    logger.error("----发短信请求 注册", JSON.stringify(req.body))

  if type is "resetPassword"
    logger.error("----发短信请求 重置密码", JSON.stringify(req.body))

  if type is "verifyMobile"
    logger.error("----发短信请求 验证手机号", JSON.stringify(req.body))

  if type is "orderShipped"
    logger.error("----发短信请求 订单已发货通知", JSON.stringify(req.body))

  models.sms.logCode(type, mobile)

  .then (code) ->
    tempCode = code
    text = models.sms.constantTemplateVerifyCode(code)
    models.sms.sendSmsVia3rd(mobile, text)
  .then (result) ->

    if conf.debug
      res.json code: tempCode
    else
      res.json code: ''

  .catch next




