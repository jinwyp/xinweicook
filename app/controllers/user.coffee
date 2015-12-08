# 用户
qiniu = require "qiniu"

qiniu.conf.ACCESS_KEY = conf.qiniu.access_key;
qiniu.conf.SECRET_KEY = conf.qiniu.secret_key;


WXPay = require "../libs/weixinpay"
AliPay = require "../libs/alipay.js"
Map = require "../libs/baidumap.js"

configAlipay =
  notify_url : "http://m.xinweicook.com/api/orders/payment/alipay/notify/account"
  mobile_return_url : "http://m.xinweicook.com/mobile/alipay/returnaccountdetail"

alipay = AliPay(configAlipay)


configWeiXinPay =
  appid: conf.weixinpay.appid
  mch_id: conf.weixinpay.mch_id
  secret: conf.weixinpay.secret
  key: conf.weixinpay.key
  notify_url : conf.url.base + conf.weixinpay.notify_url

configWeiXinAppPay =
  appid: conf.weixinAppPay.appid
  mch_id: conf.weixinAppPay.mch_id
  secret: conf.weixinAppPay.secret
  key: conf.weixinAppPay.key
  notify_url : conf.url.base + conf.weixinAppPay.notify_url

weixinpay = WXPay(configWeiXinPay)

baiduMap = Map({ak:"hGHhGxXeioV00csas6otDPM0"})

mobileBrowser = require("../libs/detectmobilebrowser.js")




exports.getUploadResponse = (req, res) ->

  infoObject = req.body

  # 数据形如：
  # {"name":"download.png","hash":"FoO0sxxxx9mFVKcVo4D3wUzHpWW","imageInfo":"{\"format\":\"png\",\"width\":200,\"height\":200,\"colorModel\":\"nrgba\"}","fsize":"3908","key":"FoO0slsknA9mFVKcVo4D3wffffWW","ext":".png","bucket":"xxxxxx"}

  # 处理infoObject，加工存储到数据库等。。
  # do_something_to(infoObject)

  # 返回, 之后七牛服务器会返回给浏览器端
  res.json(infoObject)



exports.getUploadQiniuToken = (req, res, next) ->

  bucketName = "userupload"

  putPolicy = new qiniu.rs.PutPolicy( bucketName );

  callbackBodyObj =
    name: '$(fname)'
    hash: '$(etag)'
    imageInfoW: '$(imageInfo.width)'
    imageInfoH: '$(imageInfo.height)'
    size: '$(fsize)'
    bucket: '$(bucket)'

#  callbackUrl = 'www.baidu.com/qiniu-callback'
#  callbackBodyStr = qs.stringify(callbackBodyObj).replace(/\%24/g, '$')

#  putPolicy.callbackUrl = callbackUrl
#  putPolicy.callbackBody = callbackBodyStr
  putPolicy.expires = 3600 * 24 * 2;

  res.send({uptoken : putPolicy.token()})






exports.getWeixinDeveloperJsapiTicket = (req, res, next) ->
# 增加生成微信developerAccessToken备用

  promiseList = []
  promiseList.push(models.setting.findOneAsync({name:"weixinPayJSSdkConfig"}))
  promiseList.push(models.setting.findOneAsync({name:"weixinDeveloperAccessToken"}))

  Promise.all(promiseList).spread( (settingJSSdk, settingAccessToken) ->

    isNeedRefreshJsapiTicket = false

    if not settingJSSdk
      logger.error("Weixin Jsapi ticket not found !" );
      isNeedRefreshJsapiTicket = true
    else
      if models.setting.checkExpired(settingJSSdk)
        logger.error("Weixin Jsapi ticket expired !" );
        isNeedRefreshJsapiTicket = true


    isNeedRefreshAccessToken = false

    if isNeedRefreshJsapiTicket

      if not settingAccessToken
        logger.error("Weixin Jsapi AccessToken not found !" );
        isNeedRefreshAccessToken = true
      else
        if models.setting.checkExpired(settingAccessToken)
          logger.error("Weixin Jsapi AccessToken expired !" );
          isNeedRefreshAccessToken = true


      if isNeedRefreshAccessToken

        weixinpay.getDeveloperAccessTokenAsync().then ( resultAccessToken) ->

          if resultAccessToken.errcode
            throw(resultAccessToken)

          newDeveloperAccessToken =
            name : "weixinDeveloperAccessToken"
            key : "weixinDeveloperAccessToken"
            value : JSON.stringify(resultAccessToken)
            expiredDate : moment().add(60, 'minutes')
            isExpired : false

          models.setting.updateAsync({name: "weixinDeveloperAccessToken"}, newDeveloperAccessToken, {upsert: true}).then (resultSettingUpdated)->
            console.log("Weixin Jsapi Developer AccessToken", resultSettingUpdated) # { ok: 1, nModified: 1, n: 1 }


          # 请求JsapiTicket
          weixinpay.getDeveloperJsapiTicketAsync(resultAccessToken.access_token)
        .then (resultTicket) ->

          if resultTicket.errcode
            throw(resultTicket)

          weixinpayJSSdkConfigSign =
            noncestr: weixinpay.util.generateNonceString()
            timestamp: Math.floor(Date.now()/1000)+""
            jsapi_ticket: resultTicket.ticket
            url: req.body.url

          weixinpayJSSdkConfigSign.signature = weixinpay.signSha1(weixinpayJSSdkConfigSign);

          newInfo1 =
            name : "weixinPayJSSdkConfig"
            key : "weixinPayJSSdkConfig"
            value : JSON.stringify(weixinpayJSSdkConfigSign)
            expiredDate : moment().add(110, 'minutes')
            isExpired : false

          models.setting.updateAsync({name: "weixinPayJSSdkConfig"}, newInfo1, {upsert: true})

          res.json weixinpayJSSdkConfigSign

        .catch( (err) ->
          next(new Err err.errmsg, 400)
        )

      else
#        console.log(settingAccessToken.value)

        # 请求JsapiTicket
        weixinpay.getDeveloperJsapiTicketAsync(settingAccessToken.value.access_token).then  (resultTicket2) ->

          if resultTicket2.errcode
            throw(resultTicket2)

          weixinpayJSSdkConfigSign =
            noncestr: weixinpay.util.generateNonceString()
            timestamp: Math.floor(Date.now()/1000)+""
            jsapi_ticket: resultTicket2.ticket
            url: req.body.url

          weixinpayJSSdkConfigSign.signature = weixinpay.signSha1(weixinpayJSSdkConfigSign);

          newInfo2 =
            name : "weixinPayJSSdkConfig"
            key : "weixinPayJSSdkConfig"
            value : JSON.stringify(weixinpayJSSdkConfigSign)
            expiredDate : moment().add(110, 'minutes')
            isExpired : false

          models.setting.updateAsync({name: "weixinPayJSSdkConfig"}, newInfo2, {upsert: true})

          res.json weixinpayJSSdkConfigSign

        .catch( (err) ->
          next(new Err err.errmsg, 400)
        )


    else
      weixinpayJSSdkConfigSign =
        noncestr: settingJSSdk.value.noncestr
        timestamp: Math.floor(Date.now()/1000)+""
        jsapi_ticket: settingJSSdk.value.jsapi_ticket
        url: req.body.url

      weixinpayJSSdkConfigSign.signature = weixinpay.signSha1(weixinpayJSSdkConfigSign)

      settingJSSdk.value = weixinpayJSSdkConfigSign
      settingJSSdk.saveAsync()

      res.json weixinpayJSSdkConfigSign

  )
  .catch next









