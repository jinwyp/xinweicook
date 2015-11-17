crypto = require "crypto"

module.exports =
  hmacMd5Hash: (req, res, next) ->
    hmac = crypto.createHmac('md5', key)
    req.on "data", (data) ->
      hmac.update data
    req.on "end", ->
      req._hash = hmac.digest('hex')
      next()
    req.on "error", (err) ->
      next(err)
  _id: (req, res, next) ->
    req._id = (new ObjectId).toString()
    next()
