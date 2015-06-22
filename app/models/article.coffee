# 文章
module.exports =
  schema:
    # 普通用户能看的条件: 发布时间已到且已发布, 管理员可以看到所有文章
    user: type: Schema.ObjectId, ref: "user" # 用户
    publishedAt: type: Date, default: Date.now # 发布时间
    isPublished: type: Boolean, default: false # 是否发布
    sortId: type: Number # 排序值

    title: zh:String, en:String # 文章标题
    content: [ # 文章内容
      title: zh:String, en:String
      contentType: String # pic, txt, url, video
      value: zh:String, en:String
    ]
    picCover: [ zh:String, en:String ] # 封面
    picHeading: [ zh:String, en:String ] # 头图

    tag: [ zh:String, en:String ] # tag

    statisticViews: type: Number, default: 0 # 阅读数
    statisticLike: type: Number, default: 0 # 赞数

  statics: {}
  methods: {}
  rest: {}
