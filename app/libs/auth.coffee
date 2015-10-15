module.exports = (allowGroupResource="guest", options) ->
  (req, res, next) ->

    models.token.findTokenByAccessToken(models.token.getAccessTokenFromReqHeaders(req)).then((user)->
      models.user.checkNotFound(user)
      models.user.checkNotSpam(user)

      if user
        req.u = user

        if models.user.authRolePermission(allowGroupResource, user.group)
          next() # TODO BUG
        else
          throw new Err "该用户组没有权限", 403
      else
        throw new Err "找不到该用户", 401, Err.code.user.notFound

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
