## Req

GET `/api/user/messages`

Group `member`




## Res
### Body


| Name                  | Type     | Desc    |
|:-------               |:-------  |:------- |
| isViewd               | Boolean  | 是否阅读  |
| isPushMobile          | Boolean  | 是否用来推送iOS或Andorid 移动消息推送   |
| isPushSMS             | Boolean  | 是否发送短信推送   |
| isPushEmail           | Boolean  | 是否发送邮件提醒推送  |
| text                  | Object   | 推送文字   |
|   -> zh               | String   | 中文  |
|   -> en               | String   | 英文  |


```js
[
  {
    "_id": "55a180f54823918401f09689",
    "modifiedAt": "2015-07-11T20:47:49.571Z",
    "createdAt": "2015-07-11T20:47:49.571Z",
    "contentType": "orderAdd",
    "user": "559e28764fa0f11b1d26eacc",
    "__v": 0,
    "isViewed": false,
    "isPushMobile": true,
    "isPushSMS": false,
    "isPushEmail": false
  },
  {
    "_id": "55a18227198f2c4803d08f69",
    "modifiedAt": "2015-07-11T20:52:55.620Z",
    "createdAt": "2015-07-11T20:52:55.620Z",
    "contentType": "orderAdd",
    "user": "559e28764fa0f11b1d26eacc",
    "__v": 0,
    "isViewed": false,
    "text": {
      "zh": "您的订单已经生成，请及时付款",
      "en": "Order have been submitted, please pay order as soon as possible"
    },
    "isPushMobile": true,
    "isPushSMS": false,
    "isPushEmail": false
  }
]

```

