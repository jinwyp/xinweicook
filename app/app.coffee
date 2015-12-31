require "./env"
alipay = require "./libs/alipay.js"
bodyParser = require "body-parser"

cors = require "cors"
favicon = require "serve-favicon";
compression = require "compression"
nunjucks = require "nunjucks"
i18n = require "i18n"

morgan = require('morgan')
methodOverride = require "method-override"

app = express()

app.use libs.req._id
app.enable "trust proxy"
app.disable "x-powered-by"

viewsPath = (if process.env.NODE_ENV is "production" or process.env.PREVIEW is "true" then "views" else "public")
app.set "views", path.join(__dirname, viewsPath)
app.set "view engine", "ejs"

app.engine("ejs", require('ejs').renderFile);
app.engine("nunj", nunjucks.render);
app.engine("html", require('ejs').renderFile);
app.engine("jade", require('jade').__express);

env = nunjucks.configure({
#  watch: process.env.NODE_ENV == 'development' # caused 100% used of cpu.
  noCache: process.env.NODE_ENV == 'development'
});
env.addFilter('img', (src, width, height) ->
  width = width || 640
  height = height || 427
  return src + '?imageView2/1/w/' + width + '/h/' + height
)

# i18n setup
i18n.configure({
  locales: ['zh', 'en'],
  defaultLocale: 'zh',
  cookie: 'lang',
  updateFiles: false,
  directory: __dirname + '/locales'
});

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

#app.use libs.logger.middleware() if conf.debug
app.use(morgan('dev'))

#morgan('combined', {
#  skip: function (req, res) { return res.statusCode < 400 }
#})

app.use libs.cache.lastModified

app.use models.Router

# i18n setup
app.use(i18n.init);
app.use (req, res, next)->
  #todo: 到底要不要这个东西,要的话是不是放到conf.coffee中更合适
  res.locals.pcPrefix = conf.pcPrefix
  res.locals.__DEV__ = app.get('env') != 'production';
  next()

require("./routesmobile")(app)
require("./routespc")(app)
require("./routesapi")(app)

require("./test")() if conf.debug

app.use (req, res, next) ->
  next new Err("Page Not Found", 404)


app.use libs.err.middleware()

app.listen conf.port, ->
  logger.debug ("App listening on #{conf.host}:#{conf.port}")

