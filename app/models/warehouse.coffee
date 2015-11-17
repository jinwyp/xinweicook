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

    validationId : (_id) ->
      unless libs.validator.isLength _id, 24, 24
        return throw new Err "Field validation error,  warehouse ID length must be 24-24", 400, Err.code.order.warehouseIdWrong

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

      return nearest


    correctDistanceForCaohejing1Warehouse : (resultBaidu, userAddress) ->
      #漕河泾仓库使用直线距离
      for placeBaidu, placeBaiduIndex in resultBaidu
        if placeBaidu.name is "caohejing1"

          origin =
            lat : placeBaidu.lat
            lng : placeBaidu.lng

          destination =
            lat : userAddress.geoLatitude
            lng : userAddress.geoLongitude

          placeBaidu.distance.value = models.warehouse.getDistanceFromTwoPoint(origin, destination)
          placeBaidu.distance.text = (parseInt(models.warehouse.getDistanceFromTwoPoint(origin, destination) / 100) / 10) + "公里"

      return resultBaidu


    # 计算两点直线距离 https://github.com/googollee/eviltransform
    getDistanceFromTwoPoint: (origin, destination) ->
      earthR = 6371000;
      x = Math.cos(origin.lat * Math.PI / 180) * Math.cos(destination.lat * Math.PI / 180) * Math.cos((origin.lng - destination.lng) * Math.PI / 180);
      y = Math.sin(origin.lat * Math.PI / 180) * Math.sin(destination.lat * Math.PI / 180);
      s = x + y;

      if s > 1
        s = 1;

      if s < -1
        s = -1;

      alpha = Math.acos(s);

      return alpha * earthR

  methods: {}
  rest:{}