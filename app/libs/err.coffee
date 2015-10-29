prettify = require "prettify-error"
errcode = require "./errcode"

module.exports =
  Err: ->
    Err = (message="错误的请求", status=400, validationStatus=1000) ->
      Error.call @
      Error.captureStackTrace @, arguments.callee
      @message = message
      @status = status
      @validationStatus = validationStatus
    Err::__proto__ = Error.prototype
    Err.code = errcode
    Err

  middleware: ->
    (err, req, res, next) ->

      error =
        message: err.message or err.msg or err.errmsg or "服务器内部错误"
        stack: err.stack or ""
        status: err.status or 500
        validationStatus: err.validationStatus or 1000
        _id: req._id
        req:
          url : req.url
          method: req.method
          header: req.headers
          body: req.body
          query: req.query
          params: req.params
          user : ""

      error.req.user = req.u._id if req.u

      tempError = prettify(error)
      if not tempError
        tempError = error

      if error.status < 500
        if error.status isnt 401 and error.status isnt 200 and req.url isnt "/api/user/sms"
          logger.warn("4XX Error: ", tempError, error.req)
      else
        logger.error("5XX Error: ", tempError, error.req)

      res.status(error.status).json
        message: error.message
        _id: error._id
        stack: error.stack if conf.debug
        validationStatus: error.validationStatus





process.on "unhandledRejection", (reason) ->
   logger.error "5XX UnhandledRejection: ", reason
#  throw reason

process.on "uncaughtException", (err) ->
  logger.error "5XX UncaughtException: ", err
  process.exit(1)
