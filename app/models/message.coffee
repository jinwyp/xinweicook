Xinge = require('../libs/xingepush/Xinge.js');

module.exports =
  schema:
    isPushEmail : type: Boolean, default: false
    isPushSMS : type: Boolean, default: false
    isPushMobile : type: Boolean, default: false
    contentType : String  # 消息内容分类  例如 订单order
    text: zh:String, en:String
    isViewed: type: Boolean, default: false
    user: type: Schema.ObjectId, ref: "user" # 用户

  statics:
    constantContentType : () ->
      contentType =
        orderAdd : "orderAdd"
        orderAddText :
          zh : "您的订单已创建，请及时付款"
          en : "Your order has been created, continue to complete the payment"
        orderPaid : "orderPaid"
        orderPaidText :
          zh : "您的订单已付款，正在打包中"
          en : "Your order has been placed, we are preparing your package"
        orderShipped : "orderShipped"
        orderShippedText :
          zh : "您的订单已发货，美味即将到家"
          en : "Your order has been shipped, it is on its way"

    checkNotFound : (message) ->
      if not message
        return throw new Err "Push Message not found !", 400

    sendMessageXinge : ( deviceToken, contentType, additionalContent ) ->

      newMessage =
        contentType : ""
        text : ""

      newMessage.isPushMobile = true

      if additionalContent?
        newMessage.user = additionalContent.userId if additionalContent.userId
        newMessage.orderId = additionalContent.orderId if additionalContent.orderId

      if contentType is @constantContentType().orderAdd
        newMessage.text = @constantContentType().orderAddText
        newMessage.contentType = @constantContentType().orderAdd


      @createAsync(newMessage)

      xingePush = new Xinge.XingeApp(conf.xingePush.accessId, conf.xingePush.secretKey)

      openMessageAction = new Xinge.ClickAction()
      openMessageAction.actionType = Xinge.ACTION_TYPE_ACTIVITY

      iOSMessage = new Xinge.IOSMessage()
      iOSMessage.acceptTime.push(new Xinge.TimeInterval(0, 0, 23, 0)) # 数组元素为TimeInterval实例，表示允许推送的时间段，选填
      iOSMessage.alert = newMessage.text # https://developer.apple.com/library/ios/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/Chapters/ApplePushService.html
      iOSMessage.badge = 1
      iOSMessage.sound = "default"

      iOSMessage.customContent =
        page : 1
        contentType : newMessage.contentType
#          orderId : newMessage.orderId
#          userId : newMessage.user

      iOSMessage.loopTimes = 1 # 重复推送的次数
      iOSMessage.loopInterval = 1  # 重复推送的时间间隔，单位为天

      return new Promise (onFulfilled, onRejected) ->
        xingePush.pushToSingleDevice(deviceToken, iOSMessage, Xinge.IOS_ENV_DEV, (err, resultPush) ->
          if err
            onRejected(err)
          else
            try
              tempResult = JSON.parse(resultPush)
              onFulfilled(tempResult)
            catch err
              # http://developer.xg.qq.com/index.php/%E8%BF%94%E5%9B%9E%E7%A0%81%E6%8F%8F%E8%BF%B0
              onRejected(err)
        )

    sendMessageToUser : ( userId, contentType, additionalContent, pushOptions ) ->

      if pushOptions.isPushMobile
        models.device.findOneAsync(user: userId).then (resultDevice) ->
          if resultDevice and  resultDevice.deviceToken and resultDevice.deviceToken isnt ""
            models.message.sendMessageXinge(resultDevice.deviceToken, contentType, additionalContent).catch( (err) -> logger.error("信鸽推送发送失败:", err))

      if pushOptions.isPushSMS and additionalContent.smsText
        models.user.findOneAsync(_id: userId).then (resultUser) ->
          if resultUser and resultUser.mobile
            models.sms.sendSmsVia3rd(resultUser.mobile, additionalContent.smsText)

  methods: {}
  rest: {}
