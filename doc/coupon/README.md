# Coupon 优惠券与优惠码

### 优惠券和优惠码 类型


| Name             | Type     | Desc                              |
|:-----------------|:---------|:----------------------------------|
| couponType       | String   | 目前有四种 优惠码金额优惠 promocode  优惠码百分比优惠 promocodepercentage  和 优惠券 coupon 和 充值卡码 accountchargecode  |



#### 优惠券和优惠码并不相同

+ 优惠券 是直接发放到用户账户，与用户绑定

+ 优惠码 是不与用户绑定，可以在订单页面直接使用优惠码进行订单金额打折扣

+ 优惠码 有两种 一种是直接金额的折扣，一种是按照订单金额的百分比折扣

+ 优惠码可以转化为优惠券 用户可以在用户中心直接输入优惠码后进行绑定，绑定后该优惠码只能由该用户使用，无法转移给其他用户





> code 字段为优惠码

## Coupon 范例
```js

{
  "_id": "55e52bf800a7baee082662f5",
  "modifiedAt": "2015-09-01T07:44:09.263Z",
  "createdAt": "2015-09-01T04:39:20.752Z",
  "couponType": "promocodepercentage",
  "price": 70,
  "code": "123456789a",
  "__v": 0,
  "usedUserList": [],
  "isUsedCount": 8,
  "isUsed": false,
  "endDate": "2015-11-30T04:27:01.000Z",
  "startDate": "2015-09-01T04:27:01.000Z",
  "usedCountLimitOfOneUser": 0,
  "usedTime": 0,
  "priceLimit": 10,
  "description": {
    "zh": "",
    "en": ""
  },
  "name": {
    "zh": "优惠码百分比1",
    "en": "优惠码百分比1"
  }
}

```
