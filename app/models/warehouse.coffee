# 仓库地址

module.exports =
  schema:

    name : type:String

    displayName :zh:String, en:String # 显示名称

    locationGeoLatitude: Number # 纬度
    locationGeoLongitude: Number # 经度


  statics:
    constantRemark : () ->
      type =
        userOrder : "userOrder"


  methods: {}
  rest:{}