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

#### 返回充值记录明细,等待支付宝确认

```js
{
  "__v": 0,
  "modifiedAt": "2015-08-26T10:00:40.234Z",
  "createdAt": "2015-08-26T10:00:40.234Z",
  "user": "55d30af82d861f987b5bd86d",
  "amount": 10,
  "amountXinwei": 10,
  "_id": "55dd8e4871bf38ae72b14c9e",
  "isPaid": false,
  "name": {
    "zh": "在线充值",
    "en": "Online Recharge"
  },
  "isPlus": true
}
```
