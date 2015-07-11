## Req

POST `/user/device`

### Body

| Name        | Type   | Desc   |
|:-------     |:-------|:-------|
| deviceToken | String | iOS推送设备ID |


```js
{
  "deviceId": "18600000000"
}
```

## Res
### Body
```js
{
  "__v": 0,
  "modifiedAt": "2015-07-10T10:34:54.458Z",
  "createdAt": "2015-07-10T10:34:54.458Z",
  "deviceToken": "1234567",
  "_id": "559f9fce3fdd12fd8d8adc7d"
}
```