exports.getWeixinUserInfo = (req, res, next) ->

  userId = req.query.userId
  models.user.validationUserId(userId)

  models.user.findOneAsync({"_id": userId}).then (resultUser) ->

    models.user.checkNotFound(resultUser)

    if not resultUser.weixinId or not resultUser.weixinId.openid
      throw new Err "Field validation error,  User weixin openid not found", 400


    models.setting.findOneAsync({name:"weixinDeveloperAccessToken"}).then (resultSetting) ->

      isNeedRefreshAccessToken = false

      if not resultSetting
        isNeedRefreshAccessToken = true
        logger.error("Weixin getUserInfo AccessToken not found !" );
      else
        if models.setting.checkExpired(resultSetting)
          isNeedRefreshAccessToken = true
          logger.error("Weixin getUserInfo AccessToken expired !" );


      if isNeedRefreshAccessToken
        weixinpay.getDeveloperAccessTokenAsync().then (resultAccessToken) ->

          if resultAccessToken.errcode
            throw(resultAccessToken)

          newDeveloperAccessToken =
            name : "weixinDeveloperAccessToken"
            key : "weixinDeveloperAccessToken"
            value : JSON.stringify(resultAccessToken)
            expiredDate : moment().add(60, 'minutes')
            isExpired : false

          models.setting.updateAsync({name: "weixinDeveloperAccessToken"}, newDeveloperAccessToken, {upsert: true}).then (resultSettingUpdated)->
            console.log("Weixin getUserInfo Developer AccessToken", resultSettingUpdated) # { ok: 1, nModified: 1, n: 1 }


          userInfo =
            access_token : resultAccessToken.access_token
            openid : resultUser.weixinId.openid

          weixinpay.getUserInfoAsync(userInfo)

        .then (resultWeixinUserInfo) ->

          if resultWeixinUserInfo.errcode
            throw(resultWeixinUserInfo)

          resultUser.weixinId.subscribe = resultWeixinUserInfo.subscribe
          resultUser.weixinId.nickname = resultWeixinUserInfo.nickname
          resultUser.weixinId.sex = resultWeixinUserInfo.sex
          resultUser.weixinId.language = resultWeixinUserInfo.language
          resultUser.weixinId.city = resultWeixinUserInfo.city
          resultUser.weixinId.province = resultWeixinUserInfo.province
          resultUser.weixinId.country = resultWeixinUserInfo.country
          resultUser.weixinId.headimgurl = resultWeixinUserInfo.headimgurl
          resultUser.weixinId.subscribe_time = resultWeixinUserInfo.subscribe_time
          resultUser.weixinId.remark = resultWeixinUserInfo.remark
          resultUser.weixinId.groupid = resultWeixinUserInfo.groupid

          resultUser.save()
          res.json(resultWeixinUserInfo)

        .catch( (err) ->
          next(new Err err.errmsg, 400)
        )

      else
        logger.error("Weixin getUserInfo AccessToken is exist and not expired !" );
        userInfo =
          access_token : resultSetting.value.access_token
          openid : resultUser.weixinId.openid

        weixinpay.getUserInfoAsync(userInfo).then (resultWeixinUserInfo) ->

          if resultWeixinUserInfo.errcode
            throw(resultWeixinUserInfo)

          resultUser.weixinId.subscribe = resultWeixinUserInfo.subscribe
          resultUser.weixinId.nickname = resultWeixinUserInfo.nickname
          resultUser.weixinId.sex = resultWeixinUserInfo.sex
          resultUser.weixinId.language = resultWeixinUserInfo.language
          resultUser.weixinId.city = resultWeixinUserInfo.city
          resultUser.weixinId.province = resultWeixinUserInfo.province
          resultUser.weixinId.country = resultWeixinUserInfo.country
          resultUser.weixinId.headimgurl = resultWeixinUserInfo.headimgurl
          resultUser.weixinId.subscribe_time = resultWeixinUserInfo.subscribe_time
          resultUser.weixinId.remark = resultWeixinUserInfo.remark
          resultUser.weixinId.groupid = resultWeixinUserInfo.groupid

          resultUser.save()
          res.json(resultWeixinUserInfo)

        .catch( (err) ->
          next(new Err err.errmsg, 400)
        )


  .catch(next)









