# 公告



exports.getAnnouncementList = (req, res, next) ->

  models.announcement.findAsync({}).then (result) ->
    res.json result
  .catch(next)



exports.getSingleAnnouncement = (req, res, next) ->
  # 获取趣闻
  models.announcement.findOneAsync(_id: req.params._id).then (result) ->
    res.json result
  .catch(next)




