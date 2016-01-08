# 推荐位


module.exports =
  schema:

    dish: type: Schema.ObjectId, ref: "dish"

    position: String # 推荐位名字
    sortId: Number # 排序值

    imgUrl : String # 图片地址
    linkUrl : String # 链接地址

  statics:
    fields : ->
      selectFields = "-__v"

    constantPosition : () ->
      status =
        index1 : "index1"
        index2 : "index2"
        index3 : "index3"
        indexcook1 : "indexcook1"
        indexcook2 : "indexcook2"



  methods: {}
  rest:{}

