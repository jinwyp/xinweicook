## Req

POST `/api/orders/delivery/time/eat/warehouse`

Group `member`


| Name             | Type     | Desc                              |
|:-----------------|:---------|:----------------------------------|
| _id              | String   | "1" 新味办公室 或 "2" 漕河泾   不传默认"1"     |





```js
{
  "_id" : "2"
}
```


## Res
### Body

便当 不同仓库返回不同 预计配送时间



```js
{
  "_id": 2,
  "name": "caohejing",
  "timeList": [
    {
      "hour": "2015-10-29 11:00 AM"
    },
    {
      "hour": "2015-10-29 11:30 AM"
    },
    {
      "hour": "2015-10-29 12:00 PM"
    },
    {
      "hour": "2015-10-29 12:30 PM"
    },
    {
      "hour": "2015-10-29 13:00 PM"
    },
    {
      "hour": "2015-10-29 13:30 PM"
    }
  ]
}
```