exports.getWeixinUserOauthCode = (req, res, next) ->
  userId = req.query.userId
  redirectUrl = req.query.redirectUrl

  unless libs.validator.isLength userId, 24, 24
    return res.redirect("/mobile/wxpay/errorpage" + encodeURIComponent("Weixin Oauth, Field validation error,  user _id length must be 24-24") + encodeURIComponent(userId) )

  models.user.findOneAsync({"_id": userId}).then (resultUser) ->
    if resultUser

      if resultUser.weixinId and resultUser.weixinId.openid
        return res.redirect("/mobile/" + redirectUrl)
      else
        return res.redirect(weixinpay.getUserOauthUrl("http://m.xinweicook.com/api/user/weixin/openid?redirectUrl="+redirectUrl, resultUser._id.toString()))
    else
      return res.redirect("/mobile/wxpay/errorpage" + encodeURIComponent("Weixin Oauth, cannot found this userId"))

  .catch (err)->
    return res.redirect("/mobile/wxpay/errorpage" + encodeURIComponent("Weixin Oauth, Found user 500 Error") + encodeURIComponent(JSON.stringify(err)) )









exports.getWeixinUserOpenId = (req, res, next) ->

  code = req.query.code
  state = req.query.state
  redirectUrl = req.query.redirectUrl

  unless libs.validator.isLength state, 24, 24
    return res.redirect("/mobile/wxpay/errorpage" + encodeURIComponent("Weixin OpenId, Field validation error,  user _id length must be 24-24") + encodeURIComponent(state) )

  if not code or code.length is 0
    logger.error("----- User OpenID Oauth Code Return Url: " + JSON.stringify(req.url) + " ----- " + JSON.stringify(req.query) )
    return res.redirect("/mobile/wxpay/errorpage" + encodeURIComponent("Weixin OpenId, Field validation error, Code Error") + encodeURIComponent(JSON.stringify(req.query)) )


  models.user.findOneAsync({"_id": state}).then (resultUser) ->
    if resultUser

      if resultUser.weixinId and resultUser.weixinId.openid
        return res.redirect("/mobile/" + redirectUrl)

      else

        weixinpay.getUserOpenId(code, (err, result) ->

          if err
            return res.redirect("/mobile/wxpay/errorpage" + encodeURIComponent("Weixin OpenId, Request access_token 500 Error") + encodeURIComponent(JSON.stringify(err)) )

          if not result.errcode
            resultUser.weixinId.access_token = result.access_token
            resultUser.weixinId.openid = result.openid
            resultUser.weixinId.refresh_token = result.refresh_token

            resultUser.saveAsync().then (resultUser2) ->
              return res.redirect("/mobile/" + redirectUrl)
            .catch (err)->
              logger.error("User OpenID Failed Save User error:", JSON.stringify(err))

          else
            logger.error("User OpenID weixin error:", JSON.stringify(result))

            # 给开发着发送Open短信
            models.sms.sendSMSToDev("UserOpenID错误")

            return res.redirect("/mobile/wxpay/errorpage" + encodeURIComponent("Weixin OpenId, Request access_token 400 Error errcode found") + encodeURIComponent(JSON.stringify(result)) )
        )

    else
      return res.redirect("/mobile/wxpay/errorpage" + encodeURIComponent("Weixin OpenId, Error, can not found user"))

  .catch (err)->
    return res.redirect("/mobile/wxpay/errorpage" + encodeURIComponent("Weixin OpenId, Found user 500 Error") + encodeURIComponent(JSON.stringify(err)) )














exports.userSignUp = (req, res, next) ->
  # 注册
  { mobile, pwd, code, couponcode, referrer } = req.body

#  logger.error("---- Regisration couponcode", JSON.stringify(req.body))

  models.user.validationMobile(mobile)
  models.user.validationPassword(pwd)

  if referrer
    models.user.validationReferrer(referrer)


  models.sms.verifyCode("signUp", mobile, code).then (smscode) ->

    if smscode[1] isnt 1
      throw new Err "验证码保存失败", 400

    models.user.findOneAsync(mobile: mobile)

  .then (resultUser) ->
    models.user.checkFound(resultUser)

    if not resultUser
      logger.error("new user signUp:", mobile, code, pwd, couponcode)

      newUser =
        mobile : mobile
        pwd    : pwd

      newUser.referrer if referrer

      ua = req.get("user-agent")
      re = /MicroMessenger/

      if ua is "Xinwei Cook" and req.get("iOSAppVersion")
        newUser.statisticsClientFrom = models.order.constantClientFrom().ios
      else if re.test(ua)
        newUser.statisticsClientFrom = models.order.constantClientFrom().wechat
      else if mobileBrowser(req)
        newUser.statisticsClientFrom = models.order.constantClientFrom().mobileweb
      else
        newUser.statisticsClientFrom = models.order.constantClientFrom().website

      models.user.createAsync(newUser)

  .then (resultUserCreated)->

    models.coupon.addCouponForNewUser(resultUserCreated, req).then (resultUser2) ->
      if couponcode
        models.coupon.addCouponFromCouponChargeCode(resultUser2[0], couponcode).catch( (err) -> logger.error("注册时扫二维码创建优惠券失败: " + JSON.stringify(err) ) )


    models.token.findTokenByMobilePwd(mobile, pwd)
  .then (t) ->
    libs.cache.setHeader res

    res.json
      access_token: t.access_token
      refresh_token: t.refresh_token
      token_type: "Bearer"
      expires_in: t.getExpiresIn()

  .catch(next)





exports.resetPassword = (req, res, next) ->
  # 重置密码
  { mobile, pwd, code } = req.body

  models.user.validationMobile(mobile)
  models.user.validationPassword(pwd)

  models.user.resetPwd(mobile, pwd, code).then ->
    res.json code: ''
  .catch next




















