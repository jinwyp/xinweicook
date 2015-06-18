# 菜品





exports.dishList = (req, res, next) ->
  # 获取所有菜品
  models.dish.find {}
  .populate "cook.user"
  .execAsync()
  .then (dishes) ->
    res.json dishes
  , next


exports.dishSingleInfo = (req, res, next) ->
  # 获取菜品
  models.dish.findOne _id: req.params._id
  .populate "cook.user"
  .execAsync()
  .then (dish) ->
    res.json dish
  , next






