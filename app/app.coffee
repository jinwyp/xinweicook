require "./env"
alipay = require "./libs/alipay.js"
bodyParser = require "body-parser"

cors = require "cors"
favicon = require "serve-favicon";
compression = require "compression"

methodOverride = require "method-override"

app = express()

app.use libs.req._id
app.enable "trust proxy"
app.disable "x-powered-by"

app.set "views", path.join(__dirname, "views")
app.set "view engine", "ejs"
app.engine("ejs", require('ejs').renderFile);
app.engine("html", require('ejs').renderFile);
app.engine("jade", require('jade').__express);

app.use cors()

app.use compression(filter: (req, res) ->
  # nginx 中没有对js做gzip压缩
  res.getHeader("Content-Type") is "application/javascript"
)

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use express.static(path.join(__dirname, "public"))
app.use "/api/doc", express.static(path.join(__dirname, "..", "doc", "_book"))

app.use alipay.middleware if not conf.debug
app.use bodyParser.json({limit: '1mb'})
app.use bodyParser.urlencoded({ extended: true})
app.use methodOverride("X-HTTP-Method-Override")

app.use libs.logger.middleware()

app.use libs.lang.middleware

# app.use libs.cache.lastModified

app.use models.Router

require("./routesmobile")(app)
require("./routesapi")(app)

require("./test")() if conf.debug

app.use (req, res, next) ->
  next new Err l("Page Not Found"), 404

app.use libs.err.middleware()

app.listen conf.port, ->
  logger.debug "app" ,"listening on #{conf.host}:#{conf.port}"

