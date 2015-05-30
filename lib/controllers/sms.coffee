# 短信
module.exports = (router) ->
  router.post("/sms", (req, res, next) ->
    # 发送短信验证码
    { type, mobile } = req.body
    models.sms.logCode(type, mobile).then((code) ->
      models.sms.sendCode(mobile, code)
    ).then((code) ->
      if conf.debug
        res.json code: code
      else
        res.sendStatus 200
    , next)
  )
