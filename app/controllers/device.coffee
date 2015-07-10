# 美食趣闻



exports.deviceList = (req, res, next) ->
  # 获取所有厨师
  models.device.findAsync {}
  .then (devices) ->
    res.json devices
  , next



exports.deviceSingleInfo = (req, res, next) ->
  # 获取厨师
  models.device.findOneAsync _id: req.params._id
  .then (device) ->
    res.json device
  , next




exports.addNewDevice = (req, res, next) ->

  models.device.validationNewDevice req.body

  createDevice = _.assign({}, req.body)

  models.device.findOneAsync({deviceId:req.body.deviceId})
  .then (resultDevice) ->
    models.device.checkFound resultDevice

    models.device.createAsync createDevice
  .then (resultDevice) ->
    res.json resultDevice
  , next





