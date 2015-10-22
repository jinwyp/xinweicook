# 用户收货地址

module.exports =
  schema:
    user :type: Schema.ObjectId, ref: "user" # 绑定用户ID

    geoLatitude: Number # 纬度
    geoLongitude: Number # 经度

    distanceFrom : Number   # 距离新味办公室发货 单位米 3公里还是4公里 快递不一样

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


  statics:
    constantRemark : () ->
      type =
        userOrder : "userOrder"
        adminOperation : "adminOperation"

    validationSingle : (address) ->

      unless libs.validator.isFloat address.geoLatitude
        return throw new Err "Field validation error,  geoLatitude must be isFloat", 400
      unless libs.validator.isFloat address.geoLongitude
        return throw new Err "Field validation error,  geoLongitude must be isFloat", 400

      unless libs.validator.isLength address.province, 2, 200
        return throw new Err "Field validation error,  province must be 2-200", 400
      unless libs.validator.isLength address.city, 2, 200
        return throw new Err "Field validation error,  city must be 2-200", 400
      unless libs.validator.isLength address.district, 2, 200
        return throw new Err "Field validation error,  district must be 2-200", 400
      unless libs.validator.isLength address.street, 2, 200
        return throw new Err "Field validation error,  district must be 2-200", 400
      unless libs.validator.isLength address.street_number, 2, 200
        return throw new Err "Field validation error,  district must be 2-200", 400
      unless libs.validator.isLength address.address, 2, 1000
        return throw new Err "Field validation error,  detail address must be 2-1000", 400

      unless libs.validator.isLength address.contactPerson, 2, 99
        return throw new Err "Field validation error,  contactPerson must be 2-99", 400
      unless libs.validator.isMobilePhone(address.mobile, 'zh-CN')
        return throw new Err "Field validation error,  mobileNumber must be zh_CN mobile number", 400

  methods: {}
  rest:{}