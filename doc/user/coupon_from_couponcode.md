## Req

GET `/api/user/coupon/code/:code`

Group `member`

例如 `/api/user/coupon/code/XWCOOK1234`

| Name                   | Type   | Desc        |
|:-------                |:-------|:-------     |
| code                   | String | 优惠券邀请码 10位    |




## Res
### Body





```js
{
  "_id": "55d452425a9bbacc2ad5ac25",
  "modifiedAt": "2015-08-19T09:54:44.526Z",
  "createdAt": "2015-08-19T09:54:10.115Z",
  "autoIncrementId": 10007,
  "mobile": "13564568304",
  "__v": 2,
  "invitationSendCode": "AWDZNVZK",
  "isUsedInvitationSendCode": false,
  "isSharedInvitationSendCode": true,
  "dishLikeList": [],
  "couponList": [
    "55d452425a9bbacc2ad5ac26",
    "55d452425a9bbacc2ad5ac27",
    "55d452645a9bbacc2ad5ac2b",
    "55d452645a9bbacc2ad5ac2c"
  ],
  "shoppingCart": [],
  "isPromoOn": true,
  "isSpam": false,
  "credit": 0,
  "address": [],
  "group": "member"
}

```

[User](../User)