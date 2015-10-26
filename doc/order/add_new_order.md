## Req

POST `/api/orders`

Group `member`


| Name             | Type     | Desc                              |
|:-----------------|:---------|:----------------------------------|
| cookingType      | String   | "ready to cook" 或 "ready to eat"                  |
| clientFrom       | String   |  website, mobileweb, ios, android, wechat(公众号支付)                   |
| freight          | Number   | 运费                                               |
| coupon           | String   | 用户账号里面的优惠券 24位ID 5590d256103f46d9ac31e3ee   |
| promotionCode    | String   | 优惠码  10位字符串  |
| usedAccountBalance| Boolean   | 是否使用余额支付 true / false  |
| payment          | String   | 支付方式 alipay direct / weixinpay / paypal  /cod 货到付款  / 余额 account balance(仅限余额可以全额支付订单的情况下，否则余额与支付宝联合支付请写alipay direct)     |
| paymentUsedCash  | Boolean  | 货到付款 使用现金还是刷卡                              |
| deliveryDateCook | String   | 用于 "ready to cook" 食材包 预计到达日期 年月日  注意用双位数表达日期 2015-06-13      |
| deliveryTimeCook | String   | 用于 "ready to cook" 食材包 预计到达时间 格式 小时:分钟 12:00  三个时间点 12:00 / 17:00 / 20:00         |
| deliveryDateEat  | String   | 用于 "ready to eat" 预计到达日期 年月日  注意用双位数表达日期 2015-06-13         |
| deliveryTimeEat  | String   | "ready to eat"  预计到达时间 格式 小时:分钟 12:00          |
| userComment      | String   | 订单备注        |
| addressId        | String   | 用户地址_ID, 24位ID 5590d256103f46d9ac31e3e  如果带有该参数,下面的地址信息会被忽略(不用传了),会直接使用该用户的地址ID的所有地址信息  |
| address          | Object   | 地址       |
|   -> geoLatitude   | Number   | 纬度       |
|   -> geoLongitude  | Number   | 经度       |
|   -> country       | String   | 国家       |
|   -> province      | String   | 省         |
|   -> city          | String   | 城市       |
|   -> district      | String   | 区         |
|   -> street        | String   | 街或路      |
|   -> street_number | String   | baidu map 的街道号      |
|   -> address       | String   | 详细地址    |
|   -> contactPerson | String   | 联系人      |
|   -> mobile        | String   | 手机       |
|   -> remark        | String   | 地址备注   |
|   -> distanceFrom  | Number   | 与新味办公司距离（米）      |
| dishList           | Array    | 主商品列表数组  |
|   -> dish          | String | 商品ID     |
|   -> number        | Number | 商品数量    |
|   -> remark        | String | 商品备注    |
|   -> subDish       | Array  | 子商品 例如 牛肉属性preferences 和 浇头topping  |
|   -> => dish       | String | 商品ID     |
|   -> => number     | Number | 商品数量    |


#### 注意 订单会拆分成子订单

当提交的订单只包含 “ready to cook” 或 "ready to eat" 菜品时，订单只生成一个订单， 而当提交的菜品即有“ready to cook” 或 "ready to eat"时，订单会生成三个订单，一个主订单（用于支付）和另外两个子订单（用于以后在用户中心的订单里面查询）。

订单生成后，只返回一个主订单，主订单的isSplitOrder属性为true, 主订单的childOrderList属性包括子订单的ID


#### 优惠码 优惠券 余额 计算

优惠券 和 优惠码 还有余额可以一起使用，先计算优惠券金额，剩余金额计算优惠码（如果优惠码是百分比折扣，则按照总金额减去优惠券的优惠金额 再乘以百分比折扣），此时如果总金额为0 则不再计算余额，进入支付环节，需要支付0.1元， 否则使用余额支付，如果剩余总金额可以完全用余额支付则不再需要在线支付。



```js
{
    "cookingType" : "ready to cook",
    "clientFrom" : "ios",
    "credit" : 0,
    "freight" : 20,
    "coupon" : "5590d256103f46d9ac31e3ee",
    "promotionCode" : "xxxxxxx",
    "usedAccountBalance" : false,

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