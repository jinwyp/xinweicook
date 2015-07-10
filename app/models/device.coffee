# 评论
module.exports =
  schema:
    ip: String
    deviceId: String
    user: type: Schema.ObjectId, ref: "user"
  statics:
    validationNewDevice : (device) ->
      unless libs.validator.isLength device.deviceId, 6,50
        return throw new Err "Field validation error,  deviceId must be 6-50", 400
  methods: {}
  rest: {}

