require "./env"
alipay = require "./libs/alipay.js"
bodyParser = require "body-parser"
cookieParser = require "cookie-parser"

cors = require "cors"
favicon = require "serve-favicon"
compression = require "compression"
userAgentDevice = require('express-device')

manifestRev = require('./libs/manifest.js');
nunjucks = require "nunjucks"
i18n = require "i18n"

morgan = require('morgan')
methodOverride = require "method-override"

app = express()

app.use libs.req._id
app.enable "trust proxy"
app.disable "x-powered-by"

viewDirs = [path.join(__dirname, "views")]
if process.env.NODE_ENV == 'development' then viewDirs.push(path.join(__dirname, "public"))
app.set("views", viewDirs)


app.set("view engine", "ejs")

app.engine("ejs", require('ejs').renderFile);
app.engine("nunj", nunjucks.render);
app.engine("html", require('ejs').renderFile);


app.use(manifestRev({
  manifest: 'app/public/mobile/dist2/rev-manifest.json',
  prependProduction: 'dist2'
  prepend: 'src'
  debug : (if process.env.NODE_ENV is 'production' or process.env.NODE_ENV is 'production2' then false else true)
}));


envnunjucks = nunjucks.configure({
#  watch: process.env.NODE_ENV == 'development' # caused 100% used of cpu.
  noCache: process.env.NODE_ENV == 'development'
});
envnunjucks.addFilter('img', (src, width, height) ->
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
app.use cookieParser()
app.use bodyParser.json({limit: '1mb'})
app.use bodyParser.urlencoded({ extended: true})
app.use methodOverride("X-HTTP-Method-Override")
app.use(userAgentDevice.capture());

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
  #locals的东西是给模版中用的, 线上的没有前缀,由nginx自动转到相应路径
  res.locals.pcPrefix = (if app.get('env') is "production" then "" else conf.pcPrefix)
  res.locals.__DEV__ = app.get('env') != 'production';
  next()


require("./routesmobile")(app)
require("./routespc")(app)
require("./routesapi")(app)



app.use (req, res, next) ->
  next(new Err("Page Not Found", 404)) unless require("./routespc").pageNotFound(req, res)


app.use libs.err.middleware()

app.listen conf.port, ->
  logger.debug ("App listening on #{conf.host}:#{conf.port}")

