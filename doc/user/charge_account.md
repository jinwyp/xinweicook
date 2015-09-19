## 充值计算
+ 充350 新味币 花费 300 人民币
+ 充600 新味币 花费 500 人民币
+ 充1250 新味币 花费 1000 人民币
+ 充2600 新味币 花费 2000 人民币

## Req

POST `/api/user/account/details`

### Body

| Name       | Type   | Desc     |
|:-------    |:-------|:-------  |
| addAmount  | Number | 充值金额  |
| remark     | String | 备注     |
| payment    | String | 支付方式 alipay direct / weixinpay  默认不传为alipay direct  |
| device_info      | String   | 用于微信支付 非必填 终端设备号(门店号或收银设备ID)，注意：PC网页或公众号内支付请传"WEB"                         |
| spbill_create_ip | String   | 用于微信支付 非必填 APP和网页支付提交用户端ip，Native支付填调用微信支付API的机器IP。                        |
| trade_type       | String   | 用于微信支付 必填 取值如下：JSAPI，NATIVE，APP，WAP,详细说明见参数规定                          |
| url              | String   | 用于微信支付 JSAPI时  生成签名  其实不需要该字段                          |
| openid           | String   | 用于微信支付 非必填 trade_type=JSAPI时，此参数必传，用户在商户appid下的唯一标识。下单前需要调用【网页授权获取用户信息】接口获取到用户的Openid                       |



```js
{
  "addAmount": 10,
  "remark": "remark",
  "payment" : "weixinpay"
}
```

## Res
### Body

#### 返回充值记录明细,等待支付宝确认, 注意: 支付宝和微信支付返回的不同

```js
{
  "__v": 0,
  "modifiedAt": "2015-09-19T08:39:10.927Z",
  "createdAt": "2015-09-19T08:39:10.927Z",
  "chargeType": "alipaydirect",
  "user": "55fbec8f8d74d94ed9a54df0",
  "amount": 200,
  "amountXinwei": 200,
  "remark": "备注",
  "_id": "55fd1f2e4ee681712205d754",
  "isPaid": false,
  "name": {
    "zh": "在线充值",
    "en": "Online Recharge"
  },
  "isPlus": true,
  "aliPaySign": {
    "service": "alipay.wap.create.direct.pay.by.user",
    "partner": "2088111042213083",
    "_input_charset": "utf-8",
    "sign_type": "MD5",
    "notify_url": "http://m.xinweicook.com/api/orders/payment/alipay/notify/account",
    "return_url": "http://m.xinweicook.com/mobile/alipay/returnaccountdetail",
    "out_trade_no": "55fd1f2e4ee681712205d754",
    "subject": "在线充值",
    "total_fee": 200,
    "seller_id": "2088111042213083",
    "payment_type": "1",
    "sign": "5edd5145d7510d0fce6a7873717ac946",
    "fullurl": "https://mapi.alipay.com/gateway.do?service=alipay.wap.create.direct.pay.by.user&partner=2088111042213083&_input_charset=utf-8&sign_type=MD5&notify_url=http%3A%2F%2Fm.xinweicook.com%2Fapi%2Forders%2Fpayment%2Falipay%2Fnotify%2Faccount&return_url=http%3A%2F%2Fm.xinweicook.com%2Fmobile%2Falipay%2Freturnaccountdetail&out_trade_no=55fd1f2e4ee681712205d754&subject=%E5%9C%A8%E7%BA%BF%E5%85%85%E5%80%BC&total_fee=200&seller_id=2088111042213083&payment_type=1&sign=5edd5145d7510d0fce6a7873717ac946"
  },
  
   "weixinPayUnifiedOrder": {
      "__v": 0,
      "modifiedAt": "2015-09-19T10:01:46.196Z",
      "createdAt": "2015-09-19T10:01:46.196Z",
      "user": "55fbec8f8d74d94ed9a54df0",
      "accountDetail": "55fd328981930509370d2802",
      "businessType": "accountdetail",
      "orderNumber": "55fd328981930509370d2802",
      "totalPrice": 200,
      "orderTitle": "在线充值",
      "wxPay_unified_return_return_code": "SUCCESS",
      "wxPay_unified_return_return_msg": "OK",
      "wxPay_unified_return_result_code": "SUCCESS",
      "wxPay_unified_return_nonce_str": "OcBNWI3QaePtDVBK",
      "wxPay_unified_return_sign": "D1F0F6D901C4AD0CD0B6AAEE88C71454",
      "wxPay_unified_return_trade_type": "JSAPI",
      "wxPay_unified_return_prepay_id": "wx2015091918014545566222190661780519",
      "_id": "55fd328a81930509370d2803",
      "wxPay_nativeSign": {
        "appId": "wxc31508f4ded1402b",
        "partnerId": "1260182401",
        "prepayId": "wx2015091918014545566222190661780519",
        "packageValue": "Sign=WXPay",
        "timeStamp": "1442656906",
        "nonceStr": "5PIK7HeTaINzebJH",
        "sign": "48914D04C123F6B12A4E6B8C833D426D"
      },
      "wxPay_mobileSign": {
        "appId": "wx37a1323e488cef84",
        "timeStamp": "1442656906",
        "nonceStr": "TUxJCKVtF9IuxxfG",
        "package": "prepay_id=wx2015091918014545566222190661780519",
        "signType": "MD5",
        "paySign": "45A7EE749D198B4902048119EC88A334"
      }
    }
}





```




