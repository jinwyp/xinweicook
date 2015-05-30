module.exports = Cache =
  setHeader: (res)->
    res.setHeader "Cache-Control", "no-cache, no-store, must-revalidate"
    res.setHeader "Pragma", "no-cache"
    res.setHeader "Expires", 0
  lastModified: (req, res, next) ->
    hooker.hook res, "json", (body)->
      if body.modifiedAt
        lastModified = body.modifiedAt
      else if _.isArray body
        lastModified = (_.max body, (i)->
          moment(new Date(i.modifiedAt)).valueOf()
        ).modifiedAt
      if lastModified
        res.set "Last-Modified", lastModified
    next()

