# 仓库地址

module.exports =
  schema:

    name : type:String

    displayName :zh:String, en:String # 显示名称

    locationGeoLatitude: Number # 纬度
    locationGeoLongitude: Number # 经度

    address :type:String
    deliveryRange : Number # 米

    sortId : Number # 排序
    isActivated : type: Boolean, default: false


  statics:
    constantRemark : () ->
      type =
        userOrder : "userOrder"

    find99 : (options) ->
      @find(options).sort("-sortId").sort("-createdAt").execAsync()


    getNearestWarehouse : (distanceArray, warehouseListObj) ->
      nearest =
        warehouseName : ''
        warehouseDistance : 0

      for placeBaidu, placeBaiduIndex in distanceArray
        console.log("送货: ", placeBaidu)

        if placeBaidu.distance.value < warehouseListObj[placeBaidu.name].deliveryRange

          if nearest.warehouseDistance is 0 or nearest.warehouseDistance > placeBaidu.distance.value
            nearest.warehouseDistance = placeBaidu.distance.value
            nearest.warehouseName = placeBaidu.name

      nearest

  methods: {}
  rest:{}