util = require "util"

module.exports = Stringify =
  inspect: (obj, showHidden=true, colors=true)->
    util.inspect(obj, showHidden, null, colors)
  console: (obj)->
    JSON.stringify(obj, null, "\t")
  html: (obj) ->
    Stringify.console(obj).replace(/\n/g,"<br/>",).replace(/\t/g,"&nbsp;&nbsp;&nbsp;&nbsp;",)
