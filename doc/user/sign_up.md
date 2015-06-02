## Req

POST `/signup`

### Body

| Name   | Type   | Desc   |
|:-------|:-------|:-------|
| mobile | string | 手机号 |
| pwd    | string | 密码   |
| code   | string | 验证码 |

```js
{
  "mobile": "18600000000",
  "pwd": "boo",
  "code": "123456"
}
```

## Res
### Body
```js
{
    "access_token": "2YotnFZFEjr1zCsicMWpAA",
    "refresh_token": "tGzv3JOkF0XG5Qx2TlKWIA",
    "token_type": "Bearer",
    "expires_in": 3600
}
```
