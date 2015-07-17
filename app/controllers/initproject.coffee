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

  for oldDish, oldDishIndex in initOldData.dataDishes


    kitchenwareTemp = []



    if oldDish.is_public

      kitchenwareTempArray = oldDish.tools.split(",")

      for kitchenwareObj in kitchenwareTempArray
        kitchenwareTemp.push({zh : kitchenwareObj, en : kitchenwareObj})


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

        priceOriginal : oldDish.sale_price


      oldDishList.push tempDish



  res.json initOldData.dataDishes[2]
#  res.json oldDishList[2]

