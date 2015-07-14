# token
module.exports =
  schema:
    access_token: String
    refresh_token: String
    user: type: Schema.ObjectId, ref: "user"
  statics:
    getAccessTokenFromReqHeaders: (req)->
      req.get("authorization")?.split("Bearer ")[1]
    tokenFound: (t) ->
      t or throw new Err "找不到该 token", 401
    accessTokenNotExpired: (t) ->
      if t.isAccessTokenExpired()
        throw new Err "Access Token 已过期", 401
      else
        t
    findTokenByMobilePwd: (mobile, pwd, deviceToken) ->
      models.user.findUserByMobilePwd(mobile,pwd)
      .bind(@)
      .then((u)->
        models.device.findOneAsync({deviceToken:deviceToken}).then (resultDevice) ->
          if resultDevice
            resultDevice.user = u._id
            resultDevice.saveAsync()
        @u = u
        @findOneAsync(user:u._id)
      ).then((t)->
        t or @createAsync(user:@u._id)
      ).then((t)->
        if conf.token.sso
          t.genAccessToken(@u).genRefreshToken(@u).saveAsync().get(0)
        else
          if t.isAccessTokenExpired()
            t.genAccessToken(@u).saveAsync().get(0)
          else
            t
      )
    findTokenAndUserByAccessToken: (access_token) ->
      @findOne(access_token: access_token).populate("user", models.user.fields()).execAsync()
      .then(@tokenFound).then(@accessTokenNotExpired)
    refreshAccessToken: (refresh_token) ->
      @findOne(refresh_token:refresh_token).populate("user").execAsync().then(@tokenFound)
      .then (t)->
        if t.user
          t.genAccessToken(t.user).saveAsync().get(0)
        else
          throw new Err "找不到对应的用户", 404
    revokeAccessToken: (access_token) ->
      @findOne(access_token:access_token).populate("user").execAsync().then(@tokenFound)
      .then (t)->
        if t.user
          t.genAccessToken(t.user).saveAsync().get(0)
        else
          throw new Err "找不到对应的用户", 404
    revokeRefreshToken: (refresh_token) ->
      @findOne(refresh_token:refresh_token).populate("user").execAsync().then(@tokenFound)
      .then (t)->
        if t.user
          t.genRefreshToken(t.user).saveAsync().get(0)
        else
          throw new Err "找不到对应的用户", 404
  methods:
    genAccessToken: (u)->
      @access_token = Base62.encode(u.autoIncrementId)+":"+libs.crypto.random(24)
      @
    genRefreshToken: (u) ->
      @refresh_token = Base62.encode(u.autoIncrementId)+":"+libs.crypto.random(24)
      @
    isAccessTokenExpired: ->
      console.log "-----", moment(new Date(@modifiedAt)).add(conf.token.expires_in, "s"), moment(), moment(new Date(@modifiedAt)).add(conf.token.expires_in, "s").isBefore(moment())
      moment(new Date(@modifiedAt)).add(conf.token.expires_in, "s").isBefore(moment())
    getExpiresIn: ->
      moment(new Date(@modifiedAt)).add(conf.token.expires_in, "s").diff(moment(), "s")
  rest: {}
