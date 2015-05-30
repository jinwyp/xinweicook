# 菜品
module.exports =
  schema:
    publishedAt: type: Date, default: Date.now # 发布时间
    sortId: Number # 排序值
    isPublished: type: Boolean, default: false # 是否已发布
    title: zh:String, en:String # 菜名
    difficulty: Number # 难度
    time: Number # 烹饪时间 单位min? 不确定
    portion: Number # 几人份
    brief: zh:String, en:String # 简介
    special: [ # 特色
      key: String # pic, txt, url, vid
      value: zh:String, en:String
    ]
    ingredient: [ # 原料
      key: String
      value: zh:String, en:String
    ]
    step: [ # 步骤
      key: String
      value: zh:String, en:String
    ]
    heat: type: Number, default: 0 # 热度
    sales: type: Number, default: 0 # 销量
    likes: type: Number, default: 0 # 赞数
    reads: type: Number, default: 0 # 浏览量
    cover: [zh:String, en:String] # 封面
    cooker: [zh:String, en:String] # 厨具 "toaster","pot","pan","oven","mixer","bowl"

    tag: [zh:String, en:String] # tag
    attr: [ # 属性
      name: zh:String, en:String
      attr: [
        name: zh:String, en:String
        price: Number
        isDefault: type: Boolean, default: false
      ]
    ]
    originalPrice: Number # 原价
    base: [ # 基价
      num: Number
      price: Number
    ]
    add: [ # 附加 类似浇头概念
      name: zh:String, en:String
      price: Number
    ]
    region: [ # 地区
      zh:String, en:String
    ]
    storage: Number # 即食包冷藏保存期
    type: zh:String, en:String # ready to cook, ready to eat
    pair: [ # 推荐搭配
      dish: type: Schema.ObjectId, ref: "dish"
      desc: zh:String, en:String
    ]
  statics: {}
  methods: {}
  rest: {}
