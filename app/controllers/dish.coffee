# 菜品





exports.dishList = (req, res, next) ->
  # 获取所有菜品
  models.dish.find99({sideDishType : "main"})
  .then (dishes) ->
    res.json dishes
  , next


exports.dishSingleInfo = (req, res, next) ->

  models.dish.validationDishId req.params._id

  models.dish.find1(_id: req.params._id).then (resultDish) ->
    models.dish.checkNotFound resultDish

    res.json resultDish
  .catch next




exports.updateDishStatisticLike = (req, res, next) ->

  models.dish.validationDishId req.params._id

  models.dish.find1(_id: req.params._id).then (resultDish) ->
    models.dish.checkNotFound resultDish

    if resultDish.statisticLikeUserList.indexOf(req.u._id) > -1
      resultDish.statisticLike = resultDish.statisticLike - 1
      resultDish.statisticLikeUserList.splice(resultDish.statisticLikeUserList.indexOf(req.u._id), 1)
      req.u.dishLikeList.splice(req.u.dishLikeList.indexOf(resultDish._id), 1)
    else
      resultDish.statisticLikeUserList.push(req.u._id)
      req.u.dishLikeList.push(resultDish._id)
      resultDish.statisticLike = resultDish.statisticLike + 1

    req.u.saveAsync()
    resultDish.saveAsync()
  .spread (resultDish2, numberAffected) ->
    resultDish2.populateAsync("statisticLikeUserList", models.user.fieldsLess())
  .then (resultDish3) ->
    res.json resultDish3
  .catch next





exports.addNewDish = (req, res, next) ->
  # 新建菜品
  models.dish.validationNewDish req.body

  createDish = _.assign createDish, req.body

  models.dish.createAsync createDish
  .then (resultDishes) ->
    res.json resultDishes
  , next





exports.initNewDish3 = (req, res, next) ->
  sampleDishes = require "../../test/testDish.js"

  models.dish.removeAsync({}).then () ->
    models.dish.createAsync sampleDishes.dataDishes
  .then (resultDishes) ->
    res.json resultDishes
  .catch next





