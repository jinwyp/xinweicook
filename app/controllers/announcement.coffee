# 公告



exports.getAnnouncementList = (req, res, next) ->

  models.announcement.find({isActivated:true}).sort("-createdAt").execAsync().then (result) ->
    res.json result
  .catch(next)



exports.getSingleAnnouncement = (req, res, next) ->

  models.announcement.validationId(req.params._id)

  models.announcement.findOneAsync(_id: req.params._id).then (result) ->

    models.announcement.checkNotFound(result)

    res.json result
  .catch(next)
