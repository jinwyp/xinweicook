## Req

GET `/api/user/account/details?skip=0&limit=200`

Group `member`

### GET Query params 参数

| Name         | Type   | Desc        |
|:-------      |:-------|:-------     |
| skip         | Number | 跳过记录数    |
| limit        | Number | 每页记录数    |



## Res
### Body

| Name     | Type   | Desc   |
|:-------  |:-------|:-------|
| name.zh  | String | 明细中文名称    |
| name.en  | String | 明细英文名称    |
| remark   | String | 备注        |
| amount   | Number | 金额        |
| isPlus   | Boolean | 是否为正, true 为充值 false 为花费   |



```js
[
  {
      "_id": "55cdb651b574327d408b8232",
      "modifiedAt": "2015-08-14T09:35:13.636Z",
      "createdAt": "2015-08-14T09:35:13.636Z",
      "user": "55cd6dca6374be9914827fb6",
      "amount": 500,
      "__v": 0,
      "name": {
        "zh": "在线充值",
        "en": "Online Recharge"
      },
      "isPlus": true
    }
]

```

[User](../User)