# 统一接口 user 信息只在最后返回时 做populate
exports.userInfo = (req, res, next) ->

  models.user.find1({_id : req.u._id}).then (resultUser)->

    # 生成用户自己往外发的邀请码
    if not resultUser.invitationSendCode
      tempcode = []
      tempcode.push(libs.crypto.gencode())
      tempcode.push(libs.crypto.gencode())
      tempcode.push(libs.crypto.gencode())
      tempcode.push(libs.crypto.gencode())
      tempcode.push(libs.crypto.gencode())

      tempcode.push(libs.crypto.gencode())
      tempcode.push(libs.crypto.gencode())
      tempcode.push(libs.crypto.gencode())
      tempcode.push(libs.crypto.gencode())
      tempcode.push(libs.crypto.gencode())

      promiseList = [
        models.user.findOneAsync({invitationSendCode : tempcode[0]}),
        models.user.findOneAsync({invitationSendCode : tempcode[1]}),
        models.user.findOneAsync({invitationSendCode : tempcode[2]}),
        models.user.findOneAsync({invitationSendCode : tempcode[3]}),
        models.user.findOneAsync({invitationSendCode : tempcode[4]}),
        models.user.findOneAsync({invitationSendCode : tempcode[5]}),
        models.user.findOneAsync({invitationSendCode : tempcode[6]}),
        models.user.findOneAsync({invitationSendCode : tempcode[7]}),
        models.user.findOneAsync({invitationSendCode : tempcode[8]}),
        models.user.findOneAsync({invitationSendCode : tempcode[9]})
      ]
      Promise.all(promiseList).then (resultUserList)->

        for user, userIndex in resultUserList
          if not user
            resultUser.invitationSendCode = tempcode[userIndex]

        resultUser.saveAsync()
        res.json resultUser
    else

      models.user.find99({invitationFromUser : req.u._id}).then (resultUserList)->

        tempResult = resultUser.toObject()
        tempResult.invitationUserList = resultUserList
        res.json tempResult

  .catch next







# 修改用户信息
exports.updateUserInfo = (req, res, next) ->

  models.user.validationUserInfo req.body

  if req.u.address and req.body.address.length > 0

    for address,addressIndex in req.body.address

      if req.u.address.length-1 >= addressIndex

        req.u.address[addressIndex].geoLatitude = address.geoLatitude if address.geoLatitude
        req.u.address[addressIndex].geoLongitude = address.geoLongitude if address.geoLongitude

        req.u.address[addressIndex].country = address.country if address.country
        req.u.address[addressIndex].province = address.province if address.province
        req.u.address[addressIndex].city = address.city if address.city
        req.u.address[addressIndex].district = address.district if address.district
        req.u.address[addressIndex].street = address.street if address.street
        req.u.address[addressIndex].street_number = address.street_number if address.street_number
        req.u.address[addressIndex].address = address.address if address.address

        req.u.address[addressIndex].isDefault = address.isDefault if address.isDefault

        req.u.address[addressIndex].contactPerson = address.contactPerson if address.contactPerson
        req.u.address[addressIndex].mobile = address.mobile if address.mobile
        req.u.address[addressIndex].alias = address.alias if address.alias
        req.u.address[addressIndex].remark = address.alias if address.remark

      else
        req.u.address.push(address)

      req.u.address[addressIndex].sortOrder = addressIndex

    if req.u.address.length > req.body.address.length
      req.u.address.splice(req.body.address.length, req.u.address.length - req.body.address.length);

  else
    req.u.address = req.body.address

  req.u.gender = req.body.gender if req.body.gender
  req.u.fullName = req.body.fullName if req.body.fullName
  req.u.nickname = req.body.nickname if req.body.nickname
  req.u.lang = req.body.language if req.body.language
  req.u.avatarPic = req.body.avatarPic if req.body.avatarPic

  req.u.saveAsync().then (resultUser) ->
    models.user.find1({_id : resultUser[0]._id})
  .then (user) ->
    res.json user
  .catch next









# 修改或加入 购物车商品
exports.updateShoppingCart = (req, res, next) ->

  models.user.validationShoppingCart req.body

  req.u.shoppingCart = req.body.shoppingCart
  req.u.saveAsync().spread (resultUser, numberAffected) ->
    models.user.find1({_id : resultUser._id})
  .then (user) ->
    res.json user
  .catch next







initDataWarehouse = require "../../test/initdata/warehouse.js"

# 获取用户收货地址 (新版接口)
exports.getUserAddress = (req, res, next) ->

  models.useraddress.findAsync({user : req.u._id}).then (resultUserAddressList)->
    # 转换老地址
    if resultUserAddressList.length is 0 and req.u.address.length > 0

      tempAddressList = []
      tempWarehouse = {}

      promiseList = [];


      for address,addressIndex in req.u.address

        tempAddress = {}

        tempAddress.user = req.u._id
        tempAddress.geoLongitude = req.u.address[addressIndex].geoLongitude if req.u.address[addressIndex].geoLongitude
        tempAddress.geoLatitude = req.u.address[addressIndex].geoLatitude if req.u.address[addressIndex].geoLatitude

        tempAddress.country = req.u.address[addressIndex].country if req.u.address[addressIndex].country
        tempAddress.province = req.u.address[addressIndex].province if req.u.address[addressIndex].province
        tempAddress.city = req.u.address[addressIndex].city if req.u.address[addressIndex].city
        tempAddress.district = req.u.address[addressIndex].district if req.u.address[addressIndex].district
        tempAddress.street = req.u.address[addressIndex].street if req.u.address[addressIndex].street
        tempAddress.street_number = req.u.address[addressIndex].street_number if req.u.address[addressIndex].street_number
        tempAddress.address = req.u.address[addressIndex].address if address.address

        tempAddress.contactPerson = req.u.address[addressIndex].contactPerson if req.u.address[addressIndex].contactPerson
        tempAddress.mobile = req.u.address[addressIndex].mobile if req.u.address[addressIndex].mobile

