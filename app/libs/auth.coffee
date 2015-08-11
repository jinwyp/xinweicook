module.exports = (group="guest") ->
  (req, res, next) ->
    models.user.findUserByAccessToken(models.token.getAccessTokenFromReqHeaders(req)).then((u)->
      console.log "------------------------ Bug User: ", u._id, u.mobile
      req.u = u
    ).catch((err)->
      req.u = group: "guest"
      req.e = err
    ).then ->
#      hooker.hook res, "end", ()->
#        if req.u._id
#          req.u.lastLogin = moment()
#          req.u.saveAsync().catch (e)->
#            logger.error "user", e
      switch group
        when "admin"
          groups = ["admin"]
        when "member"
          groups = ["member", "admin"]
        when "partner"
          groups = ["partner", "admin"]
        else
          groups = ["guest", "member", "admin", "partner"]
      # logger.debug groups
      # logger.debug req.u
      if req.u.group in groups
        next() # TODO BUG
      else
        if req.e
          next req.e
        else
          next new Err "没有权限", 403
