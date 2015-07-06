## Req

POST `/orders/payment/weixinpay/mobile`


| Name             | Type     | Desc                              |
|:-----------------|:---------|:----------------------------------|
| out_trade_no     | String   | 订单号orderNumber                  |






```js
{
  "out_trade_no": "201507021144282581219"
}
```


## Res
### Body

返回给微信支付服务器 success

[相关文档 支付结果通用通知](https://pay.weixin.qq.com/wiki/doc/api/app.php?chapter=9_7&index=3)