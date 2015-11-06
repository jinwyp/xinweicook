## Req

PUT `/api/user/address/:_id`

Group `member`


### Body
| Name              | Type   | Desc    |
|:-------           |:-------|:------- |
|  geoLatitude      | Number | 纬度     |
|  geoLongitude     | Number | 经度     |
|  coordType        | String | 坐标类型，可选参数，默认不填为bd09ll。允许的值为：bd09ll（百度经纬度坐标）、gcj02（国测局加密坐标）、wgs84（gps设备获取的坐标）。     |
|  country          | String | 国家     |
|  province         | String | 省       |
|  city             | String | 市       |
|  district         | String | 区       |
|  street           | String | 街道     |
|  street_number    | String | baidu map 的街道号      |
|  address          | String | 详细地        |
|  contactPerson    | String | 联系人        |
|  mobile           | String | 手机          |
|  isDefault        | Boolean| 默认地址 true 或 false     |
|  sortOrder        | Number | 显示顺序 默认0 |





PUT `/api/user/address/5628a288ee6adc346dfb0043`

```js
{
  "mobile": "18629641521",
  "contactPerson": "孙悟空22",
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
  "isDefault": true,
  "sortOrder": 0
}
```



## Res
### Body


```js
{
  "_id": "5628a288ee6adc346dfb0043",
  "modifiedAt": "2015-10-26T08:31:33.531Z",
  "createdAt": "2015-10-22T08:47:04.611Z",
  "user": "55f7b37c81dc2fc37c588d9c",
  "geoLongitude": 116.3410850154413,
  "geoLatitude": 39.94414620822088,
  "country": "china",
  "province": "北京",
  "city": "北京市",
  "district": "通州区",
  "street": "聚点串吧(动物园店)",
  "address": "猴子山3号洞",
  "contactPerson": "孙悟空22",
  "mobile": "18629641521",
  "__v": 0,
  "distanceFrom": 10,
  "street_number": "510号",
  "isAvailableForEat": false,
  "sortOrder": 0,
  "isValid": false,
  "isDefault": true
}
```

[User](../User)