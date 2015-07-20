module.exports = Secure =
  reqSecure: (req) ->
#    if req.secure or conf.debug
    if true
      req
    else
      throw new Err "请使用加密连接", 426
  reqHeaders: (req) ->

    if req.method isnt "GET"

      if req.get("content-type")?.toLowerCase() is "application/json" and req.get("accept")?.toLowerCase() is "application/vnd.cook.v1+json"
        req
      else
        throw new Err "Headers 错误", 412
    else
      if req.get("accept")?.toLowerCase() is "application/vnd.cook.v1+json"
        req
      else
        throw new Err "Headers 错误", 412


  middleware: (req, res, next) ->
    Promise.resolve(req).then(Secure.reqSecure).then(Secure.reqHeaders).then(->
      next()
    , next)
