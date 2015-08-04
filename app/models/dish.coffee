# 菜品

autoIncrement = require "mongoose-auto-increment"


module.exports =
  schema:
    publishedAt: type: Date, default: Date.now # 发布时间
    isPublished: type: Boolean, default: false # 是否已发布

    isFromAdminPanel: type: Boolean, default: false # 是否通过后台面板人工输入的
    sortId: Number # 排序值

    cookingType: String # ready to cook食材包, ready to eat既食包
    sideDishType: String # 主菜或配菜  main主菜 / topping浇头 / preferences菜属性 / drink饮料
    setType: String # 餐食类型  单品single 或 套餐set


    difficulty: Number # 难度
    time: Number # 烹饪时间 单位min? 不确定
    servings: Number # 几人份
    storageLife: Number # 即食包冷藏保存期

    title: zh:String, en:String # 菜名
    shortTitle1: zh:String, en:String # 用于列表页面
    shortTitle2: zh:String, en:String # 用于首页推荐

    brief: zh:String, en:String # 简介
    cover: [zh:String, en:String] # 封面
    kitchenware: [zh:String, en:String] # 厨具 "toaster","pot","pan","oven","mixer","bowl"

    infoUniqueFeature: [ # 特色
      title: zh:String, en:String
      contentType: String # pic, txt, video(vid), videomp4, videoflv, pdf
      value: zh:String, en:String
      sortId : type: Number, default: 10 # 排序值
      linkTo : String
    ]
    infoIngredient: [ # 原料
      title: zh:String, en:String
      contentType: String # pic, txt, video(vid), videomp4, videoflv, pdf, richtext
      value: zh:String, en:String
      sortId : type: Number, default: 10 # 排序值
      linkTo : String
    ]
    infoCookingStep: [ # 步骤
      title: zh:String, en:String
      contentType: String # pic, txt, video(vid), videomp4, videoflv, pdf
      value: zh:String, en:String
      sortId : type: Number, default: 10 # 排序值
      linkTo : String
    ]

    region: [ # 地区
      zh:String, en:String
    ]

    tagFilter: [type: Schema.ObjectId, ref: "tag"] # tagFilter

    cook:
      user: type: Schema.ObjectId, ref: "cook"
      tips: zh:String, en:String # 厨师点评


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


    recommendSet: [ # 推荐搭配
      dish: type: Schema.ObjectId, ref: "dish"
      desc: zh:String, en:String
    ]



    stock : type: Number, default: 0 # 库存







    statisticHot: type: Number, default: 0 # 热度
    statisticSales: type: Number, default: 0 # 销量
    statisticLike: type: Number, default: 0 # 赞数
    statisticLikeUserList: [ # 赞过的用户
      type: Schema.ObjectId, ref: "user"
    ]
    statisticViews: type: Number, default: 0 # 浏览量


  statics:
    fields : ->
      selectFields = "-topping -preferences -statisticHot -statisticSales -statisticLike -statisticViews -statisticLikeUserList"

    constantCookingType : () ->
      type =
        cook : "ready to cook"
        eat : "ready to eat"

    checkNotFound : (dish) ->
      if not dish
        return throw new Err "Dish ID or dish not found !", 400

    checkOutOfStock : (dish) ->
      if dish.stock <=0
        return throw new Err "Dish Out Of Stock ! " + dish._id + " " + dish.title.zh + " 库存不足", 400

    validationDishId : (_id) ->
      unless libs.validator.isLength _id, 24, 24
        return throw new Err "Field validation error,  dishID length must be 24-24", 400

    validationNewDish : (dish) ->
      unless libs.validator.isLength dish.sideDishType, 2,10
        return throw new Err "Field validation error,  sideDish must be 2-10", 400

    find1 : (options) ->
      @findOne(options).populate("cook.user").populate("preferences.foodMaterial.dish").populate("topping").populate({path: 'statisticLikeUserList', select: models.user.fieldsLess()}).execAsync()

    find99 : (options) ->
      @find(options).populate("cook.user").populate("preferences.foodMaterial.dish").populate("topping").populate({path: 'statisticLikeUserList', select: models.user.fieldsLess()}).sort("-sortId").sort("-createdAt").execAsync()

  methods: {
    getPrice : (number) ->
      if number < 2 or @priceWholesale.length is 0
        @priceOriginal
      else
        finalPrice = @priceOriginal
        for wholesale,wholesaleIndex in @priceWholesale
          if number < wholesale.quantity
            finalPrice = wholesale.price
            break
        finalPrice

    reduceStock : (stockNumber, user) ->
      @stock = @stock - Number(stockNumber)
      newInventoryChange =
        user : user._id
        dish : @_id
        isPlus : false
        quantity : -Number(stockNumber)
      models.inventory.createAsync(newInventoryChange)
      @saveAsync()

    addStock : (stockNumber, user) ->
      @stock = @stock + Number(stockNumber)
      newInventoryChange =
        user : user._id
        dish : @_id
        isPlus : true
        quantity : Number(stockNumber)
      models.inventory.createAsync(newInventoryChange)
      @saveAsync()
  }
  rest:
    postProcess : (req, res, next) ->
      if req.method is "PUT"
        if req.body.addInventory > 0
          models.dish.findOneAsync({_id:req.params.id})
          .then (resultDish) ->
            if resultDish
              resultDish.addStock(req.body.addInventory, req.u)

        if req.body.reduceInventory > 0
          models.dish.findOneAsync({_id:req.params.id})
          .then (resultDish) ->
            if resultDish
              resultDish.reduceStock(req.body.reduceInventory, req.u)


  plugin: (schema) ->
    schema.plugin autoIncrement.plugin, model: "dish", field: "autoIncrementId", startAt: 10000