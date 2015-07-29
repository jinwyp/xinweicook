prettify = require "prettify-error"

module.exports =
  Err: ->
    Err = (message="错误的请求", status=400) ->
      Error.call @
      Error.captureStackTrace @, arguments.callee
      @message = message
      @status = status
    Err::__proto__ = Error.prototype
    Err
  middleware: ->
    (err, req, res, next) ->
      error =
        message: err.message or "服务器内部错误"
        stack: err.stack
        status: err.status or 500
        _id: req._id
      if error.status < 500
        if error.status isnt 401 and error.status isnt 200
          logger.warn "4XX Error: ", prettify error
      else
        logger.error "5XX Error: ", prettify error

      res.status(error.status).json
        message: error.message
        _id: error._id
        stack: error.stack if conf.debug


process.on "unhandledRejection", (reason) ->
   logger.error "5XX UnhandledRejection: ", reason
#  throw reason

process.on "uncaughtException", (err) ->
  logger.error "5XX UncaughtException: ", err
  process.exit(1)
