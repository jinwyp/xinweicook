# 设置
module.exports =
  schema:
    name: String
    key: String
    value:
      type: String
      set: (value) ->
        JSON.stringify value
      get: (value) ->
        JSON.parse value
  statics: {}
  methods: {}
  rest: {}
