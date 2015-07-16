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
    if oldDish.is_public
      tempDish =
        isPublished : oldDish.is_public
        sortId            : 1001
    cookingType       : "ready to cook",
    sideDishType      : "main",
    setType           : "single",
    title             : {
      zh : "干煸茶树菇孜然雪花牛柳",
      en : "Stir-fried Marbled Beef with Poplar Mushroom and Cumin Sauce"
    },
    cover             : [
      {
        zh : "https://dn-xinweicook.qbox.me/香煎银鳕鱼配豆豉汁s-_MG_7089.jpg",
        en : "https://dn-xinweicook.qbox.me/香煎银鳕鱼配豆豉汁s-_MG_7089.jpg"
      }, {
        zh : "https://dn-xinweicook.qbox.me/香煎银鳕鱼配豆豉汁s-_MG_7103.jpg",
        en : "https://dn-xinweicook.qbox.me/香煎银鳕鱼配豆豉汁s-_MG_7103.jpg"
      }
    ],
    difficulty        : 2,
    time              : 15,
    servings          : 1,
    kitchenware       : [
      {
        zh : "pan",
        en : "pan"
      }
    ],
    brief             : {
      zh : "优质澳洲M7和牛，摒弃任何额外调料及预处理，真材实料的本味质感，搭配满满一大捧新鲜山野的茶树菇，热力激荡下，茶树菇吸饱了牛肉的精华，更显肉感十足，咬上一口，丰沛的汁水瞬间爆破开来，口口生香，自在于心。",
      en : "The high quality of Australian M7 Wagyu beef requires no marination in advance, fried with fresh poplar mushrooms to sear the flavor and aroma in a perfect way.  Stir-frying makes the cooking easy and quick. Finishing with the chef’s special sauce flavored with cumin gives an extra kick to the whole dish."
    },

  res.json initOldData.dataDishes[0]

