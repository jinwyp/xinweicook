## Req

POST `/orders`

Group `member`


| Name             | Type     | Desc                              |
|:-----------------|:---------|:----------------------------------|
| cookingType      | String   | "ready to cook" 或 "ready to eat"                  |
| clientFrom       | String   | "website" "ios" "android"                         |
| freight          | Number   | 运费                                               |
| coupon           | String   | 用户账号里面的优惠券 24位ID 5590d256103f46d9ac31e3ee   |
| promotionCode    | String   | 优惠码    |
| payment          | String   | 支付方式 alipay direct / wechat / paypal            |
| paymentUsedCash  | Boolean  | 货到付款 使用现金还是刷卡                              |
| deliveryDate     | String   | 预计到达日期 年月日  注意用双位数表达日期 2015-06-13      |
| deliveryTime     | String   | 预计到达时间 三个时间点 #10-12  #12-17 #17-20          |
| address          | Object   | 地址       |
|   -> geoLatitude   | Number   | 纬度       |
|   -> geoLongitude  | Number   | 经度       |
|   -> country       | String   | 国家       |
|   -> province      | String   | 省         |
|   -> city          | String   | 城市       |
|   -> district      | String   | 区         |
|   -> street        | String   | 街或路      |
|   -> address       | String   | 详细地址    |
|   -> contactPerson | String   | 联系人      |
|   -> mobile        | String   | 手机       |
|   -> remark        | String   | 备注       |
| dishList           | Array    | 主商品列表数组  |
|   -> dish          | String | 商品ID     |
|   -> number        | Number | 商品数量    |
|   -> subDish       | Array  | 子商品 例如 牛肉属性preferences 和 浇头topping  |
|   -> => dish       | String | 商品ID     |
|   -> => number     | Number | 商品数量    |







```js
{
    "cookingType" : "ready to cook",
    "clientFrom" : "ios",
    "credit" : 0,
    "freight" : 20,
    "coupon" : "5590d256103f46d9ac31e3ee",
    "promotionCode" : "xxxxxxx",

    "payment" : "alipay direct",
    "paymentUsedCash" : false,

    "deliveryDate" : "2015-06-13",
    "deliveryTime" : "10",


    "address" : {
        "geoLatitude" : 30,
        "geoLongitude" : 30,

        "country" : "",
        "province": "shanghai",
        "city": "shanghai",
        "district": "shanghai" ,
        "street" : "shanghai" ,
        "address": "xxxxx" ,

        "contactPerson": "wangyupeng" ,
        "mobile": "13564568304" ,
        "remark": "comment"
    },

    "dishList" : [
        {
            "dish": "558a602a3eba152266ff2b8c",
            "number": 1,
            "subDish" : [
                {
                    "dish": "5583b7faa2845dec35276b92",
                    "number": 1
                },
                {
                    "dish": "5583b7faa2845dec35276b95",
                    "number": 1
                },
                {
                    "dish": "5583b7faa2845dec35276b97",
                    "number": 2
                }
            ]
        },
        {
            "dish": "558a602a3eba152266ff2b8c",
            "number": 1,
            "subDish" : [
                {
                    "dish": "5583b7faa2845dec35276b92",
                    "number": 1
                },
                {
                    "dish": "5583b7faa2845dec35276b95",
                    "number": 1
                },
                {
                    "dish": "5583b7faa2845dec35276b97",
                    "number": 2
                }
            ]
        }
    ]
}
```


## Res
### Body




[Orders](../Order)