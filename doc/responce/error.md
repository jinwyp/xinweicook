# Error

## Res

| Param    | Desc            |
|:--------|:-----------------|
| message | 错误信息           |
| _id | 用于侦错. |
| stack | `development only` |

### 示例

```js
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "_id": "55590bad7428a36ffb293061",
  "message": "错误的请求"
}
```
