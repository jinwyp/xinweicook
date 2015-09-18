# 支付明细变化记录

module.exports =
  schema:
    user :type: Schema.ObjectId, ref: "user"
    order :type: Schema.ObjectId, ref: "order"
    businessType : type: String # 业务类型 订单order  或 新味币accountdetail


    wxPay_unified_return_return_code: String  # 下面是微信支付统一订单成功返回字段 https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=9_1
    wxPay_unified_return_return_msg : String

    wxPay_unified_return_appid : String
    wxPay_unified_return_mch_id: String
    wxPay_unified_return_device_info: String
    wxPay_unified_return_nonce_str: String  # 微信返回的随机字符串
    wxPay_unified_return_sign: String
    wxPay_unified_return_result_code: String

    wxPay_unified_return_err_code: String
    wxPay_unified_return_err_code_des: String

    wxPay_unified_return_trade_type: String # 调用接口提交的交易类型，取值如下：JSAPI，NATIVE，APP，详细说明见参数规定
    wxPay_unified_return_prepay_id: String  # 微信生成的预支付回话标识，用于后续接口调用中使用，该值有效期为2小时
    wxPay_unified_return_code_url: String  # trade_type为NATIVE是有返回，可将该参数值生成二维码展示出来进行扫码支付




    wxPay_notify_return_return_code : type: String  # 下面是微信支付成功通知返回字段 https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=9_7
    wxPay_notify_return_return_msg : type: String

    wxPay_notify_return_appid : type: String
    wxPay_notify_return_mch_id : type: String
    wxPay_notify_return_device_info : type: String
    wxPay_notify_return_nonce_str : type: String
    wxPay_notify_return_sign : type: String
    wxPay_notify_return_result_code : type: String

    wxPay_notify_return_err_code : type: String
    wxPay_notify_return_err_code_des : type: String

    wxPay_notify_return_openid : type: String
    wxPay_notify_return_is_subscribe : type: String

    wxPay_notify_return_trade_type : type: String
    wxPay_notify_return_bank_type : type: String
    wxPay_notify_return_total_fee : type: Number #总金额
    wxPay_notify_return_fee_type : type: String
    wxPay_notify_return_cash_fee : type: Number # 现金支付金额
    wxPay_notify_return_cash_fee_type : type: String # 现金支付货币类型
    wxPay_notify_return_coupon_fee : type: Number
    wxPay_notify_return_coupon_count : type: Number #代金券或立减优惠使用数量

    wxPay_notify_return_out_trade_no : type: String
    wxPay_notify_return_attach : type: String
    wxPay_notify_return_transaction_id : type: String
    wxPay_notify_return_time_end : type: String



  statics:{}

  methods: {}
  rest: {}

