# 公告

module.exports =
  schema:
    title: zh:String, en:String # 标题
    description: zh:String, en:String # 内容
    priority: Number # 公告优先级 重要程度
    clientFor : String  # 针对平台 iOS wechat 专属公告
    appVersion : String  # 针对平台 升级版本公告
    isActivated : type: Boolean, default:false  # 是否启用

  statics:
    constantClientFor : () ->
      clientForType =
        all : "all"
        website : "website"
        mobileweb : "mobileweb"
        ios : "ios"
        android : "android"
        wechat : "wechat"

  methods: {}
  rest: {}
