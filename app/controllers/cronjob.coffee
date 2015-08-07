CronJob = require("cron").CronJob;




exports.runCronJob = (req, res, next) ->

  models.cronjob.findAsync({isActivated: true}).then (cronJobList) ->
    for job, jobIndex in cronJobList
      console.log job.name
      runningJob = new CronJob(
        cronTime : "01 * * * * 0-6"
#        cronTime : "01 01 06 * * 0-6"
        onTick : ()->
          console.log "cron"
        onComplete : () ->
          console.log "cron---"
        start : true
        timeZone : "Asia/Shanghai"
      )
  .catch next






