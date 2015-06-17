# 邮件
module.exports =
  schema:
    user: type: Schema.ObjectId, ref: "user"
    type: String
    code: String
    mail: String
    sends: Number
    trys: Number
    expiredAt: Date
  statics:
    # 发送邮件
    sendMail: (body) ->
      { from, to, subject, text, html, lang } = body
      opts =
        method: "POST"
        timeout: 5000
        url: "#{conf.mailgun.url}/messages"
        auth:
          user: "api"
          pass: conf.mailgun.key
        form:
          from: from or conf.mailgun.from[lang]
          to: to
          subject: subject
      opts.form.text = text if text
      opts.form.html = html if html

      request(opts)
      .bind({})
      .spread((resp, body) ->
        logger.debug "mail", resp.statusCode
        logger.debug "mail", body
        logger.debug "mail", libs.parse.json(body)
        @statusCode = resp.statusCode
        @body = body
        libs.parse.json(body).should.have.property("message", "Queued. Thank you.")
      ).catch (e)->
        @err = e
        logger.error "mail", @
        throw new Err "邮件发送失败", 500
    # 发送验证码
    sendCode: (mail, code, lang) ->
      body =
        to: mail
        subject: conf.mailgun.code.subject[lang]
        text: conf.mailgun.code.text[lang] + code
        lang: lang
      if conf.debug
        Promise.resolve(code)
      else
        @sendMail(body).return(code)
    # 创建并记录验证码
    logCode: (type, mail) ->
      code = chance.natural(min: 100000, max: 999999)
      expiredAt = moment().add(conf.code.expire, "m")
      logger.debug "mail", "#{type}, #{code}, \
      #{moment(expiredAt).format("YYYY-MM-DD hh:mm:ss")}"
      @findOneAsync(type: type, mail: mail).then((log)->
        if log
          if log.modifiedAt < moment(moment().format("YYYY-MM-DD"))
            log.sends = 0
          if log.sends >= conf.code.sends
            throw new Err "达到今日最大发送次数", 400
        else
          log = new models.mail(type: type, mail: mail, sends: 0)
        log.trys = 0
        log.sends++
        log.code = code
        log.expiredAt = expiredAt
        log.saveAsync()
      ).return(code)
    # 验证验证码
    verifyCode: (type, mail, code) ->
      @findOneAsync(type: type, mail: mail).then((log)->
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
