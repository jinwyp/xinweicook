Redis = require "ioredis"

module.exports = ->
  errs = []
  i = chance.integer min: 0, max: conf.redis.length-1
  { host, port } = conf.redis[i]
  logger.debug "redis", "will connect #{host}:#{port}"
  redis = new Redis host:host,port:port,lazyConnect:true
  connect = ->
    redis.connect()
  connect()
  redis.on "ready", (e)->
    logger.debug "redis", "ready"
  redis.on "error", (e)->
    logger.warn "redis", e
    errs.push e
    redis.disconnect()
  redis.on "end", (e)->
    logger.error "redis", "end"
    if errs.length >= 5
      logger.error "redis", errs.pop()
      errs = []
    else
      setTimeout ()->
        connect()
      , 2 ** errs.length * 1000

