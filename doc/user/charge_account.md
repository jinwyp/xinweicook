## Req

POST `/user/account`

### Body

| Name       | Type   | Desc     |
|:-------    |:-------|:-------  |
| addAmount  | Number | 充值金额  |
| remark     | String | 备注     |


```js
{
  "addAmount": 10,
  "remark": "remark"
}
```

## Res
### Body
```js
{
  "modifiedAt": "2015-08-11T09:49:08.782Z",
  "createdAt": "2015-08-11T09:22:25.617Z",
  "user": "55c2d55edae7610b0557e93e",
  "__v": 0,
  "balance": 12
}
```
