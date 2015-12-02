# 初始化网站数据
initData = require "../../test/initdata.js"
initOldData = require "../../test/oldDish.js"



initDataAdmin = require "../../test/initdata/administrator.js"
initDataWarehouse = require "../../test/initdata/warehouse.js"
initDataTag = require "../../test/initdata/tag.js"
initDataDish = require "../../test/initdata/dish.js"




exports.removeTag = (req, res, next) ->
  models.tag.removeAsync({}).then () ->
    res.send "Remove OK"
  .catch next

exports.removeDish = (req, res, next) ->
  models.dish.removeAsync({}).then () ->
    models.cook.removeAsync({})
    res.send "Remove OK"
  .catch next



exports.removeUser = (req, res, next) ->

  models.user.removeAsync({}).then () ->
#    models.message.removeAsync({})
#    models.device.removeAsync({})
#    models.token.removeAsync({})
    res.send "Remove OK"
  .catch next




exports.removeOrder = (req, res, next) ->

  models.order.removeAsync({}).then () ->
    models.coupon.removeAsync({})
    res.send "Remove OK"
  .catch next





exports.removeLog = (req, res, next) ->
  models.log.removeAsync({}).then () ->
    res.send "Remove OK"
  .catch next



exports.removeSMS = (req, res, next) ->
  models.sms.removeAsync({}).then () ->
    res.send "Remove OK"
  .catch next


exports.removeSetting = (req, res, next) ->
  models.setting.removeAsync({}).then () ->
    res.send "Remove OK"
  .catch next









exports.removeWrongCoupon = (req, res, next) ->

#  models.coupon.findAsync({price: { $exists: false }}).then (result) ->
#    res.send result
#  .catch next

  models.coupon.removeAsync({price: { $exists: false }}).then (result) ->
    res.send result
  .catch next



exports.removeTestInventory = (req, res, next) ->
# 删除岳可诚 和 李凯 的测试订单库存记录
  models.inventory.removeAsync({user:{$in:["55f6aa1bb66fd7da117d6450", "55dd2beff8a6195e11cd6abf", "55c81e4149439fde562d1180"]}}).then () ->
    res.send "Remove OK"
  .catch next





exports.removeNotPaidAccountDetails = (req, res, next) ->

  models.accountdetail.removeAsync({isPlus: true, isPaid:false ,chargeType:{$in:["alipaydirect", "weixinpay"]}  }).then (result) ->
    res.send result
  .catch next













exports.createAdmin = (req, res, next) ->

  models.user.findOneAsync({group : "admin"}).then (resultUser) ->
    if resultUser
      return res.send("Admin already created before")
    else
      return models.user.createAsync(initAdmin).then (resultUsers) ->
        res.json resultUsers

  .catch next




exports.addUserStatisticsClientFrom = (req, res, next) ->

  models.user.findAsync({}).then (resultUserList) ->

    if resultUserList.length > 0
      for user, userIndex in resultUserList
        console.log("-----------", user._id, user.mobile)
        models.order.find({user: user._id.toString()}).sort("createdAt").execAsync().then (result) ->

          if result.length > 0
            console.log("==========", result[0].user, result[0]._id)
            models.user.updateAsync({_id: result[0].user}, {$set : {statisticsClientFrom : result[0].clientFrom}}).then (resultUpdate) ->
              console.log(resultUpdate)
          else
            console.log("++++++++++++", result)


    res.json 'ok'

  .catch next



exports.fixDishInventoryForCaohejin1 = (req, res, next) ->

  query =
    showForWarehouse : "caohejing1"

  idList = []
  models.dish.findAsync({query}).then (resultDishList) ->

    if resultDishList.length > 0
      idList = (dish._id.toString() for dish in resultDishList)

    models.inventory.updateAsync({dish: $in:idList}, {$set : {warehouse : "56332196594b09af6e6c7dd7"}}, { multi: true })
  .then (result) ->

    res.json result

  .catch next



exports.fixDishWarehouseStock = (req, res, next) ->

  models.warehouse.findAsync({}).then (resultWarehouse) ->
    if resultWarehouse
      models.dish.findAsync({}).then (resultDish) ->

        tempStockWarehouseObject = {}

        for dishData, dishIndex in resultDish
          tempStockWarehouseObject[dishData._id] = dishData.stock

          if not dishData.stockWarehouse or dishData.stockWarehouse.length is 0
            dishData.stockWarehouse = []

            for warehouse, warehouseIndex in resultWarehouse

              if not dishData.stockWarehouse[warehouseIndex]
                dishData.stockWarehouse.push({warehouse : warehouse._id, stock : 0})

            for warehouse, warehouseIndex in resultWarehouse
              if dishData.showForWarehouse is "caohejing1" and dishData.stockWarehouse[warehouseIndex].warehouse.toString() is "56332196594b09af6e6c7dd7"
                dishData.stockWarehouse[warehouseIndex].stock = tempStockWarehouseObject[dishData._id]

              if dishData.showForWarehouse isnt "caohejing1" and dishData.stockWarehouse[warehouseIndex].warehouse.toString() is "56332187594b09af6e6c7dd2"
                dishData.stockWarehouse[warehouseIndex].stock = tempStockWarehouseObject[dishData._id]

          if dishData.showForWarehouse isnt "caohejing1"
            dishData.showForWarehouse = "xinweioffice"

          dishData.saveAsync()


        res.json resultDish

  .catch next



