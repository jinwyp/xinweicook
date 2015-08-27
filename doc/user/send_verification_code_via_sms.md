## Req
POST `/api/user/sms`

### Body
| Name   | Type   | Desc                                         |
|:-------|:-------|:---------------------------------------------|
| mobile | string | 手机号                                       |
| type   | string | `signUp`注册 `verifyMobile`验证手机号, `resetPassword`重置密码 |

```js
{
  "mobile": "18600000000",
  "type": "signUp"
}
```

## Res
### Body
> `development` 开发环境不会发送 `code`, 而是在 `body` 中返回 `code`
> `production` 生产环境不会在 `body` 中返回 `code`, 而是返回状态码 200

```js
HTTP/1.1 200 OK
{
  "code": 123456
}
```
