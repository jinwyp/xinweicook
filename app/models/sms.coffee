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

    SMSType : () ->
      type = ["signUp", "resetPassword", "verifyMobile"]

    validationSMSType : (type) ->
      unless libs.validator.isIn(type, @SMSType())
        return throw new Err "Field validation error, 短信类型不对 SMS type must be signUp or resetPassword or verifyMobile", 400

    # 发送短信
    sendSmsVia3rd: (form) ->
      opts =
        method: "POST"
        timeout: 5000
        url: conf.yunpian.url
        form: form
      request(opts)
      .bind({})
      .spread((resp, body) ->
#        logger.debug "-----sendSMSYunpian", resp.statusCode
#        logger.debug "sms", body
#        @statusCode = resp.statusCode
        result = JSON.parse(body)
        if result.code isnt 0
          throw(result)

#        libs.parse.json(body).should.have.property("code", 0)
      ).catch (err)->
        logger.error "SendSMS", err
        throw new Err "短信发送失败 " + err.msg + " " + err.detail, 500

    # 发送验证码
    sendCode: (mobile, code) ->
      form =
        apikey: conf.yunpian.apikey
        mobile: mobile
        text: conf.yunpian.template1 code

      if conf.debug
        Promise.resolve(code)
#        @sendSmsVia3rd(form).return(code)
      else
        @sendSmsVia3rd(form).return(code)

    # 创建并记录验证码
    logCode: (type, mobile) ->
      @validationSMSType type

      code = chance.natural(min: 100000, max: 999999)
      expiredAt = moment().add(conf.code.expire, "m")

      logger.debug "----------Send SMS :", "#{type}, #{code}, \
      #{moment(expiredAt).format("YYYY-MM-DD hh:mm:ss")}"

      @findOneAsync(type: type, mobile: mobile).then((resultLog)->
        if resultLog
          if resultLog.modifiedAt < moment(moment().format("YYYY-MM-DD"))
            resultLog.sends = 0  #如果修改时间小于今天 则把今天要发送短信的清零

          if resultLog.sends >= conf.code.sends
            throw new Err "达到今日最大发送次数" + conf.code.sends, 400
        else
          resultLog = new models.sms(type: type, mobile: mobile, sends: 0)

        resultLog.trys = 0
        resultLog.sends++
        resultLog.code = code
        resultLog.expiredAt = expiredAt
        resultLog.saveAsync()
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
