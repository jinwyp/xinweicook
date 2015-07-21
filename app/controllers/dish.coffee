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










