# 仓库地址
coordtransform = require('coordtransform');


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


    getNearestWarehouseSpecial : (distanceArray, warehouseListObj, address) ->
      nearest =
        warehouseName : ''
        warehouseDistance : 0

      for placeBaidu, placeBaiduIndex in distanceArray
#        console.log("-------- 仓库到用户地址点: ", placeBaidu)

        if placeBaidu.distance.value < warehouseListObj[placeBaidu.name].deliveryRange and placeBaidu.name isnt "lujiazui1"

          if nearest.warehouseDistance is 0 or nearest.warehouseDistance > placeBaidu.distance.value
            nearest.warehouseDistance = placeBaidu.distance.value
            nearest.warehouseName = placeBaidu.name

        else if placeBaidu.name is "lujiazui1"
          # 判断陆家嘴仓库 特例 根据是否在多边形内容判断

          bd09togcj02 = coordtransform.bd09togcj02(address.geoLongitude, address.geoLatitude)
          gcj02towgs84 = coordtransform.gcj02towgs84(bd09togcj02[0], bd09togcj02[1])

          targetPoint =
            lng : gcj02towgs84[0]
            lat : gcj02towgs84[1]

          polygonPointList = require("../../test/initdata/warehouse.js")[2].polygonPointList

          polygonList = []
          for pointOne, pIndex in polygonPointList
            bd09togcj02Temp = coordtransform.bd09togcj02(pointOne.longitude, pointOne.latitude)
            gcj02towgs84Temp = coordtransform.gcj02towgs84(bd09togcj02Temp[0], bd09togcj02Temp[1])

            pointTemp =
              lng : gcj02towgs84Temp[0]
              lat : gcj02towgs84Temp[1]
            polygonList.push(pointTemp)


          isInside = models.warehouse.getPointInPolygon(targetPoint, polygonList)

          if isInside
            nearest.warehouseDistance = placeBaidu.distance.value
            nearest.warehouseName = placeBaidu.name


      nearest


    getNearestWarehouse : (distanceArray, warehouseListObj) ->
      nearest =
        warehouseName : ''
        warehouseDistance : 0

      for placeBaidu, placeBaiduIndex in distanceArray

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


    # 判断点在面内 http://wandergis.github.io/2015/10/15/%E5%88%A4%E6%96%AD%E7%82%B9%E5%9C%A8%E9%9D%A2%E5%86%85/
    getPointInPolygon: (point, polygonPointList) ->
      # ray-casting algorithm based on
      # http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

      x = point.lng
      y = point.lat

      loopLength = polygonPointList.length
      j = polygonPointList.length - 1
      inside = false

      for i in [0...loopLength]

        xi = polygonPointList[i].lng
        yi = polygonPointList[i].lat

        xj = polygonPointList[j].lng
        yj = polygonPointList[j].lat


        intersect = ((yi > y) != (yj > y)) and (x < (xj - xi) * (y - yi) / (yj - yi) + xi)

        if intersect
          inside = !inside

        j = i


      return inside;






  methods: {}
  rest:{}