exports.initNewDish2 = (req, res, next) ->
# 新建菜品


  sampleDishObj =

    isPublished : true
    sortId : 99999

    cookingType:  "ready to cook"

    sideDishType: "main"
    setType: "single"

    title :
      zh : "干煸茶树菇孜然雪花牛柳"
      en : "Stir-fried Marbled Beef with Poplar Mushroom and Cumin Sauce"

    cover :[
      zh : "https://dn-xinweicook.qbox.me/香煎银鳕鱼配豆豉汁s-_MG_7089.jpg"
      en : "https://dn-xinweicook.qbox.me/香煎银鳕鱼配豆豉汁s-_MG_7089.jpg"
    ,
      zh : "https://dn-xinweicook.qbox.me/香煎银鳕鱼配豆豉汁s-_MG_7103.jpg"
      en : "https://dn-xinweicook.qbox.me/香煎银鳕鱼配豆豉汁s-_MG_7103.jpg"
    ]


    difficulty : 2
    time : 15
    servings : 1

    kitchenware : [
      zh : "pan"
      en : "pan"
    ]

    brief :
      zh : "优质澳洲M7和牛，摒弃任何额外调料及预处理，真材实料的本味质感，搭配满满一大捧新鲜山野的茶树菇，热力激荡下，茶树菇吸饱了牛肉的精华，更显肉感十足，咬上一口，丰沛的汁水瞬间爆破开来，口口生香，自在于心。"
      en : "The high quality of Australian M7 Wagyu beef requires no marination in advance, fried with fresh poplar mushrooms to sear the flavor and aroma in a perfect way.  Stir-frying makes the cooking easy and quick. Finishing with the chef’s special sauce flavored with cumin gives an extra kick to the whole dish."

    infoUniqueFeature : [
      title :
        zh : "你知道吗？"
        en : "Did you know?"
      contentType : "txt"
      value :
        zh : "澳洲雪花和牛 我们严格选用澳洲进口M7草饲牛肉，挑选和牛脖颈后方上脑部位最里层、肉质最嫩的部分，油花分布均匀，鲜嫩多汁、脂香四溢，富含不饱和脂肪酸，胆固醇含量相对较低，味道与谷饲牛肉相比更为香甜，让每一位品尝者都能获得顶级享受。"
        en : "Australian Wagyu Beef We source the best quality Wagyu Beef from Australia’s accredited meat supplier and expert Top Cut Foods operating under the highest industry certifications to ensure the safety, taste and health of the product."
    ,
      title :
        zh : "特点"
        en : "Unique Feature"
      contentType : "txt"
      value :
        zh : "澳洲雪花和牛 我们严格选用澳洲进口M7草饲牛肉，挑选和牛脖颈后方上脑部位最里层、肉质最嫩的部分，油花分布均匀，鲜嫩多汁、脂香四溢，富含不饱和脂肪酸，胆固醇含量相对较低，味道与谷饲牛肉相比更为香甜，让每一位品尝者都能获得顶级享受。"
        en : "Australian Wagyu Beef We source the best quality Wagyu Beef from Australia’s accredited meat supplier and expert Top Cut Foods operating under the highest industry certifications to ensure the safety, taste and health of the product."
    ]

    infoIngredient : [
      title :
        zh : "彩椒"
        en : "Bell Pepper"
      contentType : "txt"
      value :
        zh : "1/2个"
        en : "1/2"
    ,
      title :
        zh : "洋葱"
        en : "Onion"
      contentType : "txt"
      value :
        zh : "1/4个"
        en : "1/4"
    ]

    infoCookingStep : [
      title :
        zh : "准备工作"
        en : "Preparation work"
      contentType : "txt"
      value :
        zh : "彩椒、洋葱切丝， 香菜切段，香料包中的大蒜切片，干辣椒切小段。"
        en : "Shred the bell pepper and onion, cut coriander and chilies into chunks, slice the garlic."
    ,
      title :
        zh : "干煸茶树菇"
        en : "Dry-fry the poplar mushroom"
      contentType : "txt"
      value :
        zh : "大火烧热锅，倒入2/3的色拉油，加热至冒青烟。放入茶树菇，干煸至表面起皱，呈金黄色。将茶树菇捞出控油，锅中的油留取待用。"
        en : "Heat the pan over high heat; pour in 2/3 of the cooking oil, heat up till smoke slightly comes out. Put in poplar mushroom, dry-fry till surface wrinkling and golden. Take out and drain, reserve remaining oil in the pan."

    ]

    cook :
      user : "5583c96c7313f6c849c3aeb1"
      tips :
        zh : "一般般"
        en : "not bad"


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

    tagFilter : ["5590d256103f46d9ac31e3ee", "5590d256103f46d9ac31e3f2"]

  sampleDishes = []
  for i in [1..10]
    newDish = _.clone(sampleDishObj, true);
    newDish.title.zh = newDish.title.zh + i.toString() + "-" + Math.floor(Math.random() * 9 + 10)
    newDish.cookingType = if i%2 then "ready to cook" else "ready to eat"
    sampleDishes.push newDish

  models.dish.createAsync sampleDishes
  .then (result2Dishes) ->
    res.json result2Dishes
  .catch next






