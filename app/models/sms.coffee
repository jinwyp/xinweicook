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
      type = ["signUp", "resetPassword", "verifyMobile", "orderShipped", "orderShipped2", "moneyRefund", "newCoupon1"]

    constantTemplateVerifyCode: (code, lang) ->
      if lang is "en-US"
        "【新味Cook】Your verification code is #{code}."
      else
        "【新味Cook】您的验证码为 #{code}。请不要告诉他人！"

    constantTemplateVerifyCodeSignUp: (code, lang) ->
      if lang is "en-US"
        "【新味Cook】Your signup verification code is #{code}."
      else
        "【新味Cook】您用于注册的验证码为 #{code}。请不要告诉他人！"

    constantTemplateOrderShipped: (orderNo, expressText, lang) ->
      if lang is "en-US"
        "【新味Cook】Your order #{orderNo} is shipping now. #{expressText}"
      else
        "【新味Cook】您的订单 #{orderNo} 已经开始发货，美味即将到家。#{expressText}"

    constantTemplateMoneyRefund: (lang) ->
      if lang is "en-US"
        "【新味Cook】您好，您的款项已经退回原账户，请查收。如有疑问，请及时联系我们021-51534950"
      else
        "【新味Cook】您好，您的款项已经退回原账户，请查收。如有疑问，请及时联系我们021-51534950"

    constantTemplateNewCoupon1: (lang) ->
      if lang is "en-US"
        "【新味Cook】亲爱的新味用户，由于天气原因导致订单延误，为了表示歉意，已有一张致歉优惠券发放到您的账户中。"
      else
        "【新味Cook】亲爱的新味用户，由于天气原因导致订单延误，为了表示歉意，已有一张致歉优惠券发放到您的账户中。"

    constantTemplateOrderShipped2: (orderNo, expressName, expressNumber, lang) ->
      if lang is "en-US"
        "【新味Cook】您的订单#{orderNo}已发出，配送公司为#{expressName}，快递单号#{expressNumber}。若超出预计配送时间请当着快递员仔细检查，如有变质问题请当场拒收并联系我们021 51534950"
      else
        "【新味Cook】您的订单#{orderNo}已发出，配送公司为#{expressName}，快递单号#{expressNumber}。若超出预计配送时间请当着快递员仔细检查，如有变质问题请当场拒收并联系我们021 51534950"

    constantTemplateCustomerNewOrderNotify: (orderNumber, lang) ->
      if lang is "en-US"
        "【新味Cook】客服后台通知 有已支付新订单 #{orderNumber}"
      else
        "【新味Cook】客服后台通知 有已支付新订单 #{orderNumber}"

    constantTemplateCustomerOutOfStockNotify: (dishTitle, lang) ->
      if lang is "en-US"
        "【新味Cook】客服后台通知 库存不足 #{dishTitle}"
      else
        "【新味Cook】客服后台通知 库存不足 #{dishTitle}"

    constantTemplateSystemErrorNotify: (message, lang) ->
      if lang is "en-US"
        "【新味Cook】系统错误通知 #{message}"
      else
        "【新味Cook】系统错误通知 #{message}"



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
#        logger.error("短信发送成功: " + mobile, body)
        result = JSON.parse(body)
        if result.code isnt 0
#          logger.error("短信发送失败: " + mobile, body)
          throw new Err "Send SMS failed " + result.msg, 400, Err.code.sms.sendFailed
        else
          result
      .catch( (err)->
        logger.error("Send SMS failed: " + mobile, JSON.stringify(err))
      )




    # 创建并记录验证码
    logCode: (type, mobile) ->
      @validationSMSType type

      code = chance.natural(min: 100000, max: 999999)
      expiredAt = moment().add(conf.code.expire, "m")

#      logger.debug "----------Send SMS :", "#{mobile}, #{type}, #{code}, \
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
      @findOneAsync(type: type, mobile: mobile).then (log)->
        if not log
          throw new Err "无效的验证码", 400, Err.code.sms.invalidCode

        else
          if log.trys >= conf.code.trys
            throw new Err "达到今日最大尝试次数", 400, Err.code.sms.tooManyTries

          log.trys++
          log.saveAsync().then ()->

            if log.expiredAt < moment()
              throw new Err "过期的验证码 ", 400, Err.code.sms.expired

            else if log.code?.toString() isnt code?.toString()
              throw new Err "验证码错误", 400, Err.code.sms.wrongCode

            else
              log.expiredAt = moment()
              log.saveAsync()


    # 给客服发送短信
    sendSMSToCSNewOrder: (orderNumber) ->
      if not conf.debug
        text = models.sms.constantTemplateCustomerNewOrderNotify(orderNumber)
        today = moment().second()

        if today < 2
          models.sms.sendSmsVia3rd("18140031310", text).catch( (err) -> logger.error("短信发送新订单通知失败:", JSON.stringify(err)))     # 索晶电话
          models.sms.sendSmsVia3rd("15907090405", text).catch( (err) -> logger.error("短信发送新订单通知失败:", JSON.stringify(err)))     # 李晓雪电话
          models.sms.sendSmsVia3rd("18215563108", text).catch( (err) -> logger.error("短信发送新订单通知失败:", JSON.stringify(err)))     # 赵梦菲电话
          models.sms.sendSmsVia3rd("13761339935", text).catch( (err) -> logger.error("短信发送新订单通知失败:", JSON.stringify(err)))     # 杨唤电话

    sendSMSToCSOutOfStock: (dishTitleZh) ->
      if not conf.debug
        text = models.sms.constantTemplateCustomerOutOfStockNotify(dishTitleZh)
        models.sms.sendSmsVia3rd("18621378962", text).catch( (err) -> logger.error("短信发送库存不足通知失败:", JSON.stringify(err)))     # Steve 葛伊能电话
        models.sms.sendSmsVia3rd("18140031310", text).catch( (err) -> logger.error("短信发送库存不足通知失败:", JSON.stringify(err)))     # 索晶电话
        models.sms.sendSmsVia3rd("15907090405", text).catch( (err) -> logger.error("短信发送库存不足通知失败:", JSON.stringify(err)))     # 李晓雪电话
        models.sms.sendSmsVia3rd("18215563108", text).catch( (err) -> logger.error("短信发送库存不足通知失败:", JSON.stringify(err)))     # 赵梦菲电话
        models.sms.sendSmsVia3rd("13761339935", text).catch( (err) -> logger.error("短信发送库存不足通知失败:", JSON.stringify(err)))     # 杨唤电话

    sendSMSToDev: (text) ->
      if not conf.debug
        text = models.sms.constantTemplateSystemErrorNotify(text)
        models.sms.sendSmsVia3rd("13564568304", text)    # 王宇鹏电话
        models.sms.sendSmsVia3rd("15900719671", text)     # 岳可诚电话

  methods: {}
  rest: {}
