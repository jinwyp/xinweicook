# 菜品





exports.dishList = (req, res, next) ->
  # 获取所有菜品
  models.dish.find {}
  .populate "cook.user"
  .execAsync()
  .then (dishes) ->
    res.json dishes
  , next


exports.dishSingleInfo = (req, res, next) ->
  # 获取菜品
  models.dish.findOne _id: req.params._id
  .populate "cook.user"
  .execAsync()
  .then (dish) ->
    res.json dish
  , next






exports.addNewDish = (req, res, next) ->
  # 新建菜品

  preferencesAndTopping = [
    isPublished : true
    sortId : 100
    cookingType:
      zh : "食材包"
      en : "ready to cook"
    sideDishType: "preferences"
    title :
      zh : "澳牛"
      en : "aoniu"
    priceOriginal : 20
  ,

    isPublished : true
    sortId : 101
    cookingType:
      zh : "食材包"
      en : "ready to cook"
    sideDishType: "preferences"
    title :
      zh : "和牛"
      en : "heniu"
    priceOriginal : 25
  ,

    isPublished : true
    sortId : 201
    cookingType:
      zh : "食材包"
      en : "ready to cook"
    sideDishType: "preferences"
    title :
      zh : "茶树菇"
      en : "chashugu"
    priceOriginal : 10
  ,

    isPublished : true
    sortId : 202
    cookingType:
      zh : "食材包"
      en : "ready to cook"
    sideDishType: "preferences"
    title :
      zh : "香菇"
      en : "xiaogu"
    priceOriginal : 15
  ,

    isPublished : true
    sortId : 203
    cookingType:
      zh : "食材包"
      en : "ready to cook"
    sideDishType: "preferences"
    title :
      zh : "平菇"
      en : "pinggu"
    priceOriginal : 20
  ,


    isPublished : true
    sortId : 501
    cookingType:
      zh : "食材包"
      en : "ready to cook"
    sideDishType: "topping"
    title :
      zh : "澳牛"
      en : "aoniu"
    priceOriginal : 20
  ,

    isPublished : true
    sortId : 502
    cookingType:
      zh : "食材包"
      en : "ready to cook"
    sideDishType: "topping"
    title :
      zh : "和牛"
      en : "heniu"
    priceOriginal : 25
  ]



  sampleDishes = [
    isPublished : true
    sortId : 100

    cookingType:
      zh : "既食包"
      en : "ready to eat"

    sideDishType: "main"

    title :
      zh : "干煸茶树菇孜然雪花牛柳"
      en : "ganbianchashugu"

    difficulty : 2
    time : 15
    servings : 1

    kitchenware : [
      zh : "pan"
      en : "pan"
    ]

    priceOriginal : 48

    priceWholesale : [
      quantity : 2
      price : 45
      ,
      quantity : 4
      price : 42
    ]

  ]

  createDish = _.assign createDish, req.body

  if conf.debug
    createDish = preferencesAndTopping

  console.log "aaaaa", createDish
  models.dish.createAsync createDish
  .then (resultDishes) ->
    res.json resultDishes
  , next


