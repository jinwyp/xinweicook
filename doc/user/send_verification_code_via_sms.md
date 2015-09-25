## Req
POST `/api/user/sms`

### Body
| Name   | Type   | Desc                                         |
|:-------|:-------|:---------------------------------------------|
| mobile | string | 手机号                                       |
| type   | string | `signUp`注册 `verifyMobile`验证手机号, `resetPassword`重置密码 |
| geetest_challenge     | string | 极验 geetest 参数 |
| eetest_validatee      | string | 极验 geetest 参数 |
| geetest_seccode       | string | 极验 geetest 参数 |


```js
{
  "mobile": "13564568304",
  "type": "signUp",
  "geetest_challenge": "8f9cc50c273ec9d0833cb92255c61b53k4",
  "geetest_validate": "73aee1a506ffe6d6a4db12ecfd95aacf",
  "geetest_seccode": "73aee1a506ffe6d6a4db12ecfd95aacf|jordan"
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