#        tempAddress.isDefault = req.u.address[addressIndex].isDefault if req.u.address[addressIndex].isDefault

        if req.u.address[addressIndex].geoLongitude and req.u.address[addressIndex].geoLatitude

          if req.get("user-agent") isnt "Xinwei Cook"
            tempLocation = models.useraddress.gcj02ToBd09({lng:tempAddress.geoLongitude, lat:tempAddress.geoLatitude })
            tempAddress.geoLongitude = tempLocation.lng
            tempAddress.geoLatitude = tempLocation.lat
          tempAddressList.push(tempAddress)

          baiduMapQuery =
            origins : []
            destinations :
              lat : tempAddress.geoLatitude
              lng : tempAddress.geoLongitude

          for warehouse, warehouseIndex in initDataWarehouse
            tempWarehouse[warehouse._id] = warehouse
            tempWarehouse[warehouse.name] = warehouse

            originPlace =
              lat : warehouse.locationGeoLatitude
              lng : warehouse.locationGeoLongitude
              name : warehouse.name
              deliveryRange : warehouse.deliveryRange

            baiduMapQuery.origins.push(originPlace)

          promiseList.push(baiduMap.getDistanceFromMultiPointAsync(baiduMapQuery))

      Promise.all(promiseList).then (resultBaiduList) ->

        for baidu, baiduIndex in resultBaiduList
          if baidu.status and baidu.status isnt 0
            throw(new Err baidu.message, 400, Err.code.user.addressBaiduMapNotFoundError)

          # 漕河泾仓库使用直线距离
          baidu = models.warehouse.correctDistanceForCaohejing1Warehouse(baidu, tempAddressList[baiduIndex])

          # 判断与哪个仓库最近, 最近的仓库发货
          nearestWarehouse = models.warehouse.getNearestWarehouseSpecial(baidu, tempWarehouse, tempAddressList[baiduIndex])

          if nearestWarehouse.warehouseName and nearestWarehouse.warehouseDistance
            tempAddressList[baiduIndex].distanceFrom = nearestWarehouse.warehouseDistance
            tempAddressList[baiduIndex].warehouse = tempWarehouse[nearestWarehouse.warehouseName]._id.toString()
            tempAddressList[baiduIndex].isAvailableForEat = true

        models.useraddress.createAsync(tempAddressList)
      .then (result)->

        req.u.address = []
        req.u.saveAsync();

        res.json result
      .catch next



    else
      res.json resultUserAddressList

  .catch next





# 新增用户收货地址 (新版接口)
exports.addNewAddress = (req, res, next) ->

  models.useraddress.validationSingle(req.body)


  tempAddress = {}

  tempAddress.user = req.u._id
  tempAddress.geoLongitude = req.body.geoLongitude if req.body.geoLongitude
  tempAddress.geoLatitude = req.body.geoLatitude if req.body.geoLatitude
  tempAddress.coordType = req.body.coordType if req.body.coordType
  tempAddress.distanceFrom = req.body.distanceFrom if req.body.distanceFrom

  if req.body.coordType is "gcj02"
    tempLocation = models.useraddress.gcj02ToBd09({lng:req.body.geoLongitude, lat:req.body.geoLatitude })
    tempAddress.geoLongitude = tempLocation.lng
    tempAddress.geoLatitude = tempLocation.lat


  tempAddress.country = req.body.country if req.body.country
  tempAddress.province = req.body.province if req.body.province
  tempAddress.city = req.body.city if req.body.city
  tempAddress.district = req.body.district if req.body.district
  tempAddress.street = req.body.street if req.body.street
  tempAddress.street_number = req.body.street_number if req.body.street_number
  tempAddress.address = req.body.address if req.body.address

  tempAddress.contactPerson = req.body.contactPerson if req.body.contactPerson
  tempAddress.mobile = req.body.mobile if req.body.mobile

  tempAddress.isDefault = req.body.isDefault if req.body.isDefault
  tempAddress.sortOrder = req.body.sortOrder if req.body.sortOrder


  tempWarehouse = {}

  models.warehouse.find99({}).then (resultWarehouseList) ->

    baiduMapQuery =
      origins : []
      destinations :
        lat : tempAddress.geoLatitude
        lng : tempAddress.geoLongitude


    for warehouse, warehouseIndex in resultWarehouseList
      tempWarehouse[warehouse._id] = warehouse.toObject()
      tempWarehouse[warehouse.name] = warehouse.toObject()

      originPlace =
        lat : warehouse.locationGeoLatitude
        lng : warehouse.locationGeoLongitude
        name : warehouse.name
        deliveryRange : warehouse.deliveryRange

      baiduMapQuery.origins.push(originPlace)

    baiduMap.getDistanceFromMultiPointAsync(baiduMapQuery)

  .then (resultBaidu) ->

    if resultBaidu.status and resultBaidu.status isnt 0
      throw(new Err resultBaidu.message, 400, Err.code.user.addressBaiduMapNotFoundError)



    # 漕河泾仓库使用直线距离
    resultBaidu = models.warehouse.correctDistanceForCaohejing1Warehouse(resultBaidu, tempAddress)


    # 判断与哪个仓库最近, 最近的仓库发货
    nearestWarehouse = models.warehouse.getNearestWarehouseSpecial(resultBaidu, tempWarehouse, tempAddress)

    if nearestWarehouse.warehouseName and nearestWarehouse.warehouseDistance
      tempAddress.distanceFrom = nearestWarehouse.warehouseDistance
      tempAddress.warehouse = tempWarehouse[nearestWarehouse.warehouseName]._id.toString()
      tempAddress.isAvailableForEat = true


    if req.body.isDefault

      models.useraddress.updateAsync({user : req.u._id, isDefault : true}, {$set: {isDefault: false}}, { multi: true } ).then (resultAddress)->

        # console.log(resultAddress); # { ok: 1, nModified: 1, n: 1 }

        models.useraddress.createAsync(tempAddress)

      .then (result)->
        res.json result
      .catch next

    else
      models.useraddress.createAsync(tempAddress).then (result)->

        res.json result

      .catch next

  .catch next







