# 库存变化记录

module.exports =
  schema:
    user :type: Schema.ObjectId, ref: "user" # 快递员
    order :[type: Schema.ObjectId, ref: "order"]

    geoLatitude: Number # 纬度
    geoLongitude: Number # 经度
    distanceFrom : Number   # 距离新味办公室发货 单位米 3公里还是4公里 快递不一样
    timeLeft : String   # 距离新味办公室到达时间
    speed : Number  # 速度

  statics:
    constantRemark : () ->
      type =
        userOrder : "userOrder"
        adminOperation : "adminOperation"

    validationTrace : (body) ->
      unless libs.validator.isFloat body.geoLatitude
        return throw new Err "Field validation error,  geoLatitude must be isFloat", 400
      unless libs.validator.isFloat body.geoLongitude
        return throw new Err "Field validation error,  geoLongitude must be isFloat", 400


  methods: {}
  rest:{}