## Req

POST `/api/orders/payment/weixinpay/config`

Group `member`


| Name             | Type     | Desc                              |
|:-----------------|:---------|:----------------------------------|
| url              | String   | 用户支付所在的页面地址 需要事先给服务器做加密Sign   |


####
微信文档 http://mp.weixin.qq.com/wiki/7/aaa137b55fb2e0456bf8dd9148dd613f.html#.E6.AD.A5.E9.AA.A4.E4.B8.89.EF.BC.9A.E9.80.9A.E8.BF.87config.E6.8E.A5.E5.8F.A3.E6.B3.A8.E5.85.A5.E6.9D.83.E9.99.90.E9.AA.8C.E8.AF.81.E9.85.8D.E7.BD.AE

```js
{
  "url": "/mobile/order"
}
```


## Res
### Body

```js
{
  "nonceStr": "GWJbWYg3HW0WCHpP06fkzzgBDCCZkPcH",
  "timeStamp": "1438085476",
  "jsapi_ticket": "sM4AOVdWfPE4DxkXGEs8VJCg76XoJMQp4gES22N4SwLzuXj-eTebZyE984tMd1Y8doVztxb4z3w8sTPdFXFDKA",
  "url": "/mobile/order",
  "signature": "5170e213d1ea71c358d00c96be55576ec0078ce6"
}
```