winston = require "winston"
require("winston-mongodb").MongoDB
expressWinston = require "express-winston"


module.exports =
  logger: ->
    logger = new (winston.Logger)(
      transports: [
        new (winston.transports.Console)(
          level: conf.level.console
          silent: false
          handleExceptions: true
          colorize: false
          prettyPrint: false
          debugStdout: true
        )
        new (winston.transports.MongoDB)(
          level: conf.level.db
          handleExceptions: true
          db: conf.db
          collection: "logs"
          storeHost : true
          includeIds: true
          handleExceptions: true
        )
      ]
      exitOnError: false
    )
#    logger.emitErrs = true

    logger.on "error", (e)->
      console.log "------------- winston logger on error :", e

#    logger.on "logging", (transport, level, msg, meta) ->
#      if _.isString meta.stack
#        console.error prettify meta
#      if level is "error"
#        console.log "------------- winston logger on logging :", level, msg, meta
    logger

  middleware: ->
    expressWinston.requestWhitelist.push "body"
    expressWinston.requestWhitelist.push "params"
#    expressWinston.requestWhitelist.push "_id"

    requestLogger = new winston.transports.Console({ json: true, colorize: true, prettyPrint:true, humanReadableUnhandledException:true, debugStdout:true})

    expressWinston.logger({transports: [requestLogger], level: conf.level.db, statusLevels: false, meta: true, expressFormat: true, colorStatus: true})
