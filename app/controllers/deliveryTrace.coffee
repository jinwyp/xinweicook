# 快递员






# 修改或加入 购物车商品
exports.updateTrace = (req, res, next) ->

  models.deliverytrace.validationTrace req.body


  models.deliverytrace.update({user: req.u._id}, req.body, {upsert: true}, (err)->
    if err
      next(err)

    res.send({status:'200'})
  )
















