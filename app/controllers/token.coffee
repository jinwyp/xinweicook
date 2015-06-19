# 认证

exports.tokenSignIn = (req, res, next) ->
  # 登录
  { grant_type, username, password, refresh_token } = req.body
  switch grant_type
    when "password"
      models.token.findTokenByMobilePwd(username, password).then((t) ->
        libs.cache.setHeader res
        res.json
          access_token: t.access_token
          refresh_token: t.refresh_token
          token_type: "Bearer"
          expires_in: t.getExpiresIn()
      , next)
    when "refresh_token"
      models.token.refreshAccessToken(refresh_token).then (t) ->
        libs.cache.setHeader res
        res.json
          access_token: t.access_token
          token_type: "Bearer"
          expires_in: t.getExpiresIn()
      , next
    else
      next new Err "grant_type 错误", 400



exports.tokenRevoke = (req, res, next) ->
  { token_type_hint, token } = req.body
  switch token_type_hint
    when "access_token"
      models.token.revokeAccessToken(token).then ->
        res.sendStatus 200
      , next
    when "refresh_token"
      models.token.revokeRefreshToken(token).then ->
        res.sendStatus 200
      , next
    else
      next new Err "错误的请求, revoke token failed", 400




