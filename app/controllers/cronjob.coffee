CronJob = require("cron").CronJob;




exports.runCronJob = (req, res, next) ->

  models.cronjob.findAsync({isActivated: true}).then (cronJobList) ->

    if cronJobList and cronJobList.length > 0

      for job, jobIndex in cronJobList

        if job.type is models.cronjob.constantCronJobType().addInventory and job.dishList.length > 0

          newCronJob =
            cronTime : "01 30 07 * * 0-6"
            onTick : ()->
              for dish, dishIndex in job.dishList
                models.dish.findOneAsync({_id:dish.dishId}).then (resultDish) ->
                  if resultDish
                    logger.warn "---------- Dish Add Inventory: ", resultDish._id, resultDish.title.zh, dish.quantity
                    # 55b1b25612e798ef1214701a 为 13564568301 管理员ID
                    resultDish.addStock(dish.quantity, "56332187594b09af6e6c7dd2", {_id:"55b1b25612e798ef1214701a"}, "cronjob").then (resultDish) ->
                      job.logList.push({isExecuted : true, message : resultDish[0].title.zh + " / Added quantity:" + dish.quantity + " / Now stock:" + resultDish[0].stock})
                      job.saveAsync()

                .catch (err)->
                  job.logList.push({isExecuted : false, message : err})
                  job.saveAsync()
                  logger.error "Cron Job Dish Add Inventory Error: ", err

            onComplete : () ->
              logger.warn "---------- CronJobFinished: ", job.name
            start : false
            timeZone : "Asia/Shanghai"

          newCronJob.cronTime = "01 * * * * 0-6" if conf.debug

          runningJob = new CronJob(newCronJob)
          runningJob.start() if process.env.NODE_ENV is "production"
  .catch next








exports.getNoOrderUserLast7DayTest = (req, res, next) ->
  logger.error("Cron Test Every Wednesday 10 o'clock send iOS push notification: " )
  res.send("ok")




exports.getNoOrderUserLast7Day = (req, res, next) ->
  # 当周还未下单的但有优惠券 每周三上午10点推送
  # 一周时间没下单

  timeNow = moment()
  today = moment().startOf('day')
  last3Day = today.clone().subtract(3, 'days');
  last7Day = today.clone().subtract(7, 'days');
  last15Day = today.clone().subtract(15, 'days');

#  console.log(timeNow.format("YYYY-MM-DD HH:mm:ss"))
#  console.log(today.format("YYYY-MM-DD HH:mm:ss"))

  sendUserIdList = []

  models.user.find({lastOrderDate : {$lt:last3Day} })
  .populate({path: 'couponList'})
  .execAsync()
  .then (resultUserList) ->

    if resultUserList.length > 0
      for user, userIndex in resultUserList

        if user.couponList and user.couponList.length > 0
          isSendMessage = false
          for coupon, couponIndex in user.couponList
            isSendMessage = true if coupon.isUsed is false

          if isSendMessage
            sendUserIdList.push(user._id.toString())


    models.user.findAsync({lastOrderDate : {$lt:last7Day} }).then (resultUserList) ->

      if resultUserList.length > 0
        for user, userIndex in resultUserList
          if sendUserIdList.indexOf(user._id.toString()) is -1
            sendUserIdList.push(user._id.toString())


#      console.log(sendUserIdList)
      for sendUser, sendUserIndex in sendUserIdList
        # 发送iOS 推送
        additionalContent = {userId : sendUser}
        pushOptions = {isPushMobile : true}

        models.message.sendMessageToUser(sendUser, models.message.constantContentType().cronjob, additionalContent, pushOptions)

      logger.error("Cron Every Wednesday 10 o'clock send iOS push notification: ", JSON.stringify(sendUserIdList) )
      res.send("ok")
    .catch next

  .catch next






# 取消没有支付的订单
exports.cancelNotPaidOrder = (req, res, next) ->

  timeNow = moment();
  timeCancel = timeNow.clone().subtract(1, 'hours');
#  timeCancel = timeNow.clone();


  models.order.find({ status : models.order.constantStatus().notpaid, cookingType :  models.dish.constantCookingType().eat, createdAt : { "$lt": timeCancel.toDate() } } )
  .sort("-createdAt").populate("childOrderList").execAsync().then (resultOrderList) ->

    if resultOrderList.length > 0

      for order, orderIndex in resultOrderList

        order.status = models.order.constantStatus().canceled

        if order.csComment
          order.csComment = order.csComment + " System canceled."
        else
          order.csComment = "System canceled."

        order.saveAsync()


        # 同时撤销优惠券优惠码新味币
        if order.childOrderList.length > 0
          for childOrder in order.childOrderList
            childOrder.status = models.order.constantStatus().canceled
            childOrder.saveAsync()

        # 撤销优惠码使用
        if order.promotionCode
          models.coupon.revokeUsed(order.promotionCode, order.user.toString())

        # 撤销优惠券使用
        if order.coupon
          models.coupon.revokeUsed(order.coupon, order.user.toString())

        # 撤销余额使用
        if order.accountUsedDiscount and order.accountUsedDiscount > 0

          models.useraccount.findOneAsync({user : order.user.toString()}).then (resultAccount)->
            if resultAccount
              resultAccount.addMoney(order.accountUsedDiscount, {zh : "订单取消返还",en : "Order cancel return"}, "订单取消系统返还", order._id.toString()).catch( (err) -> logger.error("cronjob refund account error:", order._id, order.accountUsedDiscount, JSON.stringify(resultAccount)))


    res.send resultOrderList

  .catch(next)




# 员工福利每月充值300新味币 每次充150元 每月分两次充值
exports.chargeAccountForEmployee = (req, res, next) ->

  userList = []
  userNewAccountIdist = []

  promiseAccountList = []
  promiseCreateAccountList = []

  # 李凯  王宇鹏  汤圣罡  岳可诚
  models.user.find({mobile:{$in:["18629641521", "13564568304", "18621870070", "15900719671"]}}).execAsync().then (resultUserList) ->
    userList = resultUserList

    models.user.find({group:'cs'}).execAsync()
  .then (resultUserList2) ->
    userList = userList.concat(resultUserList2)

    # 如果没有新味币账户需要先创建新味币账户
    for user, userIndex in userList
      promiseAccountList.push(models.useraccount.findOneAsync({user : user._id.toString()}))

    Promise.all(promiseAccountList)
  .then (resultAccountList)->
    for account, accountIndex in resultAccountList

      console.log(userList[accountIndex]._id)
      if account
        if account.balance < 50
          account.balance = account.balance + 150
          account.saveAsync()
          account.chargeAccountDetail(150, {zh : "员工福利", en : "Employee Benefit"}, "员工福利每月300元", models.accountdetail.constantChargeType().employeebenefit)
      else
        promiseCreateAccountList.push(models.useraccount.createAsync({user:userList[accountIndex]._id.toString(), balance:150}))

    Promise.all(promiseCreateAccountList)

  .then (resultCreateAccountList)->
    console.log(resultCreateAccountList)

    for account2, account2Index in resultCreateAccountList
      account2.chargeAccountDetail(150, {zh : "员工福利", en : "Employee Benefit"}, "员工福利每月300元", models.accountdetail.constantChargeType().employeebenefit)


    res.send userList
  .catch(next)
