## Req

POST `/api/user/address/suggestion`

### Body

| Name              | Type   | Desc   |
|:-------           |:-------|:-------|
|  query            | String | 检索地址关键字     |
|  region           | String | 检索区域，省或市的名称, 如果取值为“全国”或某省份，则返回指定区域的POI。     |

> 全部为必填项

```js
{
  "query": "中山南二路",
  "region": "上海"
}
```

## Res
### Body
```js
[
  {
    "street_id": "a445df02f26a751cbca24066",
    "address": "中山南二路",
    "addressInfoBaidu": "上海市徐汇区",
    "lat": 31.200777,
    "lng": 121.476284
  },
  {
    "street_id": "45e8dcc9563c131025d2bba3",
    "address": "中山南二路船厂路",
    "addressInfoBaidu": "41路;104路;144路;734路;933路;大桥六线;隧道八线;万周专线",
    "lat": 31.194465,
    "lng": 121.466005
  },
  {
    "street_id": "d991e1168c316f541f38947f",
    "address": "中山南二路/天钥桥路(路口)",
    "addressInfoBaidu": "上海市徐汇区",
    "lat": 31.187031,
    "lng": 121.451076
  },
  {
    "street_id": "e4333bdb4bc3fcb6fbf0cb4b",
    "address": "天钥桥路中山南二路",
    "addressInfoBaidu": "56路;166路;301路;326路;342路;714路;733路;770路;864路;932路;徐闵夜宵专线",
    "lat": 31.186085,
    "lng": 121.451291
  },
  {
    "street_id": "1e5a391b9ab32e2e0482c243",
    "address": "中山南二路/小木桥路(路口)",
    "addressInfoBaidu": "上海市徐汇区",
    "lat": 31.196306,
    "lng": 121.469132
  },
  {
    "street_id": "7e62c35e5c47db39ae04573a",
    "address": "双峰路/中山南二路(路口)",
    "addressInfoBaidu": "上海市徐汇区",
    "lat": 31.189572,
    "lng": 121.454638
  },
  {
    "street_id": "3f826ed3305ff747d1f49e7f",
    "address": "中山南二路/大木桥路(路口)",
    "addressInfoBaidu": "上海市徐汇区",
    "lat": 31.198028,
    "lng": 121.471548
  },
  {
    "street_id": "1eeed5468fc0a4f3b4147fab",
    "address": "东安路/中山南二路(路口)",
    "addressInfoBaidu": "上海市徐汇区",
    "lat": 31.193233,
    "lng": 121.462782
  },
  {
    "street_id": "a933f3af82c5e0eaa80dd83c",
    "address": "东安路中山南二路",
    "addressInfoBaidu": "49路;301路",
    "lat": 31.19385,
    "lng": 121.462582
  },
  {
    "street_id": "7c394ed5195b3b898e77271f",
    "address": "中山南二路777弄",
    "addressInfoBaidu": "上海市徐汇区",
    "lat": 31.192051,
    "lng": 121.461905
  }
]
```