exports.createWarehouse = (req, res, next) ->

  models.warehouse.findOneAsync({ name: 'xinweioffice' }).then (resultWarehouse) ->
    if resultWarehouse
      return res.send("Warehouse already created")
    else
      return models.warehouse.createAsync(initDataWarehouse).then (result) ->
        res.json result

  .catch next





exports.createDishAndTag = (req, res, next) ->

  models.tag.findOneAsync({}).then (resultTag) ->
    if resultTag
      return res.send("TagFilter already created before")
    else

      models.dish.findOneAsync({}).then (resultDish) ->
        if resultDish
          return res.send("Dish already created before")
        else

          models.tag.createAsync(initDataTag).then (tags) ->
            models.dish.createAsync(initDataDish)

          .then (result2Dishes) ->
            res.json result2Dishes

  .catch next






exports.createOldDishMigrate = (req, res, next) ->
  oldDishList = []
  tempNumber = 0
  tempNumberPublic = 0

  for oldDish, oldDishIndex in initOldData.dataDishes
    tempNumber++
    kitchenwareTemp = []

    infoUniqueFeatureTemp = []
    infoIngredientTemp = []
    infoCookingStepTemp = []

    if oldDish.is_public
      tempNumberPublic++

      kitchenwareTempArray = oldDish.tools.split(",")

      for kitchenwareObj in kitchenwareTempArray
        kitchenwareTemp.push({zh : kitchenwareObj, en : kitchenwareObj})

      for infoUniqueFeatureOne in oldDish.did_you_know_items
        infoUniqueFeatureOneTemp =
          title:
            zh: infoUniqueFeatureOne.title.zh
            en: infoUniqueFeatureOne.title.en
          contentType: "txt"
          value:
            zh:infoUniqueFeatureOne.text.zh
            en:infoUniqueFeatureOne.text.en
          sortId :  100

        infoUniqueFeatureOneTemp.linkTo = infoUniqueFeatureOne.link if infoUniqueFeatureOne.link

        infoUniqueFeatureTwoTemp =
          title:
            zh:""
            en:""
          contentType: "pic"
          value:
            zh:infoUniqueFeatureOne.image
            en:infoUniqueFeatureOne.image
          sortId :  100

        infoUniqueFeatureTwoTemp.linkTo = infoUniqueFeatureOne.link if infoUniqueFeatureOne.link

        infoUniqueFeatureTemp.push(infoUniqueFeatureTwoTemp)
        infoUniqueFeatureTemp.push(infoUniqueFeatureOneTemp)

      infoUniqueFeature3Temp =
        title:
          zh:""
          en:""
#        contentType: "txt"
        contentType: "pdf"
        value:
          zh:oldDish.recipe_pdf_url
          en:oldDish.recipe_pdf_url
        sortId :  100
      infoUniqueFeatureTemp.push(infoUniqueFeature3Temp) if oldDish.recipe_pdf_url



      if oldDish.ingredients.list
        for ingredientOne in oldDish.ingredients.list
          infoIngredientOneTemp =
            title:
              zh:""
              en:""
            contentType: "txt"
            value:
              zh:ingredientOne.name.zh
              en:ingredientOne.name.en
            sortId :  100

          infoIngredientTemp.push(infoIngredientOneTemp)

        infoIngredientTwoTemp =
          title:
            zh:""
            en:""
          contentType: "pic"
          value:
            zh:oldDish.ingredients.image
            en:oldDish.ingredients.image
          sortId :  100

        infoIngredientTemp.push(infoIngredientTwoTemp) if oldDish.ingredients.image


      if oldDish.recipes
        for recipeOne in oldDish.recipes
          infoCookingStepTemp1 =
            title:
              zh:recipeOne.title.zh
              en:recipeOne.title.en
            contentType: "txt"
            value:
              zh:recipeOne.text.zh
              en:recipeOne.text.en
            sortId :  recipeOne.sort_id
          infoCookingStepTemp2 =
            title:
              zh:""
              en:""
            contentType: "pic"
            value:
              zh:recipeOne.image
              en:recipeOne.image
            sortId :  recipeOne.sort_id
          infoCookingStepTemp.push(infoCookingStepTemp2)
          infoCookingStepTemp.push(infoCookingStepTemp1)

        infoCookingStepVideoOne =
          title:
            zh: "菜谱制作方法"
            en: "See the Action"
          contentType: "videoflv"
