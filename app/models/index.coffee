erm = require "express-restify-mongoose"
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
  autoIncrement.initialize dbConnection
connect()

connection.on "open", ->
  logger.debug "Database", "connection opened"


connection.on "error", (err) ->
  logger.warn "Database", err
  errs.push err
  mongoose.disconnect()
connection.on "disconnected", ->
  logger.warn "Database", "disconnnected"
  if errs.length >= 5
    logger.error "Database", errs.pop()
    errs = []
  else
    setTimeout () ->
      connect()
    , 2 ** errs.length * 1000

exports.isConnected = mongoose.Connection.STATES.connected is mongoose.connection.readyState

erm.defaults
  prefix: "/api/admin"
  version: ""
  lean: true
  findOneAndUpdate: false
  onError: (err, req, res, next) ->
    next err
  middleware: libs.auth("member")
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
  { schema, statics, methods, rest, plugin } = require pathname
  schema = new Schema schema
  plugin schema if plugin
  schema.plugin createdModifiedPlugin, {mongoose: mongoose}
  schema.statics = _.assign schema.statics, statics
  schema.methods = _.assign schema.methods, methods
  # schema.set "toObject", { getters: true }
  # schema.set "toJSON", { getters: true }
  model = mongoose.model basename, schema
  exports[basename] = model
  erm.serve Router, model, rest if rest