# 编辑用户收货地址 (新版接口)
exports.updateAddress = (req, res, next) ->

  models.useraddress.validationId(req.params._id)
  models.useraddress.validationSingle(req.body)


  models.useraddress.findOneAsync({_id:req.params._id}).then (result)->

    models.useraddress.checkNotFound(result)

    result.geoLongitude = req.body.geoLongitude if req.body.geoLongitude
    result.geoLatitude = req.body.geoLatitude if req.body.geoLatitude
    result.distanceFrom = req.body.distanceFrom if req.body.distanceFrom

    if req.body.coordType or req.body.coordType is ""
      result.coordType = req.body.coordType


    if req.body.coordType is "gcj02"
      tempLocation = models.useraddress.gcj02ToBd09({lng:req.body.geoLongitude, lat:req.body.geoLatitude })
      result.geoLongitude = tempLocation.lng
      result.geoLatitude = tempLocation.lat



    result.country = req.body.country if req.body.country
    result.province = req.body.province if req.body.province
    result.city = req.body.city if req.body.city
    result.district = req.body.district if req.body.district
    result.street = req.body.street if req.body.street
    result.street_number = req.body.street_number if req.body.street_number
    result.address = req.body.address if req.body.address

    result.contactPerson = req.body.contactPerson if req.body.contactPerson
    result.mobile = req.body.mobile if req.body.mobile

    result.isDefault = req.body.isDefault if req.body.isDefault
    result.sortOrder = req.body.sortOrder if req.body.sortOrder



    tempWarehouse = {}

    models.warehouse.find99({}).then (resultWarehouseList) ->

      baiduMapQuery =
        origins : []
        destinations :
          lat : result.geoLatitude
          lng : result.geoLongitude


      for warehouse, warehouseIndex in resultWarehouseList
        tempWarehouse[warehouse._id] = warehouse.toObject()
        tempWarehouse[warehouse.name] = warehouse.toObject()

        originPlace =
          lat : warehouse.locationGeoLatitude
          lng : warehouse.locationGeoLongitude
          name : warehouse.name
          deliveryRange : warehouse.deliveryRange

        baiduMapQuery.origins.push(originPlace)

      baiduMap.getDistanceFromMultiPointAsync(baiduMapQuery)

    .then (resultBaidu) ->

      if resultBaidu.status and resultBaidu.status isnt 0
        throw(new Err resultBaidu.message, 400, Err.code.user.addressBaiduMapNotFoundError)


      # 漕河泾仓库使用直线距离
      resultBaidu = models.warehouse.correctDistanceForCaohejing1Warehouse(resultBaidu, result)


      # 判断与哪个仓库最近, 最近的仓库发货
      nearestWarehouse = models.warehouse.getNearestWarehouseSpecial(resultBaidu, tempWarehouse, result)

      if nearestWarehouse.warehouseName and nearestWarehouse.warehouseDistance
        result.distanceFrom = nearestWarehouse.warehouseDistance
        result.warehouse = tempWarehouse[nearestWarehouse.warehouseName]._id.toString()
        result.isAvailableForEat = true
      else
        result.distanceFrom = 0
        result.isAvailableForEat = false



      if req.body.isDefault
        models.useraddress.updateAsync({user : req.u._id, isDefault : true}, {$set: {isDefault: false}}, { multi: true } ).then (resultAddress)->

          result.saveAsync()
        .then (result)->
          res.json result[0]
        .catch next

      else
        result.saveAsync().then (result)->
          res.json result[0]
        .catch next

    .catch next


  .catch next






# 删除用户收货地址 (新版接口)
exports.deleteAddress = (req, res, next) ->

  models.useraddress.validationId(req.params._id)

  models.useraddress.findOneAndRemoveAsync({_id:req.params._id}).then (result)->

    models.useraddress.checkNotFound(result)

    if result
      res.json result

  .catch next



# 地址关键词搜索
exports.getPlaceSuggestion = (req, res, next) ->

  models.useraddress.validationAddressSuggestion(req.body)

  query =
    query : req.body.query
    region : req.body.region

  addressList = []
  baiduMap.getPlaceSearchAsync(query).then (result)->

    if result.status and result.status isnt 0
      throw(new Err result.message, 400, Err.code.user.addressBaiduMapNotFoundError)
    else
      for place, placeIndex in result

        if place.location
          if place.location.lat and place.location.lng

            newplace =
              street_id : place.street_id
              address : place.name
              addressInfoBaidu : place.address
              lat : place.location.lat
              lng : place.location.lng

            addressList.push(newplace)

    res.json addressList

  .catch(next)










# 获取用户消息通知 iOS
exports.getUserMessages = (req, res, next) ->

  models.message.find({user:req.u._id})
  .sort("-createdAt")
  .execAsync()
  .then (resultMessages) ->
    res.json resultMessages
  .catch next








# 用户账户余额
exports.userInfoAccount = (req, res, next) ->

  models.useraccount.findOneAsync({user : req.u._id}).then (resultAccount)->
    if resultAccount
      resultAccount
    else
      models.useraccount.createAsync({user:req.u._id.toString()})
  .then (resultAccount)->
    res.json resultAccount

  .catch next



# 用户账户余额明细
exports.userAccountDetail = (req, res, next) ->

  models.accountdetail.validationGetAccountDetailList req.query

  models.accountdetail.find({ $or: [
    { user : req.u._id.toString(), isPaid:true, isPlus:true, chargeType: models.accountdetail.constantChargeType().alipaydirect },
    { user : req.u._id.toString(), isPaid:true, isPlus:true, chargeType: models.accountdetail.constantChargeType().weixinpay },
    { user : req.u._id.toString(), isPlus:true, chargeType: models.accountdetail.constantChargeType().chargecode },
    { user : req.u._id.toString(), isPaid:false, isPlus:false }
  ] })
  .sort("-createdAt")
  .skip(req.query.skip)
  .limit(req.query.skip)
  .execAsync()
  .then (resultAccountDetail)->

    res.json resultAccountDetail

  .catch next


