## Req

POST `/user/shoppingcart`

Group `member`


### Body
| Name                  | Type   | Desc    |
|:-------               |:-------|:------- |
| shoppingCart          | Array  | 商品数组  |
|   -> dish             | String | 商品ID   |
|   -> number           | Number | 商品数量  |
|   -> subDish          | Array  | 子商品 例如 牛肉属性preferences 和 浇头topping  |
|   -> => dish          | String | 商品ID   |
|   -> => number        | Number | 商品数量  |



```js
{
    "shoppingCart" : [
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


> 返回的数据中 pwd 密码字段会排除掉

```js
{
  "_id": "5582903e4eb98f251a0478d4",
  "modifiedAt": "2015-06-18T09:32:46.692Z",
  "createdAt": "2015-06-18T09:32:46.692Z",
  "id": 1,
  "mobile": "18600000000",
  "__v": 0,
  "cart": [],
  "isPromoOn": true,
  "isSpam": false,
  "credit": 0,
  "loc": [],
  "addr": [],
  "group": "member"
}
```

[User](../User)