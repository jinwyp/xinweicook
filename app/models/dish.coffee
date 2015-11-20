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

    showForWarehouse: String # 针对仓库显示

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

    stockWarehouse: [ # 每个仓库的库存
      warehouse: type: Schema.ObjectId, ref: "warehouse"
      stock: type: Number, default: 0 # 库存
    ]






    statisticHot: type: Number, default: 0 # 热度
    statisticSales: type: Number, default: 0 # 销量
    statisticLike: type: Number, default: 0 # 赞数
    statisticLikeUserList: [ # 赞过的用户
      type: Schema.ObjectId, ref: "user"
    ]
    statisticViews: type: Number, default: 0 # 浏览量




  statics:
    fields : ->
      selectFields = "-__v -autoIncrementId -region -recommendSet -cook -statisticHot -statisticSales -statisticLike -statisticViews -statisticLikeUserList"

    fieldsLess : ->
      selectFields = "-__v -autoIncrementId -stockWarehouse -topping -preferences -kitchenware -infoUniqueFeature -infoIngredient -infoCookingStep -priceWholesale -region -recommendSet -cook -statisticHot -statisticSales -statisticLike -statisticViews -statisticLikeUserList"


    constantCookingType : () ->
      type =
        cook : "ready to cook"
        eat : "ready to eat"

    constantSideDishType : () ->
      type =
        main : "main"
        preferences : "preferences"
        topping : "topping"
        drink : "drink"

    checkNotFound : (dish) ->
      if not dish
        return throw new Err "Dish ID or dish not found !", 400

    checkOutOfStock : (dish, warehouseId) ->
      if dish.stock <=0
        return throw new Err "Dish Out Of Stock ! " + dish._id + " " + dish.title.zh + " 总库存不足", 400, Err.code.dish.outOfStock
      else
        if dish.stockWarehouse.length > 0
          for warehouse, warehouseIndex in dish.stockWarehouse
            if warehouse.warehouse.toString() is warehouseId.toString() and warehouse.stock <= 0
              return throw new Err "Dish Out Of Stock ! " + dish._id + " " + dish.title.zh + " 库存不足, 仓库ID: " + warehouseId, 400, Err.code.dish.outOfStock

    validationDishId : (_id) ->
      unless libs.validator.isLength _id, 24, 24
        return throw new Err "Field validation error,  dishID length must be 24-24", 400

    validationNewDish : (dish) ->
      unless libs.validator.isLength dish.sideDishType, 2,10
        return throw new Err "Field validation error,  sideDish must be 2-10", 400

    find1 : (options) ->
      @findOne(options).select(models.dish.fields()).populate("preferences.foodMaterial.dish").populate("topping").execAsync()

    find99 : (options, limit) ->
      if not limit
        limit = 999

      @find(options).sort("-sortId").sort("-createdAt").limit(limit).select(models.dish.fields()).populate("preferences.foodMaterial.dish").populate("topping").execAsync()

  methods:
    getPrice : (number) ->
      if number < 2
        @priceOriginal
      else
        finalPrice = @priceOriginal
        if @priceWholesale and @priceWholesale.length > 0
          for wholesale,wholesaleIndex in @priceWholesale
            if number < wholesale.quantity
              finalPrice = wholesale.price
              break
        finalPrice


    reduceStock : (stockNumber, warehouseId, user, remark, orderId ) ->

      dishNow = @

      if not @stockWarehouse
        @stockWarehouse = []

      models.warehouse.find99({}).then (resultWarehouseList) ->
        # 补齐所缺的仓库的库存数组
        for warehouse, warehouseIndex in resultWarehouseList
          if not dishNow.stockWarehouse[warehouseIndex]
            dishNow.stockWarehouse.push({warehouse : warehouse._id, stock : 0})

        # 减少每个仓库的库存，
        dishNow.stock = 0   # 每次重新计算总库存

        for warehouse, warehouseIndex in resultWarehouseList

          if warehouse._id.toString() is warehouseId.toString()
            dishNow.stockWarehouse[warehouseIndex].stock = dishNow.stockWarehouse[warehouseIndex].stock - Number(stockNumber)

            newInventoryChange =
              warehouse : warehouseId
              user : user._id
              dish : dishNow._id
              isPlus : false
              quantity : -Number(stockNumber)
              remark : models.inventory.constantRemark().adminOperation

            newInventoryChange.remark = remark if remark
            newInventoryChange.order = orderId if orderId

            models.inventory.createAsync(newInventoryChange)

          dishNow.stock = dishNow.stock + dishNow.stockWarehouse[warehouseIndex].stock

          if dishNow.stock <= 1 and dishNow.stock > -2
            # 给客服发送短信
            models.sms.sendSMSToCSOutOfStock(dishNow.title.zh)

        dishNow.saveAsync()



    addStock : (stockNumber, warehouseId, user, remark) ->

      tempStockWarehouseObject = {}
      dishNow = @

      if not @stockWarehouse
        @stockWarehouse = []
      else
        for stock, stockIndex in @stockWarehouse
          tempStockWarehouseObject[stock.warehouse] = stock;

      models.warehouse.find99({}).then (resultWarehouseList) ->
        # 补齐所缺的仓库的库存数组
        for warehouse, warehouseIndex in resultWarehouseList
          if not dishNow.stockWarehouse[warehouseIndex]
            dishNow.stockWarehouse.push({warehouse : warehouse._id, stock : 0})


        # 增加每个仓库的库存，并调整仓库在数组中的顺序
        dishNow.stock = 0   # 每次重新计算总库存

        for warehouse, warehouseIndex in resultWarehouseList
          if warehouse._id.toString() isnt dishNow.stockWarehouse[warehouseIndex].warehouse.toString()
            dishNow.stockWarehouse[warehouseIndex].warehouse = warehouse._id;
            dishNow.stockWarehouse[warehouseIndex].stock = tempStockWarehouseObject[warehouse._id].stock;


          if warehouse._id.toString() is warehouseId.toString()
            dishNow.stockWarehouse[warehouseIndex].stock = dishNow.stockWarehouse[warehouseIndex].stock + Number(stockNumber)

            newInventoryChange =
              warehouse : warehouseId
              user : user._id
              dish : dishNow._id
              isPlus : true
              quantity : Number(stockNumber)
              remark : models.inventory.constantRemark().adminOperation

            newInventoryChange.remark = remark if remark

            models.inventory.createAsync(newInventoryChange)

          dishNow.stock = dishNow.stock + dishNow.stockWarehouse[warehouseIndex].stock

        dishNow.saveAsync()



  rest:
    postUpdate : (req, res, next) ->

      if req.method is "PUT"

        # 修改库存
        if req.body.addInventoryWarehouseStock > 0 and req.body.addInventoryWarehouseId and req.body.addInventoryWarehouseId.length is 24

          models.dish.findOneAsync({_id:req.params.id}).then (resultDish) ->
            models.warehouse.findOneAsync({_id:req.body.addInventoryWarehouseId}).then (resultWarehouse) ->

              if resultDish and resultWarehouse
                resultDish.addStock(req.body.addInventoryWarehouseStock, resultWarehouse._id, req.u, models.inventory.constantRemark().adminOperation)



        if req.body.reduceInventoryWarehouseStock > 0 and req.body.reduceInventoryWarehouseId and req.body.reduceInventoryWarehouseId.length is 24

          models.dish.findOneAsync({_id:req.params.id}).then (resultDish) ->
            models.warehouse.findOneAsync({_id:req.body.reduceInventoryWarehouseId}).then (resultWarehouse) ->

              if resultDish and resultWarehouse
                resultDish.reduceStock(req.body.reduceInventoryWarehouseStock, resultWarehouse._id, req.u, models.inventory.constantRemark().adminOperation )

      next()

  virtual: (schema) ->
    schema.virtual("outOfStock").get( ->
      if @stock > 0
        false
      else
        true
    )

    schema.virtual("stockWarehouseObj").get( ()->
      result = {}
      if @stockWarehouse and @stockWarehouse.length > 0
        for warehouse, warehouseIndex in @stockWarehouse
          result[warehouse.warehouse] = warehouse.stock

      result
    )

    schema.set('toJSON', { virtuals: true })

  plugin: (schema) ->
    schema.plugin autoIncrement.plugin, model: "dish", field: "autoIncrementId", startAt: 10000
