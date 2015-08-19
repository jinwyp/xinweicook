## Req

POST `/api/user/device`

### Body

| Name        | Type   | Desc   |
|:-------     |:-------|:-------|
| deviceToken | String | iOS推送设备ID |


```js
{
  "deviceToken": "9036e1f50687c90d386cd8f672b2080f60315a1940fbf2a8ccb0af786dff5831"
}
```

## Res
### Body
```js
{
  "__v": 0,
  "modifiedAt": "2015-07-10T10:34:54.458Z",
  "createdAt": "2015-07-10T10:34:54.458Z",
  "deviceToken": "9036e1f50687c90d386cd8f672b2080f60315a1940fbf2a8ccb0af786dff5831",
  "_id": "559f9fce3fdd12fd8d8adc7d"
}
```
