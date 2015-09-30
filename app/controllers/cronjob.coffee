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
                    resultDish.addStock(dish.quantity, {_id:"55b1b25612e798ef1214701a"}, "cronjob").then (resultDish) ->
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








