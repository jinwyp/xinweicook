# 菜品





exports.dishList = (req, res, next) ->
  # 获取所有菜品
  models.dish.find {sideDishType : "main"}
  .populate "cook.user"
  .populate "preferences.foodMaterial.dish"
  .populate "topping"
  .execAsync()
  .then (dishes) ->
    res.json dishes
  , next


exports.dishSingleInfo = (req, res, next) ->
  # 获取菜品
  models.dish.findOne _id: req.params._id
  .populate "cook.user"
  .populate "preferences.foodMaterial.dish"
  .populate "topping"
  .execAsync()
  .then (dish) ->
    res.json dish
  , next






exports.addNewDish = (req, res, next) ->
  # 新建菜品

  preferencesAndTopping = [
    _id : ObjectId("5583b7faa2845dec35276b92")
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
    _id : ObjectId("5583b7faa2845dec35276b93")
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

    _id : ObjectId("5583b7faa2845dec35276b94")
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

    _id : ObjectId("5583b7faa2845dec35276b95")
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

    _id : ObjectId("5583b7faa2845dec35276b96")
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

    _id : ObjectId("5583b7faa2845dec35276b97")
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

    _id : ObjectId("5583b7faa2845dec35276b98")
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
      en : "Stir-fried Marbled Beef with Poplar Mushroom and Cumin Sauce"

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

    preferences : [
      name :
        zh : "牛肉"
        en : "beef"
      foodMaterial : [
        dish : "5583b7faa2845dec35276b92"
        default : true
      ,
        dish : "5583b7faa2845dec35276b93"
        default : false
      ]
    ,
      name :
        zh : "菌菇"
        en : "mushroom"
      foodMaterial : [
        dish : "5583b7faa2845dec35276b94"
        default : true
      ,
        dish : "5583b7faa2845dec35276b95"
        default : false
      ,
        dish : "5583b7faa2845dec35276b96"
        default : false
      ]
    ]

    topping : [
      "5583b7faa2845dec35276b97", "5583b7faa2845dec35276b98"
    ]

  ]

  createDish = _.assign createDish, req.body

  if conf.debug
#    createDish = preferencesAndTopping
    createDish = sampleDishes

  models.dish.createAsync createDish
  .then (resultDishes) ->
    res.json resultDishes
  , next


