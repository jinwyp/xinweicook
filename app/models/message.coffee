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
          zh : "您的订单已经生成，请及时付款"
          en : "Order have been submitted, please pay order as soon as possible"


    checkNotFound : (message) ->
      if not message
        return throw new Err "Push Message not found !", 400

    sendMessage : (userId, deviceToken, contentType, options, callback) ->

      newMessage =
        contentType : ""
        text : ""
        user : userId

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

        iOSMessage.customContent = {page: 'home'}
        iOSMessage.loopTimes = 1 # 重复推送的次数
        iOSMessage.loopInterval = 1  # 重复推送的时间间隔，单位为天

        return new Promise (onFulfilled, onRejected) ->
          xingePush.pushToSingleDevice(deviceToken, iOSMessage, Xinge.IOS_ENV_DEV, (err, resultPush) ->
            if err
              onRejected err
            onFulfilled JSON.parse resultPush
          )

  methods: {}
  rest: {}
