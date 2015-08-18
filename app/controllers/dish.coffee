# 菜品




# 获取所有菜品
exports.dishList = (req, res, next) ->
  if not req.query.sideDishType
    req.query.sideDishType = "main"

  models.dish.find99({sideDishType : {$in: [req.query.sideDishType, "drink"]}, isPublished : true}).then (dishes) ->
    res.json dishes
  , next



exports.dishSingleInfo = (req, res, next) ->

  models.dish.validationDishId req.params._id

  models.dish.find1({_id: req.params._id, isPublished : true}).then (resultDish) ->
    models.dish.checkNotFound resultDish
    res.json resultDish
  .catch next









# 新建菜品
exports.addNewDish = (req, res, next) ->

  models.dish.validationNewDish req.body

  createDish = _.assign createDish, req.body

  models.dish.createAsync createDish
  .then (resultDishes) ->
    res.json resultDishes
  , next






# 喜欢 赞菜品 或 取消赞菜品
exports.updateDishStatisticLike = (req, res, next) ->

  models.dish.validationDishId req.params._id

  models.dish.findOneAsync(_id: req.params._id).then (resultDish) ->
    models.dish.checkNotFound resultDish
    if resultDish.statisticLikeUserList.indexOf(req.u._id) > -1
      resultDish.statisticLike = resultDish.statisticLike - 1
      resultDish.statisticLikeUserList.splice(resultDish.statisticLikeUserList.indexOf(req.u._id), 1)
      req.u.dishLikeList.splice(req.u.dishLikeList.indexOf(resultDish._id), 1)
    else
      resultDish.statisticLikeUserList.push(req.u._id)
      req.u.dishLikeList.push(resultDish._id)
      resultDish.statisticLike = resultDish.statisticLike + 1

    req.u.saveAsync().catch (err)->
      logger.error "---- User Like error", err

    resultDish.saveAsync()
  .spread (resultDish2, numberAffected) ->
    resultDish2.populateAsync("statisticLikeUserList", models.user.fieldsLess())
  .then (resultDish3) ->
    res.json resultDish3
  .catch next




