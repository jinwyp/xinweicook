[The OAuth 2.0 Authorization Framework - Resource Owner Password Credentials Grant](https://tools.ietf.org/html/rfc6749#section-4.3)

## Req

POST `/api/user/token`

| Name        | Type   | Desc       |
|:----------- |:-------|:-----------|
| grant_type  | String | `password` |
| username    | String | 手机号     |
| password    | String | 密码       |
| deviceToken | String | iOS设备ID       |
| couponcode  | string | 送优惠券的兑换码 |

```js
{
    grant_type: "password",
    username: "18600000000",
    password: "123456"
}
```

## Res

| Name          | Type   | Desc |
|:---           |:---    |:---  |
| access_token  | string | Access Token |
| refresh_token | string | Refresh Token |
| token_type    | string | `Bearer` |
| expires_in    | number | 过期时间, 单位: 秒 |


```js
{
    "access_token": "2YotnFZFEjr1zCsicMWpAA",
    "refresh_token": "tGzv3JOkF0XG5Qx2TlKWIA",
    "token_type": "Bearer",
    "expires_in": 3600
}
```
