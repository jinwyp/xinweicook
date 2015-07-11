# 评论
module.exports =
  schema:
    ip: String
    deviceId: String
    deviceToken: String
    user: type: Schema.ObjectId, ref: "user"
  statics:
    checkNotFound : (device) ->
      if not device
        return throw new Err "Device ID not found !", 400
    checkFound : (device) ->
      if device
        return throw new Err "Device ID found !", 400

    validationNewDevice : (device) ->
      unless libs.validator.isLength device.deviceToken, 6,50
        return throw new Err "Field validation error,  deviceToken must be 6-50", 400
  methods: {}
  rest: {}
