## Req
POST `/sms`

### Body
| Name   | Type   | Desc                                         |
|:-------|:-------|:---------------------------------------------|
| mobile | string | 手机号                                       |
| type   | string | `verifyMobile`验证手机号, `resetPwd`重置密码 |

```js
{
  "mobile": "18600000000",
  "type": "verifyMobile"
}
```

## Res
### Body
> `development` 不会发送 `code`, 而是在 `body` 中返回 `code`

```js
HTTP/1.1 200 OK
{
  "code": 123456
}
```
