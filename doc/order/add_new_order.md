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
| payment          | String   | 支付方式 alipay direct / weixinpay / paypal  /cod 货到付款          |
| paymentUsedCash  | Boolean  | 货到付款 使用现金还是刷卡                              |
| device_info      | String   | 用于微信支付 非必填 终端设备号(门店号或收银设备ID)，注意：PC网页或公众号内支付请传"WEB"                         |
| spbill_create_ip | String   | 用于微信支付 APP和网页支付提交用户端ip，Native支付填调用微信支付API的机器IP。                        |
| trade_type       | String   | 用于微信支付 取值如下：JSAPI，NATIVE，APP，WAP,详细说明见参数规定                          |
| openid           | String   | 用于微信支付 非必填 trade_type=JSAPI时，此参数必传，用户在商户appid下的唯一标识。下单前需要调用【网页授权获取用户信息】接口获取到用户的Openid                       |
| deliveryDateCook | String   | 用于 "ready to cook" 食材包 预计到达日期 年月日  注意用双位数表达日期 2015-06-13      |
| deliveryTimeCook | String   | 用于 "ready to cook" 食材包 预计到达时间 格式 小时:分钟 12:00  三个时间点 12:00 / 17:00 / 20:00         |
| deliveryDateEat  | String   | 用于 "ready to eat" 预计到达日期 年月日  注意用双位数表达日期 2015-06-13         |
| deliveryTimeEat  | String   | "ready to eat"  预计到达时间 格式 小时:分钟 12:00  三个时间点 12:00 / 17:00 / 20:00         |
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


#### 注意 订单会拆分成子订单

当提交的订单只包含 “ready to cook” 或 "ready to eat" 菜品时，订单只生成一个订单， 而当提交的菜品即有“ready to cook” 或 "ready to eat"时，订单会生成三个订单，一个主订单（用于支付）和另外两个子订单（用于以后在用户中心的订单里面查询）。

订单生成后，只返回一个主订单，主订单的isSplitOrder属性为true, 主订单的childOrderList属性包括子订单的ID



```js
{
    "cookingType" : "ready to cook",
    "clientFrom" : "ios",
    "credit" : 0,
    "freight" : 20,
    "coupon" : "5590d256103f46d9ac31e3ee",
    "promotionCode" : "xxxxxxx",

    "payment" : "weixinpay",
    "paymentUsedCash" : false,
    "spbill_create_ip" : "192.168.1.1",
    "trade_type" : "NATIVE",

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