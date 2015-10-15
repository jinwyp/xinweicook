## Req

PUT `/api/courier/trace`

Group `courier`


### Body
| Name                  | Type   | Desc    |
|:-------               |:-------|:------- |
| geoLatitude           | Number | 纬度     |
| geoLongitude          | Number | 经度     |
| distanceFrom          | Number | 与新味办公司距离（米）      |
| timeLeft              | Number | 与新味办公司 时间  （单位？？分钟）   |
| speed                 | Number | 快递员行驶速度 （单位？？ 米/小时）      |
| isBack                | Boolean |  如果是 true 表明已回到办公室      |



```js
{
  "geoLongitude": 116.3410850154413,
  "geoLatitude": 39.94414620822088,
  "distanceFrom": "30",
  "timeLeft": "20",
  "speed": "10"
}
```



## Res
### Body



```js
{
  "status": "200"
}
```

[User](../User)