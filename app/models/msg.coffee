# 消息
module.exports =
  schema:
    user: type: Schema.ObjectId, ref: "user"
    isRead: type: Boolean, default: false # 是否已读
    url: String # 链接
    title: zh:String, en:String
    content: zh:String, en:String
  statics: {}
  methods: {}
  rest: {}
