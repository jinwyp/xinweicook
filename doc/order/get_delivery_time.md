## Req

POST `/orders/delivery/time`

Group `member`


| Name             | Type     | Desc                              |
|:-----------------|:---------|:----------------------------------|
| cookingType      | String   | "ready to cook" 或 "ready to eat"       |
| isCityShanghai   | Boolean  | 是否在上海 true / false                  |
| isInRange3KM     | Boolean  | 是否在公司附近3公里内 true / false        |





```js
{
  "cookingType": "ready to eat",
  "isCityShanghai": true,
  "isInRange3KM": true
}
```


## Res
### Body

食材包和既食包 预计配送时间返回的格式不同 请注意


食材包

```js
[
  {
    "day": "2015-07-13",
    "segment": [
      {
        "name": "12",
        "text": "10:00 - 12:00 AM",
        "status": false
      },
      {
        "name": "17",
        "text": "12:00 - 17:00 PM",
        "status": true
      },
      {
        "name": "20",
        "text": "17:00 - 20:00 PM",
        "status": true
      }
    ]
  },
  {
    "day": "2015-07-14",
    "segment": [
      {
        "name": "12",
        "text": "10:00 - 12:00 AM",
        "status": true
      },
      {
        "name": "17",
        "text": "12:00 - 17:00 PM",
        "status": true
      },
      {
        "name": "20",
        "text": "17:00 - 20:00 PM",
        "status": true
      }
    ]
  },
  {
    "day": "2015-07-15",
    "segment": [
      {
        "name": "12",
        "text": "10:00 - 12:00 AM",
        "status": true
      },
      {
        "name": "17",
        "text": "12:00 - 17:00 PM",
        "status": true
      },
      {
        "name": "20",
        "text": "17:00 - 20:00 PM",
        "status": true
      }
    ]
  },
  {
    "day": "2015-07-16",
    "segment": [
      {
        "name": "12",
        "text": "10:00 - 12:00 AM",
        "status": true
      },
      {
        "name": "17",
        "text": "12:00 - 17:00 PM",
        "status": true
      },
      {
        "name": "20",
        "text": "17:00 - 20:00 PM",
        "status": true
      }
    ]
  },
  {
    "day": "2015-07-17",
    "segment": [
      {
        "name": "12",
        "text": "10:00 - 12:00 AM",
        "status": true
      },
      {
        "name": "17",
        "text": "12:00 - 17:00 PM",
        "status": true
      },
      {
        "name": "20",
        "text": "17:00 - 20:00 PM",
        "status": true
      }
    ]
  }
]
```

既食包

```js
[
  {
    "hour": "2015-07-10 18:00:19 PM"
  },
  {
    "hour": "2015-07-10 18:30:19 PM"
  },
  {
    "hour": "2015-07-10 19:00:19 PM"
  },
  {
    "hour": "2015-07-10 19:30:19 PM"
  },
  {
    "hour": "2015-07-10 20:00:19 PM"
  }
]
```
