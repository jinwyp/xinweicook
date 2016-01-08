# 推荐位


module.exports =
  schema:

    dish: type: Schema.ObjectId, ref: "dish"

    position: String # 推荐位名字
    sortId: Number # 排序值

    imgUrl : String # 图片地址
    urlLink : String # 链接地址

  statics: {}
  methods: {}
  rest:{}

