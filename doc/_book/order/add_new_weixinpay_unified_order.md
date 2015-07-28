## Req

POST `/orders/payment/weixinpay/unifiedorder`

Group `member`


| Name             | Type     | Desc                              |
|:-----------------|:---------|:----------------------------------|
| _id              | String   | 订单ID 24位ID 5590d256103f46d9ac31e3ee   |
| device_info      | String   | 用于微信支付 非必填 终端设备号(门店号或收银设备ID)，注意：PC网页或公众号内支付请传"WEB"                         |
| spbill_create_ip | String   | 用于微信支付 APP和网页支付提交用户端ip，Native支付填调用微信支付API的机器IP。                        |
| trade_type       | String   | 用于微信支付 取值如下：JSAPI，NATIVE，APP，WAP,详细说明见参数规定                          |
| openid           | String   | 用于微信支付 非必填 trade_type=JSAPI时，此参数必传，用户在商户appid下的唯一标识。下单前需要调用【网页授权获取用户信息】接口获取到用户的Openid                       |



```js
{
    "_id" : "5590d256103f46d9ac31e3ee",

    "device_info" : "weixinpay",
    "spbill_create_ip" : "192.168.1.1",
    "trade_type" : "NATIVE",
    "openid" : false

}
```


## Res
### Body




[Orders](../Order)