#          contentType: "vid"
          value:
            zh:oldDish.action_flv.zh
            en:oldDish.action_flv.en

        infoCookingStepVideoTwo =
          title:
            zh: "菜谱制作方法"
            en: "See the Action"
          contentType: "videomp4"
#          contentType: "vid"
          value:
            zh:oldDish.action_mp4.zh
            en:oldDish.action_mp4.en

        infoCookingStepTemp.push(infoCookingStepVideoOne) if oldDish.action_flv.zh
        infoCookingStepTemp.push(infoCookingStepVideoTwo) if oldDish.action_mp4.zh


      tempDish =
        _id : ObjectId(oldDish._id.$old),
        isPublished : oldDish.is_public
        sortId            : 1001
        cookingType       : "ready to cook" if oldDish.category is "Ready to Cook"
        sideDishType      : "main"
        setType           : "single"

        title             :
          zh : oldDish.name.zh
          en : oldDish.name.en

        shortTitle1 :
          zh : oldDish.ingre_desc.zh
          en : oldDish.ingre_desc.en

        shortTitle2 :
          zh : oldDish.sub_desc.zh
          en : oldDish.sub_desc.en

        cover             : [
          zh : oldDish.cover_image
          en : oldDish.cover_image
        ,
          zh : oldDish.product_image
          en : oldDish.product_image
        ]

        brief             :
          zh : oldDish.desc.zh
          en : oldDish.desc.en


        difficulty        : oldDish.difficulty
        time              : Number(oldDish.time.substr(0,2))
        servings          : 1,
        kitchenware       : kitchenwareTemp

        infoUniqueFeature : infoUniqueFeatureTemp
        infoIngredient : infoIngredientTemp
        infoCookingStep : infoCookingStepTemp

        tagFilter : []
        priceOriginal : oldDish.sale_price


      if oldDish.time.length is 6
        tempDish.time = Number(oldDish.time.substr(0,2))
      else if oldDish.time.length is 5
        tempDish.time = Number(oldDish.time.substr(0,1))
      else
        tempDish.time = 60


      if oldDish.tags
        for tagOne in oldDish.tags
          if tagOne.name.en is "Meat"
            tempDish.tagFilter.push("5590d256103f46d9ac31e3ea")
          if tagOne.name.en is "Seafood"
            tempDish.tagFilter.push("5590d256103f46d9ac31e3e9")
          if tagOne.name.en is "Vegetarian"
            tempDish.tagFilter.push("5590d256103f46d9ac31e3eb")

          if tagOne.name.en is "Date Night"
            tempDish.tagFilter.push("5590d256103f46d9ac31e3f1")
          if tagOne.name.en is "Dinner Party"
            tempDish.tagFilter.push("5590d256103f46d9ac31e3f2")
          if tagOne.name.en is "Family Dinner"
            tempDish.tagFilter.push("5590d256103f46d9ac31e3f3")
          if tagOne.name.en is "Live well"
            tempDish.tagFilter.push("5590d256103f46d9ac31e3f4")

      oldDishList.push tempDish

#  res.json initOldData.dataDishes
  models.dish.findOneAsync({}).then (resultDishes) ->
    if resultDishes
      return res.send("Dishes already created before !")
    else
      models.dish.createAsync(oldDishList).then (resultOldDishes) ->
#        res.json resultOldDishes
        models.dish.createAsync(initData.sampleReadyToEat).then (resultSampleReadyToEat) ->
          res.json resultOldDishes.concat(resultSampleReadyToEat);

  .catch next










exports.initDishWithTopping = (req, res, next) ->


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

    tagFilter : []
  ,



    _id : ObjectId("558a602a3eba152266ff2b9c")
    isPublished : true
    sortId : 100

    cookingType:  "ready to eat"

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

    tagFilter : []
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

    tagFilter : []





  sampleCook =
    _id: ObjectId("5583c96c7313f6c849c3aeb1")

    name :
      zh : "王厨"
      en : "Cook Wang"

    description:
      zh : "王厨牛啊"
      en : "Best Cook in China"

    avatar : ""

  models.cook.createAsync sampleCook
  .then (resultCook) ->
    models.dish.createAsync preferencesAndTopping
  .then (result1Dishes) ->
    models.dish.createAsync sampleDishes
  .then (result2Dishes) ->
    res.json result2Dishes
  .catch next
