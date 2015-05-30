# Reset Password

## Req
POST `/resetPwd`

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
  "code": "123456",
}
```

## Res
### Body
```js
HTTP/1.1 200 OK
```
