## Req

POST `/user/signup`

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
  "access_token": "1:+AABOCGhQ8uZTtNqa5uNbYtICCE8zPJp",
  "refresh_token": "1:tESymptHpXXPImUl0gp7DNAPItwu87iJ",
  "token_type": "Bearer",
  "expires_in": 3599
}
```


