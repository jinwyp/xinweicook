## Req

POST `/api/user/account/details`

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

#### 返回充值记录明细,等待支付宝确认

```js
{
  "__v": 0,
  "modifiedAt": "2015-08-26T10:00:40.234Z",
  "createdAt": "2015-08-26T10:00:40.234Z",
  "user": "55d30af82d861f987b5bd86d",
  "amount": 10,
  "_id": "55dd8e4871bf38ae72b14c9e",
  "isPaid": false,
  "name": {
    "zh": "在线充值",
    "en": "Online Recharge"
  },
  "isPlus": true
}
```
