# 短信
module.exports =
  schema:
    user: type: Schema.ObjectId, ref: "user"
    type: String
    code: String
    mobile: String
    sends: Number
    trys: Number
    expiredAt: Date
  statics:
    # 发送短信
    sendSms: (form) ->
      opts =
        method: "POST"
        timeout: 5000
        url: conf.yunpian.url
        form: form
      request(opts)
      .bind({})
      .spread((resp, body) ->
        # logger.debug "sms", resp.statusCode
        # logger.debug "sms", body
        @statusCode = resp.statusCode
        @body = body
        libs.parse.json(body).should.have.property("code", 0)
      ).catch (e)->
        @err = e
        logger.error "sms", @
        throw new Err "短信发送失败", 500
    # 发送验证码
    sendCode: (mobile, code) ->
      form =
        apikey: conf.yunpian.apikey
        mobile: mobile
        text: conf.yunpian.text code
      if conf.debug
        Promise.resolve(code)
      else
        @sendSms(form).return(code)
    # 创建并记录验证码
    logCode: (type, mobile) ->
      code = chance.natural(min: 100000, max: 999999)
      expiredAt = moment().add(conf.code.expire, "m")
      logger.debug "sms", "#{type}, #{code}, \
      #{moment(expiredAt).format("YYYY-MM-DD hh:mm:ss")}"
      @findOneAsync(type: type, mobile: mobile).then((log)->
        if log
          if log.modifiedAt < moment(moment().format("YYYY-MM-DD"))
            log.sends = 0
          if log.sends >= conf.code.sends
            throw new Err "达到今日最大发送次数", 400
        else
          log = new models.sms(type: type, mobile: mobile, sends: 0)
        log.trys = 0
        log.sends++
        log.code = code
        log.expiredAt = expiredAt
        log.saveAsync()
      ).return(code)
    # 验证验证码
    verifyCode: (type, mobile, code) ->
      @findOneAsync(type: type, mobile: mobile).then((log)->
        if log
          if log.trys >= conf.code.trys
            throw new Err "达到今日最大尝试次数", 400
          log.trys++
          log.saveAsync().then(->
            if log.expiredAt < moment()
              throw new Err "过期的验证码", 400
            else if log.code?.toString() isnt code?.toString()
              throw new Err "验证码错误", 400
            else
              log.expiredAt = moment()
              log.saveAsync()
          )
        else
          throw new Err "无效的验证码", 400
      )
  methods: {}
  rest: {}
