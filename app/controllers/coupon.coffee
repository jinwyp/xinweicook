# 美食趣闻
XLSX = require('xlsx');
couponData = require('./coupondata1.js');


exports.couponList = (req, res, next) ->
  models.coupon.findAsync {}
  .then (coupons) ->
    res.json coupons
  , next



exports.couponSingleInfo = (req, res, next) ->
  models.coupon.validationCouponId req.params._id

  models.coupon.find1({_id: req.params._id, isExpired : false, isUsed : false}).then (resultCoupon) ->
    models.coupon.checkNotFound resultCoupon
    models.coupon.checkExpired resultCoupon
    models.coupon.checkUsed(resultCoupon, req.u)

    res.json resultCoupon
  .catch(next)


exports.couponSingleInfoByCode = (req, res, next) ->
  models.coupon.validationCouponCode req.params.code

  models.coupon.find1({code: req.params.code, isExpired : false, isUsed : false}).then (resultCoupon) ->
    models.coupon.checkNotFound resultCoupon
    models.coupon.checkExpired resultCoupon
    models.coupon.checkUsed(resultCoupon, req.u)

    res.json resultCoupon
  .catch(next)








# 用户分享朋友圈获得优惠券
exports.getCouponForUserShare = (req, res, next) ->

  if not req.u.isSharedInvitationSendCode

    newCoupon =
      name :
        zh : "分享朋友圈优惠券"
        en : "Share To Friends Coupon"
      price : 5
      couponType : "coupon"
      usedTime : 1
      user : req.u._id.toString()

    Promise.all([models.coupon.addNew(newCoupon), models.coupon.addNew(newCoupon)])
    .then (resultCouponList)->
      for coupon, couponIndex in resultCouponList
        req.u.couponList.push(coupon._id.toString())

      req.u.isSharedInvitationSendCode = true
      req.u.saveAsync()

    .then (user)->
      models.user.find1({_id : req.u._id})
    .then (resultUser)->
        res.json resultUser

    .catch next
  else
    next(new Err "Already shared", 400)



# 用户使用朋友的推荐码获得优惠券
exports.getCouponForUserInvitationSendCode = (req, res, next) ->

  models.user.validationInvitationSendCode(req.params.invitationCode)

  if not req.u.isUsedInvitationSendCode
    # 用户不能自己邀请自己
    models.user.findOneAsync({invitationSendCode:req.params.invitationCode, _id:{$ne:req.u._id.toString()}} )
    .then (resultUser)->
      models.user.checkNotFound(resultUser)

      req.u.invitationFromCode = resultUser.invitationSendCode
      req.u.invitationFromUser = resultUser._id.toString()

      newCoupon =
        name :
          zh : "好友邀请优惠券"
          en : "Friend Invitation Coupon"
        price : 10
        couponType : "coupon"
        usedTime : 1
        user : req.u._id.toString()

      models.coupon.addNew(newCoupon)

    .then (resultCouponList)->
      req.u.couponList.push(resultCouponList._id.toString())

      req.u.isUsedInvitationSendCode = true
      req.u.saveAsync()

    .then (user)->
      models.user.find1({_id : req.u._id})
    .then (resultUser)->
      res.json resultUser
    .catch next
  else
    next(new Err "Already used invitation code", 400)
















exports.addNewCoupon = (req, res, next) ->

  models.coupon.validationNewCoupon req.body

  models.coupon.addNew req.body
  .then (resultCoupon) ->
    res.json resultCoupon
  .catch next



exports.assignCouponToUser = (req, res, next) ->

  dataUser = {}
  models.user.findOne ({_id : req.body.userId })
    .then (resultUser) ->
      models.user.checkNotFound (resultUser)
      dataUser = resultUser
      models.coupon.findOne ({_id : req.body.couponId, isUsed:false, isExpired:false })
    .then (resultCoupon) ->
      models.coupon.checkNotFound resultCoupon

      if dataUser.couponList.indexOf(resultCoupon._id) > -1
        throw new Err "user already have this coupon", 400
      if resultCoupon.user
        throw new Err "coupon already belong to other user", 400

      dataUser.couponList.push resultCoupon._id
      dataUser.saveAsync()
      resultCoupon.user = dataUser._id.toString()
      resultCoupon.saveAsync()
    .spread (resultCoupon2, numberAffected) ->
      res.json resultCoupon2
    .catch next









exports.verifyCoupon150000 = (req, res, next) ->
#  result = couponData.indexOf("XWTNIFXWC71")
  result = couponData["XWTNIFXWC7"]
  if couponData["XWTNIFXWC71"]
    result = true
  else
    result = false
  res.send result


exports.addNewCoupon150000 = (req, res, next) ->

  genCouponCode = (length = 4) ->
    chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    str = ""
    for i in [1..4]
      str += chars[Math.floor(Math.random() * chars.length)];
    str = "XW" + str + "XWC"
    str

  genCouponCodeLast = (code)->
    chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    str2 = ""
    total = 0
    for j in [0..8]
      total = total + chars.indexOf(code[j])

    # 身份证校验位 Y: 0 1 2 3 4 5 6 7 8 9 10 校验码: 1 0 X 9 8 7 6 5 4 3 2
    verifyCode = ["1", "0", "X", "9", "8", "7",  "6", "5", "4", "3", "2"]

    str2 = code + verifyCode[total%11]


  generateSheetFromArray = (worksheet, arrayData)->
    totalRow = arrayData.length - 1;

    range = {s: {c:0, r:0}, e: {c:10, r:200000 }}

    # 写入内容
    for row in [0..totalRow]

      cell = {v: arrayData[row], t:"s" }
      cell.t = "s";
      cell_ref = XLSX.utils.encode_cell({c:0,r:row})

      worksheet[cell_ref] = cell;

    worksheet['!ref'] = XLSX.utils.encode_range(range);

    return worksheet



  result = []
  for i in [1..1000]
    tempStr = genCouponCode()

    result.push(genCouponCodeLast(tempStr))

  workbook = XLSX.readFile(path.join(__dirname, '../../app/public/admin/src/excel/empty.xlsx'));

  first_sheet_name = workbook.SheetNames[0];
  first_worksheet = workbook.Sheets[first_sheet_name];

  newSheet = generateSheetFromArray(first_worksheet, result);
  workbook.Sheets[first_sheet_name] = newSheet;

#  csv = XLSX.utils.sheet_to_csv(newSheet);

#  XLSX.writeFile(workbook, path.join(__dirname, '../../app/public/admin/src/excel/outputcoupon.xlsx'), {bookSST:false, bookType:"xlsx"});


  res.json result
#  models.coupon.addNew req.body
#  .then (resultCoupon) ->
#      res.json resultCoupon
#  .catch next