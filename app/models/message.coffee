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

    sendMessage : ( deviceToken, contentType, additionalContent, options ) ->

      newMessage =
        contentType : ""
        text : ""

      if additionalContent?
        newMessage.userId = additionalContent.userId if additionalContent.userId
        newMessage.orderId = additionalContent.orderId if additionalContent.orderId

      if contentType is @constantContentType().orderAdd
        newMessage.text = @constantContentType().orderAddText
        newMessage.contentType = @constantContentType().orderAdd

      if options.isPushMobile is true
        newMessage.isPushMobile = options.isPushMobile

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
#          userId : newMessage.userId

        iOSMessage.loopTimes = 1 # 重复推送的次数
        iOSMessage.loopInterval = 1  # 重复推送的时间间隔，单位为天

        return new Promise (onFulfilled, onRejected) ->
          xingePush.pushToSingleDevice(deviceToken, iOSMessage, Xinge.IOS_ENV_DEV, (err, resultPush) ->
            if err
              onRejected err
            onFulfilled JSON.parse resultPush
          )

    sendMessageToUser : ( userId, contentType, additionalContent, pushOptions ) ->
      models.device.findOneAsync(user: userId).then (resultDevice) ->
        pushOptions =
          isPushMobile : true
        console.log "message: -----"  , resultDevice
        if resultDevice and  resultDevice.deviceToken and resultDevice.deviceToken isnt ""
          models.message.sendMessage(resultDevice.deviceToken, contentType, additionalContent, pushOptions)




  methods: {}
  rest: {}
