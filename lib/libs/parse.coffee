module.exports = Parse =
  json: (str)->
    obj = {}
    try
      obj = JSON.parse(str)
    obj
