module.exports = (allowGroupResource="guest", options) ->
  (req, res, next) ->

    models.user.findUserByAccessToken(models.token.getAccessTokenFromReqHeaders(req)).then( (user)->
      req.u = user

      switch allowGroupResource
        when "admin"
          authorizedGroup = ["admin"]
        when "member"
          authorizedGroup = ["member", "admin"]
        when "partner"
          authorizedGroup = ["partner", "admin"]
        else
          authorizedGroup = ["guest", "member", "admin", "partner"]

      # logger.debug groups
      # logger.debug req.u

      if req.u.group in authorizedGroup
        next() # TODO BUG
      else
        next (new Err "该用户组没有权限", 403)

#      hooker.hook res, "end", ()->
#        if req.u._id
#          req.u.lastLogin = moment()
#          req.u.saveAsync().catch (e)->
#            logger.error "user", e

    ).catch( (err)->
      if options and options.redirectUrl
        res.redirect(options.redirectUrl)
      else
        next(err)
    )
