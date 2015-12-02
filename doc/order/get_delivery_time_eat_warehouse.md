## Req

POST `/api/orders/delivery/time/eat/warehouse`

Group `member`


| Name             | Type     | Desc                              |
|:-----------------|:---------|:----------------------------------|
| _id              | String   | 仓库_id "56332187594b09af6e6c7dd2" 新味办公室 或 "56332196594b09af6e6c7dd7" 漕河泾   仓库_id或仓库代号至少有一个必传   |




```js
{
  "_id" : "56332187594b09af6e6c7dd2"
}
```



## Res
### Body

便当 不同仓库返回不同 预计配送时间



```js
{
  "_id": "56332196594b09af6e6c7dd7",
  "modifiedAt": "2015-10-30T08:22:30.097Z",
  "createdAt": "2015-10-30T08:22:30.097Z",
  "name": "caohejing1",
  "locationGeoLatitude": 0,
  "locationGeoLongitude": 0,
  "__v": 0,
  "isActivated": true,
  "displayName": {
    "zh": "漕河泾仓库",
    "en": "Caohejing warehouse"
  },
  "timeList": [
    {
      "hour": "2015-10-31 11:00 AM"
    },
    {
      "hour": "2015-10-31 11:30 AM"
    },
    {
      "hour": "2015-10-31 12:00 PM"
    },
    {
      "hour": "2015-10-31 12:30 PM"
    },
    {
      "hour": "2015-10-31 13:00 PM"
    },
    {
      "hour": "2015-10-31 13:30 PM"
    }
  ]
}
```
