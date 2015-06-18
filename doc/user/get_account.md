## Req

GET `/user`

Group `member`

## Res
### Body


> 返回的数据中 pwd 密码字段会排除掉

```js
{
  "_id": "5582903e4eb98f251a0478d4",
  "modifiedAt": "2015-06-18T09:32:46.692Z",
  "createdAt": "2015-06-18T09:32:46.692Z",
  "id": 1,
  "mobile": "18600000000",
  "__v": 0,
  "cart": [],
  "isPromoOn": true,
  "isSpam": false,
  "credit": 0,
  "loc": [],
  "addr": [],
  "group": "member"
}
```

[User](../User)