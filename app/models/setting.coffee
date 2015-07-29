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
    expiredDate: type: Date
    isExpired : type: Boolean, default:false

  statics:
    checkNotFound : (setting) ->
      if not setting
        return throw new Err "Setting not found or Setting Expired !", 400

    checkExpired : (setting) ->
      if moment(new Date(setting.expiredDate)).isBefore(moment())
        setting.isExpired = true
        setting.save()
        true
      else
        false

  methods: {}
  rest: {}
