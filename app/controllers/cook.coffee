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


  createCook = _.assign createCook, req.body

  models.cook.createAsync createCook
  .then (resultCook) ->
    res.json resultCook
  , next