# 用户账户余额充值 先生成充值记录明细
exports.chargeAccount = (req, res, next) ->

  models.useraccount.validationChargeAccount(req.body)

  chargeType = models.accountdetail.constantChargeType().alipaydirect

  if req.body.payment and req.body.payment is models.order.constantPayment().weixinpay
    models.order.validationWeixinPayUnifiedOrder req.body
    chargeType = models.accountdetail.constantChargeType().weixinpay

  models.useraccount.findOneAsync({user : req.u._id.toString()}).then (resultAccount)->
    models.useraccount.checkNotFound(resultAccount)

    resultAccount.chargeAccountDetail(req.body.addAmount, {zh : "在线充值", en : "Online Recharge"}, req.body.remark, chargeType)

  .then (resultAccountDetail)->

    if req.body.payment and req.body.payment is models.order.constantPayment().weixinpay
      # 微信支付生成统一订单

      if req.body.trade_type is "APP"
        weixinpay = WXPay(configWeiXinAppPay)

      weixinpayOrder =
        out_trade_no: resultAccountDetail._id.toString()
        total_fee: Math.ceil(resultAccountDetail.amount * 100)
        spbill_create_ip: req.ip  # 终端IP APP和网页支付提交用户端ip，Native支付填调用微信支付API的机器IP。

        notify_url: "http://m.xinweicook.com/mobile/wxpay/notifyaccountdetail"
        trade_type: req.body.trade_type #JSAPI，NATIVE，APP，WAP
#            openid: req.body.openid  #trade_type=JSAPI，此参数必传，用户在商户appid下的唯一标识。下单前需要调用【网页授权获取用户信息】接口获取到用户的Openid
        product_id : resultAccountDetail._id.toString() #trade_type=NATIVE，此参数必传。此id为二维码中包含的商品ID，商户自行定义。

        body:  resultAccountDetail.name.zh
        detail:  resultAccountDetail.name.zh

        attach: resultAccountDetail._id.toString() #附加数据，在查询API和支付通知中原样返回，该字段主要用于商户携带订单的自定义数据
        goods_tag : "", #商品标记，代金券或立减优惠功能的参数，说明详见代金券或立减优惠


      if req.body.trade_type is "JSAPI"
        if req.u.weixinId and req.u.weixinId.openid
          weixinpayOrder.openid = req.u.weixinId.openid
        else
          throw new Err "Field validation error,  need weixin pay user open id for charge account", 400

      if req.u.mobile is "15900719671" or req.u.mobile is "18629641521" or req.u.mobile is "13564568304" or req.u.mobile is "18621870070"  # 内测帐号1分钱下单
        weixinpayOrder.total_fee = 1


      console.log "------------------Weixinpay Unified Order For AccountDetail: ", weixinpayOrder
      weixinpay.createUnifiedOrder weixinpayOrder, (err, resultWeixinPay) ->
        if err
          next (new Err err)

        if resultWeixinPay

          weixinpayMobileSign =
            appId: configWeiXinPay.appid
            timeStamp: parseInt(+new Date() / 1000, 10) + ""
            nonceStr: weixinpay.util.generateNonceString()
            package: "prepay_id="+resultWeixinPay.prepay_id
            signType: "MD5"

          # https://pay.weixin.qq.com/wiki/doc/api/app.php?chapter=8_5
          weixinpayNativeSign =
            appId : configWeiXinAppPay.appid
            partnerId : configWeiXinAppPay.mch_id
            prepayId : resultWeixinPay.prepay_id
            packageValue : 'Sign=WXPay'
            timeStamp: parseInt(+new Date() / 1000, 10) + ""
            nonceStr: weixinpay.util.generateNonceString()

          weixinpayNativeSign.sign = weixinpay.sign(weixinpayNativeSign);
          weixinpayMobileSign.paySign = weixinpay.sign(weixinpayMobileSign);


          newPaymentDetail =
            user : req.u._id
            accountDetail : resultAccountDetail._id
            businessType : models.paymentdetail.constantBusinessType().accountdetail

            orderNumber : resultAccountDetail._id.toString()
            totalPrice : resultAccountDetail.amount
            orderTitle : resultAccountDetail.name.zh

            wxPay_nativeSign: weixinpayNativeSign
            wxPay_mobileSign: weixinpayMobileSign

            wxPay_unified_return_return_code : resultWeixinPay.return_code
            wxPay_unified_return_return_msg : resultWeixinPay.return_msg

            wxPay_unified_return_appid : resultWeixinPay.appid
            wxPay_unified_return_mch_id : resultWeixinPay.mch_id
            wxPay_unified_return_result_code : resultWeixinPay.result_code

            wxPay_unified_return_nonce_str : resultWeixinPay.nonce_str
            wxPay_unified_return_sign : resultWeixinPay.sign
            wxPay_unified_return_trade_type : resultWeixinPay.trade_type
            wxPay_unified_return_prepay_id: resultWeixinPay.prepay_id
            wxPay_unified_return_code_url: resultWeixinPay.code_url

          models.paymentdetail.createAsync(newPaymentDetail).then (resultPaymentDetail) ->

            resultTemp = resultAccountDetail.toJSON()
            resultTemp.weixinPayUnifiedOrder = resultPaymentDetail
            resultTemp.wxPay_nativeSign = weixinpayNativeSign

            res.json resultTemp

          .catch(next)


    else
      # 生成支付宝签名

      subject =
        dish :
          title :
            zh : resultAccountDetail.name.zh
            en : resultAccountDetail.name.en

      alipayOrder =
        totalPrice : resultAccountDetail.amount
        orderNumber : resultAccountDetail._id.toString()
        _id : resultAccountDetail._id
        dishHistory : []

      alipayOrder.dishHistory.push(subject)

      if req.u.mobile is "15900719671" or req.u.mobile is "18629641521" or req.u.mobile is "13564568304" or req.u.mobile is "18621870070"  # 内测帐号1分钱下单
        alipayOrder.totalPrice = 0.01

      aliPaySign = alipay.generateWapCreateDirectPayUrl(alipayOrder)
      resultTemp = resultAccountDetail.toJSON()
      resultTemp.aliPaySign = aliPaySign

      res.json resultTemp



  .catch next





