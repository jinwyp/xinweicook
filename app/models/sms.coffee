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

    constantSMSType : () ->
      type = ["signUp", "resetPassword", "verifyMobile", "orderShipped"]

    constantTemplateVerifyCode: (code, lang) ->
      if lang is "en-US"
        "【新味食材包】Your verification code is #{code}."
      else
        "【新味食材包】您的验证码为 #{code}。"

    constantTemplateOrderShipped: (orderNo, lang) ->
      if lang is "en-US"
        "【新味食材包】Your order #{orderNo} is shipping now."
      else
        "【新味食材包】您的订单 #{orderNo} 已经开始发货，美味即将到家。"

    constantTemplateCustomerNewOrderNotify: (orderNumber, lang) ->
      if lang is "en-US"
        "【新味Cook】客服后台通知 有已支付新订单 #{orderNumber}."
      else
        "【新味Cook】客服后台通知 有已支付新订单 #{orderNumber}。"

    constantTemplateCustomerOutOfStockNotify: (dishTitle, lang) ->
      if lang is "en-US"
        "【新味Cook】客服后台通知 库存不足 #{dishTitle}"
      else
        "【新味Cook】客服后台通知 库存不足 #{dishTitle}"

    validationSMSType : (type) ->
      unless libs.validator.isIn(type, @constantSMSType())
        return throw new Err "Field validation error, 短信类型不对 SMS type must be signUp or resetPassword or verifyMobile", 400, Err.code.sms.wrongType

    # 发送短信
    sendSmsVia3rd: (mobile, text) ->
      opts =
        method: "POST"
        timeout: 5000
        url: conf.yunpian.url
        form:
          apikey: conf.yunpian.apikey
          mobile: mobile
          text: text

      request(opts)
      .bind({})
      .spread (resp, body) ->
#        logger.debug "-----sendSMSYunpian", resp.statusCode
#        @statusCode = resp.statusCode
#        libs.parse.json(body).should.have.property("code", 0)
#        console.log "------------------ Send SMS Yunpian ------------------", body
        logger.error("短信发送成功: " + mobile, body)
        result = JSON.parse(body)
        if result.code isnt 0
          throw new Err "短信发送失败 " + result.msg, 400, Err.code.sms.sendFailed
        else
          result
      .catch( (err)->
        logger.error("短信发送失败: " + mobile, JSON.stringify(err))
      )




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
            throw new Err "达到今日最大发送次数" + conf.code.sends, 400, Err.code.sms.tooManyTries
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
            throw new Err "达到今日最大尝试次数", 400, Err.code.sms.tooManyTries
          log.trys++
          log.saveAsync().then(->
            if log.expiredAt < moment()
              throw new Err "过期的验证码", 400, Err.code.sms.expired
            else if log.code?.toString() isnt code?.toString()
              throw new Err "验证码错误", 400, Err.code.sms.wrongCode
            else
              log.expiredAt = moment()
              log.saveAsync()
          )
        else
          throw new Err "无效的验证码", 400, Err.code.sms.invalidCode
      )
    # 给客服发送短信
    sendSMSToCSNewOrder: (orderNumber) ->
      if not conf.debug
        text = models.sms.constantTemplateCustomerNewOrderNotify(orderNumber)
        models.sms.sendSmsVia3rd("18140031310", text).catch( (err) -> logger.error("短信发送新订单通知失败:", JSON.stringify(err)))     # 索晶电话
        models.sms.sendSmsVia3rd("18516272908", text).catch( (err) -> logger.error("短信发送新订单通知失败:", JSON.stringify(err)))     # 何华电话
        models.sms.sendSmsVia3rd("18215563108", text).catch( (err) -> logger.error("短信发送新订单通知失败:", JSON.stringify(err)))     # 赵梦菲电话
        models.sms.sendSmsVia3rd("13761339935", text).catch( (err) -> logger.error("短信发送新订单通知失败:", JSON.stringify(err)))     # 杨唤电话

    sendSMSToCSOutOfStock: (dishTitleZh) ->
      if not conf.debug
        text = models.sms.constantTemplateCustomerOutOfStockNotify(dishTitleZh)
        models.sms.sendSmsVia3rd("18621378962", text).catch( (err) -> logger.error("短信发送库存不足通知失败:", JSON.stringify(err)))     # Steve 葛伊能电话
        models.sms.sendSmsVia3rd("18140031310", text).catch( (err) -> logger.error("短信发送库存不足通知失败:", JSON.stringify(err)))     # 索晶电话
        models.sms.sendSmsVia3rd("18516272908", text).catch( (err) -> logger.error("短信发送库存不足通知失败:", JSON.stringify(err)))     # 何华电话
        models.sms.sendSmsVia3rd("18215563108", text).catch( (err) -> logger.error("短信发送库存不足通知失败:", JSON.stringify(err)))     # 赵梦菲电话
        models.sms.sendSmsVia3rd("13761339935", text).catch( (err) -> logger.error("短信发送库存不足通知失败:", JSON.stringify(err)))     # 杨唤电话

  methods: {}
  rest: {}
