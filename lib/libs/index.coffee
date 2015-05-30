requireDir = (opts, callback)->
  { exclude, dirname, extname } = opts
  extname = extname or ".coffee"
  for file in fs.readdirSync(dirname)
    basename = path.basename file, extname
    if path.extname(file) is extname and file not in exclude
      pathname = path.join dirname, basename
      if _.isFunction callback
        callback basename, pathname
      else
        base = require pathname

requireOthers = exports.requireOthers = (filename, callback)->
  dirname = path.dirname filename
  filename = path.basename filename
  extname = path.extname filename
  exclude = [filename]
  requireDir
    dirname: dirname
    exclude: exclude
    extname: extname
  , callback

requireOthers __filename, (basename, pathname) ->
  exports[basename] = require(pathname)
