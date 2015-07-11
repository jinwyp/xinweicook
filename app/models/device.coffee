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
        return throw new Err "Device Token not found !", 400
    checkFound : (device) ->
      if device
        return throw new Err "Device Token already exist !", 400

    validationNewDevice : (device) ->
      unless libs.validator.isLength device.deviceToken, 30,70
        return throw new Err "Field validation error,  deviceToken must be 30-70", 400
  methods: {}
  rest: {}

