## Req

DELETE `/api/user/address/:_id`

Group `member`




DELETE `/api/user/address/5628a288ee6adc346dfb0043`




## Res
### Body

> 删除成功返回删除的地址对象 删除失败返回400


```js
{
  "_id": "562dea4903de0cf34e8310a0",
  "modifiedAt": "2015-10-26T08:54:33.158Z",
  "createdAt": "2015-10-26T08:54:33.158Z",
  "user": "55f7b37c81dc2fc37c588d9c",
  "geoLongitude": 116.3410850154413,
  "geoLatitude": 39.94414620822088,
  "distanceFrom": 10,
  "country": "china",
  "province": "北京",
  "city": "北京市",
  "district": "通州区",
  "street": "聚点串吧(动物园店)",
  "street_number": "510号",
  "address": "猴子山3号洞",
  "contactPerson": "孙悟空2",
  "mobile": "18629641521",
  "__v": 0,
  "isAvailableForEat": false,
  "sortOrder": 0,
  "isValid": false,
  "isDefault": false
}
```



[User](../User)