# token
module.exports =
  schema:
    access_token: String
    refresh_token: String
    user: type: Schema.ObjectId, ref: "user"
    userAgent: type: String
    deviceType: type: String

  statics:
    constantDeviceType : () ->
      type =
        desktop : "desktop"
        mobilephone : "phone"
        tablet : "tablet"
        iosapp : "iosapp"

    getAccessTokenFromReqHeaders: (req)->
      req.get("authorization")?.split("Bearer ")[1]
    tokenFound: (t) ->
      if not t
        throw new Err "找不到该 token", 401
      else
        t

    accessTokenNotExpired: (t) ->
      if t.isAccessTokenExpired()
        throw new Err "Access Token 已过期", 401
      else
        t
    findTokenByMobilePwd: (req, mobile, pwd, deviceToken, couponcode) ->
      models.user.findUserByMobilePwd(mobile,pwd)
      .bind(@)
      .then((u)->

        if couponcode
          models.coupon.addCouponFromCouponChargeCode(u, couponcode).catch( (err)->
            logger.error("登录时通过优惠券兑换码创建优惠券失败", JSON.stringify(err))
          )

        if deviceToken?
          models.device.findOneAsync({deviceToken:deviceToken}).then (resultDevice) ->
            if resultDevice
              resultDevice.user = u._id
              resultDevice.saveAsync()

#            else
#              models.device.createAsync({deviceToken:deviceToken, user: u._id})
        @u = u

        newToken =
          user : @u._id
          deviceType : models.token.constantDeviceType().mobilephone
          access_token : Base62.encode(u.autoIncrementId)+":"+libs.crypto.random(24)
          refresh_token : Base62.encode(u.autoIncrementId)+":"+libs.crypto.random(24)

        if req.get("User-Agent")
          newToken.userAgent = req.get("User-Agent")

        if req.get("user-agent") is "Xinwei Cook"
          newToken.deviceType = models.token.constantDeviceType().iosapp
        else
          if req.device.type is models.token.constantDeviceType().desktop
            newToken.deviceType = models.token.constantDeviceType().desktop

          if req.device.type is models.token.constantDeviceType().mobilephone
            newToken.deviceType = models.token.constantDeviceType().mobilephone

          if req.device.type is models.token.constantDeviceType().tablet
            newToken.deviceType = models.token.constantDeviceType().tablet


        @findOneAndUpdateAsync({user:u._id, deviceType:newToken.deviceType}, newToken, {upsert:true, new:true})
      )
    findTokenByAccessToken: (access_token) ->
      @findOne(access_token: access_token).execAsync()
      .then( (resultToken) ->
        models.token.tokenFound(resultToken)
        models.token.accessTokenNotExpired(resultToken)
        models.user.findOne({_id:resultToken.user}).select(models.user.fields()).execAsync()
      )
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
      moment(new Date(@modifiedAt)).add(conf.token.expires_in, "s").isBefore(moment())
    getExpiresIn: ->
      moment(new Date(@modifiedAt)).add(conf.token.expires_in, "s").diff(moment(), "s")
  rest: {}
