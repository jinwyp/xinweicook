winston = require "winston"
require("winston-mongodb").MongoDB
expressWinston = require "express-winston"
pe = require "prettify-error"

module.exports =
  logger: ->
    logger = new (winston.Logger)(
      transports: [
        new (winston.transports.Console)(
          level: conf.level.console
          handleExceptions: true
          colorize: true
          prettyPrint: true
          debugStdout: true
        )
        new (winston.transports.MongoDB)(
          level: conf.level.db
          handleExceptions: true
          db: conf.db
          collection: "logs"
          includeIds: true
          handleExceptions: true
        )
      ]
      exitOnError: false
    )
    # logger.emitErrs = false
    logger.on "error", (e)->
      console.error e
    logger.on "logging", (transport, level, msg, meta) ->
      if _.isString meta.stack
        console.error pe meta
      if level is "error"
        libs.talk.alert msg, meta
    logger
  middleware: ->
    expressWinston.requestWhitelist.push "body"
    expressWinston.requestWhitelist.push "params"
    expressWinston.requestWhitelist.push "_id"
    # expressWinston.responseWhitelist.push "body"
    expressWinston.logger winstonInstance: logger, level: conf.level.express, statusLevels: true
