## Req
POST `/api/user/resetpassword`

### Body
| Name   | Type   | Desc   |
|:-------|:-------|:-------|
| mobile | string | 手机号 |
| pwd    | string | 密码   |
| code   | string | 验证码 |

```js
{
  "mobile": "18600000000",
  "pwd": "123456",
  "code": "841114",
}
```

## Res
### Body
```js
HTTP/1.1 200 OK
```
