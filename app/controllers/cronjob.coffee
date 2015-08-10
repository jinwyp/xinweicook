#CronJob = require("cron").CronJob;
#
#
#
#
#exports.runCronJob = (req, res, next) ->
#
#  models.cronjob.findAsync({isActivated: true}).then (cronJobList) ->
#    for job, jobIndex in cronJobList
#      console.log job.name
#
#      if job
#
#        if job.type is models.cronjob.constantCronJobType().addInventory and job.dishList.length > 0
#
#          runningJob = new CronJob(
#            cronTime : "01 * * * * 0-6"
#    #        cronTime : "01 01 07 * * 0-6"
#            onTick : ()->
#              for dish, dishIndex in job.dishList
#                models.dish.findOneAsync({_id:dish.dishId}).then (resultDish) ->
#                  if resultDish
#                    console.log "---dish", resultDish._id, resultDish.title.zh
#                    resultDish.addStock(dish.quantity, {_id:""})
#            onComplete : () ->
#              console.log "cron---"
#            start : true
#            timeZone : "Asia/Shanghai"
#          )
#  .catch next
#
#




