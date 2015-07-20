# 初始化网站数据
initData = require "../../test/initdata.js"
initOldData = require "../../test/oldDish.js"


exports.createAdmin = (req, res, next) ->

  models.user.findOneAsync({group : "admin"}).then (resultUser) ->
    if resultUser
      return res.send("Admin already created before")
    else
      return models.user.createAsync(initData.userAdmin).then (resultUsers) ->
        res.json resultUsers

  .catch next



exports.createDishTag = (req, res, next) ->

  models.tag.findOneAsync({}).then (resultTag) ->
    if resultTag
      return res.send("TagFilter already created before")
    else
      return models.tag.createAsync(initData.dishFilter).then (tags) ->
        res.json tags

  .catch next





exports.createOldDish = (req, res, next) ->
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
            zh:infoUniqueFeatureOne.title.zh
            en:infoUniqueFeatureOne.title.en
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
          value:
            zh:oldDish.action_flv.zh
            en:oldDish.action_flv.en

        infoCookingStepVideoTwo =
          title:
            zh: "菜谱制作方法"
            en: "See the Action"
          contentType: "videomp4"
          value:
            zh:oldDish.action_mp4.zh
            en:oldDish.action_mp4.en

        infoCookingStepTemp.push(infoCookingStepVideoOne)
        infoCookingStepTemp.push(infoCookingStepVideoTwo)


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


        priceOriginal : oldDish.sale_price


      if oldDish.time.length is 6
        tempDish.time = Number(oldDish.time.substr(0,2))
      else if oldDish.time.length is 5
        tempDish.time = Number(oldDish.time.substr(0,1))
      else
        tempDish.time = 60

      oldDishList.push tempDish

  models.dish.findOneAsync({}).then (resultDishes) ->
    if resultDishes
      return res.send("Dishes already created before")
    else
      models.dish.createAsync(oldDishList).then (resultOldDishes) ->
        res.json resultOldDishes
        models.dish.createAsync(initData.sampleReadyToEat).then (resultSampleReadyToEat) ->
#          res.json initOldData.dataDishes
          res.json resultOldDishes.concat(resultSampleReadyToEat);

  .catch next



