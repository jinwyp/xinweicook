# 菜品
module.exports =
  schema:
    publishedAt: type: Date, default: Date.now # 发布时间
    isPublished: type: Boolean, default: false # 是否已发布
    sortId: Number # 排序值

    cookingType: zh:String, en:String # ready to cook食材包, ready to eat既食包
    sideDishType: String # 主菜或配菜  main主菜 / topping浇头 / preferences菜属性

    title: zh:String, en:String # 菜名
    difficulty: Number # 难度
    time: Number # 烹饪时间 单位min? 不确定
    servings: Number # 几人份
    brief: zh:String, en:String # 简介

    storage: Number # 即食包冷藏保存期
    cover: [zh:String, en:String] # 封面
    kitchenware: [zh:String, en:String] # 厨具 "toaster","pot","pan","oven","mixer","bowl"

    infoUniqueFeature: [ # 特色
      title: String # pic, txt, url, vid
      value: zh:String, en:String
    ]
    infoIngredient: [ # 原料
      title: String
      value: zh:String, en:String
    ]
    infoCookingStep: [ # 步骤
      title: String
      value: zh:String, en:String
    ]

    region: [ # 地区
      zh:String, en:String
    ]


    priceOriginal: Number # 原价
    priceWholesale: [ # 批发打折 购买多个价格打折
      quantity: Number
      price: Number
    ]

    preferences: [ # 属性参数
      name: zh:String, en:String
      foodMaterial: [
        dish: type: Schema.ObjectId, ref: "dish"
        default: type: Boolean, default: false
      ]
    ]

    topping: [ # 附加 类似浇头概念
      type: Schema.ObjectId, ref: "dish"
    ]


    tag: [zh:String, en:String] # tag

    recommendSet: [ # 推荐搭配
      dish: type: Schema.ObjectId, ref: "dish"
      desc: zh:String, en:String
    ]
    cook:
      user: type: Schema.ObjectId, ref: "user"
      tips: String # 厨师点评

    statisticHot: type: Number, default: 0 # 热度
    statisticSales: type: Number, default: 0 # 销量
    statisticLikes: type: Number, default: 0 # 赞数
    statisticViews: type: Number, default: 0 # 浏览量


  statics: {}
  methods: {}
  rest: {}
