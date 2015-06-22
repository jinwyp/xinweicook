## Req

POST `/orders`

Group `member`


| Name       | Type   | Desc       |
|:-----------|:-------|:-----------|
| grant_type | string | `password` |
| username   | string | 手机号     |
| password   | string | 密码       |

```js
{
    grant_type: "password",
    username: "18600000000",
    password: "123456"
}
```


## Res
### Body




[Orders](../order)