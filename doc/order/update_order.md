## Req

PUT `/orders/:_id`

Group `member`


| Name             | Type     | Desc                              |
|:-----------------|:---------|:----------------------------------|
| isPaymentPaid    | Boolean  | 订单是否支付  true 或 false          |
| status           | String   | 订单取消 canceled         |




```js

{
  "isPaymentPaid": "true",
}

{
  "isPaymentPaid": "false",
  "status": "canceled"
}
```


## Res
### Body




[Orders](../Order)