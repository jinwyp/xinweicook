## Res

| Param            | Desc            |
|:--------         |:-----------------|
| message          | 错误信息       现在所有的错误都有文字错误描述，所有字段验证错误等其他 都以 “Field validation error” 字样开头   |
| validationStatus | 错误代码 专门用于前段的友好的错误显示           |
| _id              | 用于侦错.         |
| stack            | `development only` |

### 示例

```js
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "_id": "55590bad7428a36ffb293061",
  "message": "错误的请求"
  "validationStatus": 1111
}
```

## 目前已有的错误码, 请iOS和网页端协作更新，主要用于前段错误信息更人性化


```js
{
    user: {
        // todo: 第二第三位的1 是什么意思, sms独立出来??
        wrongMobile: 1110,
        wrongPassword: 1111,
        alreadyExist: 1112,
        notFound: 1113
    },
    order: {
        wrongMobile: 2110
    },
    sms: {
        wrongCode: 3110,
        expired: 3111,
        invalidCode: 3112,
        wrongType: 3113,
        tooManyTries: 3114,
        sendFailed: 3115,
        reachSendLimitation: 3116
    },
    dish: {
        outOfStock: 4110
    },
    coupon: {
        notStart: 5110,
        expired: 5111,
        used: 5112,
        outOfCount: 5113
    }
```

