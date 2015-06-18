# 订单




exports.orderListByUser = (req, res, next) ->
  # 获取该用户所有订单
  models.order.find user: req.u._id
  .sort "-createdAt"
  .limit "50"
  .execAsync()
  .then (orders) ->
    res.json orders
  , next





exports.orderSingleInfo = (req, res, next) ->
  # 获取某个订单
  models.dish.findOneAsync _id: req.params._id
  .then (dish) ->
    res.json dish
  , next



exports.addNewOrder = (req, res, next) ->
  # 新增用户订单
  body = user: req.u._id
  body = _.assign body, req.body
  models.order.createAsync body
  .then (orders) ->
    res.json orders
  , next




