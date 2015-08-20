## Req

GET `/api/user/coupon/invitation/:invitationCode`

Group `member`

### GET Query params 参数

例如 `/api/user/coupon/invitation/AWDZNVZK`

| Name                   | Type   | Desc        |
|:-------                |:-------|:-------     |
| invitationCode         | String | 该用户发给朋友的邀请码    |


## Res
### Body



```js
{
  "_id": "55d452425a9bbacc2ad5ac25",
  "modifiedAt": "2015-08-19T09:59:20.729Z",
  "createdAt": "2015-08-19T09:54:10.115Z",
  "autoIncrementId": 10007,
  "mobile": "13564568304",
  "__v": 3,
  "invitationSendCode": "AWDZNVZK",
  "isUsedInvitationSendCode": true,
  "isSharedInvitationSendCode": true,
  "dishLikeList": [],
  "couponList": [
    "55d452425a9bbacc2ad5ac26",
    "55d452425a9bbacc2ad5ac27",
    "55d452645a9bbacc2ad5ac2b",
    "55d452645a9bbacc2ad5ac2c",
    "55d453785a9bbacc2ad5ac2f"
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