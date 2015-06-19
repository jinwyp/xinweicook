## Req
POST `/user/token`

Name          | Type   | Desc
:------------ | :----- | :--------------
grant_type    | string | `refresh_token`
refresh_token | string | refresh token

```js
{
  "grant_type": "refresh_token",
  "refresh_token": "tGzv3JOkF0XG5Qx2TlKWIA"
}
```

## Res

Name         | Type   | Desc
:----------- | :----- | :----------
access_token | string | token
token_type   | string | `Bearer`
expires_in   | number | 过期时间, 单位: 秒

```js
{
  "access_token": "1/fFBGRNJru1FQd44AzqT3Zg",
  "expires_in": 3600,
  "token_type": "Bearer"
}
```
