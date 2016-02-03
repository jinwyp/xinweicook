restify = require "express-restify-mongoose"
createdModifiedPlugin = require "mongoose-hook-createdmodified"
autoIncrement = require "mongoose-auto-increment"
exports.Router = Router = express.Router()

errs = []

connection = mongoose.connection

connect = () ->
  dbConnection = mongoose.connect conf.db,
    server:
      auto_reconnect: true
      socketOptions:
        keepAlive: 1
        connectTimeoutMS: 5000
#  autoIncrement.initialize dbConnection
connect()

connection.on "open", ->
#  mongoose.connection.db.dropDatabase()
  logger.debug("Database", "connection opened, conneted url:", conf.db)


connection.on "error", (err) ->
  logger.error("Database", JSON.stringify(err))
  errs.push err
  mongoose.disconnect()

connection.on "disconnected", ->
  logger.error("Database", "disconnnected")
  if errs.length >= 5
    logger.error("Database", errs.pop())
    errs = []
  else
    setTimeout () ->
      connect()
    , 2 ** errs.length * 1000

exports.isConnected = mongoose.Connection.STATES.connected is mongoose.connection.readyState

restify.defaults
  prefix: "/api/admin"
  version: ""
  lean: true
  findOneAndUpdate: false
  onError: (err, req, res, next) ->
    next(err)
  preMiddleware: libs.auth("admin")
  # protected: "__v"
  # prereq: (req) ->
  #   true
  # access: (req) ->
  #   "public"# "public" "private" "protected"
  # contextFilter: (model, req, cb) ->
  #   # todo: query.slice('comments', 5)
  #   cb(model)
  # outputFn: (req, res, result) ->
  #   { result, statusCode } = result
  #   res.status(statusCode).send(result)



libs.requireOthers __filename, (basename, pathname) ->
  { schema, statics, methods, rest, virtual, plugin } = require pathname
  schema = new Schema schema
  plugin schema if plugin
  virtual schema if virtual
  schema.plugin createdModifiedPlugin, {mongoose: mongoose}
  schema.statics = _.assign schema.statics, statics
  schema.methods = _.assign schema.methods, methods
  # schema.set "toObject", { getters: true }
  # schema.set "toJSON", { getters: true }
  model = mongoose.model basename, schema
  exports[basename] = model

  if rest.preMiddleware

    tempMiddleware = rest.preMiddleware
    rest.preMiddleware = []
    rest.preMiddleware.push(libs.auth("admin"))
    rest.preMiddleware.push(tempMiddleware)



  restify.serve(Router, model, rest) if rest
