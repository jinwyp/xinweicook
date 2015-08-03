# 短信



exports.sendSMS = (req, res, next) ->
  # 发送短信验证码
  { type, mobile } = req.body
  tempCode = ""

  models.user.validationMobile(mobile)
  models.sms.validationSMSType(type)

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




