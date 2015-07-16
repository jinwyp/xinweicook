# 初始化网站数据
initData = require "../../test/initdata.js"


exports.createAdmin = (req, res, next) ->

  models.user.findOneAsync({group : "admin"}).then (resultUser) ->
    if resultUser
      return res.send("Admin already created before")
    else
      return models.user.createAsync(initData.userAdmin).then (resultUsers) ->
        res.json resultUsers

  .catch next
