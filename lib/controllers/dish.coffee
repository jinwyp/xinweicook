# 菜品
module.exports = (router)->
  router.get("/dish/:_id", (req, res, next) ->
    # 获取菜品
    models.dish.findOneAsync _id: req.params._id
    .then (dish) ->
      res.json dish
    , next
  ).get("/dishes", (req, res, next) ->
    # 获取所有菜品
    models.dish.findAsync {}
    .then (dishes) ->
      res.json dishes
    , next
  )
