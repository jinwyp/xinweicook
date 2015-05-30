# 评论
module.exports =
  schema:
    user: type: Schema.ObjectId, ref: "user" # 用户
    dish: type: Schema.ObjectId, ref: "dish" # 对应菜品
    content: String # 内容
    pic: [String] # 图片
    isSpam: type: Boolean, default: false # 是否为垃圾评论
  statics: {}
  methods: {}
  rest: {}
