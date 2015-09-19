## Req

POST `/api/orders/payment/weixinpay/notifyaccountdetail`


| Name             | Type     | Desc                              |
|:-----------------|:---------|:----------------------------------|
| out_trade_no     | String   | Account detail id 24位            |





```js
{
  "out_trade_no": "55fd20154a29fd9523602e77"
}
```


## Res
### Body

返回给微信支付服务器 success

[相关文档 支付结果通用通知](https://pay.weixin.qq.com/wiki/doc/api/app.php?chapter=9_7&index=3)