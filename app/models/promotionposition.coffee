# 推荐位


module.exports =
  schema:

    dish: type: Schema.ObjectId, ref: "dish"

    position: String # 推荐位名字
    sortId: Number # 排序值

    imgUrl : String # 图片地址
    imgAlt : String # 图片Alt 属性
    linkUrl : String # 链接地址

  statics:
    fields : ->
      selectFields = "-__v"

    constantPosition : () ->
      status =
        index1 : "index1"  # 首页轮播
        index2 : "index2"  # 首页轮播上部三格
        index3 : "index3"  # 首页轮播下部三格
        indexcook1 : "indexcook1" # 食材包首页推荐位
        indexcook2 : "indexcook2"


    find99 : (options) ->
      @findOne(options).sort("position").sort("-sortId").select(models.promotionposition.fields())
      .populate({path: 'dish', select: models.dish.fieldsLess()})
      .execAsync()



  methods: {}
  rest:{}

