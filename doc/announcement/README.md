# Announcement 网站公告

```js

{
    title: zh:String, en:String # 标题
    description: zh:String, en:String # 内容 可空
    priority: Number # 公告优先级 重要程度 10 一般  20 重要
    clientFor : String  # 针对平台 all/ios/android/wechat/website/mobileweb 专属公告
    appVersion : String  # 针对平台 升级版本, 可以用来判断低于某版本显示公告
    isActivated : type: Boolean, default:false  # 是否启用
}
```





## 范例

```js
[
  {
    "_id": "5645ba288ed18a0e7cb53829",
    "modifiedAt": "2015-11-16T08:40:04.138Z",
    "createdAt": "2015-11-13T10:23:36.763Z",
    "appVersion": "1",
    "__v": 0,
    "clientFor": "all",
    "isActivated": true,
    "description": {
      "en": "iOS 升级 1.8 版本",
      "zh": "iOS 升级 1.8 版本"
    },
    "title": {
      "en": "公告test1",
      "zh": "公告test1"
    }
  }
]

```
