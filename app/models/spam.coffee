# 举报
module.exports =
  schema:
    accuser: type: Schema.ObjectId, ref: "user" # 原告
    accused: type: Schema.ObjectId, ref: "user" # 被告
    judge: type: Schema.ObjectId, ref: "user" # 处理人
    type: String # 类型
    testimony: String # 证言
    isGuilty: type: Boolean, default: false # 是否有罪
    isDealt: type: Boolean, default: false # 是否已处理
  statics: {}
  methods: {}
  rest: {}
