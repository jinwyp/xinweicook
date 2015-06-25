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
  models.order.validationNewOrder req

#  newOrder = _.assign newOrder, req.body


  newOrder =
    orderNumber : moment().format('YYYYMMDDHHmmssSSS') + (Math.floor(Math.random() * 9000) + 1000)
    user : req.u._id.toString()
    dishList : req.body.dishList

  console.log "-------------------: ", newOrder

  models.order.createAsync newOrder
  .then (orders) ->
    res.json orders
  , next