# 用户账户余额充值 支付宝通知回调
exports.chargeAccountAlipayNotify = (req, res, next) ->

  models.useraccount.validationAlipayNotify(req.body)

  if req.body.trade_status is "TRADE_SUCCESS" or req.body.trade_status is "TRADE_FINISHED"
    accountDetailData = {}

    models.accountdetail.findOneAsync({_id : req.body.out_trade_no, isPaid:false, isPlus:true}).then (resultAccountDetail)->

      models.accountdetail.checkNotFound(resultAccountDetail)
      accountDetailData = resultAccountDetail

      resultAccountDetail.isPaid = true
      resultAccountDetail.paymentAlipay =
        notify_time : req.body.notify_time
        notify_type : req.body.notify_type
        notify_id : req.body.notify_id
        sign_type: req.body.sign_type,
        sign: req.body.sign_type,

        out_trade_no : req.body.out_trade_no
        subject : req.body.subject
        payment_type : req.body.payment_type
        trade_no : req.body.trade_no
        trade_status : req.body.trade_status
        price : req.body.price
        total_fee : req.body.total_fee
        quantity : req.body.quantity
        body : req.body.body
        is_total_fee_adjust : req.body.is_total_fee_adjust
        use_coupon : req.body.use_coupon
        gmt_create : req.body.gmt_create
        gmt_payment : req.body.gmt_payment
  #      refund_status : req.body.refund_status
  #      gmt_refund : req.body.gmt_refund
        seller_email : req.body.seller_email
        buyer_email : req.body.buyer_email
        seller_id : req.body.seller_id
        buyer_id : req.body.buyer_id

      resultAccountDetail.saveAsync()
    .then (resultAccoutDetail2) ->

      models.useraccount.findOneAsync({user : resultAccoutDetail2[0].user})
    .then (resultAccount)->
      models.useraccount.checkNotFound(resultAccount)
      resultAccount.balance = resultAccount.balance + accountDetailData.amountXinwei
      resultAccount.saveAsync()

    .then (resultAccount2)->
  #    res.json resultAccount2[0]

      res.set('Content-Type', 'text/plain');
      res.send "success"
    .catch next

  else
    res.set('Content-Type', 'text/plain');
    res.send "success"





# 用户账户余额充值 微信支付通知回调
exports.chargeAccountWeixinPayNotify = (req, res, next) ->
  console.log "======================== WeixinPayNotify :: ", req.body

  models.paymentdetail.validationWeixinPayNotify req.body

  accountDetailData = {}

  models.paymentdetail.findOneAsync({orderNumber : req.body.out_trade_no})
  .then (resultPaymentDetail) ->
    models.paymentdetail.checkNotFound(resultPaymentDetail)

    resultPaymentDetail.wxPay_notify_return_return_code = req.body.return_code
    resultPaymentDetail.wxPay_notify_return_return_msg = req.body.return_msg

    resultPaymentDetail.wxPay_notify_return_appid = req.body.appid
    resultPaymentDetail.wxPay_notify_return_mch_id = req.body.mch_id
    resultPaymentDetail.wxPay_notify_return_sub_mch_id = req.body.sub_mch_id
    resultPaymentDetail.wxPay_notify_return_nonce_str = req.body.nonce_str
    resultPaymentDetail.wxPay_notify_return_sign = req.body.sign
    resultPaymentDetail.wxPay_notify_return_result_code = req.body.result_code

    resultPaymentDetail.wxPay_notify_return_openid = req.body.openid
    resultPaymentDetail.wxPay_notify_return_is_subscribe = req.body.is_subscribe

    resultPaymentDetail.wxPay_notify_return_trade_type = req.body.trade_type
    resultPaymentDetail.wxPay_notify_return_bank_type = req.body.bank_type
    resultPaymentDetail.wxPay_notify_return_total_fee = req.body.total_fee
    resultPaymentDetail.wxPay_notify_return_fee_type = req.body.fee_type
    resultPaymentDetail.wxPay_notify_return_cash_fee = req.body.cash_fee
    resultPaymentDetail.wxPay_notify_return_cash_fee_type = req.body.cash_fee_type
    resultPaymentDetail.wxPay_notify_return_coupon_fee = req.body.coupon_fee
    resultPaymentDetail.wxPay_notify_return_coupon_count = req.body.coupon_count

    resultPaymentDetail.wxPay_notify_return_out_trade_no = req.body.out_trade_no
    resultPaymentDetail.wxPay_notify_return_attach = req.body.attach
    resultPaymentDetail.wxPay_notify_return_transaction_id = req.body.transaction_id
    resultPaymentDetail.wxPay_notify_return_time_end = req.body.time_end


    resultPaymentDetail.saveAsync()
  .then (resultPaymentDetail2) ->

    models.accountdetail.findOneAsync({_id : resultPaymentDetail2[0].orderNumber, isPaid:false, isPlus:true})
  .then (resultAccountDetail)->
    models.accountdetail.checkNotFound(resultAccountDetail)

    accountDetailData = resultAccountDetail
    resultAccountDetail.isPaid = true
    resultAccountDetail.saveAsync()

  .then (resultAccoutDetail2) ->

    models.useraccount.findOneAsync({user : resultAccoutDetail2[0].user})

  .then (resultAccount)->
    models.useraccount.checkNotFound(resultAccount)
    resultAccount.balance = resultAccount.balance + accountDetailData.amountXinwei
    resultAccount.saveAsync()

    weixinpay.responseNotify res, true

  .catch next






# 用户账户 使用充值码充值
exports.chargeAccountFromAccoutChargeCode = (req, res, next) ->

  models.coupon.validationCouponCode(req.body.accountChargeCode)
  couponData = {}
  models.coupon.findOneAsync({code : req.body.accountChargeCode, couponType:models.coupon.constantCouponType().accountchargecode, isExpired : false, isUsed : false})
  .then (resultCoupon)->
    models.coupon.checkNotFound resultCoupon
    models.coupon.checkExpired resultCoupon
    models.coupon.checkUsed(resultCoupon, req.u)
    couponData = resultCoupon

    models.useraccount.findOneAsync({user : req.u._id.toString()})
  .then (resultAccount)->
      models.useraccount.checkNotFound(resultAccount)

      resultAccount.chargeAccountDetailByChargeCode(couponData.price, {zh : "使用充值码充值", en : "Code Recharge"}, req.body.remark, couponData._id.toString())
  .then (resultAccount)->
      couponData.used(req.u)
      res.json resultAccount[0]

  .catch next
