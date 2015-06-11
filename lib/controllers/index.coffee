Router  = express.Router()

module.exports = (app) ->
  libs.requireOthers __filename, (basename, pathname) ->
    app.use "/api", require(pathname)(Router)

