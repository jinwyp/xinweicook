# 用户收货地址

module.exports =
  schema:
    user :type: Schema.ObjectId, ref: "user" # 绑定用户ID

    geoLongitude: Number # 经度
    geoLatitude: Number # 纬度
    coordType : String  # 坐标类型，可选参数，默认为bd09ll。允许的值为：bd09ll（百度经纬度坐标）、bd09mc（百度摩卡托坐标）、gcj02（国测局加密坐标）、wgs84（gps设备获取的坐标）。

    distanceFrom : Number   # 距离新味办公室发货 单位米
    warehouse :type: Schema.ObjectId, ref: "warehouse"


    country : String
    province: String
    city: String
    district: String
    street : String
    street_number : String  # 百度Map 返回的街道号
    address: String

    contactPerson: String
    mobile: String

    isDefault: type: Boolean, default: false
    isValid: type: Boolean, default: false # 客服验证过true, 上述信息改变false
    sortOrder : type: Number, default: 0

    isAvailableForEat: type: Boolean, default: false

  statics:

    constantCoordType : () ->
      type = ["bd09ll", "gcj02"]


    checkNotFound : (address) ->
      if not address
        throw new Err "Address not found !", 400, Err.code.user.addressNotFound

    validationId : (_id) ->
      unless libs.validator.isLength _id, 24, 24
        return throw new Err "Field validation error,  address _id length must be 24-24", 400, Err.code.user.addressIdWrong

    validationSingle : (address) ->

      unless libs.validator.isFloat address.geoLatitude
        return throw new Err "Field validation error,  geoLatitude must be isFloat", 400, Err.code.user.addressLatitudeWrong
      unless libs.validator.isFloat address.geoLongitude
        return throw new Err "Field validation error,  geoLongitude must be isFloat", 400, Err.code.user.addressLongitudeWrong

      if address.coordType
        coordType = ["bd09ll", "gcj02"]
        if coordType.indexOf(address.coordType) is -1
          return throw new Err "Field validation error,  coordType value wrong", 400, Err.code.user.addressCoordTypeWrong

      unless libs.validator.isLength address.province, 2, 200
        return throw new Err "Field validation error,  province must be 2-200", 400, Err.code.user.addressProvinceWrong
      unless libs.validator.isLength address.city, 2, 200
        return throw new Err "Field validation error,  city must be 2-200", 400, Err.code.user.addressCityWrong
      unless libs.validator.isLength address.district, 2, 200
        return throw new Err "Field validation error,  district must be 2-200", 400, Err.code.user.addressDistrictWrong
      unless libs.validator.isLength address.street, 2, 200
        return throw new Err "Field validation error,  street must be 2-200", 400, Err.code.user.addressStreetWrong
      unless libs.validator.isLength address.street_number, 2, 200
        return throw new Err "Field validation error,  street_number must be 2-200", 400, Err.code.user.addressStreetNumberWrong
      unless libs.validator.isLength address.address, 2, 1000
        return throw new Err "Field validation error,  detail address must be 2-1000", 400, Err.code.user.addressAddressWrong

      unless libs.validator.isLength address.contactPerson, 2, 99
        return throw new Err "Field validation error,  contactPerson must be 2-99", 400, Err.code.user.addressContactPersonWrong
      unless libs.validator.isMobilePhone(address.mobile, 'zh-CN')
        return throw new Err "Field validation error,  mobileNumber must be zh_CN mobile number", 400, Err.code.user.addressMobileWrong

      unless libs.validator.isFloat address.sortOrder
        return throw new Err "Field validation error,  sortOrder must be isFloat", 400, Err.code.user.addressSortOrderWrong




    # 坐标转化 https://github.com/JackZhouCn/JZLocationConverter/

    gcj02ToBd09: (location) ->
      y = location.lat;
      x = location.lng;

      z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * Math.PI)
      theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * Math.PI)

      result =
        lng: z * Math.cos(theta) + 0.0065
        lat: z * Math.sin(theta) + 0.006

      return result



    bd09ToGcj02: (location) ->
      y = location.lat - 0.006;
      x = location.lng - 0.0065;
      z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * Math.PI);
      theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * Math.PI);

      result =
        lng: z * Math.cos(theta)
        lat: z * Math.sin(theta)

      return result






  methods: {}
  rest:{}