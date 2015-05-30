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
        logger.warn "err", error
      else
        logger.error "err", error
      res.status(error.status).json
        message: error.message
        _id: error._id
        stack: error.stack if conf.debug


process.on "unhandledRejection", (reason) ->
  # logger.error "unhandledRejection", reason
  throw reason

process.on "uncaughtException", (e) ->
  logger.error "uncaughtException", e
  process.exit(1)
