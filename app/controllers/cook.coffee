# 美食趣闻



exports.cookList = (req, res, next) ->
  # 获取所有厨师
  models.cook.findAsync {}
  .then (cooks) ->
    res.json cooks
  , next



exports.cookSingleInfo = (req, res, next) ->
  # 获取厨师
  models.cook.findOneAsync _id: req.params._id
  .then (cook) ->
    res.json cook
  , next




exports.addNewCook = (req, res, next) ->
  # 新建厨师


  sampleCook =
    _id: ObjectId("5583c96c7313f6c849c3aeb1")

    name :
      zh : "王大厨"
      en : "Jin Wang"

    description:
      zh : "王大厨牛啊"
      en : "Best Cook in China"

    avatar : ""


  createCook = _.assign createCook, req.body

  if conf.debug
    createCook = sampleCook

  models.cook.createAsync createCook
  .then (resultCook) ->
    res.json resultCook
  , next




