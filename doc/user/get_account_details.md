## Req

GET `/user/account/details?skip=0&limit=200`

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
| amount   | Number | 金额    |
| isPlus   | Boolean | 是否为正, true 为充值 false 为花费   |



```js
[
  {
    "_id": "55c9cb8daabba3897909ad58",
    "modifiedAt": "2015-08-11T10:16:45.527Z",
    "createdAt": "2015-08-11T10:16:45.527Z",
    "user": "55c2d55edae7610b0557e93e",
    "amount": 10,
    "__v": 0,
    "isPlus": true
  },
  {
    "_id": "55c9c514ae9a0b2f7260eee0",
    "modifiedAt": "2015-08-11T09:49:08.781Z",
    "createdAt": "2015-08-11T09:49:08.781Z",
    "user": "55c2d55edae7610b0557e93e",
    "amount": 2,
    "__v": 0,
    "isPlus": true
  }
]

```

[User](../User)