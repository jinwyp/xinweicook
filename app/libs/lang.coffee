#detectLocale = require "locale-detector"
#
#module.exports = Lang =
#  read: (req)->
#    lang = detectLocale(req.get("accept-language"), ["zh-cn", "en"]) or "zh-cn"
#    lang
#  update: (req, lang)->
#    if lang in ["zh-cn", "zh-CN"]
#      lang = "zh-CN"
#    else
#      lang = "en-US"
#    req.lang = lang
#  middleware: (req, res, next) ->
#      lang = Lang.read req
#      Lang.update req, lang
#      next()


