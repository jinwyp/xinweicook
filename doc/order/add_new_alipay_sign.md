## Req

GET `/api/orders/payment/alipay/sign/:_id`

Group `member`


| Name             | Type     | Desc                              |
|:-----------------|:---------|:----------------------------------|
| _id              | String   | 订单ID 24位ID 5590d256103f46d9ac31e3ee   |


####

```js
{
    "_id" : "5590d256103f46d9ac31e3ee"

}
```


## Res
### Body


```js
{
  "service": "alipay.wap.create.direct.pay.by.user",
  "partner": "2088111042213083",
  "_input_charset": "utf-8",
  "sign_type": "MD5",
  "notify_url": "http://m.xinweicook.com/api/orders/payment/alipay/mobile",
  "return_url": "http://m.xinweicook.com/mobile/alipay/return",
  "out_trade_no": "56b19874da94a9ef2788f719",
  "subject": "台南三杯鸡",
  "total_fee": 0.01,
  "seller_id": "2088111042213083",
  "payment_type": "1",
  "sign": "4eab851a2e05df03874e473f9d74b10e",
  "fullurl": "https://mapi.alipay.com/gateway.do?service=alipay.wap.create.direct.pay.by.user&partner=2088111042213083&_input_charset=utf-8&sign_type=MD5&notify_url=http%3A%2F%2Fm.xinweicook.com%2Fapi%2Forders%2Fpayment%2Falipay%2Fmobile&return_url=http%3A%2F%2Fm.xinweicook.com%2Fmobile%2Falipay%2Freturn&out_trade_no=56b19874da94a9ef2788f719&subject=%E5%8F%B0%E5%8D%97%E4%B8%89%E6%9D%AF%E9%B8%A1&total_fee=0.01&seller_id=2088111042213083&payment_type=1&sign=4eab851a2e05df03874e473f9d74b10e"
}
```


[Orders](../Order)