exports.initNewDish = (req, res, next) ->
# 新建菜品

  tagFilterList = [
    _id : ObjectId("5590d256103f46d9ac31e3ee")
    isFilter : true
    group :
      zh : "菜系"
      en : "dishes system"
    name :
      zh : "家常中餐"
      en : "zhongcan"
  ,
    _id : ObjectId("5590d256103f46d9ac31e3ef")
    isFilter : true
    group :
      zh : "菜系"
      en : "dishes system"
    name :
      zh : "逼格西餐"
      en : "xican"
  ,

    _id : ObjectId("5590d256103f46d9ac31e3f0")
    isFilter : true
    group :
      zh : "菜系"
      en : "dishes system"
    name :
      zh : "清新日餐"
      en : "rican"
  ,

    _id : ObjectId("5590d256103f46d9ac31e3f1")
    isFilter : true
    group :
      zh : "菜系"
      en : "dishes system"
    name :
      zh : "风味亚餐"
      en : "yacan"
  ,

    _id : ObjectId("5590d256103f46d9ac31e3f2")
    isFilter : true
    group :
      zh : "食材"
      en : "ingredients"
    name :
      zh : "海鲜"
      en : "seafood"
  ,

    _id : ObjectId("5590d256103f46d9ac31e3f3")
    isFilter : true
    group :
      zh : "食材"
      en : "ingredients"
    name :
      zh : "肉类"
      en : "meat"
  ,

    _id : ObjectId("5590d256103f46d9ac31e3f4")
    isFilter : true
    group :
      zh : "食材"
      en : "ingredients"
    name :
      zh : "素食"
      en : "vegetarian"
  ]



  preferencesAndTopping = [
    _id : ObjectId("5583b7faa2845dec35276b92")
    isPublished : true
    sortId : 100
    cookingType: "ready to cook"
    sideDishType: "preferences"
    title :
      zh : "澳牛"
      en : "aoniu"
    priceOriginal : 20
  ,
    _id : ObjectId("5583b7faa2845dec35276b93")
    isPublished : true
    sortId : 101
    cookingType: "ready to cook"
    sideDishType: "preferences"
    title :
      zh : "和牛"
      en : "heniu"
    priceOriginal : 25
  ,

    _id : ObjectId("5583b7faa2845dec35276b94")
    isPublished : true
    sortId : 201
    cookingType: "ready to cook"
    sideDishType: "preferences"
    title :
      zh : "茶树菇"
      en : "chashugu"
    priceOriginal : 10
  ,

    _id : ObjectId("5583b7faa2845dec35276b95")
    isPublished : true
    sortId : 202
    cookingType: "ready to cook"
    sideDishType: "preferences"
    title :
      zh : "香菇"
      en : "xiaogu"
    priceOriginal : 15
  ,

    _id : ObjectId("5583b7faa2845dec35276b96")
    isPublished : true
    sortId : 203
    cookingType: "ready to cook"
    sideDishType: "preferences"
    title :
      zh : "平菇"
      en : "pinggu"
    priceOriginal : 20
  ,

    _id : ObjectId("5583b7faa2845dec35276b97")
    isPublished : true
    sortId : 501
    cookingType: "ready to cook"
    sideDishType: "topping"
    title :
      zh : "澳牛"
      en : "aoniu"
    priceOriginal : 20
  ,

    _id : ObjectId("5583b7faa2845dec35276b98")
    isPublished : true
    sortId : 502
    cookingType: "ready to cook"
    sideDishType: "topping"
    title :
      zh : "和牛"
      en : "heniu"
    priceOriginal : 25
  ]



  sampleDishes = [
    _id : ObjectId("558a602a3eba152266ff2b8c")

    isPublished : true
    sortId : 100

    cookingType:  "ready to cook"

    sideDishType: "main"
    setType: "single"

    title :
      zh : "干煸茶树菇孜然雪花牛柳"
      en : "Stir-fried Marbled Beef with Poplar Mushroom and Cumin Sauce"

    cover :[
      zh : "https://dn-xinweicook.qbox.me/香煎银鳕鱼配豆豉汁s-_MG_7089.jpg"
      en : "https://dn-xinweicook.qbox.me/香煎银鳕鱼配豆豉汁s-_MG_7089.jpg"
    ,
      zh : "https://dn-xinweicook.qbox.me/香煎银鳕鱼配豆豉汁s-_MG_7103.jpg"
      en : "https://dn-xinweicook.qbox.me/香煎银鳕鱼配豆豉汁s-_MG_7103.jpg"
    ]

    difficulty : 2
    time : 15
    servings : 1

    kitchenware : [
      zh : "pan"
      en : "pan"
    ]

    brief :
      zh : "优质澳洲M7和牛，摒弃任何额外调料及预处理，真材实料的本味质感，搭配满满一大捧新鲜山野的茶树菇，热力激荡下，茶树菇吸饱了牛肉的精华，更显肉感十足，咬上一口，丰沛的汁水瞬间爆破开来，口口生香，自在于心。"
      en : "The high quality of Australian M7 Wagyu beef requires no marination in advance, fried with fresh poplar mushrooms to sear the flavor and aroma in a perfect way.  Stir-frying makes the cooking easy and quick. Finishing with the chef’s special sauce flavored with cumin gives an extra kick to the whole dish."

    infoUniqueFeature : [
      title :
        zh : "你知道吗？"
        en : "Did you know?"
      contentType : "txt"
      value :
        zh : "澳洲雪花和牛 我们严格选用澳洲进口M7草饲牛肉，挑选和牛脖颈后方上脑部位最里层、肉质最嫩的部分，油花分布均匀，鲜嫩多汁、脂香四溢，富含不饱和脂肪酸，胆固醇含量相对较低，味道与谷饲牛肉相比更为香甜，让每一位品尝者都能获得顶级享受。"
        en : "Australian Wagyu Beef We source the best quality Wagyu Beef from Australia’s accredited meat supplier and expert Top Cut Foods operating under the highest industry certifications to ensure the safety, taste and health of the product."
    ,
      title :
        zh : "特点"
        en : "Unique Feature"
      contentType : "txt"
      value :
        zh : "澳洲雪花和牛 我们严格选用澳洲进口M7草饲牛肉，挑选和牛脖颈后方上脑部位最里层、肉质最嫩的部分，油花分布均匀，鲜嫩多汁、脂香四溢，富含不饱和脂肪酸，胆固醇含量相对较低，味道与谷饲牛肉相比更为香甜，让每一位品尝者都能获得顶级享受。"
        en : "Australian Wagyu Beef We source the best quality Wagyu Beef from Australia’s accredited meat supplier and expert Top Cut Foods operating under the highest industry certifications to ensure the safety, taste and health of the product."
    ]

    infoIngredient : [
      title :
        zh : "彩椒"
        en : "Bell Pepper"
      contentType : "txt"
      value :
        zh : "1/2个"
        en : "1/2"
    ,
      title :
        zh : "洋葱"
        en : "Onion"
      contentType : "txt"
      value :
        zh : "1/4个"
        en : "1/4"
    ]

    infoCookingStep : [
      title :
        zh : "准备工作"
        en : "Preparation work"
      contentType : "txt"
      value :
        zh : "彩椒、洋葱切丝， 香菜切段，香料包中的大蒜切片，干辣椒切小段。"
        en : "Shred the bell pepper and onion, cut coriander and chilies into chunks, slice the garlic."
    ,
      title :
        zh : "干煸茶树菇"
        en : "Dry-fry the poplar mushroom"
      contentType : "txt"
      value :
        zh : "大火烧热锅，倒入2/3的色拉油，加热至冒青烟。放入茶树菇，干煸至表面起皱，呈金黄色。将茶树菇捞出控油，锅中的油留取待用。"
        en : "Heat the pan over high heat; pour in 2/3 of the cooking oil, heat up till smoke slightly comes out. Put in poplar mushroom, dry-fry till surface wrinkling and golden. Take out and drain, reserve remaining oil in the pan."

    ]

    cook :
      user : "5583c96c7313f6c849c3aeb1"
      tips :
        zh : "一般般"
        en : "not bad"


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

    tagFilter : ["5590d256103f46d9ac31e3ee", "5590d256103f46d9ac31e3f2"]
  ,



    _id : ObjectId("558a602a3eba152266ff2b9c")
    isPublished : true
    sortId : 100

    cookingType:  "ready to cook"

    sideDishType: "main"
    setType: "single"

    title :
      zh : "22 干煸茶树菇孜然雪花牛柳"
      en : "22 Stir-fried Marbled Beef with Poplar Mushroom and Cumin Sauce"

    difficulty : 2
    time : 15
    servings : 1

    kitchenware : [
      zh : "pan"
      en : "pan"
    ]

    brief :
      zh : "优质澳洲M7和牛，摒弃任何额外调料及预处理，真材实料的本味质感，搭配满满一大捧新鲜山野的茶树菇，热力激荡下，茶树菇吸饱了牛肉的精华，更显肉感十足，咬上一口，丰沛的汁水瞬间爆破开来，口口生香，自在于心。"
      en : "The high quality of Australian M7 Wagyu beef requires no marination in advance, fried with fresh poplar mushrooms to sear the flavor and aroma in a perfect way.  Stir-frying makes the cooking easy and quick. Finishing with the chef’s special sauce flavored with cumin gives an extra kick to the whole dish."

    infoUniqueFeature : [
      title :
        zh : "你知道吗？"
        en : "Did you know?"
      contentType : "txt"
      value :
        zh : "澳洲雪花和牛 我们严格选用澳洲进口M7草饲牛肉，挑选和牛脖颈后方上脑部位最里层、肉质最嫩的部分，油花分布均匀，鲜嫩多汁、脂香四溢，富含不饱和脂肪酸，胆固醇含量相对较低，味道与谷饲牛肉相比更为香甜，让每一位品尝者都能获得顶级享受。"
        en : "Australian Wagyu Beef We source the best quality Wagyu Beef from Australia’s accredited meat supplier and expert Top Cut Foods operating under the highest industry certifications to ensure the safety, taste and health of the product."
    ,
      title :
        zh : "特点"
        en : "Unique Feature"
      contentType : "txt"
      value :
        zh : "澳洲雪花和牛 我们严格选用澳洲进口M7草饲牛肉，挑选和牛脖颈后方上脑部位最里层、肉质最嫩的部分，油花分布均匀，鲜嫩多汁、脂香四溢，富含不饱和脂肪酸，胆固醇含量相对较低，味道与谷饲牛肉相比更为香甜，让每一位品尝者都能获得顶级享受。"
        en : "Australian Wagyu Beef We source the best quality Wagyu Beef from Australia’s accredited meat supplier and expert Top Cut Foods operating under the highest industry certifications to ensure the safety, taste and health of the product."
    ]

    infoIngredient : [
      title :
        zh : "彩椒"
        en : "Bell Pepper"
      contentType : "txt"
      value :
        zh : "1/2个"
        en : "1/2"
    ,
      title :
        zh : "洋葱"
        en : "Onion"
      contentType : "txt"
      value :
        zh : "1/4个"
        en : "1/4"
    ]

    infoCookingStep : [
      title :
        zh : "准备工作"
        en : "Preparation work"
      contentType : "txt"
      value :
        zh : "彩椒、洋葱切丝， 香菜切段，香料包中的大蒜切片，干辣椒切小段。"
        en : "Shred the bell pepper and onion, cut coriander and chilies into chunks, slice the garlic."
    ,
      title :
        zh : "干煸茶树菇"
        en : "Dry-fry the poplar mushroom"
      contentType : "txt"
      value :
        zh : "大火烧热锅，倒入2/3的色拉油，加热至冒青烟。放入茶树菇，干煸至表面起皱，呈金黄色。将茶树菇捞出控油，锅中的油留取待用。"
        en : "Heat the pan over high heat; pour in 2/3 of the cooking oil, heat up till smoke slightly comes out. Put in poplar mushroom, dry-fry till surface wrinkling and golden. Take out and drain, reserve remaining oil in the pan."

    ]

    cook :
      user : "5583c96c7313f6c849c3aeb1"
      tips :
        zh : "一般般"
        en : "not bad"


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

    tagFilter : ["5590d256103f46d9ac31e3ee", "5590d256103f46d9ac31e3f2"]
  ]




  sampleDishObj =

    isPublished : true
    sortId : 100

    cookingType:  "ready to cook"

    sideDishType: "main"
    setType: "single"

    title :
      zh : "干煸茶树菇孜然雪花牛柳"
      en : "Stir-fried Marbled Beef with Poplar Mushroom and Cumin Sauce"

    cover :[
      zh : "https://dn-xinweicook.qbox.me/香煎银鳕鱼配豆豉汁s-_MG_7089.jpg"
      en : "https://dn-xinweicook.qbox.me/香煎银鳕鱼配豆豉汁s-_MG_7089.jpg"
    ,
      zh : "https://dn-xinweicook.qbox.me/香煎银鳕鱼配豆豉汁s-_MG_7103.jpg"
      en : "https://dn-xinweicook.qbox.me/香煎银鳕鱼配豆豉汁s-_MG_7103.jpg"
    ]

    difficulty : 2
    time : 15
    servings : 1

    kitchenware : [
      zh : "pan"
      en : "pan"
    ]

    brief :
      zh : "优质澳洲M7和牛，摒弃任何额外调料及预处理，真材实料的本味质感，搭配满满一大捧新鲜山野的茶树菇，热力激荡下，茶树菇吸饱了牛肉的精华，更显肉感十足，咬上一口，丰沛的汁水瞬间爆破开来，口口生香，自在于心。"
      en : "The high quality of Australian M7 Wagyu beef requires no marination in advance, fried with fresh poplar mushrooms to sear the flavor and aroma in a perfect way.  Stir-frying makes the cooking easy and quick. Finishing with the chef’s special sauce flavored with cumin gives an extra kick to the whole dish."

    infoUniqueFeature : [
      title :
        zh : "你知道吗？"
        en : "Did you know?"
      contentType : "txt"
      value :
        zh : "澳洲雪花和牛 我们严格选用澳洲进口M7草饲牛肉，挑选和牛脖颈后方上脑部位最里层、肉质最嫩的部分，油花分布均匀，鲜嫩多汁、脂香四溢，富含不饱和脂肪酸，胆固醇含量相对较低，味道与谷饲牛肉相比更为香甜，让每一位品尝者都能获得顶级享受。"
        en : "Australian Wagyu Beef We source the best quality Wagyu Beef from Australia’s accredited meat supplier and expert Top Cut Foods operating under the highest industry certifications to ensure the safety, taste and health of the product."
    ,
      title :
        zh : "特点"
        en : "Unique Feature"
      contentType : "txt"
      value :
        zh : "澳洲雪花和牛 我们严格选用澳洲进口M7草饲牛肉，挑选和牛脖颈后方上脑部位最里层、肉质最嫩的部分，油花分布均匀，鲜嫩多汁、脂香四溢，富含不饱和脂肪酸，胆固醇含量相对较低，味道与谷饲牛肉相比更为香甜，让每一位品尝者都能获得顶级享受。"
        en : "Australian Wagyu Beef We source the best quality Wagyu Beef from Australia’s accredited meat supplier and expert Top Cut Foods operating under the highest industry certifications to ensure the safety, taste and health of the product."
    ]

    infoIngredient : [
      title :
        zh : "彩椒"
        en : "Bell Pepper"
      contentType : "txt"
      value :
        zh : "1/2个"
        en : "1/2"
    ,
      title :
        zh : "洋葱"
        en : "Onion"
      contentType : "txt"
      value :
        zh : "1/4个"
        en : "1/4"
    ]

    infoCookingStep : [
      title :
        zh : "准备工作"
        en : "Preparation work"
      contentType : "txt"
      value :
        zh : "彩椒、洋葱切丝， 香菜切段，香料包中的大蒜切片，干辣椒切小段。"
        en : "Shred the bell pepper and onion, cut coriander and chilies into chunks, slice the garlic."
    ,
      title :
        zh : "干煸茶树菇"
        en : "Dry-fry the poplar mushroom"
      contentType : "txt"
      value :
        zh : "大火烧热锅，倒入2/3的色拉油，加热至冒青烟。放入茶树菇，干煸至表面起皱，呈金黄色。将茶树菇捞出控油，锅中的油留取待用。"
        en : "Heat the pan over high heat; pour in 2/3 of the cooking oil, heat up till smoke slightly comes out. Put in poplar mushroom, dry-fry till surface wrinkling and golden. Take out and drain, reserve remaining oil in the pan."

    ]

    cook :
      user : "5583c96c7313f6c849c3aeb1"
      tips :
        zh : "一般般"
        en : "not bad"


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

    tagFilter : ["5590d256103f46d9ac31e3ee", "5590d256103f46d9ac31e3f2"]





  sampleCook =
    _id: ObjectId("5583c96c7313f6c849c3aeb1")

    name :
      zh : "王厨"
      en : "Cook Wang"

    description:
      zh : "王厨牛啊"
      en : "Best Cook in China"

    avatar : ""

  models.tag.createAsync tagFilterList
  .then (resultTag) ->
    models.cook.createAsync sampleCook
  .then (resultCook) ->
    models.dish.createAsync preferencesAndTopping
  .then (result1Dishes) ->
    models.dish.createAsync sampleDishes
  .then (result2Dishes) ->
    res.json result2Dishes
  .catch next




